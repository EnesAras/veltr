export default function ProductDetailSkeleton() {
  return (
    <article className="detail-card detail-card--skeleton">
      <div className="detail-image detail-image--skeleton" />
      <div className="detail-content detail-content--skeleton">
        <div className="skeleton-line skeleton-line--title" />
        <div className="skeleton-line skeleton-line--large" />
        <div className="skeleton-line skeleton-line--small" />
        <div className="detail-actions detail-actions--skeleton">
          <div className="skeleton-line skeleton-line--button" />
          <div className="skeleton-line skeleton-line--button" />
        </div>
      </div>
    </article>
  );
}
