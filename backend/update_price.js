const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/vendorverse';

mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

async function updatePrices() {
  try {
    const products = await Product.find({});
    console.log(`Found ${products.length} products to update price to INR.`);
    
    let count = 0;
    for (const p of products) {
      if (p.price < 500) { // arbitrary threshold to check if it's currently in USD instead of INR
        p.price = Math.round(p.price * 83);
        await p.save();
        count++;
      }
    }
    
    console.log(`✅ Successfully updated ${count} product prices to INR (Multiplied by 83)!`);
  } catch (err) {
    console.error('Error updating prices to INR:', err);
  } finally {
    mongoose.disconnect();
  }
}

updatePrices();
