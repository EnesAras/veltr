export default function SkeletonCard() {
  return (
    <article className="skeleton-card">
      <div className="skeleton-card__media" />
      <div className="skeleton-card__body">
        <div className="skeleton-card__line skeleton-card__line--title" />
        <div className="skeleton-card__line" />
        <div className="skeleton-card__footer">
          <div className="skeleton-card__line skeleton-card__line--button" />
        </div>
      </div>
    </article>
  );
}
