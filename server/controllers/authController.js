const bcrypt = require('bcryptjs');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password.',
      });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists.',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      phone: phone ? phone.trim() : '',
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          profileImage: user.profileImage,
          wishlist: user.wishlist,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          profileImage: user.profileImage,
          wishlist: user.wishlist,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile & wishlist
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-passwordHash');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found.',
      });
    }

    res.status(200).json({
      success: true,
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update current user profile
// @route   PUT /api/auth/me
// @access  Private
const updateMe = async (req, res, next) => {
  try {
    const { name, phone, profileImage } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    if (name) user.name = name.trim();
    if (phone !== undefined) user.phone = phone.trim();
    if (profileImage !== undefined) user.profileImage = profileImage;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          profileImage: user.profileImage,
          wishlist: user.wishlist,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  updateMe,
};
