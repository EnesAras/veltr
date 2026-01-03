import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5001";

export default function AccountOrdersPage() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    let active = true;
    const loadOrders = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(`${API_BASE}/api/orders`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const payload = await response.json();
        if (!response.ok) {
          throw new Error(payload?.error ?? "Unable to load orders");
        }
        if (active) {
          setOrders(payload.orders ?? []);
        }
      } catch (err) {
        if (active) {
          setError(err.message);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };
    loadOrders();
    return () => {
      active = false;
    };
  }, [token]);

  const formattedOrders = useMemo(
    () =>
      [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [orders]
  );

  const formatDate = (value) => {
    try {
      return new Date(value).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short"
      });
    } catch {
      return value;
    }
  };

  return (
    <main className="account-page">
      <section className="account-card">
        <p className="eyebrow">Orders</p>
        <h1>Order activity</h1>
        <p className="lede">
          Every Veltr purchase lives here. We keep receipts, shipping, and order details in one place.
        </p>
        {loading && <p className="status">Loading your orders…</p>}
        {error && <p className="status status-error">{error}</p>}
        {!loading && !formattedOrders.length && !error && (
          <p className="status">No orders yet. Place your first order and it will show up here instantly.</p>
        )}
        {formattedOrders.map((order) => (
          <article key={order.id} className="order-record">
            <header>
              <div>
                <p className="eyebrow">Order #{order.id.slice(-6).toUpperCase()}</p>
                <p className="detail">{formatDate(order.createdAt)}</p>
              </div>
              <p className="order-status">Status: {order.status}</p>
            </header>
            <ul className="order-items">
              {order.items.map((item) => (
                <li key={`${order.id}-${item.productId}`} className="order-item">
                  <span>{item.name}</span>
                  <span>
                    {item.qty} × ${item.price.toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
            <div className="order-total detail-price">Total: ${order.total.toLocaleString()}</div>
          </article>
        ))}
        <Link to="/checkout" className="primary">
          Start a new order
        </Link>
      </section>
    </main>
  );
}
