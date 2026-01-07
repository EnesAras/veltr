import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import HeroScene from "./HeroScene";
import FeaturedCards from "./FeaturedCards";
import { useCart } from "../contexts/CartContext";
import EmptyState from "./EmptyState";
import { SHOWCASE_TILES, FALLBACK_IMAGE } from "../../../../shared/data/products.js";

const FEATURE_ART_IMAGES = {
  "veltr-aero-flagship": { src: "/images/feature/aero-flagship.png", position: "40% 50%", scale: 0.95 },
  "veltr-echo-earbuds": { src: "/images/feature/echo-earbuds.png", position: "45% 45%", scale: 0.93 },
  "veltr-arc-stand": { src: "/images/feature/pulse-gaming.png", position: "center", scale: 0.96 }
};
import { PRODUCTS } from "../data/products.js";

const limit = 8;

export default function ProductGrid({ initialCategory }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(initialCategory ?? "");
  const [sort, setSort] = useState("newest");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const { addItem } = useCart();

  useEffect(() => {
    setCategory(initialCategory ?? "");
    setPage(1);
  }, [initialCategory]);

  useEffect(() => {
    setPage(1);
  }, [search, sort, minPrice, maxPrice]);

  const filteredProducts = useMemo(() => {
    let list = PRODUCTS;
    if (search) {
      const query = search.toLowerCase();
      list = list.filter(
        (item) => item.name.toLowerCase().includes(query) || item.description.toLowerCase().includes(query)
      );
    }
    if (category) {
      list = list.filter((item) => item.category === category);
    }
    if (minPrice) {
      const min = Number(minPrice);
      if (!Number.isNaN(min)) {
        list = list.filter((item) => item.price >= min);
      }
    }
    if (maxPrice) {
      const max = Number(maxPrice);
      if (!Number.isNaN(max)) {
        list = list.filter((item) => item.price <= max);
      }
    }
    if (sort === "price_asc") {
      list = [...list].sort((a, b) => a.price - b.price);
    } else if (sort === "price_desc") {
      list = [...list].sort((a, b) => b.price - a.price);
    }
    return list;
  }, [search, category, minPrice, maxPrice, sort]);

  const categories = useMemo(() => Array.from(new Set(PRODUCTS.map((product) => product.category))), []);
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / limit));

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const currentMeta = {
    page,
    limit,
    total: filteredProducts.length,
    pages: totalPages
  };

  const visibleProducts = filteredProducts.slice((page - 1) * limit, page * limit);
  const hasProducts = visibleProducts.length > 0;

  function handleCategoryLink(slug) {
    if (slug) {
      navigate(`/category/${slug}`);
    } else {
      navigate(`/`);
    }
  }

  function handlePageChange(delta) {
    setPage((value) => Math.max(1, Math.min(value + delta, totalPages)));
  }

  function clearFilters() {
    setSearch("");
    setMinPrice("");
    setMaxPrice("");
    setSort("newest");
    setCategory("");
    setPage(1);
    navigate("/");
  }

  const handleTileImageError = (event) => {
    const target = event.currentTarget;
    if (target) {
      target.onerror = null;
      target.src = FALLBACK_IMAGE;
    }
  };

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
              {SHOWCASE_TILES.map((tile) => {
                const featured = FEATURE_ART_IMAGES[tile.id];
                const imageSrc = featured?.src ?? tile.image;
                return (
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
                      <div className="audio-showcase__media-inner">
                        <img
                          src={imageSrc}
                          alt={tile.title}
                          loading="lazy"
                          onError={handleTileImageError}
                          style={{
                            objectPosition: featured?.position ?? "center",
                            "--tile-scale": featured?.scale ?? 1
                          }}
                        />
                      </div>
                    </div>
                  </article>
                );
              })}
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
                  key={cat}
                  type="button"
                  className={category === cat ? "active" : ""}
                  onClick={() => handleCategoryLink(cat)}
                >
                  {cat}
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
              {!hasProducts && (
                <EmptyState
                  title="No products found"
                  body="Try tweaking your filters or search to discover the perfect gear."
                  actionLabel="Clear filters"
                  onAction={clearFilters}
                  secondaryLabel="Back to home"
                  secondaryOnClick={() => navigate("/")}
                />
              )}

          {hasProducts &&
            visibleProducts.map((product) => {
              console.log("PRODUCT_IMAGE", product.slug, product.image);
                  const stock = product.inStock ?? 0;
                  const badge = getStockBadge(stock);
                  const isOutOfStock = stock <= 0;
                  const ratingValue = Number.isFinite(product.rating) ? product.rating : 0;
                  const ratingCount = product.reviewsCount ?? 0;
                  const filledStars = Math.round(ratingValue);
                  return (
                    <article key={product.id} className="product-card">
                      <Link to={`/product/${product.slug}`} className="product-card__link">
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
                        <p className="product-price">{product.currency} {product.price.toLocaleString()}</p>
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
                  Page {currentMeta.page} of {currentMeta.pages} ({currentMeta.total} items)
                </p>
              </div>
              <div className="pagination-actions">
                <button type="button" onClick={() => handlePageChange(-1)} disabled={page <= 1}>
                  Prev
                </button>
                <button type="button" onClick={() => handlePageChange(1)} disabled={page >= currentMeta.pages}>
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
