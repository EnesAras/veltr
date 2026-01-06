import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import EmptyState from "../components/EmptyState";
import InlineError from "../components/InlineError";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5001";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, subtotal } = useCart();
  const { token } = useAuth();
  const [rates, setRates] = useState([]);
  const [selectedRate, setSelectedRate] = useState(null);
  const [loadingRates, setLoadingRates] = useState(true);
  const [ratesError, setRatesError] = useState(null);
  const [payLoading, setPayLoading] = useState(false);
  const [payError, setPayError] = useState("");

  useEffect(() => {
    async function loadRates() {
      setLoadingRates(true);
      setRatesError(null);
      try {
        const response = await fetch(`${API_BASE}/api/shipping-rates`);
        const payload = await response.json();
        if (!response.ok) {
          throw new Error(payload?.error ?? "Unable to load shipping options");
        }
        setRates(payload.rates ?? []);
        setSelectedRate(payload.rates?.[0]?.id ?? null);
      } catch (err) {
        setRatesError(err.message);
      } finally {
        setLoadingRates(false);
      }
    }

    loadRates();
  }, []);

  const shippingCost =
    rates.find((rate) => rate.id === selectedRate)?.price ?? 0;
  const grandTotal = subtotal + shippingCost;

  const handlePay = async () => {
    if (!token) {
      setPayError("You must be signed in to checkout.");
      return;
    }
    setPayError("");
    setPayLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/checkout/session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          shippingRateId: selectedRate
        })
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error ?? "Unable to create checkout session");
      }
      window.location.href = payload.url;
    } catch (error) {
      setPayError(error.message);
    } finally {
      setPayLoading(false);
    }
  };

  return (
    <main className="storefront-shell">
      <section className="v-section checkout-section">
        <div className="v-container">
          <header className="hero checkout-hero">
            <p className="eyebrow">VELTR</p>
            <h1>Checkout</h1>
            <p className="lede">Fill out your contact, shipping, and payment details to complete the order.</p>
          </header>

          {items.length === 0 ? (
            <EmptyState
              title="Your cart is empty"
              body="Add something before checking out."
              actionLabel="Continue shopping"
              onAction={() => navigate("/")}
            />
          ) : (
            <>
              {payError && (
                <InlineError title="Checkout error" body={payError} onRetry={handlePay} />
              )}

              <div className="checkout-layout">
                <section className="checkout-hoja">
                  <div className="checkout-card">
                    <h2 className="checkout-card__title">Contact information</h2>
                    <form className="checkout-form">
                      <label>
                        Name
                        <input type="text" placeholder="Jane Doe" required />
                      </label>
                      <label>
                        Email
                        <input type="email" placeholder="jane@veltr.com" required />
                      </label>
                      <label>
                        Phone
                        <input type="tel" placeholder="+1 555 123 4567" required />
                      </label>
                    </form>
                  </div>

                  <div className="checkout-card">
                    <h2 className="checkout-card__title">Shipping address</h2>
                    <form className="checkout-form">
                      <label>
                        Address
                        <input type="text" placeholder="123 Main St, City, Country" required />
                      </label>
                      <label>
                        City
                        <input type="text" placeholder="San Francisco" required />
                      </label>
                      <label>
                        Postal code
                        <input type="text" placeholder="94107" required />
                      </label>
                    </form>
                  </div>

                  <div className="checkout-card">
                    <h2 className="checkout-card__title">Shipping options</h2>
                    {loadingRates && <p className="status">Loading shipping options…</p>}
                    {ratesError && <p className="status status-error">{ratesError}</p>}
                    {!loadingRates && !ratesError && (
                      <div className="shipping-options">
                        {rates.map((rate) => (
                          <label key={rate.id}>
                            <input
                              type="radio"
                              name="shipping"
                              value={rate.id}
                              checked={selectedRate === rate.id}
                              onChange={() => setSelectedRate(rate.id)}
                            />
                            <div>
                              <strong>{rate.label}</strong>
                              <span>${rate.price.toFixed(2)}</span>
                            </div>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="checkout-card">
                    <h2 className="checkout-card__title">Payment method</h2>
                    <form className="checkout-form">
                      <label>
                        Card number
                        <input type="text" placeholder="XXXX XXXX XXXX XXXX" required />
                      </label>
                      <div className="checkout-row">
                        <label>
                          Expiry
                          <input type="text" placeholder="MM/YY" required />
                        </label>
                        <label>
                          CVC
                          <input type="text" placeholder="123" required />
                        </label>
                      </div>
                    </form>
                  </div>
                </section>

                <aside className="summary-card checkout-summary">
                  <p className="eyebrow">Order summary</p>
                  <ul className="summary-items">
                    {items.map((item) => (
                      <li key={item.id}>
                        <div className="summary-thumb" aria-hidden="true" />
                        <div className="summary-items__info">
                          <span className="summary-items__name">{item.name}</span>
                          {item.variantLabel && (
                            <span className="summary-items__variant">Finish: {item.variantLabel}</span>
                          )}
                          <small>Qty {item.qty}</small>
                        </div>
                        <span className="summary-items__price">
                          ${(item.qty * item.price).toLocaleString()}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="summary-totals">
                    <p>Subtotal</p>
                    <p>${subtotal.toLocaleString()}</p>
                  </div>
                  <div className="summary-totals">
                    <p>Shipping</p>
                    <p>${shippingCost.toFixed(2)}</p>
                  </div>
                  <div className="summary-totals total">
                    <p>Total</p>
                    <p>${grandTotal.toFixed(2)}</p>
                  </div>
                  <button
                    type="button"
                    className="v-btn v-btn--primary checkout-cta"
                    disabled={payLoading || items.length === 0}
                    onClick={handlePay}
                  >
                    {payLoading ? "Preparing checkout…" : "Pay with Stripe"}
                  </button>
                  <Link to="/cart" className="v-btn v-btn--ghost checkout-summary__back">
                    Back to Cart ({items.length} items)
                  </Link>
                </aside>
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
