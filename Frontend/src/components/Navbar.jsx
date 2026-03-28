import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FiShoppingCart, FiUser, FiLogOut, FiMenu, FiX, FiHome,
  FiPackage, FiSearch
} from "react-icons/fi";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [cartCount, setCartCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const userId = localStorage.getItem("userId");
  const isLoggedIn = !!userId;
  const isAdmin = localStorage.getItem("role") === "admin";

  const fetchCart = async () => {
    const uid = localStorage.getItem("userId");
    if (!uid) { setCartCount(0); return; }
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || "https://my-ecommerce-qcw9.onrender.com/api"}/cart/${uid}`,
        token ? { headers: { Authorization: `Bearer ${token}` } } : {}
      );
      const data = await res.json();
      const count = data?.items?.reduce((sum, i) => sum + i.quantity, 0) || 0;
      setCartCount(count);
    } catch {
      setCartCount(0);
    }
  };

  useEffect(() => {
    fetchCart();
    window.addEventListener("cartUpdated", fetchCart);
    return () => window.removeEventListener("cartUpdated", fetchCart);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300
        ${scrolled ? "bg-white/95 backdrop-blur-xl shadow-md" : "bg-white border-b border-gray-100"}`}
    >
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md">
            <FiShoppingCart className="text-white text-sm" />
          </div>
          <span className="font-black text-lg tracking-tight">
            <span className="text-gray-900">Gupta</span>
            <span className="text-indigo-600">Store</span>
          </span>
        </Link>

        {/* Center Nav Links (desktop) */}
        <nav className="hidden md:flex items-center gap-1">
          <Link to="/"
            className={`px-4 py-2 rounded-xl text-sm font-medium transition
              ${location.pathname === "/" ? "bg-indigo-50 text-indigo-700" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"}`}>
            Home
          </Link>
          {isAdmin && (
            <Link to="/admin"
              className={`px-4 py-2 rounded-xl text-sm font-medium transition
                ${location.pathname.startsWith("/admin") ? "bg-indigo-50 text-indigo-700" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"}`}>
              Admin
            </Link>
          )}
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-2">
          {/* Cart */}
          <Link to="/cart"
            className="relative p-2 rounded-xl hover:bg-gray-100 text-gray-600 transition">
            <FiShoppingCart className="text-xl" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-indigo-600
                text-white text-xs flex items-center justify-center font-bold shadow-md">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </Link>

          {/* Auth (desktop) */}
          {isLoggedIn ? (
            <div className="hidden md:flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600
                flex items-center justify-center text-white text-sm font-bold">
                U
              </div>
              <button onClick={logout}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium
                  text-gray-600 hover:bg-red-50 hover:text-red-600 transition">
                <FiLogOut /> Logout
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link to="/login"
                className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-700
                  hover:bg-gray-100 transition">
                Login
              </Link>
              <Link to="/signup"
                className="px-4 py-2 rounded-xl text-sm font-semibold
                  bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-200 transition">
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile Hamburger */}
          <button onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-xl hover:bg-gray-100 text-gray-600 transition">
            {menuOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1 shadow-lg">
          <Link to="/" className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-gray-700 hover:bg-gray-50 transition text-sm font-medium">
            <FiHome /> Home
          </Link>
          {isAdmin && (
            <Link to="/admin" className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-gray-700 hover:bg-gray-50 transition text-sm font-medium">
              <FiPackage /> Admin Panel
            </Link>
          )}
          <div className="border-t border-gray-100 pt-2 mt-2">
            {isLoggedIn ? (
              <button onClick={logout}
                className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-red-600
                  hover:bg-red-50 transition text-sm font-medium">
                <FiLogOut /> Logout
              </button>
            ) : (
              <>
                <Link to="/login" className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-gray-700 hover:bg-gray-50 transition text-sm font-medium">
                  <FiUser /> Login
                </Link>
                <Link to="/signup"
                  className="mt-1 w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl
                    bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
