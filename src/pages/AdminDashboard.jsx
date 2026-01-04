import React, { useState, useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { Package, ShoppingBag, Users, DollarSign, TrendingUp, Eye, FileText, Home, LogOut } from 'lucide-react';
import AdminProductManager from '../components/AdminProductManager';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const { currentUser, products, orders, users, getStats, updateBanner, banner, heroBanners, toggleHeroBanner, updateHeroBanner, complaints, resolveComplaint, addReview, deleteReview, logout } = useAdmin();
    const [activeTab, setActiveTab] = useState('overview');
    const navigate = useNavigate();

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
                    <button className={activeTab === 'reviews' ? 'active' : ''} onClick={() => setActiveTab('reviews')}><TrendingUp size={18} /> Reviews</button>
                    <button className={activeTab === 'complaints' ? 'active' : ''} onClick={() => setActiveTab('complaints')}><Users size={18} /> Complaints</button>

                    <hr style={{ margin: '1rem 0', border: 'none', borderTop: '1px solid #eee' }} />

                    <button onClick={() => navigate('/')}><Home size={18} /> Back to Website</button>
                    <button onClick={() => { logout(); navigate('/'); }} className="text-danger"><LogOut size={18} /> Logout</button>
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

                    {activeTab === 'orders' && (
                        <>
                            <h1>Order Management</h1>
                            <div className="admin-section">
                                <div className="orders-table">
                                    <div className="order-row header">
                                        <div><strong>Order ID</strong></div>
                                        <div><strong>Customer</strong></div>
                                        <div><strong>Total</strong></div>
                                        <div><strong>Status</strong></div>
                                        <div><strong>Date</strong></div>
                                    </div>
                                    {orders.map(order => (
                                        <div key={order.id} className="order-row">
                                            <div>
                                                <strong>#{order.id}</strong>
                                                <p>{order.items.length} items</p>
                                            </div>
                                            <div>User #{order.user}</div>
                                            <div>₹{order.total}</div>
                                            <div>
                                                <span className={`status-badge ${order.orderStatus.toLowerCase()}`}>
                                                    {order.orderStatus}
                                                </span>
                                            </div>
                                            <div>{new Date(order.createdAt).toLocaleDateString()}</div>
                                        </div>
                                    ))}
                                    {orders.length === 0 && <p className="no-data">No orders found.</p>}
                                </div>
                            </div>
                        </>
                    )}

                    {activeTab === 'banners' && (
                        <>
                            <h1>Banner Management</h1>
                            {/* Hero Slider Management */}
                            <div className="admin-section">
                                <h2>Hero Slider Banners (4 Slots)</h2>
                                <div className="banners-grid">
                                    {heroBanners.map(b => (
                                        <BannerEditor key={b.id} banner={b} onUpdate={updateHeroBanner} onToggle={toggleHeroBanner} />
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

                    {activeTab === 'reviews' && (
                        <>
                            <h1>Review Management</h1>
                            <div className="admin-section">
                                <h2>All Product Reviews</h2>
                                <div className="reviews-table-container">
                                    <table className="admin-table">
                                        <thead>
                                            <tr>
                                                <th>Product</th>
                                                <th>Reviewer</th>
                                                <th>Rating</th>
                                                <th>Comment</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {products && products.length > 0 ? (
                                                products
                                                    .flatMap(p => (p.reviews || []).map(r => ({ ...r, productName: p.name, productId: p.id })))
                                                    .length > 0 ? (
                                                    products
                                                        .flatMap(p => (p.reviews || []).map(r => ({ ...r, productName: p.name, productId: p.id })))
                                                        .map((review, index) => (
                                                            <tr key={review.id || review._id || index}>
                                                                <td>{review.productName || 'Unknown Product'}</td>
                                                                <td>{review.user || 'Anonymous'}</td>
                                                                <td>{'★'.repeat(review.rating || 0)}</td>
                                                                <td className="review-comment" title={review.comment}>{review.comment || ''}</td>
                                                                <td>
                                                                    <button className="btn-icon delete" onClick={() => deleteReview(review.productId, review.id || review._id)}>Delete</button>
                                                                </td>
                                                            </tr>
                                                        ))
                                                ) : (
                                                    <tr><td colSpan="5" className="text-center">No reviews found across any products.</td></tr>
                                                )
                                            ) : (
                                                <tr><td colSpan="5" className="text-center">No products found.</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="admin-section">
                                <h2>Add Managed Review</h2>
                                <AddReviewForm products={products} onAdd={addReview} />
                            </div>
                        </>
                    )}

                    {activeTab === 'complaints' && (
                        <>
                            <h1>Customer Complaints</h1>
                            <div className="admin-section">
                                <div className="orders-table">
                                    {complaints.map(c => (
                                        <div key={c.id} className="order-row">
                                            <div>
                                                <strong>{c.name}</strong>
                                                <p className="text-muted">{c.email}</p>
                                                <small>{new Date(c.date).toLocaleDateString()}</small>
                                            </div>
                                            <div style={{ flex: 2, margin: '0 2rem' }}>
                                                <p><strong>Issue:</strong> {c.issue}</p>
                                            </div>
                                            <div>
                                                <span className={`status-badge ${c.status === 'Resolved' ? 'delivered' : 'pending'}`}>
                                                    {c.status}
                                                </span>
                                                {c.status !== 'Resolved' && (
                                                    <button className="btn btn-outline btn-sm" onClick={() => resolveComplaint(c.id)} style={{ marginTop: '0.5rem' }}>
                                                        Mark Resolved
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    {complaints.length === 0 && <p className="no-data">No complaints found</p>}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

const AddReviewForm = ({ products, onAdd }) => {
    const [selectedProduct, setSelectedProduct] = useState(products[0]?.id || '');
    const [reviewer, setReviewer] = useState('');
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onAdd(selectedProduct, {
            user: reviewer,
            rating: parseInt(rating),
            comment,
            verified: true
        });
        setReviewer('');
        setComment('');
        alert('Review added successfully');
    };

    return (
        <form onSubmit={handleSubmit} className="add-review-form">
            <div className="form-row">
                <div className="form-group">
                    <label>Select Product</label>
                    <select value={selectedProduct} onChange={e => setSelectedProduct(e.target.value)}>
                        {products.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>Reviewer Name</label>
                    <input type="text" value={reviewer} onChange={e => setReviewer(e.target.value)} required placeholder="e.g. Anjali K." />
                </div>
                <div className="form-group">
                    <label>Rating</label>
                    <select value={rating} onChange={e => setRating(e.target.value)}>
                        {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r} Stars</option>)}
                    </select>
                </div>
            </div>
            <div className="form-group">
                <label>Review Content</label>
                <textarea rows="3" value={comment} onChange={e => setComment(e.target.value)} required placeholder="Write the review here..." />
            </div>
            <button type="submit" className="btn btn-primary">Add Review</button>
        </form>
    );
};

const BannerEditor = ({ banner, onUpdate, onToggle }) => {
    const [localBanner, setLocalBanner] = useState({ ...banner });
    const [isDirty, setIsDirty] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        setLocalBanner({ ...banner });
    }, [banner.id]);

    const handleChange = (field, value) => {
        setLocalBanner(prev => ({ ...prev, [field]: value }));
        setIsDirty(true);
    };

    const handleSave = async () => {
        setSaving(true);
        await onUpdate(banner.id, localBanner);
        setSaving(false);
        setIsDirty(false);
        alert('Banner updated successfully');
    };

    return (
        <div className="banner-control-card">
            <div className="banner-preview">
                <img src={localBanner.image || banner.image} alt={localBanner.title} />
                <div className="banner-overlay">
                    <span className={`status-dot ${banner.enabled ? 'active' : ''}`}></span>
                </div>
            </div>
            <div className="banner-edit-form">
                <div className="form-group">
                    <label>Title</label>
                    <input
                        type="text"
                        value={localBanner.title}
                        onChange={(e) => handleChange('title', e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Subtitle</label>
                    <input
                        type="text"
                        value={localBanner.subtitle}
                        onChange={(e) => handleChange('subtitle', e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Banner Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                    handleChange('image', reader.result);
                                };
                                reader.readAsDataURL(file);
                            }
                        }}
                    />
                </div>
                <div className="form-group" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label className="toggle-label">
                        <span>Status</span>
                        <label className="toggle-switch">
                            <input
                                type="checkbox"
                                checked={banner.enabled}
                                onChange={() => onToggle(banner.id)}
                            />
                            <span className="slider-round"></span>
                        </label>
                    </label>

                    {isDirty && (
                        <button
                            className="btn btn-primary btn-sm"
                            onClick={handleSave}
                            disabled={saving}
                        >
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
