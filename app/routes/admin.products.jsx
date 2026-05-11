import { useState, useEffect } from "react";
import { getProducts, getCategories, createProduct, updateProduct, deleteProduct, formatPrice } from "../catalog";
import { useSettings } from "../context/settings";

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

export default function AdminProducts() {
  const { currency } = useSettings();
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
  const [image, setImage] = useState("");
  const [fileData, setFileData] = useState("");
  const [fileName, setFileName] = useState("");

  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingIds, setDeletingIds] = useState(new Set());

  // Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("");

  const fetchCategoriesData = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      console.error("Failed to fetch categories", err);
    }
  };

  const fetchProductsData = async () => {
    setLoading(true);
    try {
      const data = await getProducts({
        categoryId: activeCategory,
        search: searchTerm
      });
      setProducts(data);
    } catch (err) {
      console.error("Failed to fetch products", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCategoriesData();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProductsData();
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, activeCategory]);

  const openAddModal = () => {
    setEditingProduct(null);
    setTitle("");
    setDescription("");
    setPrice("");
    setCategoryId(categories[0]?._id || categories[0]?.slug || "");
    setImage("");
    setFileData("");
    setFileName("");
    setFormError("");
    setIsModalOpen(true);
  };

  const openEditModal = (prod) => {
    setEditingProduct(prod);
    setTitle(prod.title);
    setDescription(prod.description);
    setPrice(prod.price);
    setCategoryId(prod.categoryId);
    setImage(prod.image || "");
    setFileData(prod.fileData || "");
    setFileName(prod.fileName || "");
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
        categoryId,
        image,
        fileData,
        fileName
      };

      if (editingProduct) {
        await updateProduct(editingProduct._id || editingProduct.id, payload);
      } else {
        await createProduct(payload);
      }
      setIsModalOpen(false);
      await fetchProductsData();
    } catch (err) {
      setFormError(err.message || "An error occurred");
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    
    setDeletingIds(prev => new Set(prev).add(id));
    try {
      await deleteProduct(id);
      // Remove from local state immediately for a fast feel
      setProducts(prev => prev.filter(p => (p._id || p.id) !== id));
    } catch (err) {
      alert(err.message || "Failed to delete");
      // Refresh list if delete failed to ensure UI is in sync
      await fetchProductsData();
    } finally {
      setDeletingIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const getCategoryName = (id) => {
    const cat = categories.find(c => (c._id || c.slug) === id);
    return cat ? cat.title : id;
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h2 className="font-primary text-xl font-bold text-primary-900">Products</h2>

        <div className="flex flex-1 flex-col gap-3 md:max-w-xl md:flex-row md:items-center">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search products..."
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

          <select
            value={activeCategory}
            onChange={(e) => setActiveCategory(e.target.value)}
            className="rounded-lg border border-primary-200 bg-white px-3 py-2 font-secondary text-sm text-primary-900 focus:border-primary-400 focus:outline-none"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c._id || c.slug} value={c._id || c.slug}>
                {c.title}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={openAddModal}
          className="rounded-lg bg-primary-900 px-4 py-2 font-secondary text-sm font-medium text-white hover:bg-primary-800"
        >
          + Add Product
        </button>
      </div>

      {loading && products.length === 0 ? (
        <div className="text-primary-600 font-secondary">Loading products...</div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-primary-200 bg-white shadow-sm">
          <table className="w-full text-left font-secondary text-sm text-primary-900">
            <thead className="bg-primary-50">
              <tr>
                <th className="px-6 py-4 font-semibold text-primary-900">Product</th>
                <th className="px-6 py-4 font-semibold text-primary-900">Category</th>
                <th className="px-6 py-4 font-semibold text-primary-900">Price ({currency})</th>
                <th className="px-6 py-4 text-right font-semibold text-primary-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary-100">
              {products.map((prod) => {
                const prodId = prod._id || prod.id;
                return (
                  <tr key={prodId} className="hover:bg-primary-50/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-primary-50 border border-primary-200 shadow-sm">
                          {prod.image ? (
                            <img src={prod.image} alt={prod.title} className="h-full w-full object-cover" />
                          ) : (
                            <img
                              src={categories.find(c => (c._id || c.slug) === prod.categoryId)?.image || '/db-images/1.jpeg'}
                              alt={prod.title}
                              className="h-full w-full object-cover opacity-50"
                            />
                          )}
                        </div>
                        <div className="flex flex-col">
                          <p className="font-bold text-primary-900">{prod.title}</p>
                          <p className="text-primary-500 text-xs truncate max-w-[200px]">{prod.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-primary-600">
                      <span className="inline-block rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-semibold text-primary-700">
                        {getCategoryName(prod.categoryId)}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium">{formatPrice(prod.price, currency)}</td>
                    <td className="px-6 py-4 text-right">
                      {deletingIds.has(prodId) ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-red-400 animate-pulse uppercase tracking-wider">
                          <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Deleting
                        </span>
                      ) : (
                        <>
                          <button onClick={() => openEditModal(prod)} className="text-secondary-600 hover:text-secondary-800 mr-4 font-medium transition-colors">Edit</button>
                          <button onClick={() => handleDelete(prodId)} className="text-red-500 hover:text-red-700 font-medium transition-colors">Delete</button>
                        </>
                      )}
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
      )}

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
              <label className="mb-1 block text-sm font-medium text-primary-900">Price ({currency})</label>
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

          <div>
            <label className="my-2 block text-xs font-bold uppercase tracking-wider text-primary-500">Digital Product File</label>
            <div className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all ${fileName ? 'border-secondary-300 bg-secondary-50/30' : 'border-primary-200 hover:border-primary-400 bg-slate-50'}`}>
              <input
                type="file"
                onChange={async (e) => {
                  const file = e.target.files[0];
                  if (file) {
                    try {
                      const base64 = await fileToBase64(file);
                      setFileData(base64);
                      setFileName(file.name);
                    } catch (err) {
                      console.error("Failed to convert file", err);
                    }
                  }
                }}
                className="absolute inset-0 z-10 cursor-pointer opacity-0"
              />
              <div className="flex flex-col items-center p-6 text-center">
                {fileName ? (
                  <>
                    <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-secondary-100 text-secondary-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-sm font-bold text-primary-900">{fileName}</p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFileData("");
                        setFileName("");
                      }}
                      className="mt-2 text-xs font-bold text-red-500 hover:text-red-700 underline z-20"
                    >
                      Remove File
                    </button>
                  </>
                ) : (
                  <>
                    <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium text-primary-900">Click or drag to upload digital product</p>
                    <p className="text-xs text-primary-400">PDF, ZIP, etc. (Max 50MB)</p>
                  </>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-primary-500">Product Preview Image</label>
            <div className="group relative flex aspect-video w-full flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-primary-200 bg-slate-50 transition-all hover:border-primary-400">
              {image ? (
                <>
                  <img src={image} alt="Preview" className="h-full w-full object-cover" />
                  <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
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
                  <p className="text-sm font-medium text-primary-900">Click to upload custom preview image</p>
                  <p className="text-xs text-primary-400 italic">Optional: Falls back to category image if empty</p>
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
            {isSubmitting ? "Saving..." : editingProduct ? "Save Changes" : "Create Product"}
          </button>
        </form>
      </Modal>
    </div>
  );
}
