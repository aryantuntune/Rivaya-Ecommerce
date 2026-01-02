import React, { useState, useMemo } from 'react';
import { useAdmin } from '../context/AdminContext';
import ProductCard from '../components/ProductCard';
import { SlidersHorizontal, X } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import '../styles/global.css';
import './ProductList.css';

const ProductList = () => {
    const { products, collections } = useAdmin();
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get('search') || '';
    const categoryParam = searchParams.get('category');
    const collectionParam = searchParams.get('collection');

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState(categoryParam ? [categoryParam] : []);
    const [selectedCollections, setSelectedCollections] = useState(collectionParam ? [collectionParam] : []);
    const [priceRange, setPriceRange] = useState([0, 10000]);
    const [sortBy, setSortBy] = useState('featured');

    // Get unique categories dynamically from products
    const uniqueCategories = useMemo(() => {
        const cats = products.map(p => p.category);
        return [...new Set(cats)];
    }, [products]);

    // Filter and sort products
    const filteredProducts = useMemo(() => {
        let filtered = [...products];

        // Search filter
        if (searchQuery) {
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.category.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Category filter
        if (selectedCategories.length > 0) {
            filtered = filtered.filter(p => selectedCategories.includes(p.category));
        }

        // Collection filter (New)
        if (selectedCollections.length > 0) {
            // Find active collections matching selection
            const activeCollectionIds = collections
                .filter(c => selectedCollections.includes(c.name)) // Assuming name match or ID
                .flatMap(c => c.productIds);

            // Filter products that are part of these collections
            // Or if collection is stored on product itself, adapt here.
            // Using ID map from mockCollections:
            if (activeCollectionIds.length > 0) {
                filtered = filtered.filter(p => activeCollectionIds.includes(p.id));
            }
        }

        // Price filter
        filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

        // Sort
        switch (sortBy) {
            case 'price-low':
                filtered.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                filtered.sort((a, b) => b.price - a.price);
                break;
            case 'newest':
                filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
                break;
            case 'rating':
                filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
                break;
            default:
                break;
        }

        return filtered;
    }, [searchQuery, selectedCategories, selectedCollections, priceRange, sortBy, products, collections]);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const paginatedProducts = filteredProducts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Reset to page 1 when filters change
    useMemo(() => {
        setCurrentPage(1);
    }, [filteredProducts]);

    const toggleCategory = (category) => {
        setSelectedCategories(prev =>
            prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev, category]
        );
    };

    const toggleCollection = (collectionName) => {
        setSelectedCollections(prev =>
            prev.includes(collectionName)
                ? prev.filter(c => c !== collectionName)
                : [...prev, collectionName]
        );
    };

    const clearFilters = () => {
        setSelectedCategories([]);
        setSelectedCollections([]);
        setPriceRange([0, 10000]);
    };

    return (
        <div className="product-list-page">
            <div className="container">
                {/* Page Header */}
                <div className="page-header">
                    <h1>{searchQuery ? `Search Results for "${searchQuery}"` : 'Shop All'}</h1>
                    <p>Explore our curated collection of fine ethnic wear</p>
                </div>

                <div className="shop-layout">
                    {/* Filter Sidebar */}
                    <aside className={`filter-sidebar ${isFilterOpen ? 'open' : ''}`}>
                        <div className="filter-header">
                            <h3>Filters</h3>
                            <button className="close-filter mobile-only" onClick={() => setIsFilterOpen(false)}>
                                <X size={24} />
                            </button>
                        </div>

                        {/* Collections Filter (New) */}
                        <div className="filter-section">
                            <h4>Collections</h4>
                            {collections.length > 0 ? collections.map(col => (
                                <label key={col.id} className="filter-checkbox">
                                    <input
                                        type="checkbox"
                                        checked={selectedCollections.includes(col.name)}
                                        onChange={() => toggleCollection(col.name)}
                                    />
                                    <span>{col.name}</span>
                                </label>
                            )) : <p className="text-muted">No collections found</p>}
                        </div>


                        {/* Category Filter */}
                        <div className="filter-section">
                            <h4>Category</h4>
                            {uniqueCategories.map(cat => (
                                <label key={cat} className="filter-checkbox">
                                    <input
                                        type="checkbox"
                                        checked={selectedCategories.includes(cat)}
                                        onChange={() => toggleCategory(cat)}
                                    />
                                    <span>{cat}</span>
                                </label>
                            ))}
                        </div>

                        {/* Price Filter */}
                        <div className="filter-section">
                            <h4>Price Range</h4>
                            <div className="price-inputs">
                                <input
                                    type="number"
                                    placeholder="Min"
                                    value={priceRange[0]}
                                    onChange={(e) => setPriceRange([+e.target.value, priceRange[1]])}
                                />
                                <span>-</span>
                                <input
                                    type="number"
                                    placeholder="Max"
                                    value={priceRange[1]}
                                    onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
                                />
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="10000"
                                step="100"
                                value={priceRange[1]}
                                onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
                                className="price-slider"
                            />
                            <div className="price-display">₹{priceRange[0]} - ₹{priceRange[1]}</div>
                        </div>

                        <button className="btn btn-outline clear-filters" onClick={clearFilters}>
                            Clear All Filters
                        </button>
                    </aside>

                    {/* Products Section */}
                    <div className="products-section">
                        {/* Filters Bar */}
                        <div className="filters-bar">
                            <div className="filters-left">
                                <button className="filter-toggle-btn" onClick={() => setIsFilterOpen(!isFilterOpen)}>
                                    <SlidersHorizontal size={18} />
                                    <span>Filters</span>
                                </button>
                                <span className="product-count">
                                    Showing {paginatedProducts.length} of {filteredProducts.length} Products
                                </span>
                                {(selectedCategories.length > 0 || selectedCollections.length > 0 || priceRange[0] > 0 || priceRange[1] < 10000) && (
                                    <button className="clear-filters-mobile" onClick={clearFilters}>
                                        Clear Filters
                                    </button>
                                )}
                            </div>
                            <div className="sort-options">
                                <select className="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                                    <option value="featured">Sort by: Featured</option>
                                    <option value="price-low">Price: Low to High</option>
                                    <option value="price-high">Price: High to Low</option>
                                    <option value="newest">Newest First</option>
                                    <option value="rating">Highest Rated</option>
                                </select>
                            </div>
                        </div>

                        {/* Products Grid */}
                        {paginatedProducts.length > 0 ? (
                            <>
                                <div className="products-grid">
                                    {paginatedProducts.map(product => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>

                                {/* Pagination Controls */}
                                {totalPages > 1 && (
                                    <div className="pagination">
                                        <button
                                            className="page-btn"
                                            disabled={currentPage === 1}
                                            onClick={() => {
                                                setCurrentPage(prev => prev - 1);
                                                window.scrollTo(0, 0);
                                            }}
                                        >
                                            Previous
                                        </button>

                                        {[...Array(totalPages)].map((_, i) => (
                                            <button
                                                key={i + 1}
                                                className={`page-num ${currentPage === i + 1 ? 'active' : ''}`}
                                                onClick={() => {
                                                    setCurrentPage(i + 1);
                                                    window.scrollTo(0, 0);
                                                }}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}

                                        <button
                                            className="page-btn"
                                            disabled={currentPage === totalPages}
                                            onClick={() => {
                                                setCurrentPage(prev => prev + 1);
                                                window.scrollTo(0, 0);
                                            }}
                                        >
                                            Next
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="no-products">
                                <p>No products found matching your criteria.</p>
                                <button className="btn btn-primary" onClick={clearFilters}>Clear Filters</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductList;
