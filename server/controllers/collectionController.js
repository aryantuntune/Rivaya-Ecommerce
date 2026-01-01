const Collection = require('../models/Collection');
const Product = require('../models/Product');

// @desc    Get all collections
// @route   GET /api/collections
// @access  Public
exports.getCollections = async (req, res) => {
    try {
        const collections = await Collection.find({ isActive: true }).populate('products');

        res.status(200).json({
            success: true,
            count: collections.length,
            data: collections
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get single collection
// @route   GET /api/collections/:id
// @access  Public
exports.getCollection = async (req, res) => {
    try {
        const collection = await Collection.findById(req.params.id).populate('products');

        if (!collection) {
            return res.status(404).json({
                success: false,
                message: 'Collection not found'
            });
        }

        res.status(200).json({
            success: true,
            data: collection
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Create collection
// @route   POST /api/collections
// @access  Private/Admin
exports.createCollection = async (req, res) => {
    try {
        const collection = await Collection.create(req.body);

        res.status(201).json({
            success: true,
            data: collection
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update collection
// @route   PUT /api/collections/:id
// @access  Private/Admin
exports.updateCollection = async (req, res) => {
    try {
        const collection = await Collection.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!collection) {
            return res.status(404).json({
                success: false,
                message: 'Collection not found'
            });
        }

        res.status(200).json({
            success: true,
            data: collection
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete collection
// @route   DELETE /api/collections/:id
// @access  Private/Admin
exports.deleteCollection = async (req, res) => {
    try {
        const collection = await Collection.findByIdAndDelete(req.params.id);

        if (!collection) {
            return res.status(404).json({
                success: false,
                message: 'Collection not found'
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
