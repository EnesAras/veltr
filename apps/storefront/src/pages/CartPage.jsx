import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import EmptyState from "../components/EmptyState";
import InlineError from "../components/InlineError";

export default function CartPage() {
  const navigate = useNavigate();
  const { items, subtotal, setQty, removeItem, totalItems, loading, error, retryCart } = useCart();

  return (
    <main className="storefront-shell">
      <section className="v-section">
        <div className="v-container">
          <header className="hero">
            <p className="eyebrow">VELTR</p>
            <h1>Your Cart</h1>
            <p className="lede">Review items and update quantities before checkout.</p>
          </header>

          {error && !loading && (
            <InlineError title="Cart sync failed" body={error} onRetry={retryCart} />
          )}

          {loading ? (
            <div className="cart-layout cart-layout--skeleton">
              <section className="cart-items">
                {Array.from({ length: 3 }).map((_, index) => (
                  <article key={`skeleton-${index}`} className="cart-item cart-item--skeleton">
                    <div className="cart-skeleton-thumb" />
                    <div className="cart-skeleton-body">
                      <div className="skeleton-line skeleton-line--title" />
                      <div className="skeleton-line" />
                    </div>
                  </article>
                ))}
              </section>
              <aside className="summary-card summary-card--skeleton">
                <div className="skeleton-line skeleton-line--title" />
                <div className="skeleton-line" />
                <div className="skeleton-line skeleton-line--small" />
                <div className="skeleton-line skeleton-line--button" />
              </aside>
            </div>
          ) : !items.length ? (
            <EmptyState
              title="Your cart is empty"
              body="Add something you love and come back to checkout."
              actionLabel="Continue shopping"
              onAction={() => navigate("/")}
              secondaryLabel="Browse headphones"
              secondaryOnClick={() => navigate("/")}
            />
          ) : (
            <div className="cart-layout">
              <section className="cart-items">
                {items.map((item) => (
                  <article key={item.id} className="cart-item">
                    <div className="cart-thumb">
                      <img src={item.image} alt={item.name} loading="lazy" />
                    </div>
                    <div className="cart-content">
                      <Link to={`/product/${item.productId}`} className="cart-product-name">
                        {item.name}
                      </Link>
                      {item.variantLabel && (
                        <span className="cart-product-variant">Finish: {item.variantLabel}</span>
                      )}
                      <p className="cart-product-price">${item.price.toLocaleString()}</p>
                      <div className="qty-controls">
                        <button
                          type="button"
                          onClick={() => setQty(item.id, Math.max(1, item.qty - 1))}
                          aria-label={`Decrease quantity for ${item.name}`}
                        >
                          –
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={item.qty}
                          onChange={(event) => setQty(item.id, Number(event.target.value))}
                        />
                        <button
                          type="button"
                          onClick={() => setQty(item.id, item.qty + 1)}
                          aria-label={`Increase quantity for ${item.name}`}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="cart-actions">
                      <button
                        type="button"
                        className="v-btn v-btn--ghost cart-remove"
                        onClick={() => removeItem(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </article>
                ))}
              </section>

              <aside className="summary-card">
                <p className="eyebrow">Summary</p>
                <p>Total items: {totalItems}</p>
                <p className="detail-price">Subtotal: ${subtotal.toLocaleString()}</p>
                <Link to="/checkout" className="v-btn v-btn--primary cta">
                  Proceed to Checkout
                </Link>
              </aside>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
