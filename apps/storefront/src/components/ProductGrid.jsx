import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import HeroScene from "./HeroScene";
import FeaturedCards from "./FeaturedCards";
import { useCart } from "../contexts/CartContext";
import SkeletonCard from "./SkeletonCard";
import EmptyState from "./EmptyState";
import InlineError from "./InlineError";
import { SHOWCASE_TILES, FALLBACK_IMAGE } from "../../../../shared/data/products.js";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5001";

export default function ProductGrid({ initialCategory }) {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [meta, setMeta] = useState({ page: 1, limit: 8, total: 0, pages: 1 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(initialCategory ?? "");
  const [sort, setSort] = useState("newest");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [page, setPage] = useState(1);
  const limit = 8;
  const navigate = useNavigate();
  const { addItem } = useCart();

  useEffect(() => {
    setCategory(initialCategory ?? "");
    setPage(1);
  }, [initialCategory]);

  useEffect(() => {
    setPage(1);
  }, [search, sort, minPrice, maxPrice]);

  useEffect(() => {
    async function loadCategories() {
      try {
        const response = await fetch(`${API_BASE}/api/categories`);
        const payload = await response.json();
        if (!response.ok) {
          throw new Error(payload?.error ?? "Unable to load categories");
        }
        setCategories(payload.categories ?? []);
      } catch (err) {
        setCategories([]);
      }
    }

    loadCategories();
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (search) params.set("q", search);
      if (category) params.set("category", category);
      if (minPrice) params.set("minPrice", minPrice);
      if (maxPrice) params.set("maxPrice", maxPrice);
      if (sort) params.set("sort", sort);
      params.set("page", String(page));
      params.set("limit", String(limit));

      const response = await fetch(`${API_BASE}/api/products?${params.toString()}`);
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error ?? "Unable to load products");
      }

      setProducts(payload.items ?? []);
      setMeta(payload.meta ?? { page, limit, total: 0, pages: 1 });
    } catch (err) {
      setProducts([]);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [search, category, sort, minPrice, maxPrice, page]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  function handleCategoryLink(slug) {
    if (slug) {
      navigate(`/category/${slug}`);
    } else {
      navigate(`/`);
    }
  }

  function handlePageChange(delta) {
    setPage((value) => Math.max(1, value + delta));
  }

  const clearFilters = () => {
    setSearch("");
    setMinPrice("");
    setMaxPrice("");
    setSort("newest");
    setCategory("");
    setPage(1);
    navigate("/");
  };

  const handleTileImageError = (event) => {
    const target = event.currentTarget;
    if (target) {
      target.onerror = null;
      target.src = FALLBACK_IMAGE;
    }
  };

  const hasProducts = products.length > 0;

  const getStockBadge = (stock) => {
    if (stock <= 0) {
      return { label: "Out of stock", variant: "out" };
    }
    if (stock <= 5) {
      return { label: "Low stock", variant: "low" };
    }
    return null;
  };

  return (
    <>
      <HeroScene />
      <main className="storefront-shell home-main">
        <FeaturedCards />

        <section className="v-section v-section--tight">
          <div className="v-container">
            <section className="audio-showcase" aria-label="VELTR audio highlights">
              {SHOWCASE_TILES.map((tile) => (
                <article key={tile.id} className="audio-showcase__tile">
                  <div className="audio-showcase__content">
                    <p className="audio-showcase__eyebrow">{tile.accent}</p>
                    <h2>{tile.title}</h2>
                    <p>{tile.tagline}</p>
                    <div className="audio-showcase__actions">
                      <Link to={`/product/${tile.id}`} className="audio-showcase__btn audio-showcase__btn--primary">
                        View product
                      </Link>
                      <button type="button" className="audio-showcase__btn audio-showcase__btn--secondary">
                        Buy
                      </button>
                    </div>
                  </div>
                  <div className="audio-showcase__media">
                    <img src={tile.image} alt={tile.title} loading="lazy" onError={handleTileImageError} />
                  </div>
                </article>
              ))}
            </section>
          </div>
        </section>

        <section className="v-section v-section--tight">
          <div className="v-container">
            <header className="hero">
              <p className="eyebrow">VELTR</p>
              <h1 className="v-h1">Pure audio. Crafted for focus.</h1>
              <p className="v-p">
                Handcrafted headphones, earbuds, and accessories tuned for cinematic sound, studio silence, and everyday ritual.
              </p>
            </header>
          </div>
        </section>

        <section className="v-section v-section--tight">
          <div className="v-container">
            <section className="category-nav" aria-label="Product categories">
              <button type="button" className={!category ? "active" : ""} onClick={() => handleCategoryLink("")}>
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.slug}
                  type="button"
                  className={category === cat.slug ? "active" : ""}
                  onClick={() => handleCategoryLink(cat.slug)}
                >
                  {cat.name}
                </button>
              ))}
            </section>

            <section className="filters-grid">
              <label>
                <span>Search</span>
                <input
                  type="search"
                  placeholder="Search products"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </label>
              <label>
                <span>Sort</span>
                <select value={sort} onChange={(event) => setSort(event.target.value)}>
                  <option value="newest">Newest arrivals</option>
                  <option value="price_asc">Price low → high</option>
                  <option value="price_desc">Price high → low</option>
                </select>
              </label>
              <label>
                <span>Min price</span>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={minPrice}
                  onChange={(event) => setMinPrice(event.target.value)}
                />
              </label>
              <label>
                <span>Max price</span>
                <input
                  type="number"
                  min="0"
                  placeholder="5000"
                  value={maxPrice}
                  onChange={(event) => setMaxPrice(event.target.value)}
                />
              </label>
            </section>

            <section className="products-grid">
              {loading &&
                Array.from({ length: limit }).map((_, index) => (
                  <SkeletonCard key={`skeleton-${index}`} />
                ))}

              {!loading && error && (
                <InlineError title="Unable to load products" body={error} onRetry={fetchProducts} />
              )}

              {!loading && !error && !hasProducts && (
                <EmptyState
                  title="No products found"
                  body="Try tweaking your filters or search to discover the perfect gear."
                  actionLabel="Clear filters"
                  onAction={clearFilters}
                  secondaryLabel="Back to home"
                  secondaryOnClick={() => navigate("/")}
                />
              )}

              {!loading &&
                !error &&
                hasProducts &&
                products.map((product) => {
                  const stock = product.stock ?? 0;
                  const badge = getStockBadge(stock);
                  const isOutOfStock = stock <= 0;
                  const ratingValue = Number.isFinite(product.ratingAvg) ? product.ratingAvg : 0;
                  const ratingCount = product.ratingCount ?? 0;
                  const filledStars = Math.round(ratingValue);
                  return (
                    <article key={product.id} className="product-card">
                      <Link to={`/product/${product.id}`} className="product-card__link">
                        <div className="product-image">
                          <img src={product.image} alt={product.name} loading="lazy" onError={handleTileImageError} />
                          {badge && (
                            <span className={`product-badge product-badge--${badge.variant}`}>{badge.label}</span>
                          )}
                        </div>
                        <div className="product-info">
                          <p className="product-name">{product.name}</p>
                          {ratingCount > 0 && (
                            <div
                              className="product-rating"
                              aria-label={`Rated ${ratingValue.toFixed(1)} out of 5 based on ${ratingCount} reviews`}
                            >
                              <div className="product-rating__stars">
                                {Array.from({ length: 5 }).map((_, index) => (
                                  <span
                                    key={index}
                                    className={`product-rating__star ${index < filledStars ? "is-filled" : ""}`}
                                    aria-hidden="true"
                                  >
                                    ★
                                  </span>
                                ))}
                              </div>
                              <span className="product-rating__meta">
                                {ratingValue.toFixed(1)} ({ratingCount})
                              </span>
                            </div>
                          )}
                        </div>
                      </Link>
                      <div className="product-card__footer">
                        <p className="product-price">${product.price.toLocaleString()}</p>
                        <button
                          type="button"
                          className="v-btn v-btn--primary product-card__action"
                          disabled={isOutOfStock}
                          onClick={() => !isOutOfStock && addItem(product, 1)}
                          aria-label={isOutOfStock ? `${product.name} is out of stock` : `Add ${product.name} to cart`}
                        >
                          {isOutOfStock ? "Out of stock" : "Add to cart"}
                        </button>
                      </div>
                    </article>
                  );
                })}
            </section>

            <div className="pagination">
              <div className="pagination-meta">
                <p>
                  Page {meta.page} of {meta.pages} ({meta.total} items)
                </p>
              </div>
              <div className="pagination-actions">
                <button type="button" onClick={() => handlePageChange(-1)} disabled={page <= 1}>
                  Prev
                </button>
                <button type="button" onClick={() => handlePageChange(1)} disabled={page >= meta.pages}>
                  Next
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
