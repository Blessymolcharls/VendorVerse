const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables (to get MONGO_URI)
dotenv.config();

// Load all our Models
const Vendor = require('./models/Vendor');
const Buyer = require('./models/Buyer');
const Product = require('./models/Product');
const Rating = require('./models/Rating');
const Tag = require('./models/Tag');

// Connect to the local MongoDB database
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ MongoDB connected successfully.');
    console.log('🔄 Creating tables (collections)...');

    try {
      // In MongoDB via Mongoose, calling .createCollection() forces the database
      // to immediately create the table even if we are not inserting any data yet.
      await Vendor.createCollection();
      console.log('  ✔️  "vendors" table created.');

      await Buyer.createCollection();
      console.log('  ✔️  "buyers" table created.');

      await Product.createCollection();
      console.log('  ✔️  "products" table created.');

      await Rating.createCollection();
      console.log('  ✔️  "ratings" table created.');

      await Tag.createCollection();
      console.log('  ✔️  "tags" table created.');

      console.log('\n🎉 All tables have been successfully created in the database!');
    } catch (error) {
      console.error('\n❌ Error creating collections:', error);
    } finally {
      // Close the connection when done
      mongoose.disconnect();
      process.exit(0);
    }
  })
  .catch((err) => {
    console.error('\n❌ Could not connect to MongoDB. Have you installed MongoDB Community Server?');
    console.error(err.message);
    process.exit(1);
  });
