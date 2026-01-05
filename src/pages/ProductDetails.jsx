import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import { useCart } from '../context/CartContext';
import { Star, Truck, ShieldCheck, Share2, Heart, Send } from 'lucide-react';
import ProductCard from '../components/ProductCard'; // For Related Products
import './ProductDetails.css';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { products, trackProductInteraction, currentUser, addReview } = useAdmin();
    const { addToCart } = useCart();

    // State
    const [product, setProduct] = useState(null);
    const [selectedImage, setSelectedImage] = useState('');
    const [selectedSize, setSelectedSize] = useState('');
    const [relatedProducts, setRelatedProducts] = useState([]);

    // Review State
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');

    useEffect(() => {
        // Find product
        const found = products.find(p => p.id === id || p._id === id);
        if (found) {
            setProduct(found);
            setSelectedImage(found.images[0]);
            // Track view
            trackProductInteraction(found.id, 'views');

            // SEO: Set Title
            document.title = `${found.name} | Rivaya`;
            // SEO: Meta Description (Basic implementation)
            let metaDesc = document.querySelector('meta[name="description"]');
            if (!metaDesc) {
                metaDesc = document.createElement('meta');
                metaDesc.name = "description";
                document.head.appendChild(metaDesc);
            }
            metaDesc.content = found.description.substring(0, 160);

            // Related Products Logic
            const related = products
                .filter(p => p.category === found.category && p.id !== found.id)
                .slice(0, 4);
            setRelatedProducts(related);

        } else if (products.length > 0) {
            // Only redirect if products have loaded and still not found
            // navigate('/shop');
        }
    }, [id, products, trackProductInteraction]);

    const handleAddToCart = () => {
        if (!selectedSize) {
            alert('Please select a size');
            return;
        }
        // Ensure we pass a single image string to the cart
        const mainImage = (product.images && product.images.length > 0) ? product.images[0] : '';
        // addToCart signature: (product, quantity, size)
        addToCart({ ...product, image: mainImage }, 1, selectedSize);
        trackProductInteraction(product.id, 'addToCart');
        alert('Added to Cart!');
    };

    const handleBuyNow = () => {
        if (!selectedSize) {
            alert('Please select a size');
            return;
        }
        const mainImage = (product.images && product.images.length > 0) ? product.images[0] : '';
        addToCart({ ...product, image: mainImage }, 1, selectedSize);
        trackProductInteraction(product.id, 'addToCart');
        navigate('/checkout');
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!currentUser) {
            alert("Please login to review");
            return;
        }
        await addReview(product.id || product._id, {
            rating,
            comment,
            user: currentUser.name
        });
        setComment('');
        alert("Review Submitted!");
    };

    if (!product) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <div className="loading-text">Loading Details...</div>
            </div>
        );
    }

    return (
        <div className="product-details-page container">
            {/* Breadcrumbs */}
            <div className="breadcrumbs" style={{ margin: '1rem 0', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link>
                <span style={{ margin: '0 0.5rem' }}>/</span>
                <Link to="/shop" style={{ color: 'inherit', textDecoration: 'none' }}>Shop</Link>
                <span style={{ margin: '0 0.5rem' }}>/</span>
                <span style={{ color: 'var(--color-primary)' }}>{product.name}</span>
            </div>

            <div className="product-details-grid">
                {/* Images */}
                <div className="product-images">
                    <div className="thumbnail-list">
                        {product.images.map((img, idx) => (
                            <img
                                key={idx}
                                src={img}
                                alt=""
                                className={selectedImage === img ? 'active' : ''}
                                onClick={() => setSelectedImage(img)}
                            />
                        ))}
                    </div>
                    <div className="main-image">
                        <img src={selectedImage} alt={product.name} />
                    </div>
                </div>

                {/* Info */}
                <div className="product-info">
                    <h1>{product.name}</h1>
                    <div className="rating-row">
                        <div className="stars">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={16} fill={i < Math.floor(product.rating) ? "#ffd700" : "none"} stroke="#ffd700" />
                            ))}
                        </div>
                        <span>({product.numReviews} reviews)</span>
                    </div>

                    <div className="price-row">
                        <span className="current-price">₹{product.price}</span>
                        {product.originalPrice && (
                            <span className="original-price">₹{product.originalPrice}</span>
                        )}
                        {product.originalPrice && (
                            <span className="discount">
                                {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                            </span>
                        )}
                    </div>

                    <p className="description">{product.description}</p>

                    {/* Sizes */}
                    <div className="options-section">
                        <h4>Select Size</h4>
                        <div className="size-options">
                            {/* Prioritize variants for size options */}
                            {(product.variants && product.variants.length > 0 ? product.variants : product.sizes || []).map((option, idx) => {
                                // If iterating variants, option is an object { size, stock, ... }, else it's a string
                                const sizeName = typeof option === 'string' ? option : option.size;
                                const isOutOfStock = typeof option !== 'string' && option.stock <= 0;

                                return (
                                    <button
                                        key={idx}
                                        className={`size-btn ${selectedSize === sizeName ? 'active' : ''} ${isOutOfStock ? 'disabled' : ''}`}
                                        onClick={() => !isOutOfStock && setSelectedSize(sizeName)}
                                        disabled={isOutOfStock}
                                        title={isOutOfStock ? 'Out of Stock' : sizeName}
                                    >
                                        {sizeName}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="action-buttons">
                        <button className="btn btn-primary add-cart-btn" onClick={handleAddToCart}>
                            Add to Cart
                        </button>
                        <button className="btn btn-secondary buy-now-btn" onClick={handleBuyNow} style={{ marginLeft: '1rem', backgroundColor: '#333', color: 'white' }}>
                            Buy Now
                        </button>
                        <button className="btn btn-outline wishlist-btn">
                            <Heart size={20} />
                        </button>
                    </div>

                    {/* Features */}
                    <div className="product-features">
                        <div className="p-feature">
                            <Truck size={20} />
                            <span>Free Shipping above ₹999</span>
                        </div>
                        <div className="p-feature">
                            <ShieldCheck size={20} />
                            <span>100% Authentic Product</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
                <div className="related-products-section">
                    <h3>You May Also Like</h3>
                    <div className="product-grid">
                        {relatedProducts.map(rp => (
                            <ProductCard key={rp.id} product={rp} />
                        ))}
                    </div>
                </div>
            )}

            {/* Reviews Section */}
            <div className="reviews-section">
                <h3>Customer Reviews</h3>

                {/* Review Form */}
                <div className="write-review">
                    <h4>Write a Review</h4>
                    <form onSubmit={handleSubmitReview}>
                        <div className="rating-input">
                            <span>Rating: </span>
                            <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                                <option value="5">5 Stars</option>
                                <option value="4">4 Stars</option>
                                <option value="3">3 Stars</option>
                                <option value="2">2 Stars</option>
                                <option value="1">1 Star</option>
                            </select>
                        </div>
                        <textarea
                            placeholder="Share your thoughts..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            required
                        />
                        <button type="submit" className="btn btn-secondary review-submit-btn">
                            Submit Review <Send size={16} />
                        </button>
                    </form>
                </div>

                {/* Reviews List */}
                <div className="reviews-list">
                    {product.reviews && product.reviews.length > 0 ? (
                        product.reviews.map((rev, idx) => (
                            <div key={idx} className="review-card">
                                <div className="review-header">
                                    <div className="reviewer-name">{rev.user}</div>
                                    <div className="review-stars">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={12} fill={i < rev.rating ? "#ffd700" : "none"} stroke="#ffd700" />
                                        ))}
                                    </div>
                                </div>
                                <p className="review-text">{rev.comment}</p>
                                <span className="review-date">{new Date(rev.createdAt).toLocaleDateString()}</span>
                            </div>
                        ))
                    ) : (
                        <p className="no-reviews">No reviews yet. Be the first!</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
