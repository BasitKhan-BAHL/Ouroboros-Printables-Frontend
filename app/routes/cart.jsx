import { Link, useNavigate } from "react-router";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";

export function meta() {
  return [
    { title: "Your Cart – Ouroboros Printables" },
    { name: "description", content: "Review your cart and proceed to checkout." },
  ];
}

function RemoveIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-secondary-500 hover:text-secondary-600">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export default function Cart() {
  const { items, subtotalFormatted, totalFormatted, totalQuantity, increment, decrement, removeItem } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!items.length) {
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-2xl flex-col items-center justify-center px-6 py-16 text-center sm:px-8">
        <div className="rounded-full bg-primary-200 p-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary-500">
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
        </div>
        <h1 className="mt-8 font-primary text-2xl font-bold text-primary-900">Your cart is empty</h1>
        <p className="mt-2 font-secondary text-primary-600">Browse our collection and add some products to your cart.</p>
        <Link
          to="/shop"
          className="mt-8 inline-block rounded-lg bg-primary-900 px-8 py-3 font-secondary font-medium text-white hover:bg-primary-800"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[90rem] px-6 py-12 sm:px-8">
      <Link to="/shop" className="mb-6 inline-flex items-center gap-1 font-secondary text-primary-600 hover:text-primary-900">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Continue Shopping
      </Link>
      <h1 className="font-primary text-2xl font-bold text-primary-900">Your Cart ({totalQuantity})</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-primary-200 bg-white p-4 sm:p-6 shadow-sm">
            {items.map((item) => (
              <div key={item.productId} className="flex gap-4 border-b border-primary-100 pb-6 last:border-0 last:pb-0">
                <div className="flex gap-3 sm:gap-5 flex-1 min-w-0">
                  <div className="h-20 w-20 sm:h-24 sm:w-24 shrink-0 overflow-hidden rounded-lg bg-secondary-100">
                    <img
                      src={item.categoryImage}
                      alt={item.product.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col min-w-0">
                    <div className="flex justify-between items-start gap-1">
                      <h2 className="font-primary font-medium text-primary-900 min-w-0 flex-1 leading-snug">{item.product.title}</h2>
                      <div className="text-right font-secondary font-medium text-primary-900 sm:hidden">
                        {item.lineTotalFormatted}
                      </div>
                    </div>
                    <p className="font-secondary text-primary-600">${item.product.price.toFixed(2)}</p>
                    <div className="mt-auto pt-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button type="button" className="flex h-8 w-8 items-center justify-center rounded border border-primary-200 bg-white font-secondary text-primary-900" onClick={() => decrement(item.productId)}>−</button>
                        <input type="text" readOnly value={item.quantity} className="h-8 w-12 rounded border border-primary-200 bg-primary-50 text-center font-secondary text-primary-900" />
                        <button type="button" className="flex h-8 w-8 items-center justify-center rounded border border-primary-200 bg-white font-secondary text-primary-900" onClick={() => increment(item.productId)}>+</button>
                      </div>
                      <button type="button" className="shrink-0 p-2 text-primary-400 hover:text-red-500 sm:hidden" aria-label="Remove item" onClick={() => removeItem(item.productId)}>
                        <RemoveIcon />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="hidden sm:flex flex-col justify-between items-end">
                  <div className="text-right font-secondary font-medium text-primary-900">
                    {item.lineTotalFormatted}
                  </div>
                  <button type="button" className="shrink-0 p-2 text-primary-400 hover:text-red-500" aria-label="Remove item" onClick={() => removeItem(item.productId)}>
                    <RemoveIcon />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="rounded-xl border border-primary-200 bg-white p-6 shadow-sm">
            <h2 className="font-primary text-lg font-bold text-primary-900">Order Summary</h2>
            <div className="mt-4 space-y-2 font-secondary text-primary-900">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{subtotalFormatted}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span className="text-primary-600">Instant</span>
              </div>
            </div>
            <div className="my-4 border-t border-primary-200 pt-4">
              <div className="flex justify-between font-primary font-bold text-primary-900">
                <span>Total</span>
                <span>{totalFormatted}</span>
              </div>
            </div>
            {!user ? (
              <button
                type="button"
                onClick={() => navigate('/account?redirect=/checkout')}
                className="block w-full rounded-lg bg-primary-900 py-3 text-center font-secondary font-medium text-white hover:bg-primary-800"
              >
                Proceed to Checkout
              </button>
            ) : !user.license ? (
              <button
                type="button"
                onClick={() => navigate('/licenses?redirect=/checkout')}
                className="block w-full rounded-lg bg-primary-900 py-3 text-center font-secondary font-medium text-white hover:bg-primary-800"
              >
                Proceed to Checkout
              </button>
            ) : (
              <Link
                to="/checkout"
                className="block w-full rounded-lg bg-primary-900 py-3 text-center font-secondary font-medium text-white hover:bg-primary-800"
              >
                Proceed to Checkout
              </Link>
            )}
            <p className="mt-3 text-center font-secondary text-xs text-primary-600">Secure checkout with instant digital delivery</p>
          </div>
        </div>
      </div>
    </div>
  );
}
