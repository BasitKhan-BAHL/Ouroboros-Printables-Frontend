import { useState, useEffect } from "react";
import { Link, useParams } from "react-router";
import { formatPrice, getCategory, getProducts } from "../catalog";
import { useSettings } from "../context/settings";

export function meta() {
  return [
    { title: "Category – Ouroboros Printables" },
    { name: "description", content: "Digital books and guides." },
  ];
}

export default function Category() {
  const { currency } = useSettings();
  const { categoryId } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const [catData, prodData] = await Promise.all([
          getCategory(categoryId),
          getProducts({ categoryId })
        ]);
        setCategory(catData);
        setProducts(prodData || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [categoryId]);

  if (!loading && !category) {
    return <div className="mx-auto max-w-[90rem] px-6 py-8 sm:px-8 text-center text-red-600">Category not found</div>;
  }

  return (
    <div className="mx-auto max-w-[90rem] px-6 py-8 sm:px-8">
      <nav className="mb-8 font-secondary text-sm text-primary-500">
        <Link to="/" className="hover:text-primary-700">Home</Link>
        <span className="mx-2">&gt;</span>
        <Link to="/shop" className="hover:text-primary-700">Categories</Link>
        <span className="mx-2">&gt;</span>
        <span className="text-primary-700">{category?.title || 'Loading...'}</span>
      </nav>
      <h1 className="font-primary text-3xl font-bold text-primary-900">{category?.title || '...'}</h1>
      <p className="mt-1 font-secondary text-primary-600">
        {category?.description || '...'}
      </p>
      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          // Skeleton Loaders
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-xl bg-white shadow-md border border-slate-100">
              <div className="aspect-square bg-slate-200 animate-pulse"></div>
              <div className="p-6">
                <div className="h-5 w-3/4 rounded bg-slate-200 animate-pulse"></div>
                <div className="mt-2 h-4 w-1/3 rounded bg-slate-200 animate-pulse"></div>
              </div>
            </div>
          ))
        ) : (
          products.map((product) => (
            <Link
              key={product._id || product.id}
              to={`/shop/category/${categoryId}/${product._id || product.id}`}
              className="overflow-hidden rounded-xl bg-white shadow-md transition hover:shadow-lg"
            >
              <div className="aspect-square overflow-hidden rounded-lg bg-primary-100">
                <img
                  src={category.image}
                  alt={product.title}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-6">
                <h2 className="font-primary font-semibold text-primary-900">{product.title}</h2>
                <p className="mt-1 font-secondary text-primary-700">{formatPrice(product.price, currency)}</p>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
