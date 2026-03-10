const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Vendor = require('./models/Vendor');
const Product = require('./models/Product');
const Tag = require('./models/Tag');
const bcrypt = require('bcryptjs');

dotenv.config();

const vendorsData = [
  {
    businessName: "Appario Retail Private Ltd",
    name: "Appario Retail",
    email: "appario@amazon.in",
    password: "password123",
    description: "Amazon's premier seller for top-tier electronics, smartphones, and accessories.",
    phone: "1800-3000-9009",
    address: "Amazon India Fulfillment Center, BLR",
    genre: "Electronics"
  },
  {
    businessName: "SuperComNet",
    name: "SuperComNet Flipkart",
    email: "supercomnet@flipkart.com",
    password: "password123",
    description: "Flipkart Assured vendor providing the best deals on laptops and home appliances.",
    phone: "1800-202-9898",
    address: "Flipkart Warehouse, HYD",
    genre: "Electronics"
  },
  {
    businessName: "Myntra Direct Fashions",
    name: "Myntra Originals",
    email: "direct@myntra.com",
    password: "password123",
    description: "Trend-first fashion covering top national and international apparel brands.",
    phone: "1800-419-3500",
    address: "Myntra Fashion Hub, MUM",
    genre: "Clothing"
  },
  {
    businessName: "Cloudtail India Home",
    name: "Cloudtail Basics",
    email: "home@cloudtail.in",
    password: "password123",
    description: "Your one-stop destination for kitchen, dining, and premium home decor.",
    phone: "1800-111-2222",
    address: "Pune Distribution Park, MAH",
    genre: "Home"
  },
  {
    businessName: "RetailNet Sports",
    name: "RetailNet",
    email: "sports@retailnet.com",
    password: "password123",
    description: "Official distributor for leading athletic brands and outdoors equipment.",
    phone: "1800-333-4444",
    address: "Delhi NCR Sports Logistics",
    genre: "Sports"
  },
  {
    businessName: "Crossword Book Retail",
    name: "Crossword Books",
    email: "sales@crossword.in",
    password: "password123",
    description: "India's leading bookstore bringing you bestsellers, manga, and academic texts.",
    phone: "1800-555-6666",
    address: "Mumbai Central Book Depot",
    genre: "Books"
  },
  {
    businessName: "Blinkit Fresh Farms",
    name: "Blinkit Grocery",
    email: "fresh@blinkit.com",
    password: "password123",
    description: "10-minute delivery pioneers offering farm-fresh produce and daily staples.",
    phone: "1800-777-8888",
    address: "Gurgaon Dark Store 42",
    genre: "Food"
  }
];

const tagsUsed = ["electronics", "clothing", "home", "sports", "books", "food"];

// Genuine product references from major e-commerce platforms
const realProducts = [
  // Appario / SuperComNet (Electronics)
  { v: "Appario Retail Private Ltd", name: "Apple iPhone 15 Pro (128 GB) - Natural Titanium", desc: "Forged in titanium and featuring the groundbreaking A17 Pro chip.", price: 1199.00, img: "https://images.unsplash.com/photo-1696446701796-da61225697cc?w=800&q=80", tag: "electronics" },
  { v: "Appario Retail Private Ltd", name: "Sony WH-1000XM5 Wireless Noise Canceling Headphones", desc: "Industry-leading noise canceling with two processors controlling 8 microphones.", price: 348.00, img: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&q=80", tag: "electronics" },
  { v: "SuperComNet", name: "Samsung Galaxy S24 Ultra 5G AI Smartphone", desc: "Welcome to the era of mobile AI. With Galaxy S24 Ultra in your hands.", price: 1299.99, img: "https://images.unsplash.com/photo-1707015525547-0e6fb11a8a25?w=800&q=80", tag: "electronics" },
  { v: "SuperComNet", name: "MacBook Air 13-inch M3 Chip (8GB RAM, 256GB SSD)", desc: "Supercharged by M3. The 13-inch MacBook Air is strikingly thin.", price: 1099.00, img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80", tag: "electronics" },
  { v: "Appario Retail Private Ltd", name: "Sony PlayStation 5 Console (Disc Edition)", desc: "Experience lightning-fast loading with an ultra-high speed SSD.", price: 499.00, img: "https://images.unsplash.com/photo-1606813907291-d8ecdea18ce6?w=800&q=80", tag: "electronics" },
  { v: "Appario Retail Private Ltd", name: "Apple AirPods Pro (2nd Gen)", desc: "Active Noise Cancellation reduces unwanted background noise.", price: 249.00, img: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&q=80", tag: "electronics" },
  { v: "SuperComNet", name: "Dell XPS 15 Laptop (Intel i9, 32GB RAM)", desc: "High-performance laptop for creators featuring a stunning 4K InfinityEdge display.", price: 2499.00, img: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&q=80", tag: "electronics" },
  { v: "Appario Retail Private Ltd", name: "LG C3 Series 65-Inch Class OLED Evo TV", desc: "Powered by the a9 AI Processor Gen6, experience self-lit OLED pixels.", price: 1696.00, img: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&q=80", tag: "electronics" },
  { v: "SuperComNet", name: "NVIDIA GeForce RTX 4090 Founders Edition", desc: "The ultimate GeForce GPU. It brings an enormous leap in performance.", price: 1599.00, img: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&q=80", tag: "electronics" },
  { v: "Appario Retail Private Ltd", name: "Samsung 49-Inch Odyssey G9 Gaming Monitor", desc: "Curve your revolution with 1000R curvature and 240Hz refresh rate.", price: 1299.99, img: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80", tag: "electronics" },
  { v: "SuperComNet", name: "Logitech MX Master 3S Wireless Mouse", desc: "Remastered for Mac. Features an 8000 DPI track-on-glass sensor.", price: 99.99, img: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80", tag: "electronics" },
  { v: "Appario Retail Private Ltd", name: "Canon EOS R5 Full-Frame Mirrorless Camera", desc: "Stunning 45 megapixel resolution and 8K video capture.", price: 3899.00, img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80", tag: "electronics" },
  { v: "SuperComNet", name: "Bose QuietComfort 45 Bluetooth Wireless Headphones", desc: "The first noise cancelling headphones are back with quiet, lightweight materials.", price: 329.00, img: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80", tag: "electronics" },
  { v: "Appario Retail Private Ltd", name: "Apple Watch Series 9 (GPS, 45mm)", desc: "A robust health and fitness companion with the all-new S9 SiP.", price: 429.00, img: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&q=80", tag: "electronics" },
  { v: "SuperComNet", name: "GoPro HERO12 Black Action Camera", desc: "Incredible image quality, even better HyperSmooth video stabilization.", price: 399.00, img: "https://images.unsplash.com/photo-1564466809058-bf4114d55352?w=800&q=80", tag: "electronics" },
  { v: "Appario Retail Private Ltd", name: "Samsung T7 Shield 2TB Portable SSD", desc: "Rugged durability and fast performance on the go.", price: 159.99, img: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&q=80", tag: "electronics" },

  // Myntra Direct (Clothing)
  { v: "Myntra Direct Fashions", name: "Levi's Men's 501 Original Fit Jeans", desc: "The original straight fit jean. All-American style.", price: 69.50, img: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80", tag: "clothing" },
  { v: "Myntra Direct Fashions", name: "Nike Sportswear Club Fleece Pullover Hoodie", desc: "A closet staple, combining classic style with the soft comfort of fleece.", price: 55.00, img: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80", tag: "clothing" },
  { v: "Myntra Direct Fashions", name: "H&M Women's Oversized Cotton Shirt", desc: "Long-sleeved shirt in airy, woven cotton fabric.", price: 29.99, img: "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=800&q=80", tag: "clothing" },
  { v: "Myntra Direct Fashions", name: "Adidas Originals Stan Smith Sneakers", desc: "The legendary Stan Smith shoes have been undeniably iconic.", price: 90.00, img: "https://images.unsplash.com/photo-1620152432296-b09e25e11043?w=800&q=80", tag: "clothing" },
  { v: "Myntra Direct Fashions", name: "Patagonia Men's Better Sweater Fleece Jacket", desc: "A warm, low-bulk full-zip jacket made of soft fleece.", price: 139.00, img: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&q=80", tag: "clothing" },
  { v: "Myntra Direct Fashions", name: "Zara Women's Tailored Double Breasted Blazer", desc: "Blazer featuring a lapel collar and long sleeves with padded shoulders.", price: 89.90, img: "https://images.unsplash.com/photo-1591369822096-11f26a5cd5f2?w=800&q=80", tag: "clothing" },
  { v: "Myntra Direct Fashions", name: "Nike Air Force 1 '07", desc: "The radiance lives on in the Nike Air Force 1 '07, the b-ball icon that puts a fresh spin.", price: 110.00, img: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80", tag: "clothing" },
  { v: "Myntra Direct Fashions", name: "Calvin Klein Men's Cotton Classics Boxer Briefs", desc: "Multipack of breathable, classic fit cotton boxer briefs.", price: 45.00, img: "https://images.unsplash.com/photo-1588691880436-829dce4a2d48?w=800&q=80", tag: "clothing" },
  { v: "Myntra Direct Fashions", name: "The North Face Women's Never Stop Leggings", desc: "Designed for all-day comfort, perfect for errands or the gym.", price: 75.00, img: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&q=80", tag: "clothing" },
  { v: "Myntra Direct Fashions", name: "Vans Old Skool Classic Skate Shoes", desc: "The Vans classic skate shoe and first to bare the iconic sidestripe.", price: 65.00, img: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&q=80", tag: "clothing" },
  { v: "Myntra Direct Fashions", name: "Carhartt Men's Knit Cuffed Beanie", desc: "Warm and comfortable, this beanie handles cold weather with ease.", price: 19.99, img: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=800&q=80", tag: "clothing" },
  { v: "Myntra Direct Fashions", name: "Ray-Ban Classic Wayfarer Sunglasses", desc: "The most recognizable style in the history of sunglasses.", price: 163.00, img: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80", tag: "clothing" },

  // Cloudtail India (Home)
  { v: "Cloudtail India Home", name: "Nespresso VertuoPlus Coffee and Espresso Maker", desc: "Brews 4 different cup sizes at the touch of a button.", price: 159.00, img: "https://images.unsplash.com/photo-1517701550927-30cfcb64db42?w=800&q=80", tag: "home" },
  { v: "Cloudtail India Home", name: "Dyson V8 Absolute Cordless Vacuum Cooler", desc: "Engineered for everyday, quick cleaning. Strong suction.", price: 399.99, img: "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800&q=80", tag: "home" },
  { v: "Cloudtail India Home", name: "Le Creuset Enameled Cast Iron Dutch Oven", desc: "The iconic Le Creuset Dutch oven is indispensable in the kitchens of home cooks.", price: 359.95, img: "https://images.unsplash.com/photo-1584990347449-a6ebbed05f32?w=800&q=80", tag: "home" },
  { v: "Cloudtail India Home", name: "Philips Hue Smart Bulb Starter Kit", desc: "Automate your lighting experience with Philips Hue.", price: 119.99, img: "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?w=800&q=80", tag: "home" },
  { v: "Cloudtail India Home", name: "KitchenAid Artisan Series 5-Quart Stand Mixer", desc: "Choose from over 20 different colors to match your kitchen design.", price: 449.99, img: "https://images.unsplash.com/photo-1593504049359-74330189a345?w=800&q=80", tag: "home" },
  { v: "Cloudtail India Home", name: "Vitamix 5200 Blender Professional-Grade", desc: "The size and shape of the classic 64-ounce container is ideal for blending medium to large batches.", price: 479.95, img: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=800&q=80", tag: "home" },
  { v: "Cloudtail India Home", name: "iRobot Roomba j7+ Self-Emptying Robot Vacuum", desc: "The j7+ identifies obstacles and avoids hazards like pet waste.", price: 799.00, img: "https://images.unsplash.com/photo-1589923188900-85dae523342b?w=800&q=80", tag: "home" },
  { v: "Cloudtail India Home", name: "Breville Barista Express Espresso Machine", desc: "Dose control grinding delivers the right amount of freshly ground coffee directly into the portafilter.", price: 749.95, img: "https://images.unsplash.com/photo-1552089123-2d26226fc2b7?w=800&q=80", tag: "home" },
  { v: "Cloudtail India Home", name: "Casper Sleep Element Mattress (Queen)", desc: "A perfect balance of softness and support with pressure-relieving foam.", price: 595.00, img: "https://images.unsplash.com/photo-1505693314120-0d443867891c?w=800&q=80", tag: "home" },
  { v: "Cloudtail India Home", name: "Ninja Air Fryer AF101 (4 Quart)", desc: "Now enjoy guilt-free food. Air fry with up to 75% less fat than traditional frying methods.", price: 99.99, img: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=800&q=80", tag: "home" },

  // RetailNet (Sports)
  { v: "RetailNet Sports", name: "Wilson Evolution Indoor Game Basketball", desc: "The #1 indoor basketball in America.", price: 79.95, img: "https://images.unsplash.com/photo-1519861531473-9200262188bf?w=800&q=80", tag: "sports" },
  { v: "RetailNet Sports", name: "Bowflex SelectTech 552 Adjustable Dumbbells", desc: "Adjusts from 5 to 52.5 lbs.", price: 429.00, img: "https://images.unsplash.com/photo-1638361718012-32b509f6eeb6?w=800&q=80", tag: "sports" },
  { v: "RetailNet Sports", name: "YETI Tundra 45 Hard Cooler", desc: "Combines versatility with durability.", price: 325.00, img: "https://images.unsplash.com/photo-1621319088667-285641fbcf93?w=800&q=80", tag: "sports" },
  { v: "RetailNet Sports", name: "Fitbit Charge 6 Fitness Tracker", desc: "Built-in GPS, heart rate on equipment.", price: 159.95, img: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b0?w=800&q=80", tag: "sports" },
  { v: "RetailNet Sports", name: "Hydro Flask Wide Mouth Water Bottle (32 oz)", desc: "TempShield insulation eliminates condensation and keeps beverages cold up to 24 hours.", price: 44.95, img: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80", tag: "sports" },
  { v: "RetailNet Sports", name: "Titleist Pro V1 Golf Balls (Dozen)", desc: "The #1 ball in golf featuring a softer cast urethane elastomer cover system.", price: 54.99, img: "https://images.unsplash.com/photo-1587329310686-91414b8e3cb7?w=800&q=80", tag: "sports" },
  { v: "RetailNet Sports", name: "Gaiam Yoga Mat Premium Print Extra Thick", desc: "Extra-thick 6mm mat protects joints without compromising support or stability.", price: 34.98, img: "https://images.unsplash.com/photo-1601925260368-ae2f83cfecb7?w=800&q=80", tag: "sports" },
  { v: "RetailNet Sports", name: "Garmin Forerunner 245 Music GPS Running Smartwatch", desc: "Sync with music streaming services, such as Spotify, to easily store and play your favorite songs right from your watch.", price: 349.99, img: "https://images.unsplash.com/photo-1508685096489-7fc5f53364b3?w=800&q=80", tag: "sports" },
  { v: "RetailNet Sports", name: "Theragun PRO Handheld Massage Gun", desc: "Deep tissue percussive therapy with professional-grade performance and smart app integration.", price: 599.00, img: "https://images.unsplash.com/photo-1554286694-8ab347395ba7?w=800&q=80", tag: "sports" },

  // Crossword Books
  { v: "Crossword Book Retail", name: "The Psychology of Money by Morgan Housel", desc: "Timeless lessons on wealth, greed, and happiness.", price: 18.00, img: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=800&q=80", tag: "books" },
  { v: "Crossword Book Retail", name: "Dune by Frank Herbert (50th Anniversary Ed.)", desc: "A stunning blend of adventure and mysticism.", price: 14.99, img: "https://images.unsplash.com/photo-1614583224978-f05cea51a089?w=800&q=80", tag: "books" },
  { v: "Crossword Book Retail", name: "Atomic Habits by James Clear", desc: "A proven framework for improving--every day.", price: 11.98, img: "https://images.unsplash.com/photo-1589998059171-989d887df446?w=800&q=80", tag: "books" },
  { v: "Crossword Book Retail", name: "Sapiens: A Brief History of Humankind by Yuval Noah Harari", desc: "Destroys our comfortable narratives and reveals what we really are.", price: 24.99, img: "https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=800&q=80", tag: "books" },
  { v: "Crossword Book Retail", name: "1984 by George Orwell", desc: "Among the seminal texts of the 20th century, Nineteen Eighty-Four is a rare work that grows more haunting as its futuristic purgatory becomes more real.", price: 10.99, img: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80", tag: "books" },
  { v: "Crossword Book Retail", name: "Thinking, Fast and Slow by Daniel Kahneman", desc: "The phenomenal New York Times Bestseller.", price: 16.00, img: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80", tag: "books" },
  { v: "Crossword Book Retail", name: "Project Hail Mary by Andy Weir", desc: "A lone astronaut must save the earth from disaster in this incredible new science-based thriller.", price: 15.00, img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80", tag: "books" },
  { v: "Crossword Book Retail", name: "The Alchemist by Paulo Coelho", desc: "Paulo Coelho's masterpiece tells the mystical story of Santiago, an Andalusian shepherd boy who yearns to travel in search of a worldly treasure.", price: 12.50, img: "https://images.unsplash.com/photo-1522881113591-b54f84c4ee43?w=800&q=80", tag: "books" },
  { v: "Crossword Book Retail", name: "Clean Code: A Handbook of Agile Software Craftsmanship", desc: "Even bad code can function. But if code isn't clean, it can bring a development organization to its knees.", price: 42.00, img: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800&q=80", tag: "books" },
  
  // Blinkit Fresh Farms (Food)
  { v: "Blinkit Fresh Farms", name: "Farm Fresh Hass Avocados (Pack of 4)", desc: "Rich, creamy, and packed with nutrients.", price: 6.99, img: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=800&q=80", tag: "food" },
  { v: "Blinkit Fresh Farms", name: "Lavazza Super Crema Whole Bean Coffee Blend", desc: "Mild and creamy medium espresso roast.", price: 21.50, img: "https://images.unsplash.com/photo-1559525839-b184a4d698c7?w=800&q=80", tag: "food" },
  { v: "Blinkit Fresh Farms", name: "Toblerone Swiss Milk Chocolate w/ Honey & Almond", desc: "Distinctive triangular chocolate bar made in Switzerland.", price: 12.00, img: "https://images.unsplash.com/photo-1548883354-7622d03aca27?w=800&q=80", tag: "food" },
  { v: "Blinkit Fresh Farms", name: "Oatly Original Oat Milk 64oz", desc: "100% plant-based, vegan, dairy-free milk alternative.", price: 5.49, img: "https://images.unsplash.com/photo-1563805042-7684c8a9e9cb?w=800&q=80", tag: "food" },
  { v: "Blinkit Fresh Farms", name: "Kirkland Signature Organic Extra Virgin Olive Oil 2L", desc: "First cold pressed, expertly extracted.", price: 22.99, img: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&q=80", tag: "food" },
  { v: "Blinkit Fresh Farms", name: "Barilla Classic Blue Box Pasta Spaghetti (Pack of 8)", desc: "Italy's #1 brand of pasta. Perfectly al dente.", price: 14.50, img: "https://images.unsplash.com/photo-1612869408272-d5cb3fb58e65?w=800&q=80", tag: "food" },
  { v: "Blinkit Fresh Farms", name: "Lindt EXCELLENCE 85% Cocoa Dark Chocolate", desc: "Experience the intense flavor of 85% cocoa dark chocolate.", price: 3.50, img: "https://images.unsplash.com/photo-1614088685112-0a960b704c32?w=800&q=80", tag: "food" },
  { v: "Blinkit Fresh Farms", name: "Nature's Path Organic Heritage Flakes Cereal", desc: "A delicious blend of ancient grains including Kamut Khorasan wheat, quinoa, spelt, and amaranth.", price: 4.99, img: "https://images.unsplash.com/photo-1521406857444-fed450ea13b1?w=800&q=80", tag: "food" },
  { v: "Blinkit Fresh Farms", name: "Fiji Natural Artesian Water (24 Pack of 16.9 Fl Oz)", desc: "Earth's finest water, bottled at the source.", price: 29.99, img: "https://images.unsplash.com/photo-1563223771-5fe4038fbfc9?w=800&q=80", tag: "food" }
];

const seedDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    console.log('Wiping existing Products, Vendors, and Tags...');
    await Product.deleteMany({});
    await Vendor.deleteMany({});
    await Tag.deleteMany({});

    console.log('Creating Root Genres as Tags...');
    const tagsMap = {};
    for (let name of tagsUsed) {
      let tag = await Tag.create({ name, slug: name.toLowerCase() });
      tagsMap[name] = tag._id;
    }

    console.log('Creating Verified Amazon/Flipkart Level Vendors...');
    const vendorMap = {};
    for (let vData of vendorsData) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(vData.password, salt);
      
      const v = await Vendor.create({
        name: vData.name,
        businessName: vData.businessName,
        email: vData.email,
        password: hashedPassword,
        description: vData.description,
        phone: vData.phone,
        address: vData.address
      });
      vendorMap[v.businessName] = v._id;
      console.log(`Created Vendor: ${v.businessName}`);
    }

    console.log('Injecting Genuine E-Commerce Products...');
    let totalProductsSeeded = 0;
    
    for (const p of realProducts) {
       const vId = vendorMap[p.v];
       if (!vId) {
         console.error(`Vendor not found for ${p.name}`);
         continue;
       }

       await Product.create({
          name: p.name,
          description: p.desc,
          price: p.price,
          stock: Math.floor(Math.random() * 50) + 15,
          unit: "piece",
          minOrderQty: 1,
          images: [p.img],
          tags: [tagsMap[p.tag]],
          vendor: vId,
          isAvailable: true
       });
       totalProductsSeeded++;
    }

    console.log(`\n🎉 Success! Wiped DB & Seeded exactly ${vendorsData.length} Real Vendors and ${totalProductsSeeded} Major Brand Products.`);
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedDB();
