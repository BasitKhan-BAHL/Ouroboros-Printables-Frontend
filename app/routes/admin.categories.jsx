import { useState, useEffect } from "react";
import { getCategories, createCategory, updateCategory, deleteCategory } from "../catalog";

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

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  
  // Form State
  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openAddModal = () => {
    setEditingCategory(null);
    setSlug("");
    setTitle("");
    setDescription("");
    setImage("");
    setFormError("");
    setIsModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingCategory(cat);
    setSlug(cat._id || cat.slug);
    setTitle(cat.title);
    setDescription(cat.description);
    setImage(cat.image);
    setFormError("");
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setIsSubmitting(true);
    try {
      if (editingCategory) {
        await updateCategory(editingCategory._id || editingCategory.slug, {
          title, description, image
        });
      } else {
        await createCategory({
          _id: slug, title, description, image
        });
      }
      setIsModalOpen(false);
      await fetchCategories();
    } catch (err) {
      setFormError(err.message || "An error occurred");
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (catSlug) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      await deleteCategory(catSlug);
      await fetchCategories();
    } catch (err) {
      alert(err.message || "Failed to delete");
    }
  };

  if (loading) return <div className="text-primary-600 font-secondary">Loading categories...</div>;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-primary text-xl font-bold text-primary-900">Categories</h2>
        <button
          onClick={openAddModal}
          className="rounded-lg bg-primary-900 px-4 py-2 font-secondary text-sm font-medium text-white hover:bg-primary-800"
        >
          + Add Category
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-primary-200 bg-white shadow-sm">
        <table className="w-full text-left font-secondary text-sm text-primary-900">
          <thead className="bg-primary-50">
            <tr>
              <th className="px-6 py-4 font-semibold text-primary-900">Image</th>
              <th className="px-6 py-4 font-semibold text-primary-900">Category</th>
              <th className="px-6 py-4 font-semibold text-primary-900">Slug ID</th>
              <th className="px-6 py-4 text-right font-semibold text-primary-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-primary-100">
            {categories.map((cat) => {
              const catSlug = cat._id || cat.slug;
              return (
                <tr key={catSlug} className="hover:bg-primary-50/50">
                  <td className="px-6 py-4">
                    <img src={cat.image} alt="cat" className="h-10 w-10 rounded object-cover border border-primary-200" />
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium">{cat.title}</p>
                    <p className="text-primary-500 truncate max-w-[250px]">{cat.description}</p>
                  </td>
                  <td className="px-6 py-4 text-primary-600">{catSlug}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => openEditModal(cat)} className="text-secondary-600 hover:text-secondary-800 mr-4 font-medium">Edit</button>
                    <button onClick={() => handleDelete(catSlug)} className="text-red-500 hover:text-red-700 font-medium">Delete</button>
                  </td>
                </tr>
              );
            })}
            {categories.length === 0 && (
              <tr>
                <td colSpan="4" className="px-6 py-8 text-center text-primary-500">No categories found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingCategory ? "Edit Category" : "Add Category"}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 font-secondary">
          {formError && <div className="rounded bg-red-50 p-3 text-sm text-red-600 border border-red-200">{formError}</div>}
          
          <div>
            <label className="mb-1 block text-sm font-medium text-primary-900">Unique Slug ID (e.g. "literature")</label>
            <input
              type="text"
              required
              disabled={!!editingCategory}
              value={slug}
              onChange={(e) => setSlug(e.target.value.toLowerCase().trim())}
              className="w-full rounded-lg border border-primary-200 px-3 py-2 text-primary-900 focus:outline-none focus:border-primary-400 disabled:opacity-50"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-primary-900">Display Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-primary-200 px-3 py-2 text-primary-900 focus:outline-none focus:border-primary-400"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-primary-900">Description Tagline</label>
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border border-primary-200 px-3 py-2 text-primary-900 focus:outline-none focus:border-primary-400"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-primary-900">Image URL / Path</label>
            <input
              type="text"
              required
              placeholder="/db-images/example.jpeg"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full rounded-lg border border-primary-200 px-3 py-2 text-primary-900 focus:outline-none focus:border-primary-400"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-4 rounded-lg bg-primary-900 py-3 font-secondary font-medium text-white hover:bg-primary-800 disabled:opacity-70"
          >
            {isSubmitting ? "Saving..." : editingCategory ? "Save Changes" : "Create Category"}
          </button>
        </form>
      </Modal>
    </div>
  );
}
