const mongoose = require('mongoose');

const TagSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, lowercase: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    category: { type: String, default: 'general' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Tag', TagSchema);
