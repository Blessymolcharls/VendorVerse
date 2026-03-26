const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { protect, buyerOnly } = require('../middleware/auth');
const Product = require('../models/Product');
const Order = require('../models/Order');

const allowedMethods = new Set(['COD', 'MOCK_UPI', 'MOCK_CARD']);

// @route  POST /api/payments/mock-checkout - Create dummy payment + order
router.post('/mock-checkout', protect, buyerOnly, async (req, res) => {
  try {
    const { items = [], paymentMethod = 'COD', shippingAddress = '', simulateFailure = false } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart items are required' });
    }

    if (!allowedMethods.has(paymentMethod)) {
      return res.status(400).json({ success: false, message: 'Invalid payment method' });
    }

    const normalizedItems = items
      .map((item) => ({ productId: item.productId, quantity: Number(item.quantity || 0) }))
      .filter((item) => mongoose.Types.ObjectId.isValid(item.productId) && item.quantity > 0);

    if (normalizedItems.length === 0) {
      return res.status(400).json({ success: false, message: 'No valid cart items found' });
    }

    const productIds = normalizedItems.map((item) => item.productId);
    const products = await Product.find({ _id: { $in: productIds }, isAvailable: true }).select(
      'name price vendor stock'
    );
    const productMap = new Map(products.map((product) => [String(product._id), product]));

    const orderItems = [];
    for (const item of normalizedItems) {
      const product = productMap.get(String(item.productId));
      if (!product) continue;

      const safeQty = Math.min(item.quantity, Math.max(product.stock || 0, 1));
      const lineTotal = Number((product.price * safeQty).toFixed(2));

      orderItems.push({
        product: product._id,
        vendor: product.vendor,
        name: product.name,
        unitPrice: product.price,
        quantity: safeQty,
        lineTotal,
      });
    }

    if (orderItems.length === 0) {
      return res.status(400).json({ success: false, message: 'No purchasable products found in cart' });
    }

    const subtotal = Number(orderItems.reduce((sum, item) => sum + item.lineTotal, 0).toFixed(2));
    const tax = 0;
    const shipping = 0;
    const grandTotal = Number((subtotal + tax + shipping).toFixed(2));

    const paymentSucceeded = !simulateFailure;
    const transactionId = `mock_txn_${Date.now()}`;

    const order = await Order.create({
      buyer: req.user.id,
      items: orderItems,
      totals: { subtotal, tax, shipping, grandTotal },
      shippingAddress,
      payment: {
        method: paymentMethod,
        status: paymentSucceeded ? 'success' : 'failed',
        transactionId,
        paidAt: paymentSucceeded ? new Date() : undefined,
        message: paymentSucceeded
          ? 'Dummy payment processed successfully'
          : 'Dummy payment failed (simulated)',
      },
      orderStatus: paymentSucceeded ? 'placed' : 'payment_failed',
      isMockPayment: true,
    });

    res.status(201).json({
      success: paymentSucceeded,
      status: paymentSucceeded ? 'success' : 'failed',
      message: paymentSucceeded ? 'Dummy payment successful' : 'Dummy payment failed',
      transactionId,
      orderId: order._id,
      amount: grandTotal,
      method: paymentMethod,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route  GET /api/payments/my-orders - Get buyer order history
router.get('/my-orders', protect, buyerOnly, async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user.id })
      .populate('items.product', 'name images')
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;