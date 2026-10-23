const User = require('../models/User');
const Product = require('../models/Product');

// @desc    Get current user's wishlist
// @route   GET /api/wishlist
// @access  Private
const getWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'wishlist',
      populate: {
        path: 'seller',
        select: 'name profileImage',
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    // Filter out null/deleted products that might still exist in the array
    const validWishlist = (user.wishlist || []).filter((item) => item !== null);

    res.status(200).json({
      success: true,
      count: validWishlist.length,
      wishlist: validWishlist,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a product to wishlist
// @route   POST /api/wishlist/:productId
// @access  Private
const addToWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    const user = await User.findById(req.user._id);

    // Prevent duplicates
    const alreadyInWishlist = user.wishlist.some(
      (id) => id.toString() === productId.toString()
    );

    if (alreadyInWishlist) {
      return res.status(400).json({
        success: false,
        message: 'Product is already in your wishlist.',
      });
    }

    user.wishlist.push(product._id);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Product added to wishlist.',
      wishlist: user.wishlist,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove a product from wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Private
const removeFromWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const user = await User.findById(req.user._id);

    user.wishlist = user.wishlist.filter(
      (id) => id.toString() !== productId.toString()
    );

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Product removed from wishlist.',
      wishlist: user.wishlist,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
};
