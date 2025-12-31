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
  const { addItem } = useCart();

  async function handleAddToCart() {
    if (!product) {
      return;
    }

    addItem(product, 1);
  }

  useEffect(() => {
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

        if (!productResponse.ok) {
          throw new Error(productPayload?.error ?? "Product not found");
        }

        setProduct(productPayload.product);
        setCategories(categoriesPayload.categories ?? []);
      } catch (err) {
        setError(err.message);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [id]);

  const productCategory = categories.find((cat) => cat.slug === product?.category);

  return (
    <main className="storefront-shell detail-shell">
      <Link to="/" className="back-link">
        ← Back to all products
      </Link>

      {loading && <p className="status">Loading product details…</p>}
      {error && !loading && <p className="status status-error">{error}</p>}

      {!loading && product && (
        <article className="detail-card">
          <div className="detail-image">
            <img src={product.image} alt={product.name} loading="lazy" />
          </div>
          <div className="detail-content">
            <p className="eyebrow">{productCategory?.name ?? "Product"}</p>
            <h1>{product.name}</h1>
            <p className="detail-price">${product.price.toLocaleString()}</p>
            <p className="detail-description">{product.description}</p>
            <button type="button" className="cta" onClick={handleAddToCart}>
              Add to Cart
            </button>
          </div>
        </article>
      )}
    </main>
  );
}
