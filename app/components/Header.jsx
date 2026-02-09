import { NavLink } from "react-router";
import logo from "../assets/logo.jpeg";
import { useCart } from "../context/cart";

function CartIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-900">
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}

export function Header() {
  const { totalQuantity } = useCart();

  return (
    <header className="sticky top-0 z-10 border-b border-primary-200 bg-primary-50 shadow-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-8">
        <NavLink to="/" className="flex items-center gap-2 font-primary text-primary-900">
          <img src={logo} alt="Ouroboros Printables" className="h-10 w-10 rounded-full object-cover" />
          <span className="font-semibold">Ouroboros Printables</span>
        </NavLink>
        <ul className="flex items-center gap-8">
          <li>
            <NavLink
              to="/shop"
              className={({ isActive }) =>
                `font-secondary text-primary-700 ${isActive ? "font-semibold text-primary-900" : "hover:text-primary-900"}`
              }
            >
              Shop
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `font-secondary text-primary-700 ${isActive ? "font-semibold text-primary-900" : "hover:text-primary-900"}`
              }
            >
              About
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/policies"
              className={({ isActive }) =>
                `font-secondary text-primary-700 ${isActive ? "font-semibold text-primary-900" : "hover:text-primary-900"}`
              }
            >
              Policies
            </NavLink>
          </li>
          <li>
            <NavLink to="/cart" className="relative text-primary-900" aria-label="Cart">
              <CartIcon />
              {totalQuantity > 0 && (
                <span className="absolute -right-2 -top-2 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-secondary-500 px-1 text-xs font-semibold text-white">
                  {totalQuantity}
                </span>
              )}
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}
