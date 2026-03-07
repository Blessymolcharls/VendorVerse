const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, default: 0, min: 0 },
    images: [{ type: String }],
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
    unit: { type: String, default: 'piece' },
    minOrderQty: { type: Number, default: 1 },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Full-text search index
ProductSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Product', ProductSchema);
