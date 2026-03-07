const express = require('express');
const router = express.Router();
const Vendor = require('../models/Vendor');
const Buyer = require('../models/Buyer');
const { generateToken } = require('../middleware/auth');

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

module.exports = router;
