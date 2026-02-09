import { Link } from "react-router";

export function Footer() {
  return (
    <footer className="border-t border-primary-200 bg-primary-50">
      <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <h3 className="font-primary text-lg font-semibold text-primary-900">Ouroboros Printables</h3>
            <p className="mt-2 font-secondary text-sm text-primary-600">
              Premium digital products delivered instantly. Quality templates, e-books, courses, and graphics to help you succeed.
            </p>
          </div>
          <div>
            <h3 className="font-primary text-lg font-semibold text-primary-900">Shop</h3>
            <ul className="mt-2 space-y-1 font-secondary text-sm text-primary-700">
              <li><Link to="/shop" className="hover:text-primary-900">All Categories</Link></li>
              <li><Link to="/shop/category/templates" className="hover:text-primary-900">Templates</Link></li>
              <li><Link to="/shop/category/e-books" className="hover:text-primary-900">E-Books</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-primary text-lg font-semibold text-primary-900">Support</h3>
            <ul className="mt-2 space-y-1 font-secondary text-sm text-primary-700">
              <li><Link to="/about" className="hover:text-primary-900">Contact Us</Link></li>
              <li><Link to="/policies" className="hover:text-primary-900">Policies</Link></li>
              <li>
                <a href="mailto:support@digitalgoods.com" className="underline hover:text-primary-900">support@digitalgoods.com</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-primary-200 pt-6 text-center">
          <p className="font-secondary text-xs text-primary-500">© 2026 Ouroboros Printables. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
