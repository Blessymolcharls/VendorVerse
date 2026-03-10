const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// Load the Models
const Vendor = require('./models/Vendor');
const Buyer = require('./models/Buyer');
const Product = require('./models/Product');
const Rating = require('./models/Rating');
const Tag = require('./models/Tag');

async function clearDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB database.\n');

    console.log('🗑️ Deleting all records...');
    
    await Buyer.deleteMany({});
    console.log(' - Cleared Buyers');
    
    await Vendor.deleteMany({});
    console.log(' - Cleared Vendors');
    
    await Product.deleteMany({});
    console.log(' - Cleared Products');
    
    await Rating.deleteMany({});
    console.log(' - Cleared Ratings');
    
    await Tag.deleteMany({});
    console.log(' - Cleared Tags');

    console.log('\n✅ All data cleared successfully!');

  } catch (error) {
    console.error('❌ Error clearing database:', error);
  } finally {
    mongoose.disconnect();
    process.exit(0);
  }
}

clearDatabase();
