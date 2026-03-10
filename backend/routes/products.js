const express = require('express');
const router = express.Router();
const multer = require('multer');
const Product = require('../models/Product');
const Buyer = require('../models/Buyer');
const Tag = require('../models/Tag');
const { protect, vendorOnly, optionalAuth } = require('../middleware/auth');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// @route  GET /api/products  - Browse all products (public, filter by tags/search)
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { search, tags, vendor, page = 1, limit = 12 } = req.query;
    const filter = { isAvailable: true };

    if (vendor) filter.vendor = vendor;

    if (tags) {
      const tagList = tags.split(',').map((t) => t.trim().toLowerCase());
      const foundTags = await Tag.find({ name: { $in: tagList } });
      const tagIds = foundTags.map(t => t._id);
      filter.tags = { $in: tagIds };
    }

    if (search) {
      filter.$text = { $search: search };
      
      // Log search for buyers
      if (req.user && req.user.role === 'buyer') {
        const buyer = await Buyer.findById(req.user.id);
        if (buyer) {
          // Keep only the last 10 searches to avoid bloat
          buyer.recentSearches.push(search.trim());
          if (buyer.recentSearches.length > 10) buyer.recentSearches.shift();
          await buyer.save();
        }
      }
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .populate('vendor', 'businessName averageRating logo')
      .populate('tags', 'name slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({ success: true, total, page: Number(page), products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route  POST /api/products/search-by-image - Mock image search
router.post('/search-by-image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image uploaded' });
    }

    // Mock logic: randomly select up to 8 products from the database to simulate "matches"
    // For a real app, this is where we'd call an ML/Vision API with req.file.buffer
    const products = await Product.aggregate([
      { $match: { isAvailable: true } },
      { $sample: { size: 8 } }
    ]);

    // Populate vendor and tags
    const populatedProducts = await Product.populate(products, [
      { path: 'vendor', select: 'businessName averageRating logo' },
      { path: 'tags', select: 'name slug' }
    ]);
    
    // Delay slightly to simulate processing time
    setTimeout(() => {
      res.json({ success: true, products: populatedProducts, message: 'Mock image search successful' });
    }, 1500);

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route  GET /api/products/recommendations - Buyer recommendations
router.get('/recommendations', protect, async (req, res) => {
  try {
    if (req.user.role !== 'buyer') {
      return res.status(403).json({ success: false, message: 'Only buyers get recommendations' });
    }

    const buyer = await Buyer.findById(req.user.id);
    if (!buyer || !buyer.recentSearches || buyer.recentSearches.length === 0) {
      return res.json({ success: true, products: [] });
    }

    // Build a compound search string from their recent searches
    const combinedSearchStr = [...new Set(buyer.recentSearches)].join(' ');
    
    // Find products matching the search terms, limited to a small sample
    const products = await Product.find({ 
      isAvailable: true,
      $text: { $search: combinedSearchStr }
    })
    .populate('vendor', 'businessName averageRating logo')
    .limit(8);

    res.json({ success: true, products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route  GET /api/products/:id  - Single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('vendor', 'businessName averageRating logo description address phone')
      .populate('tags', 'name slug');

    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route  POST /api/products  - Add product (vendor only)
router.post('/', protect, vendorOnly, async (req, res) => {
  try {
    const { name, description, price, stock, images, tags, unit, minOrderQty } = req.body;
    const product = await Product.create({
      name,
      description,
      price,
      stock,
      images,
      tags,
      unit,
      minOrderQty,
      vendor: req.user.id,
    });

    await product.populate('tags', 'name slug');
    res.status(201).json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route  PUT /api/products/:id  - Edit product (vendor only, own product)
router.put('/:id', protect, vendorOnly, async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, vendor: req.user.id });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found or not yours' });

    const fields = ['name', 'description', 'price', 'stock', 'images', 'tags', 'unit', 'minOrderQty', 'isAvailable'];
    fields.forEach((f) => { if (req.body[f] !== undefined) product[f] = req.body[f]; });

    await product.save();
    await product.populate('tags', 'name slug');
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route  DELETE /api/products/:id  - Delete product (vendor only, own product)
router.delete('/:id', protect, vendorOnly, async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ _id: req.params.id, vendor: req.user.id });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found or not yours' });
    res.json({ success: true, message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route  GET /api/products/vendor/me  - Vendor's own products
router.get('/vendor/me', protect, vendorOnly, async (req, res) => {
  try {
    const products = await Product.find({ vendor: req.user.id })
      .populate('tags', 'name slug')
      .sort({ createdAt: -1 });
    res.json({ success: true, products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
