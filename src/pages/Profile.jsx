import React, { useState, useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { Package, User, MapPin, LogOut, Save, Plus, Trash, CheckCircle, Truck, Clock } from 'lucide-react';
import './Profile.css';

const Profile = () => {
    const { currentUser, orders, logout, updateProfile, deleteAccount } = useAdmin();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('details'); // details, addresses, orders
    const [profileData, setProfileData] = useState({ firstName: '', lastName: '', email: '', phone: '' });
    const [isEditing, setIsEditing] = useState(false);

    // Address State
    const [newAddress, setNewAddress] = useState({
        fullName: '', phone: '', addressLine1: '', addressLine2: '', city: '', state: '', pincode: ''
    });
    const [showAddAddress, setShowAddAddress] = useState(false);

    useEffect(() => {
        if (currentUser) {
            setProfileData({
                firstName: currentUser.firstName || currentUser.name?.split(' ')[0] || '',
                lastName: currentUser.lastName || currentUser.name?.split(' ').slice(1).join(' ') || '',
                email: currentUser.email || '',
                phone: currentUser.phone || ''
            });
        }
    }, [currentUser]);

    if (!currentUser) return <Navigate to="/" />;

    const myOrders = orders.filter(o => o.user === currentUser.id || o.user === currentUser._id || o.email === currentUser.email);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        const res = await updateProfile(profileData);
        if (res.success) {
            alert('Profile Updated Successfully');
            setIsEditing(false);
        } else {
            alert(res.message);
        }
    };

    const handleAddAddress = async (e) => {
        e.preventDefault();
        const updatedAddresses = [...(currentUser.addresses || []), newAddress];
        const res = await updateProfile({ addresses: updatedAddresses });
        if (res.success) {
            setShowAddAddress(false);
            setNewAddress({ fullName: '', phone: '', addressLine1: '', addressLine2: '', city: '', state: '', pincode: '' });
        } else {
            alert("Failed to add address");
        }
    };

    const handleDeleteAddress = async (index) => {
        if (!window.confirm("Delete this address?")) return;
        const updatedAddresses = currentUser.addresses.filter((_, i) => i !== index);
        await updateProfile({ addresses: updatedAddresses });
    };

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
        <div className="profile-page">
            <div className="container">
                <div className="profile-layout">
                    {/* Sidebar */}
                    <div className="profile-sidebar">
                        <div className="user-brief">
                            <div className="avatar-circle">{currentUser.firstName?.[0] || 'U'}</div>
                            <h3>{currentUser.name}</h3>
                            <p>{currentUser.email}</p>
                        </div>
                        <nav className="profile-nav">
                            <button className={activeTab === 'details' ? 'active' : ''} onClick={() => setActiveTab('details')}>
                                <User size={18} /> My Profile
                            </button>
                            <button className={activeTab === 'addresses' ? 'active' : ''} onClick={() => setActiveTab('addresses')}>
                                <MapPin size={18} /> Addresses
                            </button>
                            <button className={activeTab === 'orders' ? 'active' : ''} onClick={() => setActiveTab('orders')}>
                                <Package size={18} /> My Orders
                            </button>
                            <button onClick={logout} className="logout-btn">
                                <LogOut size={18} /> Logout
                            </button>
                        </nav>
                    </div>

                    {/* Content Area */}
                    <div className="profile-content">
                        {activeTab === 'details' && (
                            <div className="tab-pane">
                                <h2>Personal Details</h2>
                                <form onSubmit={handleUpdateProfile}>
                                    <div className="form-group">
                                        <label>First Name</label>
                                        <input
                                            type="text"
                                            value={profileData.firstName}
                                            onChange={e => setProfileData({ ...profileData, firstName: e.target.value })}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Last Name</label>
                                        <input
                                            type="text"
                                            value={profileData.lastName}
                                            onChange={e => setProfileData({ ...profileData, lastName: e.target.value })}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Phone Number</label>
                                        <input
                                            type="text"
                                            value={profileData.phone}
                                            onChange={e => setProfileData({ ...profileData, phone: e.target.value })}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Email</label>
                                        <input type="email" value={profileData.email} disabled className="disabled-input" />
                                    </div>

                                    <div className="btn-row">
                                        {isEditing ? (
                                            <>
                                                <button type="button" className="btn btn-outline" onClick={() => setIsEditing(false)}>Cancel</button>
                                                <button type="submit" className="btn btn-primary">Save Changes</button>
                                            </>
                                        ) : (
                                            <button type="button" className="btn btn-primary" onClick={() => setIsEditing(true)}>Edit Profile</button>
                                        )}
                                    </div>
                                </form>
                                <div style={{ marginTop: '3rem', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
                                    <h3 style={{ fontSize: '1rem', color: '#dc3545' }}>Danger Zone</h3>
                                    <button onClick={handleDeleteAccount} className="btn-text-danger">Delete My Account</button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'addresses' && (
                            <div className="tab-pane">
                                <div className="tab-header">
                                    <h2>Saved Addresses</h2>
                                    <button className="btn btn-outline btn-sm" onClick={() => setShowAddAddress(!showAddAddress)}>
                                        <Plus size={16} /> Add New
                                    </button>
                                </div>

                                {showAddAddress && (
                                    <form onSubmit={handleAddAddress} className="address-form">
                                        <div className="form-row">
                                            <input placeholder="Full Name" required value={newAddress.fullName} onChange={e => setNewAddress({ ...newAddress, fullName: e.target.value })} />
                                            <input placeholder="Phone" required value={newAddress.phone} onChange={e => setNewAddress({ ...newAddress, phone: e.target.value })} />
                                        </div>
                                        <input placeholder="Address Line 1" required value={newAddress.addressLine1} onChange={e => setNewAddress({ ...newAddress, addressLine1: e.target.value })} />
                                        <input placeholder="Address Line 2 (Optional)" value={newAddress.addressLine2} onChange={e => setNewAddress({ ...newAddress, addressLine2: e.target.value })} />
                                        <div className="form-row">
                                            <input placeholder="City" required value={newAddress.city} onChange={e => setNewAddress({ ...newAddress, city: e.target.value })} />
                                            <input placeholder="State" required value={newAddress.state} onChange={e => setNewAddress({ ...newAddress, state: e.target.value })} />
                                            <input placeholder="Pincode" required value={newAddress.pincode} onChange={e => setNewAddress({ ...newAddress, pincode: e.target.value })} />
                                        </div>
                                        <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>Save Address</button>
                                    </form>
                                )}

                                <div className="addresses-list">
                                    {currentUser.addresses && currentUser.addresses.length > 0 ? (
                                        currentUser.addresses.map((addr, idx) => (
                                            <div key={idx} className="address-card">
                                                <h4>{addr.fullName} <span className="pincode-badge">{addr.pincode}</span></h4>
                                                <p>{addr.addressLine1}</p>
                                                {addr.addressLine2 && <p>{addr.addressLine2}</p>}
                                                <p>{addr.city}, {addr.state}</p>
                                                <p className="phone-text">Phone: {addr.phone}</p>
                                                <button className="delete-btn" onClick={() => handleDeleteAddress(idx)}><Trash size={14} /></button>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="no-data">No addresses saved.</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'orders' && (
                            <div className="tab-pane">
                                <h2>Order History</h2>
                                <div className="orders-list">
                                    {myOrders.length > 0 ? (
                                        myOrders.map(order => (
                                            <div key={order.id} className="order-card-compact">
                                                <div className="order-header-compact">
                                                    <div>
                                                        <span className="order-id">#{order.id}</span>
                                                        <span className="order-date">{new Date(order.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                    <span className={`status-badge ${order.orderStatus.toLowerCase()}`}>{order.orderStatus}</span>
                                                </div>
                                                <div className="order-preview">
                                                    {order.items.slice(0, 2).map((item, i) => (
                                                        <span key={i}>{item.name}{i < order.items.length - 1 ? ', ' : ''}</span>
                                                    ))}
                                                    {order.items.length > 2 && <span> +{order.items.length - 2} more</span>}
                                                </div>
                                                <div className="order-footer-compact">
                                                    <strong>₹{order.total}</strong>
                                                    <button className="btn-link" onClick={() => alert("Detailed view coming soon")}>View Details</button>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="no-data">No orders found.</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
