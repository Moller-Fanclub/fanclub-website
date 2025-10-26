import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import './CheckoutPage.css';

interface FormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  notes: string;
}

const CheckoutPage: React.FC = () => {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate order submission (replace with actual API call)
    const orderData = {
      customer: formData,
      items: items,
      total: totalPrice,
      orderDate: new Date().toISOString()
    };

    try {
      // Log order data (replace with API call)
      console.log('Order submitted:', orderData);
      
      // You can send this to your backend:
      // await fetch('/api/orders', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(orderData)
      // });

      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      setSubmitSuccess(true);
      clearCart();

      // Redirect after success
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (error) {
      console.error('Order submission failed:', error);
      alert('Noe gikk galt. Vennligst prøv igjen.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0 && !submitSuccess) {
    return (
      <div className="checkout-empty">
        <div className="checkout-empty-content">
          <svg className="checkout-empty-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h2>Handlekurven er tom</h2>
          <p>Legg til produkter før du går til kassen</p>
          <a href="/merch" className="checkout-empty-btn">Gå til butikken</a>
        </div>
      </div>
    );
  }

  if (submitSuccess) {
    return (
      <div className="checkout-success">
        <div className="checkout-success-content">
          <div className="success-checkmark">✓</div>
          <h2>Takk for din bestilling!</h2>
          <p>Vi har mottatt din bestilling og vil sende deg en bekreftelse på e-post snart.</p>
          <p className="success-redirect">Sender deg tilbake...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <h1 className="checkout-title">Kasse</h1>

        <div className="checkout-grid">
          {/* Order Form */}
          <div className="checkout-form-section">
            <h2>Leveringsinformasjon</h2>
            <form onSubmit={handleSubmit} className="checkout-form">
              <div className="form-group">
                <label htmlFor="name">Fullt navn *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">E-post *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Telefon *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="address">Adresse *</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="postalCode">Postnummer *</label>
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="city">Poststed *</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="notes">Merknader (valgfritt)</label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={4}
                  className="form-input"
                  placeholder="Spesielle ønsker eller informasjon"
                />
              </div>

              <button 
                type="submit" 
                className="submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sender bestilling...' : 'Fullfør bestilling'}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="checkout-summary-section">
            <h2>Bestillingsoversikt</h2>
            <div className="order-summary">
              <div className="order-items">
                {items.map((item, index) => (
                  <div key={index} className="order-item">
                    <img src={item.image} alt={item.name} className="order-item-image" />
                    <div className="order-item-details">
                      <h4>{item.name}</h4>
                      {item.size && <p className="order-item-size">Størrelse: {item.size}</p>}
                      <p className="order-item-quantity">Antall: {item.quantity}</p>
                    </div>
                    <p className="order-item-price">{(item.price * item.quantity).toFixed(2)} kr</p>
                  </div>
                ))}
              </div>

              <div className="order-total">
                <div className="total-row">
                  <span>Delsum:</span>
                  <span>{totalPrice.toFixed(2)} kr</span>
                </div>
                <div className="total-row">
                  <span>Frakt:</span>
                  <span>Gratis</span>
                </div>
                <div className="total-row total-final">
                  <span>Totalt:</span>
                  <span>{totalPrice.toFixed(2)} kr</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
