import { Link } from "react-router";
import { getCategoryImage } from "../catalog";
import { useCart } from "../context/cart";

export function meta() {
  return [
    { title: "Checkout – Ouroboros Printables" },
    { name: "description", content: "Complete your purchase." },
  ];
}

function LockIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

export default function Checkout() {
  const { items, subtotalFormatted, totalFormatted, totalQuantity } = useCart();

  if (!items.length) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16 text-center sm:px-8">
        <h1 className="font-primary text-2xl font-bold text-primary-900">Your cart is empty</h1>
        <p className="mt-2 font-secondary text-primary-600">
          Add some products to your cart before checking out.
        </p>
        <Link
          to="/shop"
          className="mt-6 inline-block rounded-lg bg-primary-900 px-8 py-3 font-secondary font-medium text-white hover:bg-primary-800"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-8 sm:px-8">
      <Link to="/cart" className="mb-6 inline-flex items-center gap-1 font-secondary text-primary-600 hover:text-primary-900">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Back to Cart
      </Link>
      <h1 className="font-primary text-2xl font-bold text-primary-900">Checkout</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-xl border border-primary-200 bg-white p-6 shadow-sm">
            <h2 className="font-primary text-lg font-semibold text-primary-900">Your Details</h2>
            <div className="mt-4 space-y-4">
              <div>
                <label htmlFor="email" className="block font-secondary text-sm font-medium text-primary-900">Email Address</label>
                <input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  className="mt-1 w-full rounded-lg border border-primary-200 bg-primary-50 px-4 py-2 font-secondary text-primary-900 placeholder:text-primary-400 focus:border-primary-400 focus:outline-none"
                />
                <p className="mt-1 font-secondary text-xs text-primary-500">Your download links will be sent here</p>
              </div>
              <div>
                <label htmlFor="name" className="block font-secondary text-sm font-medium text-primary-900">Full Name</label>
                <input
                  id="name"
                  type="text"
                  placeholder="John Smith"
                  className="mt-1 w-full rounded-lg border border-primary-200 bg-white px-4 py-2 font-secondary text-primary-900 placeholder:text-primary-400 focus:border-primary-400 focus:outline-none"
                />
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-primary-200 bg-white p-6 shadow-sm">
            <h2 className="font-primary text-lg font-semibold text-primary-900">Payment</h2>
            <div className="mt-4 rounded-lg border border-secondary-200 bg-secondary-50 p-4 font-secondary text-sm text-secondary-700">
              Payment integration requires backend setup. Connect Lovable Cloud to enable secure Stripe payments with GBP currency support.
            </div>
            <button
              type="button"
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-primary-900 py-3 font-secondary font-medium text-white hover:bg-primary-800"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                <line x1="1" y1="10" x2="23" y2="10" />
              </svg>
              Pay 14.99
            </button>
          </div>
        </div>
        <div>
          <div className="rounded-xl border border-primary-200 bg-white p-6 shadow-sm">
            <h2 className="font-primary text-lg font-semibold text-primary-900">Order Summary</h2>
            <div className="mt-4 space-y-4 border-b border-primary-100 pb-4">
              {items.map((item) => (
                <div key={item.productId} className="flex gap-4">
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-secondary-100">
                    <img
                      src={getCategoryImage(item.product.categoryId)}
                      alt={item.product.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-secondary font-medium text-primary-900">{item.product.title}</p>
                    <p className="font-secondary text-sm text-primary-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-secondary font-medium text-primary-900">{item.lineTotalFormatted}</p>
                </div>
              ))}
            </div>
            <div className="space-y-2 border-b border-primary-100 py-4 font-secondary text-primary-900">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{subtotalFormatted}</span>
              </div>
              <div className="flex justify-between text-primary-600">
                <span>Items</span>
                <span>{totalQuantity}</span>
              </div>
            </div>
            <div className="flex justify-between py-4 font-primary font-bold text-primary-900">
              <span>Total</span>
              <span>{totalFormatted}</span>
            </div>
            <p className="flex items-center gap-2 font-secondary text-xs text-primary-500">
              <LockIcon />
              Secure checkout with OTP verification
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
