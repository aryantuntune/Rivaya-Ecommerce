import React from 'react';
import '../styles/global.css';
import './AboutUs.css';

const AboutUs = () => {
    return (
        <div className="about-us-page">
            <div className="container">
                {/* Hero Section */}
                <div className="about-hero">
                    <h1>Our Story</h1>
                    <p className="subtitle">Weaving traditions into modern silhouettes.</p>
                </div>

                {/* Content Sections */}
                <div className="about-content">
                    <div className="about-section">
                        <div className="text-content">
                            <h2>The Rivaya Vision</h2>
                            <p>
                                Founded with a passion for Indian textiles and a vision to make ethnic wear
                                accessible and contemporary, Rivaya stands at the intersection of tradition and modernity.
                                We believe that every piece of clothing tells a story - a story of the artisan who crafted it,
                                the heritage it represents, and the woman who wears it.
                            </p>
                        </div>
                        <div className="image-content">
                            <img src="/images/hero_saree.png" alt="Rivaya Vision" />
                        </div>
                    </div>

                    <div className="about-section reverse">
                        <div className="text-content">
                            <h2>Craftsmanship & Quality</h2>
                            <p>
                                We partner directly with artisans across India to bring you authentic handcrafted fabrics.
                                From the block prints of Jaipur to the silks of Banaras, every Rivaya garment is a testament
                                to quality and skill. We are committed to sustainable practices and fair trade.
                            </p>
                        </div>
                        <div className="image-content">
                            <img src="/images/hero_lehenga.png" alt="Craftsmanship" />
                        </div>
                    </div>
                </div>

                {/* Values */}
                <div className="company-values">
                    <div className="value-card">
                        <h3>Authenticity</h3>
                        <p>Genuine fabrics and traditional techniques.</p>
                    </div>
                    <div className="value-card">
                        <h3>Elegance</h3>
                        <p>Timeless designs that transcend trends.</p>
                    </div>
                    <div className="value-card">
                        <h3>Empowerment</h3>
                        <p>Supporting artisans and confident women.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;
