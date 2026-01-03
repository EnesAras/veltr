import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "./AuthContext";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5001";
const GUEST_KEY = "cart:guest";

function safeParse(raw) {
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed;
  } catch {
    return [];
  }
}

function hydrateCartEntries(entries) {
  if (!Array.isArray(entries)) {
    return [];
  }
  return entries
    .map((entry) => {
      if (!entry) {
        return null;
      }
      const productId = entry.productId ?? entry.id;
      if (!productId) {
        return null;
      }
      return {
        ...entry,
        productId,
        id: entry.id ?? productId
      };
    })
    .filter(Boolean);
}

function readStoredCart(key) {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) {
      return [];
    }
    return hydrateCartEntries(safeParse(raw));
  } catch {
    return [];
  }
}

function writeStoredCart(key, data) {
  if (typeof window === "undefined") {
    return;
  }
  try {
    window.localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // ignore
  }
}

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user, token } = useAuth();
  const [items, setItems] = useState(() => readStoredCart(GUEST_KEY));
  const [loading, setLoading] = useState(false);
  const skipSyncRef = useRef(false);
  const prevUserIdRef = useRef(null);

  const storageKey = user ? `cart:${user.id}` : GUEST_KEY;

  const persist = (nextItems) => {
    writeStoredCart(storageKey, nextItems);
  };

  const applyServerItems = (nextItems) => {
    const normalized = hydrateCartEntries(nextItems);
    skipSyncRef.current = true;
    setItems(normalized);
    persist(normalized);
    skipSyncRef.current = false;
  };

  const syncCartToServer = async (nextItems) => {
    if (!user || !token || skipSyncRef.current) {
      return;
    }
    const payload = nextItems.map((entry) => ({ productId: entry.productId, qty: entry.qty }));
    try {
      await fetch(`${API_BASE}/api/cart`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ items: payload })
      });
    } catch (error) {
      console.error("Failed to sync cart", error);
    }
  };

  const loadUserCart = async () => {
    if (!user || !token) {
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/cart`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const payload = await response.json();
      if (response.ok) {
        applyServerItems(payload.items ?? []);
      }
    } catch (error) {
      console.error("Unable to load cart", error);
    } finally {
      setLoading(false);
    }
  };

  const mergeGuestCart = async () => {
    if (!user || !token) {
      return;
    }
    const guestItems = readStoredCart(GUEST_KEY);
    if (!guestItems.length) {
      await loadUserCart();
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/cart/merge`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ items: guestItems })
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error ?? "Unable to merge cart");
      }
      applyServerItems(payload.items ?? []);
      writeStoredCart(GUEST_KEY, []);
    } catch (error) {
      console.error("Cart merge failed", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
    setItems(readStoredCart(GUEST_KEY));
    return;
  }
    if (prevUserIdRef.current !== user.id) {
      mergeGuestCart();
    } else {
      loadUserCart();
    }
    prevUserIdRef.current = user.id;
  }, [user?.id, token]);

  const updateCart = (nextItems) => {
    const normalized = hydrateCartEntries(nextItems);
    setItems(normalized);
    persist(normalized);
    syncCartToServer(normalized);
  };

  const addItem = (product, qty = 1) => {
    const productId = product?.id ?? product?.productId;
    if (!productId || qty <= 0) {
      return;
    }
    const next = [...items];
    const existingIndex = next.findIndex((entry) => entry.productId === productId);
    if (existingIndex >= 0) {
      next[existingIndex] = {
        ...next[existingIndex],
        qty: next[existingIndex].qty + qty
      };
    } else {
      next.push({
        productId,
        name: product.name,
        price: product.price,
        image: product.image,
        qty,
        id: productId
      });
    }
    updateCart(next);
  };

  const removeItem = (productId) => {
    const next = items.filter((entry) => entry.productId !== productId);
    updateCart(next);
  };

  const setQty = (productId, qty) => {
    const normalized = Math.floor(Number(qty));
    if (Number.isNaN(normalized)) {
      return;
    }
    if (normalized <= 0) {
      removeItem(productId);
      return;
    }
    const next = items.map((entry) =>
      entry.productId === productId
        ? { ...entry, qty: normalized }
        : entry
    );
    updateCart(next);
  };

  const clear = () => {
    updateCart([]);
  };

  const totalItems = useMemo(() => items.reduce((acc, entry) => acc + entry.qty, 0), [items]);
  const subtotal = useMemo(() => items.reduce((acc, entry) => acc + entry.price * entry.qty, 0), [items]);

  const value = {
    items,
    loading,
    addItem,
    removeItem,
    setQty,
    clear,
    totalItems,
    subtotal
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
