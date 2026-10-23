# ReClaim — Full-Stack Second-Hand Marketplace

A modern, responsive, production-style **Second-Hand Marketplace** web application built with **React.js (Vite)**, **Node.js**, **Express.js**, and **MongoDB (Mongoose)**. Designed with a clean aesthetic featuring deep teal accents, professional typography, and mobile-first responsiveness.

---

## 🌟 Key Features

### 🛍️ Marketplace & Browsing
- **Interactive Home Page**: Hero section with quick search, category cards, featured listings, recently uploaded products, and an educational "How It Works" workflow.
- **Marketplace Explorer**: Real-time product search across title, description, and location.
- **Multi-Factor Filters**: Filter products by category, item condition (*Like New*, *Good*, *Fair*), price range (Min/Max INR), and city/campus location.
- **Sorting & Pagination**: Sort by newest, oldest, lowest price, and highest price with smooth pagination.
- **Product Details & Gallery**: High-res image gallery with interactive thumbnail switcher, condition badges, asking price in INR (`₹`), seller verification status, posted date, and related products in the same category.

### 🔐 Authentication & Authorization
- **JWT & bcryptjs Authentication**: Secure password hashing with salt rounds and 7-day signed JWT tokens.
- **Form Validation**: Strict client-side and backend validation, including email format regex and password confirmation checks.
- **Protected Routes**: Secure access control for selling items, editing listings, saving wishlists, and accessing seller dashboards.
- **Listing Ownership Enforcement**: Only the authenticated seller who created a listing can edit, update status, or delete it.

### 💼 Seller Hub & Dashboard
- **"Sell an Item" Page**: Working upload form supporting product title, description, price in INR, category, condition selector cards, campus location, and multiple product photos (supporting direct image uploads and image URLs).
- **Listing Management**: View active and sold listings, edit item details, mark products as *Sold* or *Active*, and delete items with a confirmation dialog.
- **Inquiries Inbox**: Sellers can view messages, questions, and contact info submitted by interested buyers directly in their dashboard.
- **Profile Settings**: Update public seller name and phone number for buyer communication.

### ❤️ Wishlist & Buyer Engagement
- **MongoDB-Persisted Wishlist**: Add/remove products from your wishlist with instant feedback, stored directly in the user document.
- **Duplicate Prevention**: Backend logic prevents duplicate wishlist entries and automatically cleans up references if an item is deleted.
- **Contact Seller Modal**: Inquire directly with the seller via an on-platform message stored in MongoDB or launch a one-click direct WhatsApp chat.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, React Router DOM v6, Axios, Lucide React, Custom Responsive CSS |
| **Backend** | Node.js, Express.js, REST API Architecture, Multer (multipart uploads), Express Rate Limit, CORS, dotenv |
| **Database** | MongoDB Atlas / Local MongoDB, Mongoose 8 (Schemas, Indexing, Timestamps, Pre-delete hooks) + Embedded MongoDB Memory Server fallback |
| **Security** | bcryptjs password hashing, JWT authorization middleware, strict sanitization, CORS origin protection |

---

## 📁 Project Structure

```text
second-hand-marketplace/
├── client/                      # Frontend React Application
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/          # Navbar, Footer, ProductCard, SkeletonCard, ContactModal, ProtectedRoute
│   │   │   ├── home/            # Homepage sections
│   │   │   └── products/        # Filter bars, search inputs
│   │   ├── context/
│   │   │   ├── AuthContext.jsx  # Authentication state & session manager
│   │   │   └── WishlistContext.jsx # Wishlist state & sync
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── ProductsPage.jsx
│   │   │   ├── ProductDetailsPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── SellPage.jsx
│   │   │   ├── EditProductPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── WishlistPage.jsx
│   │   │   └── NotFoundPage.jsx
│   │   ├── services/
│   │   │   └── api.js           # Axios API service client
│   │   ├── utils/
│   │   │   └── formatters.js    # Currency (INR ₹) & relative time formatters
│   │   ├── App.jsx              # Main router & provider wrapper
│   │   ├── index.css            # Global CSS styling & design system
│   │   └── main.jsx             # React DOM entrypoint
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── server/                      # Backend Express REST API
│   ├── config/
│   │   └── db.js                # MongoDB connection & embedded fallback
│   ├── controllers/
│   │   ├── authController.js    # Register, login, me, profile updates
│   │   ├── productController.js # CRUD, filtering, search, pagination, status
│   │   ├── wishlistController.js# Wishlist add, remove, fetch
│   │   └── contactController.js # Contact inquiries submission & seller inbox
│   ├── middleware/
│   │   ├── authMiddleware.js    # JWT verification & optional auth
│   │   ├── errorMiddleware.js   # Centralized error handler & 404 handler
│   │   └── uploadMiddleware.js  # Multer disk storage & image validator
│   ├── models/
│   │   ├── User.js              # User schema & password hashing
│   │   ├── Product.js           # Product schema with text indexes & pre-delete hook
│   │   └── Inquiry.js           # Buyer-seller contact inquiry schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── wishlistRoutes.js
│   │   ├── userRoutes.js
│   │   └── contactRoutes.js
│   ├── scripts/
│   │   ├── seed.js              # Standalone demo data seeder
│   │   └── test-api.js          # Automated database & API test runner
│   ├── tests/
│   ├── uploads/                 # Local image uploads directory
│   ├── .env.example             # Safe environment variable template
│   ├── .env                     # Server environment configuration
│   ├── package.json
│   └── server.js                # Express app entrypoint & middleware setup
│
├── .gitignore
├── package.json                 # Root script runner
└── README.md
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **MongoDB**: (Optional) MongoDB Atlas connection string or local MongoDB daemon. If no local MongoDB is detected, the server **automatically starts an embedded in-memory MongoDB instance** for immediate evaluation without setup!

---

### 1. Installation

Install dependencies for both client and server:

```powershell
# Navigate to project root
cd second-hand-marketplace

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

---

### 2. Environment Configuration

The server configuration file is located at `server/.env`. A template is provided in `server/.env.example`:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/secondhand_marketplace
JWT_SECRET=marketplace_jwt_super_secret_dev_key_2026_xyz
CLIENT_URL=http://localhost:5173
NODE_ENV=development

# Optional Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

> **Note on MongoDB:**
> - If you have a local MongoDB daemon running, it connects automatically to `mongodb://127.0.0.1:27017/secondhand_marketplace`.
> - If you want to connect to **MongoDB Atlas**, simply paste your Atlas connection URI in `server/.env` under `MONGODB_URI`.
> - If neither is present, the server automatically boots an **embedded in-memory database** so the application runs out-of-the-box.

---

### 3. Database Seeding

Seed sample products, users, and inquiries with realistic INR prices and Indian locations:

```powershell
cd server
npm run seed
```

#### Pre-Configured Demo Accounts

| Name | Email | Password | Role |
|---|---|---|---|
| **Rohit Sharma** | `rohit@demo.com` | `Password123!` | Active Seller (Laptop, Textbook, Watch) |
| **Priya Verma** | `priya@demo.com` | `Password123!` | Active Seller & Buyer (OnePlus Phone, Cycle) |
| **Arjun Nair** | `arjun@demo.com` | `Password123!` | Active Seller (Sony Headphones, Chair) |
| **Ananya Patel** | `ananya@demo.com` | `Password123!` | Active Seller (Induction Cooktop, Rucksack) |

*(The Login page also includes 1-click quick-fill buttons for these accounts).*

---

### 4. Running the Application

You can run both the frontend and backend with two separate terminal windows:

#### Terminal 1 — Backend Server
```powershell
cd server
npm start
```
*API running on:* `http://localhost:5000`

#### Terminal 2 — Frontend Client
```powershell
cd client
npm run dev
```
*Web Application running on:* `http://localhost:5173`

---

### 5. Running Automated Tests

Run the comprehensive integration test suite verifying User Hashing, JWT Tokens, Product CRUD, Search Queries, Wishlist Persist, Status Toggling, and Cascading Cleanup:

```powershell
cd server
npm test
```

---

## 📡 REST API Reference

### Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register new user with hashed password |
| `POST` | `/api/auth/login` | Public | Authenticate user & return JWT token |
| `GET` | `/api/auth/me` | Private | Fetch profile & wishlist of authenticated user |
| `PUT` | `/api/auth/me` | Private | Update user name, phone, or profile image |

### Products (`/api/products`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/products` | Public | Browse products with search, filters, sort & pagination |
| `GET` | `/api/products/:id` | Public | Get single product details + 4 related category items |
| `POST` | `/api/products` | Private | Create a new listing (supports multipart upload & URL images) |
| `PUT` | `/api/products/:id` | Private (Owner) | Edit product details (title, price, description, images) |
| `PATCH` | `/api/products/:id/status`| Private (Owner) | Toggle status between `'active'` and `'sold'` |
| `DELETE` | `/api/products/:id` | Private (Owner) | Delete product & cascade delete from all wishlists |

#### Query Parameters for `GET /api/products`:
- `search`: Keyword search in title, description, or location.
- `category`: Exact category filter (*Textbooks & Education*, *Laptops & Computers*, etc.).
- `condition`: Filter by condition (*Like New*, *Good*, *Fair*).
- `location`: Case-insensitive location search.
- `minPrice` / `maxPrice`: Numerical price range in INR.
- `sort`: `'newest'` | `'lowest'` | `'highest'` | `'oldest'`.
- `page`: Page number (default: 1).
- `limit`: Number of items per page (default: 12).

### Wishlist (`/api/wishlist`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/wishlist` | Private | Get populated wishlist of logged-in user |
| `POST` | `/api/wishlist/:productId` | Private | Add product to wishlist (prevents duplicates) |
| `DELETE` | `/api/wishlist/:productId` | Private | Remove product from wishlist |

### User Dashboard (`/api/users`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/users/me/listings` | Private | Get listings created by logged-in user + active/sold counts |

### Inquiries & Contact (`/api/contact`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/contact` | Public / Private | Submit an inquiry message for a product |
| `GET` | `/api/contact/inquiries` | Private (Seller) | View inquiries received for your listings |
| `PATCH` | `/api/contact/inquiries/:id` | Private (Seller) | Mark inquiry status as read or responded |

---

## 🔒 Security & Data Integrity Highlights

1. **Password Security**: Passwords are never stored in plaintext. They are salted with 10 rounds of `bcryptjs` and stripped automatically from JSON responses via Mongoose `transform`.
2. **Authorization Middleware**: Express middleware verifies the Bearer JWT token on all protected endpoints and strictly validates ownership before edit/delete actions.
3. **No Dangling References**: When a listing is deleted, a Mongoose pre-hook automatically removes its ObjectId from all users' wishlists and deletes related contact inquiries.
4. **Rate Limiting**: Configured with `express-rate-limit` to prevent brute-force login attempts and API abuse.
5. **CORS & Environment Isolation**: Strict CORS allows requests from the frontend client URL while preventing unauthorized cross-origin requests.

---

## ✅ Completed Deliverables Checklist

- [x] Full-stack architecture with React + Vite frontend and Node.js + Express backend.
- [x] Mongoose models with validation, text search indexing, and timestamps for `User`, `Product`, and `Inquiry`.
- [x] Secure JWT authentication with bcrypt password hashing and 1-click demo login buttons.
- [x] Home page with hero, search bar, 7 interactive categories, featured items, and recent listings.
- [x] Marketplace page with multi-parameter filtering, price slider, condition pills, sorting, and pagination.
- [x] Product details page with image gallery viewer, seller profile, related products, and safety tips.
- [x] "Sell an Item" form with local file uploads and image URL support.
- [x] User dashboard with active/sold stats, listing editor, delete confirmation dialog, and buyer inquiry inbox.
- [x] Wishlist functionality persisted in MongoDB with duplicate protection.
- [x] Direct WhatsApp contact integration and on-platform contact inquiry forms.
- [x] 16/16 Automated integration tests passing.
- [x] Production build verified with zero errors.
