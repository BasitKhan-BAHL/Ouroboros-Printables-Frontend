import { useState, useEffect } from "react";
import { Link } from "react-router";
import { getCategories } from "../catalog";

export function meta() {
  return [
    { title: "All Categories – Ouroboros Printables" },
    { name: "description", content: "Browse our collection of premium digital products." },
  ];
}

function ArrowRight() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

export default function Shop() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="mx-auto max-w-[90rem] px-6 py-12 sm:px-8">
      <div className="mb-10">
        <h1 className="font-primary text-3xl font-bold text-primary-900">All Categories</h1>
        <p className="mt-2 font-secondary text-primary-600">Browse our collection of premium digital products</p>
      </div>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          // Skeleton Loaders
          Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-xl bg-white p-6 shadow-md border border-slate-100">
              <div className="aspect-[4/3] rounded-lg bg-slate-200 animate-pulse"></div>
              <div className="mt-4 h-5 w-3/4 rounded bg-slate-200 animate-pulse"></div>
              <div className="mt-2 h-4 w-full rounded bg-slate-200 animate-pulse"></div>
              <div className="mt-1 h-4 w-2/3 rounded bg-slate-200 animate-pulse"></div>
              <div className="mt-4 h-4 w-1/3 rounded bg-slate-200 animate-pulse"></div>
            </div>
          ))
        ) : (
          categories.map((cat) => (
            <Link
              key={cat.id || cat._id || cat.slug}
              to={`/shop/category/${cat.id || cat._id || cat.slug}`}
              className="overflow-hidden rounded-xl bg-white p-6 shadow-md transition hover:shadow-lg"
            >
              <div className="aspect-[4/3] overflow-hidden rounded-lg bg-primary-100">
                <img
                  src={cat.image}
                  alt={cat.title}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
              <h2 className="mt-4 font-primary font-semibold text-primary-900">{cat.title}</h2>
              <p className="mt-1 font-secondary text-sm text-primary-600">{cat.description}</p>
              <span className="mt-3 inline-flex items-center gap-1 font-secondary text-sm font-medium text-secondary-600">
                Browse collection
                <ArrowRight />
              </span>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
