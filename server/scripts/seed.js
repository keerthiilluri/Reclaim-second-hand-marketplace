const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const { connectDB, disconnectDB } = require('../config/db');
const User = require('../models/User');
const Product = require('../models/Product');
const Inquiry = require('../models/Inquiry');

const demoUsers = [
  {
    name: 'Rohit Sharma',
    email: 'rohit@demo.com',
    password: 'Password123!',
    phone: '+91 98765 43210',
    profileImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
  },
  {
    name: 'Priya Verma',
    email: 'priya@demo.com',
    password: 'Password123!',
    phone: '+91 91234 56789',
    profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
  },
  {
    name: 'Arjun Nair',
    email: 'arjun@demo.com',
    password: 'Password123!',
    phone: '+91 99887 76655',
    profileImage: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80',
  },
  {
    name: 'Ananya Patel',
    email: 'ananya@demo.com',
    password: 'Password123!',
    phone: '+91 97654 32109',
    profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  },
];

const sampleProducts = [
  {
    title: 'Higher Engineering Mathematics - B.S. Grewal (44th Edition)',
    description: 'Essential textbook for 1st & 2nd year engineering mathematics. Covers calculus, differential equations, linear algebra, vector calculus, and complex analysis. Kept in clean condition with no missing pages or heavy pen marks.',
    price: 450,
    category: 'Textbooks & Education',
    condition: 'Good',
    images: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
    ],
    location: 'Koramangala, Bengaluru',
    featured: true,
  },
  {
    title: 'Operating System Concepts (10th Dinosaur Edition) - Silberschatz',
    description: 'The definitive textbook for Computer Science OS courses. Covers process management, threads, synchronization, memory management, and file systems. Barely used during the last semester.',
    price: 590,
    category: 'Textbooks & Education',
    condition: 'Like New',
    images: [
      'https://images.unsplash.com/photo-1532012164546-f432f2e3777f?auto=format&fit=crop&w=800&q=80',
    ],
    location: 'Kothrud, Pune',
    featured: false,
  },
  {
    title: 'Dell Inspiron 15 (Intel Core i5 11th Gen, 16GB RAM, 512GB SSD)',
    description: 'Lightly used for coding, web development, and college projects. 15.6-inch Full HD anti-glare display, upgraded to 16GB dual-channel DDR4 RAM, 512GB NVMe SSD, backlit keyboard. Battery health at 88%. Includes original 65W charger.',
    price: 32000,
    category: 'Laptops & Computers',
    condition: 'Like New',
    images: [
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
    ],
    location: 'HSR Layout, Bengaluru',
    featured: true,
  },
  {
    title: 'Keychron K2 Wireless Mechanical Keyboard (RGB, Red Switches)',
    description: 'Compact 75% wireless mechanical keyboard with hot-swappable Gateron Red linear switches. Compatible with Mac and Windows via Bluetooth or USB-C cable. Kept in pristine condition with original box and keycap puller.',
    price: 4900,
    category: 'Laptops & Computers',
    condition: 'Like New',
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=800&q=80',
    ],
    location: 'Andheri West, Mumbai',
    featured: true,
  },
  {
    title: 'OnePlus Nord CE 3 5G (8GB RAM, 128GB Storage, Aqua Surge)',
    description: 'Purchased 10 months ago. Features Snapdragon 782G, 120Hz Fluid AMOLED display, 50MP Sony IMX890 sensor with OIS, and 80W SUPERVOOC fast charger included in the box. Tempered glass applied from day 1.',
    price: 15500,
    category: 'Smartphones & Audio',
    condition: 'Good',
    images: [
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02560?auto=format&fit=crop&w=800&q=80',
    ],
    location: 'Gachibowli, Hyderabad',
    featured: true,
  },
  {
    title: 'Sony WH-1000XM4 Wireless Noise-Cancelling Headphones',
    description: 'Industry-leading Active Noise Cancellation (ANC) with 30-hour battery life, multipoint Bluetooth connection, and exceptional audio quality. Perfect for hostel studying or noisy commutes. Comes with original hard carry case and aux cable.',
    price: 13900,
    category: 'Smartphones & Audio',
    condition: 'Good',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80',
    ],
    location: 'Indiranagar, Bengaluru',
    featured: true,
  },
  {
    title: 'Firefox Target 21-Speed Alloy Mountain Bicycle (27.5T)',
    description: 'Lightweight aluminium alloy frame with front suspension fork, 21-speed Shimano Tourney gears, front & rear disc brakes. Serviced last month with new brake pads and lubricated chain. Ideal for college campus commuting.',
    price: 9500,
    category: 'Bicycles & Mobility',
    condition: 'Good',
    images: [
      'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&w=800&q=80',
    ],
    location: 'Viman Nagar, Pune',
    featured: true,
  },
  {
    title: 'Hero Sprint Pro 26T City Bicycle with Front Basket',
    description: 'Simple, reliable single-speed city cycle with durable steel frame, mudguards, and front basket for books/backpack. Used for 1 academic year on campus. Smooth ride, tires in solid shape.',
    price: 3200,
    category: 'Bicycles & Mobility',
    condition: 'Fair',
    images: [
      'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?auto=format&fit=crop&w=800&q=80',
    ],
    location: 'Guindy, Chennai',
    featured: false,
  },
  {
    title: 'Ergonomic High-Back Mesh Study Chair with Lumbar Support',
    description: 'Breathable Korean mesh backrest, pneumatic height adjustment, 2D adjustable armrests, and 120-degree tilt lock mechanism. Sturdy nylon wheelbase with silent caster wheels. Highly comfortable for long study hours.',
    price: 3800,
    category: 'Furniture & Home',
    condition: 'Like New',
    images: [
      'https://images.unsplash.com/photo-1580481077195-c328ad4f4453?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1505797149-43b0069ec26b?auto=format&fit=crop&w=800&q=80',
    ],
    location: 'Noida Sector 62, Delhi NCR',
    featured: false,
  },
  {
    title: 'Solid Engineered Wood 4-Shelf Bookcase / Study Organizer',
    description: 'Walnut finish wooden shelf unit with 4 spacious tiers. Fits large textbooks, file folders, and desk accessories. Easy to disassemble for hostel room transport. Sturdy and wobbling-free.',
    price: 1850,
    category: 'Furniture & Home',
    condition: 'Good',
    images: [
      'https://images.unsplash.com/photo-1594643156337-671224be50ca?auto=format&fit=crop&w=800&q=80',
    ],
    location: 'Powai, Mumbai',
    featured: false,
  },
  {
    title: 'Bajaj 15-Litre Portable Compact Cooler / Mini Fridge',
    description: 'Compact personal cooling unit suitable for hostel rooms or PG bedrooms. Low power consumption (energy efficient), runs quietly, and keeps beverages, water bottles, and fruits cool during hot weather.',
    price: 2400,
    category: 'Hostel Essentials',
    condition: 'Good',
    images: [
      'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80',
    ],
    location: 'Banjara Hills, Hyderabad',
    featured: false,
  },
  {
    title: 'Prestige 1900W Induction Cooktop with Auto Cook Menus',
    description: 'Digital display with Indian preset menu functions (curry, chapati, boiling milk, etc.). Aerodynamic cooling system and dual heat sensors. Includes an induction-compatible steel fry pan.',
    price: 1450,
    category: 'Hostel Essentials',
    condition: 'Good',
    images: [
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
    ],
    location: 'Velachery, Chennai',
    featured: false,
  },
  {
    title: 'Wildcraft 45-Litre Trekking & College Rucksack (Water Resistant)',
    description: 'Heavy-duty ripstop nylon backpack with padded shoulder straps, sternum support buckle, dedicated 15.6-inch laptop sleeve, and rain cover pouch in the bottom. Ideal for weekend trips or college.',
    price: 1650,
    category: 'Fashion & Accessories',
    condition: 'Like New',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
    ],
    location: 'BTM Layout, Bengaluru',
    featured: false,
  },
  {
    title: 'Fossil Grant Chronograph Dark Brown Leather Watch',
    description: 'Original Fossil men’s chronograph watch with Roman numeral dial, stainless steel casing, and genuine brown leather strap with cream stitching. Minor signs of wear on the strap, dial glass is scratch-free.',
    price: 3900,
    category: 'Fashion & Accessories',
    condition: 'Good',
    images: [
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80',
    ],
    location: 'Shivajinagar, Pune',
    featured: true,
  },
];

const seedData = async (isStandalone = false) => {
  try {
    if (isStandalone) {
      console.log('[Seed] Connecting to MongoDB...');
      await connectDB();
    }

    console.log('[Seed] Clearing existing collections...');
    await User.deleteMany({});
    await Product.deleteMany({});
    await Inquiry.deleteMany({});

    console.log('[Seed] Creating demo users...');
    const createdUsers = [];
    for (const u of demoUsers) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(u.password, salt);
      const user = await User.create({
        name: u.name,
        email: u.email,
        passwordHash,
        phone: u.phone,
        profileImage: u.profileImage,
        wishlist: [],
      });
      createdUsers.push(user);
    }
    console.log(`[Seed] Created ${createdUsers.length} demo users.`);

    console.log('[Seed] Creating sample product listings...');
    const createdProducts = [];
    for (let i = 0; i < sampleProducts.length; i++) {
      const prod = sampleProducts[i];
      // Distribute products among demo sellers
      const seller = createdUsers[i % createdUsers.length];
      const newProduct = await Product.create({
        ...prod,
        seller: seller._id,
        status: i === sampleProducts.length - 1 ? 'sold' : 'active', // 1 sold item for demoing status badges
      });
      createdProducts.push(newProduct);
    }
    console.log(`[Seed] Created ${createdProducts.length} product listings.`);

    // Add a couple products to users' wishlists for initial demo state
    createdUsers[0].wishlist.push(createdProducts[2]._id, createdProducts[5]._id);
    await createdUsers[0].save();

    createdUsers[1].wishlist.push(createdProducts[0]._id, createdProducts[3]._id);
    await createdUsers[1].save();

    // Create 2 sample inquiries
    await Inquiry.create({
      product: createdProducts[2]._id,
      seller: createdProducts[2].seller,
      buyer: createdUsers[1]._id,
      name: createdUsers[1].name,
      email: createdUsers[1].email,
      phone: createdUsers[1].phone,
      message: 'Hi Rohit! Is this laptop still under manufacturer warranty? Can you provide the bill?',
      status: 'unread',
    });

    await Inquiry.create({
      product: createdProducts[0]._id,
      seller: createdProducts[0].seller,
      buyer: createdUsers[2]._id,
      name: createdUsers[2].name,
      email: createdUsers[2].email,
      phone: createdUsers[2].phone,
      message: 'Hello, can you meet near Koramangala Sony Signal for the B.S. Grewal book handover tomorrow?',
      status: 'read',
    });

    console.log('[Seed] Database seeded successfully with demo listings & accounts!');

    if (isStandalone) {
      await disconnectDB();
      process.exit(0);
    }
  } catch (error) {
    console.error('[Seed Error]:', error);
    if (isStandalone) {
      process.exit(1);
    }
  }
};

if (require.main === module) {
  seedData(true);
}

module.exports = seedData;
