const express = require('express');
const router = express.Router();
const Vendor = require('../models/Vendor');
const Buyer = require('../models/Buyer');
const { generateToken, protect } = require('../middleware/auth');

// @route  POST /api/auth/vendor/register
router.post('/vendor/register', async (req, res) => {
  try {
    const { businessName, email, password, phone, description, address } = req.body;
    const exists = await Vendor.findOne({ email });
    if (exists) return res.status(400).json({ success: false, message: 'Email already registered' });

    const vendor = await Vendor.create({ businessName, email, password, phone, description, address });
    const token = generateToken(vendor._id, 'vendor');

    res.status(201).json({
      success: true,
      token,
      user: { id: vendor._id, businessName: vendor.businessName, email: vendor.email, role: 'vendor' },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route  POST /api/auth/vendor/login
router.post('/vendor/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const vendor = await Vendor.findOne({ email });
    if (!vendor || !(await vendor.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(vendor._id, 'vendor');
    res.json({
      success: true,
      token,
      user: { id: vendor._id, businessName: vendor.businessName, email: vendor.email, role: 'vendor' },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route  POST /api/auth/buyer/register
router.post('/buyer/register', async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;
    const exists = await Buyer.findOne({ email });
    if (exists) return res.status(400).json({ success: false, message: 'Email already registered' });

    const buyer = await Buyer.create({ name, email, password, phone, address });
    const token = generateToken(buyer._id, 'buyer');

    res.status(201).json({
      success: true,
      token,
      user: { id: buyer._id, name: buyer.name, email: buyer.email, role: 'buyer' },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route  POST /api/auth/buyer/login
router.post('/buyer/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const buyer = await Buyer.findOne({ email });
    if (!buyer || !(await buyer.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(buyer._id, 'buyer');
    res.json({
      success: true,
      token,
      user: { id: buyer._id, name: buyer.name, email: buyer.email, role: 'buyer' },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route  GET /api/auth/me
// @desc   Get current logged in user (Buyer or Vendor)
router.get('/me', protect, async (req, res) => {
  try {
    let user;
    if (req.user.role === 'buyer') {
      user = await Buyer.findById(req.user.id).select('-password');
    } else {
      user = await Vendor.findById(req.user.id).select('-password');
    }

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, user: { ...user._doc, role: req.user.role } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route  PUT /api/auth/profile
// @desc   Update user profile and addresses
router.put('/profile', protect, async (req, res) => {
  try {
    let user;
    if (req.user.role === 'buyer') {
      user = await Buyer.findById(req.user.id);
    } else {
      user = await Vendor.findById(req.user.id);
    }

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const { name, businessName, phone, addresses, description } = req.body;

    // Update common fields
    if (phone !== undefined) user.phone = phone;
    if (addresses !== undefined) user.addresses = addresses;

    // Update specific fields
    if (req.user.role === 'buyer' && name !== undefined) {
      user.name = name;
    } else if (req.user.role === 'vendor') {
      if (businessName !== undefined) user.businessName = businessName;
      if (description !== undefined) user.description = description;
    }

    await user.save();
    
    // Return user without password
    const updatedUser = user.toObject();
    delete updatedUser.password;

    res.json({ success: true, user: { ...updatedUser, role: req.user.role } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
