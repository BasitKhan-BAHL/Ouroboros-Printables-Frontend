import { useState, useEffect } from "react";
import { getLicenses, createLicense, updateLicense, deleteLicense } from "../catalog";

export default function LicenseManager() {
  const [licenses, setLicenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingLicense, setEditingLicense] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const [formData, setFormData] = useState({
    id: "",
    title: "",
    description: "",
    price: 0,
    period: "one-time",
    features: "",
  });

  useEffect(() => {
    fetchLicenses();
  }, []);

  const fetchLicenses = async () => {
    try {
      const data = await getLicenses();
      setLicenses(data);
    } catch (err) {
      console.error(err);
      setMessage({ text: "Failed to fetch licenses", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (license) => {
    setEditingLicense(license);
    setFormData({
      id: license._id,
      title: license.title,
      description: license.description,
      price: license.price,
      period: license.period,
      features: license.features.join(", "),
    });
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setEditingLicense(null);
    setFormData({
      id: "",
      title: "",
      description: "",
      price: 0,
      period: "one-time",
      features: "",
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this license?")) return;
    try {
      await deleteLicense(id);
      setMessage({ text: "License deleted successfully", type: "success" });
      fetchLicenses();
    } catch (err) {
      console.error(err);
      setMessage({ text: "Failed to delete license", type: "error" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      features: formData.features.split(",").map((f) => f.trim()).filter((f) => f),
    };

    try {
      if (editingLicense) {
        await updateLicense(editingLicense._id, payload);
        setMessage({ text: "License updated successfully", type: "success" });
      } else {
        await createLicense(payload);
        setMessage({ text: "License created successfully", type: "success" });
      }
      setIsFormOpen(false);
      fetchLicenses();
    } catch (err) {
      console.error(err);
      setMessage({ text: editingLicense ? "Failed to update license" : "Failed to create license", type: "error" });
    }
  };

  if (isLoading) return <div className="py-4">Loading licenses...</div>;

  return (
    <div className="mt-12">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="font-primary text-2xl font-bold text-primary-900">Manage Licenses</h2>
          <p className="mt-1 font-secondary text-primary-600">Add or modify licenses shown on the site</p>
        </div>
        <button
          onClick={handleAddNew}
          className="rounded-lg bg-primary-900 px-4 py-2 font-secondary text-sm font-semibold text-white transition-all hover:bg-primary-800"
        >
          Add New License
        </button>
      </div>

      {message.text && (
        <div className={`mb-6 rounded-lg p-4 text-sm font-medium ${
          message.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
        }`}>
          {message.text}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {licenses.map((license) => (
          <div key={license._id} className="rounded-xl border border-primary-100 bg-white p-5 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-primary text-lg font-bold text-primary-900">{license.title}</h3>
                <p className="font-secondary text-xs text-primary-500 uppercase tracking-wider">{license._id}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(license)} className="text-primary-600 hover:text-primary-900">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                </button>
                <button onClick={() => handleDelete(license._id)} className="text-red-500 hover:text-red-700">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                </button>
              </div>
            </div>
            <p className="mt-2 font-secondary text-sm text-primary-600 line-clamp-2">{license.description}</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="font-primary font-bold text-primary-900">€{license.price.toFixed(2)}</span>
              <span className="font-secondary text-xs text-primary-400 capitalize">{license.period}</span>
            </div>
          </div>
        ))}
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-2xl">
            <h3 className="mb-6 font-primary text-2xl font-bold text-primary-900">
              {editingLicense ? "Edit License" : "Add New License"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block font-secondary text-sm font-bold text-primary-900">License ID (e.g. commercial)</label>
                <input
                  type="text"
                  required
                  disabled={!!editingLicense}
                  value={formData.id}
                  onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                  className="w-full rounded-xl border border-primary-300 bg-white px-4 py-2.5 font-secondary text-sm text-primary-900 shadow-sm transition-all focus:border-primary-900 focus:ring-2 focus:ring-primary-900/5 focus:outline-none"
                  placeholder="commercial"
                />
              </div>
              <div>
                <label className="mb-1.5 block font-secondary text-sm font-bold text-primary-900">Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full rounded-xl border border-primary-300 bg-white px-4 py-2.5 font-secondary text-sm text-primary-900 shadow-sm transition-all focus:border-primary-900 focus:ring-2 focus:ring-primary-900/5 focus:outline-none"
                  placeholder="Commercial License"
                />
              </div>
              <div>
                <label className="mb-1.5 block font-secondary text-sm font-bold text-primary-900">Description</label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-xl border border-primary-300 bg-white px-4 py-2.5 font-secondary text-sm text-primary-900 shadow-sm transition-all focus:border-primary-900 focus:ring-2 focus:ring-primary-900/5 focus:outline-none"
                  rows="2"
                  placeholder="For business and commercial projects"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block font-secondary text-sm font-bold text-primary-900">Price (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    className="w-full rounded-xl border border-primary-300 bg-white px-4 py-2.5 font-secondary text-sm text-primary-900 shadow-sm transition-all focus:border-primary-900 focus:ring-2 focus:ring-primary-900/5 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block font-secondary text-sm font-bold text-primary-900">Period</label>
                  <input
                    type="text"
                    required
                    value={formData.period}
                    onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                    className="w-full rounded-xl border border-primary-300 bg-white px-4 py-2.5 font-secondary text-sm text-primary-900 shadow-sm transition-all focus:border-primary-900 focus:ring-2 focus:ring-primary-900/5 focus:outline-none"
                    placeholder="one-time"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block font-secondary text-sm font-bold text-primary-900">Features (comma separated)</label>
                <textarea
                  required
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  className="w-full rounded-xl border border-primary-300 bg-white px-4 py-2.5 font-secondary text-sm text-primary-900 shadow-sm transition-all focus:border-primary-900 focus:ring-2 focus:ring-primary-900/5 focus:outline-none"
                  rows="3"
                  placeholder="Feature 1, Feature 2, Feature 3"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="rounded-lg border border-primary-200 px-6 py-2 font-secondary text-sm font-medium text-primary-600 hover:bg-primary-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-primary-900 px-6 py-2 font-secondary text-sm font-bold text-white hover:bg-primary-800"
                >
                  {editingLicense ? "Update License" : "Create License"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
