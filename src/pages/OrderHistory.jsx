import React, { useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { Package, Clock, CheckCircle, Truck } from 'lucide-react';
import './OrderHistory.css';

const OrderHistory = () => {
    const { currentUser, orders, getStats, logout } = useAdmin();
    const navigate = useNavigate();

    if (!currentUser) {
        return <Navigate to="/" />;
    }

    const myOrders = orders.filter(o => o.user === currentUser.id || o.user === currentUser._id || o.email === currentUser.email);

    const handleDeleteAccount = async () => {
        if (window.confirm("Are you sure? This will delete your account and all data permanently. This cannot be undone.")) {
            const success = await deleteAccount();
            if (success) {
                alert("Account Deleted. We are sorry to see you go.");
                logout();
                navigate('/');
            } else {
                alert("Failed to delete account");
            }
        }
    };

    return (
        <div className="order-history-page">
            <div className="container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h1>My Orders</h1>
                    <button onClick={handleDeleteAccount} style={{ background: 'transparent', color: 'red', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
                        Delete My Account
                    </button>
                </div>

                <div className="orders-list">
                    {myOrders.length > 0 ? (
                        myOrders.map(order => (
                            <div key={order.id} className="order-card">
                                <div className="order-header">
                                    <div className="order-id">
                                        <h3>Order #{order.id}</h3>
                                        <span className="order-date">{new Date(order.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <div className="order-status-badge status-{order.orderStatus.toLowerCase()}">
                                        {getOrderIcon(order.orderStatus)}
                                        {order.orderStatus}
                                    </div>
                                </div>
                                <div className="order-items">
                                    {order.items.map((item, idx) => (
                                        <div key={idx} className="order-item-row">
                                            <span>{item.name} x {item.quantity}</span>
                                            <span>₹{item.price * item.quantity}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="order-footer">
                                    <span className="total-label">Total Amount</span>
                                    <span className="total-amount">₹{order.total}</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="empty-orders">
                            <Package size={48} />
                            <p>You haven't placed any orders yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const getOrderIcon = (status) => {
    switch (status) {
        case 'Delivered': return <CheckCircle size={14} />;
        case 'Shipped': return <Truck size={14} />;
        default: return <Clock size={14} />;
    }
};

export default OrderHistory;
