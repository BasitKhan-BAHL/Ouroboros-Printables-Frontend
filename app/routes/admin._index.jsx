import { useState, useEffect } from "react";
import { getStats, formatPrice } from "../catalog";
import { useSettings } from "../context/settings";

export default function AdminOverview() {
  const { currency } = useSettings();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchStats() {
      try {
        const data = await getStats();
        setStats(data);
      } catch (err) {
        setError("Failed to load statistics");
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 rounded-xl bg-primary-100"></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-600">
        {error}
      </div>
    );
  }

  const statCards = [
    { label: "Total Revenue", value: formatPrice(stats.revenue, currency), icon: "💰", color: "text-green-600" },
    { label: "Total Orders", value: stats.orders, icon: "📦", color: "text-blue-600" },
    { label: "Categories", value: stats.categories, icon: "🏷️", color: "text-purple-600" },
    { label: "Products", value: stats.products, icon: "📚", color: "text-amber-600" },
  ];

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-primary-200 bg-white p-8 shadow-sm">
        <h3 className="font-primary text-xl font-bold text-primary-900 mb-4">Welcome back, Admin</h3>
        <p className="font-secondary text-primary-600 leading-relaxed">
          This is your control center. Use the sidebar to manage your store's categories and products.
          Your current performance metrics are displayed above in real-time.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <div key={card.label} className="rounded-xl border border-primary-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <span className="text-3xl">{card.icon}</span>
              <div>
                <p className="font-secondary text-sm font-medium text-primary-500">{card.label}</p>
                <p className={`font-primary text-2xl font-bold ${card.color}`}>{card.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
