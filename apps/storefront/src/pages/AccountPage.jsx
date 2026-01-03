import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function AccountPage() {
  const { user, logout } = useAuth();

  return (
    <main className="account-page">
      <section className="account-card">
        <p className="eyebrow">Welcome back</p>
        <h1>{user?.name ?? "VELTR customer"}</h1>
        <p className="lede">Your premium headphones are waiting.</p>
        <div className="account-card__details">
          <p>
            <strong>Email</strong>
            <span>{user?.email}</span>
          </p>
          <p>
            <strong>Member since</strong>
            <span>{new Date().toLocaleDateString()}</span>
          </p>
        </div>
        <div className="account-card__actions">
          <Link to="/account/orders" className="primary">
            View orders
          </Link>
          <button type="button" className="secondary" onClick={logout}>
            Sign out
          </button>
        </div>
      </section>
    </main>
  );
}
