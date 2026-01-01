import React, { useState } from 'react';
import { Upload, CheckCircle } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import './Complaint.css';

const Complaint = () => {
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        orderId: '',
        issueType: 'Defective Product',
        description: '',
        image: null
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here we would push to admin context in real app
        // For mock:
        console.log("Complaint Submitted", formData);
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="complaint-page container text-center">
                <div className="success-message">
                    <CheckCircle size={64} color="green" />
                    <h1>Complaint Submitted</h1>
                    <p>We have received your request. Our team will review it and get back to you within 24-48 hours via email/phone.</p>
                    <p>Ticket ID: #RIV-{Math.floor(Math.random() * 10000)}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="complaint-page container">
            <h1>Help & Redressal Center</h1>
            <p>We are here to help! Search for #riyavahelp or fill the form below.</p>

            <div className="complaint-form-wrapper">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Full Name</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Email ID</label>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Phone Number</label>
                            <input
                                type="tel"
                                required
                                value={formData.phone}
                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Order ID</label>
                            <input
                                type="text"
                                required
                                placeholder="e.g. #1001"
                                value={formData.orderId}
                                onChange={e => setFormData({ ...formData, orderId: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Issue Type</label>
                            <select
                                value={formData.issueType}
                                onChange={e => setFormData({ ...formData, issueType: e.target.value })}
                            >
                                <option>Defective Product</option>
                                <option>Wrong Item Received</option>
                                <option>Fitting Issue</option>
                                <option>Other</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Description of Issue</label>
                        <textarea
                            rows="4"
                            required
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                        ></textarea>
                    </div>

                    <div className="form-group file-upload">
                        <label>Upload Image/Video of Defect</label>
                        <div className="upload-box">
                            <Upload size={24} />
                            <span>Click to upload image</span>
                            <input type="file" accept="image/*,video/*" />
                        </div>
                        <small>Required for verification of damaged products.</small>
                    </div>

                    <button type="submit" className="btn btn-primary">Submit Complaint</button>
                </form>
            </div>
        </div>
    );
};

export default Complaint;
