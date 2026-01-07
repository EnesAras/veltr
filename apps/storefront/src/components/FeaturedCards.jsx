import { FEATURED_CARDS } from "../../../../shared/data/products.js";
import { Link } from "react-router-dom";

const PRELOAD_COUNT = 3;

export default function FeaturedCards() {
  const preloadCards = FEATURED_CARDS.slice(0, PRELOAD_COUNT);

  return (
    <>
      {preloadCards.map((card) => (
        <link
          key={`preload-${card.id}`}
          rel="preload"
          as="image"
          href={card.image}
          imagesrcset=""
          crossOrigin="anonymous"
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
                    <img
                      className="featured-card__image"
                      src={card.image}
                      alt={card.title}
                      loading={index < PRELOAD_COUNT ? "eager" : "lazy"}
                      decoding="async"
                      fetchPriority={index < PRELOAD_COUNT ? "high" : "low"}
                      width="600"
                      height="600"
                    />
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
