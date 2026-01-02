const Complaint = require('../models/complaintModel');

// @desc    Get all complaints
// @route   GET /api/complaints
// @access  Private/Admin
const getComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find({}).sort({ date: -1 });
        res.json(complaints);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new complaint
// @route   POST /api/complaints
// @access  Public
const createComplaint = async (req, res) => {
    try {
        const { name, email, issue } = req.body;
        const complaint = new Complaint({
            name,
            email,
            issue,
            status: 'Pending',
            date: new Date()
        });
        const createdComplaint = await complaint.save();
        res.status(201).json(createdComplaint);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Resolve a complaint
// @route   PUT /api/complaints/:id/resolve
// @access  Private/Admin
const resolveComplaint = async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id);
        if (complaint) {
            complaint.status = 'Resolved';
            const updatedComplaint = await complaint.save();
            res.json(updatedComplaint);
        } else {
            res.status(404).json({ message: 'Complaint not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { getComplaints, createComplaint, resolveComplaint };
