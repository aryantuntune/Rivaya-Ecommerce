import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone, Youtube, Linkedin, MessageCircle } from 'lucide-react';
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
                        <a href="https://www.facebook.com/share/1DQYmiEtc3/" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><Facebook size={20} /></a>
                        <a href="https://www.instagram.com/rivaya_store?igsh=d3l1ZXRoM3FnbDJq" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><Instagram size={20} /></a>
                        <a href="https://x.com/RIVAYACLOTHR1" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><Twitter size={20} /></a>
                        <a href="https://youtube.com/@rivaya-f3b?si=E0g-7kpN41NSOund" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><Youtube size={20} /></a>
                        <a href="https://www.linkedin.com/in/rivaya-undefined-b628463a1" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><Linkedin size={20} /></a>
                        <a href="https://pin.it/tt5e9DmmD" target="_blank" rel="noopener noreferrer" aria-label="Pinterest">Pin</a>
                        <a href="https://chat.whatsapp.com/F9oC8tSZJODAVAafr7JLCb" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp Community"><MessageCircle size={20} /></a>
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

                {/* Support Links */}
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
                            <span>redressal.rivaya@gmail.com</span>
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
