const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/vendorverse';

mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

async function fixImages() {
  try {
    const products = await Product.find({});
    console.log(`Found ${products.length} products to update.`);
    let count = 0;
    
    for (const p of products) {
      // Create a deterministic seed based on the string value of the product ID or name
      const seedName = p.name ? encodeURIComponent(p.name.replace(/[^a-zA-Z0-9]/g, '')) : p._id.toString();
      const newImage = `https://picsum.photos/seed/${seedName}/600/600`;
      
      p.images = [newImage];
      await p.save();
      count++;
      
      if (count % 10 === 0) console.log(`Updated ${count} products...`);
    }
    
    console.log(`Successfully updated all ${products.length} products with seeded picsum images!`);
  } catch (err) {
    console.error('Error updating images:', err);
  } finally {
    mongoose.disconnect();
  }
}

fixImages();
