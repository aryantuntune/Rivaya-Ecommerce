import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import './AuthModal.css';

const AuthModal = ({ isOpen, onClose, mode: initialMode = 'login' }) => {
    const [mode, setMode] = useState(initialMode);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const { login, register } = useAdmin();

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (mode === 'login') {
            const result = login(formData.email, formData.password);
            if (result.success) {
                onClose();
            } else {
                setError(result.message);
            }
        } else {
            const result = register(formData);
            if (result.success) {
                onClose();
            } else {
                setError(result.message);
            }
        }
    };

    return (
        <>
            <div className="modal-overlay" onClick={onClose}></div>
            <div className="auth-modal">
                <button className="modal-close" onClick={onClose}>
                    <X size={24} />
                </button>

                <h2>{mode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    {mode === 'register' && (
                        <input
                            type="text"
                            placeholder="Full Name"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    )}

                    <input
                        type="email"
                        placeholder="Email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        required
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />

                    <button type="submit" className="btn btn-primary">
                        {mode === 'login' ? 'Login' : 'Register'}
                    </button>
                </form>

                <p className="auth-switch">
                    {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
                    <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
                        {mode === 'login' ? 'Register' : 'Login'}
                    </button>
                </p>

                {mode === 'login' && (
                    <div className="demo-credentials">
                        <p><strong>Demo Admin:</strong></p>
                        <p>Email: admin@vrishtikalaa.com</p>
                        <p>Password: admin123</p>
                    </div>
                )}
            </div>
        </>
    );
};

export default AuthModal;
