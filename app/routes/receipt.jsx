import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { useAuth } from "../context/auth";
import { useSettings } from "../context/settings";
import { formatPrice } from "../catalog";

export function meta() {
  return [
    { title: "Order Receipt – Ouroboros Printables" },
    { name: "description", content: "Your order receipt and confirmation." },
  ];
}

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit", month: "long", year: "numeric",
  });
}

function StatusBadge({ status }) {
  const map = {
    paid: "bg-green-100 text-green-800 border-green-200",
    pending: "bg-blue-100 text-blue-800 border-blue-200",
    failed: "bg-red-100 text-red-800 border-red-200",
    refunded: "bg-gray-100 text-gray-600 border-gray-200",
  };

  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 font-secondary text-xs font-semibold capitalize ${map[status] || map.pending}`}>
      {status}
    </span>
  );
}

export default function Receipt() {
  const { currency } = useSettings();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const printRef = useRef(null);

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      // 1️⃣  Try session storage first (just paid — instant data)
      if (!orderId) {
        const cached = sessionStorage.getItem("lastOrder");
        if (cached) {
          try {
            setOrder(JSON.parse(cached));
            setLoading(false);
            return;
          } catch { /* ignore */ }
        }
      }

      // 2️⃣  Fetch from API (viewing historical order)
      if (!user) {
        navigate("/account?redirect=/receipt" + (orderId ? `?orderId=${orderId}` : ""));
        return;
      }
      const token = window.localStorage.getItem("token");
      if (!token || !orderId) {
        setError("No order found. Please check your order history in your profile.");
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`${API_BASE}/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Order not found");
        setOrder(data.order);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [orderId, user]);

  const handlePrint = () => window.print();

  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <svg className="animate-spin h-8 w-8 text-primary-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="mx-auto max-w-xl px-6 py-20 text-center">
        <p className="font-secondary text-red-600">{error || "Order not found."}</p>
        <Link to="/profile" className="mt-6 inline-block rounded-lg bg-primary-900 px-6 py-2.5 font-secondary text-sm text-white hover:bg-primary-800">
          Back to Profile
        </Link>
      </div>
    );
  }

  const shortId = order._id?.toString().slice(-8).toUpperCase();

  return (
    <>
      {/* ── Print styles ── */}
      <style>{`
        @page {
          margin: 0mm;
          size: auto;
        }
        @media print {
          /* General resets to force single page */
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            height: 100% !important;
            width: 100% !important;
            overflow: hidden !important;
            background: #ffffff !important;
          }

          /* Hide global layout elements */
          header, footer, nav, aside, .no-print, [role="banner"], [role="contentinfo"], .notification-banner {
            display: none !important;
          }

          /* Hide all content by default */
          body * {
            visibility: hidden;
          }

          /* Show only the receipt card */
          .receipt-card, .receipt-card * {
            visibility: visible;
          }

          /* Position receipt card perfectly */
          .receipt-card {
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 10mm !important;
            box-shadow: none !important;
            border: none !important;
            border-radius: 0 !important;
            page-break-inside: avoid !important;
            page-break-after: avoid !important;
            page-break-before: avoid !important;
          }

          /* Preserve colors */
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          /* Hide scrollbars */
          ::-webkit-scrollbar {
            display: none;
          }
        }
      `}</style>

      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        {/* ── Top actions (hidden when printing) ── */}
        <div className="no-print mb-6 flex items-center justify-between">
          <Link to="/profile" className="inline-flex items-center gap-1 font-secondary text-sm text-primary-600 hover:text-primary-900 transition">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
            Order History
          </Link>
          <button
            id="btn-download-receipt"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 rounded-lg border border-primary-200 bg-white px-4 py-2 font-secondary text-sm font-medium text-primary-900 shadow-sm transition hover:bg-primary-50 hover:shadow-md active:scale-[0.98]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download PDF
          </button>
        </div>

        {/* ── Receipt Card ── */}
        <div ref={printRef} className="receipt-card overflow-hidden rounded-2xl border border-primary-200 bg-white shadow-lg">
          {/* Header */}
          <div className="bg-primary-900 px-8 py-8 text-center">
            <p className="font-secondary text-xs uppercase tracking-[3px] text-primary-400">Ouroboros Printables</p>
            <h1 className="mt-2 font-primary text-3xl font-bold text-white">Order Confirmed</h1>
            <div className="mx-auto mt-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          {/* Meta Info */}
          <div className="grid grid-cols-2 gap-4 border-b border-primary-100 bg-primary-50 px-8 py-5 sm:grid-cols-4">
            <div>
              <p className="font-secondary text-xs uppercase tracking-wide text-primary-400">Order #</p>
              <p className="mt-0.5 font-secondary font-semibold text-primary-900">{shortId}</p>
            </div>
            <div>
              <p className="font-secondary text-xs uppercase tracking-wide text-primary-400">Date</p>
              <p className="mt-0.5 font-secondary font-semibold text-primary-900">{formatDate(order.createdAt)}</p>
            </div>
            <div>
              <p className="font-secondary text-xs uppercase tracking-wide text-primary-400">Status</p>
              <div className="mt-0.5"><StatusBadge status={order.paymentStatus} /></div>
            </div>
            <div>
              <p className="font-secondary text-xs uppercase tracking-wide text-primary-400">Email</p>
              <p className="mt-0.5 truncate font-secondary font-semibold text-primary-900">{order.customerEmail}</p>
            </div>
          </div>

          {/* Items table */}
          <div className="px-8 py-6">
            <h2 className="font-primary text-lg font-semibold text-primary-900 mb-4">Items</h2>
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-primary-900">
                  <th className="pb-2 text-left font-secondary text-xs uppercase tracking-wide text-primary-500">Product</th>
                  <th className="pb-2 text-center font-secondary text-xs uppercase tracking-wide text-primary-500">Qty</th>
                  <th className="pb-2 text-right font-secondary text-xs uppercase tracking-wide text-primary-500">Unit Price</th>
                  <th className="pb-2 text-right font-secondary text-xs uppercase tracking-wide text-primary-500">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, i) => (
                  <tr key={i} className="border-b border-primary-100">
                    <td className="py-3 font-secondary text-sm text-primary-900">{item.title}</td>
                    <td className="py-3 text-center font-secondary text-sm text-primary-700">{item.quantity}</td>
                    <td className="py-3 text-right font-secondary text-sm text-primary-700">{formatPrice(item.price, currency)}</td>
                    <td className="py-3 text-right font-secondary text-sm font-semibold text-primary-900">
                      {formatPrice(item.price * item.quantity, currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="3" className="pt-4 text-right font-primary text-lg font-bold text-primary-900">Total</td>
                  <td className="pt-4 text-right font-primary text-lg font-bold text-primary-900">{formatPrice(order.total, currency)}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Footer */}
          <div className="border-t border-primary-100 px-8 py-5 text-center">
            <p className="font-secondary text-sm text-primary-600">
              Thank you for your purchase,{" "}
              <strong className="text-primary-900">{order.customerName}</strong>!
              Your downloads have been sent to <strong>{order.customerEmail}</strong>.
            </p>
            <div className="no-print mt-4 flex justify-center gap-4">
              <Link to="/shop" className="rounded-lg bg-primary-900 px-5 py-2 font-secondary text-sm font-medium text-white hover:bg-primary-800 transition">
                Continue Shopping
              </Link>
              <Link to="/profile" className="rounded-lg border border-primary-200 px-5 py-2 font-secondary text-sm font-medium text-primary-900 hover:bg-primary-50 transition">
                My Orders
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
