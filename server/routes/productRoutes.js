const express = require('express');
const {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    trackInteraction,
    createProductReview,
    deleteProductReview
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router
    .route('/')
    .get(getProducts)
    .post(protect, authorize('admin'), createProduct);

router
    .route('/:id')
    .get(getProduct)
    .put(protect, authorize('admin'), updateProduct)
    .delete(protect, authorize('admin'), deleteProduct);

router.route('/:id/reviews').post(protect, createProductReview);
router.route('/:id/reviews/:reviewId').delete(protect, authorize('admin'), deleteProductReview);

router.post('/:id/track', trackInteraction);

module.exports = router;
