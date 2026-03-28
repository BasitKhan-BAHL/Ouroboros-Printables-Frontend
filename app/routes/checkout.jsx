import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { initializePaddle } from "@paddle/paddle-js";
import { getCategoryImage } from "../catalog";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

export function meta() {
  return [
    { title: "Checkout – Ouroboros Printables" },
    { name: "description", content: "Complete your purchase." },
  ];
}

function LockIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

export default function Checkout() {
  const { items, subtotalFormatted, totalFormatted, totalQuantity, clear } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [error, setError] = useState("");
  const [paddle, setPaddle] = useState(null);

  useEffect(() => {
    const initPaddle = async () => {
      if (import.meta.env.VITE_PADDLE_CLIENT_TOKEN) {
        try {
          const paddleInstance = await initializePaddle({
            environment: import.meta.env.VITE_PADDLE_ENVIRONMENT === 'sandbox' ? 'sandbox' : 'production',
            token: import.meta.env.VITE_PADDLE_CLIENT_TOKEN,
            eventCallback: function(data) {
              if (data.name === "checkout.completed") {
                clear();
                setOrderSuccess(true);
              }
            }
          });
          setPaddle(paddleInstance);
        } catch (err) {
          console.error("Paddle initialization error:", err);
        }
      }
    };
    initPaddle();
  }, []);

  const handlePay = async () => {
    setIsProcessing(true);
    setError("");
    try {
      const token = window.localStorage.getItem("token");
      if (!token) throw new Error("Authentication required. Please log in first.");

      const orderItems = items.map(item => ({
        productId: item.productId,
        quantity: item.quantity
      }));

      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
      const res = await fetch(`${apiUrl}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          items: orderItems,
          customerEmail: user?.email,
          customerName: user?.name,
          phone: phone
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to place order");
      }

      // If Paddle is fully configured, pop the secure overlay
      if (data.transactionId && paddle) {
        paddle.Checkout.open({
          transactionId: data.transactionId,
          settings: {
            displayMode: "overlay",
            theme: "light"
          }
        });
      } else {
        // Fallback for mock sandbox flow when keys are deactivated
        clear();
        setOrderSuccess(true);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!items.length) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16 text-center sm:px-8">
        <h1 className="font-primary text-2xl font-bold text-primary-900">Your cart is empty</h1>
        <p className="mt-2 font-secondary text-primary-600">
          Add some products to your cart before checking out.
        </p>
        <Link
          to="/shop"
          className="mt-6 inline-block rounded-lg bg-primary-900 px-8 py-3 font-secondary font-medium text-white hover:bg-primary-800"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-8 sm:px-8">
      <Link to="/cart" className="mb-6 inline-flex items-center gap-1 font-secondary text-primary-600 hover:text-primary-900">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Back to Cart
      </Link>
      <h1 className="font-primary text-2xl font-bold text-primary-900">Checkout</h1>
      <div className="mt-8 flex flex-col gap-6 lg:grid lg:grid-cols-3 lg:gap-8">
        <div className="order-1 lg:col-span-2 lg:col-start-1 lg:row-start-1">
          <div className="rounded-xl border border-primary-200 bg-white p-6 shadow-sm">
            <h2 className="font-primary text-lg font-semibold text-primary-900">Your Details</h2>
            <div className="mt-4 space-y-4">
              <div>
                <label htmlFor="email" className="block font-secondary text-sm font-medium text-primary-900">Email Address</label>
                <input
                  id="email"
                  type="email"
                  readOnly
                  value={user?.email || ""}
                  className="mt-1 w-full rounded-lg border border-primary-200 bg-primary-100 px-4 py-2 font-secondary text-primary-900 text-opacity-70 cursor-not-allowed focus:outline-none"
                />
                <p className="mt-1 font-secondary text-xs text-primary-500">Your download links will be sent here</p>
              </div>
              <div>
                <label htmlFor="name" className="block font-secondary text-sm font-medium text-primary-900">Full Name</label>
                <input
                  id="name"
                  type="text"
                  readOnly
                  value={user?.name || ""}
                  className="mt-1 w-full rounded-lg border border-primary-200 bg-primary-100 px-4 py-2 font-secondary text-primary-900 text-opacity-70 cursor-not-allowed focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block font-secondary text-sm font-medium text-primary-900 mb-1">Phone Number (Optional)</label>
                <PhoneInput
                  id="phone"
                  international
                  defaultCountry="US"
                  value={phone}
                  onChange={setPhone}
                  className="w-full rounded-lg border border-primary-200 bg-white px-4 py-2 font-secondary text-primary-900 focus-within:border-primary-400 [&_.PhoneInputInput]:rounded-md [&_.PhoneInputInput]:border-none [&_.PhoneInputInput]:pl-2 [&_.PhoneInputInput]:focus:outline-none [&_.PhoneInputInput]:focus:ring-0"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="order-3 lg:col-span-2 lg:col-start-1 lg:row-start-2">
          <div className="rounded-xl border border-primary-200 bg-white p-6 shadow-sm">
            <h2 className="font-primary text-lg font-semibold text-primary-900">Payment</h2>
            {orderSuccess ? (
              <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-6 text-center shadow-inner">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-green-900 mb-2">Order Confirmed!</h3>
                <p className="font-secondary text-sm text-green-700 mb-6 font-medium">Your receipt and downloads have been sent to {user?.email}.</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    to="/"
                    className="rounded-lg bg-green-700 px-6 py-2.5 font-secondary text-sm font-medium text-white shadow-sm hover:bg-green-800 transition text-center"
                  >
                    Continue Shopping
                  </Link>
                  <Link
                    to="/profile"
                    className="rounded-lg border border-green-700 bg-green-50 px-6 py-2.5 font-secondary text-sm font-medium text-green-800 shadow-sm hover:bg-green-100 transition text-center"
                  >
                    View My Orders
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <div className="mt-4 rounded-lg border border-secondary-200 bg-secondary-50 p-4 font-secondary text-sm text-secondary-700 text-center">
                  Payment integration requires backend setup. For now, click <span className="font-bold">Pay</span> to simulate a purchase.
                </div>
                {error && (
                  <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-200 font-medium">
                    {error}
                  </div>
                )}
                <button
                  type="button"
                  onClick={handlePay}
                  disabled={isProcessing}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-primary-900 py-3.5 font-secondary text-lg font-bold text-white shadow hover:bg-primary-800 disabled:opacity-60 disabled:cursor-not-allowed transition"
                >
                  {isProcessing ? (
                    <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                      <line x1="1" y1="10" x2="23" y2="10" />
                    </svg>
                  )}
                  {isProcessing ? "Processing..." : `Pay £${totalFormatted}`}
                </button>
              </>
            )}
          </div>
        </div>
        <div className="order-2 lg:col-span-1 lg:col-start-3 lg:row-span-2 lg:row-start-1">
          <div className="rounded-xl border border-primary-200 bg-white p-6 shadow-sm">
            <h2 className="font-primary text-lg font-semibold text-primary-900">Order Summary</h2>
            <div className="mt-4 space-y-4 border-b border-primary-100 pb-4">
              {items.map((item) => (
                <div key={item.productId} className="flex gap-4">
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-secondary-100">
                    <img
                      src={getCategoryImage(item.product.categoryId)}
                      alt={item.product.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-secondary font-medium text-primary-900">{item.product.title}</p>
                    <p className="font-secondary text-sm text-primary-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-secondary font-medium text-primary-900">{item.lineTotalFormatted}</p>
                </div>
              ))}
            </div>
            <div className="space-y-2 border-b border-primary-100 py-4 font-secondary text-primary-900">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{subtotalFormatted}</span>
              </div>
              <div className="flex justify-between text-primary-600">
                <span>Items</span>
                <span>{totalQuantity}</span>
              </div>
            </div>
            <div className="flex justify-between py-4 font-primary font-bold text-primary-900">
              <span>Total</span>
              <span>{totalFormatted}</span>
            </div>
            <p className="flex items-center gap-2 font-secondary text-xs text-primary-500">
              <LockIcon />
              Secure checkout with OTP verification
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
