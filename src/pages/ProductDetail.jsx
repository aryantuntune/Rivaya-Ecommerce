import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';
import { Heart, ShoppingBag, Truck, RotateCcw, ShieldCheck, MapPin, Star, ChevronRight } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import '../styles/global.css';
import './ProductDetail.css';

const ProductDetail = () => {
    const { id } = useParams();
    const product = products.find(p => p.id === parseInt(id));
    const { addToCart, addToWishlist, isInWishlist } = useCart();

    const [selectedSize, setSelectedSize] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [pincode, setPincode] = useState('');
    const [deliveryStatus, setDeliveryStatus] = useState('');
    const [deliveryInfo, setDeliveryInfo] = useState(null);
    const [showSizeGuide, setShowSizeGuide] = useState(false);
    const [activeImage, setActiveImage] = useState(product ? product.images[0] : '');

    if (!product) return <div className="container" style={{ padding: '100px' }}>Product not found</div>;

    const relatedProducts = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

    // Check wishlist status safely
    const inWishlist = isInWishlist ? isInWishlist(product.id) : false;

    const handleSizeSelect = (size) => {
        setSelectedSize(size);
    };

    const handleAddToCart = () => {
        if (!selectedSize) {
            alert('Please select a size');
            return;
        }

        // Final stock check
        const variant = product.variants?.find(v => v.size === selectedSize);
        if (!variant || variant.stock < quantity) {
            alert('Insufficient stock for selected size');
            return;
        }

        addToCart(product, selectedSize, quantity);
        alert('Added to cart!');
    };

    const checkPincode = (e) => {
        e.preventDefault();
        if (pincode.length === 6) {
            setDeliveryStatus('Available');
            setDeliveryInfo({
                days: Math.floor(Math.random() * 5) + 3,
                cod: true
            });
        } else {
            setDeliveryStatus('');
            alert('Please enter a valid 6-digit pincode');
        }
    };

    return (
        <div className="product-detail-page">
            <div className="container">
                {/* Breadcrumb */}
                <div className="breadcrumb">
                    <Link to="/">Home</Link>
                    <ChevronRight size={16} />
                    <Link to="/shop">Shop</Link>
                    <ChevronRight size={16} />
                    <Link to={`/shop?category=${product.category}`}>{product.category}</Link>
                    <ChevronRight size={16} />
                    <span>{product.name}</span>
                </div>

                <div className="product-layout">
                    {/* Image Section */}
                    <div className="product-gallery">
                        <div className="main-image-wrapper">
                            <img src={activeImage || product.images[0]} alt={product.name} className="main-image" />
                            {product.isNew && <span className="badge-new">NEW</span>}
                        </div>
                        <div className="thumbnails">
                            {product.images.map((img, idx) => (
                                <img
                                    key={idx}
                                    src={img}
                                    alt={`Thumbnail ${idx}`}
                                    className={`thumb ${activeImage === img ? 'active' : ''}`}
                                    onClick={() => setActiveImage(img)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Details Section */}
                    <div className="product-info-column">
                        <h1 className="pdp-title">{product.name}</h1>

                        {/* Rating */}
                        {product.rating && (
                            <div className="pdp-rating">
                                <div className="stars">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={18}
                                            fill={i < Math.floor(product.rating) ? '#d4af37' : 'none'}
                                            color={i < Math.floor(product.rating) ? '#d4af37' : '#ddd'}
                                        />
                                    ))}
                                </div>
                                <span className="rating-text">{product.rating} ({product.reviews} reviews)</span>
                            </div>
                        )}

                        <div className="pdp-price-wrapper">
                            <span className="pdp-price">₹{product.price}</span>
                            {product.originalPrice && (
                                <>
                                    <span className="pdp-original-price">₹{product.originalPrice}</span>
                                    <span className="pdp-discount">
                                        {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                                    </span>
                                </>
                            )}
                        </div>

                        <div className="pdp-divider"></div>

                        {/* Main Interaction Section */}
                        <div className="pdp-section">
                            {product.colors && product.colors.length > 0 && (
                                <div className="pdp-section-row">
                                    <div className="pdp-label">Available Colors</div>
                                    <div className="color-swatches-row">
                                        {product.colors.map(c => (
                                            <span key={c} style={{ background: c, width: '20px', height: '20px', borderRadius: '50%', display: 'inline-block', marginRight: '5px', border: '1px solid #ddd' }}></span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Size Selector */}
                            <div className="selector-group">
                                <h3>Select Size</h3>
                                <div className="size-options">
                                    {/* Use variants to render sizes if available, else fall back to default logic */}
                                    {product.variants ? product.variants.map((variant) => (
                                        <button
                                            key={variant.size}
                                            className={`size-btn ${selectedSize === variant.size ? 'active' : ''} ${variant.stock === 0 ? 'disabled' : ''}`}
                                            onClick={() => variant.stock > 0 && handleSizeSelect(variant.size)}
                                            disabled={variant.stock === 0}
                                            title={variant.stock === 0 ? 'Out of Stock' : `${variant.stock} left`}
                                        >
                                            {variant.size}
                                        </button>
                                    )) : (
                                        // Fallback for old data if variants are not defined
                                        (product.sizes || ['XS', 'S', 'M', 'L', 'XL', 'XXL']).map(size => (
                                            <button
                                                key={size}
                                                className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                                                onClick={() => handleSizeSelect(size)}
                                            >
                                                {size}
                                            </button>
                                        ))
                                    )}
                                </div>
                                <button className="text-btn guide-btn" onClick={() => setShowSizeGuide(!showSizeGuide)}>
                                    Size Guide
                                </button>
                            </div>

                            {showSizeGuide && (
                                <div className="size-guide-table">
                                    <table>
                                        <thead><tr><th>Size</th><th>Bust (in)</th><th>Waist (in)</th><th>Hip (in)</th></tr></thead>
                                        <tbody>
                                            <tr><td>XS</td><td>32</td><td>26</td><td>34</td></tr>
                                            <tr><td>S</td><td>34</td><td>28</td><td>36</td></tr>
                                            <tr><td>M</td><td>36</td><td>30</td><td>38</td></tr>
                                            <tr><td>L</td><td>38</td><td>32</td><td>40</td></tr>
                                            <tr><td>XL</td><td>40</td><td>34</td><td>42</td></tr>
                                            <tr><td>XXL</td><td>42</td><td>36</td><td>44</td></tr>
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* Pincode Checker */}
                            <div className="selector-group">
                                <h3>Check Delivery</h3>
                                <form className="pincode-checker" onSubmit={checkPincode}>
                                    <MapPin size={18} />
                                    <input
                                        type="text"
                                        placeholder="Enter Pincode"
                                        value={pincode}
                                        onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                        maxLength={6}
                                    />
                                    <button type="submit">Check</button>
                                </form>
                                {deliveryStatus && (
                                    <div className="delivery-info">
                                        <p className="delivery-available">
                                            ✓ Delivery available {deliveryInfo?.days ? `in ${deliveryInfo.days} days` : ''}
                                        </p>
                                        {deliveryInfo?.cod && <p className="cod-available">✓ Cash on Delivery available</p>}
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="pdp-actions">
                                <div className="quantity-selector">
                                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                                    <span>{quantity}</span>
                                    <button onClick={() => setQuantity(quantity + 1)}>+</button>
                                </div>

                                <button
                                    className="btn btn-primary add-to-cart-btn"
                                    onClick={handleAddToCart}
                                    disabled={!selectedSize}
                                >
                                    <ShoppingBag size={20} style={{ marginRight: '8px' }} />
                                    Add to Bag
                                </button>

                                <button
                                    className={`wishlist-btn ${inWishlist ? 'active' : ''}`}
                                    onClick={() => addToWishlist(product)}
                                >
                                    <Heart size={24} fill={inWishlist ? 'currentColor' : 'none'} />
                                </button>
                            </div>

                            {/* Trust Badges */}
                            <div className="trust-badges">
                                <div className="badge-item">
                                    <Truck size={20} />
                                    <span>Free Shipping</span>
                                </div>
                                <div className="badge-item">
                                    <RotateCcw size={20} />
                                    <span>7 Day Returns</span>
                                </div>
                                <div className="badge-item">
                                    <ShieldCheck size={20} />
                                    <span>Authentic Products</span>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="pdp-description">
                                <h3>Description</h3>
                                <p>
                                    Experience the luxury of our {product.name}. Crafted with precision and care,
                                    this piece from our {product.category} collection embodies the rich heritage
                                    of Indian craftsmanship. Perfect for festive occasions or elegant gatherings.
                                </p>
                                <ul>
                                    <li>Material: Premium Silk Blend</li>
                                    <li>Care: Dry Clean Only</li>
                                    <li>Fit: Regular Fit</li>
                                    <li>Pattern: Embroidered</li>
                                    <li>Occasion: Festive, Party, Wedding</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Related Products */}
                    {relatedProducts.length > 0 && (
                        <div className="related-products">
                            <h2>You May Also Like</h2>
                            <div className="related-grid">
                                {relatedProducts.map(p => (
                                    <ProductCard key={p.id} product={p} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
