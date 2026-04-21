import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/auth";
import { useCart } from "../context/cart";
import { useSettings } from "../context/settings";
import { formatPrice } from "../catalog";

export function meta() {
  return [
    { title: "Your Profile – Ouroboros Printables" },
    { name: "description", content: "Manage your account, licenses and order history." },
  ];
}

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// ─── Icons ────────────────────────────────────────────────────────────────────
function UserIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function ChevronIcon({ open }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function ReceiptIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

function StatusBadge({ status }) {
  const map = {
    completed: "bg-green-100 text-green-800 border-green-200",
    paid: "bg-green-100 text-green-800 border-green-200",
    processing: "bg-blue-100 text-blue-800 border-blue-200",
    pending: "bg-blue-100 text-blue-800 border-blue-200",
    failed: "bg-red-100 text-red-800 border-red-200",
    refunded: "bg-gray-100 text-gray-600 border-gray-200",
  };
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-secondary text-xs font-semibold capitalize ${map[status] || map.processing}`}>
      {status === "pending" ? "processing" : status}
    </span>
  );
}

function getAvatarColor(name = "") {
  const colors = [
    "bg-blue-500", "bg-purple-500", "bg-pink-500", "bg-indigo-500", 
    "bg-teal-500", "bg-emerald-500", "bg-rose-500", "bg-amber-500"
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

function ProfileAvatar({ user }) {
  const [imageFailed, setImageFailed] = useState(false);
  const googleFallbackUrl =
    typeof user.email === "string" && user.email.trim()
      ? `https://www.google.com/s2/photos?sz=256&email=${encodeURIComponent(
          user.email.trim()
        )}`
      : "";
  const avatarCandidates = [
    typeof user.avatar === "string" ? user.avatar.trim() : "",
    googleFallbackUrl,
  ].filter(Boolean);
  const [avatarIndex, setAvatarIndex] = useState(0);
  const activeAvatar = imageFailed ? "" : avatarCandidates[avatarIndex] || "";
  const showImage = !!activeAvatar;

  useEffect(() => {
    setImageFailed(false);
    setAvatarIndex(0);
  }, [user.avatar, user.email]);

  return (
    <div
      className={`flex h-16 w-16 sm:h-20 sm:w-20 shrink-0 items-center justify-center rounded-full text-white shadow-sm overflow-hidden ${
        showImage ? "bg-primary-200" : getAvatarColor(user.name)
      }`}
    >
      {showImage ? (
        <img
          src={activeAvatar}
          alt={user.name}
          className="h-16 w-16 sm:h-20 sm:w-20 rounded-full object-cover"
          onError={() => {
            const nextIndex = avatarIndex + 1;
            if (nextIndex < avatarCandidates.length) {
              setAvatarIndex(nextIndex);
              return;
            }
            setImageFailed(true);
          }}
        />
      ) : (
        <span className="font-primary text-2xl sm:text-3xl font-bold uppercase">
          {user.name?.[0] || "?"}
        </span>
      )}
    </div>
  );
}

// ─── Order Row ────────────────────────────────────────────────────────────────
function OrderRow({ order }) {
  const { currency } = useSettings();
  const [open, setOpen] = useState(false);
  const shortId = order._id?.toString().slice(-8).toUpperCase();

  return (
    <div className="rounded-xl border border-primary-100 bg-white overflow-hidden shadow-sm transition hover:border-primary-200">
      {/* Summary row */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-primary-50 transition"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-secondary text-sm font-semibold text-primary-900">#{shortId}</span>
            <StatusBadge status={order.orderStatus} />
          </div>
          <p className="mt-0.5 font-secondary text-xs text-primary-500">{formatDate(order.createdAt)}</p>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <span className="font-primary font-bold text-primary-900">{formatPrice(order.total, currency)}</span>
          <ChevronIcon open={open} />
        </div>
      </button>

      {/* Expanded items */}
      {open && (
        <div className="border-t border-primary-100 bg-primary-50 px-5 py-4">
          <table className="w-full mb-4">
            <thead>
              <tr className="border-b border-primary-200">
                <th className="pb-2 text-left font-secondary text-xs uppercase tracking-wide text-primary-400">Item</th>
                <th className="pb-2 text-center font-secondary text-xs uppercase tracking-wide text-primary-400">Qty</th>
                <th className="pb-2 text-right font-secondary text-xs uppercase tracking-wide text-primary-400">Price</th>
              </tr>
            </thead>
            <tbody>
              {order.items?.map((item, i) => (
                <tr key={i} className="border-b border-primary-100 last:border-0">
                  <td className="py-2 font-secondary text-sm text-primary-900">{item.title}</td>
                  <td className="py-2 text-center font-secondary text-sm text-primary-600">{item.quantity}</td>
                  <td className="py-2 text-right font-secondary text-sm text-primary-600">{formatPrice(item.price * item.quantity, currency)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-end">
            <Link
              to={`/receipt?orderId=${order._id}`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-primary-200 bg-white px-4 py-2 font-secondary text-xs font-medium text-primary-900 shadow-sm hover:bg-primary-100 transition"
            >
              <ReceiptIcon />
              View / Download Receipt
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Order History Section ────────────────────────────────────────────────────
function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      const token = window.localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await fetch(`${API_BASE}/orders/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to load orders");
        setOrders(data.orders);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 text-primary-400">
        <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 font-secondary text-sm text-red-600">
        {error}
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="rounded-xl border border-dashed border-primary-200 bg-white px-8 py-12 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary-100 text-primary-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
        </div>
        <p className="mt-4 font-secondary text-sm text-primary-500">No orders yet.</p>
        <Link to="/shop" className="mt-4 inline-block rounded-lg bg-primary-900 px-5 py-2 font-secondary text-sm font-medium text-white hover:bg-primary-800 transition">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-h-[520px] overflow-y-auto pr-1 space-y-3 custom-scrollbar">
      {orders.map((order) => (
        <OrderRow key={order._id} order={order} />
      ))}
    </div>
  );
}

// ─── Main Profile Component ───────────────────────────────────────────────────
export default function Profile() {
  const { user, logout, isInitializing } = useAuth();
  const { clear } = useCart();
  const navigate = useNavigate();
  const isLoggingOut = useRef(false);

  if (isInitializing) {
    return <div className="p-8 text-center text-primary-500">Loading...</div>;
  }

  if (!user) {
    if (!isLoggingOut.current) navigate("/account?redirect=/profile");
    return null;
  }

  const handleLogout = () => {
    isLoggingOut.current = true;
    logout();
    clear();
    navigate("/");
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-16 sm:px-8">
      {/* Header */}
      <div className="flex items-center gap-4 sm:gap-6">
        <ProfileAvatar user={user} />
        <div className="min-w-0">
          <h1 className="font-primary text-2xl sm:text-3xl font-bold text-primary-900 truncate">Welcome, {user.name}</h1>
          <p className="font-secondary text-sm sm:text-base text-primary-600 truncate">{user.email}</p>
          {user.isVerified === false && (
            <span className="mt-1 inline-flex items-center rounded-full bg-amber-100 border border-amber-200 px-2.5 py-0.5 font-secondary text-xs text-amber-700">
              Email not verified
            </span>
          )}
        </div>
      </div>

      {/* Subscription + Settings cards */}
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-primary-200 bg-white p-6 shadow-sm">
          <h2 className="font-primary text-xl font-bold text-primary-900">Active Subscription</h2>
          <div className="mt-4">
            <p className="font-secondary text-sm text-primary-500">Current License</p>
            <p className="font-primary font-medium text-primary-900 capitalize">{user.license}</p>
            <div className="mt-6">
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
          <div className="mt-4">
            <button
              id="btn-logout"
              onClick={handleLogout}
              className="w-full rounded-lg border border-primary-200 bg-white px-4 py-3 text-left font-secondary font-medium text-primary-900 transition hover:bg-red-50 hover:border-red-200 hover:text-red-700"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* ── Order History ── */}
      <div className="mt-12">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-primary text-2xl font-bold text-primary-900">Order History</h2>
          <Link to="/shop" className="font-secondary text-sm text-primary-600 hover:text-primary-900 transition underline underline-offset-2">
            Shop more →
          </Link>
        </div>
        <OrderHistory />
      </div>
    </div>
  );
}
