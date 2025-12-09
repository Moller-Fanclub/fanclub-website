import React, { useEffect, useState } from 'react';
import { useCart } from '../contexts/CartContext';
import './FloatingCartButton.css';

interface FloatingCartButtonProps {
    onClick: () => void;
    currentPath?: string;
}

const FloatingCartButton: React.FC<FloatingCartButtonProps> = ({ onClick, currentPath }) => {
    const { totalItems } = useCart();
    const [animate, setAnimate] = useState(false);

    // Trigger bounce animation when items increase
    useEffect(() => {
        if (totalItems > 0) {
            setAnimate(true);
            const timer = setTimeout(() => setAnimate(false), 300);
            return () => clearTimeout(timer);
        }
    }, [totalItems]);

    if (totalItems === 0) return null;
    if (currentPath && !currentPath.startsWith('/merch')) return null;

    return (
        <button
            onClick={onClick}
            className={`floating-cart-button ${animate ? "cart-bounce" : ""}`}
            aria-label="Åpne handlekurv"
        >
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="floating-cart-badge">{totalItems}</span>
        </button>
    );
};

export default FloatingCartButton;
