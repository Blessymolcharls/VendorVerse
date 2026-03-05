const mongoose = require('mongoose');

const RatingSchema = new mongoose.Schema(
  {
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'Buyer', required: true },
    score: { type: Number, required: true, min: 1, max: 5 },
    review: { type: String, default: '' },
    // Reliability dimensions
    reliability: { type: Number, min: 1, max: 5 },
    communication: { type: Number, min: 1, max: 5 },
    delivery: { type: Number, min: 1, max: 5 },
  },
  { timestamps: true }
);

// One rating per buyer per vendor
RatingSchema.index({ vendor: 1, buyer: 1 }, { unique: true });

module.exports = mongoose.model('Rating', RatingSchema);
