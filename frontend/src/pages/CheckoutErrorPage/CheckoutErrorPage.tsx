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
          className="checkout-empty-icon w-16 h-16 text-red-600" 
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
            <p className="mt-4 text-gray-600">
              Det oppstod en feil under betalingsprosessen. Din betaling ble ikke gjennomført.
            </p>

            {reference && (
              <p className="text-sm text-gray-400 mt-3">
                Referanse: <strong>{reference}</strong>
              </p>
            )}

            {errorDetails?.sessionState && (
              <div className="mt-6 px-4 py-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-800">
                  <strong>Status:</strong> {errorDetails.sessionState}
                </p>
              </div>
            )}

            <div className="mt-8">
              <p className="mb-4 text-sm text-gray-600">
                Du kan prøve igjen eller kontakte oss hvis problemet vedvarer.
              </p>
              
              <div className="flex gap-3 justify-center flex-wrap">
                <Link 
                  to={PublicPaths.checkout} 
                  className="checkout-empty-btn bg-blue-500 text-white px-4 py-3 rounded-md no-underline inline-block hover:bg-blue-600 transition-colors"
                >
                  Prøv igjen
                </Link>
                <Link 
                  to={PublicPaths.merch} 
                  className="checkout-empty-btn border-2 border-blue-500 text-blue-500 bg-transparent px-4 py-3 rounded-md no-underline inline-block hover:bg-blue-50 transition-colors"
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

