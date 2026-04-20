const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export async function getCategories(options = {}) {
  const { search } = typeof options === "string" ? { search: options } : options;
  const url = new URL(`${API_URL}/categories`);
  if (search) url.searchParams.append("search", search);
  
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch categories");
  const data = await res.json();
  return data.categories;
}

export async function getSettings() {
  const res = await fetch(`${API_URL}/settings`);
  if (!res.ok) throw new Error("Failed to fetch settings");
  return res.json();
}

export async function getCategory(slug) {
  const res = await fetch(`${API_URL}/categories/${slug}`);
  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error("Failed to fetch category");
  }
  const data = await res.json();
  return data.category;
}

export async function getProducts(options = {}) {
  const { categoryId, search } = typeof options === "string" ? { categoryId: options } : options;
  const url = new URL(`${API_URL}/products`);
  if (categoryId) url.searchParams.append("category", categoryId);
  if (search) url.searchParams.append("search", search);

  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch products");
  const data = await res.json();
  return data.products;
}

export async function getProduct(productId) {
  const res = await fetch(`${API_URL}/products/${productId}`);
  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error("Failed to fetch product");
  }
  const data = await res.json();
  return data.product;
}

export function formatPrice(value, symbol = "€") {
  if (typeof value !== 'number') return `${symbol}0.00`;
  return `${symbol}${value.toFixed(2)}`;
}

// ─── ADMIN API HELPERS ────────────────────────────────────────────────────────

function getAuthHeaders() {
  const token = typeof window !== "undefined" ? window.localStorage.getItem("token") : null;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function createCategory(payload) {
  const res = await fetch(`${API_URL}/categories`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to create category");
  return res.json();
}

export async function updateCategory(slug, payload) {
  const res = await fetch(`${API_URL}/categories/${slug}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to update category");
  return res.json();
}

export async function deleteCategory(slug) {
  const res = await fetch(`${API_URL}/categories/${slug}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete category");
  return res.json();
}

export async function createProduct(payload) {
  const res = await fetch(`${API_URL}/products`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to create product");
  return res.json();
}

export async function updateProduct(id, payload) {
  const res = await fetch(`${API_URL}/products/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to update product");
  return res.json();
}

export async function deleteProduct(id) {
  const res = await fetch(`${API_URL}/products/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete product");
  return res.json();
}

export async function getStats() {
  const res = await fetch(`${API_URL}/stats`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch stats");
  return res.json();
}

export async function getLicenses() {
  const res = await fetch(`${API_URL}/licenses`);
  if (!res.ok) throw new Error("Failed to fetch licenses");
  return res.json();
}

export async function updateSettings(payload) {
  const res = await fetch(`${API_URL}/settings`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to update settings");
  return res.json();
}

export async function createLicense(payload) {
  const res = await fetch(`${API_URL}/licenses`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to create license");
  return res.json();
}

export async function updateLicense(id, payload) {
  const res = await fetch(`${API_URL}/licenses/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to update license");
  return res.json();
}

export async function deleteLicense(id) {
  const res = await fetch(`${API_URL}/licenses/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete license");
  return res.json();
}
