const Product = require('../models/Product');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res) => {
    try {
        const { category, search, minPrice, maxPrice, sort } = req.query;

        let query = {};

        // Filter by category
        if (category) {
            query.category = category;
        }

        // Search
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        // Price range
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        let products = Product.find(query);

        // Sorting
        if (sort) {
            const sortBy = sort === 'price-low' ? 'price' :
                sort === 'price-high' ? '-price' :
                    sort === 'newest' ? '-createdAt' :
                        sort === 'rating' ? '-rating' : '-createdAt';
            products = products.sort(sortBy);
        } else {
            products = products.sort('-createdAt');
        }

        // Pagination
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 1000; // Default buffer large enough for current frontend
        const startIndex = (page - 1) * limit;
        const total = await Product.countDocuments(query);

        products = products.skip(startIndex).limit(limit);

        const result = await products;

        res.status(200).json({
            success: true,
            count: result.length,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            },
            data: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Increment view count
        product.analytics.views += 1;
        await product.save();

        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Create product (Admin only)
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);

        res.status(201).json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update product (Admin only)
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete product (Admin only)
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Track product interaction
// @route   POST /api/products/:id/track
// @access  Public
exports.trackInteraction = async (req, res) => {
    try {
        const { type } = req.body; // 'addToCart', 'wishlist', 'purchase'
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        if (type === 'addToCart') {
            product.analytics.addToCart += 1;
        } else if (type === 'wishlist') {
            product.analytics.wishlist += 1;
        } else if (type === 'purchase') {
            product.analytics.purchases += 1;
        }

        await product.save();

        res.status(200).json({
            success: true,
            data: product.analytics
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private/Admin
exports.createProductReview = async (req, res) => {
    try {
        const { rating, comment, user } = req.body;
        const product = await Product.findById(req.params.id);

        if (product) {
            const review = {
                user: user || 'Anonymous',
                rating: Number(rating),
                comment,
                verified: true
            };

            product.reviews.push(review);
            product.numReviews = product.reviews.length;
            product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

            await product.save();

            // Return updated product or just success
            res.status(201).json({
                success: true,
                message: 'Review added',
                data: product
            });
        } else {
            res.status(404).json({ success: false, message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete review
// @route   DELETE /api/products/:id/reviews/:reviewId
// @access  Private/Admin
exports.deleteProductReview = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            // Find review index
            const reviewIndex = product.reviews.findIndex(r => r._id.toString() === req.params.reviewId);

            if (reviewIndex === -1) {
                return res.status(404).json({ success: false, message: 'Review not found' });
            }

            product.reviews.splice(reviewIndex, 1);
            product.numReviews = product.reviews.length;

            product.rating = product.reviews.length > 0
                ? product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length
                : 0;

            await product.save();
            res.status(200).json({ success: true, message: 'Review removed', data: product });
        } else {
            res.status(404).json({ success: false, message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
