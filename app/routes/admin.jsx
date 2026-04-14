import { useState, useEffect } from "react";
import { Outlet, useNavigate, NavLink, useLocation } from "react-router";
import { useAuth } from "../context/auth";

export function meta() {
  return [{ title: "Admin Portal – Ouroboros Printables" }];
}

export default function AdminLayout() {
  const { user, login, logout, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Login Form State
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    if (!loading && user?.isAdmin && (location.pathname === "/admin" || location.pathname === "/admin/")) {
      navigate("/admin", { replace: true });
    }
  }, [user, loading, navigate, location.pathname]);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    setIsLoggingIn(true);
    try {
      const email = username === "admin" ? "support@ouroborosprintables.com" : username;
      await login(email, password);
    } catch (err) {
      setLoginError("Invalid admin credentials");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleExit = () => {
    logout();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-primary-50">
        <div className="text-lg font-secondary text-primary-600 animate-pulse">Initializing Portal...</div>
      </div>
    );
  }

  // Render Login Screen if not authenticated as Admin
  if (!user || !user.isAdmin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-primary-50 px-6 py-12">
        <div className="w-full max-w-md">
          <div className="mb-10 text-center">
             <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-900 shadow-xl">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
             </div>
             <h1 className="font-primary text-3xl font-bold tracking-tight text-primary-900">Admin Login</h1>
             <p className="mt-2 font-secondary text-primary-600">Secure access to catalog management</p>
          </div>

          <div className="rounded-2xl border border-primary-200 bg-white p-8 shadow-xl">
            <form onSubmit={handleAdminLogin} className="space-y-6">
              {loginError && (
                <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-center text-sm font-medium text-red-600">
                  {loginError}
                </div>
              )}
              
              <div>
                <label className="block font-secondary text-sm font-medium text-primary-950 mb-2">Username</label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-xl border border-primary-200 bg-primary-50 px-4 py-3 text-primary-900 placeholder-primary-400 focus:border-primary-900 focus:outline-none focus:ring-1 focus:ring-primary-900"
                  placeholder="admin"
                />
              </div>

              <div>
                <label className="block font-secondary text-sm font-medium text-primary-950 mb-2">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-primary-200 bg-primary-50 px-4 py-3 text-primary-900 placeholder-primary-400 focus:border-primary-900 focus:outline-none focus:ring-1 focus:ring-primary-900"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full rounded-xl bg-primary-900 px-8 py-4 font-primary text-lg font-bold text-white transition-all hover:bg-primary-800 active:scale-[0.98] disabled:opacity-50"
              >
                {isLoggingIn ? "Logging in..." : "Login to Console"}
              </button>
            </form>
          </div>
          
          <button 
            onClick={() => navigate("/")}
            className="mt-6 w-full text-center font-secondary text-sm text-primary-500 hover:text-primary-900 underline"
          >
            Back to Website
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-50">
      <div className="mx-auto max-w-[90rem] px-6 py-12 sm:px-8">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-primary-200 pb-8">
          <div>
            <h1 className="font-primary text-4xl font-bold tracking-tight text-primary-900">Admin Dashboard</h1>
            <p className="mt-2 font-secondary text-primary-600 text-lg">Product and category management console</p>
          </div>
          <div className="flex items-center gap-3 rounded-full bg-white border border-primary-200 px-4 py-2 shadow-sm">
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
            <span className="font-secondary text-sm font-medium text-primary-700">Admin: {user.name}</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-64 shrink-0">
            <div className="sticky top-8 space-y-2">
              <NavLink
                to="/admin"
                end
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-5 py-3.5 font-secondary font-semibold transition-all ${
                    isActive
                      ? "bg-primary-900 text-white shadow-md shadow-primary-900/10"
                      : "bg-white text-primary-600 border border-primary-100 hover:bg-primary-100"
                  }`
                }
              >
                <span>📊</span>
                Overview
              </NavLink>
              <NavLink
                to="/admin/categories"
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-5 py-3.5 font-secondary font-semibold transition-all ${
                    isActive
                      ? "bg-primary-900 text-white shadow-md shadow-primary-900/10"
                      : "bg-white text-primary-600 border border-primary-100 hover:bg-primary-100"
                  }`
                }
              >
                <span>🏷️</span>
                Categories
              </NavLink>
              <NavLink
                to="/admin/products"
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-5 py-3.5 font-secondary font-semibold transition-all ${
                    isActive
                      ? "bg-primary-900 text-white shadow-md shadow-primary-900/10"
                      : "bg-white text-primary-600 border border-primary-100 hover:bg-primary-100"
                  }`
                }
              >
                <span>📚</span>
                Products
              </NavLink>
              
              <div className="pt-8 mt-4 border-t border-primary-200">
                <button 
                  onClick={handleExit}
                  className="flex w-full items-center gap-3 rounded-xl px-5 py-3 font-secondary font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  <span>🚪</span>
                  Exit & Logout
                </button>
              </div>
            </div>
          </aside>

          <main className="flex-1 min-w-0">
            <div className="rounded-2xl bg-white p-6 md:p-10 shadow-sm border border-primary-200">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

