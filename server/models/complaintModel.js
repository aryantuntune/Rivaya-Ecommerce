const mongoose = require('mongoose');

const complaintSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    issue: { type: String, required: true },
    status: { type: String, default: 'Pending' },
    date: { type: Date, default: Date.now }
}, {
    timestamps: true
});

module.exports = mongoose.model('Complaint', complaintSchema);
