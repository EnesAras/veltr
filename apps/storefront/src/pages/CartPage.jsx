import { Link } from "react-router-dom";
import { useCart } from "../contexts/CartContext";

export default function CartPage() {
  const { items, subtotal, setQty, removeItem, totalItems } = useCart();

  return (
    <main className="storefront-shell">
      <section className="v-section">
        <div className="v-container">
          <header className="hero">
            <p className="eyebrow">VELTR</p>
            <h1>Your Cart</h1>
            <p className="lede">Review items and update quantities before checkout.</p>
          </header>

          {items.length === 0 ? (
            <section className="status">
              <p>Your cart is empty.</p>
              <Link to="/" className="nav-link">
                Continue shopping
              </Link>
            </section>
          ) : (
            <div className="cart-layout">
              <section className="cart-items">
                {items.map((item) => (
                  <article key={item.id} className="cart-item">
                    <div className="cart-thumb">
                      <img src={item.image} alt={item.name} loading="lazy" />
                    </div>
                    <div className="cart-content">
                      <Link to={`/product/${item.id}`} className="cart-product-name">
                        {item.name}
                      </Link>
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
