import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";
import { useShopConfig } from "../../hooks/useShopConfig";
import { vippsCheckoutService } from "../../services/vippsCheckoutService";
import type { VippsCheckoutInstance } from "../../services/vippsCheckoutService";
import "./CheckoutPage.css";
import { PublicPaths } from "@/lib/routes";

const CheckoutPage: React.FC = () => {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const { config, isOpen: shopIsOpen } = useShopConfig();
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const checkoutContainerRef = useRef<HTMLDivElement>(null);
  const checkoutInstanceRef = useRef<VippsCheckoutInstance | null>(null);

  // Compute opening date from config
  const openingDate = config ? new Date(config.openingDate) : null;

  // Initialize Vipps Checkout when component mounts or items change
  useEffect(() => {
    // Only initialize if we have items and shop is open
    if (items.length === 0 || !shopIsOpen) {
      return;
    }

    // Cleanup function to expire session if component unmounts
    return () => {
      // Note: We don't have the reference here, so we can't expire
      // The session will expire automatically after 1 hour
    };
  }, [items, shopIsOpen]);

  const initializeVippsCheckout = async () => {
    if (items.length === 0) {
      setError("Handlekurven er tom");
      return;
    }

    if (!shopIsOpen) {
      setError("Butikken er stengt");
      return;
    }

    setIsInitializing(true);
    setError(null);

    try {
      // Create checkout session
      const session = await vippsCheckoutService.createSession({
        items: items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          size: item.size,
        })),
      });

      // Validate session response
      if (!session.checkoutFrontendUrl || !session.token) {
        console.error("❌ Invalid session response:", session);
        throw new Error("Manglende data fra Vipps. Vennligst prøv igjen.");
      }

      // Check if SDK is loaded
      if (!window.VippsCheckout) {
        throw new Error(
          "Vipps Checkout SDK ikke lastet. Vennligst oppdater siden."
        );
      }

      // Initialize Vipps Checkout
      const checkoutInstance = vippsCheckoutService.initializeCheckout({
        checkoutFrontendUrl: session.checkoutFrontendUrl,
        iFrameContainerId: "vipps-checkout-container",
        language: "nb",
        token: session.token,
        on: (event) => {
          console.log("Vipps Checkout event:", event);

          if (event.name === "vipps.checkout.session.completed") {
            // Payment successful
            clearCart();
            navigate(
              `${PublicPaths.checkoutSuccess}?reference=${session.reference}`
            );
          } else if (event.name === "vipps.checkout.session.failed") {
            // Payment failed
            navigate(
              `${PublicPaths.checkoutError}?reference=${session.reference}`
            );
          } else if (event.name === "vipps.checkout.session.terminated") {
            // Session terminated
            navigate(
              `${PublicPaths.checkoutError}?reference=${session.reference}`
            );
          }
        },
      });

      checkoutInstanceRef.current = checkoutInstance;
    } catch (err) {
      console.error("Error initializing Vipps Checkout:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Kunne ikke initialisere betaling. Vennligst prøv igjen."
      );
    } finally {
      setIsInitializing(false);
    }
  };

  // Auto-initialize checkout when component is ready
  useEffect(() => {
    if (
      items.length > 0 &&
      shopIsOpen &&
      checkoutContainerRef.current &&
      !checkoutInstanceRef.current
    ) {
      // Small delay to ensure container is rendered
      const timer = setTimeout(() => {
        initializeVippsCheckout();
      }, 100);

      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length, shopIsOpen]);

  if (items.length === 0) {
    return (
      <div className="checkout-empty">
        <div className="checkout-empty-content">
          <svg
            className="checkout-empty-icon"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <h2>Handlekurven er tom</h2>
          <p>Legg til produkter før du går til kassen</p>
          <Link to={PublicPaths.merch} className="checkout-empty-btn">
            Gå til butikken
          </Link>
        </div>
      </div>
    );
  }

  // Prevent checkout if shop is closed
  if (!shopIsOpen) {
    return (
      <div className="checkout-empty">
        <div className="checkout-empty-content">
          <svg
            className="checkout-empty-icon"
            style={{ color: "#DC2626" }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h2>Butikken er stengt</h2>
          <p>Forhåndsbestillingsperioden er ikke aktiv akkurat nå.</p>
          <p style={{ marginTop: "12px", fontSize: "16px" }}>
            Neste periode åpner:{" "}
            <strong>
              {openingDate?.toLocaleDateString("nb-NO", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </strong>
          </p>
          <Link
            to={PublicPaths.base}
            className="checkout-empty-btn"
            style={{ marginTop: "24px" }}
          >
            Tilbake til forsiden
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <h1 className="checkout-title">Kasse</h1>

        {/* Pre-order Information Banner */}
        <div className="bg-blue-50 border-2 border-blue-500 rounded-xl p-5 mb-6 shadow-sm">
          <div className="flex items-start gap-3">
            <svg
              className="w-6 h-6 text-blue-600 shrink-0 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <h3 className="text-lg font-semibold text-blue-800 mb-2">
                📦 Viktig informasjon om forhåndsbestilling
              </h3>
              <ul className="text-blue-900 text-sm leading-relaxed ml-5 list-disc space-y-1">
                <li>
                  Dette er en <strong>forhåndsbestilling</strong> - produktene
                  produseres etter at bestillingsperioden stenger
                </li>
                <li>
                  <strong>Estimert leveringstid:</strong> 2-4 uker etter
                  bestillingsperioden
                </li>
                <li>
                  Du vil motta e-postoppdateringer om produksjon og utsendelse
                </li>
                <li>
                  Alle bestillinger sendes ut samtidig når produktene ankommer
                  oss
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="checkout-grid">
          {/* Vipps Checkout Container */}
          <div
            className="checkout-form-section"
            style={{ gridColumn: "1 / -1" }}
          >
            <h2>Betal med Vipps eller kort</h2>

            {error && (
              <div className="bg-red-50 border-2 border-red-500 rounded-md p-4 mb-6 text-red-800">
                <p className="m-0 font-semibold">⚠️ {error}</p>
                <button
                  onClick={initializeVippsCheckout}
                  className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-md border-none cursor-pointer hover:bg-blue-600 transition-colors"
                >
                  Prøv igjen
                </button>
              </div>
            )}

            {isInitializing && (
              <div className="text-center p-10 text-gray-600">
                <div className="mb-4">
                  <svg
                    className="w-12 h-12 mx-auto text-blue-500 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </div>
                <p>Initialiserer betaling...</p>
              </div>
            )}

            {/* Vipps Checkout iframe container */}
            <div
              id="vipps-checkout-container"
              ref={checkoutContainerRef}
              style={{
                minHeight: "600px",
                width: "100%",
                marginTop: "24px",
              }}
            />
          </div>

          {/* Order Summary */}
          <div
            className="checkout-summary-section"
            style={{ marginTop: "24px" }}
          >
            <h2>Bestillingsoversikt</h2>
            <div className="order-summary">
              <div className="order-items">
                {items.map((item, index) => (
                  <div key={index} className="order-item">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="order-item-image"
                    />
                    <div className="order-item-details">
                      <h4>{item.name}</h4>
                      {item.size && (
                        <p className="order-item-size">
                          Størrelse: {item.size}
                        </p>
                      )}
                      <p className="order-item-quantity">
                        Antall: {item.quantity}
                      </p>
                    </div>
                    <p className="order-item-price">
                      {(item.price * item.quantity).toFixed(2)} kr
                    </p>
                  </div>
                ))}
              </div>

              <div className="order-total">
                <div className="total-row">
                  <span>Delsum:</span>
                  <span>{totalPrice.toFixed(2)} kr</span>
                </div>
                <div className="total-row">
                  <span>Estimert frakt:</span>
                  <span>79 kr</span>
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
