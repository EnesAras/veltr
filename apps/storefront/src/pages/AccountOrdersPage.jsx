import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import EmptyState from "../components/EmptyState";
import InlineError from "../components/InlineError";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5001";

export default function AccountOrdersPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadOrders = useCallback(async () => {
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
      setOrders(payload.orders ?? []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    loadOrders();
  }, [token, loadOrders]);

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
        {loading && (
          <div className="order-records__skeletons">
            {Array.from({ length: 3 }).map((_, index) => (
              <article key={`skeleton-${index}`} className="order-record order-record--skeleton">
                <div className="order-record__header">
                  <div className="skeleton-line skeleton-line--title" />
                  <div className="skeleton-line skeleton-line--small" />
                </div>
                <div className="skeleton-line" />
                <div className="skeleton-line skeleton-line--button" />
              </article>
            ))}
          </div>
        )}
        {error && !loading && <InlineError title="Unable to load orders" body={error} onRetry={loadOrders} />}
        {!loading && !error && !formattedOrders.length && (
        <EmptyState
          title="No orders yet"
          body="When you place an order, it will appear here instantly."
          actionLabel="Start shopping"
          onAction={() => navigate("/")}
        />
        )}
        {!loading &&
          !error &&
          formattedOrders.map((order) => (
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
