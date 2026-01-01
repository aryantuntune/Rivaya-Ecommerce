import React from 'react';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import './CartDrawer.css';

const CartDrawer = ({ isOpen, onClose }) => {
    const { cartItems, updateQuantity, removeFromCart, cartTotal, cartCount } = useCart();

    return (
        <>
            <div className={`cart-overlay ${isOpen ? 'active' : ''}`} onClick={onClose}></div>
            <div className={`cart-drawer ${isOpen ? 'open' : ''}`}>
                <div className="cart-header">
                    <h2>Shopping Bag ({cartCount})</h2>
                    <button className="close-btn" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <div className="cart-body">
                    {cartItems.length === 0 ? (
                        <div className="empty-cart">
                            <ShoppingBag size={64} color="#ccc" />
                            <p>Your cart is empty</p>
                            <button className="btn btn-primary" onClick={onClose}>Continue Shopping</button>
                        </div>
                    ) : (
                        <>
                            {cartItems.map((item) => (
                                <div key={`${item.id}-${item.size}`} className="cart-item">
                                    <img src={item.image} alt={item.name} className="cart-item-image" />
                                    <div className="cart-item-details">
                                        <h4>{item.name}</h4>
                                        <p className="cart-item-meta">Size: {item.size}</p>
                                        <p className="cart-item-price">₹{item.price}</p>

                                        <div className="cart-item-actions">
                                            <div className="quantity-controls">
                                                <button onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}>
                                                    <Minus size={14} />
                                                </button>
                                                <span>{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}>
                                                    <Plus size={14} />
                                                </button>
                                            </div>
                                            <button
                                                className="remove-btn"
                                                onClick={() => removeFromCart(item.id, item.size)}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}
                </div>

                {cartItems.length > 0 && (
                    <div className="cart-footer">
                        <div className="cart-total">
                            <span>Subtotal:</span>
                            <span className="total-amount">₹{cartTotal.toLocaleString()}</span>
                        </div>
                        <Link to="/checkout" className="btn btn-primary checkout-btn" onClick={onClose}>
                            Proceed to Checkout
                        </Link>
                        <button className="btn btn-outline" onClick={onClose}>
                            Continue Shopping
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};

export default CartDrawer;
