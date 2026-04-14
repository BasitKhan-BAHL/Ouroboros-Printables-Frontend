import { index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.jsx"),
  route("shop", "routes/shop.jsx"),
  route("shop/category/:categoryId", "routes/category.jsx"),
  route("shop/category/:categoryId/:productId", "routes/product.jsx"),
  route("cart", "routes/cart.jsx"),
  route("checkout", "routes/checkout.jsx"),
  route("receipt", "routes/receipt.jsx"),
  route("about", "routes/about.jsx"),
  route("policies", "routes/policies.jsx"),
  route("account", "routes/account.jsx"),
  route("licenses", "routes/licenses.jsx"),
  route("profile", "routes/profile.jsx"),

  route("admin", "routes/admin.jsx", [
    index("routes/admin._index.jsx"),
    route("categories", "routes/admin.categories.jsx"),
    route("products", "routes/admin.products.jsx"),
  ]),
];
