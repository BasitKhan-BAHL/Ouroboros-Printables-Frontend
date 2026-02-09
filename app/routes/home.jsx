import { Link } from "react-router";
import { categories, products, formatPrice, getCategoryImage } from "../catalog";

export function meta() {
  return [
    { title: "Ouroboros Printables" },
    { name: "description", content: "Premium digital products – templates, e-books, courses, and graphics." },
  ];
}

const featuredProductIds = [
  "business-plan-template",
  "social-media-kit",
  "productivity-guide",
  "digital-marketing-basics",
];

function ArrowRight() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 py-40 text-center sm:px-8">
        <h1 className="font-primary text-4xl font-bold tracking-tight text-primary-900 sm:text-5xl">
          Premium Digital Products
        </h1>
        <p className="mx-auto mt-4 max-w-2xl font-secondary text-lg text-primary-600">
          Instant delivery. Quality guaranteed. Templates, e-books, courses, and graphics to help you succeed.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 rounded-lg bg-primary-900 px-6 py-3 font-secondary font-medium text-white transition hover:bg-primary-800"
          >
            Browse Products
            <ArrowRight />
          </Link>
          <Link
            to="/about"
            className="inline-flex items-center gap-2 rounded-lg bg-primary-200 px-6 py-3 font-secondary font-medium text-primary-900 transition hover:bg-primary-300"
          >
            Learn more
          </Link>
        </div>
      </section>

      {/* Shop by Category */}
      <section className="border-t border-primary-200 bg-white py-16">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-primary text-2xl font-bold text-primary-900">Shop by Category</h2>
              <p className="mt-1 font-secondary text-primary-600">Find exactly what you need</p>
            </div>
            <Link to="/shop" className="inline-flex items-center gap-1 font-secondary font-medium text-secondary-600 hover:text-secondary-700">
              View all
              <ArrowRight />
            </Link>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
                <h3 className="mt-4 font-primary font-semibold text-primary-900">{cat.title}</h3>
                <p className="mt-1 font-secondary text-sm text-primary-600">{cat.description}</p>
                <span className="mt-3 inline-flex items-center gap-1 font-secondary text-sm font-medium text-secondary-600">
                  Browse collection
                  <ArrowRight />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-primary text-2xl font-bold text-primary-900">Featured Products</h2>
              <p className="mt-1 font-secondary text-primary-600">Our most popular digital goods</p>
            </div>
            <Link to="/shop" className="inline-flex items-center gap-1 font-secondary font-medium text-secondary-600 hover:text-secondary-700">
              View all products
              <ArrowRight />
            </Link>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProductIds.map((id) => {
              const product = products[id];
              const categoryId = product.categoryId;
              return (
              <Link
                key={product.id}
                to={`/shop/category/${categoryId}/${product.id}`}
                className="overflow-hidden rounded-xl bg-white p-6 shadow-md transition hover:shadow-lg"
              >
                <div className="aspect-square overflow-hidden rounded-lg bg-primary-100">
                  <img
                    src={getCategoryImage(categoryId)}
                    alt={product.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <h3 className="mt-4 font-primary font-semibold text-primary-900">{product.title}</h3>
                <p className="mt-1 font-secondary text-primary-700">{formatPrice(product.price)}</p>
              </Link>
            )})}
          </div>
        </div>
      </section>

      {/* Instant Digital Delivery */}
      <section className="border-t border-primary-200 bg-white py-32">
        <div className="mx-auto max-w-7xl px-6 text-center sm:px-8">
          <h2 className="font-primary text-2xl font-bold text-primary-900">Instant Digital Delivery</h2>
          <p className="mx-auto mt-3 max-w-2xl font-secondary text-primary-600">
            All products are delivered instantly after purchase. Download your files or access your content immediately via email or your account.
          </p>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            <div>
              <p className="font-primary text-3xl font-bold text-primary-900">500+</p>
              <p className="mt-1 font-secondary text-primary-600">Digital Products</p>
            </div>
            <div>
              <p className="font-primary text-3xl font-bold text-primary-900">10K+</p>
              <p className="mt-1 font-secondary text-primary-600">Happy Customers</p>
            </div>
            <div>
              <p className="font-primary text-3xl font-bold text-primary-900">24/7</p>
              <p className="mt-1 font-secondary text-primary-600">Instant Delivery</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
