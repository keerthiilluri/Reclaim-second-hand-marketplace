const express = require('express');
const router = express.Router();
const {
  submitContactInquiry,
  getMyInquiries,
  updateInquiryStatus,
} = require('../controllers/contactController');
const { protect, optionalAuth } = require('../middleware/authMiddleware');

router.post('/', optionalAuth, submitContactInquiry);
router.get('/inquiries', protect, getMyInquiries);
router.patch('/inquiries/:id', protect, updateInquiryStatus);

module.exports = router;
