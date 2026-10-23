const Product = require('../models/Product');
const User = require('../models/User');

// @desc    Get all products with filtering, search, sorting, and pagination
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    const {
      search,
      category,
      condition,
      location,
      minPrice,
      maxPrice,
      status = 'active',
      featured,
      sort = 'newest',
      page = 1,
      limit = 12,
    } = req.query;

    const query = {};

    // Filter by status (default active unless specified 'all')
    if (status !== 'all') {
      query.status = status;
    }

    // Filter by category
    if (category && category !== 'All' && category !== 'all') {
      query.category = category;
    }

    // Filter by condition
    if (condition && condition !== 'All' && condition !== 'all') {
      query.condition = condition;
    }

    // Filter by location
    if (location && location.trim() !== '') {
      query.location = { $regex: location.trim(), $options: 'i' };
    }

    // Filter by price range
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice && !isNaN(Number(minPrice))) {
        query.price.$gte = Number(minPrice);
      }
      if (maxPrice && !isNaN(Number(maxPrice))) {
        query.price.$lte = Number(maxPrice);
      }
    }

    // Filter by featured
    if (featured === 'true' || featured === true) {
      query.featured = true;
    }

    // Keyword search across title and description
    if (search && search.trim() !== '') {
      const searchRegex = { $regex: search.trim(), $options: 'i' };
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { location: searchRegex },
      ];
    }

    // Sorting logic
    let sortOptions = { createdAt: -1 }; // default newest
    if (sort === 'oldest') {
      sortOptions = { createdAt: 1 };
    } else if (sort === 'price-asc' || sort === 'lowest') {
      sortOptions = { price: 1 };
    } else if (sort === 'price-desc' || sort === 'highest') {
      sortOptions = { price: -1 };
    }

    // Pagination
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 12));
    const skip = (pageNum - 1) * limitNum;

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('seller', 'name profileImage location createdAt')
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    const totalPages = Math.ceil(total / limitNum) || 1;

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      totalPages,
      currentPage: pageNum,
      products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by ID with related products
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      'seller',
      'name email phone profileImage createdAt'
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product listing not found.',
      });
    }

    // Fetch related products in the same category
    const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
      status: 'active',
    })
      .limit(4)
      .select('title price images category condition location createdAt');

    res.status(200).json({
      success: true,
      data: {
        product,
        relatedProducts,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new product listing
// @route   POST /api/products
// @access  Private
const createProduct = async (req, res, next) => {
  try {
    const { title, description, price, category, condition, location, featured } =
      req.body;

    // Collect images from uploaded files or image URL list
    let imageUrls = [];

    if (req.files && req.files.length > 0) {
      imageUrls = req.files.map((file) => `/uploads/${file.filename}`);
    }

    if (req.body.images) {
      let extra = req.body.images;
      if (typeof extra === 'string') {
        try {
          extra = JSON.parse(extra);
        } catch {
          extra = [extra];
        }
      }
      if (Array.isArray(extra)) {
        imageUrls = [...imageUrls, ...extra.filter((url) => typeof url === 'string' && url.trim())];
      }
    }

    if (imageUrls.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least one product image or URL.',
      });
    }

    if (!title || !description || price === undefined || !category || !condition || !location) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields: title, description, price, category, condition, location.',
      });
    }

    const numericPrice = Number(price);
    if (isNaN(numericPrice) || numericPrice < 0) {
      return res.status(400).json({
        success: false,
        message: 'Price must be a valid positive number in INR.',
      });
    }

    const product = await Product.create({
      title: title.trim(),
      description: description.trim(),
      price: numericPrice,
      category,
      condition,
      images: imageUrls,
      location: location.trim(),
      seller: req.user._id,
      featured: featured === 'true' || featured === true,
      status: 'active',
    });

    const populatedProduct = await Product.findById(product._id).populate(
      'seller',
      'name profileImage phone'
    );

    res.status(201).json({
      success: true,
      message: 'Product listed successfully.',
      data: populatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a product listing
// @route   PUT /api/products/:id
// @access  Private (Owner only)
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    // Verify ownership
    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only edit your own listings.',
      });
    }

    const {
      title,
      description,
      price,
      category,
      condition,
      location,
      status,
      featured,
    } = req.body;

    if (title) product.title = title.trim();
    if (description) product.description = description.trim();
    if (price !== undefined) {
      const num = Number(price);
      if (isNaN(num) || num < 0) {
        return res.status(400).json({
          success: false,
          message: 'Price must be a valid non-negative number.',
        });
      }
      product.price = num;
    }
    if (category) product.category = category;
    if (condition) product.condition = condition;
    if (location) product.location = location.trim();
    if (status && ['active', 'sold'].includes(status)) product.status = status;
    if (featured !== undefined) product.featured = featured === 'true' || featured === true;

    // Update images if provided
    let newImages = [];
    if (req.files && req.files.length > 0) {
      newImages = req.files.map((file) => `/uploads/${file.filename}`);
    }
    if (req.body.images) {
      let extra = req.body.images;
      if (typeof extra === 'string') {
        try {
          extra = JSON.parse(extra);
        } catch {
          extra = [extra];
        }
      }
      if (Array.isArray(extra) && extra.length > 0) {
        newImages = [...newImages, ...extra.filter((url) => typeof url === 'string' && url.trim())];
      }
    }
    if (newImages.length > 0) {
      product.images = newImages;
    }

    await product.save();

    res.status(200).json({
      success: true,
      message: 'Product updated successfully.',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle or change product status (active / sold)
// @route   PATCH /api/products/:id/status
// @access  Private (Owner only)
const updateProductStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!status || !['active', 'sold'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be either 'active' or 'sold'.",
      });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only update the status of your own listings.',
      });
    }

    product.status = status;
    await product.save();

    res.status(200).json({
      success: true,
      message: `Product marked as ${status}.`,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product listing
// @route   DELETE /api/products/:id
// @access  Private (Owner only)
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only delete your own listings.',
      });
    }

    // Trigger schema pre-remove cleanup for wishlists & inquiries
    await Product.findOneAndDelete({ _id: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Listing deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get listings created by the authenticated user
// @route   GET /api/users/me/listings
// @access  Private
const getMyListings = async (req, res, next) => {
  try {
    const products = await Product.find({ seller: req.user._id }).sort({
      createdAt: -1,
    });

    const activeCount = products.filter((p) => p.status === 'active').length;
    const soldCount = products.filter((p) => p.status === 'sold').length;

    res.status(200).json({
      success: true,
      count: products.length,
      activeCount,
      soldCount,
      products,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  updateProductStatus,
  deleteProduct,
  getMyListings,
};
