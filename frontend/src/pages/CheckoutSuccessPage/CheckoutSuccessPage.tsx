import React, { useEffect, useState } from 'react';
import { useSearchParams } from "react-router-dom";
import { PublicPaths } from "@/lib/routes";
import {
  vippsCheckoutService,
  type SessionStatusResponse,
} from "../../services/vippsCheckoutService";
import { useCart } from '../../contexts/CartContext';

const CheckoutSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get("reference");
  const [orderDetails, setOrderDetails] =
    useState<SessionStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const { clearCart } = useCart();

  useEffect(() => {
    // Clear cart when arriving at success page (backup in case it wasn't cleared earlier)
    // Only clear once when component mounts
    clearCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - only run once on mount

  useEffect(() => {
    if (reference) {
      // Fetch order details if reference is provided
      // Poll a few times in case callback hasn't finished updating the order yet
      let attempts = 0;
      const maxAttempts = 5;
      const pollInterval = 1000; // 1 second

      const fetchOrderDetails = () => {
        vippsCheckoutService
          .getSessionStatus(reference)
          .then((status) => {
            // If shippingPrice is undefined and we haven't reached max attempts, poll again
            // This handles the case where callback hasn't finished updating the order yet
            // Only poll if payment was successful (callback should have run)
            const isPaymentSuccessful =
              status.sessionState === "PaymentSuccessful" ||
              status.paymentDetails?.state === "AUTHORIZED" ||
              status.paymentDetails?.state === "CAPTURED" ||
              status.paymentDetails?.state === "RESERVED";

            if (
              status.shippingPrice === undefined &&
              isPaymentSuccessful &&
              attempts < maxAttempts - 1
            ) {
              attempts++;
              setTimeout(fetchOrderDetails, pollInterval);
              return;
            }

            setOrderDetails(status);
            setLoading(false);
          })
          .catch((error) => {
            console.error("Error fetching order details:", error);
            setLoading(false);
          });
      };

      fetchOrderDetails();
    } else {
      setLoading(false);
    }
  }, [reference]);

  // Determine if payment was successful - only after we have data from Vipps
  // Payment is successful if:
  // 1. sessionState is "PaymentSuccessful", OR
  // 2. paymentDetails.state is a successful state (AUTHORIZED, CAPTURED, RESERVED)
  const paymentState =
    orderDetails?.paymentDetails?.state || orderDetails?.sessionState;
  const isPaymentSuccessful =
    !loading &&
    orderDetails !== null &&
    (orderDetails.sessionState === "PaymentSuccessful" ||
      paymentState === "AUTHORIZED" ||
      paymentState === "CAPTURED" ||
      paymentState === "RESERVED");
  const isPaymentTerminated =
    !loading &&
    orderDetails !== null &&
    (orderDetails.sessionState === "PaymentTerminated" ||
      orderDetails.sessionState === "PaymentInitiationFailed" ||
      orderDetails.sessionState === "SessionExpired" ||
      paymentState === "CANCELLED" ||
      paymentState === "REFUNDED");

  return (
    <div className="checkout-success">
      <div className="checkout-success-content">
        {loading ? (
          <>
            {/* Loader while fetching payment status from Vipps */}
            <div
              style={{
                width: "80px",
                height: "80px",
                margin: "0 auto 24px",
                border: "4px solid #E5E7EB",
                borderTop: "4px solid #3B82F6",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
              }}
            />
            <h2 style={{ textAlign: "center", marginBottom: "16px" }}>
              Henter betalingsstatus...
            </h2>
            <p style={{ textAlign: "center", color: "#666" }}>
              Vennligst vent mens vi henter informasjon fra Vipps
            </p>
          </>
        ) : orderDetails === null ? (
          <>
            {/* Error state if we couldn't fetch order details */}
            <div className="success-checkmark error-state">✗</div>
            <h2 style={{ color: "#DC2626" }}>
              Kunne ikke hente bestillingsdetaljer
            </h2>
            <p style={{ marginTop: "24px", color: "#DC2626" }}>
              Vi kunne ikke hente informasjon om bestillingen din.
            </p>
            <p style={{ marginTop: "12px", fontSize: "14px", color: "#666" }}>
              Hvis du mener dette er en feil, vennligst kontakt oss på{" "}
              <a
                href="mailto:order@mollerfan.club"
                style={{ color: "#3B82F6" }}
              >
                order@mollerfan.club
              </a>
              .
            </p>
          </>
        ) : isPaymentSuccessful ? (
          <>
            <div className="success-checkmark">✓</div>
            <h2>Takk for din bestilling!</h2>
          </>
        ) : (
          <>
            <div className="success-checkmark error-state">✗</div>
            <h2 style={{ color: "#DC2626" }}>Betaling ikke gjennomført</h2>
          </>
        )}

        {!loading && orderDetails !== null && (
          <>
            {reference && (
              <p style={{ fontSize: "14px", color: "#666", marginTop: "8px" }}>
                Bestillingsreferanse: <strong>{reference}</strong>
              </p>
            )}

            {isPaymentSuccessful ? (
              <>
                <p style={{ marginTop: "24px" }}>
                  Din betaling er mottatt og bestillingen er bekreftet.
                </p>
                <p style={{ marginTop: "16px", fontSize: "14px", color: "#666" }}>
                  Vennligst sjekk e-posten din {orderDetails.billingDetails?.email && (
                    <>(<strong>{orderDetails.billingDetails.email}</strong>)</>
                  )}
                </p>
                <p style={{ marginTop: "12px", fontSize: "14px", color: "#666", textDecoration: "underline" }}>
                  Husk å sjekke <strong>søppelpost/spam-mappen</strong> din.
                </p>
              </>
            ) : (
              <>
                <p style={{ marginTop: "24px", color: "#DC2626" }}>
                  Din betaling ble ikke gjennomført. Bestillingen er ikke
                  bekreftet.
                </p>

                <p
                  style={{ marginTop: "12px", fontSize: "14px", color: "#666" }}
                >
                  Hvis du mener dette er en feil, vennligst kontakt oss på{" "}
                  <a
                    href="mailto:order@mollerfan.club"
                    style={{ color: "#3B82F6" }}
                  >
                    order@mollerfan.club
                  </a>
                  .
                </p>
              </>
            )}

            <div
              style={{
                marginTop: "32px",
                display: "flex",
                gap: "12px",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              {isPaymentTerminated && (
                <button
                  onClick={() => {
                    window.location.href = PublicPaths.checkout;
                  }}
                  className="checkout-empty-btn"
                  style={{
                    backgroundColor: "#DC2626",
                    color: "white",
                    padding: "12px 24px",
                    borderRadius: "8px",
                    textDecoration: "none",
                    display: "inline-block",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "16px",
                    fontWeight: "500",
                  }}
                >
                  Prøv igjen
                </button>
              )}
              <button
                onClick={() => {
                  window.location.href = PublicPaths.merch;
                }}
                className="checkout-empty-btn"
                style={{
                  backgroundColor: isPaymentSuccessful ? "#3B82F6" : "#6B7280",
                  color: "white",
                  padding: "12px 24px",
                  borderRadius: "8px",
                  textDecoration: "none",
                  display: "inline-block",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "16px",
                  fontWeight: "500",
                }}
              >
                {isPaymentSuccessful
                  ? "Fortsett shopping"
                  : "Tilbake til butikken"}
              </button>
              <button
                onClick={() => {
                  window.location.href = PublicPaths.base;
                }}
                className="checkout-empty-btn"
                style={{
                  backgroundColor: isPaymentSuccessful ? "#3B82F6" : "#6B7280",
                  color: "white",
                  border: `2px solid ${
                    isPaymentSuccessful ? "#3B82F6" : "#9CA3AF"
                  }`,
                  padding: "12px 24px",
                  borderRadius: "8px",
                  textDecoration: "none",
                  display: "inline-block",
                  cursor: "pointer",
                  fontSize: "16px",
                  fontWeight: "600",
                }}
              >
                Til forsiden
              </button>
            </div>
          </>
        )}
      </div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default CheckoutSuccessPage;

