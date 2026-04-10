import { Link } from "react-router";

export function Footer() {
  return (
    <footer className="border-t border-primary-200 bg-primary-50">
      <div className="mx-auto max-w-[90rem] px-6 py-12 sm:px-8">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <h3 className="font-primary text-lg font-semibold text-primary-900 uppercase tracking-wider">Disclaimer</h3>
            <p className="mt-2 font-secondary text-sm text-primary-600 leading-relaxed">
              All products are instantly downloadable upon purchase. See <Link to="/policies" className="underline hover:text-primary-900">purchase policies</Link> for details.
            </p>
          </div>
          <div>
            <h3 className="font-primary text-lg font-semibold text-primary-900 tracking-wider">Shop</h3>
            <ul className="mt-2 space-y-1 font-secondary text-sm text-primary-700">
              <li><Link to="/shop" className="hover:text-primary-900">All Categories</Link></li>
              <li><Link to="/shop/category/literature" className="hover:text-primary-900">Literature</Link></li>
              <li><Link to="/shop/category/education" className="hover:text-primary-900">Education</Link></li>
              <li><Link to="/shop/category/organisation" className="hover:text-primary-900">Organisation</Link></li>
              <li><Link to="/shop/category/stationary" className="hover:text-primary-900">Stationary</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-primary text-lg font-semibold text-primary-900">Support</h3>
            <ul className="mt-2 space-y-1 font-secondary text-sm text-primary-700">
              <li><Link to="/about" className="hover:text-primary-900">Contact Us</Link></li>
              <li><Link to="/policies" className="hover:text-primary-900">Policies</Link></li>
              <li>
                <a href="mailto:support@ouroborosprintables.com" className="underline hover:text-primary-900">support@ouroborosprintables.com</a>
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
