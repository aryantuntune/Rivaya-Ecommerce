
import React from 'react';
import './AboutUs.css';

const AboutUs = () => {
    return (
        <div className="about-page">
            <div className="container">
                <div className="about-hero">
                    <h1>About Rivaya</h1>
                    <p className="tagline">Wear Your Story</p>
                </div>

                <section className="about-section">
                    <h2>Our Story</h2>
                    <p>
                        RIVAYA is a contemporary Indian clothing brand that celebrates the timeless elegance of Indian wear
                        while bringing in modern aesthetics for today’s generation. Rooted in cultural heritage yet designed
                        with a contemporary touch, RIVAYA creates a unique identity in the Indian ethnic wear market.
                    </p>
                    <p>
                        The brand primarily focuses on women’s wear – especially short and long kurtas.
                    </p>
                </section>

                <section className="about-section">
                    <h2>Brand Essence</h2>
                    <ul>
                        <li><strong>Name:</strong> RIVAYA – inspired by grace, flow, and timeless charm, much like a river that carries heritage forward while embracing change.</li>
                        <li><strong>Core Values:</strong> Elegance, Authenticity, Versatility, Quality.</li>
                        <li><strong>Positioning:</strong> A modern Indian wear brand that is both rooted in tradition and adapted for contemporary living.</li>
                    </ul>
                </section>

                <section className="about-section">
                    <h2>Our Mission</h2>
                    <p>
                        To empower women with clothing that makes them feel confident, beautiful, and connected to their roots.
                        We believe in sustainable fashion, fair trade practices, and supporting local artisan communities.
                    </p>
                </section>

                <section className="about-section">
                    <h2>Why Choose Us</h2>
                    <div className="features-grid">
                        <div className="feature">
                            <h3>🎨 Authentic Designs</h3>
                            <p>Traditional patterns with modern silhouettes</p>
                        </div>
                        <div className="feature">
                            <h3>✨ Premium Quality</h3>
                            <p>Finest fabrics and meticulous craftsmanship</p>
                        </div>
                        <div className="feature">
                            <h3>🌿 Sustainable</h3>
                            <p>Eco-friendly practices and ethical sourcing</p>
                        </div>
                        <div className="feature">
                            <h3>💝 Customer First</h3>
                            <p>Dedicated support and hassle-free returns</p>
                        </div>
                    </div>
                </section>

                <section className="about-section">
                    <h2>Contact Us</h2>
                    <div className="contact-info">
                        <p><strong>Email:</strong> support@vrishtikalaa.com</p>
                        <p><strong>Phone:</strong> +91 98765 43210</p>
                        <p><strong>Address:</strong> Mumbai, Maharashtra, India</p>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default AboutUs;
