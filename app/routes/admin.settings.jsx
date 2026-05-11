import { useState } from "react";
import { useSettings } from "../context/settings";
import { updateSettings } from "../catalog";
import LicenseManager from "../components/LicenseManager";

export default function AdminSettings() {
  const { settings, refreshSettings, updateLocalSettings } = useSettings();
  const [selectedCurrency, setSelectedCurrency] = useState(settings.currency || "€");
  const [bannerSettings, setBannerSettings] = useState(settings.banner || {
    showDesktop: true,
    showMobile: true,
    text: "Special Event",
    description: "Enjoy 50% off all amazing printables until the end of the month!",
    buttonText: "Shop Now",
    buttonLink: "/shop"
  });
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
      const payload = {
        currency: selectedCurrency,
        banner: bannerSettings
      };
      await updateSettings(payload);
      updateLocalSettings(payload);
      setMessage({ text: "Settings updated successfully!", type: "success" });
    } catch (err) {
      console.error(err);
      setMessage({ text: "Failed to update settings.", type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h2 className="font-primary text-3xl font-extrabold text-primary-900 tracking-tight">Global Settings</h2>
        <p className="mt-2 font-secondary text-primary-600">Configure global store preferences and promotional banners</p>
      </div>

      <div className="rounded-2xl border border-primary-100 bg-white p-8 shadow-sm">
        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label className="mb-2 block font-secondary text-lg font-bold text-primary-900">
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
                  className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 p-5 transition-all duration-300 ${selectedCurrency === curr.symbol
                      ? "border-primary-900 bg-primary-50 shadow-md transform scale-[1.02]"
                      : "border-primary-50 bg-slate-50 hover:border-primary-200 hover:bg-white"
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

          <hr className="border-primary-100" />

          <div className="space-y-4">
            <h3 className="font-primary text-lg font-bold text-primary-900">Top Notification Banner</h3>
            <p className="font-secondary text-sm text-primary-600">Control the visibility and content of the announcement banner.</p>

            <div className="flex flex-wrap gap-6 rounded-lg bg-white p-4 border border-primary-100">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={bannerSettings.showDesktop}
                  onChange={(e) => setBannerSettings({ ...bannerSettings, showDesktop: e.target.checked })}
                  className="h-5 w-5 rounded border-primary-300 text-primary-900 focus:ring-primary-900"
                />
                <span className="font-secondary text-sm font-medium text-primary-900">Show on Desktop</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={bannerSettings.showMobile}
                  onChange={(e) => setBannerSettings({ ...bannerSettings, showMobile: e.target.checked })}
                  className="h-5 w-5 rounded border-primary-300 text-primary-900 focus:ring-primary-900"
                />
                <span className="font-secondary text-sm font-medium text-primary-900">Show on Mobile</span>
              </label>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block font-secondary text-xs font-bold uppercase tracking-wider text-primary-500">Banner Label</label>
                <input
                  type="text"
                  value={bannerSettings.text}
                  onChange={(e) => setBannerSettings({ ...bannerSettings, text: e.target.value })}
                  className="w-full rounded-xl border border-primary-300 bg-white px-4 py-2.5 font-secondary text-sm text-primary-900 shadow-sm transition-all focus:border-primary-900 focus:ring-2 focus:ring-primary-900/5 focus:outline-none"
                  placeholder="e.g. Special Event"
                />
              </div>
              <div>
                <label className="mb-1.5 block font-secondary text-xs font-bold uppercase tracking-wider text-primary-500">Button Text</label>
                <input
                  type="text"
                  value={bannerSettings.buttonText}
                  onChange={(e) => setBannerSettings({ ...bannerSettings, buttonText: e.target.value })}
                  className="w-full rounded-xl border border-primary-300 bg-white px-4 py-2.5 font-secondary text-sm text-primary-900 shadow-sm transition-all focus:border-primary-900 focus:ring-2 focus:ring-primary-900/5 focus:outline-none"
                  placeholder="e.g. Shop Now"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block font-secondary text-xs font-bold uppercase tracking-wider text-primary-500">Description Message</label>
              <textarea
                value={bannerSettings.description}
                onChange={(e) => setBannerSettings({ ...bannerSettings, description: e.target.value })}
                rows="3"
                className="w-full rounded-xl border border-primary-300 bg-white px-4 py-2.5 font-secondary text-sm text-primary-900 shadow-sm transition-all focus:border-primary-900 focus:ring-2 focus:ring-primary-900/5 focus:outline-none"
                placeholder="e.g. Enjoy 50% off all amazing printables..."
              />
            </div>

            <div>
              <label className="mb-1.5 block font-secondary text-xs font-bold uppercase tracking-wider text-primary-500">Button Redirect Link</label>
              <input
                type="text"
                value={bannerSettings.buttonLink}
                onChange={(e) => setBannerSettings({ ...bannerSettings, buttonLink: e.target.value })}
                className="w-full rounded-xl border border-primary-300 bg-white px-4 py-2.5 font-secondary text-sm text-primary-900 shadow-sm transition-all focus:border-primary-900 focus:ring-2 focus:ring-primary-900/5 focus:outline-none"
                placeholder="e.g. /shop or https://..."
              />
            </div>
          </div>

          {message.text && (
            <div className={`rounded-lg p-4 text-sm font-medium ${message.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
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

      <LicenseManager />
    </div>
  );
}
