const mongoose = require('mongoose');
const Product = require('./models/Product');
const Tag = require('./models/Tag');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/vendorverse';

mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

// Curated list of extremely high-quality, permanent, non-rate-limited Unsplash CDN image URLs by Category
const imageBanks = {
  "Electronics": [
    "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=2071&auto=format&fit=crop", // Macbook
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1780&auto=format&fit=crop", // iPhone
    "https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=1964&auto=format&fit=crop", // Apple Watch
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop", // Headphones
    "https://images.unsplash.com/photo-1526406915894-7bcd65f60845?q=80&w=1924&auto=format&fit=crop", // Controller
    "https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=1984&auto=format&fit=crop", // Earbuds
    "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=2000&auto=format&fit=crop", // Setup
  ],
  "Clothing & Fashion": [
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1780&auto=format&fit=crop", // T-shirt
    "https://images.unsplash.com/photo-1542272604-669a233f7923?q=80&w=1784&auto=format&fit=crop", // Jacket
    "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2070&auto=format&fit=crop", // Simple fit
    "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1936&auto=format&fit=crop", // Jacket blue
    "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1964&auto=format&fit=crop", // Shirts
    "https://images.unsplash.com/photo-1434389678232-02c388650a25?q=80&w=2062&auto=format&fit=crop", // Hoodie
    "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=2012&auto=format&fit=crop", // Shoes
    "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=1964&auto=format&fit=crop" // Green shoes
  ],
  "Home & Kitchen": [
    "https://images.unsplash.com/photo-1556910103-1c02745a872f?q=80&w=2070&auto=format&fit=crop", // Kitchen counter
    "https://images.unsplash.com/photo-1584839145620-802ba0640fdb?q=80&w=1780&auto=format&fit=crop", // Pans
    "https://images.unsplash.com/photo-1512152272829-e3139592d56f?q=80&w=2070&auto=format&fit=crop", // Food prep
    "https://images.unsplash.com/photo-1585515320310-259814833e62?q=80&w=1887&auto=format&fit=crop", // Coffee
    "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=1784&auto=format&fit=crop", // Coffee maker
    "https://images.unsplash.com/photo-1581783898377-1c85bf937427?q=80&w=1780&auto=format&fit=crop", // Microwave
    "https://images.unsplash.com/photo-1522444195799-478538b28823?q=80&w=1780&auto=format&fit=crop", // Couch
    "https://images.unsplash.com/photo-1505693314120-0d443867891c?q=80&w=2071&auto=format&fit=crop"  // Living room
  ],
  "Sports & Outdoors": [
    "https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=2070&auto=format&fit=crop", // Running shoes
    "https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?q=80&w=2071&auto=format&fit=crop", // Dumbbells
    "https://images.unsplash.com/photo-1522858547144-b032d9c077fe?q=80&w=2070&auto=format&fit=crop", // Fitness
    "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop", // Gym
    "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=2071&auto=format&fit=crop", // Yoga map
    "https://images.unsplash.com/photo-1526509867162-5b0c0d1b4b33?q=80&w=2070&auto=format&fit=crop", // Weight plate
    "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=1920&auto=format&fit=crop", // Tennis
    "https://images.unsplash.com/photo-1514416432279-50fac261c7dd?q=80&w=2071&auto=format&fit=crop"  // Soccer ball
  ],
  "Books": [
    "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=1780&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1495640388908-05fa85288e61?q=80&w=1887&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=2030&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=2098&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1511108690759-009324a50344?q=80&w=1780&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1592659762303-90081d37b2bc?q=80&w=2072&auto=format&fit=crop"
  ],
  "Groceries & Fresh": [
    "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1974&auto=format&fit=crop", // Grocery bags
    "https://images.unsplash.com/photo-1588964895597-cfccd6e2a009?q=80&w=1974&auto=format&fit=crop", // Vegetables
    "https://images.unsplash.com/photo-1628102491629-77858ab215b2?q=80&w=2070&auto=format&fit=crop", // Fruit basket
    "https://images.unsplash.com/photo-1573246123716-6b1782bfc499?q=80&w=1965&auto=format&fit=crop", // Apples
    "https://images.unsplash.com/photo-1596647416348-18eaf396fdfd?q=80&w=1780&auto=format&fit=crop", // Olive Oil
    "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=1780&auto=format&fit=crop", // Spices
    "https://images.unsplash.com/photo-1582294158485-be891f948bf6?q=80&w=2075&auto=format&fit=crop"  // Eggs
  ],
  "Default": [
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop", // Headphones generic
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop", // Watch generic
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop"  // Shoe generic
  ]
};

async function assignImages() {
  try {
    // Populate the tags first to map the categories
    const products = await Product.find({}).populate('tags');
    console.log(`Found ${products.length} products to assign true curated images...`);

    let count = 0;
    
    for (const p of products) {
      let bank = imageBanks["Default"];
      
      // Determine what category bank to use based on tags
      if (p.tags && p.tags.length > 0) {
        const tagName = p.tags[0].name;
        if (imageBanks[tagName]) {
          bank = imageBanks[tagName];
        }
      }

      // Pick a random image from that guaranteed bank
      const randomIdx = Math.floor(Math.random() * bank.length);
      const assignImageUrl = bank[randomIdx];

      p.images = [assignImageUrl];
      await p.save();
      count++;
      
      if (count % 10 === 0) console.log(`Assigned static images to ${count} products...`);
    }
    
    console.log(`✅ Extracted APIs. Successfully assigned permanent static curated Unsplash images to all ${products.length} products!`);
  } catch (err) {
    console.error('Error attaching static mappings:', err);
  } finally {
    mongoose.disconnect();
  }
}

assignImages();
