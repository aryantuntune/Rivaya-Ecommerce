import React from 'react';
import '../styles/global.css';

const PrivacyPolicy = () => {
    return (
        <div style={{ padding: '120px 20px 60px', maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '2rem', fontFamily: 'var(--font-heading)' }}>Privacy Policy & Terms</h1>

            <div style={{ lineHeight: '1.6', color: '#555' }}>
                <section style={{ marginBottom: '3rem' }}>
                    <h2>Returns & Exchanges Policy</h2>
                    <p><strong>ALL SALES ARE FINAL.</strong> We do not offer returns or exchanges for "change of mind".</p>

                    <h3>Damaged or Incorrect Items</h3>
                    <p>If you receive a damaged or incorrect item, you must report it to us via email at <strong>rivaya.executive@gmail.com</strong> on the <strong>SAME DAY</strong> of delivery.</p>

                    <h3>Reporting Requirements</h3>
                    <p>To process your claim, you must include:</p>
                    <ul>
                        <li>Your Order ID Number.</li>
                        <li>Clear photographs or a short video of the damaged/incorrect item.</li>
                        <li>A brief description of the issue.</li>
                    </ul>

                    <h3>Resolution</h3>
                    <p>Once our Quality Assurance team verifies your claim, we will provide a replacement or store credit at our discretion.</p>
                </section>

                <section style={{ marginBottom: '3rem' }}>
                    <h2>Our Policies & Commitments</h2>
                    <h3>Quality Assurance</h3>
                    <p>Every garment undergoes a rigorous multi-point inspection before shipping to ensure it meets our high standards.</p>

                    <h3>Ethical Sourcing</h3>
                    <p>We are committed to longevity, comfort, and sustainable small-batch production.</p>
                </section>

                <section style={{ marginBottom: '3rem' }}>
                    <h2>Privacy & Data Security</h2>
                    <p>Your privacy is paramount. Rivaya uses industry-standard encryption to protect your payment information.</p>
                    <p>We <strong>never</strong> sell your personal data to third parties. Data is collected solely for the purpose of processing your orders and improving your experience.</p>
                </section>

                <section style={{ marginBottom: '3rem' }}>
                    <h2>Customer Care</h2>
                    <p>For any inquiries, please contact us at:</p>
                    <p>Email: <strong>rivaya.executive@gmail.com</strong></p>
                    <p>We aim to respond to all inquiries within <strong>24 business hours</strong>.</p>
                </section>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
