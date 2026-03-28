import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useAuth } from "../context/auth";

export function meta() {
  return [
    { title: "Your Account – Ouroboros Printables" },
    { name: "description", content: "Sign in or create an account." },
  ];
}

function UserIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20" height="20">
      <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
      <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
      <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
      <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
    </svg>
  );
}

export default function Account() {
  const [activeTab, setActiveTab] = useState("signin");
  const { login, register, loginWithToken } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectParam = searchParams.get("redirect");
  const actionParam = searchParams.get("action");
  const productIdParam = searchParams.get("productId");
  const tokenParam = searchParams.get("token");
  const errorParam = searchParams.get("error");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(errorParam === "google_failed" ? "Google sign-in failed. Please try again." : "");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [verifyingToken, setVerifyingToken] = useState(!!tokenParam);

  const Spinner = () => (
    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );

  // Handle Google OAuth callback token arriving in URL
  useEffect(() => {
    if (!tokenParam) {
      setVerifyingToken(false);
      return;
    }
    loginWithToken(tokenParam).then((user) => {
      // Clean token from URL so it doesn't re-run on refresh
      const url = new URL(window.location.href);
      url.searchParams.delete("token");
      window.history.replaceState({}, "", url.toString());

      // If user somehow doesn't have a license, send them to pick one
      if (!user?.license) {
        const nextUrl = new URLSearchParams();
        if (redirectParam) nextUrl.set("redirect", redirectParam);
        if (actionParam) nextUrl.set("action", actionParam);
        if (productIdParam) nextUrl.set("productId", productIdParam);
        navigate(`/licenses?${nextUrl.toString()}`);
      } else {
        navigate(redirectParam || "/");
      }
    }).catch(() => {
      setError("Google sign-in failed. Please try again.");
      setVerifyingToken(false);
    });
  }, [tokenParam]);

  const handleAuthSuccess = (isNewUser) => {
    if (isNewUser) {
      const nextUrl = new URLSearchParams();
      if (redirectParam) nextUrl.set("redirect", redirectParam);
      if (actionParam) nextUrl.set("action", actionParam);
      if (productIdParam) nextUrl.set("productId", productIdParam);
      // New users get free license default, navigate to redirect path directly
      navigate(redirectParam || "/");
    } else {
      navigate(redirectParam || "/");
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      handleAuthSuccess(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(name, email, password);
      handleAuthSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    setGoogleLoading(true);
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
    window.location.href = `${apiUrl}/auth/google`;
  };

  if (verifyingToken) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center justify-center px-6 py-24 sm:px-8">
        <div className="text-primary-900 mb-4 scale-150">
          <Spinner />
        </div>
        <p className="font-secondary text-primary-600 animate-pulse">Completing sign in...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center justify-center px-6 py-16 sm:px-8">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 text-primary-900">
        <UserIcon />
      </div>
      <h1 className="mt-6 font-primary text-3xl font-bold text-primary-900">Your Account</h1>
      <p className="mt-2 text-center font-secondary text-primary-600">
        Sign in or create an account to manage licenses and subscriptions
      </p>

      {/* Google Sign In */}
      <div className="mt-8 w-full">
        <button
          type="button"
          disabled={googleLoading}
          onClick={handleGoogleSignIn}
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-primary-200 bg-white px-4 py-3 font-secondary text-sm font-medium text-primary-900 shadow-sm transition hover:bg-primary-50 hover:shadow-md active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {googleLoading ? <Spinner /> : <GoogleIcon />}
          {googleLoading ? "Redirecting..." : "Continue with Google"}
        </button>
      </div>

      {/* Divider */}
      <div className="mt-6 flex w-full items-center gap-4">
        <div className="flex-1 border-t border-primary-200" />
        <span className="font-secondary text-xs text-primary-400">or continue with email</span>
        <div className="flex-1 border-t border-primary-200" />
      </div>

      <div className="mt-6 w-full overflow-hidden rounded-xl border border-primary-200 bg-white shadow-sm">
        <div className="flex border-b border-primary-200 bg-primary-50">
          <button
            className={`flex-1 py-3 text-center font-secondary text-sm font-medium transition ${
              activeTab === "signin"
                ? "bg-white text-primary-900 shadow-[inset_0_2px_0_0_#18181b]"
                : "text-primary-600 hover:text-primary-900"
            }`}
            onClick={() => { setActiveTab("signin"); setError(""); }}
          >
            Sign In
          </button>
          <button
            className={`flex-1 py-3 text-center font-secondary text-sm font-medium transition ${
              activeTab === "create"
                ? "bg-white text-primary-900 shadow-[inset_0_2px_0_0_#18181b]"
                : "text-primary-600 hover:text-primary-900"
            }`}
            onClick={() => { setActiveTab("create"); setError(""); }}
          >
            Create Account
          </button>
        </div>

        <div className="p-6 sm:p-8">
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 font-secondary text-sm text-red-600 border border-red-200">
              {error}
            </div>
          )}

          {activeTab === "signin" ? (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block font-secondary text-sm font-medium text-primary-900">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="mt-1 w-full rounded-lg border border-primary-200 bg-white px-4 py-2 font-secondary text-primary-900 placeholder:text-primary-400 focus:border-primary-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-secondary text-sm font-medium text-primary-900">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="mt-1 w-full rounded-lg border border-primary-200 bg-white px-4 py-2 font-secondary text-primary-900 placeholder:text-primary-400 focus:border-primary-400 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="mt-6 w-full flex justify-center items-center gap-2 rounded-lg bg-primary-900 py-3 font-secondary font-medium text-white hover:bg-primary-800 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading && <Spinner />}
                {loading ? "Signing in…" : "Sign In"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleCreateAccount} className="space-y-4">
              <div>
                <label className="block font-secondary text-sm font-medium text-primary-900">Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Doe"
                  className="mt-1 w-full rounded-lg border border-primary-200 bg-white px-4 py-2 font-secondary text-primary-900 placeholder:text-primary-400 focus:border-primary-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-secondary text-sm font-medium text-primary-900">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="mt-1 w-full rounded-lg border border-primary-200 bg-white px-4 py-2 font-secondary text-primary-900 placeholder:text-primary-400 focus:border-primary-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-secondary text-sm font-medium text-primary-900">Password</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="mt-1 w-full rounded-lg border border-primary-200 bg-white px-4 py-2 font-secondary text-primary-900 placeholder:text-primary-400 focus:border-primary-400 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="mt-6 w-full flex items-center justify-center gap-2 rounded-lg bg-primary-900 py-3 font-secondary font-medium text-white hover:bg-primary-800 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading && <Spinner />}
                {loading ? "Creating account…" : "Create Account"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
