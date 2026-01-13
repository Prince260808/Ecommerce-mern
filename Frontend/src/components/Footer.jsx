import { Link } from "react-router-dom";
import { FiFacebook, FiInstagram, FiTwitter, FiLinkedin } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">

        {/* Top Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-blue-600">
              Gupta<span className="text-gray-800">Store</span>
            </h2>
            <p className="mt-4 text-gray-600 text-sm leading-relaxed">
              Your trusted online store for quality products, fast delivery,
              and secure checkout.
            </p>

            <div className="flex gap-3 mt-5">
              {[FiFacebook, FiInstagram, FiTwitter, FiLinkedin].map(
                (Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="w-9 h-9 flex items-center justify-center
                               rounded-full border border-gray-300
                               text-gray-600 hover:text-blue-600
                               hover:border-blue-600 transition"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                )
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              {["Home", "Shop", "Categories", "Offers", "Contact"].map(
                (item) => (
                  <li key={item}>
                    <Link
                      to="/"
                      className="text-gray-600 hover:text-blue-600 transition"
                    >
                      {item}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">
              Customer Service
            </h3>
            <ul className="space-y-3 text-sm">
              {["My Account", "Orders", "Wishlist", "Returns", "FAQs"].map(
                (item) => (
                  <li key={item}>
                    <Link
                      to="/"
                      className="text-gray-600 hover:text-blue-600 transition"
                    >
                      {item}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">
              Stay Updated
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Subscribe for offers & updates
            </p>

            <form className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-3 py-2 text-sm
                           border border-gray-300 rounded-l-md
                           focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-4 bg-blue-600 text-white text-sm
                           rounded-r-md hover:bg-blue-700 transition"
              >
                Subscribe
              </button>
            </form>
          </div>

        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 my-8"></div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-600">
          <p>
            © {new Date().getFullYear()} GuptaStore. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            <span>Secure Payments</span>
            <img
              src="https://i.imgur.com/VgXKpWQ.png"
              alt="Payments"
              className="h-6"
            />
          </div>
        </div>

      </div>
    </footer>
  );
}
