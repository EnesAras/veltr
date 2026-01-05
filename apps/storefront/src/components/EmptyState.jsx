export default function EmptyState({
  title,
  body,
  actionLabel,
  onAction,
  secondaryLabel,
  secondaryOnClick
}) {
  return (
    <section className="empty-state">
      <p className="empty-state__eyebrow">VELTR</p>
      <h3>{title}</h3>
      <p>{body}</p>
      <div className="empty-state__actions">
        <button type="button" className="v-btn v-btn--primary" onClick={onAction}>
          {actionLabel}
        </button>
        {secondaryLabel && (
          <button type="button" className="v-btn v-btn--ghost" onClick={secondaryOnClick}>
            {secondaryLabel}
          </button>
        )}
      </div>
    </section>
  );
}
