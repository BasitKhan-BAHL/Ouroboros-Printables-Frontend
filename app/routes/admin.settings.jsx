import { useState } from "react";
import { useSettings } from "../context/settings";
import { updateSettings } from "../catalog";

export default function AdminSettings() {
  const { settings, refreshSettings, updateLocalSettings } = useSettings();
  const [selectedCurrency, setSelectedCurrency] = useState(settings.currency || "€");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const currencies = [
    { code: "EUR", symbol: "€", name: "Euro" },
    { code: "USD", symbol: "$", name: "US Dollar" },
    { code: "PKR", symbol: "Rs", name: "Pakistani Rupee" },
    { code: "GBP", symbol: "£", name: "British Pound" },
    { code: "INR", symbol: "₹", name: "Indian Rupee" },
    { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  ];

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ text: "", type: "" });

    try {
      await updateSettings({ currency: selectedCurrency });
      updateLocalSettings({ currency: selectedCurrency });
      setMessage({ text: "Settings updated successfully!", type: "success" });
    } catch (err) {
      console.error(err);
      setMessage({ text: "Failed to update settings.", type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h2 className="font-primary text-2xl font-bold text-primary-900">Global Settings</h2>
        <p className="mt-1 font-secondary text-primary-600">Configure global store preferences</p>
      </div>

      <div className="rounded-xl border border-primary-100 bg-slate-50 p-6 sm:p-8">
        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label className="mb-2 block font-secondary text-sm font-bold text-primary-900">
              Store Currency Symbol
            </label>
            <p className="mb-4 font-secondary text-sm text-primary-600">
              Select the currency symbol that will be displayed across the entire store. 
              Note: This only changes the symbol, not the numeric price values.
            </p>
            
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {currencies.map((curr) => (
                <label
                  key={curr.code}
                  className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 p-4 transition-all ${
                    selectedCurrency === curr.symbol
                      ? "border-primary-900 bg-primary-50 ring-1 ring-primary-900"
                      : "border-white bg-white hover:border-primary-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="currency"
                    value={curr.symbol}
                    checked={selectedCurrency === curr.symbol}
                    onChange={(e) => setSelectedCurrency(e.target.value)}
                    className="sr-only"
                  />
                  <span className="text-2xl font-bold text-primary-900">{curr.symbol}</span>
                  <span className="mt-1 text-xs font-medium text-primary-500">{curr.name} ({curr.code})</span>
                </label>
              ))}
            </div>
          </div>

          {message.text && (
            <div className={`rounded-lg p-4 text-sm font-medium ${
              message.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
            }`}>
              {message.text}
            </div>
          )}

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-lg bg-primary-900 px-6 py-2.5 font-secondary text-sm font-semibold text-white transition-all hover:bg-primary-800 hover:shadow-md active:scale-[0.98] disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
