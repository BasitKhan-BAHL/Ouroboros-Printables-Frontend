import { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router";
import logo from "../assets/logo.jpeg";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";

function CartIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-900">
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-900">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-900">
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-900">
      <line x1="18" x2="6" y1="6" y2="18" />
      <line x1="6" x2="18" y1="6" y2="18" />
    </svg>
  );
}

function BackIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-900">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

export function Header() {
  const { totalQuantity } = useCart();
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? "border-b border-primary-200 bg-primary-50/95 backdrop-blur-md shadow-sm" 
        : "max-md:border-none max-md:bg-transparent max-md:shadow-none border-b border-primary-200 bg-primary-50 shadow-sm"
    }`}>
      <nav className="mx-auto flex max-w-[90rem] items-center justify-between px-6 py-4 sm:px-8">
        <div className="flex items-center gap-1 sm:gap-2">
          {location.pathname !== '/' && (
            <button onClick={() => navigate(-1)} aria-label="Go Back" className="md:hidden flex h-8 w-8 -ml-2 items-center justify-center rounded-full hover:bg-primary-100 text-primary-900">
              <BackIcon />
            </button>
          )}
          <NavLink to="/" className="flex items-center gap-2 font-primary text-primary-900" onClick={closeMobileMenu}>
            <img src={logo} alt="Ouroboros Printables" className="h-10 w-10 rounded-full object-cover" />
            <span className="font-semibold hidden sm:inline-block">Ouroboros Printables</span>
          </NavLink>
        </div>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex flex-1 items-center justify-center gap-8">
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
        </ul>

        {/* Desktop Right Icons */}
        <ul className="hidden md:flex items-center gap-6">
          <li>
            <NavLink
              to={user ? "/profile" : "/account"}
              className="text-primary-900 hover:text-primary-700 transition"
              aria-label="Account"
            >
              <UserIcon />
            </NavLink>
          </li>
          <li>
            <NavLink to="/cart" className="relative text-primary-900 hover:text-primary-700 transition" aria-label="Cart">
              <CartIcon />
              {totalQuantity > 0 && (
                <span className="absolute -right-2 -top-2 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-secondary-500 px-1 text-xs font-semibold text-white">
                  {totalQuantity}
                </span>
              )}
            </NavLink>
          </li>
        </ul>

        {/* Mobile controls */}
        <div className="flex md:hidden items-center gap-4">
          <NavLink to="/cart" className="relative text-primary-900" aria-label="Cart" onClick={closeMobileMenu}>
            <CartIcon />
            {totalQuantity > 0 && (
              <span className="absolute -right-2 -top-2 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-secondary-500 px-1 text-xs font-semibold text-white">
                {totalQuantity}
              </span>
            )}
          </NavLink>
          <button onClick={toggleMobileMenu} aria-label="Toggle Menu">
            {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-primary-200 bg-primary-50 px-6 py-4 absolute w-full shadow-lg">
          <ul className="flex flex-col gap-4">
            <li>
              <NavLink to="/shop" className="block font-secondary text-lg text-primary-900" onClick={closeMobileMenu}>
                Shop
              </NavLink>
            </li>
            <li>
              <NavLink to="/about" className="block font-secondary text-lg text-primary-900" onClick={closeMobileMenu}>
                About
              </NavLink>
            </li>
            <li>
              <NavLink to="/policies" className="block font-secondary text-lg text-primary-900" onClick={closeMobileMenu}>
                Policies
              </NavLink>
            </li>
            <li className="border-t border-primary-200 pt-4">
              <NavLink to={user ? "/profile" : "/account"} className="flex items-center gap-2 font-secondary text-lg text-primary-900" onClick={closeMobileMenu}>
                <UserIcon />
                {user ? "Your Profile" : "Sign In / Create Account"}
              </NavLink>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
