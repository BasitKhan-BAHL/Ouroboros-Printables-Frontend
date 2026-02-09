import { Link } from "react-router";
import { categories, getCategoryImage } from "../catalog";

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
  return (
    <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8">
      <div className="mb-10">
        <h1 className="font-primary text-3xl font-bold text-primary-900">All Categories</h1>
        <p className="mt-2 font-secondary text-primary-600">Browse our collection of premium digital products</p>
      </div>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            to={`/shop/category/${cat.slug}`}
            className="overflow-hidden rounded-xl bg-white p-6 shadow-md transition hover:shadow-lg"
          >
            <div className="aspect-[4/3] overflow-hidden rounded-lg bg-primary-100">
              <img
                src={getCategoryImage(cat.slug)}
                alt={cat.title}
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
        ))}
      </div>
    </div>
  );
}
