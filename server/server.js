const path = require('path');
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const { connectDB } = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const Product = require('./models/Product');
const seedData = require('./scripts/seed');

// Route imports
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const userRoutes = require('./routes/userRoutes');
const contactRoutes = require('./routes/contactRoutes');

const app = express();

// Trust reverse proxy if in production
app.set('trust proxy', 1);

// Configure CORS
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl, postman)
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive in dev to avoid local port mismatch
      }
    },
    credentials: true,
  })
);

// Express body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // limit each IP to 300 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.',
  },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again after 15 minutes.',
  },
});

app.use('/api', generalLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// Serve static uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/users', userRoutes);
app.use('/api/contact', contactRoutes);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Start server after connecting to database
const startServer = async () => {
  await connectDB();

  // If database has 0 products, auto-seed with rich demo catalog
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      console.log('[Server] Database is currently empty. Auto-seeding initial demo catalog...');
      await seedData(false);
    }
  } catch (seedErr) {
    console.warn('[Server] Auto-seed check warning:', seedErr.message);
  }

  app.listen(PORT, () => {
    console.log(`[Server] Marketplace API running on http://localhost:${PORT}`);
  });
};

// If run directly (not required as a test module)
if (require.main === module) {
  startServer();
}

module.exports = app;
