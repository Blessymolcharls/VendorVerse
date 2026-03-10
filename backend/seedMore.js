const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Vendor = require('./models/Vendor');
const Product = require('./models/Product');
const Tag = require('./models/Tag');

dotenv.config();

const moreProducts = [
  // Electronics (Appario)
  { v: "Appario Retail Private Ltd", name: "Amazon Echo Dot (5th Gen, 2022)", desc: "Our best-sounding Echo Dot yet. Enjoy an improved audio experience.", price: 49.99, tag: "electronics" },
  { v: "Appario Retail Private Ltd", name: "Fire TV Stick 4K Max", desc: "Our most powerful streaming stick, with Wi-Fi 6 support.", price: 54.99, tag: "electronics" },
  { v: "Appario Retail Private Ltd", name: "Kindle Paperwhite (16 GB)", desc: "Now with a 6.8\" display and thinner borders. Adjustable warm light.", price: 149.99, tag: "electronics" },
  { v: "Appario Retail Private Ltd", name: "Ring Video Doorbell, 1080p HD Video", desc: "1080p HD video doorbell with enhanced features that let you see, hear, and speak to anyone.", price: 99.99, tag: "electronics" },
  { v: "SuperComNet", name: "Sony OLED 65 inch BRAVIA XR A80L Series", desc: "Intelligent TV processing technology with Cognitive Processor XR.", price: 1798.00, tag: "electronics" },
  { v: "SuperComNet", name: "Bose SoundLink Flex Bluetooth Portable Speaker", desc: "State-of-the-art design and exclusive technologies that provide deep, clear, and immersive audio.", price: 149.00, tag: "electronics" },
  { v: "SuperComNet", name: "Anker Portable Charger, 313 Power Bank", desc: "10000mAh Battery Pack with PowerIQ Charging Technology and USB-C.", price: 21.99, tag: "electronics" },
  { v: "Appario Retail Private Ltd", name: "Apple iPad (9th Generation)", desc: "10.2-inch Retina display, A13 Bionic chip, 64GB, Wi-Fi.", price: 329.00, tag: "electronics" },
  { v: "SuperComNet", name: "Samsung T7 1TB Portable SSD", desc: "Up to 1,050 MB/s speed. USB 3.2 Gen 2.", price: 89.99, tag: "electronics" },
  { v: "SuperComNet", name: "Logitech C920x HD Pro Webcam", desc: "Full HD 1080p video calling and recording.", price: 69.99, tag: "electronics" },
  { v: "SuperComNet", name: "Razer DeathAdder V3 Pro Gaming Mouse", desc: "Ultra-Lightweight ergonomic esports mouse. 30K Optical Sensor.", price: 149.99, tag: "electronics" },
  { v: "SuperComNet", name: "Corsair Vengeance LPX 16GB (2x8GB) DDR4 RAM", desc: "Designed for high-performance overclocking.", price: 44.99, tag: "electronics" },
  { v: "SuperComNet", name: "ASUS ROG Strix B550-F Gaming Motherboard", desc: "AMD AM4 Zen 3 Ryzen 5000 & 3rd Gen Ryzen ATX Gaming Motherboard.", price: 189.99, tag: "electronics" },
  { v: "Appario Retail Private Ltd", name: "WD 2TB Elements Portable HDD", desc: "High capacity in a sleek design, plug-and-play ready for Windows PCs.", price: 69.99, tag: "electronics" },
  { v: "SuperComNet", name: "TP-Link AX1800 WiFi 6 Router (Archer AX21)", desc: "Dual-Band Wireless Gigabit Router, Works with Alexa.", price: 74.99, tag: "electronics" },

  // Clothing (Myntra)
  { v: "Myntra Direct Fashions", name: "Columbia Men's Steens Mountain Full Zip Fleece", desc: "Crafted of deep, cozy 250g MTR fleece.", price: 39.99, tag: "clothing" },
  { v: "Myntra Direct Fashions", name: "Under Armour Men's Tech 2.0 Short-Sleeve T-Shirt", desc: "UA Tech fabric is quick-drying, ultra-soft & has a more natural feel.", price: 25.00, tag: "clothing" },
  { v: "Myntra Direct Fashions", name: "Champion Men's Powerblend Fleece Pullover Hoodie", desc: "Classic layer for gym or weekend wear.", price: 50.00, tag: "clothing" },
  { v: "Myntra Direct Fashions", name: "Levi's Women's 721 High Rise Skinny Jeans", desc: "Flattering high-rise fit and classic skinny leg.", price: 69.50, tag: "clothing" },
  { v: "Myntra Direct Fashions", name: "Calvin Klein Women's Modern Cotton Bralette", desc: "The original Calvin Klein logo bralette.", price: 30.00, tag: "clothing" },
  { v: "Myntra Direct Fashions", name: "Gildan Men's Crew T-Shirts, Pack of 6", desc: "Soft, breathable cotton crew neck t-shirts.", price: 19.99, tag: "clothing" },
  { v: "Myntra Direct Fashions", name: "Hanes Men's Pullover EcoSmart Hooded Sweatshirt", desc: "Midweight fleece hoodie made with a portion of recycled polyester.", price: 22.00, tag: "clothing" },
  { v: "Myntra Direct Fashions", name: "Dickies Men's Original 874 Work Pant", desc: "The classic Dickies work pant worn by creators and makers.", price: 34.99, tag: "clothing" },
  { v: "Myntra Direct Fashions", name: "Fruit of the Loom Men's Coolzone Boxer Briefs", desc: "Breathable mesh fly for cooling ventilation.", price: 18.99, tag: "clothing" },
  { v: "Myntra Direct Fashions", name: "Crocs Classic Clog", desc: "The iconic clog that started a comfort revolution around the world.", price: 49.99, tag: "clothing" },

  // Home (Cloudtail)
  { v: "Cloudtail India Home", name: "Keurig K-Classic Coffee Maker", desc: "Brews multiple K-Cup pod sizes (6, 8, 10 oz).", price: 109.99, tag: "home" },
  { v: "Cloudtail India Home", name: "Brita Standard Water Filter Pitcher", desc: "Large water pitcher includes 1 standard filter.", price: 24.99, tag: "home" },
  { v: "Cloudtail India Home", name: "Zinus 12 Inch Green Tea Memory Foam Mattress", desc: "Pressure relieving memory foam for a better night's sleep.", price: 299.00, tag: "home" },
  { v: "Cloudtail India Home", name: "COSORI Air Fryer Pro LE 5-Qt", desc: "Quiet operation and fast results with 9 customized functions.", price: 99.99, tag: "home" },
  { v: "Cloudtail India Home", name: "Black+Decker Dustbuster Handheld Vacuum", desc: "Cordless hand vacuum for quick cleanups.", price: 49.99, tag: "home" },
  { v: "Cloudtail India Home", name: "Lodge Cast Iron Skillet 10.25 Inch", desc: "Pre-seasoned cast iron skillet for frying, searing, and baking.", price: 19.90, tag: "home" },
  { v: "Cloudtail India Home", name: "Amazon Basics 6-Piece Nonstick Cookware Set", desc: "Includes 8-inch and 10-inch fry pans, 1.5-quart and 2-quart sauce pans, and a 3-quart casserole.", price: 54.99, tag: "home" },

  // Sports (RetailNet)
  { v: "RetailNet Sports", name: "Spalding NBA Street Basketball", desc: "Performance outdoor rubber cover.", price: 19.99, tag: "sports" },
  { v: "RetailNet Sports", name: "Callaway Golf Supersoft Golf Balls", desc: "Long, straight distance and incredibly soft feel.", price: 24.99, tag: "sports" },
  { v: "RetailNet Sports", name: "CAP Barbell Coated Hex Dumbbell (25 lbs)", desc: "Cast iron dumbbell with a durable, protective coating.", price: 35.99, tag: "sports" },
  { v: "RetailNet Sports", name: "CamelBak Chute Mag Water Bottle", desc: "Magnetic cap stows securely while you drink.", price: 16.00, tag: "sports" },
  { v: "RetailNet Sports", name: "Franklin Sports MLB Batting Gloves", desc: "Official batting gloves of Major League Baseball.", price: 22.50, tag: "sports" },
  { v: "RetailNet Sports", name: "Titleist Players Men's Golf Glove", desc: "Premium cabretta leather for a seamless feel.", price: 26.00, tag: "sports" },

  // Books (Crossword)
  { v: "Crossword Book Retail", name: "The Midnight Library by Matt Haig", desc: "Between life and death there is a library, and within that library, the shelves go on forever.", price: 13.99, tag: "books" },
  { v: "Crossword Book Retail", name: "Lessons in Chemistry by Bonnie Garmus", desc: "Meet Elizabeth Zott: a brilliant scientist whose career takes a detour when she becomes the star of a beloved TV cooking show.", price: 14.99, tag: "books" },
  { v: "Crossword Book Retail", name: "Iron Flame by Rebecca Yarros", desc: "The highly anticipated sequel to Fourth Wing.", price: 19.99, tag: "books" },
  { v: "Crossword Book Retail", name: "Fourth Wing by Rebecca Yarros", desc: "Welcome to the brutal and elite world of Basgiath War College for dragon riders.", price: 16.99, tag: "books" },
  { v: "Crossword Book Retail", name: "Tomorrow, and Tomorrow, and Tomorrow by Gabrielle Zevin", desc: "Two friends--often in love, but never lovers--come together as creative partners in the world of video game design.", price: 15.60, tag: "books" },
  { v: "Crossword Book Retail", name: "The Seven Husbands of Evelyn Hugo", desc: "A mesmerizing journey into the glamour, scandal, and heart-wrenching truths of a Hollywood icon.", price: 9.99, tag: "books" },
  { v: "Crossword Book Retail", name: "Verity by Colleen Hoover", desc: "A psychological thriller that will leave you reeling.", price: 11.20, tag: "books" },
  
  // Food (Blinkit)
  { v: "Blinkit Fresh Farms", name: "KIND Bars, Dark Chocolate Nuts & Sea Salt (12 Pack)", desc: "A satisfying, nutty snack that only seems indulgent.", price: 14.99, tag: "food" },
  { v: "Blinkit Fresh Farms", name: "Frito-Lay Classic Mix Variety Pack (35 Count)", desc: "Includes Lay's, Doritos, Cheetos, and Fritos.", price: 19.00, tag: "food" },
  { v: "Blinkit Fresh Farms", name: "San Pellegrino Sparkling Natural Mineral Water (12 Pack)", desc: "Imported from Italy, with a crisp and clean taste.", price: 18.50, tag: "food" },
  { v: "Blinkit Fresh Farms", name: "Quaker Old Fashioned Rolled Oats (64 oz)", desc: "100% whole grain oats for a hearty breakfast.", price: 5.49, tag: "food" },
  { v: "Blinkit Fresh Farms", name: "Planters Deluxe Mixed Nuts (34 oz)", desc: "A delicious blend of cashews, almonds, pecans, pistachios, and hazelnuts.", price: 17.98, tag: "food" },

  // Extra Requests
  { v: "Appario Retail Private Ltd", name: "Beats Studio Pro Wireless Headphones", desc: "Experience immersive listening with custom acoustic platform.", price: 349.99, tag: "electronics" },
  { v: "Appario Retail Private Ltd", name: "Garmin Fenix 7 Sapphire Solar", desc: "Multisport GPS smartwatch with scratch-resistant Power Sapphire lens.", price: 899.99, tag: "electronics" },
  { v: "SuperComNet", name: "LG 34WN80C-B UltraWide Monitor", desc: "34 inch 21:9 Curved WQHD IPS display.", price: 549.99, tag: "electronics" },
  { v: "SuperComNet", name: "Keychron K2 Wireless Mechanical Keyboard", desc: "A 75% layout (84-key) RGB backlight Bluetooth keyboard.", price: 79.99, tag: "electronics" },

  { v: "Myntra Direct Fashions", name: "Columbia Women's Newton Ridge Hiking Boot", desc: "Waterproof hiking boot designed for varied terrain.", price: 89.95, tag: "clothing" },
  { v: "Myntra Direct Fashions", name: "Carhartt Men's K87 Workwear T-Shirt", desc: "Original fit short-sleeve pocket t-shirt.", price: 16.99, tag: "clothing" },
  { v: "Myntra Direct Fashions", name: "Champion Women's Reverse Weave Sweatpants", desc: "Heavyweight fleece sweatpants with a classic fit.", price: 55.00, tag: "clothing" },
  { v: "Myntra Direct Fashions", name: "Ray-Ban Aviator Classic Sunglasses", desc: "Currently one of the most iconic sunglass models in the world.", price: 163.00, tag: "clothing" },

  { v: "Cloudtail India Home", name: "Instant Pot Duo Plus 9-in-1", desc: "Electric Pressure Cooker, Slow Cooker, Rice Cooker.", price: 129.99, tag: "home" },
  { v: "Cloudtail India Home", name: "Levoit Core 300 Air Purifier", desc: "True HEPA filter for bedroom and home.", price: 99.99, tag: "home" },
  { v: "Cloudtail India Home", name: "Hamilton Beach Dual Breakfast Sandwich Maker", desc: "Cooks 1 or 2 sandwiches in 5 minutes.", price: 42.99, tag: "home" },
  { v: "Cloudtail India Home", name: "Eufy Security Video Doorbell", desc: "2K resolution, no monthly fee.", price: 159.99, tag: "home" },

  { v: "RetailNet Sports", name: "Under Armour Men's Undeniable 5.0 Duffle Bag", desc: "Durable daily carry for gym gear.", price: 50.00, tag: "sports" },
  { v: "RetailNet Sports", name: "Titleist Pro V1x Golf Balls", desc: "Total performance with high flight and lower long game spin.", price: 55.00, tag: "sports" },
  { v: "RetailNet Sports", name: "Hydro Flask Standard Mouth Bottle with Flex Cap", desc: "Keeps drinks cold up to 24 hours.", price: 34.95, tag: "sports" },
  { v: "RetailNet Sports", name: "Manduka PRO Yoga Mat", desc: "Ultra-dense cushioning provides superior support.", price: 129.00, tag: "sports" }
];

const seedMore = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB to insert 50 more products...');

    // Fetch existing vendors and tags to hook onto
    const vendors = await Vendor.find({});
    const tags = await Tag.find({});
    
    const vMap = {};
    vendors.forEach(v => vMap[v.businessName] = v._id);
    
    const tMap = {};
    tags.forEach(t => tMap[t.name] = t._id);

    let createdCount = 0;
    for (let p of moreProducts) {
      if (!vMap[p.v] || !tMap[p.tag]) {
         console.error(`Missing vendor or tag for ${p.name}`);
         continue;
      }

      await Product.create({
        name: p.name,
        description: p.desc,
        price: p.price,
        stock: Math.floor(Math.random() * 50) + 15,
        unit: "piece",
        minOrderQty: 1,
        // Using high-quality random Unsplash stock image based on the item index as seed for a valid stable image
        images: [`https://picsum.photos/seed/${encodeURIComponent(p.name)}/800/800`],
        tags: [tMap[p.tag]],
        vendor: vMap[p.v],
        isAvailable: true
      });
      createdCount++;
    }

    console.log(`\n🎉 Success! Added ${createdCount} top Amazon items. Database now contains ~75 items.`);
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedMore();
