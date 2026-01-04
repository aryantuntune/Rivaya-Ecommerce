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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (mode === 'login') {
            const result = await login(formData.email, formData.password);
            if (result.success) {
                onClose();
            } else {
                setError(result.message);
            }
        } else {
            const result = await register(formData);
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
                        <>
                            <div className="form-row" style={{ display: 'flex', gap: '0.5rem' }}>
                                <input
                                    type="text"
                                    placeholder="First Name"
                                    required
                                    value={formData.firstName || ''}
                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                />
                                <input
                                    type="text"
                                    placeholder="Last Name"
                                    required
                                    value={formData.lastName || ''}
                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                />
                            </div>
                            <input
                                type="tel"
                                placeholder="Phone Number"
                                required
                                value={formData.phone || ''}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </>
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
            </div>
        </>
    );
};

export default AuthModal;
