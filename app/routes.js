import { index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.jsx"),
  route("shop", "routes/shop.jsx"),
  route("shop/category/:categoryId", "routes/category.jsx"),
  route("shop/category/:categoryId/:productId", "routes/product.jsx"),
  route("cart", "routes/cart.jsx"),
  route("checkout", "routes/checkout.jsx"),
  route("about", "routes/about.jsx"),
  route("policies", "routes/policies.jsx"),
];
