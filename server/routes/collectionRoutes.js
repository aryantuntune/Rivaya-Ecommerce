const express = require('express');
const {
    getCollections,
    getCollection,
    createCollection,
    updateCollection,
    deleteCollection
} = require('../controllers/collectionController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router
    .route('/')
    .get(getCollections)
    .post(protect, authorize('admin'), createCollection);

router
    .route('/:id')
    .get(getCollection)
    .put(protect, authorize('admin'), updateCollection)
    .delete(protect, authorize('admin'), deleteCollection);

module.exports = router;
