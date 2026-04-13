import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { formatPrice, getCategory, getProduct } from "../catalog";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";

export function meta() {
  return [
    { title: "Product – Ouroboros Printables" },
    { name: "description", content: "Premium digital product." },
  ];
}

function CheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-secondary-500">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-secondary-500">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}

export default function Product() {
  const { categoryId, productId } = useParams();
  const [product, setProduct] = useState(null);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const prodData = await getProduct(productId);
        if (prodData) {
          setProduct(prodData);
          const catData = await getCategory(prodData.categoryId);
          setCategory(catData);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [productId]);

  if (!loading && !product) {
    return <div className="mx-auto max-w-[90rem] px-6 py-12 sm:px-8 text-center text-red-600">Product not found</div>;
  }

  return (
    <div className="mx-auto max-w-[90rem] px-6 py-12 sm:px-8">
      <nav className="mb-8 font-secondary text-sm text-primary-500">
        <Link to="/" className="hover:text-primary-700">Home</Link>
        <span className="mx-2">&gt;</span>
        <Link to="/shop" className="hover:text-primary-700">Categories</Link>
        <span className="mx-2">&gt;</span>
        <Link to={product ? `/shop/category/${product.categoryId}` : '#'} className="hover:text-primary-700">{category?.title || 'Loading...'}</Link>
        <span className="mx-2">&gt;</span>
        <span className="text-primary-700">{product?.title || '...'}</span>
      </nav>
      {loading ? (
        // Skeleton Loaders
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="overflow-hidden rounded-xl bg-white p-12 shadow-sm border border-slate-100">
            <div className="aspect-square rounded-lg bg-slate-200 animate-pulse"></div>
          </div>
          <div>
            <div className="h-10 w-3/4 rounded bg-slate-200 animate-pulse"></div>
            <div className="mt-4 h-6 w-1/4 rounded bg-slate-200 animate-pulse"></div>
            <div className="mt-6 h-4 w-full rounded bg-slate-200 animate-pulse"></div>
            <div className="mt-2 h-4 w-5/6 rounded bg-slate-200 animate-pulse"></div>
            <div className="mt-6 h-12 w-full rounded-lg bg-slate-200 animate-pulse"></div>
            <div className="mt-6 h-12 w-40 rounded-lg bg-slate-200 animate-pulse"></div>
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
               <div className="h-10 w-full rounded bg-slate-200 animate-pulse"></div>
               <div className="h-10 w-full rounded bg-slate-200 animate-pulse"></div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="overflow-hidden rounded-xl bg-secondary-100 p-12 shadow-sm">
            <div className="aspect-square overflow-hidden rounded-lg bg-primary-100">
              <img
                src={category?.image || '/db-images/1.jpeg'}
                alt={product.title}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          <div>
            <h1 className="font-primary text-3xl font-bold text-primary-900">{product.title}</h1>
            <p className="mt-2 font-primary text-xl text-primary-900">{formatPrice(product.price)}</p>
            <p className="mt-4 font-secondary text-primary-700">{product.description}</p>
            <div className="mt-6 rounded-lg bg-primary-100 px-4 py-3 font-secondary text-sm text-primary-700 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-primary-600">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
              Instant PDF Download – Available immediately after purchase
            </div>
            <button
              type="button"
              onClick={() => {
                const pid = product._id || product.id;
                if (!user) {
                  navigate(`/account?action=add_to_cart&productId=${pid}&redirect=${window.location.pathname}`);
                } else if (!user.license) {
                  navigate(`/licenses?action=add_to_cart&productId=${pid}&redirect=${window.location.pathname}`);
                } else {
                  addItem(pid);
                  navigate("/cart");
                }
              }}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary-900 px-6 py-3 font-secondary font-medium text-white hover:bg-primary-800 sm:w-auto"
            >
              <CartIcon />
              Add to Cart
            </button>
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <div className="flex gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary-100 text-secondary-500">
                  <CheckIcon />
                </div>
                <div>
                  <p className="font-secondary font-medium text-primary-900">Instant Delivery</p>
                  <p className="font-secondary text-sm text-primary-600">Download immediately</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary-100 text-secondary-500">
                  <LockIcon />
                </div>
                <div>
                  <p className="font-secondary font-medium text-primary-900">Secure Payment</p>
                  <p className="font-secondary text-sm text-primary-600">Protected Checkout</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
