import React from 'react';
import { Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import './CategoryGrid.css';

const CategoryGrid = () => {
    const categories = [
        {
            id: 1,
            title: "Women",
            image: "/images/cat_women.png",
            link: "/shop?category=Women",
            locked: false
        },
        {
            id: 2,
            title: "Couple",
            image: "/images/cat_couple.png",
            link: "#",
            locked: true
        },
        {
            id: 3,
            title: "Men",
            image: "/images/cat_men.png",
            link: "#",
            locked: true
        },
        {
            id: 4,
            title: "Accessories",
            image: "/images/cat_accessories.png",
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
