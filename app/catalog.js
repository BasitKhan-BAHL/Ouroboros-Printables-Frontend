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
