import React, { createContext, useContext, useState, useEffect } from 'react';

const AdminContext = createContext();

// Using localhost for dev. In prod this should be relative or env var.
// In production (Vite), we use relative path so Nginx proxies it.
// In dev, we can use localhost or vite proxy.
const API_URL = import.meta.env.PROD ? '/api' : 'http://localhost:5000/api';

export const useAdmin = () => {
    const context = useContext(AdminContext);
    if (!context) {
        throw new Error('useAdmin must be used within AdminProvider');
    }
    return context;
};

export const AdminProvider = ({ children }) => {
    // State
    const [products, setProducts] = useState([]);
    const [complaints, setComplaints] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);

    // Legacy/Mock states (Kept only for UI compatibility, data from API)
    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState([]);
    const [collections, setCollections] = useState([]);
    const [saleBanner, setSaleBanner] = useState({
        text: "🎉 SALE TODAY! Get 50% OFF on Selected Items - Limited Time Only!",
        backgroundColor: "#5e1e2d",
        textColor: "#ffffff",
        link: "/shop",
        enabled: true
    });
    const [heroBanners, setHeroBanners] = useState([]);

    // --- Authentication ---
    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
            const savedUser = localStorage.getItem('currentUser');
            if (savedUser) setCurrentUser(JSON.parse(savedUser));
        } else {
            localStorage.removeItem('token');
            localStorage.removeItem('currentUser');
            setCurrentUser(null);
        }
    }, [token]);

    const login = async (email, password) => {
        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if (data.success) {
                setToken(data.token);
                setCurrentUser(data.user);
                localStorage.setItem('currentUser', JSON.stringify(data.user));
                return { success: true, user: data.user };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error("Login Error:", error);
            return { success: false, message: "Server connection failed" };
        }
    };

    const register = async (userData) => {
        try {
            const res = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });
            const data = await res.json();
            if (data.success) {
                setToken(data.token);
                setCurrentUser(data.user);
                localStorage.setItem('currentUser', JSON.stringify(data.user));
                return { success: true, user: data.user };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error("Register Error:", error);
            return { success: false, message: "Server connection failed" };
        }
    };

    const updateProfile = async (userData) => {
        try {
            const res = await fetch(`${API_URL}/auth/updatedetails`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(userData)
            });
            const data = await res.json();
            if (data.success) {
                setCurrentUser(data.data); // Update local user state
                localStorage.setItem('currentUser', JSON.stringify(data.data)); // Persist
                return { success: true, user: data.data };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error("Update Profile Error:", error);
            return { success: false, message: "Server connection failed" };
        }
    };

    const logout = () => {
        setToken(null);
        setCurrentUser(null);
    };

    // --- Data Fetching ---
    const fetchProducts = async () => {
        try {
            const res = await fetch(`${API_URL}/products`);
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            const data = await res.json();
            if (data.success) {
                // Ensure ID consistency if needed, Mongo uses _id
                const mappedProducts = data.data.map(p => ({ ...p, id: p._id }));
                setProducts(mappedProducts);
            }
        } catch (error) {
            console.error("Failed to fetch products", error);
        }
    };

    const fetchComplaints = async () => {
        try {
            const res = await fetch(`${API_URL}/complaints`);
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            const data = await res.json();
            if (Array.isArray(data)) {
                setComplaints(data.map(c => ({ ...c, id: c._id })));
            }
        } catch (error) {
            console.error("Failed to fetch complaints", error);
        }
    };

    const fetchBanners = async () => {
        try {
            const res = await fetch(`${API_URL}/banners`);
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            const data = await res.json();
            if (data.success) {
                // Ensure ID consistency
                setHeroBanners(data.data.map(b => ({ ...b, id: b._id })));
            }
        } catch (error) {
            console.error("Failed to fetch banners", error);
        }
    };

    const fetchOrders = async () => {
        if (!token) return; // Guard: Don't fetch without auth
        try {
            // Only admin can fetch all orders
            const res = await fetch(`${API_URL}/orders`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.status === 401) {
                console.warn("[fetchOrders] Unauthorized - token might be invalid");
                return;
            }
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            const data = await res.json();
            if (data.success) {
                // Ensure ID consistency
                setOrders(data.data.map(o => ({ ...o, id: o._id })));
            }
        } catch (error) {
            console.error("[fetchOrders] Failed:", error.message || error);
        }
    };

    const fetchMyOrders = async () => {
        if (!token) return; // Guard: Don't fetch without auth
        try {
            const res = await fetch(`${API_URL}/orders/my-orders`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.status === 401) {
                console.warn("[fetchMyOrders] Unauthorized");
                return;
            }
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            const data = await res.json();
            if (data.success) {
                setOrders(data.data.map(o => ({ ...o, id: o._id })));
            }
        } catch (error) {
            console.error("[fetchMyOrders] Failed:", error.message || error);
        }
    };

    const fetchUsers = async () => {
        try {
            const res = await fetch(`${API_URL}/auth/users`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.status === 401) return;
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            const data = await res.json();
            if (data.success) {
                setUsers(data.data.map(u => ({ ...u, id: u._id })));
            }
        } catch (error) {
            console.error("Failed to fetch users", error);
        }
    };

    const fetchCollections = async () => {
        try {
            const res = await fetch(`${API_URL}/collections`);
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            const data = await res.json();
            if (data.success) {
                setCollections(data.data.map(c => ({ ...c, id: c._id })));
            }
        } catch (error) {
            console.error("Failed to fetch collections", error);
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchComplaints();
        fetchBanners();
        fetchCollections(); // Publicly visible usually
        if (token) {
            // Check role if possible, but for now just try fetching my orders, 
            // and if admin, fetch all (which will overwrite/add)
            if (currentUser && currentUser.role === 'admin') {
                fetchOrders();
                fetchUsers();
            } else {
                fetchMyOrders();
            }
        }
    }, [token, currentUser]);

    // --- Products ---
    const addProduct = async (productData) => {
        try {
            const res = await fetch(`${API_URL}/products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(productData)
            });
            if (res.status === 401) { logout(); alert("Session expired."); return; }
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            const data = await res.json();
            if (data.success) {
                const newProduct = { ...data.data, id: data.data._id };
                setProducts([...products, newProduct]);
                return newProduct;
            }
        } catch (error) {
            console.error("Add Product Error", error);
        }
    };

    const updateProduct = async (id, updates) => {
        try {
            const res = await fetch(`${API_URL}/products/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updates)
            });
            if (res.status === 401) { logout(); alert("Session expired."); return; }
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            const data = await res.json();
            if (data.success) {
                fetchProducts();
            }
        } catch (error) {
            console.error("Update Product Error", error);
        }
    };

    const deleteProduct = async (id) => {
        try {
            const res = await fetch(`${API_URL}/products/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (res.status === 401) { logout(); alert("Session expired."); return; }
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            const data = await res.json();
            if (data.success) {
                setProducts(products.filter(p => p.id !== id && p._id !== id));
            }
        } catch (error) {
            console.error("Delete Product Error", error);
        }
    };

    const trackProductInteraction = (productId, type) => {
        fetch(`${API_URL}/products/${productId}/track`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type })
        });
    };

    // --- Complaints ---
    const addComplaint = async (complaintData) => {
        try {
            const res = await fetch(`${API_URL}/complaints`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(complaintData)
            });
            if (res.ok) {
                const newComplaint = await res.json();
                setComplaints([newComplaint, ...complaints]);
                return true;
            }
            return false;
        } catch (error) {
            console.error("Add Complaint Error", error);
            return false;
        }
    };

    const resolveComplaint = async (id) => {
        try {
            const res = await fetch(`${API_URL}/complaints/${id}/resolve`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.status === 401) { logout(); alert("Session expired."); return; }
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            if (res.ok) {
                const updated = await res.json();
                setComplaints(complaints.map(c => c._id === id ? updated : c));
            }
        } catch (error) {
            console.error("Resolve Complaint Error", error);
        }
    };

    // --- Reviews ---
    const addReview = async (productId, reviewData) => {
        try {
            const res = await fetch(`${API_URL}/products/${productId}/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(reviewData)
            });
            if (res.status === 401) { logout(); alert("Session expired."); return; }
            const data = await res.json();
            if (data.success) {
                // Refresh products to show new review
                fetchProducts();
            } else {
                alert(data.message || 'Failed to add review');
            }
        } catch (error) {
            console.error("Add Review Error", error);
        }
    };

    const deleteReview = async (productId, reviewId) => {
        if (!window.confirm("Are you sure you want to delete this review?")) return;
        try {
            const res = await fetch(`${API_URL}/products/${productId}/reviews/${reviewId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (res.status === 401) { logout(); alert("Session expired."); return; }
            const data = await res.json();
            if (data.success) {
                // Refresh products
                fetchProducts();
            } else {
                alert(data.message || 'Failed to delete review');
            }
        } catch (error) {
            console.error("Delete Review Error", error);
        }
    };


    // --- Other Mock/Legacy Functions ---
    const getStats = () => {
        const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
        return {
            totalRevenue,
            totalOrders: orders.length,
            totalProducts: products.length,
            totalCustomers: users.length
        };
    };

    // --- Collections ---
    const addCollection = async (collectionData) => {
        try {
            const res = await fetch(`${API_URL}/collections`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(collectionData)
            });
            if (res.status === 401) { logout(); alert("Session expired."); return null; }
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            const data = await res.json();
            if (data.success) {
                const newCollection = { ...data.data, id: data.data._id };
                setCollections([...collections, newCollection]);
                return newCollection;
            }
            return null;
        } catch (error) {
            console.error("Add Collection Error:", error);
            return null;
        }
    };

    const updateCollection = async (id, updates) => {
        try {
            const res = await fetch(`${API_URL}/collections/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updates)
            });
            if (res.status === 401) { logout(); alert("Session expired."); return; }
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            const data = await res.json();
            if (data.success) {
                setCollections(collections.map(c => c.id === id ? { ...c, ...updates } : c));
            }
        } catch (error) {
            console.error("Update Collection Error:", error);
        }
    };

    const deleteCollection = async (id) => {
        if (!window.confirm("Are you sure you want to delete this collection?")) return;
        try {
            const res = await fetch(`${API_URL}/collections/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (res.status === 401) { logout(); alert("Session expired."); return; }
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            const data = await res.json();
            if (data.success) {
                setCollections(collections.filter(c => c.id !== id && c._id !== id));
            }
        } catch (error) {
            console.error("Delete Collection Error:", error);
        }
    };

    // --- Banners ---
    // Legacy Sale Banner (Local State for now, could be moved to DB if needed)
    const updateBanner = (updates) => {
        setSaleBanner(prev => ({ ...prev, ...updates }));
    };

    // Hero Banners (DB Connected)
    const updateHeroBanner = async (id, updates) => {
        try {
            const res = await fetch(`${API_URL}/banners/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updates)
            });
            if (res.status === 401) {
                logout();
                alert("Session expired. Please login again.");
                return;
            }
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            const data = await res.json();
            if (data.success) {
                // Update local state to reflect changes immediately
                setHeroBanners(heroBanners.map(b => b.id === id ? { ...b, ...updates } : b));
            }
        } catch (error) {
            console.error("Update Banner Error", error);
            alert("Failed to update banner");
        }
    };

    const toggleHeroBanner = async (id) => {
        const banner = heroBanners.find(b => b.id === id);
        if (!banner) return;
        await updateHeroBanner(id, { enabled: !banner.enabled });
    };

    // --- Orders ---
    const createOrder = async (orderData) => {
        try {
            const res = await fetch(`${API_URL}/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(orderData)
            });
            if (res.status === 401) { logout(); alert("Session expired."); return null; }

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || `Server error: ${res.status}`);
            }

            if (data.success) {
                // Ideally update local state if this user is admin viewing their own orders, 
                // but for now just return the order for redirection.
                return data.data;
            } else {
                return null;
            }
        } catch (error) {
            console.error("Create Order Error:", error);
            throw error; // Propagate error to component for alert
        }
    };
    const getOrder = async (id) => {
        try {
            const res = await fetch(`${API_URL}/orders/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.status === 401) { logout(); return null; }
            if (!res.ok) throw new Error('Failed to fetch order');
            const data = await res.json();
            return data.success ? data.data : null;
        } catch (error) {
            console.error("Get Order Error:", error);
            return null;
        }
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            const res = await fetch(`${API_URL}/orders/${orderId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ orderStatus: newStatus })
            });
            if (res.status === 401) { logout(); alert("Session expired."); return; }
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            const data = await res.json();
            if (data.success) {
                // Update local state immediately
                setOrders(orders.map(o => o.id === orderId ? { ...o, orderStatus: newStatus } : o));
            }
        } catch (error) {
            console.error("Update Order Status Error:", error);
            alert("Failed to update order status");
        }
    };

    // --- Payment & User Actions ---
    const deleteAccount = async () => {
        try {
            const res = await fetch(`${API_URL}/auth/me`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.status === 401) { logout(); alert("Session expired."); return; }
            return res.ok;
        } catch (error) {
            console.error("Delete Account Error", error);
            return false;
        }
    };

    const getRazorpayKey = async () => {
        const res = await fetch(`${API_URL}/payment/key`);
        return res.json();
    };

    const createRazorpayOrder = async (amount) => {
        const res = await fetch(`${API_URL}/payment/create-order`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ amount })
        });
        return res.json();
    };

    const verifyRazorpayPayment = async (paymentData) => {
        const res = await fetch(`${API_URL}/payment/verify`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(paymentData)
        });
        return res.json();
    };

    const value = {
        products,
        complaints,
        currentUser,
        collections,
        users,
        banner: saleBanner,
        heroBanners,
        orders,

        login,
        register,
        logout,
        updateProfile, // Added
        deleteAccount, // Added

        addProduct,
        updateProduct,
        deleteProduct,
        trackProductInteraction,

        addComplaint,
        resolveComplaint,

        addReview,
        deleteReview,

        getStats,

        addCollection, updateCollection, deleteCollection,
        updateBanner, updateHeroBanner, toggleHeroBanner,
        createOrder, getOrder, updateOrderStatus,

        getRazorpayKey, // Added
        createRazorpayOrder, // Added
        verifyRazorpayPayment // Added
    };

    return (
        <AdminContext.Provider value={value}>
            {children}
        </AdminContext.Provider>
    );
};
