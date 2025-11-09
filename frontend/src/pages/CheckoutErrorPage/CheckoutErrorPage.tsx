import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { PublicPaths } from '@/lib/routes';
import { vippsCheckoutService } from '../../services/vippsCheckoutService';

const CheckoutErrorPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get('reference');
  const [errorDetails, setErrorDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (reference) {
      // Try to fetch session status to get error details
      vippsCheckoutService
        .getSessionStatus(reference)
        .then((status) => {
          setErrorDetails(status);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching session details:', error);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [reference]);

  return (
    <div className="checkout-empty">
      <div className="checkout-empty-content">
        <svg 
          className="checkout-empty-icon" 
          style={{ color: '#DC2626', width: '64px', height: '64px' }} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
          />
        </svg>
        <h2>Betalingen kunne ikke fullføres</h2>
        
        {loading ? (
          <p>Henter detaljer...</p>
        ) : (
          <>
            <p style={{ marginTop: '16px', color: '#666' }}>
              Det oppstod en feil under betalingsprosessen. Din betaling ble ikke gjennomført.
            </p>

            {reference && (
              <p style={{ fontSize: '14px', color: '#999', marginTop: '12px' }}>
                Referanse: <strong>{reference}</strong>
              </p>
            )}

            {errorDetails?.sessionState && (
              <div style={{
                marginTop: '24px',
                padding: '16px',
                backgroundColor: '#FEF2F2',
                borderRadius: '8px',
                border: '1px solid #FECACA'
              }}>
                <p style={{ fontSize: '14px', color: '#991B1B' }}>
                  <strong>Status:</strong> {errorDetails.sessionState}
                </p>
              </div>
            )}

            <div style={{ marginTop: '32px' }}>
              <p style={{ marginBottom: '16px', fontSize: '14px', color: '#666' }}>
                Du kan prøve igjen eller kontakte oss hvis problemet vedvarer.
              </p>
              
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link 
                  to={PublicPaths.checkout} 
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
                  Prøv igjen
                </Link>
                <Link 
                  to={PublicPaths.merch} 
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
                  Tilbake til butikken
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CheckoutErrorPage;

