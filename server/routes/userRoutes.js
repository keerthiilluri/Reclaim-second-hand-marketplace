const express = require('express');
const router = express.Router();
const { getMyListings } = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');

router.get('/me/listings', protect, getMyListings);

module.exports = router;
