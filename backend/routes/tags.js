const express = require('express');
const router = express.Router();
const Tag = require('../models/Tag');
const { protect, vendorOnly } = require('../middleware/auth');

// @route  GET /api/tags  - All tags (public)
router.get('/', async (req, res) => {
  try {
    const tags = await Tag.find().sort({ name: 1 });
    res.json({ success: true, tags });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route  POST /api/tags  - Create tag (vendor only)
router.post('/', protect, vendorOnly, async (req, res) => {
  try {
    const { name, category } = req.body;
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    const existing = await Tag.findOne({ slug });
    if (existing) return res.json({ success: true, tag: existing });

    const tag = await Tag.create({ name, slug, category });
    res.status(201).json({ success: true, tag });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
