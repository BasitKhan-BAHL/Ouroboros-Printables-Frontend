import { useState } from "react";
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

export default function Account() {
  const [activeTab, setActiveTab] = useState("signin");
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectParams = searchParams.get("redirect");
  const actionParam = searchParams.get("action");
  const productIdParam = searchParams.get("productId");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleAuthSuccess = () => {
    // Determine where to send them
    if (activeTab === "create") {
      // New users go to subscriptions to pick a plan
      const nextUrl = new URLSearchParams();
      if (redirectParams) nextUrl.set("redirect", redirectParams);
      if (actionParam) nextUrl.set("action", actionParam);
      if (productIdParam) nextUrl.set("productId", productIdParam);
      navigate(`/subscriptions?${nextUrl.toString()}`);
    } else {
      // Existing users just go to their redirect destination or home
      if (actionParam === "add_to_cart" && productIdParam) {
        navigate(`/product?id=${productIdParam}&action=add_to_cart`); // Wait, product route is /shop/category/:categoryId/:productId
        // To handle this cleanly, our product page action can just read redirect to `/shop/.../...` 
        // Let's just use redirectParam which should be the actual pathname.
        navigate(redirectParams || "/");
      } else {
        navigate(redirectParams || "/");
      }
    }
  };

  const handleSignIn = (e) => {
    e.preventDefault();
    login(email, password);
    handleAuthSuccess();
  };

  const handleCreateAccount = (e) => {
    e.preventDefault();
    register(name, email, password);
    handleAuthSuccess();
  };

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center justify-center px-6 py-16 sm:px-8">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 text-primary-900">
        <UserIcon />
      </div>
      <h1 className="mt-6 font-primary text-3xl font-bold text-primary-900">Your Account</h1>
      <p className="mt-2 text-center font-secondary text-primary-600">
        Sign in or create an account to manage licenses and subscriptions
      </p>

      <div className="mt-10 w-full overflow-hidden rounded-xl border border-primary-200 bg-white shadow-sm">
        <div className="flex border-b border-primary-200 bg-primary-50">
          <button
            className={`flex-1 py-3 text-center font-secondary text-sm font-medium transition ${
              activeTab === "signin"
                ? "bg-white text-primary-900 shadow-[inset_0_2px_0_0_#18181b]"
                : "text-primary-600 hover:text-primary-900"
            }`}
            onClick={() => setActiveTab("signin")}
          >
            Sign In
          </button>
          <button
            className={`flex-1 py-3 text-center font-secondary text-sm font-medium transition ${
              activeTab === "create"
                ? "bg-white text-primary-900 shadow-[inset_0_2px_0_0_#18181b]"
                : "text-primary-600 hover:text-primary-900"
            }`}
            onClick={() => setActiveTab("create")}
          >
            Create Account
          </button>
        </div>

        <div className="p-6 sm:p-8">
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
                className="mt-6 w-full rounded-lg bg-primary-900 py-3 font-secondary font-medium text-white hover:bg-primary-800"
              >
                Sign In
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="mt-1 w-full rounded-lg border border-primary-200 bg-white px-4 py-2 font-secondary text-primary-900 placeholder:text-primary-400 focus:border-primary-400 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="mt-6 w-full rounded-lg bg-primary-900 py-3 font-secondary font-medium text-white hover:bg-primary-800"
              >
                Create Account
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
