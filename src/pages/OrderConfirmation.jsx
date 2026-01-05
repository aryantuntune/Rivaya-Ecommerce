import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import { Check, Package, Truck } from 'lucide-react';
import './OrderConfirmation.css';

const OrderConfirmation = () => {
    const { orderId } = useParams();
    const { getOrder } = useAdmin();
    const [order, setOrder] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchOrder = async () => {
            if (orderId) {
                const data = await getOrder(orderId);
                if (data) {
                    setOrder(data);
                }
            }
            setLoading(false);
        };
        fetchOrder();
    }, [orderId, getOrder]);

    if (loading) {
        return (
            <div className="order-confirmation-page">
                <div className="container" style={{ textAlign: 'center', paddingTop: '4rem' }}>
                    <div className="spinner"></div>
                    <p>Loading Order Details...</p>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="order-confirmation-page">
                <div className="container">
                    <h2>Order not found</h2>
                    <Link to="/" className="btn btn-primary">Go to Home</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="order-confirmation-page">
            <div className="container">
                <div className="confirmation-card">
                    <div className="success-icon">
                        <Check size={64} />
                    </div>

                    <h1>Order Confirmed!</h1>
                    <p className="order-number">Order #{order.id}</p>

                    <p className="confirmation-message">
                        Thank you for your order! We've sent a confirmation email to your registered email address.
                    </p>

                    <div className="order-timeline">
                        <div className="timeline-step active">
                            <Package size={24} />
                            <span>Order Placed</span>
                        </div>
                        <div className="timeline-step">
                            <Truck size={24} />
                            <span>Shipping Soon</span>
                        </div>
                        <div className="timeline-step">
                            <Check size={24} />
                            <span>Delivered</span>
                        </div>
                    </div>

                    <div className="order-details">
                        <h3>Order Summary</h3>

                        <div className="order-items">
                            {order.items.map((item, index) => (
                                <div key={index} className="order-item">
                                    <img src={item.image} alt={item.name} />
                                    <div>
                                        <h4>{item.name}</h4>
                                        <p>Size: {item.size} | Qty: {item.quantity}</p>
                                        <p className="item-price">₹{item.price * item.quantity}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="order-total">
                            <div className="total-row">
                                <span>Subtotal:</span>
                                <span>₹{order.subtotal}</span>
                            </div>
                            <div className="total-row">
                                <span>Shipping:</span>
                                <span>₹{order.shippingCost}</span>
                            </div>
                            <div className="total-row grand-total">
                                <span>Total:</span>
                                <span>₹{order.total}</span>
                            </div>
                        </div>

                        <div className="shipping-address">
                            <h4>Shipping Address</h4>
                            <p>{order.shippingAddress.fullName}</p>
                            <p>{order.shippingAddress.addressLine1}</p>
                            <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
                            <p>Phone: {order.shippingAddress.phone}</p>
                        </div>

                        <div className="payment-method">
                            <h4>Payment Method</h4>
                            <p>{order.paymentMethod}</p>
                        </div>
                    </div>

                    <div className="confirmation-actions">
                        <Link to="/" className="btn btn-primary">Continue Shopping</Link>
                        <Link to="/shop" className="btn btn-outline">View More Products</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};
/*comment*/
export default OrderConfirmation;
