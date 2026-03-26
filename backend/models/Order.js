const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
    name: { type: String, required: true },
    unitPrice: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
    lineTotal: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'Buyer', required: true },
    items: { type: [OrderItemSchema], required: true },
    totals: {
      subtotal: { type: Number, required: true, min: 0 },
      tax: { type: Number, default: 0, min: 0 },
      shipping: { type: Number, default: 0, min: 0 },
      grandTotal: { type: Number, required: true, min: 0 },
    },
    shippingAddress: { type: String, default: '' },
    payment: {
      method: {
        type: String,
        enum: ['COD', 'MOCK_UPI', 'MOCK_CARD'],
        required: true,
      },
      status: {
        type: String,
        enum: ['pending', 'success', 'failed'],
        default: 'pending',
      },
      transactionId: { type: String, default: '' },
      paidAt: { type: Date },
      message: { type: String, default: '' },
    },
    orderStatus: {
      type: String,
      enum: ['placed', 'payment_failed'],
      default: 'placed',
    },
    isMockPayment: { type: Boolean, default: true },
  },
  { timestamps: true }
);

OrderSchema.index({ buyer: 1, createdAt: -1 });
OrderSchema.index({ 'items.vendor': 1, createdAt: -1 });
OrderSchema.index({ 'payment.transactionId': 1 });

module.exports = mongoose.model('Order', OrderSchema);