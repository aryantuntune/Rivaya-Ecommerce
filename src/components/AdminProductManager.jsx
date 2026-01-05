import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { Plus, Trash, Edit, Save, X } from 'lucide-react';
import './AdminProductManager.css';

const AdminProductManager = () => {
    const { products, addProduct, updateProduct, deleteProduct } = useAdmin();
    const [isEditing, setIsEditing] = useState(false);
    const [editProduct, setEditProduct] = useState(null);

    // Initial empty state for new product
    const initialProductState = {
        name: '',
        category: 'Short Kurti',
        price: '',
        description: '',
        images: [''],
        trending: false,
        variants: [
            { size: 'S', stock: 10, sku: '' },
            { size: 'M', stock: 10, sku: '' },
            { size: 'L', stock: 10, sku: '' },
            { size: 'XL', stock: 10, sku: '' }
        ]
    };

    const [customCategory, setCustomCategory] = useState('');
    const [isCustomCategory, setIsCustomCategory] = useState(false);

    const categories = ['Short Kurti', 'Long Kurti', 'Backless Designs', 'Ethnic Sets', 'Sarees', 'Lehenga', 'Men', 'Accessories', 'Couple'];

    const handleCategoryChange = (e) => {
        const val = e.target.value;
        if (val === 'custom') {
            setIsCustomCategory(true);
            setEditProduct({ ...editProduct, category: '' });
        } else {
            setIsCustomCategory(false);
            setEditProduct({ ...editProduct, category: val });
        }
    };

    const handleEdit = (product) => {
        setEditProduct(product);
        setIsEditing(true);
    };

    const handleCreate = () => {
        setEditProduct(initialProductState);
        setIsEditing(true);
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            const newImages = [];
            let processed = 0;

            files.forEach(file => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    newImages.push(reader.result);
                    processed++;
                    if (processed === files.length) {
                        setEditProduct(prev => ({
                            ...prev,
                            images: [...prev.images.filter(img => img), ...newImages]
                        }));
                    }
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const removeImage = (indexToRemove) => {
        setEditProduct(prev => ({
            ...prev,
            images: prev.images.filter((_, index) => index !== indexToRemove)
        }));
    };

    const validateProduct = () => {
        // Validate SKUs
        const skus = editProduct.variants.map(v => v.sku?.trim()).filter(Boolean);
        const uniqueSkus = new Set(skus);
        if (skus.length !== uniqueSkus.size) {
            alert("Error: Duplicate SKUs detected within this product. Please ensure each variant has a unique SKU.");
            return false;
        }

        // Validate Images
        if (!editProduct.images || editProduct.images.length === 0 || editProduct.images.every(img => !img)) {
            alert("Error: Please upload at least one product image.");
            return false;
        }

        return true;
    };

    const handleSave = (e) => {
        e.preventDefault();
        if (!validateProduct()) return;

        if (editProduct.id) {
            updateProduct(editProduct.id, editProduct);
        } else {
            addProduct(editProduct);
        }
        setIsEditing(false);
        setEditProduct(null);
    };

    return (
        <div className="product-manager">
            <div className="manager-header">
                <h2>Inventory Management</h2>
                <button className="btn btn-primary" onClick={handleCreate}>
                    <Plus size={16} /> Add Product
                </button>
            </div>

            {isEditing ? (
                <div className="edit-form-container">
                    <div className="form-header">
                        <h3>{editProduct.id ? 'Edit Product' : 'Add New Product'}</h3>
                        <button className="btn-icon" onClick={() => setIsEditing(false)}><X size={20} /></button>
                    </div>
                    <form onSubmit={handleSave} className="product-form">
                        <div className="form-group">
                            <label>Product Name</label>
                            <input
                                type="text"
                                value={editProduct.name}
                                onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Category</label>
                                <select
                                    value={isCustomCategory ? 'custom' : editProduct.category}
                                    onChange={handleCategoryChange}
                                >
                                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                    {!categories.includes(editProduct.category) && editProduct.category && !isCustomCategory && <option value={editProduct.category}>{editProduct.category}</option>}
                                    <option value="custom">+ Add New Collection</option>
                                </select>
                                {isCustomCategory && (
                                    <input
                                        type="text"
                                        placeholder="Enter new collection name"
                                        value={editProduct.category}
                                        onChange={(e) => setEditProduct({ ...editProduct, category: e.target.value })}
                                        style={{ marginTop: '0.5rem' }}
                                        autoFocus
                                    />
                                )}
                            </div>
                            <div className="form-group">
                                <label>Price (₹)</label>
                                <input
                                    type="number"
                                    value={editProduct.price}
                                    onChange={(e) => setEditProduct({ ...editProduct, price: Number(e.target.value) })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Original Price (₹) <span className="text-muted" style={{ fontWeight: 'normal' }}>(Optional - for strike-through)</span></label>
                            <input
                                type="number"
                                value={editProduct.originalPrice || ''}
                                onChange={(e) => setEditProduct({ ...editProduct, originalPrice: Number(e.target.value) })}
                            />
                        </div>

                        <div className="form-group">
                            <label className="checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={editProduct.trending || false}
                                    onChange={(e) => setEditProduct({ ...editProduct, trending: e.target.checked })}
                                    style={{ width: 'auto', margin: 0 }}
                                />
                                <span>Mark as Trending (Shows on Home Page)</span>
                            </label>
                        </div>

                        <div className="form-group">
                            <label>Description</label>
                            <textarea
                                value={editProduct.description}
                                onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })}
                                rows={4}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Inventory (SKU per Size)</label>
                            <div className="variants-list">
                                {editProduct.variants.map((variant, index) => (
                                    <div key={index} className="variant-row">
                                        <input
                                            type="text"
                                            placeholder="Size"
                                            value={variant.size}
                                            onChange={(e) => handleVariantChange(index, 'size', e.target.value)}
                                            className="size-input"
                                        />
                                        <input
                                            type="number"
                                            placeholder="Stock"
                                            value={variant.stock}
                                            onChange={(e) => handleVariantChange(index, 'stock', Number(e.target.value))}
                                            className="stock-input"
                                        />
                                        <input
                                            type="text"
                                            placeholder="SKU (e.g. RIV-001-S)"
                                            value={variant.sku}
                                            onChange={(e) => handleVariantChange(index, 'sku', e.target.value)}
                                            className="sku-input"
                                            title="Must be unique"
                                        />
                                        <button type="button" className="btn-icon delete" onClick={() => removeVariant(index)}>
                                            <Trash size={16} />
                                        </button>
                                    </div>
                                ))}
                                <button type="button" className="btn btn-outline btn-sm" onClick={addVariant}>
                                    + Add Variant
                                </button>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Product Images (Select multiple)</label>
                            <div className="image-upload-container">
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageUpload}
                                    className="file-input"
                                />
                                <div className="image-gallery-preview" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '1rem' }}>
                                    {editProduct.images && editProduct.images.length > 0 && editProduct.images.map((img, idx) => (
                                        img && (
                                            <div key={idx} className="image-preview" style={{ position: 'relative', width: '100px', height: '120px' }}>
                                                <img
                                                    src={img}
                                                    alt={`Preview ${idx}`}
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }}
                                                />
                                                <button
                                                    type="button"
                                                    className="btn-icon remove-image"
                                                    onClick={() => removeImage(idx)}
                                                    style={{
                                                        position: 'absolute',
                                                        top: '-8px',
                                                        right: '-8px',
                                                        background: 'red',
                                                        color: 'white',
                                                        borderRadius: '50%',
                                                        width: '24px',
                                                        height: '24px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        border: 'none',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    <X size={14} />
                                                </button>
                                                {idx === 0 && <span style={{ position: 'absolute', bottom: '0', left: '0', right: '0', background: 'rgba(0,0,0,0.6)', color: 'white', fontSize: '0.7rem', padding: '2px', textAlign: 'center' }}>Main</span>}
                                            </div>
                                        )
                                    ))}
                                </div>
                                <p className="text-muted" style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
                                    First image will be the main display image. Upload up to 7 images.
                                </p>
                            </div>
                        </div>

                        <div className="form-actions">
                            <button type="button" className="btn btn-outline" onClick={() => setIsEditing(false)}>Cancel</button>
                            <button type="submit" className="btn btn-primary">Save Product</button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="products-list-table">
                    <div className="table-header">
                        <span>Product</span>
                        <span>Category</span>
                        <span>Price</span>
                        <span>Total Stock</span>
                        <span>Actions</span>
                    </div>
                    {products.map(p => {
                        const totalStock = p.variants ? p.variants.reduce((sum, v) => sum + v.stock, 0) : 0;
                        const mainImage = p.images && p.images.length > 0 ? p.images[0] : '';
                        return (
                            <div key={p.id} className="table-row">
                                <div className="product-cell">
                                    {mainImage && <img src={mainImage} alt={p.name} />}
                                    <span>{p.name}</span>
                                </div>
                                <span>{p.category}</span>
                                <span>₹{p.price}</span>
                                <span className={totalStock < 5 ? 'low-stock' : ''}>{totalStock} units</span>
                                <div className="actions-cell">
                                    <button onClick={() => handleEdit(p)} title="Edit"><Edit size={18} /></button>
                                    <button onClick={() => deleteProduct(p.id)} title="Delete" className="delete"><Trash size={18} /></button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default AdminProductManager;
