const jwt = require('jsonwebtoken');
const Vendor = require('../models/Vendor');
const Buyer = require('../models/Buyer');

// Protect routes - accepts both vendor and buyer tokens
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role }

    if (decoded.role === 'vendor') {
      req.vendor = await Vendor.findById(decoded.id).select('-password');
    } else if (decoded.role === 'buyer') {
      req.buyer = await Buyer.findById(decoded.id).select('-password');
    }

    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Token is not valid' });
  }
};

// Only vendors
const vendorOnly = (req, res, next) => {
  if (req.user && req.user.role === 'vendor') return next();
  return res.status(403).json({ success: false, message: 'Vendor access only' });
};

// Only buyers
const buyerOnly = (req, res, next) => {
  if (req.user && req.user.role === 'buyer') return next();
  return res.status(403).json({ success: false, message: 'Buyer access only' });
};

const generateToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

module.exports = { protect, vendorOnly, buyerOnly, generateToken };
