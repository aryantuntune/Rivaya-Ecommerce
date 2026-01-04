import React, { useState, useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import './HeroSlider.css';

const HeroSlider = () => {
    const { heroBanners } = useAdmin();
    const activeBanners = heroBanners.filter(b => b.enabled);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (activeBanners.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex(current => (current + 1) % activeBanners.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [activeBanners.length]);

    const nextSlide = () => {
        setCurrentIndex(current => (current + 1) % activeBanners.length);
    };

    const prevSlide = () => {
        setCurrentIndex(current => (current - 1 + activeBanners.length) % activeBanners.length);
    };

    // Fallback if no banners are active (prevents layout collapse)
    const displayBanners = activeBanners.length > 0 ? activeBanners : [{
        id: 'default',
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop', // Generic pleasant background
        title: 'Welcome to Rivaya',
        subtitle: 'Discover our latest collection',
        link: '/shop',
        enabled: true
    }];

    if (displayBanners.length === 0) return null; // Should not happen with fallback

    return (
        <div className="hero-slider">
            {displayBanners.map((banner, index) => (
                <div
                    key={banner.id}
                    className={`slide ${index === currentIndex ? 'active' : ''}`}
                    style={{ backgroundImage: `url(${banner.image})` }}
                >
                    <div className="hero-overlay"></div>
                    <div className="hero-content">
                        <h2>{banner.title}</h2>
                        <p>{banner.subtitle}</p>
                        <Link to={banner.link} className="hero-btn">Shop Now</Link>
                    </div>
                </div>
            ))}

            {activeBanners.length > 1 && (
                <>
                    <button className="slider-btn prev" onClick={prevSlide}>
                        <ChevronLeft size={32} />
                    </button>
                    <button className="slider-btn next" onClick={nextSlide}>
                        <ChevronRight size={32} />
                    </button>
                    <div className="slider-dots">
                        {activeBanners.map((_, index) => (
                            <button
                                key={index}
                                className={`dot ${index === currentIndex ? 'active' : ''}`}
                                onClick={() => setCurrentIndex(index)}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default HeroSlider;
