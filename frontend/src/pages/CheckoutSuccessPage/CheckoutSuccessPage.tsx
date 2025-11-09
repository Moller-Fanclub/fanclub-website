import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { PublicPaths } from '@/lib/routes';
import { vippsCheckoutService } from '../../services/vippsCheckoutService';
import { useCart } from '../../contexts/CartContext';

const CheckoutSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get('reference');
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { clearCart } = useCart();

  useEffect(() => {
    // Clear cart when arriving at success page (backup in case it wasn't cleared earlier)
    clearCart();
  }, [clearCart]);

  useEffect(() => {
    if (reference) {
      // Fetch order details if reference is provided
      vippsCheckoutService
        .getSessionStatus(reference)
        .then((status) => {
          setOrderDetails(status);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching order details:', error);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [reference]);

  return (
    <div className="checkout-success">
      <div className="checkout-success-content">
        <div className="success-checkmark">✓</div>
        <h2>Takk for din bestilling!</h2>
        
        {loading ? (
          <p>Henter bestillingsdetaljer...</p>
        ) : (
          <>
            {reference && (
              <p style={{ fontSize: '14px', color: '#666', marginTop: '8px' }}>
                Bestillingsreferanse: <strong>{reference}</strong>
              </p>
            )}
            
            <p style={{ marginTop: '24px' }}>
              Din betaling er mottatt og bestillingen er bekreftet.
            </p>
            
            <p style={{ marginTop: '12px', fontSize: '14px', color: '#666' }}>
              Du vil motta en bekreftelse på e-post med alle detaljer om bestillingen din.
            </p>

            {orderDetails?.paymentDetails && (
              <div style={{
                marginTop: '24px',
                padding: '16px',
                backgroundColor: '#F0F9FF',
                borderRadius: '8px',
                border: '1px solid #BAE6FD'
              }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>
                  Betalingsinformasjon
                </h3>
                <p style={{ fontSize: '14px', margin: '4px 0' }}>
                  <strong>Status:</strong> {orderDetails.paymentDetails.state}
                </p>
                <p style={{ fontSize: '14px', margin: '4px 0' }}>
                  <strong>Beløp:</strong> {(orderDetails.paymentDetails.amount.value / 100).toFixed(2)} {orderDetails.paymentDetails.amount.currency}
                </p>
              </div>
            )}

            <div style={{ marginTop: '32px', display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <Link 
                to={PublicPaths.merch} 
                className="checkout-empty-btn"
                style={{ 
                  backgroundColor: '#3B82F6',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  display: 'inline-block'
                }}
              >
                Fortsett shopping
              </Link>
              <Link 
                to={PublicPaths.base} 
                className="checkout-empty-btn"
                style={{ 
                  backgroundColor: 'transparent',
                  color: '#3B82F6',
                  border: '2px solid #3B82F6',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  display: 'inline-block'
                }}
              >
                Til forsiden
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CheckoutSuccessPage;

