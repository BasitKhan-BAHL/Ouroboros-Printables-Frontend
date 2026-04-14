const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export async function getCategories() {
  const res = await fetch(`${API_URL}/categories`);
  if (!res.ok) throw new Error("Failed to fetch categories");
  const data = await res.json();
  return data.categories;
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

export async function getProducts(categoryId = null) {
  const url = categoryId
    ? `${API_URL}/products?category=${categoryId}`
    : `${API_URL}/products`;
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

export function formatPrice(value) {
  if (typeof value !== 'number') return "0.00";
  return value.toFixed(2);
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
