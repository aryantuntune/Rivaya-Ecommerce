import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAdmin } from '../context/AdminContext';
import CartDrawer from './CartDrawer';
import AuthModal from './AuthModal';
import './Navbar.css';

const Navbar = ({ isBannerVisible = true }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const { cartCount } = useCart();
    const { currentUser, logout } = useAdmin();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
            setSearchQuery('');
            setIsSearchOpen(false);
        }
    };

    return (
        <>
            <nav className={`navbar ${isScrolled ? 'scrolled' : ''} ${isBannerVisible ? 'shifted' : ''}`}>
                <div className={`navbar-content`}>
                    <div className="navbar-left">
                        <button className="icon-btn mobile-only" onClick={() => setIsMobileMenuOpen(true)}>
                            <Menu size={24} />
                        </button>
                        <Link to="/" className="brand-logo">
                            <span className="brand-text">RIVAYA</span>
                        </Link>
                    </div>

                    {/* Desktop Links */}
                    <div className="nav-links desktop-only">
                        <Link to="/">Home</Link>
                        <Link to="/shop">Shop</Link>
                        <Link to="/collections">Collections</Link>
                        <Link to="/about">About Us</Link>
                    </div>

                    {/* Search Bar (Desktop) */}
                    {isSearchOpen && (
                        <form className="search-form desktop-only" onSubmit={handleSearch}>
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                autoFocus
                            />
                        </form>
                    )}

                    {/* Icons */}
                    <div className="nav-actions">
                        <button
                            className="icon-btn"
                            aria-label="Search"
                            onClick={() => setIsSearchOpen(!isSearchOpen)}
                        >
                            <Search size={20} />
                        </button>

                        {currentUser ? (
                            <div className="user-menu-container">
                                <button
                                    className="icon-btn"
                                    onClick={() => currentUser.role === 'admin' ? navigate('/admin') : alert("Customer Profile Page coming soon!")}
                                    title={currentUser.name}
                                >
                                    <User size={20} />
                                </button>
                                <div className="user-dropdown">
                                    <span className="user-name">Hi, {currentUser.firstName || currentUser.name.split(' ')[0]}</span>
                                    {currentUser.role === 'admin' && <Link to="/admin">Admin Panel</Link>}
                                    {currentUser.role === 'customer' && <Link to="/profile">My Profile</Link>}
                                    <button onClick={logout} className="logout-btn">Logout</button>
                                </div>
                            </div>
                        ) : (
                            <button
                                className="icon-btn"
                                aria-label="Login"
                                onClick={() => setIsAuthModalOpen(true)}
                            >
                                <User size={20} />
                            </button>
                        )}

                        <button
                            className="icon-btn cart-btn"
                            aria-label="Cart"
                            onClick={() => setIsCartOpen(true)}
                        >
                            <ShoppingBag size={20} />
                            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                        </button>
                        <button
                            className="icon-btn mobile-only"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
                    <form className="mobile-search" onSubmit={handleSearch}>
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button type="submit">
                            <Search size={18} />
                        </button>
                    </form>
                    <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
                    <Link to="/shop" onClick={() => setIsMobileMenuOpen(false)}>Shop</Link>
                    <Link to="/collections" onClick={() => setIsMobileMenuOpen(false)}>Collections</Link>
                    <Link to="/about" onClick={() => setIsMobileMenuOpen(false)}>About Us</Link>
                </div>
            </nav>

            <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
        </>
    );
};

export default Navbar;
