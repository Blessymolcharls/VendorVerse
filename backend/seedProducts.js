const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Vendor = require('./models/Vendor');
const Product = require('./models/Product');
const Tag = require('./models/Tag');
const bcrypt = require('bcryptjs');

dotenv.config();

const vendorsData = [
  {
    businessName: "TechHaven Electronics",
    name: "Tech Haven",
    email: "techhaven@example.com",
    password: "password123",
    description: "Your premier destination for the latest in consumer electronics and gadgets.",
    phone: "555-0101",
    address: "123 Silicon Valley Blvd, CA",
    genre: "Electronics"
  },
  {
    businessName: "StyleBoutique Apparel",
    name: "Style Boutique",
    email: "style@example.com",
    password: "password123",
    description: "Trendy and fashionable clothing for all seasons and sizes.",
    phone: "555-0202",
    address: "45 Fashion Ave, NY",
    genre: "Clothing"
  },
  {
    businessName: "GreenLeaf Gardens",
    name: "Green Leaf",
    email: "greenleaf@example.com",
    password: "password123",
    description: "Everything you need to make your home and garden beautiful.",
    phone: "555-0303",
    address: "789 Plant St, OR",
    genre: "Home & Garden"
  },
  {
    businessName: "ActiveLife Sports",
    name: "Active Life",
    email: "sports@example.com",
    password: "password123",
    description: "High-quality sports equipment and outdoors gear.",
    phone: "555-0404",
    address: "321 Athlete Rd, CO",
    genre: "Sports"
  },
  {
    businessName: "Chapter & Verse Books",
    name: "Chapter Verse",
    email: "books@example.com",
    password: "password123",
    description: "A wide selection of fiction, non-fiction, and educational books.",
    phone: "555-0505",
    address: "56 Library Way, MA",
    genre: "Books"
  },
  {
    businessName: "Gourmet Delights",
    name: "Gourmet",
    email: "gourmet@example.com",
    password: "password123",
    description: "Artisanal foods, fresh produce, and specialty groceries.",
    phone: "555-0606",
    address: "99 Food Market St, WA",
    genre: "Food"
  }
];

const generateProducts = (genre, vendorId, tagsMap) => {
  const templates = {
    "Electronics": [
      { name: "Quantum Smartwatch Pro", price: 299.99, img: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&q=80", tag: "Wearables" },
      { name: "Noise-Cancelling Headphones Max", price: 349.50, img: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500&q=80", tag: "Audio" },
      { name: "UltraHD 4K Monitor", price: 499.00, img: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&q=80", tag: "Computers" },
      { name: "Mechanical Gaming Keyboard", price: 129.99, img: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=500&q=80", tag: "Accessories" },
      { name: "Wireless Ergonomic Mouse", price: 79.99, img: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&q=80", tag: "Accessories" },
      { name: "Portable SSD 1TB", price: 159.00, img: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500&q=80", tag: "Storage" },
      { name: "Smart Home Hub", price: 199.99, img: "https://images.unsplash.com/photo-1558089687-f282ffcbc2d5?w=500&q=80", tag: "Smart Home" },
      { name: "Bluetooth Speaker Waterproof", price: 89.50, img: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&q=80", tag: "Audio" },
    ],
    "Clothing": [
      { name: "Classic Denim Jacket", price: 89.99, img: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=500&q=80", tag: "Outerwear" },
      { name: "Cotton V-Neck T-Shirt", price: 24.50, img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80", tag: "Shirts" },
      { name: "Slim Fit Chinos", price: 59.99, img: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500&q=80", tag: "Pants" },
      { name: "Summer Floral Dress", price: 75.00, img: "https://images.unsplash.com/photo-1515347619152-192518eebd54?w=500&q=80", tag: "Dresses" },
      { name: "Leather Chelsea Boots", price: 149.99, img: "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=500&q=80", tag: "Shoes" },
      { name: "Knit Winter Beanie", price: 19.99, img: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=500&q=80", tag: "Accessories" },
      { name: "Running Sneakers", price: 110.00, img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80", tag: "Shoes" },
      { name: "Athletic Leggings", price: 45.00, img: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=500&q=80", tag: "Athleisure" },
    ],
    "Home & Garden": [
      { name: "Monstera Deliciosa Plant", price: 45.00, img: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=500&q=80", tag: "Plants" },
      { name: "Ceramic Planter Pot", price: 25.50, img: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500&q=80", tag: "Decor" },
      { name: "Outdoor Patio Set", price: 499.99, img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&q=80", tag: "Furniture" },
      { name: "Heavy Duty Pruning Shears", price: 34.00, img: "https://images.unsplash.com/photo-1416879598555-568ea8afb46c?w=500&q=80", tag: "Tools" },
      { name: "Organic Potting Soil 50lb", price: 18.99, img: "https://images.unsplash.com/photo-1592398246347-16ab72b16a4a?w=500&q=80", tag: "Supplies" },
      { name: "Solar Pathway Lights (Pack of 6)", price: 45.99, img: "https://images.unsplash.com/photo-1510525009512-ad7fc13eefab?w=500&q=80", tag: "Lighting" },
      { name: "Watering Can Copper", price: 40.00, img: "https://images.unsplash.com/photo-1457850257488-299f1fa110ac?w=500&q=80", tag: "Tools" },
      { name: "Geometric Rug 5x7", price: 120.00, img: "https://images.unsplash.com/photo-1534889156217-d643df14f14a?w=500&q=80", tag: "Decor" },
      { name: "Fiddle Leaf Fig", price: 65.00, img: "https://images.unsplash.com/photo-1505691938895-1758d7bef511?w=500&q=80", tag: "Plants" }
    ],
    "Sports": [
      { name: "Yoga Mat Non-Slip", price: 29.99, img: "https://images.unsplash.com/photo-1601925260368-ae2f83cfecb7?w=500&q=80", tag: "Fitness" },
      { name: "Adjustable Dumbbell Set", price: 199.00, img: "https://images.unsplash.com/photo-1586401700818-24cf96f5b90d?w=500&q=80", tag: "Weights" },
      { name: "Carbon Fiber Tennis Racket", price: 149.50, img: "https://images.unsplash.com/photo-1622279457486-640ca4a31644?w=500&q=80", tag: "Racket Sports" },
      { name: "Pro Soccer Ball Size 5", price: 35.00, img: "https://images.unsplash.com/photo-1614632537423-1e6c2e7e0aab?w=500&q=80", tag: "Team Sports" },
      { name: "Resistance Bands Set", price: 22.99, img: "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=500&q=80", tag: "Fitness" },
      { name: "Camping Tent 4-Person", price: 189.99, img: "https://images.unsplash.com/photo-1504280390227-331ef29d4e0a?w=500&q=80", tag: "Outdoors" },
      { name: "Insulated Water Bottle 32oz", price: 34.50, img: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&q=80", tag: "Accessories" },
      { name: "Cycling Helmet Adult", price: 55.00, img: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=500&q=80", tag: "Cycling" },
    ],
    "Books": [
      { name: "The Pragmatic Programmer", price: 39.99, img: "https://plus.unsplash.com/premium_photo-1677567996070-68fa4181775a?w=500&q=80", tag: "Technology" },
      { name: "1984 by George Orwell", price: 14.50, img: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&q=80", tag: "Fiction" },
      { name: "Thinking, Fast and Slow", price: 22.00, img: "https://images.unsplash.com/photo-1589998059171-989d887df446?w=500&q=80", tag: "Psychology" },
      { name: "Sapiens: A Brief History", price: 24.99, img: "https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=500&q=80", tag: "History" },
      { name: "Atomic Habits", price: 19.99, img: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=500&q=80", tag: "Self-Help" },
      { name: "Dune by Frank Herbert", price: 18.50, img: "https://images.unsplash.com/photo-1614583224978-f05cea51a089?w=500&q=80", tag: "Sci-Fi" },
      { name: "The Great Gatsby", price: 12.99, img: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&q=80", tag: "Classics" },
      { name: "Clean Code", price: 42.00, img: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500&q=80", tag: "Technology" },
      { name: "Brief Answers to the Big Questions", price: 21.00, img: "https://images.unsplash.com/photo-1463320726281-696a485928c7?w=500&q=80", tag: "Science" }
    ],
    "Food": [
      { name: "Organic Extra Virgin Olive Oil 1L", price: 24.99, img: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&q=80", tag: "Pantry" },
      { name: "Artisan Sourdough Bread", price: 8.50, img: "https://images.unsplash.com/photo-1585478259715-876acc5be8eb?w=500&q=80", tag: "Bakery" },
      { name: "Single Origin Coffee Beans 1lb", price: 18.00, img: "https://images.unsplash.com/photo-1559525839-b184a4d698c7?w=500&q=80", tag: "Beverages" },
      { name: "Aged Cheddar Cheese 8oz", price: 12.99, img: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=500&q=80", tag: "Dairy" },
      { name: "Raw Wild Honey 16oz", price: 16.50, img: "https://images.unsplash.com/photo-1587049352847-8d4c0b4eb806?w=500&q=80", tag: "Pantry" },
      { name: "Prosciutto di Parma 4oz", price: 14.00, img: "https://images.unsplash.com/photo-1600850056064-a8f379dfaba0?w=500&q=80", tag: "Deli" },
      { name: "Dark Chocolate Truffles Box", price: 28.00, img: "https://images.unsplash.com/photo-1548883354-7622d03aca27?w=500&q=80", tag: "Sweets" },
      { name: "Organic Matcha Powder 100g", price: 22.99, img: "https://images.unsplash.com/photo-1582782806507-6cb16f731671?w=500&q=80", tag: "Beverages" }
    ]
  };

  const prods = templates[genre] || [];
  
  return prods.map(p => {
    // Basic description
    let desc = `High quality ${p.name.toLowerCase()} sourced by your trusted vendor. Perfect for your specific needs, offering great durability and value.`;
    
    return {
      name: p.name,
      description: desc,
      price: p.price,
      stock: Math.floor(Math.random() * 100) + 10,
      unit: "piece", // you can vary this if you want
      minOrderQty: 1,
      images: [p.img],
      tags: [tagsMap[p.tag]], // lookup the object ID for the tag
      vendor: vendorId,
      isAvailable: true
    };
  });
};

const seedDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Create the tags first so we have them to reference
    console.log('Creating Tags...');
    const tagNames = [
      "Wearables", "Audio", "Computers", "Accessories", "Storage", "Smart Home",
      "Outerwear", "Shirts", "Pants", "Dresses", "Shoes", "Athleisure",
      "Plants", "Decor", "Furniture", "Tools", "Supplies", "Lighting",
      "Fitness", "Weights", "Racket Sports", "Team Sports", "Outdoors", "Cycling",
      "Technology", "Fiction", "Psychology", "History", "Self-Help", "Sci-Fi", "Classics", "Science",
      "Pantry", "Bakery", "Beverages", "Dairy", "Deli", "Sweets"
    ];

    const tagsMap = {};
    for (let name of tagNames) {
      let tag = await Tag.findOne({ name });
      if (!tag) {
         const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
         tag = await Tag.create({ name, slug });
      }
      tagsMap[name] = tag._id;
    }

    console.log('Creating Vendors and Products...');
    let totalProductsSeeded = 0;

    for (let vData of vendorsData) {
      // Create Vendor
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

      console.log(`Created Vendor: ${v.businessName}`);

      // Create Products for this vendor
      const productsToMake = generateProducts(vData.genre, v._id, tagsMap);
      await Product.insertMany(productsToMake);
      console.log(` -> Added ${productsToMake.length} products`);
      totalProductsSeeded += productsToMake.length;
    }

    console.log(`\n🎉 Success! Seeded exactly 6 Vendors and ${totalProductsSeeded} Products.`);
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedDB();
