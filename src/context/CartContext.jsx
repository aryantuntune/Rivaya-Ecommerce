import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        const saved = localStorage.getItem('cart');
        return saved ? JSON.parse(saved) : [];
    });

    const [wishlist, setWishlist] = useState(() => {
        const saved = localStorage.getItem('wishlist');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    useEffect(() => {
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }, [wishlist]);

    const addToCart = (product, quantity = 1, size = 'M') => {
        setCartItems(prev => {
            const existing = prev.find(item => item.id === product.id && item.size === size);

            // Create a sanitized item object to avoid storing large Base64 arrays
            // We only keep the specific image passed or the first one, but NOT the full images array
            const { images, variants, reviews, ...cleanProduct } = product;

            if (existing) {
                return prev.map(item =>
                    item.id === product.id && item.size === size
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            return [...prev, { ...cleanProduct, quantity, size }];
        });
    };

    const removeFromCart = (productId, size) => {
        setCartItems(prev => prev.filter(item => !(item.id === productId && item.size === size)));
    };

    const updateQuantity = (productId, size, quantity) => {
        if (quantity <= 0) {
            removeFromCart(productId, size);
            return;
        }
        setCartItems(prev =>
            prev.map(item =>
                item.id === productId && item.size === size
                    ? { ...item, quantity }
                    : item
            )
        );
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const addToWishlist = (product) => {
        setWishlist(prev => {
            if (prev.find(item => item.id === product.id)) {
                return prev.filter(item => item.id !== product.id);
            }
            return [...prev, product];
        });
    };

    const isInWishlist = (productId) => {
        return wishlist.some(item => item.id === productId);
    };

    const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <CartContext.Provider value={{
            cartItems,
            wishlist,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            addToWishlist,
            isInWishlist,
            cartTotal,
            cartCount
        }}>
            {children}
        </CartContext.Provider>
    );
};
