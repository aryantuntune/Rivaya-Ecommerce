import React from 'react';
import { Star } from 'lucide-react';
import './TestimonialCard.css';

const TestimonialCard = ({ testimonial }) => {
    return (
        <div className="testimonial-card">
            <div className="testimonial-header">
                <img src={testimonial.image} alt={testimonial.name} className="testimonial-avatar" />
                <div className="testimonial-info">
                    <h4>{testimonial.name}</h4>
                    <p className="testimonial-location">{testimonial.location}</p>
                </div>
            </div>

            <div className="testimonial-rating">
                {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        size={16}
                        fill={i < testimonial.rating ? '#d4af37' : 'none'}
                        color={i < testimonial.rating ? '#d4af37' : '#ccc'}
                    />
                ))}
            </div>

            <p className="testimonial-text">"{testimonial.text}"</p>
        </div>
    );
};

export default TestimonialCard;
