import { FEATURED_CARDS } from "../../../../shared/data/products.js";
import { Link } from "react-router-dom";

export default function FeaturedCards() {
  return (
    <section className="featured-cards" aria-label="Featured stories">
      <div className="v-container featured-cards__content">
        <div className="featured-cards__header">
          <p className="eyebrow">Editorial</p>
          <h2 className="v-h2">VELTR stories in motion</h2>
        </div>
        <div className="featured-cards__rail">
          {FEATURED_CARDS.map((card) => (
            <article key={card.id} className="featured-card">
              <Link to={card.link} className="featured-card__link">
                <div
                  className="featured-card__background"
                  style={{ backgroundImage: `url("${card.image}")` }}
                >
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
  );
}
