import { createContext, useContext, useEffect, useMemo, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5001";
const STORAGE_KEY = "veltr_auth_v1";

const AuthContext = createContext(null);

function readStored() {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.token || !parsed.user) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function persistSession(user, token) {
  if (typeof window === "undefined") {
    return;
  }
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ user, token }));
  } catch {
    // ignore
  }
}

function clearSessionStorage() {
  if (typeof window === "undefined") {
    return;
  }
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const saveSession = (nextUser, nextToken) => {
    setUser(nextUser);
    setToken(nextToken);
    persistSession(nextUser, nextToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    clearSessionStorage();
  };

  const login = async ({ email, password }) => {
    const response = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });
    const payload = await response.json();
    if (!response.ok) {
      throw new Error(payload?.error ?? "Unable to login");
    }
    saveSession(payload.user, payload.token);
    return payload.user;
  };

  const register = async ({ name, email, password }) => {
    const response = await fetch(`${API_BASE}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, email, password })
    });
    const payload = await response.json();
    if (!response.ok) {
      throw new Error(payload?.error ?? "Unable to register");
    }
    saveSession(payload.user, payload.token);
    return payload.user;
  };

  useEffect(() => {
    let isMounted = true;
    const stored = readStored();
    if (!stored?.token) {
      setLoading(false);
      return;
    }
    const restore = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${stored.token}`
          }
        });
        if (!response.ok) {
          throw new Error("Session expired");
        }
        const payload = await response.json();
        if (!isMounted) return;
        saveSession(payload.user, stored.token);
      } catch {
        if (!isMounted) return;
        logout();
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    restore();
    return () => {
      isMounted = false;
    };
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      login,
      register,
      logout
    }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
