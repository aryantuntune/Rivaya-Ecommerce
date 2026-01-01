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
                            <form onSubmit={handleSubmit}>
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
                                        <span>UPI</span>
                                    </label>
                                </div>
                                <button type="submit" className="btn btn-primary">Place Order</button>
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
