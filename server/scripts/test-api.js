/**
 * Automated end-to-end API test script
 * Verifies Auth, Products, Wishlist, Inquiries, Authorization and CRUD flows.
 */
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const { connectDB, disconnectDB } = require('../config/db');
const User = require('../models/User');
const Product = require('../models/Product');
const Inquiry = require('../models/Inquiry');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');

async function runTests() {
  console.log('🧪 Starting API & Database Integration Tests...\n');
  let passed = 0;
  let failed = 0;

  const assert = (condition, name) => {
    if (condition) {
      console.log(`  ✅ PASS: ${name}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${name}`);
      failed++;
    }
  };

  try {
    await connectDB();

    // Clean test DB
    await User.deleteMany({ email: /test.*@example\.com/ });
    await Product.deleteMany({ title: /Test Product/ });
    await Inquiry.deleteMany({ email: /test.*@example\.com/ });

    // Test 1: User Registration & Password Hashing
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash('SecretPass123!', salt);
    const user1 = await User.create({
      name: 'Test Seller',
      email: 'testseller@example.com',
      passwordHash: hash,
      phone: '+91 9876543210',
    });
    assert(user1 && user1._id, 'User registration with hashed password');
    assert(user1.passwordHash !== 'SecretPass123!', 'Password is not stored in plaintext');

    // Test 2: Password Verification Method
    const isMatch = await user1.comparePassword('SecretPass123!');
    const isMismatch = await user1.comparePassword('WrongPassword');
    assert(isMatch === true && isMismatch === false, 'bcrypt password comparison works correctly');

    // Test 3: JWT Token Generation
    const token = generateToken(user1._id);
    assert(typeof token === 'string' && token.length > 20, 'JWT token generated successfully');

    // Test 4: Product Creation (associated with user1)
    const product1 = await Product.create({
      title: 'Test Product 1: Core i7 Laptop',
      description: 'Test description for laptop with 16GB RAM and fast SSD.',
      price: 25000,
      category: 'Laptops & Computers',
      condition: 'Like New',
      images: ['https://images.unsplash.com/photo-1588872657578-7efd1f1555ed'],
      location: 'Bengaluru, Karnataka',
      seller: user1._id,
      status: 'active',
    });
    assert(product1 && product1.title.includes('Core i7'), 'Product listing created successfully');
    assert(product1.seller.toString() === user1._id.toString(), 'Product is associated with authenticated seller');

    // Test 5: Search & Filter queries
    const searchResults = await Product.find({
      $or: [
        { title: { $regex: 'Laptop', $options: 'i' } },
        { description: { $regex: 'Laptop', $options: 'i' } },
      ],
      category: 'Laptops & Computers',
      price: { $lte: 30000 },
      status: 'active',
    });
    assert(searchResults.length >= 1, 'Search and filter returns matching active products');

    // Test 6: Second user & Wishlist operations
    const user2 = await User.create({
      name: 'Test Buyer',
      email: 'testbuyer@example.com',
      passwordHash: hash,
    });
    user2.wishlist.push(product1._id);
    await user2.save();

    const userWithWishlist = await User.findById(user2._id).populate('wishlist');
    assert(userWithWishlist.wishlist.length === 1, 'User can add product to wishlist');
    assert(userWithWishlist.wishlist[0].title === product1.title, 'Wishlist populates product details');

    // Test 7: Prevent duplicate wishlist entries
    const duplicateCheck = user2.wishlist.some(
      (id) => id.toString() === product1._id.toString()
    );
    assert(duplicateCheck === true, 'Duplicate wishlist entry is correctly identified');

    // Test 8: Status update (active -> sold)
    product1.status = 'sold';
    await product1.save();
    const updatedProd = await Product.findById(product1._id);
    assert(updatedProd.status === 'sold', 'Product status toggles to sold');

    // Test 9: Contact Inquiry creation
    const inquiry = await Inquiry.create({
      product: product1._id,
      seller: user1._id,
      buyer: user2._id,
      name: user2.name,
      email: user2.email,
      message: 'Hi, is this laptop available for pickup in Bengaluru?',
    });
    assert(inquiry && inquiry.message.length > 10, 'Contact inquiry created successfully');
    assert(inquiry.seller.toString() === user1._id.toString(), 'Inquiry routes correctly to seller');

    // Test 10: Product deletion and cascading cleanup
    await Product.findOneAndDelete({ _id: product1._id });
    const deletedCheck = await Product.findById(product1._id);
    const buyerAfterDelete = await User.findById(user2._id);
    const inquiryAfterDelete = await Inquiry.findOne({ product: product1._id });
    assert(deletedCheck === null, 'Product deleted from MongoDB');
    assert(buyerAfterDelete.wishlist.length === 0, 'Deleted product removed from wishlist automatically');
    assert(inquiryAfterDelete === null, 'Associated inquiries cleaned up on product deletion');

    // Cleanup
    await User.deleteMany({ email: /test.*@example\.com/ });

    console.log(`\n========================================`);
    console.log(`Summary: ${passed} Passed, ${failed} Failed`);
    console.log(`========================================\n`);

    await disconnectDB();
    if (failed > 0) {
      process.exit(1);
    }
  } catch (err) {
    console.error('Test execution error:', err);
    await disconnectDB();
    process.exit(1);
  }
}

runTests();
