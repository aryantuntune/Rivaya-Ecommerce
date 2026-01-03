import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import { Star, Truck, ShieldCheck, ArrowLeft, Heart, ShoppingBag } from 'lucide-react';
import '../styles/global.css';
import './ProductDetails.css';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { products, trackProductInteraction } = useAdmin();
    const [product, setProduct] = useState(null);
    const [selectedImage, setSelectedImage] = useState('');
    const [selectedSize, setSelectedSize] = useState('');

    useEffect(() => {
        // Find product by ID
        const found = products.find(p => p.id === parseInt(id));
        if (found) {
            setProduct(found);
            setSelectedImage(found.images[0]);
            // Track view
            trackProductInteraction(found.id, 'views');
        } else {
            // Redirect if not found (or show 404)
            // navigate('/shop');
        }
    }, [id, products, trackProductInteraction]);

    if (!product) return <div className="loading-state">Loading...</div>;

    const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

    const handleAddToCart = () => {
        if (!selectedSize && product.category !== 'Sarees') { // Sarees might be One Size
            alert('Please select a size');
            return;
        }
        trackProductInteraction(product.id, 'addToCart');
        alert('Added to Cart! (Mock Action)');
    };

    return (
        <div className="product-details-page">
            <div className="container">
                <button onClick={() => navigate(-1)} className="back-btn">
                    <ArrowLeft size={20} /> Back to Shop
                </button>

                <div className="product-layout">
                    {/* Left: Image Gallery */}
                    <div className="product-gallery">
                        <div className="main-image-container">
                            <img src={selectedImage} alt={product.name} className="main-image" />
                        </div>
                        <div className="thumbnail-list">
                            {product.images.map((img, idx) => (
                                <button
                                    key={idx}
                                    className={`thumbnail ${selectedImage === img ? 'active' : ''}`}
                                    onClick={() => setSelectedImage(img)}
                                >
                                    <img src={img} alt={`View ${idx + 1}`} />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right: Product Info */}
                    <div className="product-info">
                        <span className="product-category">{product.category}</span>
                        <h1 className="product-title">{product.name}</h1>

                        <div className="product-rating">
                            <div className="stars">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        size={16}
                                        fill={i < Math.floor(product.rating) ? "var(--color-accent)" : "transparent"}
                                        color={i < Math.floor(product.rating) ? "var(--color-accent)" : "#ccc"}
                                    />
                                ))}
                            </div>
                            <span className="rating-count">({product.reviews?.length || 0} Reviews)</span>
                        </div>

                        <div className="product-price">
                            <span className="current-price">₹{product.price}</span>
                            <span className="original-price">₹{product.originalPrice}</span>
                            <span className="discount-tag">{discount}% OFF</span>
                        </div>

                        <div className="tax-note">Inclusive of all taxes</div>

                        {/* Size Selection */}
                        <div className="size-selection">
                            <h3>Select Size</h3>
                            <div className="sizes-grid">
                                {product.variants.map(variant => (
                                    <button
                                        key={variant.size}
                                        className={`size-btn ${selectedSize === variant.size ? 'selected' : ''} ${variant.stock === 0 ? 'disabled' : ''}`}
                                        disabled={variant.stock === 0}
                                        onClick={() => setSelectedSize(variant.size)}
                                    >
                                        {variant.size}
                                    </button>
                                ))}
                            </div>
                            {selectedSize && <p className="size-guide-link">Size Guide</p>}
                        </div>

                        {/* Actions */}
                        <div className="action-buttons">
                            <button className="btn btn-primary add-to-cart-btn" onClick={handleAddToCart}>
                                <ShoppingBag size={20} />
                                Add to Cart
                            </button>
                            <button className="btn btn-outline wishlist-btn" onClick={() => trackProductInteraction(product.id, 'wishlist')}>
                                <Heart size={20} />
                            </button>
                        </div>

                        {/* Features */}
                        <div className="product-features">
                            <div className="feature-row">
                                <Truck size={20} />
                                <div>
                                    <strong>Free Consignment</strong>
                                    <p>On orders above ₹999</p>
                                </div>
                            </div>
                            <div className="feature-row">
                                <ShieldCheck size={20} />
                                <div>
                                    <strong>100% Authentic</strong>
                                    <p>Quality guaranteed</p>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="product-description">
                            <h3>Description</h3>
                            <p>{product.description}</p>
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="reviews-section">
                    <h2>Customer Reviews</h2>
                    <div className="reviews-list">
                        {product.reviews && product.reviews.length > 0 ? (
                            product.reviews.map(review => (
                                <div key={review.id} className="review-card">
                                    <div className="review-header">
                                        <span className="reviewer-name">{review.user}</span>
                                        <div className="stars">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    size={14}
                                                    fill={i < review.rating ? "var(--color-accent)" : "transparent"}
                                                    color={i < review.rating ? "var(--color-accent)" : "#ccc"}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="review-text">"{review.comment}"</p>
                                    <span className="review-date">
                                        {review.verified && 'Verified Purchase • '}
                                        {new Date(review.date).toLocaleDateString()}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p className="no-reviews">No reviews yet. Be the first to review!</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
