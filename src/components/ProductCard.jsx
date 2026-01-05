import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAdmin } from '../context/AdminContext'; // Assuming this context exists
import './ProductCard.css';

const ProductCard = ({ product }) => {
    const { addToCart, addToWishlist, isInWishlist } = useCart();
    const navigate = useNavigate();
    const { trackProductInteraction } = useAdmin();

    // Check wishlist status safely
    const inWishlist = isInWishlist ? isInWishlist(product.id) : false;

    // Calculate total stock from variants
    const totalStock = product.variants
        ? product.variants.reduce((acc, v) => acc + v.stock, 0)
        : (product.stockQuantity || 0);

    const isOutOfStock = totalStock === 0;

    const handleProductClick = () => {
        trackProductInteraction(product.id, 'views');
        navigate(`/product/${product.id}`);
    };

    const handleWishlist = (e) => {
        e.stopPropagation();
        e.preventDefault();
        addToWishlist(product);
    };

    const handleAddToCart = (e) => {
        e.stopPropagation();
        e.preventDefault();
        if (isOutOfStock) return;

        // Default to first available size if adding directly from card
        let sizeToAdd = 'S';
        if (product.variants) {
            const availableVariant = product.variants.find(v => v.stock > 0);
            if (availableVariant) sizeToAdd = availableVariant.size;
        }

        // addToCart signature: (product, quantity, size)
        addToCart(product, 1, sizeToAdd);
        trackProductInteraction(product.id, 'addToCart');
    };

    return (
        <div className="product-card" onClick={handleProductClick}>
            <div className="product-image">
                <img src={product.images[0]} alt={product.name} className="card-image" />
                {product.isNew && <span className="badge new">NEW</span>}
                {isOutOfStock && <span className="badge out-of-stock">OUT OF STOCK</span>}

                <div className="card-actions">
                    <button
                        className={`action-btn ${inWishlist ? 'active' : ''}`}
                        aria-label="Add to Wishlist"
                        onClick={handleWishlist}
                    >
                        <Heart size={18} fill={inWishlist ? 'currentColor' : 'none'} />
                    </button>
                    <button
                        className="action-btn"
                        aria-label="Quick Add"
                        onClick={handleAddToCart}
                        disabled={isOutOfStock}
                        title={isOutOfStock ? "Out of Stock" : "Quick Add"}
                    >
                        <ShoppingBag size={18} />
                    </button>
                </div>
            </div>

            <div className="card-info">
                <p className="card-category">{product.category}</p>
                <h3 className="card-title">
                    <Link to={`/product/${product.id}`}>{product.name}</Link>
                </h3>

                {/* Rating */}
                {product.rating && (
                    <div className="card-rating">
                        <div className="stars">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    size={14}
                                    fill={i < Math.floor(product.rating) ? '#d4af37' : 'none'}
                                    color={i < Math.floor(product.rating) ? '#d4af37' : '#ddd'}
                                />
                            ))}
                        </div>
                        <span className="rating-text">({product.reviews?.length || 0})</span>
                    </div>
                )}

                <div className="card-price">
                    <span className="current-price">₹{product.price}</span>
                    {product.originalPrice && (
                        <>
                            <span className="original-price">₹{product.originalPrice}</span>
                            <span className="discount-badge">
                                {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                            </span>
                        </>
                    )}
                </div>

                {/* Color Swatches */}
                {product.colors && product.colors.length > 0 && (
                    <div className="color-swatches">
                        {product.colors.slice(0, 4).map((color, index) => (
                            <span
                                key={index}
                                className="color-swatch"
                                style={{ backgroundColor: color }}
                                title={color}
                            ></span>
                        ))}
                        {product.colors.length > 4 && (
                            <span className="color-more">+{product.colors.length - 4}</span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductCard;
