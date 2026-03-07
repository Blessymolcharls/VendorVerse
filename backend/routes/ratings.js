const express = require('express');
const router = express.Router();
const Rating = require('../models/Rating');
const Vendor = require('../models/Vendor');
const { protect, buyerOnly } = require('../middleware/auth');

// Helper: recalculate vendor average rating
const recalculateVendorRating = async (vendorId) => {
  const result = await Rating.aggregate([
    { $match: { vendor: vendorId } },
    { $group: { _id: '$vendor', avgScore: { $avg: '$score' }, count: { $sum: 1 } } },
  ]);
  if (result.length > 0) {
    await Vendor.findByIdAndUpdate(vendorId, {
      averageRating: Math.round(result[0].avgScore * 10) / 10,
      totalRatings: result[0].count,
    });
  }
};

// @route  GET /api/ratings/vendor/:vendorId  - All ratings for a vendor
router.get('/vendor/:vendorId', async (req, res) => {
  try {
    const ratings = await Rating.find({ vendor: req.params.vendorId })
      .populate('buyer', 'name avatar')
      .sort({ createdAt: -1 });
    res.json({ success: true, ratings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route  POST /api/ratings  - Submit or update a rating (buyer only)
router.post('/', protect, buyerOnly, async (req, res) => {
  try {
    const { vendorId, score, review, reliability, communication, delivery } = req.body;

    if (!vendorId || !score) {
      return res.status(400).json({ success: false, message: 'vendorId and score are required' });
    }

    const vendor = await Vendor.findById(vendorId);
    if (!vendor) return res.status(404).json({ success: false, message: 'Vendor not found' });

    // Upsert: one rating per buyer per vendor
    const rating = await Rating.findOneAndUpdate(
      { vendor: vendorId, buyer: req.user.id },
      { score, review, reliability, communication, delivery },
      { new: true, upsert: true, runValidators: true }
    );

    await recalculateVendorRating(vendor._id);
    await rating.populate('buyer', 'name avatar');

    res.status(201).json({ success: true, rating });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route  DELETE /api/ratings/:id  - Delete own rating (buyer only)
router.delete('/:id', protect, buyerOnly, async (req, res) => {
  try {
    const rating = await Rating.findOneAndDelete({ _id: req.params.id, buyer: req.user.id });
    if (!rating) return res.status(404).json({ success: false, message: 'Rating not found' });
    await recalculateVendorRating(rating.vendor);
    res.json({ success: true, message: 'Rating deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
