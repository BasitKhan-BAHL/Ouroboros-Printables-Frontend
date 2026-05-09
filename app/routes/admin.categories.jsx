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

const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

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

  // Filter State
  const [searchTerm, setSearchTerm] = useState("");

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await getCategories({ search: searchTerm });
      setCategories(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchCategories();
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

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
      if (!image) {
        setFormError("Category image is mandatory. Please upload an image.");
        setIsSubmitting(false);
        return;
      }

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
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h2 className="font-primary text-xl font-bold text-primary-900">Categories</h2>
        
        <div className="relative flex-1 md:max-w-md">
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-primary-200 bg-white px-4 py-2 pl-9 font-secondary text-sm text-primary-900 focus:border-primary-400 focus:outline-none"
          />
          <span className="absolute left-3 top-2.5 text-primary-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
        </div>

        <button
          onClick={openAddModal}
          className="rounded-lg bg-primary-900 px-4 py-2 font-secondary text-sm font-medium text-white hover:bg-primary-800"
        >
          + Add Category
        </button>
      </div>

      {loading && categories.length === 0 ? (
        <div className="text-primary-600 font-secondary">Loading categories...</div>
      ) : (
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
      )}

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
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-primary-500">Category Image</label>
            <div className="group relative flex aspect-video w-full flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-primary-200 bg-slate-50 transition-all hover:border-primary-400">
              {image ? (
                <>
                  <img src={image} alt="Preview" className="h-full w-full object-cover" />
                  <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setImage("");
                      }}
                      className="rounded-full bg-red-500 p-2 text-white hover:bg-red-600 shadow-lg transition-transform hover:scale-110"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center p-6 text-center">
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-primary-900">Click to upload category image</p>
                  <p className="text-xs text-primary-400">JPG, PNG (4:3 recommended)</p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files[0];
                  if (file) {
                    try {
                      const base64 = await fileToBase64(file);
                      setImage(base64);
                    } catch (err) {
                      console.error("Failed to convert file", err);
                    }
                  }
                }}
                className="absolute inset-0 z-10 cursor-pointer opacity-0"
              />
            </div>
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
