const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, required: true },
    senderModel: { type: String, required: true, enum: ['Buyer', 'Vendor'] },
    recipient: { type: mongoose.Schema.Types.ObjectId, required: true },
    recipientModel: { type: String, required: true, enum: ['Buyer', 'Vendor'] },
    content: { type: String, required: true, trim: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Message', MessageSchema);
