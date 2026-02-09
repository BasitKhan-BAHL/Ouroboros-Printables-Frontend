import { Link, useParams } from "react-router";
import { categories, products, formatPrice, getCategoryImage } from "../catalog";

export function meta() {
  return [
    { title: "Category – Ouroboros Printables" },
    { name: "description", content: "Digital books and guides." },
  ];
}

export default function Category() {
  const { categoryId } = useParams();
  const category = categories.find((c) => c.slug === categoryId) ?? categories.find((c) => c.slug === "e-books");
  const categoryProducts = Object.values(products).filter((product) => product.categoryId === category.slug);

  return (
    <div className="mx-auto max-w-7xl px-6 py-8 sm:px-8">
      <nav className="mb-8 font-secondary text-sm text-primary-500">
        <Link to="/" className="hover:text-primary-700">Home</Link>
        <span className="mx-2">&gt;</span>
        <Link to="/shop" className="hover:text-primary-700">Categories</Link>
        <span className="mx-2">&gt;</span>
        <span className="text-primary-700">{category.title}</span>
      </nav>
      <h1 className="font-primary text-3xl font-bold text-primary-900">{category.title}</h1>
      <p className="mt-1 font-secondary text-primary-600">
        {category.slug === "e-books" && "Digital books and guides"}
        {category.slug === "templates" && "Professional templates for every need"}
        {category.slug === "courses" && "Learn new skills"}
        {category.slug === "graphics" && "Design assets and resources"}
      </p>
      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {categoryProducts.map((product) => (
          <Link
            key={product.id}
            to={`/shop/category/${categoryId}/${product.id}`}
            className="overflow-hidden rounded-xl bg-white shadow-md transition hover:shadow-lg"
          >
            <div className="aspect-square overflow-hidden rounded-lg bg-primary-100">
              <img
                src={getCategoryImage(category.slug)}
                alt={product.title}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="p-6">
              <h2 className="font-primary font-semibold text-primary-900">{product.title}</h2>
              <p className="mt-1 font-secondary text-primary-700">{formatPrice(product.price)}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
