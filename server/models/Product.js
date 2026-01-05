const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true,
        index: true
    },
    description: {
        type: String,
        required: [true, 'Product description is required']
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        index: true
        // Removed strict enum to allow flexible categories like 'Women', 'Men', 'Accessories'
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: 0,
        index: true
    },
    originalPrice: {
        type: Number,
        min: 0
    },
    images: [{
        type: String,
        required: true
    }],
    colors: [{
        type: String
    }],
    sizes: [{
        type: String
    }],
    variants: [{
        size: { type: String, required: true },
        stock: { type: Number, default: 0 },
        sku: { type: String }
    }],
    inStock: {
        type: Boolean,
        default: true
    },
    stockQuantity: {
        type: Number,
        default: 0
    },
    isNewArrival: { // Renamed from isNew to avoid conflict
        type: Boolean,
        default: false
    },
    trending: {
        type: Boolean,
        default: false
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    reviews: [{
        user: { type: String, required: true },
        rating: { type: Number, required: true },
        comment: { type: String, required: true },
        verified: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now }
    }],
    numReviews: {
        type: Number,
        default: 0
    },
    collections: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Collection'
    }],
    analytics: {
        views: { type: Number, default: 0 },
        addToCart: { type: Number, default: 0 },
        wishlist: { type: Number, default: 0 },
        purchases: { type: Number, default: 0 }
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
