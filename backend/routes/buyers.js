const express = require('express');
const router = express.Router();
const Buyer = require('../models/Buyer');
const { protect, buyerOnly } = require('../middleware/auth');

// @route  GET /api/buyers/me  - Own profile
router.get('/me', protect, buyerOnly, async (req, res) => {
  try {
    const buyer = await Buyer.findById(req.user.id).select('-password');
    res.json({ success: true, buyer });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route  PUT /api/buyers/me  - Update profile
router.put('/me', protect, buyerOnly, async (req, res) => {
  try {
    const updates = ['name', 'phone', 'address', 'avatar'];
    const buyer = await Buyer.findById(req.user.id);
    updates.forEach((f) => { if (req.body[f] !== undefined) buyer[f] = req.body[f]; });
    await buyer.save();
    const result = buyer.toObject();
    delete result.password;
    res.json({ success: true, buyer: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
