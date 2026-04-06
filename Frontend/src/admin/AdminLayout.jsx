import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  FiGrid, FiPackage, FiPlusCircle, FiShoppingCart,
  FiUsers, FiSettings, FiLogOut, FiMenu, FiX,
  FiTrendingUp, FiChevronRight, FiBell
} from "react-icons/fi";

const navItems = [
  { icon: FiGrid, label: "Dashboard", to: "/admin" },
  { icon: FiPackage, label: "Products", to: "/admin/products" },
  { icon: FiPlusCircle, label: "Add Product", to: "/admin/products/add" },
  { icon: FiShoppingCart, label: "Orders", to: "/admin/orders" },
  { icon: FiUsers, label: "Customers", to: "/admin/customers" },
  { icon: FiTrendingUp, label: "Analytics", to: "/admin/analytics" },
  { icon: FiSettings, label: "Settings", to: "/admin/settings" },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const isActive = (path) =>
    path === "/admin"
      ? location.pathname === "/admin"
      : location.pathname.startsWith(path) && path !== "/admin";

  return (
    <div className="min-h-screen bg-[#f4f6fb] flex font-sans">
      {/* Sidebar Overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-[#0f172a] z-40 flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-6 h-16 border-b border-white/10">
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

</Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <FiX />
          </button>
        </div>

        {/* Admin Badge */}
        <div className="px-4 py-3">
          <div className="bg-white/5 rounded-xl px-3 py-2.5 flex items-center gap-3 border border-white/10">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm shadow">
              A
            </div>
            <div>
              <p className="text-white text-sm font-semibold">Admin Panel</p>
              <p className="text-gray-400 text-xs">Super Administrator</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-2 space-y-0.5 overflow-y-auto">
          <p className="text-gray-500 text-xs font-semibold uppercase tracking-widest px-3 py-2 mt-2">
            Main Menu
          </p>
          {navItems.map(({ icon: Icon, label, to }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                transition-all duration-200 group relative
                ${isActive(to)
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/50"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
            >
              <Icon className={`text-base flex-shrink-0 ${isActive(to) ? "text-white" : "text-gray-500 group-hover:text-indigo-400"}`} />
              <span>{label}</span>
              {isActive(to) && (
                <FiChevronRight className="ml-auto text-indigo-300 text-xs" />
              )}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-4 pb-5 border-t border-white/10 pt-4">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
              text-gray-400 hover:bg-red-500/10 hover:text-red-400
              transition-all duration-200 text-sm font-medium"
          >
            <FiLogOut />
            <span>Logout</span>
          </button>
          <Link
            to="/"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
              text-gray-400 hover:bg-white/5 hover:text-white
              transition-all duration-200 text-sm font-medium mt-1"
          >
            <FiShoppingCart />
            <span>View Store</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-64 min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-gray-200/80 shadow-sm">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl hover:bg-gray-100 text-gray-600 transition"
            >
              <FiMenu className="text-xl" />
            </button>
            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500">
              <span className="text-gray-400">Admin</span>
              <FiChevronRight className="text-xs" />
              <span className="text-gray-800 font-medium capitalize">
                {location.pathname.split("/").filter(Boolean).pop() || "Dashboard"}
              </span>
            </div>
            <div className="ml-auto flex items-center gap-3">
              <button className="relative p-2 rounded-xl hover:bg-gray-100 text-gray-600 transition">
                <FiBell className="text-xl" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500"></span>
              </button>
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
