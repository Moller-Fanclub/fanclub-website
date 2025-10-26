import React from 'react';
import { useCart } from '../contexts/CartContext';
import './Cart.css';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

const Cart: React.FC<CartProps> = ({ isOpen, onClose }) => {
  const { items, removeItem, updateQuantity, totalPrice, clearCart, totalItems } = useCart();

  const getItemKey = (item: { id: string; size?: string }) => {
    return `${item.id}-${item.size || 'default'}`;
  };

  // Only show checkout button when on merch pages

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="cart-backdrop" onClick={onClose} />
      
      {/* Cart Sidebar */}
      <div className="cart-sidebar">
        {/* Header */}
        <div className="cart-header">
          <div className="cart-header-content">
            <svg className="cart-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h2>Handlekurv</h2>
            {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
          </div>
          <button onClick={onClose} className="cart-close-btn" aria-label="Lukk handlekurv">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Cart Items */}
        <div className="cart-items">
          {items.length === 0 ? (
            <div className="cart-empty">
              <svg className="cart-empty-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p>Handlekurven er tom</p>
              <p className="cart-empty-subtitle">Legg til produkter for å komme i gang</p>
            </div>
          ) : (
            items.map(item => {
              const itemKey = getItemKey(item);
              return (
                <div key={itemKey} className="cart-item">
                  <img src={item.image} alt={item.name} className="cart-item-image" />
                  
                  <div className="cart-item-details">
                    <h3>{item.name}</h3>
                    {item.size && <p className="cart-item-variant">Størrelse: {item.size}</p>}
                    
                    <div className="cart-item-footer">
                      <div className="cart-item-quantity">
                        <button 
                          onClick={() => updateQuantity(itemKey, item.quantity - 1)}
                          className="quantity-btn"
                          aria-label="Reduser antall"
                        >
                          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                        </button>
                        <span>{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(itemKey, item.quantity + 1)}
                          className="quantity-btn"
                          aria-label="Øk antall"
                        >
                          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                      </div>
                      
                      <p className="cart-item-price">{(item.price * item.quantity).toFixed(2)} kr</p>
                    </div>
                  </div>

                  <button 
                    onClick={() => removeItem(itemKey)}
                    className="cart-item-remove"
                    aria-label="Fjern fra handlekurv"
                  >
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <span>Totalt:</span>
              <span className="cart-total-price">{totalPrice.toFixed(2)} kr</span>
            </div>

            {items.length > 0 && (
              <a href="/checkout" className="cart-checkout-btn">
                Gå til kassen
              </a>
            )}
            
            <button onClick={clearCart} className="cart-clear-btn">
              Tøm handlekurv
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;
