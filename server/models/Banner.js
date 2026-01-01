const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    backgroundColor: {
        type: String,
        default: '#ff0000'
    },
    textColor: {
        type: String,
        default: '#ffffff'
    },
    link: {
        type: String,
        default: '/shop'
    },
    enabled: {
        type: Boolean,
        default: false
    },
    countdown: {
        enabled: { type: Boolean, default: false },
        endDate: Date
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Banner', bannerSchema);
