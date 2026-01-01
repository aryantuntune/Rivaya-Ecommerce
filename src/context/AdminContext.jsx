import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockProducts, mockCollections, mockUsers, mockSaleBanner, mockBanners, mockOrders } from '../data/mockDatabase';

const AdminContext = createContext();

export const useAdmin = () => {
    const context = useContext(AdminContext);
    if (!context) {
        throw new Error('useAdmin must be used within AdminProvider');
    }
    return context;
};

export const AdminProvider = ({ children }) => {
    // Load data from localStorage or use mock data
    const [products, setProducts] = useState(() => {
        const saved = localStorage.getItem('admin_products');
        return saved ? JSON.parse(saved) : mockProducts;
    });

    const [collections, setCollections] = useState(() => {
        const saved = localStorage.getItem('admin_collections');
        return saved ? JSON.parse(saved) : mockCollections;
    });

    const [users, setUsers] = useState(() => {
        const saved = localStorage.getItem('admin_users');
        return saved ? JSON.parse(saved) : mockUsers;
    });

    const [saleBanner, setSaleBanner] = useState(() => { // Top sticky banner
        const saved = localStorage.getItem('admin_sale_banner');
        return saved ? JSON.parse(saved) : mockSaleBanner;
    });

    const [heroBanners, setHeroBanners] = useState(() => { // Hero sliders
        const saved = localStorage.getItem('admin_hero_banners');
        return saved ? JSON.parse(saved) : mockBanners;
    });

    const [orders, setOrders] = useState(() => {
        const saved = localStorage.getItem('admin_orders');
        return saved ? JSON.parse(saved) : mockOrders;
    });

    const [currentUser, setCurrentUser] = useState(() => {
        const saved = localStorage.getItem('currentUser');
        return saved ? JSON.parse(saved) : null;
    });

    // Save to localStorage whenever data changes
    useEffect(() => {
        localStorage.setItem('admin_products', JSON.stringify(products));
    }, [products]);

    useEffect(() => {
        localStorage.setItem('admin_collections', JSON.stringify(collections));
    }, [collections]);

    useEffect(() => {
        localStorage.setItem('admin_users', JSON.stringify(users));
    }, [users]);

    useEffect(() => {
        localStorage.setItem('admin_sale_banner', JSON.stringify(saleBanner));
    }, [saleBanner]);

    useEffect(() => {
        localStorage.setItem('admin_hero_banners', JSON.stringify(heroBanners));
    }, [heroBanners]);

    useEffect(() => {
        localStorage.setItem('admin_orders', JSON.stringify(orders));
    }, [orders]);

    useEffect(() => {
        if (currentUser) {
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
        } else {
            localStorage.removeItem('currentUser');
        }
    }, [currentUser]);

    // Auth functions
    const login = (email, password) => {
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
            setCurrentUser(user);
            return { success: true, user };
        }
        return { success: false, message: 'Invalid credentials' };
    };

    const register = (userData) => {
        const exists = users.find(u => u.email === userData.email);
        if (exists) {
            return { success: false, message: 'User already exists' };
        }
        const newUser = {
            id: users.length + 1,
            ...userData,
            role: 'customer',
            addresses: [],
            wishlist: [],
            cart: []
        };
        setUsers([...users, newUser]);
        setCurrentUser(newUser);
        return { success: true, user: newUser };
    };

    const logout = () => {
        setCurrentUser(null);
    };

    // Product functions
    const addProduct = (product) => {
        const newProduct = {
            ...product,
            id: products.length + 1,
            analytics: { views: 0, addToCart: 0, wishlist: 0, purchases: 0 }
        };
        setProducts([...products, newProduct]);
        return newProduct;
    };

    const updateProduct = (id, updates) => {
        setProducts(products.map(p => p.id === id ? { ...p, ...updates } : p));
    };

    const deleteProduct = (id) => {
        setProducts(products.filter(p => p.id !== id));
    };

    const trackProductInteraction = (productId, type) => {
        setProducts(products.map(p => {
            if (p.id === productId) {
                return {
                    ...p,
                    analytics: {
                        ...p.analytics,
                        [type]: (p.analytics[type] || 0) + 1
                    }
                };
            }
            return p;
        }));
    };

    // Collection functions
    const addCollection = (collection) => {
        const newCollection = {
            ...collection,
            id: collections.length + 1,
            createdAt: new Date()
        };
        setCollections([...collections, newCollection]);
        return newCollection;
    };

    const updateCollection = (id, updates) => {
        setCollections(collections.map(c => c.id === id ? { ...c, ...updates } : c));
    };

    const deleteCollection = (id) => {
        setCollections(collections.filter(c => c.id !== id));
    };

    // Banner functions
    const updateSaleBanner = (updates) => {
        setSaleBanner({ ...saleBanner, ...updates });
    };

    const toggleHeroBanner = (id) => {
        setHeroBanners(heroBanners.map(b =>
            b.id === id ? { ...b, enabled: !b.enabled } : b
        ));
    };

    // Order functions
    const createOrder = (orderData) => {
        const newOrder = {
            ...orderData,
            id: orders.length + 1,
            createdAt: new Date(),
            orderStatus: 'Pending',
            paymentStatus: 'Pending'
        };
        setOrders([...orders, newOrder]);

        // Update product analytics
        orderData.items.forEach(item => {
            trackProductInteraction(item.product.id, 'purchases');
        });

        return newOrder;
    };

    const updateOrderStatus = (orderId, status) => {
        setOrders(orders.map(o =>
            o.id === orderId ? { ...o, ...status } : o
        ));
    };

    const getStats = () => {
        const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
        const totalOrders = orders.length;
        const totalProducts = products.length;
        const totalCustomers = users.filter(u => u.role === 'customer').length;

        return {
            totalRevenue,
            totalOrders,
            totalProducts,
            totalCustomers
        };
    };

    const value = {
        // Data
        products,
        collections,
        users,
        banner: saleBanner, // Keep 'banner' key for compatibility but link to saleBanner
        heroBanners,
        orders,
        currentUser,

        // Auth
        login,
        register,
        logout,

        // Products
        addProduct,
        updateProduct,
        deleteProduct,
        trackProductInteraction,

        // Collections
        addCollection,
        updateCollection,
        deleteCollection,

        // Banner
        updateBanner: updateSaleBanner,
        toggleHeroBanner,

        // Orders
        createOrder,
        updateOrderStatus,

        // Stats
        getStats
    };

    return (
        <AdminContext.Provider value={value}>
            {children}
        </AdminContext.Provider>
    );
};
