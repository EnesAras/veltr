import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5001";

export default function CheckoutSuccessPage() {
  const { search } = useLocation();
  const sessionId = useMemo(() => new URLSearchParams(search).get("session_id"), [search]);
  const { token } = useAuth();
  const { clear } = useCart();
  const clearRef = useRef(clear);

  useEffect(() => {
    clearRef.current = clear;
  }, [clear]);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(Boolean(sessionId));
  const [error, setError] = useState("");

  useEffect(() => {
    if (!sessionId) {
      setError("Missing checkout session identifier.");
      setLoading(false);
      return;
    }
    if (!token) {
      setError("Sign in to finalize your order.");
      setLoading(false);
      return;
    }
    let active = true;
    setLoading(true);
    setError("");
    fetch(`${API_BASE}/api/checkout/confirm?session_id=${encodeURIComponent(sessionId)}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok) {
          throw new Error(payload?.error ?? "Unable to confirm checkout");
        }
        if (!active) {
          return null;
        }
        clearRef.current?.();
        setOrder(payload.order ?? null);
        return payload;
      })
      .catch((err) => {
        if (active) {
          setError(err.message);
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, [sessionId, token]);

  const orderTotal = order?.total ?? 0;

  return (
    <main className="storefront-shell checkout-result checkout-success">
      <section className="checkout-result__panel">
        <p className="eyebrow">Order confirmed</p>
        <h1>Payment confirmed.</h1>
        <p className="lede">
          Your Veltr audio ritual is confirmed. We are preparing your order for delivery and will notify you with tracking shortly.
        </p>
        {loading && <p className="status">Finalizing your checkout…</p>}
        {error && <p className="status status-error">{error}</p>}
        {!loading && !error && !order && (
          <p className="status">We could not locate that session. Check the link or try again.</p>
        )}
        {order && (
          <div className="checkout-result__order">
            <header>
              <p className="detail">Order #{order.id.slice(-6).toUpperCase()}</p>
              <p className="detail-price total">Total: ${orderTotal.toLocaleString()}</p>
            </header>
            <ul className="checkout-result__items">
              {order.items.map((item) => (
                <li key={`${order.id}-${item.productId}`} className="checkout-result__item">
                  <span>{item.name}</span>
                  <span>
                    {item.qty} × ${item.price.toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="checkout-result__actions">
          <Link to="/account/orders" className="cta">
            View orders
          </Link>
          <Link to="/" className="nav-link">
            Continue shopping
          </Link>
        </div>
      </section>
    </main>
  );
}
