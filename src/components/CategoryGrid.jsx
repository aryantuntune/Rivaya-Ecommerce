import React from 'react';
import { Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import './CategoryGrid.css';

const CategoryGrid = () => {
    const categories = [
        {
            id: 1,
            title: "Women",
            image: "https://images.unsplash.com/photo-1583391733958-e02376903394?q=80&w=2070&auto=format&fit=crop",
            link: "/shop?category=Women",
            locked: false
        },
        {
            id: 2,
            title: "Couple",
            image: "https://images.unsplash.com/photo-1594913780356-e442963d8e31?q=80&w=1887&auto=format&fit=crop",
            link: "#",
            locked: true
        },
        {
            id: 3,
            title: "Men",
            image: "https://images.unsplash.com/photo-1589810635657-232948472d98?q=80&w=1888&auto=format&fit=crop",
            link: "#",
            locked: true
        },
        {
            id: 4,
            title: "Accessories",
            image: "https://images.unsplash.com/photo-1551028717-b77c35597ea9?q=80&w=1887&auto=format&fit=crop",
            link: "#",
            locked: true
        }
    ];

    return (
        <section className="category-section">
            <div className="section-header text-center">
                <h2>Explore Our New Collection</h2>
                <p>Curated styles for every story</p>
            </div>

            <div className="category-grid">
                {categories.map((cat) => (
                    <div key={cat.id} className={`category-item-card ${cat.locked ? 'locked' : ''}`}>
                        <div className="cat-img-wrapper">
                            <img src={cat.image} alt={cat.title} />
                            <div className="cat-overlay"></div>
                            {cat.locked ? (
                                <div className="locked-content">
                                    <Lock size={40} />
                                    <span>Coming Soon</span>
                                </div>
                            ) : (
                                <Link to={cat.link} className="cat-link">Explore</Link>
                            )}
                        </div>
                        <h3>{cat.title}</h3>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default CategoryGrid;
