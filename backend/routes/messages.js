const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const User = require('../models/Buyer'); // just for reference, not actually needed if we don't strict populate
const Vendor = require('../models/Vendor');
const { protect } = require('../middleware/auth');

// @route  POST /api/messages  - Send a message
router.post('/', protect, async (req, res) => {
  try {
    const { recipientId, recipientModel, content } = req.body;
    
    if (!content || !content.trim()) {
       return res.status(400).json({ success: false, message: 'Message content cannot be empty' });
    }

    const senderModel = req.user.role === 'buyer' ? 'Buyer' : 'Vendor';

    const message = await Message.create({
      sender: req.user.id,
      senderModel,
      recipient: recipientId,
      recipientModel,
      content
    });

    res.status(201).json({ success: true, message });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route  GET /api/messages/:otherUserId  - Get conversation history with another user
router.get('/:otherUserId', protect, async (req, res) => {
  try {
    const myId = req.user.id;
    const { otherUserId } = req.params;

    const messages = await Message.find({
      $or: [
        { sender: myId, recipient: otherUserId },
        { sender: otherUserId, recipient: myId }
      ]
    }).sort({ createdAt: 1 }); // Oldest first

    // Mark messages as read if recipient is me
    await Message.updateMany(
      { sender: otherUserId, recipient: myId, read: false },
      { $set: { read: true } }
    );

    res.json({ success: true, messages });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @route  GET /api/messages/conversations/me - Get a list of all distinct conversations
router.get('/conversations/me', protect, async (req, res) => {
  try {
    const myId = req.user.id;
    
    // Find all messages involving the current user
    const messages = await Message.find({
        $or: [{ sender: myId }, { recipient: myId }]
    }).sort({ createdAt: -1 });

    // Extract unique conversation partners
    const partnersMap = new Map();
    
    for (const msg of messages) {
        // Determine who the other person is
        let partnerId, partnerModel;
        if (msg.sender.toString() === myId) {
            partnerId = msg.recipient.toString();
            partnerModel = msg.recipientModel;
        } else {
            partnerId = msg.sender.toString();
            partnerModel = msg.senderModel;
        }

        if (!partnersMap.has(partnerId)) {
            // Fetch partner details efficiently inside loop or outside depending on size.
            // For MVP, we'll fetch them individually since conversations lists are usually short
            let partnerInfo = null;
            if (partnerModel === 'Buyer') {
                const b = await User.findById(partnerId).select('name avatar');
                if (b) partnerInfo = { _id: b._id, name: b.name, avatar: b.avatar, model: 'Buyer' };
            } else {
                const v = await Vendor.findById(partnerId).select('businessName logo');
                if (v) partnerInfo = { _id: v._id, name: v.businessName, avatar: v.logo, model: 'Vendor' };
            }

            if (partnerInfo) {
                // Count unread from this partner
                const unread = await Message.countDocuments({ sender: partnerId, recipient: myId, read: false });
                
                partnersMap.set(partnerId, {
                    partner: partnerInfo,
                    lastMessage: msg.content,
                    updatedAt: msg.createdAt,
                    unread
                });
            }
        }
    }

    const conversations = Array.from(partnersMap.values());
    res.json({ success: true, conversations });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
