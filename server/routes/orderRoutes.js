const express = require('express');
const {
    createOrder,
    getMyOrders,
    getOrder,
    getAllOrders,
    updateOrderStatus
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect); // Protect all order routes

router
    .route('/')
    .post(createOrder)
    .get(authorize('admin'), getAllOrders);

router.get('/my-orders', getMyOrders);

router
    .route('/:id')
    .get(getOrder);

router.put('/:id/status', authorize('admin'), updateOrderStatus);

module.exports = router;
