import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone } from 'lucide-react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container footer-content">
                {/* Brand Section */}
                <div className="footer-section brand">
                    <h2 className="footer-logo">RIVAYA</h2>
                    <p className="footer-desc">
                        Bringing the elegance of Indian traditions to the modern world.
                        Curated collections for the contemporary woman.
                    </p>
                    <div className="social-links">
                        <a href="#" aria-label="Facebook"><Facebook size={20} /></a>
                        <a href="#" aria-label="Instagram"><Instagram size={20} /></a>
                        <a href="#" aria-label="Twitter"><Twitter size={20} /></a>
                    </div>
                </div>

                {/* Quick Links */}
                <div className="footer-section">
                    <h3>Shop</h3>
                    <ul>
                        <li><Link to="/shop">All Products</Link></li>
                        <li><Link to="/collections">Collections</Link></li>
                        <li><Link to="/about">About Us</Link></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h3>Support</h3>
                    <ul>
                        <li><Link to="/complaint">Contact Us / Redressal</Link></li>
                        <li><Link to="/shipping">Shipping Policy</Link></li>
                        <li><Link to="/returns">Returns & Exchanges</Link></li>
                    </ul>
                </div>

                {/* Contact Info */}
                <div className="footer-section contact">
                    <h3>Contact Us</h3>
                    <ul>
                        <li>
                            <MapPin size={18} />
                            <span>123 Fashion Street, New Delhi, India</span>
                        </li>
                        <li>
                            <Phone size={18} />
                            <span>+91 98765 43210</span>
                        </li>
                        <li>
                            <Mail size={18} />
                            <span>rivaya.executive@gmail.com</span>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="footer-bottom">
                <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p>&copy; {new Date().getFullYear()} Rivaya. All rights reserved.</p>
                    <Link to="/admin" style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', textDecoration: 'none', opacity: 0.7 }}>Admin Login</Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
