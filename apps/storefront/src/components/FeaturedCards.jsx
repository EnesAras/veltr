import { FEATURED_CARDS } from "../../../../shared/data/products.js";
import { Link } from "react-router-dom";

const PRELOAD_COUNT = 3;
const IMAGE_WIDTHS = [1200, 1600, 2000];
const getImageBase = (src) => (src ? src.replace(/\.(png|jpe?g)$/i, "") : "");
const buildVariantSrc = (src, format, width) => {
  const base = getImageBase(src);
  return base ? `${base}-${width}.${format}` : src;
};
const buildSrcSet = (src, format) => {
  const base = getImageBase(src);
  if (!base) {
    return "";
  }
  return IMAGE_WIDTHS.map((width) => `${base}-${width}.${format} ${width}w`).join(", ");
};
const buildFallbackSrc = (src) => {
  const base = getImageBase(src);
  return base ? `${base}-1600.jpg` : src;
};

export default function FeaturedCards() {
  const preloadCards = FEATURED_CARDS.slice(0, PRELOAD_COUNT);

  const handleFeaturedImageLoad = (event) => {
    const image = event.currentTarget;
    image.classList.add("is-loaded");
    image.closest(".featured-card__background")?.classList.add("is-loaded");
  };

  return (
    <>
      {preloadCards.map((card) => (
        <link
          key={`preload-${card.id}`}
          rel="preload"
          as="image"
          href={buildVariantSrc(card.image, "avif", 1600)}
          type="image/avif"
        />
      ))}
      <section className="featured-cards" aria-label="Featured stories">
        <div className="v-container featured-cards__content">
          <div className="featured-cards__header">
            <p className="eyebrow">Editorial</p>
            <h2 className="v-h2">VELTR stories in motion</h2>
          </div>
          <div className="featured-cards__rail">
            {FEATURED_CARDS.map((card, index) => (
              <article
                key={card.id}
                className={`featured-card ${card.id === "veltr-editorial-2" ? "featured-card--studio" : ""} ${
                  index >= PRELOAD_COUNT ? "featured-card--lazy" : ""
                }`}
              >
                <Link to={card.link} className="featured-card__link">
                  <div className="featured-card__background">
                    <picture>
                      <source type="image/avif" srcSet={buildSrcSet(card.image, "avif")} sizes="100vw" />
                      <source type="image/webp" srcSet={buildSrcSet(card.image, "webp")} sizes="100vw" />
                      <img
                        className="featured-card__image"
                        src={buildFallbackSrc(card.image)}
                        alt={card.title}
                        loading={index < PRELOAD_COUNT ? "eager" : "lazy"}
                        decoding="async"
                        width="2000"
                        height="2500"
                        onLoad={handleFeaturedImageLoad}
                      />
                    </picture>
                    <div className="featured-card__overlay" />
                    <div className="featured-card__copy">
                      <span className="featured-card__tag">{card.tag}</span>
                      <h3>{card.title}</h3>
                      <p>{card.description}</p>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
