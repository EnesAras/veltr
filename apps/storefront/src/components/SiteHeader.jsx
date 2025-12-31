import { Link } from "react-router-dom";
import { useCart } from "../contexts/CartContext";

export default function SiteHeader() {
  const { totalItems } = useCart();

  return (
    <header className="site-header">
      <Link to="/" className="site-logo">
        VELTR
      </Link>
      <nav className="site-nav">
        <Link to="/checkout" className="nav-link">
          Checkout
        </Link>
        <Link to="/cart" className="cart-button">
          Cart
          <span className="cart-badge">{totalItems}</span>
        </Link>
      </nav>
    </header>
  );
}
