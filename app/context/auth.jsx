import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const getToken = () =>
  typeof window !== "undefined" ? window.localStorage.getItem("token") : null;

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
          window.localStorage.removeItem("token");
        }
      } catch {
        // Network unavailable — fall back gracefully
      }
      setIsInitializing(false);
    };
    init();
  }, []);

  const persistSession = (token, userData) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("token", token);
    }
    setUser(userData);
  };

  const refreshUser = async () => {
    const token = getToken();
    if (!token) return null;
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to refresh user");
    setUser(data.user);
    return data.user;
  };

  const applyLocalLicense = (license) => {
    setUser((prev) => (prev ? { ...prev, license } : prev));
  };

  const login = async (email, password) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Login failed");
    // Handle unverified account edge case
    if (data.requiresOtp) {
      return { requiresOtp: true, email: data.email };
    }
    persistSession(data.token, data.user);
    return data.user;
  };

  // Step 1: Register — sends OTP email, does NOT log user in yet
  const register = async (details) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(details),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Registration failed");
    // Returns { requiresOtp: true, email }
    return { requiresOtp: true, email: data.email };
  };

  // Step 2: Verify OTP — logs user in and returns user
  const verifyOtp = async (email, otp) => {
    const res = await fetch(`${API_BASE}/auth/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "OTP verification failed");
    persistSession(data.token, data.user);
    return data.user;
  };

  // Resend OTP
  const resendOtp = async (email) => {
    const res = await fetch(`${API_BASE}/auth/resend-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to resend OTP");
    return data;
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
  
  const completeProfile = async (details) => {
    const token = getToken();
    const res = await fetch(`${API_BASE}/users/me`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(details),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to complete profile");
    setUser(data.user);
    return data.user;
  };

  const isProfileComplete = useMemo(() => {
    if (!user) return false;
    // Admin accounts should not be blocked by business profile completion flow.
    if (user.isAdmin) return true;
    return !!(
      user.businessName &&
      user.businessNature &&
      user.businessSocial &&
      user.businessLocation &&
      user.phone
    );
  }, [user]);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user && isProfileComplete,
      isInitializing,
      isProfileComplete,
      login,
      register,
      verifyOtp,
      resendOtp,
      logout,
      updateLicense,
      loginWithToken,
      completeProfile,
      refreshUser,
      applyLocalLicense,
    }),
    [user, isInitializing, isProfileComplete]
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
