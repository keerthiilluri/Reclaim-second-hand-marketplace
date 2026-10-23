const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your name'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [60, 'Name cannot exceed 60 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide your email address'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    profileImage: {
      type: String,
      default: '',
    },
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Method to verify candidate password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.passwordHash);
};

// Ensure passwordHash is never leaked in JSON outputs
userSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.passwordHash;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('User', userSchema);
