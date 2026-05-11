import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
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
  const [lemonLoaded, setLemonLoaded] = useState(false);
  const [licenses, setLicenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [isActivating, setIsActivating] = useState(false);

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
    // Check for success query param
    if (searchParams.get("success") === "true") {
      setSuccess(true);
      setIsActivating(true);
      
      // Poll for user update
      const pollInterval = setInterval(async () => {
        try {
          const updatedUser = await refreshUser();
          if (updatedUser?.license && updatedUser.license !== "free") {
            setSuccess(false);
            setIsActivating(false);
            clearInterval(pollInterval);
            
            // Redirect if we have a redirect param
            if (redirectParams) {
              navigate(redirectParams);
            } else {
              navigate("/profile");
            }
          }
        } catch (err) {
          console.error("Polling error:", err);
        }
      }, 3000);

      // Stop polling after 30 seconds to avoid infinite loops
      const timeout = setTimeout(() => {
        clearInterval(pollInterval);
        setIsActivating(false);
      }, 30000);

      return () => {
        clearInterval(pollInterval);
        clearTimeout(timeout);
      };
    }
  }, [searchParams, refreshUser]);

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

  useEffect(() => {
    const handlePaymentSuccess = () => {
      // Payment was successful, now we can confidently update the UI.
      // Wait a moment for webhooks to process on the backend, then refresh user.
      applyLocalLicense(selectedLicense);
      setSuccess(true);
      setIsActivating(true);
      
      setTimeout(() => {
        refreshUser().finally(() => {
          setIsActivating(false);
          // If we are in the overlay, it might still be open. 
          // Redirecting or refreshing state will happen.
        });
      }, 2000);
    };

    window.addEventListener("lemon-squeezy-success", handlePaymentSuccess);
    return () => window.removeEventListener("lemon-squeezy-success", handlePaymentSuccess);
  }, [selectedLicense, applyLocalLicense, refreshUser]);

  const handleSimulateSuccess = async () => {
    try {
      setIsProcessing(true);
      const { updateLicense } = useAuth(); // We need to get this from context inside the component
      // Actually useAuth is already available in the component scope
    } catch (err) {}
  };

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
        body: JSON.stringify({ 
          licenseType: selectedLicense, 
          customerEmail: user?.email,
          redirect: redirectParams 
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to start license checkout");

      if (!window.LemonSqueezy || !data.checkoutUrl) {
        throw new Error("LemonSqueezy is not ready. Please try again in a moment.");
      }

      // We should NOT optimistically update the UI here. 
      // The UI should only update when the payment is actually successful.
      
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
          Current license: <span className="font-semibold capitalize">{user.license === "free" ? "Free" : `${user.license} License`}</span>
        </p>
      )}

      <div className="mt-16">
        <div className="flex items-center gap-2">
          <CrownIcon />
          <h2 className="font-primary text-2xl font-bold text-primary-900">Choose Your License</h2>
        </div>
        
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {isLoading ? (
            // Skeleton Loader
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex flex-col rounded-xl border border-primary-100 p-6 bg-white shadow-sm">
                <div className="flex gap-3">
                  <div className="mt-1 h-4 w-4 shrink-0 rounded-full bg-slate-200 animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-5 w-3/4 rounded bg-slate-200 animate-pulse" />
                    <div className="h-4 w-full rounded bg-slate-200 animate-pulse" />
                  </div>
                </div>
                <div className="mt-6 h-8 w-1/3 rounded bg-slate-200 animate-pulse" />
                <div className="mt-6 space-y-3 flex-1">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <div key={j} className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded bg-slate-200 animate-pulse" />
                      <div className="h-3 w-full rounded bg-slate-200 animate-pulse" />
                    </div>
                  ))}
                </div>
                <div className="mt-8 h-10 w-full rounded-lg bg-slate-200 animate-pulse" />
              </div>
            ))
          ) : (
            <>
              {error && (
                <div className="md:col-span-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 font-secondary text-sm text-red-700">
                  {error}
                </div>
              )}
              {isActivating && (
                <div className="md:col-span-3 rounded-lg border border-primary-200 bg-primary-50 px-4 py-6 font-secondary text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-200 border-t-primary-900" />
                    <p className="text-primary-900 font-bold">Activating your license...</p>
                    <p className="text-sm text-primary-600">Please wait while we confirm your payment. This usually takes a few seconds.</p>
                    
                    {import.meta.env.DEV && (
                      <button
                        onClick={async () => {
                          try {
                            const { useAuth } = await import("../context/auth");
                            // We already have access to the auth context via the useAuth hook at the top
                          } catch (e) {}
                          
                          // Manual bypass for local testing
                          const token = window.localStorage.getItem("token");
                          const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
                          await fetch(`${apiUrl}/users/me`, {
                            method: "PATCH",
                            headers: {
                              "Content-Type": "application/json",
                              Authorization: `Bearer ${token}`,
                            },
                            body: JSON.stringify({ license: selectedLicense }),
                          });
                          await refreshUser();
                          setIsActivating(false);
                          setSuccess(false);
                        }}
                        className="mt-4 rounded bg-amber-100 px-3 py-1.5 text-xs font-bold text-amber-800 hover:bg-amber-200"
                      >
                        DEBUG: Simulate Webhook Success
                      </button>
                    )}
                  </div>
                </div>
              )}
              {!isActivating && licenses.map((license) => {
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
            </>
          )}
        </div>
      </div>

      <div className="mt-16 flex justify-center">
        <button
          onClick={handleContinue}
          disabled={isProcessing || isActivating}
          className="rounded-lg bg-primary-900 px-8 py-3 font-secondary font-medium text-white transition hover:bg-primary-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? "Starting checkout..." : isActivating ? "Activating..." : "Buy License and Continue"}
        </button>
      </div>
    </div>
  );
}
