const express = require('express');
const router = express.Router();
const {
    getComplaints,
    createComplaint,
    resolveComplaint
} = require('../controllers/complaintController');

router.route('/').get(getComplaints).post(createComplaint);
router.route('/:id/resolve').put(resolveComplaint);

module.exports = router;
