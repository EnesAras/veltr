import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5001";

export default function CheckoutPage() {
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
      <header className="hero">
        <p className="eyebrow">VELTR</p>
        <h1>Checkout</h1>
        <p className="lede">Fill out your details and confirm the order.</p>
      </header>

      <section className="checkout-layout">
        <div className="checkout-form">
          <h2>Contact information</h2>
          <form>
            <label>
              Name
              <input type="text" placeholder="Jane Doe" required />
            </label>
            <label>
              Email
              <input type="email" placeholder="jane@veltr.com" required />
            </label>
            <label>
              Address
              <input type="text" placeholder="123 Main St, City, Country" required />
            </label>
          </form>
          <h3>Shipping options</h3>
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
                  <span>
                    {rate.label} — ${rate.price.toFixed(2)}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        <aside className="summary-card checkout-summary">
          <p className="eyebrow">Order summary</p>
          <ul>
            {items.map((item) => (
              <li key={item.id}>
                <span>{item.name}</span>
                <span>
                  {item.qty} × ${item.price.toLocaleString()}
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
          {payError && <p className="status status-error">{payError}</p>}
          <button
            type="button"
            className="cta checkout-cta"
            disabled={payLoading || items.length === 0}
            onClick={handlePay}
          >
            {payLoading ? "Preparing checkout…" : "Pay with Stripe"}
          </button>
          <Link to="/cart" className="nav-link">
            Back to Cart ({items.length} items)
          </Link>
        </aside>
      </section>
    </main>
  );
}
