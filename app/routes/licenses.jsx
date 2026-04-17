import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { initializePaddle } from "@paddle/paddle-js";
import { useCart } from "../context/cart";
import { useSettings } from "../context/settings";
import { useAuth } from "../context/auth";
import { formatPrice } from "../catalog";

export function meta() {
  return [
    { title: "Manage Licenses – Ouroboros Printables" },
    { name: "description", content: "Choose your license." },
  ];
}

function CrownIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-primary-900">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export default function Licenses() {
  const { currency } = useSettings();
  const { user, refreshUser, applyLocalLicense } = useAuth();
  const [selectedLicense, setSelectedLicense] = useState(
    user?.license === "enterprise" ? "enterprise" : "commercial",
  );
  const { addItem } = useCart();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectParams = searchParams.get("redirect");
  const actionParam = searchParams.get("action");
  const productIdParam = searchParams.get("productId");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [paddle, setPaddle] = useState(null);

  const licenses = [
    {
      id: "commercial",
      title: "Commercial License",
      desc: "For business and commercial projects",
      price: formatPrice(29, currency),
      period: "one-time",
      features: ["Use on commercial projects", "Client work allowed", "Up to 5 team members", "Priority support", "Extended file formats"],
    },
    {
      id: "enterprise",
      title: "Enterprise License",
      desc: "For large teams and organizations",
      price: formatPrice(99, currency),
      period: "one-time",
      features: ["Unlimited commercial use", "Unlimited team members", "White-label rights", "Dedicated support", "Custom file formats", "API access"],
    },
  ];

  useEffect(() => {
    const initPaddle = async () => {
      const token = import.meta.env.VITE_PADDLE_CLIENT_TOKEN;
      if (!token || token === "your_paddle_client_token_here") return;
      try {
        const paddleInstance = await initializePaddle({
          environment:
            import.meta.env.VITE_PADDLE_ENVIRONMENT === "sandbox"
              ? "sandbox"
              : "production",
          token,
          eventCallback: async (data) => {
            if (data.name === "checkout.completed") {
              const token = window.localStorage.getItem("token");
              const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
              const transactionId =
                data?.data?.transaction_id ||
                data?.data?.transactionId ||
                data?.id ||
                null;

              // Optimistic update first for responsive UX.
              applyLocalLicense(selectedLicense);
              try {
                if (token && transactionId) {
                  const confirmRes = await fetch(`${apiUrl}/orders/license/confirm`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ transactionId, licenseType: selectedLicense }),
                  });
                  if (!confirmRes.ok) {
                    const confirmData = await confirmRes.json();
                    throw new Error(confirmData.message || "Failed to confirm license purchase");
                  }
                }
                await refreshUser();
              } catch {
                // Keep optimistic state if DB sync is delayed.
              }
              if (actionParam === "add_to_cart" && productIdParam) {
                addItem(productIdParam);
                navigate("/cart");
                return;
              }
              navigate(redirectParams || "/profile");
            }
          },
        });
        setPaddle(paddleInstance);
      } catch (err) {
        console.error("Paddle initialization error:", err);
      }
    };
    initPaddle();
  }, [actionParam, addItem, applyLocalLicense, navigate, productIdParam, redirectParams, refreshUser, selectedLicense]);

  const handleContinue = async () => {
    try {
      setIsProcessing(true);
      setError("");
      const token = window.localStorage.getItem("token");
      if (!token) throw new Error("Please sign in first.");
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
      const res = await fetch(`${apiUrl}/orders/license`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ licenseType: selectedLicense }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to start license checkout");

      if (!paddle || !data.transactionId) {
        throw new Error("Paddle is not ready. Please try again in a moment.");
      }

      paddle.Checkout.open({
        transactionId: data.transactionId,
        settings: {
          displayMode: "overlay",
          theme: "light",
          locale: "en",
          showAddDiscounts: false,
          showAddTaxId: false,
        },
      });
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to start license checkout.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-16 sm:px-8">
      <div className="text-center">
        <h1 className="font-primary text-3xl font-bold text-primary-900">Your Account</h1>
        <p className="mt-2 font-secondary text-primary-600">Manage your licenses</p>
      </div>
      {user?.license && (
        <p className="mt-4 text-center font-secondary text-sm text-primary-700">
          Current license: <span className="font-semibold capitalize">{user.license}</span>
        </p>
      )}

      <div className="mt-16">
        <div className="flex items-center gap-2">
          <CrownIcon />
          <h2 className="font-primary text-2xl font-bold text-primary-900">Choose Your License</h2>
        </div>
        
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {error && (
            <div className="md:col-span-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 font-secondary text-sm text-red-700">
              {error}
            </div>
          )}
          {licenses.map((license) => {
            const isSelected = selectedLicense === license.id;
            return (
              <div
                key={license.id}
                onClick={() => setSelectedLicense(license.id)}
                className={`relative flex cursor-pointer flex-col rounded-xl border p-6 transition ${
                  isSelected ? "border-2 border-primary-900" : "border-primary-200 hover:border-primary-400"
                } bg-white`}
              >
                <div className="flex gap-3">
                  <div className={`mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${isSelected ? "border-primary-900" : "border-primary-400"}`}>
                    {isSelected && <div className="h-2 w-2 rounded-full bg-primary-900" />}
                  </div>
                  <div>
                    <h3 className="font-primary text-lg font-bold text-primary-900">{license.title}</h3>
                    <p className="font-secondary text-sm text-primary-600">{license.desc}</p>
                  </div>
                </div>

                <div className="mt-6 flex items-baseline gap-1">
                  <span className="font-primary text-3xl font-bold text-primary-900">{license.price}</span>
                  {license.period && <span className="font-secondary text-sm text-primary-600">{license.period}</span>}
                </div>

                <ul className="mb-8 mt-6 flex-1 space-y-3 font-secondary text-sm text-primary-700">
                  {license.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckIcon />
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  className={`mt-auto w-full rounded-lg py-2.5 font-secondary text-sm font-medium transition ${
                    isSelected
                      ? "bg-primary-900 text-white"
                      : "border border-primary-200 bg-white text-primary-900 hover:bg-primary-50"
                  }`}
                >
                  {isSelected ? "Selected" : "Select"}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-16 flex justify-center">
        <button
          onClick={handleContinue}
          disabled={isProcessing}
          className="rounded-lg bg-primary-900 px-8 py-3 font-secondary font-medium text-white transition hover:bg-primary-800"
        >
          {isProcessing ? "Starting checkout..." : "Buy License and Continue"}
        </button>
      </div>
    </div>
  );
}
