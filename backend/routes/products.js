const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect, vendorOnly } = require('../middleware/auth');

// @route  GET /api/products  - Browse all products (public, filter by tags/search)
router.get('/', async (req, res) => {
  try {
    const { search, tags, vendor, page = 1, limit = 12 } = req.query;
    const filter = { isAvailable: true };

    if (vendor) filter.vendor = vendor;

    if (tags) {
      const tagList = tags.split(',').map((t) => t.trim());
      filter.tags = { $in: tagList };
    }

    if (search) {
      filter.$text = { $search: search };
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
