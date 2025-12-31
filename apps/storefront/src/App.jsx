import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./contexts/CartContext";
import ProductGridPage from "./pages/ProductGridPage";
import ProductDetail from "./pages/ProductDetail";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import SiteHeader from "./components/SiteHeader";

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <SiteHeader />
        <Routes>
          <Route path="/" element={<ProductGridPage />} />
          <Route path="/category/:slug" element={<ProductGridPage />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}
