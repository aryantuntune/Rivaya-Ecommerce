const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res) => {
    try {
        const {
            items,
            shippingAddress,
            paymentMethod,
            subtotal,
            shippingCost,
            total
        } = req.body;

        // 1. Verify Stock & Decrement
        for (const item of items) {
            const product = await Product.findById(item.product);
            if (!product) {
                return res.status(404).json({ success: false, message: `Product not found` });
            }

            // Check for variants (size-based stock)
            if (product.variants && product.variants.length > 0 && item.size) {
                console.log(`Checking Stock for ${product.name}. Variant Size: '${item.size}'`);
                console.log('Available Variants:', JSON.stringify(product.variants));

                const variantIndex = product.variants.findIndex(v => v.size === item.size);
                console.log(`Variant Index found: ${variantIndex}`);

                if (variantIndex === -1) {
                    console.error(`Size Mismatch! Requested: '${item.size}', Available: ${product.variants.map(v => `'${v.size}'`).join(', ')}`);
                    return res.status(400).json({ success: false, message: `Size ${item.size} invalid for ${product.name}` });
                }

                if (Number(product.variants[variantIndex].stock) < Number(item.quantity)) {
                    console.error(`Insufficient Stock! Requested: ${item.quantity}, Available: ${product.variants[variantIndex].stock}`);
                    return res.status(400).json({ success: false, message: `${product.name} (Size: ${item.size}) is out of stock` });
                }

                // Decrement variant stock
                product.variants[variantIndex].stock -= item.quantity;

                // Also decrement global stock if it's being tracked
                if (product.stockQuantity >= item.quantity) {
                    product.stockQuantity -= item.quantity;
                }
            } else {
                // Fallback for non-variant products
                if (product.stockQuantity < item.quantity) {
                    return res.status(400).json({ success: false, message: `${product.name} is out of stock` });
                }
                // Decrement stock
                product.stockQuantity -= item.quantity;
            }

            // Update analytics
            product.analytics.purchases += item.quantity;
            await product.save();
        }

        // 2. Create Order
        const order = await Order.create({
            user: req.user.id,
            items,
            shippingAddress,
            paymentMethod,
            subtotal,
            shippingCost,
            total
        });

        // 3. Send Email Notification (Non-blocking)
        const sendEmail = require('../utils/sendEmail');
        sendEmail({
            email: req.user.email,
            subject: 'Rivaya Order Confirmation',
            message: `<h1>Thank You for Your Order!</h1>
                      <p>Order ID: <b>${order._id}</b> has been placed successfully.</p>
                      <p>Total: ₹${total}</p>
                      <p>We will notify you once it ships.</p>`
        }).catch(err => console.error('Email sending failed (background):', err));

        res.status(201).json({
            success: true,
            data: order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get user's orders
// @route   GET /api/orders/my-orders
// @access  Private
exports.getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id })
            .populate('items.product')
            .sort('-createdAt');

        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
exports.getOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('items.product');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Make sure user is order owner or admin
        if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this order'
            });
        }

        res.status(200).json({
            success: true,
            data: order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('user', 'name email')
            .populate('items.product')
            .sort('-createdAt');

        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderStatus, paymentStatus } = req.body;

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        if (orderStatus) order.orderStatus = orderStatus;
        if (paymentStatus) order.paymentStatus = paymentStatus;

        await order.save();

        res.status(200).json({
            success: true,
            data: order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
