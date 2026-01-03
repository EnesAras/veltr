import { Link } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";

export default function SiteHeader() {
  const { totalItems } = useCart();
  const { user, logout } = useAuth();

  return (
    <header className="site-header">
      <Link to="/" className="site-logo">
        VELTR
      </Link>
      <nav className="site-nav">
        <Link to="/checkout" className="nav-link">
          Checkout
        </Link>
        {user ? (
          <>
            <Link to="/account" className="nav-link">
              Account
            </Link>
            <button type="button" className="nav-link" onClick={logout}>
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="nav-link">
            Sign in
          </Link>
        )}
        <Link to="/cart" className="cart-button">
          Cart
          <span className="cart-badge">{totalItems}</span>
        </Link>
      </nav>
    </header>
  );
}
