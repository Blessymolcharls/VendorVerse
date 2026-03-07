const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// Load the Models
const Vendor = require('./models/Vendor');
const Buyer = require('./models/Buyer');
const Product = require('./models/Product');
const Rating = require('./models/Rating');
const Tag = require('./models/Tag');

async function checkData() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB database.\n');

    const buyers = await Buyer.find({});
    console.log('--- BUYERS TABLE ---');
    console.log(buyers.length > 0 ? buyers : '(Table is empty)');

    const vendors = await Vendor.find({});
    console.log('\n--- VENDORS TABLE ---');
    console.log(vendors.length > 0 ? vendors : '(Table is empty)');

    const products = await Product.find({});
    console.log('\n--- PRODUCTS TABLE ---');
    console.log(products.length > 0 ? products : '(Table is empty)');

    const ratings = await Rating.find({});
    console.log('\n--- RATINGS TABLE ---');
    console.log(ratings.length > 0 ? ratings : '(Table is empty)');

    const tags = await Tag.find({});
    console.log('\n--- TAGS TABLE ---');
    console.log(tags.length > 0 ? tags : '(Table is empty)');

  } catch (error) {
    console.error('❌ Error reading database:', error);
  } finally {
    mongoose.disconnect();
    process.exit(0);
  }
}

checkData();
