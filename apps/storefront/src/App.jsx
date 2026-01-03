import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./contexts/CartContext";
import { AuthProvider } from "./contexts/AuthContext";
import ProductGridPage from "./pages/ProductGridPage";
import ProductDetail from "./pages/ProductDetail";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import CheckoutSuccessPage from "./pages/CheckoutSuccess";
import CheckoutCancelPage from "./pages/CheckoutCancel";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AccountPage from "./pages/AccountPage";
import AccountOrdersPage from "./pages/AccountOrdersPage";
import SiteHeader from "./components/SiteHeader";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
      <BrowserRouter>
        <SiteHeader />
        <Routes>
          <Route path="/" element={<ProductGridPage />} />
          <Route path="/category/:slug" element={<ProductGridPage />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<CartPage />} />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout/success"
            element={
              <ProtectedRoute>
                <CheckoutSuccessPage />
              </ProtectedRoute>
            }
          />
          <Route path="/checkout/cancel" element={<CheckoutCancelPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <AccountPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account/orders"
            element={
              <ProtectedRoute>
                <AccountOrdersPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}
