import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiShoppingCart, FiUser } from "react-icons/fi";
import api from "../api/axios";

export default function Navbar() {
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const loadCart = async () => {
      try {
        if (!userId) return setCartCount(0);
        const res = await api.get(`/cart/${userId}`);
        const total =
          res.data?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
        setCartCount(total);
      } catch {
        setCartCount(0);
      }
    };

    loadCart();
    window.addEventListener("cartUpdated", loadCart);
    return () => window.removeEventListener("cartUpdated", loadCart);
  }, [userId]);

  const logout = () => {
    localStorage.clear();
    setCartCount(0);
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="h-16 flex items-center justify-between">

          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-bold tracking-tight text-blue-600 flex items-center"
          >
            Gupta
            <span className="ml-1 text-gray-900 font-extrabold">Store</span>
          </Link>

          {/* Right Section */}
          <div className="flex items-center gap-3 sm:gap-5">

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2.5 rounded-full
                         hover:bg-blue-50
                         transition-all duration-200
                         ring-1 ring-transparent hover:ring-blue-100"
            >
              <FiShoppingCart className="text-2xl text-gray-700" />

              {cartCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 min-w-[20px] h-5
                             bg-blue-600 text-white text-xs font-semibold
                             flex items-center justify-center
                             rounded-full px-1 shadow-md"
                >
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Auth Section */}
            {!userId ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="font-medium text-gray-700
                             hover:text-blue-600
                             transition px-3 py-1.5
                             rounded-lg text-sm sm:text-base"
                >
                  Login
                </Link>

                <Link
                  to="/signup"
                  className="font-semibold text-white
                             bg-blue-600
                             px-4 py-1.5 rounded-lg
                             hover:bg-blue-700
                             shadow-sm transition
                             text-sm sm:text-base"
                >
                  Signup
                </Link>
              </div>
            ) : (
              <button
                onClick={logout}
                className="flex items-center gap-2
                           bg-blue-500 text-white
                           px-4 py-1.5 rounded-lg
                           hover:bg-blue-600
                           transition text-sm sm:text-base shadow-sm"
              >
                <FiUser className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            )}

          </div>
        </div>
      </div>
    </nav>
  );
}
