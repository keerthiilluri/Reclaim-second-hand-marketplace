const mongoose = require('mongoose');

const CATEGORIES = [
  'Textbooks & Education',
  'Laptops & Computers',
  'Smartphones & Audio',
  'Bicycles & Mobility',
  'Furniture & Home',
  'Hostel Essentials',
  'Fashion & Accessories',
  'Other',
];

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Product title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      trim: true,
      minlength: [10, 'Description must be at least 10 characters'],
      maxlength: [3000, 'Description cannot exceed 3000 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price cannot be negative'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: CATEGORIES,
        message: '{VALUE} is not a valid category',
      },
    },
    condition: {
      type: String,
      required: [true, 'Product condition is required'],
      enum: {
        values: ['Like New', 'Good', 'Fair'],
        message: '{VALUE} is not a valid condition',
      },
    },
    images: {
      type: [String],
      required: [true, 'At least one image is required'],
      validate: {
        validator: function (val) {
          return Array.isArray(val) && val.length > 0;
        },
        message: 'A listing must have at least one product image',
      },
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Listing must be associated with a seller'],
      index: true,
    },
    status: {
      type: String,
      enum: ['active', 'sold'],
      default: 'active',
      index: true,
    },
    featured: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Text index for title, description, and location search
productSchema.index({ title: 'text', description: 'text', location: 'text' });
productSchema.index({ category: 1, status: 1, createdAt: -1 });
productSchema.index({ price: 1 });

// Cleanup references in User wishlist when product is removed
productSchema.pre('findOneAndDelete', async function () {
  const doc = await this.model.findOne(this.getQuery());
  if (doc) {
    await mongoose.model('User').updateMany(
      { wishlist: doc._id },
      { $pull: { wishlist: doc._id } }
    );
    await mongoose.model('Inquiry').deleteMany({ product: doc._id });
  }
});

module.exports = mongoose.model('Product', productSchema);
module.exports.CATEGORIES = CATEGORIES;
