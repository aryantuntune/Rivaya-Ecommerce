import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Hero.css';

const Hero = () => {
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        setLoaded(true);
    }, []);

    return (
        <section className="hero-section">
            <div className="hero-bgbox">
                <img
                    src="https://images.unsplash.com/photo-1610030469450-40af9250af7a?q=80&w=2070&auto=format&fit=crop"
                    alt="Elegant Ethnic Wear"
                    className="hero-image"
                />
                <div className="overlay"></div>
            </div>

            <div className={`hero-content container ${loaded ? 'fade-in' : ''}`}>
                <span className="hero-label">New Collection 2025</span>
                <h1 className="hero-title">
                    Timeless Elegance <br /> Handcrafted for You
                </h1>
                <p className="hero-subtitle">
                    Discover our exclusive range of hand-woven sarees and contemporary ethnic wear
                    that celebrates the spirit of the modern Indian woman.
                </p>
                <div className="hero-actions">
                    <Link to="/shop" className="btn btn-primary">
                        Shop Now <ArrowRight size={18} style={{ marginLeft: '8px' }} />
                    </Link>
                    <Link to="/collections" className="btn btn-outline text-white">
                        View Lookbook
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default Hero;
