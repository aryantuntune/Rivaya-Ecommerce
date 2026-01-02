const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
    image: {
        type: String,
        required: [true, 'Banner image is required']
    },
    title: {
        type: String,
        required: [true, 'Banner title is required']
    },
    subtitle: {
        type: String,
        required: [true, 'Banner subtitle is required']
    },
    link: {
        type: String,
        default: '/shop'
    },
    enabled: {
        type: Boolean,
        default: true
    },
    order: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Banner', bannerSchema);
