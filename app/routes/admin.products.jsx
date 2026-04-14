import { useState, useEffect } from "react";
import { getProducts, getCategories, createProduct, updateProduct, deleteProduct, formatPrice } from "../catalog";

function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-primary-400 hover:text-primary-900"
        >
          ✕
        </button>
        <h2 className="mb-6 font-primary text-xl font-bold text-primary-900">{title}</h2>
        {children}
      </div>
    </div>
  );
}

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodData, catData] = await Promise.all([getProducts(), getCategories()]);
      setProducts(prodData);
      setCategories(catData);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAddModal = () => {
    setEditingProduct(null);
    setTitle("");
    setDescription("");
    setPrice("");
    setCategoryId(categories[0]?._id || categories[0]?.slug || "");
    setFormError("");
    setIsModalOpen(true);
  };

  const openEditModal = (prod) => {
    setEditingProduct(prod);
    setTitle(prod.title);
    setDescription(prod.description);
    setPrice(prod.price);
    setCategoryId(prod.categoryId);
    setFormError("");
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setIsSubmitting(true);
    try {
      const payload = {
        title,
        description,
        price: parseFloat(price),
        categoryId
      };

      if (editingProduct) {
        await updateProduct(editingProduct._id || editingProduct.id, payload);
      } else {
        await createProduct(payload);
      }
      setIsModalOpen(false);
      await fetchData();
    } catch (err) {
      setFormError(err.message || "An error occurred");
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteProduct(id);
      await fetchData();
    } catch (err) {
      alert(err.message || "Failed to delete");
    }
  };

  const getCategoryName = (id) => {
    const cat = categories.find(c => (c._id || c.slug) === id);
    return cat ? cat.title : id;
  };

  if (loading) return <div className="text-primary-600 font-secondary">Loading products...</div>;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-primary text-xl font-bold text-primary-900">Products</h2>
        <button
          onClick={openAddModal}
          className="rounded-lg bg-primary-900 px-4 py-2 font-secondary text-sm font-medium text-white hover:bg-primary-800"
        >
          + Add Product
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-primary-200 bg-white shadow-sm">
        <table className="w-full text-left font-secondary text-sm text-primary-900">
          <thead className="bg-primary-50">
            <tr>
              <th className="px-6 py-4 font-semibold text-primary-900">Product</th>
              <th className="px-6 py-4 font-semibold text-primary-900">Category</th>
              <th className="px-6 py-4 font-semibold text-primary-900">Price</th>
              <th className="px-6 py-4 text-right font-semibold text-primary-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-primary-100">
            {products.map((prod) => {
              const prodId = prod._id || prod.id;
              return (
                <tr key={prodId} className="hover:bg-primary-50/50">
                  <td className="px-6 py-4">
                    <p className="font-medium">{prod.title}</p>
                    <p className="text-primary-500 truncate max-w-[200px]">{prod.description}</p>
                  </td>
                  <td className="px-6 py-4 text-primary-600">
                    <span className="inline-block rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-semibold text-primary-700">
                      {getCategoryName(prod.categoryId)}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium">{formatPrice(prod.price)}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => openEditModal(prod)} className="text-secondary-600 hover:text-secondary-800 mr-4 font-medium">Edit</button>
                    <button onClick={() => handleDelete(prodId)} className="text-red-500 hover:text-red-700 font-medium">Delete</button>
                  </td>
                </tr>
              );
            })}
            {products.length === 0 && (
              <tr>
                <td colSpan="4" className="px-6 py-8 text-center text-primary-500">No products found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingProduct ? "Edit Product" : "Add Product"}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 font-secondary">
          {formError && <div className="rounded bg-red-50 p-3 text-sm text-red-600 border border-red-200">{formError}</div>}
          
          <div>
            <label className="mb-1 block text-sm font-medium text-primary-900">Product Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-primary-200 px-3 py-2 text-primary-900 focus:outline-none focus:border-primary-400"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-primary-900">Description</label>
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border border-primary-200 px-3 py-2 text-primary-900 focus:outline-none focus:border-primary-400"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-primary-900">Price (EUR)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full rounded-lg border border-primary-200 px-3 py-2 text-primary-900 focus:outline-none focus:border-primary-400"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-primary-900">Category</label>
              <select
                required
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full rounded-lg border border-primary-200 px-3 py-2 text-primary-900 bg-white focus:outline-none focus:border-primary-400"
              >
                {!categoryId && <option value="">Select...</option>}
                {categories.map((c) => (
                  <option key={c._id || c.slug} value={c._id || c.slug}>{c.title}</option>
                ))}
              </select>
            </div>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-4 rounded-lg bg-primary-900 py-3 font-secondary font-medium text-white hover:bg-primary-800 disabled:opacity-70"
          >
            {isSubmitting ? "Saving..." : editingProduct ? "Save Changes" : "Create Product"}
          </button>
        </form>
      </Modal>
    </div>
  );
}
