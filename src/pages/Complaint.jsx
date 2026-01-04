import React, { useState } from 'react';
import { MessageCircle, Mail, Send, Upload } from 'lucide-react';
import '../styles/global.css';
import './Complaint.css';

import { useAdmin } from '../context/AdminContext';

const Complaint = () => {
    const { addComplaint } = useAdmin();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        issue: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        addComplaint(formData);
        alert('Complaint submitted successfully! We will contact you shortly.');
        setFormData({ name: '', email: '', issue: '' });
    };

    const handleWhatsApp = () => {
        window.open('https://wa.me/919876543210', '_blank');
    };

    return (
        <div className="complaint-page">
            <div className="container">
                <div className="page-header">
                    <h1>Contact & Support</h1>
                    <p>We are here to help you</p>
                </div>

                <div className="support-channels">
                    <div className="channel-card" onClick={handleWhatsApp}>
                        <div className="icon-wrapper whatsapp">
                            <MessageCircle size={32} />
                        </div>
                        <h3>WhatsApp Us</h3>
                        <p>Chat with our support team instantly.</p>
                        <span className="action-text">Click to Chat</span>
                    </div>

                    <div className="channel-card">
                        <div className="icon-wrapper email">
                            <Mail size={32} />
                        </div>
                        <h3>Email Support</h3>
                        <p>rivaya.executive@gmail.com</p>
                        <a href="mailto:rivaya.executive@gmail.com" className="action-text">Send Email</a>
                    </div>
                </div>

                {/* Complaint Form */}
                <div className="complaint-form-section">
                    <h2>Complaint & Redressal</h2>
                    <p>Facing an issue? Let us know and we will fix it.</p>

                    <form className="complaint-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                                placeholder="Your Name"
                            />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                                placeholder="Your Email"
                            />
                        </div>
                        <div className="form-group">
                            <label>Describe Issue</label>
                            <textarea
                                value={formData.issue}
                                onChange={(e) => setFormData({ ...formData, issue: e.target.value })}
                                required
                                rows="5"
                                placeholder="Please describe the issue you are facing..."
                            ></textarea>
                        </div>

                        <div className="form-group">
                            <label>Upload Image (Optional)</label>
                            <div className="file-upload">
                                <Upload size={20} />
                                <span>Click to upload screenshot</span>
                                <input type="file" accept="image/*" />
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary">
                            <Send size={18} /> Submit Complaint
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Complaint;
