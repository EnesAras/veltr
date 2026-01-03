import { Link } from "react-router-dom";

export default function CheckoutCancelPage() {
  return (
    <main className="storefront-shell checkout-result checkout-cancel">
      <section className="checkout-result__panel">
        <p className="eyebrow">Checkout paused</p>
        <h1>Checkout canceled.</h1>
        <p className="lede">
          No payment was taken. You can return to the checkout to try again or explore other Veltr audio essentials.
        </p>
        <div className="checkout-result__actions">
          <Link to="/checkout" className="cta">
            Back to checkout
          </Link>
          <Link to="/" className="nav-link">
            Continue shopping
          </Link>
        </div>
      </section>
    </main>
  );
}
