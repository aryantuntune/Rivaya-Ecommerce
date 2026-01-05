const Razorpay = require('razorpay');
const crypto = require('crypto');
const dotenv = require('dotenv');

dotenv.config();

// Initialize Razorpay conditionally or lazily to prevent boot crash
const getRazorpayInstance = () => {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
        console.error("Razorpay Keys Missing in Environment!");
        return null;
    }
    return new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET
    });
};

// @desc    Create Razorpay Order
// @route   POST /api/payment/create-order
// @access  Private
const createRazorpayOrder = async (req, res) => {
    try {
        const { amount } = req.body; // Amount in INR
        console.log(`Creating Razorpay Order. Amount: ${amount}`);

        if (!amount) {
            return res.status(400).json({ success: false, message: 'Amount is required' });
        }

        const razorpay = getRazorpayInstance();
        if (!razorpay) {
            return res.status(500).json({ success: false, message: 'Server Payment Configuration Missing' });
        }

        const options = {
            amount: Math.round(amount * 100), // Razorpay accepts amount in paise
            currency: 'INR',
            receipt: `receipt_${Date.now()}`
        };

        const order = await razorpay.orders.create(options);

        res.json({
            success: true,
            order
        });
    } catch (error) {
        console.error('Razorpay Create Order Error:', error);
        res.status(500).json({ success: false, message: 'Payment initiation failed', error: error.message });
    }
};

// @desc    Verify Razorpay Payment Signature
// @route   POST /api/payment/verify
// @access  Private
const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'YOUR_KEY_SECRET')
            .update(body.toString())
            .digest('hex');

        if (expectedSignature === razorpay_signature) {
            res.json({ success: true, message: 'Payment verified successfully' });
        } else {
            res.status(400).json({ success: false, message: 'Invalid payment signature' });
        }
    } catch (error) {
        console.error('Payment Verification Error:', error);
        res.status(500).json({ success: false, message: 'Payment verification failed' });
    }
};

// @desc    Get Razorpay Key ID (for frontend)
// @route   GET /api/payment/key
// @access  Public
const getRazorpayKey = (req, res) => {
    res.json({ key: process.env.RAZORPAY_KEY_ID || 'rzp_test_YOUR_KEY_ID' });
};

module.exports = {
    createRazorpayOrder,
    verifyPayment,
    getRazorpayKey
};
