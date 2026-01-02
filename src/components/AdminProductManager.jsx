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
        variants: [
            { size: 'S', stock: 10, sku: '' },
            { size: 'M', stock: 10, sku: '' },
            { size: 'L', stock: 10, sku: '' },
            { size: 'XL', stock: 10, sku: '' }
        ]
    };

    const handleEdit = (product) => {
        setEditProduct(product);
        setIsEditing(true);
    };

    const handleCreate = () => {
        setEditProduct(initialProductState);
        setIsEditing(true);
    };

    const handleSave = (e) => {
        e.preventDefault();
        if (editProduct.id) {
            updateProduct(editProduct.id, editProduct);
        } else {
            addProduct(editProduct);
        }
        setIsEditing(false);
        setEditProduct(null);
    };

    const handleVariantChange = (index, field, value) => {
        const newVariants = [...editProduct.variants];
        newVariants[index][field] = value;
        setEditProduct({ ...editProduct, variants: newVariants });
    };

    const addVariant = () => {
        setEditProduct({
            ...editProduct,
            variants: [...editProduct.variants, { size: '', stock: 0, sku: '' }]
        });
    };

    const removeVariant = (index) => {
        const newVariants = editProduct.variants.filter((_, i) => i !== index);
        setEditProduct({ ...editProduct, variants: newVariants });
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
                                    value={editProduct.category}
                                    onChange={(e) => setEditProduct({ ...editProduct, category: e.target.value })}
                                >
                                    <option>Short Kurti</option>
                                    <option>Long Kurti</option>
                                    <option>Backless Designs</option>
                                    <option>Ethnic Sets</option>
                                    <option>Sarees</option>
                                    <option>Lehenga</option>
                                </select>
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
                                            placeholder="SKU (e.g. RIV-001)"
                                            value={variant.sku}
                                            onChange={(e) => handleVariantChange(index, 'sku', e.target.value)}
                                            className="sku-input"
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
                            <label>Product Image</label>
                            <div className="image-upload-container">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            const reader = new FileReader();
                                            reader.onloadend = () => {
                                                setEditProduct({ ...editProduct, images: [reader.result] });
                                            };
                                            reader.readAsDataURL(file);
                                        }
                                    }}
                                    className="file-input"
                                />
                                {editProduct.images[0] && (
                                    <div className="image-preview">
                                        <img src={editProduct.images[0]} alt="Preview" />
                                        <button
                                            type="button"
                                            className="btn-icon remove-image"
                                            onClick={() => setEditProduct({ ...editProduct, images: [''] })}
                                        >
                                            <Trash size={14} />
                                        </button>
                                    </div>
                                )}
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
                        return (
                            <div key={p.id} className="table-row">
                                <div className="product-cell">
                                    <img src={p.images[0]} alt={p.name} />
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
