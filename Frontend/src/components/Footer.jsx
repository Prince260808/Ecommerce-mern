import { Link } from "react-router-dom";
import { FiShoppingCart, FiMail, FiPhone, FiMapPin, FiInstagram, FiTwitter, FiFacebook } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                <FiShoppingCart className="text-white text-sm" />
              </div>
              <span className="font-black text-lg text-white">
                Gupta<span className="text-indigo-400">Store</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed mb-4">
              Your trusted destination for premium electronics, laptops, mobiles and accessories at unbeatable prices.
            </p>
            <div className="flex gap-3">
              {[FiInstagram, FiTwitter, FiFacebook].map((Icon, i) => (
                <a key={i} href="#"
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-indigo-600 flex items-center justify-center transition">
                  <Icon className="text-sm" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: "Home", to: "/" },
                { label: "All Products", to: "/" },
                { label: "Cart", to: "/cart" },
                { label: "My Orders", to: "/login" },
              ].map(({ label, to }) => (
                <li key={label}>
                  <Link to={to} className="hover:text-indigo-400 transition">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Categories</h4>
            <ul className="space-y-2.5 text-sm">
              {["Laptops", "Mobiles", "Tablets", "Electronics", "Accessories"].map((c) => (
                <li key={c}>
                  <Link to="/" className="hover:text-indigo-400 transition">{c}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <FiMapPin className="mt-0.5 flex-shrink-0 text-indigo-400" />
                <span>123 Tech Street, Sector 18,<br />Delhi, India – 110001</span>
              </li>
              <li className="flex items-center gap-2.5">
                <FiPhone className="flex-shrink-0 text-indigo-400" />
                <a href="tel:+919999999999" className="hover:text-indigo-400 transition">+91 99999 99999</a>
              </li>
              <li className="flex items-center gap-2.5">
                <FiMail className="flex-shrink-0 text-indigo-400" />
                <a href="mailto:support@guptastore.com" className="hover:text-indigo-400 transition">support@guptastore.com</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <p>© {new Date().getFullYear()} GuptaStore. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-indigo-400 transition">Privacy Policy</a>
            <a href="#" className="hover:text-indigo-400 transition">Terms of Service</a>
            <a href="#" className="hover:text-indigo-400 transition">Refund Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
