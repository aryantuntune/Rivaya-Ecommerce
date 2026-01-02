import React, { createContext, useContext, useState, useEffect } from 'react';

const AdminContext = createContext();

// Using localhost for dev. In prod this should be relative or env var.
const API_URL = 'http://localhost:5000/api';

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

    useEffect(() => {
        fetchProducts();
        fetchComplaints();
        fetchBanners();
    }, []);

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
    const addReview = (productId, review) => {
        console.log("Add review via API not implemented yet");
    };
    const deleteReview = (productId, reviewId) => { };


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

    // Stubs
    const addCollection = () => { };
    const updateCollection = () => { };
    const deleteCollection = () => { };
    const updateBanner = () => { };
    const updateHeroBanner = () => { };
    const toggleHeroBanner = () => { };
    const createOrder = () => { };
    const updateOrderStatus = () => { };

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
        createOrder, updateOrderStatus
    };

    return (
        <AdminContext.Provider value={value}>
            {children}
        </AdminContext.Provider>
    );
};
