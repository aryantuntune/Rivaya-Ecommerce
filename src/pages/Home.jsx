import React from 'react';
import { useAdmin } from '../context/AdminContext';
import ProductCard from '../components/ProductCard';
import HeroSlider from '../components/HeroSlider'; // New banner slider
import CategoryGrid from '../components/CategoryGrid'; // New category grid with locks
import TestimonialCard from '../components/TestimonialCard';
import { testimonials } from '../data/products';
import { Truck, Headset, ShieldCheck, MessageCircle } from 'lucide-react'; // Updated icons
import { Link } from 'react-router-dom';
import '../styles/global.css';
import './Home.css';

const Home = () => {
  const { products } = useAdmin();

  // Logic for trending (Mock: Top 8 items)
  const trendingProducts = products.slice(0, 8);

  return (
    <div className="home-page">
      {/* 1. Hero Slider (4 Banners) */}
      <HeroSlider />

      {/* 2. Features Display (Updated text) */}
      <div className="features-bar">
        <div className="feature-item">
          <Truck size={24} />
          <span>Free Shipping on 999</span>
        </div>
        <div className="feature-item">
          <Headset size={24} />
          <span>24/7 Support</span>
        </div>
        <div className="feature-item">
          <ShieldCheck size={24} />
          <span>100% Authentic Quality</span>
        </div>
        <a href="/complaint" className="feature-item link-item">
          <MessageCircle size={24} />
          <span>#riyavahelp (Contact Us)</span>
        </a>
      </div>

      {/* 3. Shop by Category (Locks implemented) */}
      <CategoryGrid />

      {/* 4. Trending Now (8 Items) */}
      <section className="section container">
        <div className="section-header">
          <h2>Trending Now</h2>
          <p>Our most loved styles</p>
        </div>
        <div className="product-grid">
          {trendingProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="text-center" style={{ marginTop: '2rem' }}>
          <Link to="/shop" className="btn btn-outline">View All Products</Link>
        </div>
      </section>

      {/* 5. Modern & Minimal Section (Replacing Royal Collection) */}
      <section className="modern-minimal-section">
        <div className="modern-content">
          <h2>Modern & Minimal</h2>
          <p>Explore our specially designed and stitched curated options for you.</p>
          <Link to="/shop?collection=modern" className="btn btn-primary">
            Explore Collection
          </Link>
        </div>
      </section>

      {/* 6. Customer Testimonials */}
      <section className="section bg-light">
        <div className="container">
          <div className="section-header">
            <h2>What Our Customers Say</h2>
            <p>Real stories from our community</p>
          </div>
          <div className="testimonials-grid">
            {testimonials.map(t => (
              <TestimonialCard key={t.id} testimonial={t} />
            ))}
          </div>
        </div>
      </section>

      {/* 7. Newsletter */}
      <section className="newsletter-section">
        <div className="container">
          <h2>Join Our Community</h2>
          <p>Get the latest updates on sales, stalls, and new collections.</p>
          <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Enter your email" />
            <button type="submit" className="btn btn-primary">Subscribe</button>
          </form>
          <div className="social-connect">
            <p>Follow us on socials: @rivaya_clothing</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
