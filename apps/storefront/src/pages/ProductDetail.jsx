import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import EmptyState from "../components/EmptyState";
import InlineError from "../components/InlineError";
import ProductDetailSkeleton from "../components/ProductDetailSkeleton";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5001";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariantId, setSelectedVariantId] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const { addItem } = useCart();
  const navigate = useNavigate();

  const productCategory = categories.find((cat) => cat.slug === product?.category);
  const availabilityText = (stock) => {
    if (stock <= 0) {
      return { label: "Out of stock", variant: "out" };
    }
    if (stock <= 5) {
      return { label: `Only ${stock} left`, variant: "low" };
    }
    return { label: "In stock", variant: "in" };
  };
  const variants = product?.variants ?? [];
  const selectedVariant = useMemo(() => {
    if (!variants.length) {
      return null;
    }
    if (selectedVariantId) {
      const found = variants.find((item) => item.id === selectedVariantId);
      if (found) {
        return found;
      }
    }
    return variants[0];
  }, [variants, selectedVariantId]);
  const galleryImages = useMemo(() => {
    if (!product) {
      return [];
    }
    const images = product.images?.length ? product.images : [product.image];
    return Array.from(new Set(images.filter(Boolean)));
  }, [product]);

  const formatReviewDate = (value) => {
    if (!value) {
      return "";
    }
    try {
      return new Date(value).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric"
      });
    } catch {
      return value;
    }
  };
  const displayPrice = useMemo(() => {
    if (!product) {
      return 0;
    }
    const delta = selectedVariant?.priceDelta ?? 0;
    return (product.price ?? 0) + delta;
  }, [product, selectedVariant]);

  const loadProduct = useCallback(async () => {
    setLoading(true);
    setError("");
    setNotFound(false);

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
        if (productResponse.status === 404) {
          setNotFound(true);
          setProduct(null);
        } else {
          throw new Error(productPayload?.error ?? "Product not found");
        }
      } else if (productPayload?.product) {
        setProduct(productPayload.product);
        setCategories(categoriesPayload.categories ?? []);
      }
    } catch (err) {
      setError(err.message);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadProduct();
  }, [loadProduct]);

  useEffect(() => {
    if (!product) {
      setSelectedVariantId(null);
      setSelectedImage("");
      return;
    }
    const defaultVariant = product.variants?.[0];
    const fallbackImage = galleryImages[0] ?? product.images?.[0] ?? product.image;
    setSelectedVariantId(defaultVariant?.id ?? null);
    setSelectedImage(defaultVariant?.image ?? fallbackImage);
  }, [galleryImages, product]);

  useEffect(() => {
    setQuantity(1);
  }, [product]);

  useEffect(() => {
    if (selectedVariant?.image) {
      setSelectedImage(selectedVariant.image);
    }
  }, [selectedVariant]);

  function handleAddToCart() {
    if (!product) {
      return;
    }

    const stock = product.stock ?? 0;
    if (stock <= 0) {
      return;
    }

    addItem(product, quantity, {
      variantId: selectedVariant?.id,
      variantLabel: selectedVariant?.label,
      variantHex: selectedVariant?.hex,
      priceOverride: displayPrice
    });
  }

  const renderProduct = () => {
    if (!product) {
      return null;
    }
    const stock = product.stock ?? 0;
    const availability = availabilityText(stock);
    const isOutOfStock = stock <= 0;
    const formattedPrice = `$${displayPrice.toLocaleString()}`;
    const ratingValue = Number.isFinite(product.ratingAvg) ? product.ratingAvg : 0;
    const ratingCount = product.ratingCount ?? 0;
    const ratingStars = Math.round(ratingValue);
    const reviews = product.reviews ?? [];
    const previewReviews = reviews.slice(0, 3);

    return (
      <>
        <article className="detail-card">
          <div className="detail-gallery">
            <div className="detail-gallery__main">
              <img src={selectedImage || product.image} alt={product.name} loading="lazy" />
            </div>
            {galleryImages.length > 1 && (
              <div className="detail-gallery__thumbs">
                {galleryImages.map((image) => (
                  <button
                    key={image}
                    type="button"
                    className={`detail-gallery__thumb ${selectedImage === image ? "is-active" : ""}`}
                    onClick={() => setSelectedImage(image)}
                  >
                    <img src={image} alt={`Preview for ${product.name}`} loading="lazy" />
                  </button>
                ))}
              </div>
            )}
            {variants.length > 0 && (
              <div className="detail-gallery__variants">
                {variants.map((variant) => (
                  <button
                    key={variant.id}
                    type="button"
                    className={`detail-variant-pill ${selectedVariant?.id === variant.id ? "is-active" : ""}`}
                    onClick={() => setSelectedVariantId(variant.id)}
                    aria-pressed={selectedVariant?.id === variant.id}
                  >
                    {variant.hex && (
                      <span
                        className="detail-variant-pill__dot"
                        style={{ backgroundColor: variant.hex }}
                        aria-hidden="true"
                      />
                    )}
                    <span>{variant.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="detail-content">
            <p className="eyebrow">{productCategory?.name ?? "Product"}</p>
            <h1 className="v-h1">{product.name}</h1>
            <p className="detail-price">{formattedPrice}</p>
            {ratingCount > 0 && (
              <div
                className="detail-rating"
                aria-label={`Rated ${ratingValue.toFixed(1)} out of 5 based on ${ratingCount} reviews`}
              >
                <div className="detail-rating__stars">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <span
                      key={`rating-${index}`}
                      className={`detail-rating__star ${index < ratingStars ? "is-active" : ""}`}
                      aria-hidden="true"
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="detail-rating__meta">
                  {ratingValue.toFixed(1)} · {ratingCount} reviews
                </span>
              </div>
            )}
            <p className={`detail-stock detail-stock--${availability.variant}`}>{availability.label}</p>
            {selectedVariant && (
              <p className="detail-variant-label">Finish: {selectedVariant.label}</p>
            )}
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
                disabled={isOutOfStock}
              >
                {isOutOfStock ? "Out of stock" : "Add to cart"}
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
        {previewReviews.length > 0 && (
          <section className="detail-reviews" id="reviews">
            <div className="detail-reviews__header">
              <h2 className="v-h2">Reviews</h2>
              <a href="#reviews" className="detail-link">
                See all reviews
              </a>
            </div>
            <div className="detail-reviews__grid">
              {previewReviews.map((review) => (
                <article key={review.id} className="detail-review">
                  <div className="detail-review__header">
                    <strong>{review.name}</strong>
                    <span
                      className="detail-review__stars"
                      aria-label={`${review.stars} out of 5 stars`}
                    >
                      {Array.from({ length: 5 }).map((_, index) => (
                        <span
                          key={`${review.id}-${index}`}
                          className={`detail-review__star ${index < review.stars ? "is-active" : ""}`}
                          aria-hidden="true"
                        >
                          ★
                        </span>
                      ))}
                    </span>
                  </div>
                  <p className="detail-review__title">{review.title}</p>
                  <p className="detail-review__body">{review.body}</p>
                  <span className="detail-review__date">{formatReviewDate(review.date)}</span>
                </article>
              ))}
            </div>
          </section>
        )}
      </>
    );
  };

  return (
    <main className="storefront-shell detail-shell">
      <section className="v-section detail-section">
        <div className="v-container">
          <Link to="/" className="back-link">
            ← Back to all products
          </Link>

          {loading && <ProductDetailSkeleton />}

          {!loading && error && (
            <InlineError title="Unable to load product" body={error} onRetry={loadProduct} />
          )}

          {!loading && notFound && (
            <EmptyState
              title="Product not found"
              body="The item may be unavailable or the link is incorrect."
              actionLabel="Back to shop"
              onAction={() => navigate("/")}
            />
          )}

          {!loading && !error && !notFound && renderProduct()}
        </div>
      </section>
    </main>
  );
}
