const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Inquiry must reference a product'],
      index: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Inquiry must reference a seller'],
      index: true,
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [60, 'Name cannot exceed 60 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
      minlength: [5, 'Message must be at least 5 characters'],
      maxlength: [1000, 'Message cannot exceed 1000 characters'],
    },
    status: {
      type: String,
      enum: ['unread', 'read', 'responded'],
      default: 'unread',
    },
  },
  {
    timestamps: true,
  }
);

inquirySchema.index({ seller: 1, createdAt: -1 });

module.exports = mongoose.model('Inquiry', inquirySchema);
