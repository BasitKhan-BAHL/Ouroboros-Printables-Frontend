import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const storedUser = window.localStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (err) {
        console.error("Failed to load user from localStorage", err);
      }
      setIsInitializing(false);
    }
  }, []);

  const login = (email, password) => {
    // Mock login
    const loggedInUser = {
      id: "usr_123",
      email: email,
      name: email.split("@")[0],
      subscription: null, // e.g., { license: 'free', plan: 'monthly' }
    };
    setUser(loggedInUser);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("user", JSON.stringify(loggedInUser));
    }
  };

  const register = (name, email, password) => {
    // Mock register
    const newUser = {
      id: "usr_" + Math.random().toString(36).substr(2, 9),
      name,
      email,
      subscription: null,
    };
    setUser(newUser);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("user", JSON.stringify(newUser));
    }
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("user");
    }
  };

  const updateSubscription = (subscription) => {
    if (!user) return;
    const updatedUser = { ...user, subscription };
    setUser(updatedUser);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  const removeSubscription = () => {
    if (!user) return;
    const updatedUser = { ...user, subscription: null };
    setUser(updatedUser);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isInitializing,
      login,
      register,
      logout,
      updateSubscription,
      removeSubscription,
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
