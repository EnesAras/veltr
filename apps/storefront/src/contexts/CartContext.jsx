import { createContext, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "veltr_cart_v1";

const CartContext = createContext(null);

function safeReadStorage() {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed;
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => safeReadStorage());

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore storage errors
    }
  }, [items]);

  const addItem = (product, qty = 1) => {
    if (!product?.id || qty <= 0) {
      return;
    }

    setItems((current) => {
      const existing = current.find((entry) => entry.id === product.id);
      if (existing) {
        return current.map((entry) =>
          entry.id === product.id
            ? {
                ...entry,
                qty: entry.qty + qty
              }
            : entry
        );
      }
      return [
        ...current,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          qty
        }
      ];
    });
  };

  const removeItem = (id) => {
    setItems((current) => current.filter((entry) => entry.id !== id));
  };

  const setQty = (id, qty) => {
    const normalized = Math.floor(Number(qty));
    if (Number.isNaN(normalized)) {
      return;
    }

    if (normalized <= 0) {
      setItems((current) => current.filter((entry) => entry.id !== id));
      return;
    }

    setItems((current) =>
      current.map((entry) =>
        entry.id === id
          ? {
              ...entry,
              qty: normalized
            }
          : entry
      )
    );
  };

  const clear = () => {
    setItems([]);
  };

  const totalItems = useMemo(() => items.reduce((acc, entry) => acc + entry.qty, 0), [items]);

  const subtotal = useMemo(
    () => items.reduce((acc, entry) => acc + entry.price * entry.qty, 0),
    [items]
  );

  const value = {
    items,
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
