import React from 'react';
import { X } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { Link } from 'react-router-dom';
import './SaleBanner.css';

const SaleBanner = ({ isVisible = true, onClose }) => {
    const { banner } = useAdmin();

    if (!banner.enabled || !isVisible) return null;

    return (
        <div className="sale-banner" style={{ backgroundColor: banner.backgroundColor, color: banner.textColor }}>
            <div className="banner-content">
                <Link to={banner.link} className="banner-text">
                    {banner.text}
                </Link>
                <button className="banner-close" onClick={onClose}>
                    <X size={18} />
                </button>
            </div>
        </div>
    );
};

export default SaleBanner;
