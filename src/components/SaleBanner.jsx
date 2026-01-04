import React from 'react';
import { X } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { Link } from 'react-router-dom';
import './SaleBanner.css';

const SaleBanner = ({ isVisible = true, onClose }) => {
    const { banner } = useAdmin();
    const [currentMsgIndex, setCurrentMsgIndex] = React.useState(0);

    // Mock multiple offers if they aren't in the DB yet via AdminContext
    // In a real app, 'banner.text' could be an array, or we split by '|'
    const messages = banner.text ? banner.text.split('|') : [
        "Welcome to Rivaya - Wear Your Story",
        "Free Shipping on Orders Above ₹999",
        "New Wedding Collection is Live!"
    ];

    React.useEffect(() => {
        const interval = setInterval(() => {
            setCurrentMsgIndex(prev => (prev + 1) % messages.length);
        }, 3000); // Change every 3 seconds
        return () => clearInterval(interval);
    }, [messages.length]);

    if (!banner.enabled || !isVisible) return null;

    return (
        <div className="sale-banner" style={{ backgroundColor: banner.backgroundColor, color: banner.textColor }}>
            <div className="banner-content">
                <Link to={banner.link} className="banner-text fade-in-text">
                    {messages[currentMsgIndex].trim()}
                </Link>
                <button className="banner-close" onClick={onClose}>
                    <X size={18} />
                </button>
            </div>
        </div>
    );
};

export default SaleBanner;
