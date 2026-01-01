import React from 'react';
import { Link } from 'react-router-dom';
import './CategoryCard.css';

const CategoryCard = ({ category }) => {
    return (
        <Link to={`/shop?category=${category.name}`} className="category-card">
            <div className="category-image-wrapper">
                <img src={category.image} alt={category.name} />
                <div className="category-overlay"></div>
            </div>
            <div className="category-content">
                <h3>{category.name}</h3>
                <p>{category.count} Products</p>
            </div>
        </Link>
    );
};

export default CategoryCard;
