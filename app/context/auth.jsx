import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const getToken = () => (typeof window !== "undefined" ? window.localStorage.getItem("token") : null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // On mount: restore user from stored token
  useEffect(() => {
    const init = async () => {
      const token = getToken();
      if (!token) {
        setIsInitializing(false);
        return;
      }
      try {
        const res = await fetch(`${API_BASE}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          // Token expired / invalid — clear it
          window.localStorage.removeItem("token");
        }
      } catch {
        // Network unavailable — fall back gracefully
      }
      setIsInitializing(false);
    };
    init();
  }, []);

  // Store token + user helper
  const persistSession = (token, userData) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("token", token);
    }
    setUser(userData);
  };

  const login = async (email, password) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Login failed");
    persistSession(data.token, data.user);
    return data.user;
  };

  const register = async (name, email, password) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Registration failed");
    persistSession(data.token, data.user);
    return data.user;
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("token");
    }
  };

  const updateLicense = async (license) => {
    const token = getToken();
    const res = await fetch(`${API_BASE}/users/me`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ license }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to update license");
    
    // Refresh user to get updated license
    setUser(data.user);
    return data.user.license;
  };

  // Called after Google OAuth callback — receives token from ?token= URL param
  const loginWithToken = async (token) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("token", token);
    }
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to fetch user");
    setUser(data.user);
    return data.user;
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isInitializing,
      login,
      register,
      logout,
      updateLicense,
      loginWithToken,
    }),
    [user, isInitializing]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
