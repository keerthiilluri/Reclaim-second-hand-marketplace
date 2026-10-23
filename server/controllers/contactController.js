const Inquiry = require('../models/Inquiry');
const Product = require('../models/Product');

// @desc    Submit a contact inquiry for a product
// @route   POST /api/contact
// @access  Public (or Private with req.user attached)
const submitContactInquiry = async (req, res, next) => {
  try {
    const { productId, name, email, phone, message } = req.body;

    if (!productId || !name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide productId, name, email, and message.',
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'The product you are inquiring about could not be found.',
      });
    }

    // Prevent seller from messaging themselves
    if (req.user && product.seller.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot send an inquiry for your own listing.',
      });
    }

    const inquiry = await Inquiry.create({
      product: product._id,
      seller: product.seller,
      buyer: req.user ? req.user._id : null,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : '',
      message: message.trim(),
      status: 'unread',
    });

    res.status(201).json({
      success: true,
      message: 'Your inquiry has been sent to the seller successfully.',
      data: inquiry,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all inquiries received by the authenticated seller
// @route   GET /api/contact/inquiries
// @access  Private
const getMyInquiries = async (req, res, next) => {
  try {
    const inquiries = await Inquiry.find({ seller: req.user._id })
      .populate('product', 'title price images status')
      .populate('buyer', 'name email profileImage')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: inquiries.length,
      inquiries,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark inquiry as read / responded
// @route   PATCH /api/contact/inquiries/:id
// @access  Private
const updateInquiryStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['unread', 'read', 'responded'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value.',
      });
    }

    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found.',
      });
    }

    if (inquiry.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to update this inquiry.',
      });
    }

    inquiry.status = status;
    await inquiry.save();

    res.status(200).json({
      success: true,
      data: inquiry,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitContactInquiry,
  getMyInquiries,
  updateInquiryStatus,
};
