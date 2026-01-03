import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useCart } from "../contexts/CartContext";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5001";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  const productCategory = categories.find((cat) => cat.slug === product?.category);

  useEffect(() => {
    let isActive = true;

    async function loadProduct() {
      setLoading(true);
      setError(null);

      try {
        const [productResponse, categoriesResponse] = await Promise.all([
          fetch(`${API_BASE}/api/products/${id}`),
          fetch(`${API_BASE}/api/categories`)
        ]);

        const [productPayload, categoriesPayload] = await Promise.all([
          productResponse.json(),
          categoriesResponse.json()
        ]);

        if (!isActive) {
          return;
        }

        if (!productResponse.ok) {
          throw new Error(productPayload?.error ?? "Product not found");
        }

        setProduct(productPayload.product);
        setCategories(categoriesPayload.categories ?? []);
      } catch (err) {
        if (isActive) {
          setError(err.message);
          setProduct(null);
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    loadProduct();

    return () => {
      isActive = false;
    };
  }, [id]);

  useEffect(() => {
    setQuantity(1);
  }, [product]);

  function handleAddToCart() {
    if (!product) {
      return;
    }

    addItem(product, quantity);
  }

  return (
    <main className="storefront-shell detail-shell">
      <section className="v-section detail-section">
        <div className="v-container">
          <Link to="/" className="back-link">
            ← Back to all products
          </Link>

          {loading && <p className="status">Loading product details…</p>}
          {error && !loading && <p className="status status-error">{error}</p>}

          {!loading && product && (
            <>
              <article className="detail-card">
                <div className="detail-image">
                  <img src={product.image} alt={product.name} loading="lazy" />
                </div>
                <div className="detail-content">
                  <p className="eyebrow">{productCategory?.name ?? "Product"}</p>
                  <h1 className="v-h1">{product.name}</h1>
                  <p className="detail-price">${product.price.toLocaleString()}</p>
                  <p className="detail-description">{product.description}</p>
                  <div className="detail-actions">
                    <div className="detail-qty">
                      <button
                        type="button"
                        className="v-btn v-btn--ghost detail-qty__control"
                        onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                        aria-label={`Decrease quantity for ${product.name}`}
                      >
                        –
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(event) => setQuantity(Math.max(1, Number(event.target.value) || 1))}
                      />
                      <button
                        type="button"
                        className="v-btn v-btn--ghost detail-qty__control"
                        onClick={() => setQuantity((value) => value + 1)}
                        aria-label={`Increase quantity for ${product.name}`}
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      className="v-btn v-btn--primary detail-cta"
                      onClick={handleAddToCart}
                    >
                      Add to cart
                    </button>
                    <button type="button" className="v-btn v-btn--outline detail-secondary" disabled>
                      Buy now
                    </button>
                  </div>
                </div>
              </article>

              <section className="detail-tabs">
                <details open>
                  <summary>Overview</summary>
                  <p>{product.description}</p>
                </details>
                <details>
                  <summary>Tech specs</summary>
                  <ul>
                    <li>Driver: {product.specs?.driver ?? "N/A"}</li>
                    <li>Connectivity: {product.specs?.connectivity ?? "Wireless"}</li>
                    <li>Battery: {product.specs?.battery ?? "Up to 24h"}</li>
                  </ul>
                </details>
                <details>
                  <summary>Delivery & returns</summary>
                  <p>Orders ship within 24 hours. Returns accepted within 30 days of delivery.</p>
                </details>
              </section>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
