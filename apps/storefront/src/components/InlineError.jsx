export default function InlineError({ title, body, onRetry }) {
  return (
    <section className="inline-error">
      <div>
        <p className="inline-error__title">{title}</p>
        <p className="inline-error__body">{body}</p>
      </div>
      <button type="button" className="v-btn v-btn--outline inline-error__action" onClick={onRetry}>
        Retry
      </button>
    </section>
  );
}
