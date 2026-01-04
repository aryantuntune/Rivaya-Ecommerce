import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAdmin } from '../context/AdminContext';
import { Check } from 'lucide-react';
import './Checkout.css';

const Checkout = () => {
    const navigate = useNavigate();
    const { cartItems, cartTotal, clearCart } = useCart();
    const { currentUser, createOrder } = useAdmin();
    const [step, setStep] = useState(1);
    const [shippingAddress, setShippingAddress] = useState({
        fullName: '',
        phone: '',
        addressLine1: '',
        city: '',
        state: '',
        pincode: ''
    });
    const [paymentMethod, setPaymentMethod] = useState('COD');

    if (!currentUser) {
        return (
            <div className="checkout-page">
                <div className="container">
                    <div className="checkout-login-prompt">
                        <h2>Please Login to Checkout</h2>
                        <p>You need to be logged in to place an order.</p>
                        <button className="btn btn-primary" onClick={() => navigate('/')}>
                            Go to Home
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (step === 1) {
            setStep(2);
        } else if (step === 2) {
            setStep(3);
        } else {
            // Create order
            const order = createOrder({
                user: currentUser.id,
                items: cartItems.map(item => ({
                    product: item,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    size: item.size,
                    image: item.image
                })),
                shippingAddress,
                paymentMethod,
                subtotal: cartTotal,
                shippingCost: cartTotal > 999 ? 0 : 99,
                total: cartTotal > 999 ? cartTotal : cartTotal + 99
            });

            clearCart();
            navigate(`/order-confirmation/${order.id}`);
        }
    };

    return (
        <div className="checkout-page">
            <div className="container">
                <div className="checkout-progress">
                    <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
                        {step > 1 ? <Check size={20} /> : '1'}
                        <span>Cart</span>
                    </div>
                    <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
                        {step > 2 ? <Check size={20} /> : '2'}
                        <span>Shipping</span>
                    </div>
                    <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
                        {step > 3 ? <Check size={20} /> : '3'}
                        <span>Payment</span>
                    </div>
                </div>

                <div className="checkout-content">
                    <div className="checkout-form">
                        {step === 1 && (
                            <div>
                                <h2>Review Your Cart</h2>
                                {cartItems.map(item => (
                                    <div key={`${item.id}-${item.size}`} className="checkout-item">
                                        <img src={item.image} alt={item.name} />
                                        <div>
                                            <h4>{item.name}</h4>
                                            <p>Size: {item.size} | Qty: {item.quantity}</p>
                                            <p className="price">₹{item.price * item.quantity}</p>
                                        </div>
                                    </div>
                                ))}
                                <button className="btn btn-primary" onClick={() => setStep(2)}>
                                    Continue to Shipping
                                </button>
                            </div>
                        )}

                        {step === 2 && (
                            <form onSubmit={handleSubmit}>
                                <h2>Shipping Address</h2>
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    required
                                    value={shippingAddress.fullName}
                                    onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                                />
                                <input
                                    type="tel"
                                    placeholder="Phone"
                                    required
                                    value={shippingAddress.phone}
                                    onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                                />
                                <input
                                    type="text"
                                    placeholder="Address"
                                    required
                                    value={shippingAddress.addressLine1}
                                    onChange={(e) => setShippingAddress({ ...shippingAddress, addressLine1: e.target.value })}
                                />
                                <input
                                    type="text"
                                    placeholder="City"
                                    required
                                    value={shippingAddress.city}
                                    onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                                />
                                <input
                                    type="text"
                                    placeholder="State"
                                    required
                                    value={shippingAddress.state}
                                    onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                                />
                                <input
                                    type="text"
                                    placeholder="Pincode"
                                    required
                                    maxLength={6}
                                    value={shippingAddress.pincode}
                                    onChange={(e) => setShippingAddress({ ...shippingAddress, pincode: e.target.value })}
                                />
                                <button type="submit" className="btn btn-primary">Continue to Payment</button>
                            </form>
                        )}

                        {step === 3 && (
                            <form onSubmit={async (e) => {
                                e.preventDefault();
                                if (paymentMethod === 'COD') {
                                    // Existing COD Logic
                                    const order = await createOrder({
                                        user: currentUser.id || currentUser._id, // Ensure ID is present
                                        items: cartItems.map(item => ({
                                            product: item.id || item._id,     // Backend expects Product ID
                                            name: item.name,
                                            price: item.price,
                                            quantity: item.quantity,
                                            size: item.size,
                                            image: item.image
                                        })),
                                        shippingAddress,
                                        paymentMethod: 'COD',
                                        paymentStatus: 'Pending',
                                        subtotal: cartTotal,
                                        shippingCost: cartTotal > 999 ? 0 : 99,
                                        total: cartTotal > 999 ? cartTotal : cartTotal + 99
                                    });
                                    if (order) {
                                        clearCart();
                                        navigate(`/order-confirmation/${order.id || order._id}`);
                                    } else {
                                        alert("Failed to place order. Please try again.");
                                    }
                                } else if (paymentMethod === 'UPI' || paymentMethod === 'Card') {
                                    // Razorpay Logic
                                    try {
                                        // 1. Get Key
                                        const { key } = await fetch('http://localhost:5000/api/payment/key').then(res => res.json());

                                        // 2. Create Order on Server
                                        const totalAmount = cartTotal > 999 ? cartTotal : cartTotal + 99;
                                        const { order } = await fetch('http://localhost:5000/api/payment/create-order', {
                                            method: 'POST',
                                            headers: {
                                                'Content-Type': 'application/json',
                                                'Authorization': `Bearer ${localStorage.getItem('token')}`
                                            },
                                            body: JSON.stringify({ amount: totalAmount })
                                        }).then(res => res.json());

                                        if (!order) {
                                            alert("Server error. Could not initiate payment.");
                                            return;
                                        }

                                        // 3. Open Razorpay
                                        const options = {
                                            key: key,
                                            amount: order.amount,
                                            currency: "INR",
                                            name: "Rivaya",
                                            description: "Purchase from Rivaya Online",
                                            image: "/vite.svg", // Replace with logo URL
                                            order_id: order.id,
                                            handler: async function (response) {
                                                // 4. On Success, verify and create internal order
                                                const verifyRes = await fetch('http://localhost:5000/api/payment/verify', {
                                                    method: 'POST',
                                                    headers: {
                                                        'Content-Type': 'application/json',
                                                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                                                    },
                                                    body: JSON.stringify({
                                                        razorpay_order_id: response.razorpay_order_id,
                                                        razorpay_payment_id: response.razorpay_payment_id,
                                                        razorpay_signature: response.razorpay_signature
                                                    })
                                                });

                                                const verifyData = await verifyRes.json();

                                                if (verifyData.success) {
                                                    // Create the actual order in DB
                                                    const finalOrder = await createOrder({
                                                        user: currentUser.id || currentUser._id,
                                                        items: cartItems.map(item => ({
                                                            product: item.id || item._id,
                                                            name: item.name,
                                                            price: item.price,
                                                            quantity: item.quantity,
                                                            size: item.size,
                                                            image: item.image
                                                        })),
                                                        shippingAddress,
                                                        paymentMethod: 'Online',
                                                        paymentResult: {
                                                            id: response.razorpay_payment_id,
                                                            status: 'Success',
                                                            email_address: currentUser.email,
                                                        },
                                                        isPaid: true,
                                                        paidAt: Date.now(),
                                                        subtotal: cartTotal,
                                                        shippingCost: cartTotal > 999 ? 0 : 99,
                                                        total: totalAmount
                                                    });

                                                    clearCart();
                                                    navigate(`/order-confirmation/${finalOrder.id || finalOrder._id}`);
                                                } else {
                                                    alert("Payment verification failed!");
                                                }
                                            },
                                            prefill: {
                                                name: shippingAddress.fullName,
                                                email: currentUser.email,
                                                contact: shippingAddress.phone
                                            },
                                            theme: {
                                                color: "#5e1e2d"
                                            }
                                        };
                                        const rzp1 = new window.Razorpay(options);
                                        rzp1.open();

                                    } catch (err) {
                                        console.error("Payment Error: ", err);
                                        alert("Something went wrong with payment.");
                                    }
                                }
                            }}>
                                <h2>Payment Method</h2>
                                <div className="payment-options">
                                    <label className="payment-option">
                                        <input
                                            type="radio"
                                            name="payment"
                                            value="COD"
                                            checked={paymentMethod === 'COD'}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                        />
                                        <span>Cash on Delivery</span>
                                    </label>
                                    <label className="payment-option">
                                        <input
                                            type="radio"
                                            name="payment"
                                            value="UPI"
                                            checked={paymentMethod === 'UPI'}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                        />
                                        <span>Online Payment (UPI / Card)</span>
                                    </label>
                                </div>
                                <button type="submit" className="btn btn-primary">Place Order & Pay</button>
                            </form>
                        )}
                    </div>

                    <div className="order-summary">
                        <h3>Order Summary</h3>
                        <div className="summary-row">
                            <span>Subtotal</span>
                            <span>₹{cartTotal}</span>
                        </div>
                        <div className="summary-row">
                            <span>Shipping</span>
                            <span>{cartTotal > 999 ? 'FREE' : '₹99'}</span>
                        </div>
                        <div className="summary-row total">
                            <span>Total</span>
                            <span>₹{cartTotal > 999 ? cartTotal : cartTotal + 99}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
