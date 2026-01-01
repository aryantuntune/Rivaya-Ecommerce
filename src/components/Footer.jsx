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
                    <h2 className="footer-logo">VRISHTIKALAA</h2>
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
                        <li><Link to="/collections">New Arrivals</Link></li>
                        <li><Link to="/bestsellers">Bestsellers</Link></li>
                        <li><Link to="/sale">Sale</Link></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h3>Support</h3>
                    <ul>
                        <li><Link to="/contact">Contact Us</Link></li>
                        <li><Link to="/shipping">Shipping Policy</Link></li>
                        <li><Link to="/returns">Returns & Exchanges</Link></li>
                        <li><Link to="/faq">FAQs</Link></li>
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
                            <span>support@vrishtikalaa.com</span>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="footer-bottom">
                <div className="container">
                    <p>&copy; {new Date().getFullYear()} Vrishtikalaa. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
