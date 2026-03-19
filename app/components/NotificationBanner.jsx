import { useState } from "react";
import { Link } from "react-router";

export function NotificationBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="relative isolate flex flex-col items-center justify-center gap-3 overflow-hidden bg-primary-900 px-6 py-3 sm:flex-row sm:justify-center sm:gap-x-6 sm:px-3.5">
      {/* Decorative ambient blurred gradients */}
      <div
        className="absolute left-[max(-7rem,calc(50%-52rem))] top-1/2 -z-10 -translate-y-1/2 transform-gpu blur-2xl"
        aria-hidden="true"
      >
        <div
          className="aspect-[577/310] w-[36.0625rem] bg-gradient-to-r from-secondary-400 to-secondary-600 opacity-20"
          style={{
            clipPath:
              "polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)",
          }}
        />
      </div>
      <div
        className="absolute left-[max(45rem,calc(50%+8rem))] top-1/2 -z-10 -translate-y-1/2 transform-gpu blur-2xl"
        aria-hidden="true"
      >
        <div
          className="aspect-[577/310] w-[36.0625rem] bg-gradient-to-r from-secondary-400 to-secondary-600 opacity-20"
          style={{
            clipPath:
              "polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)",
          }}
        />
      </div>

      <p className="text-center text-sm leading-6 text-white flex flex-col sm:flex-row sm:items-center sm:gap-2">
        <strong className="font-semibold text-secondary-100 flex items-center justify-center gap-1.5">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-secondary-300">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
          </svg>
          Special Event
        </strong>
        <span className="hidden sm:inline opacity-50 text-secondary-200">&bull;</span>
        <span className="opacity-90">Enjoy 50% off all amazing printables until the end of the month!</span>
      </p>

      <Link
        to="/shop"
        className="flex-none rounded-full bg-secondary-500 px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-secondary-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary-900 transition-all duration-300 hover:scale-105"
      >
        Shop Now <span aria-hidden="true">&rarr;</span>
      </Link>

      <button
        type="button"
        onClick={() => setIsVisible(false)}
        className="absolute right-2 top-2 sm:top-1/2 sm:-translate-y-1/2 p-2 text-white/70 hover:text-white transition-colors"
      >
        <span className="sr-only">Dismiss</span>
        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
        </svg>
      </button>
    </div>
  );
}
