import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import HeroScene from "./HeroScene";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5001";
const PLACEHOLDER_MEDIA = "/assets/veltr/media-placeholder.svg";

const SHOWCASE_TILES = [
  {
    id: "veltr-aero-flagship",
    title: "VELTR Aero Flagship",
    accent: "Flagship over-ear studio",
    tagline: "Carbon fiber headband, dual X drivers, and 40-hour battery for cinematic listening, anytime.",
    image: "/assets/veltr/tile-01.jpg"
  },
  {
    id: "veltr-echo-earbuds",
    title: "VELTR Echo Wireless Earbuds",
    accent: "True wireless Earbuds",
    tagline: "Spatial audio, adaptive EQ, and a sculpted titanium stem that disappears in the ear.",
    image: "/assets/veltr/tile-02.jpg"
  },
  {
    id: "veltr-arc-stand",
    title: "VELTR Arc Charging Stand",
    accent: "Accessories / charging",
    tagline: "Magnetic cradle and balanced stand that doubles as a lighting sculpted display for your set.",
    image: "/assets/veltr/tile-03.jpg"
  }
];

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

  useEffect(() => {
    async function loadProducts() {
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
    }

    loadProducts();
  }, [search, category, sort, minPrice, maxPrice, page]);

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

  const handleTileImageError = (event) => {
    const target = event.currentTarget;
    if (target) {
      target.onerror = null;
      target.src = PLACEHOLDER_MEDIA;
    }
  };

  const hasProducts = products.length > 0;

  return (
    <>
      <HeroScene />
      <main className="storefront-shell">
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
        <header className="hero">
          <p className="eyebrow">VELTR</p>
          <h1>Pure audio. Crafted for focus.</h1>
          <p className="lede">
            Handcrafted headphones, earbuds, and accessories tuned for cinematic sound, studio silence, and everyday ritual.
          </p>
        </header>

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
        {loading && <p className="status">Loading products…</p>}
        {error && !loading && <p className="status status-error">{error}</p>}
        {!loading && !error && !hasProducts && <p className="status">No products match that filter.</p>}
        {!loading &&
          hasProducts &&
          products.map((product) => (
            <Link key={product.id} to={`/product/${product.id}`} className="product-card">
              <div className="product-image">
                <img src={product.image} alt={product.name} loading="lazy" onError={handleTileImageError} />
              </div>
              <div className="product-info">
                <p className="product-name">{product.name}</p>
                <p className="product-price">${product.price.toLocaleString()}</p>
              </div>
            </Link>
          ))}
      </section>

      <section className="pagination">
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
      </section>
      </main>
    </>
  );
}
