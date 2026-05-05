import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
// import { initializePaddle } from "@paddle/paddle-js";
import { useCart } from "../context/cart";
import { useSettings } from "../context/settings";
import { useAuth } from "../context/auth";
import { getLicenses, formatPrice } from "../catalog";

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
  // const [paddle, setPaddle] = useState(null);
  const [lemonLoaded, setLemonLoaded] = useState(false);
  const [licenses, setLicenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLicenses = async () => {
      try {
        const data = await getLicenses();
        setLicenses(data);
        if (!selectedLicense && data.length > 0) {
          setSelectedLicense(data[0]._id);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load licenses. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchLicenses();
  }, []);

  useEffect(() => {
    // Check if LemonSqueezy is already loaded (it's handled globally in root.jsx)
    if (window.LemonSqueezy) {
      setLemonLoaded(true);
    } else {
      const timer = setInterval(() => {
        if (window.LemonSqueezy) {
          setLemonLoaded(true);
          clearInterval(timer);
        }
      }, 500);
      return () => clearInterval(timer);
    }
  }, []);

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
        body: JSON.stringify({ licenseType: selectedLicense, customerEmail: user?.email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to start license checkout");

      if (!window.LemonSqueezy || !data.checkoutUrl) {
        throw new Error("LemonSqueezy is not ready. Please try again in a moment.");
      }

      // Optimistically update UI
      applyLocalLicense(selectedLicense);
      
      // ── Open LemonSqueezy overlay (Robust Method) ─────────────────────────
      if (window.LemonSqueezy && data.checkoutUrl) {
        const checkoutLink = document.createElement("a");
        checkoutLink.href = data.checkoutUrl;
        checkoutLink.className = "lemonsqueezy-button";
        checkoutLink.style.display = "none";
        document.body.appendChild(checkoutLink);
        
        if (window.createLemonSqueezy) {
          window.createLemonSqueezy();
        }
        
        checkoutLink.click();
        document.body.removeChild(checkoutLink);
      } else if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }

      /*
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
      */
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
            const isSelected = selectedLicense === license._id;
            return (
              <div
                key={license._id}
                onClick={() => setSelectedLicense(license._id)}
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
                    <p className="font-secondary text-sm text-primary-600">{license.description}</p>
                  </div>
                </div>

                <div className="mt-6 flex items-baseline gap-1">
                  <span className="font-primary text-3xl font-bold text-primary-900">{formatPrice(license.price, currency)}</span>
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
