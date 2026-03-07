const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Buyer = require('./models/Buyer');

dotenv.config();

async function testRegistration() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    console.log('Testing Buyer registration...');
    const buyerData = {
      name: 'Test Buyer ' + Date.now(),
      email: `test${Date.now()}@test.com`,
      password: 'password123',
      phone: '1234567890',
      address: '123 Main St'
    };

    console.log('Attempting to create buyer:', buyerData.email);
    const buyer = await Buyer.create(buyerData);
    
    console.log('✅ Successfully created buyer in database!');
    console.log(buyer);
    
  } catch (error) {
    console.error('\n❌ FAILED TO CREATE BUYER!');
    console.error('Error stack trace:');
    console.error(error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

testRegistration();
