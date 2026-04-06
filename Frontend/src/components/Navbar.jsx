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

{/* Badge icon */}
<div
  style={{ borderRadius: 10, background: "#3730A3" }}
  className="w-9 h-9 flex items-center justify-center flex-shrink-0 relative overflow-hidden"
>
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
    {/* Phone shell */}
    <rect x="11" y="5" width="14" height="24" rx="3" fill="#312E81" />
    {/* Screen */}
    <rect x="13" y="8" width="10" height="16" rx="1.5" fill="#818CF8" />
    {/* Camera dot */}
    <circle cx="18" cy="7" r="1" fill="#3730A3" />
    {/* Home bar */}
    <rect x="15" y="27" width="6" height="1.2" rx="0.6" fill="#3730A3" />
    {/* Lightning bolt */}
    <polygon points="22,17 19.5,22 21.5,22 19,27 24,21 21.5,21" fill="#C7D2FE" />
  </svg>
</div>

{/* Wordmark */}
<div className="flex flex-col gap-0.5">
  <span
    style={{
      fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
      fontWeight: 800,
      fontSize: 20,
      letterSpacing: "-0.04em",
      lineHeight: 1,
    }}
  >
    <span style={{ color: "#1E1B4B" }}></span>
    <span
      style={{
        display: "inline-block",
        width: 5,
        height: 5,
        borderRadius: "50%",
        background: "#818CF8",
        marginBottom: 6,
        verticalAlign: "bottom",
      }}
    />
    <span style={{ color: "#4338CA" }}>Buy-Ease</span>
  </span>

  {/* Two-tone underline bar */}
  <div className="flex h-0.5 w-full overflow-hidden" style={{ borderRadius: 1 }}>
    <div className="flex-1" style={{ background: "#1E1B4B" }} />
    <div className="flex-1" style={{ background: "#4338CA" }} />
  </div>
</div>

</Link>     {/* Center Nav Links (desktop) */}
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
