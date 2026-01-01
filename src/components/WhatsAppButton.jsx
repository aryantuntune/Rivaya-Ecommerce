import React from 'react';
import { MessageCircle } from 'lucide-react';
import './WhatsAppButton.css';

const WhatsAppButton = () => {
    const phoneNumber = '919876543210'; // Replace with actual number
    const message = 'Hi! I am interested in your products from Vrishtikalaa.';

    const handleClick = () => {
        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    return (
        <button className="whatsapp-button" onClick={handleClick} aria-label="Chat on WhatsApp">
            <MessageCircle size={28} />
        </button>
    );
};

export default WhatsAppButton;
