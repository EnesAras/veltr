import { Link } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";

export default function SiteHeader() {
  const { totalItems } = useCart();
  const { user, logout } = useAuth();

  return (
    <header className="site-header">
      <div className="v-container">
        <Link to="/" className="site-logo">
          VELTR
        </Link>
        <nav className="site-nav">
          <Link to="/checkout" className="nav-link">
            Checkout
          </Link>
          <div className="site-nav__actions">
            {user ? (
              <>
                <Link to="/account" className="v-btn v-btn--ghost">
                  Account
                </Link>
                <button type="button" className="v-btn v-btn--ghost" onClick={logout}>
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="v-btn v-btn--outline">
                Sign in
              </Link>
            )}
            <Link to="/cart" className="v-btn v-btn--primary site-header__cart">
              Cart
              <span className="cart-badge">{totalItems}</span>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
