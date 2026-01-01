import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { Navigate } from 'react-router-dom';
import { Package, ShoppingBag, Users, DollarSign, TrendingUp, Eye, FileText } from 'lucide-react';
import AdminProductManager from '../components/AdminProductManager';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const { currentUser, products, orders, users, getStats, updateBanner, banner, heroBanners, toggleHeroBanner } = useAdmin();
    const [activeTab, setActiveTab] = useState('overview');

    if (!currentUser || currentUser.role !== 'admin') {
        return <Navigate to="/" />;
    }

    const stats = getStats();

    return (
        <div className="admin-dashboard">
            <div className="admin-sidebar">
                <div className="sidebar-header">
                    <h2>Admin Panel</h2>
                </div>
                <nav>
                    <button className={activeTab === 'overview' ? 'active' : ''} onClick={() => setActiveTab('overview')}><TrendingUp size={18} /> Overview</button>
                    <button className={activeTab === 'products' ? 'active' : ''} onClick={() => setActiveTab('products')}><Package size={18} /> Products & Inventory</button>
                    <button className={activeTab === 'orders' ? 'active' : ''} onClick={() => setActiveTab('orders')}><ShoppingBag size={18} /> Orders</button>
                    <button className={activeTab === 'banners' ? 'active' : ''} onClick={() => setActiveTab('banners')}><FileText size={18} /> Banners & Content</button>
                </nav>
            </div>

            <div className="admin-content">
                <div className="admin-container">
                    {activeTab === 'overview' && (
                        <>
                            <h1>Dashboard Overview</h1>
                            {/* Stats Cards */}
                            <div className="stats-grid">
                                <div className="stat-card">
                                    <Package size={32} />
                                    <div>
                                        <h3>{stats.totalProducts}</h3>
                                        <p>Total Products</p>
                                    </div>
                                </div>
                                {/* ... other stats ... */}
                                <div className="stat-card">
                                    <ShoppingBag size={32} />
                                    <div>
                                        <h3>{stats.totalOrders}</h3>
                                        <p>Total Orders</p>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <Users size={32} />
                                    <div>
                                        <h3>{stats.totalCustomers}</h3>
                                        <p>Customers</p>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <DollarSign size={32} />
                                    <div>
                                        <h3>₹{stats.totalRevenue.toLocaleString()}</h3>
                                        <p>Total Revenue</p>
                                    </div>
                                </div>
                            </div>

                            <div className="admin-section">
                                <h2>Recent Orders</h2>
                                <div className="orders-table">
                                    {orders.slice(0, 5).map(order => (
                                        <div key={order.id} className="order-row">
                                            <div>
                                                <strong>Order #{order.id}</strong>
                                                <p>{order.items.length} items</p>
                                            </div>
                                            <div>
                                                <p>₹{order.total}</p>
                                                <span className={`status-badge ${order.orderStatus.toLowerCase()}`}>
                                                    {order.orderStatus}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                    {orders.length === 0 && <p className="no-data">No orders yet</p>}
                                </div>
                            </div>
                        </>
                    )}

                    {activeTab === 'products' && (
                        <AdminProductManager />
                    )}

                    {activeTab === 'banners' && (
                        <>
                            <h1>Banner Management</h1>
                            {/* Hero Slider Management */}
                            <div className="admin-section">
                                <h2>Hero Slider Banners (4 Slots)</h2>
                                <div className="banners-grid">
                                    {heroBanners.map(b => (
                                        <div key={b.id} className="banner-control-card">
                                            <img src={b.image} alt={b.title} style={{ width: '100%', height: '100px', objectFit: 'cover' }} />
                                            <div className="banner-info">
                                                <h4>{b.title}</h4>
                                                <label className="toggle-switch">
                                                    <input
                                                        type="checkbox"
                                                        checked={b.enabled}
                                                        onChange={() => toggleHeroBanner(b.id)}
                                                    />
                                                    <span className="slider-round"></span>
                                                    {b.enabled ? 'Active' : 'Disabled'}
                                                </label>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Top Banner Management */}
                            <div className="admin-section">
                                <h2>Top Sticky Sale Banner</h2>
                                <div className="banner-controls">
                                    <input
                                        type="text"
                                        value={banner.text}
                                        onChange={(e) => updateBanner({ text: e.target.value })}
                                        placeholder="Banner text"
                                        style={{ width: '100%' }}
                                    />
                                    <label className="toggle-switch" style={{ marginTop: '1rem' }}>
                                        <input
                                            type="checkbox"
                                            checked={banner.enabled}
                                            onChange={(e) => updateBanner({ enabled: e.target.checked })}
                                        />
                                        <span className="slider-round"></span>
                                        Enable Sale Banner
                                    </label>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
