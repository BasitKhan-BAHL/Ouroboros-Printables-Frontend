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
    try {
      await deleteProduct(id);
      await fetchProductsData();
    } catch (err) {
      alert(err.message || "Failed to delete");
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
                      <div className="h-10 w-10 shrink-0 overflow-hidden rounded bg-primary-100 border border-primary-200">
                        {prod.image ? (
                          <img src={prod.image} alt={prod.title} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-[10px] text-primary-400">No Image</div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{prod.title}</p>
                        <p className="text-primary-500 truncate max-w-[200px]">{prod.description}</p>
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
            <label className="mb-1 block text-sm font-medium text-primary-900">Digital Product File (PDF, etc.)</label>
            <div className="flex flex-col gap-2">
              {fileName && (
                <div className="flex items-center justify-between rounded-lg bg-primary-50 px-3 py-2 text-sm text-primary-700 border border-primary-200">
                  <span className="truncate max-w-[250px]">{fileName}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setFileData("");
                      setFileName("");
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    ✕
                  </button>
                </div>
              )}
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
                className="w-full text-sm text-primary-600 file:mr-4 file:rounded-lg file:border-0 file:bg-primary-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-primary-900 hover:file:bg-primary-200"
              />
              <p className="text-[10px] text-primary-400 italic">This file will be available for download to customers after purchase.</p>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-primary-900">Product Preview Image</label>
            <div className="flex flex-col gap-3">
              {image && (
                <div className="relative h-32 w-full overflow-hidden rounded-lg border border-primary-200">
                  <img src={image} alt="Preview" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setImage("")}
                    className="absolute right-2 top-2 rounded-full bg-black/50 p-1 text-white hover:bg-black/70"
                  >
                    ✕
                  </button>
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
                className="w-full text-sm text-primary-600 file:mr-4 file:rounded-lg file:border-0 file:bg-primary-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-primary-900 hover:file:bg-primary-200"
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
