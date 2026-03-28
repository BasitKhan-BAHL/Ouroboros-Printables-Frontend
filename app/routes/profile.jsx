import { useRef } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/auth";
import { useCart } from "../context/cart";

export function meta() {
  return [
    { title: "Your Profile – Ouroboros Printables" },
    { name: "description", content: "Manage your account and licenses." },
  ];
}

function UserIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

export default function Profile() {
  const { user, logout, removeSubscription, isInitializing } = useAuth();
  const { clear } = useCart();
  const navigate = useNavigate();
  // Track intentional logout so the !user guard below doesn't also fire navigate()
  const isLoggingOut = useRef(false);

  // If initializing, don't redirect yet
  if (isInitializing) {
    return <div className="p-8 text-center text-primary-500">Loading...</div>;
  }

  // If unauthenticated (and not in the middle of signing out), redirect to account
  if (!user) {
    if (!isLoggingOut.current) {
      navigate("/account?redirect=/profile");
    }
    return null;
  }

  const handleLogout = () => {
    isLoggingOut.current = true;
    logout();
    clear();
    navigate("/");
  };

  // Removed handleRemoveSubscription since we only change licenses now.

  return (
    <div className="mx-auto max-w-4xl px-6 py-16 sm:px-8">
      <div className="flex items-center gap-6">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-primary-200 text-primary-900">
          <UserIcon />
        </div>
        <div>
          <h1 className="font-primary text-3xl font-bold text-primary-900">Welcome, {user.name}</h1>
          <p className="font-secondary text-primary-600">{user.email}</p>
        </div>
      </div>

      <div className="mt-12 grid gap-8 md:grid-cols-2">
        <div className="rounded-xl border border-primary-200 bg-white p-6 shadow-sm">
          <h2 className="font-primary text-xl font-bold text-primary-900">Active Subscription</h2>
          <div className="mt-4">
            <p className="font-secondary text-sm text-primary-500">Current License</p>
            <p className="font-primary font-medium text-primary-900 capitalize">{user.license}</p>
            
            <div className="mt-6 flex flex-wrap gap-4">
              <Link
                to="/licenses?redirect=/profile"
                className="rounded-lg bg-primary-900 px-4 py-2 font-secondary text-sm font-medium text-white transition hover:bg-primary-800"
              >
                Update License
              </Link>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-primary-200 bg-white p-6 shadow-sm">
          <h2 className="font-primary text-xl font-bold text-primary-900">Account Settings</h2>
          <div className="mt-4 space-y-4">
            <button
              onClick={handleLogout}
              className="w-full rounded-lg border border-primary-200 bg-white px-4 py-3 text-left font-secondary font-medium text-primary-900 transition hover:bg-primary-50"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
