const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const BuyerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    phone: { type: String, default: '' },
    addresses: [{ type: String }],
    avatar: { type: String, default: '' },
    recentSearches: [{ type: String }],
  },
  { timestamps: true }
);

BuyerSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

BuyerSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Buyer', BuyerSchema);
