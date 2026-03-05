const express = require('express');
const router = express.Router();
const Vendor = require('../models/Vendor');
const Product = require('../models/Product');
const Rating = require('../models/Rating');
const { protect, vendorOnly } = require('../middleware/auth');

// @route  GET /api/vendors  - List all vendors (public)
router.get('/', async (req, res) => {
  try {
    const vendors = await Vendor.find({ isActive: true })
      .select('-password')
      .sort({ averageRating: -1 });
    res.json({ success: true, vendors });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route  GET /api/vendors/:id  - Vendor profile (public)
router.get('/:id', async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id).select('-password');
    if (!vendor) return res.status(404).json({ success: false, message: 'Vendor not found' });

    const products = await Product.find({ vendor: vendor._id, isAvailable: true })
      .populate('tags', 'name slug')
      .sort({ createdAt: -1 });

    const ratings = await Rating.find({ vendor: vendor._id })
      .populate('buyer', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({ success: true, vendor, products, ratings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route  GET /api/vendors/me/profile  - Get own profile (vendor)
router.get('/me/profile', protect, vendorOnly, async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.user.id).select('-password');
    res.json({ success: true, vendor });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route  PUT /api/vendors/me/profile  - Update own profile (vendor)
router.put('/me/profile', protect, vendorOnly, async (req, res) => {
  try {
    const updates = ['businessName', 'phone', 'description', 'address', 'logo'];
    const vendor = await Vendor.findById(req.user.id);
    updates.forEach((f) => { if (req.body[f] !== undefined) vendor[f] = req.body[f]; });
    await vendor.save();
    const result = vendor.toObject();
    delete result.password;
    res.json({ success: true, vendor: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
