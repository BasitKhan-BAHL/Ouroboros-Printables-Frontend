import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useAuth } from "../context/auth";
import { useCart } from "../context/cart";

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
  const { user, updateLicense } = useAuth();
  const [selectedLicense, setSelectedLicense] = useState(user?.license || "free");
  const { addItem } = useCart();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectParams = searchParams.get("redirect");
  const actionParam = searchParams.get("action");
  const productIdParam = searchParams.get("productId");

  const licenses = [
    {
      id: "free",
      title: "Free License",
      desc: "For personal, non-commercial use only",
      price: "Free",
      features: ["Use on personal projects", "No commercial use", "Single user access", "Basic support"],
    },
    {
      id: "commercial",
      title: "Commercial License",
      desc: "For business and commercial projects",
      price: "£29",
      period: "one-time",
      features: ["Use on commercial projects", "Client work allowed", "Up to 5 team members", "Priority support", "Extended file formats"],
    },
    {
      id: "enterprise",
      title: "Enterprise License",
      desc: "For large teams and organizations",
      price: "£99",
      period: "one-time",
      features: ["Unlimited commercial use", "Unlimited team members", "White-label rights", "Dedicated support", "Custom file formats", "API access"],
    },
  ];

  const handleContinue = async () => {
    try {
      await updateLicense(selectedLicense);
      
      if (actionParam === "add_to_cart" && productIdParam) {
        addItem(productIdParam);
        navigate("/cart");
      } else {
        navigate(redirectParams || "/profile");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update license.");
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-16 sm:px-8">
      <div className="text-center">
        <h1 className="font-primary text-3xl font-bold text-primary-900">Your Account</h1>
        <p className="mt-2 font-secondary text-primary-600">Manage your licenses</p>
      </div>

      <div className="mt-16">
        <div className="flex items-center gap-2">
          <CrownIcon />
          <h2 className="font-primary text-2xl font-bold text-primary-900">Choose Your License</h2>
        </div>
        
        <div className="mt-6 grid gap-6 md:grid-cols-3">
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
          className="rounded-lg bg-primary-900 px-8 py-3 font-secondary font-medium text-white transition hover:bg-primary-800"
        >
          Confirm and Continue
        </button>
      </div>
    </div>
  );
}
