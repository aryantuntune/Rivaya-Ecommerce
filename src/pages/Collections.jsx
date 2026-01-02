import React from 'react';
import { useAdmin } from '../context/AdminContext';
import { Link } from 'react-router-dom';
import '../styles/global.css';
import './Collections.css';

const Collections = () => {
    const { collections } = useAdmin();

    return (
        <div className="collections-page">
            <div className="container">
                <div className="page-header">
                    <h1>Our Collections</h1>
                    <p>Explore our seasonally curated edits</p>
                </div>

                <div className="collections-grid-large">
                    {collections.map(collection => (
                        <div key={collection.id} className="collection-card-large">
                            <div className="collection-image-wrapper">
                                <img src={collection.heroImage} alt={collection.name} />
                                <div className="overlay"></div>
                            </div>
                            <div className="collection-content">
                                <h2>{collection.name}</h2>
                                <p>{collection.description}</p>
                                <Link to={`/shop?collection=${collection.name}`} className="btn btn-outline-white">
                                    View Collection
                                </Link>
                            </div>
                        </div>
                    ))}

                    {/* Add a "Modern & Minimal" card explicitly as it was requested in PDF */}
                    <div className="collection-card-large">
                        <div className="collection-image-wrapper">
                            <img src="/images/hero_lehenga.png" alt="Modern & Minimal" />
                            <div className="overlay"></div>
                        </div>
                        <div className="collection-content">
                            <h2>Modern & Minimal</h2>
                            <p>Explore our specially designed and stitched curated options for you.</p>
                            <Link to="/shop?collection=Modern" className="btn btn-outline-white">
                                View Collection
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Collections;
