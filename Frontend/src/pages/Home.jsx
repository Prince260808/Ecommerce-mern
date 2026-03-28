import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { FiChevronLeft, FiChevronRight, FiShoppingCart, FiEye, FiStar, FiZap } from "react-icons/fi";

// ── Hero Slider ──────────────────────────────────────────────────────────────
const HERO_SLIDES = [
  {
    title: "Next-Gen Tech\nat Your Fingertips",
    subtitle: "Shop the latest laptops, mobiles & tablets with unbeatable deals",
    gradient: "from-indigo-700 via-indigo-600 to-violet-700",
    emoji: "💻",
    badge: "New Arrivals",
    cta: "Shop Now",
  },
  {
    title: "Premium Mobiles\nBig Savings",
    subtitle: "Explore flagship smartphones from top brands at the best prices",
    gradient: "from-rose-600 via-pink-600 to-fuchsia-700",
    emoji: "📱",
    badge: "Hot Deals",
    cta: "Explore Phones",
  },
  {
    title: "Free Delivery\nOn All Orders",
    subtitle: "Enjoy fast, free shipping on every order — no minimum required",
    gradient: "from-emerald-600 via-teal-600 to-cyan-700",
    emoji: "🚀",
    badge: "Limited Time",
    cta: "Start Shopping",
  },
];

function HeroSlider() {
  const [active, setActive] = useState(0);
  const timerRef = useRef(null);

  const go = (idx) => setActive((idx + HERO_SLIDES.length) % HERO_SLIDES.length);

  useEffect(() => {
    timerRef.current = setInterval(() => setActive(a => (a + 1) % HERO_SLIDES.length), 5000);
    return () => clearInterval(timerRef.current);
  }, []);

  const s = HERO_SLIDES[active];

  return (
    <div className={`relative rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-br ${s.gradient}
      text-white mb-8 shadow-2xl transition-all duration-700 min-h-[220px] sm:min-h-[280px]`}>
      {/* Decorative circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-60 h-60 rounded-full bg-white/5 blur-2xl" />
        {[0,1,2,3].map(i => (
          <div key={i} className="absolute rounded-full border border-white/10"
            style={{ width: 60 + i*40, height: 60 + i*40, top: `${15+i*5}%`, right: `${8+i*2}%` }}
          />
        ))}
      </div>

      <div className="relative flex items-center justify-between h-full px-6 sm:px-12 py-8 sm:py-12">
        <div className="max-w-lg">
          <span className="inline-block bg-white/20 border border-white/30 text-white text-xs font-bold
            uppercase tracking-widest px-3 py-1 rounded-full mb-4 backdrop-blur-sm">
            ✨ {s.badge}
          </span>
          <h1 className="text-2xl sm:text-4xl font-black leading-tight whitespace-pre-line mb-3">
            {s.title}
          </h1>
          <p className="text-white/80 text-sm sm:text-base mb-6 max-w-sm">{s.subtitle}</p>
          <button className="inline-flex items-center gap-2 bg-white text-indigo-700 font-bold
            px-6 py-3 rounded-xl shadow-xl hover:shadow-2xl hover:-translate-y-0.5
            transition-all duration-200 text-sm">
            {s.cta} <FiChevronRight />
          </button>
        </div>
        <div className="hidden sm:flex text-7xl sm:text-9xl items-center justify-center
          flex-shrink-0 select-none drop-shadow-2xl">
          {s.emoji}
        </div>
      </div>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {HERO_SLIDES.map((_, i) => (
          <button key={i} onClick={() => go(i)}
            className={`rounded-full transition-all duration-300
              ${i === active ? "w-6 h-2 bg-white" : "w-2 h-2 bg-white/40 hover:bg-white/60"}`}
          />
        ))}
      </div>

      {/* Arrows */}
      <button onClick={() => go(active - 1)}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full
          bg-white/20 hover:bg-white/35 backdrop-blur-sm flex items-center justify-center
          text-white transition border border-white/20 shadow-lg">
        <FiChevronLeft />
      </button>
      <button onClick={() => go(active + 1)}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full
          bg-white/20 hover:bg-white/35 backdrop-blur-sm flex items-center justify-center
          text-white transition border border-white/20 shadow-lg">
        <FiChevronRight />
      </button>
    </div>
  );
}

// ── Product Card ─────────────────────────────────────────────────────────────
function ProductCard({ item, onAddToCart }) {
  const [added, setAdded] = useState(false);

  const handleAdd = async () => {
    await onAddToCart(item._id);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100
      hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
      {/* Image */}
      <div className="relative bg-gray-50 h-44 sm:h-52 flex items-center justify-center overflow-hidden p-4">
        <img src={item.image} alt={item.title}
          className="max-h-full object-contain group-hover:scale-105 transition-transform duration-500"
          onError={e => { e.target.src = ""; }}
        />
        {item.stock === 0 && (
          <div className="absolute top-3 left-3 bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-full">
            Out of Stock
          </div>
        )}
        {item.stock > 0 && item.stock <= 5 && (
          <div className="absolute top-3 left-3 bg-orange-100 text-orange-600 text-xs font-bold px-2 py-1 rounded-full">
            Only {item.stock} left!
          </div>
        )}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Link to={`/product/${item._id}`}
            className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center
              text-gray-600 hover:text-indigo-600 transition">
            <FiEye className="text-sm" />
          </Link>
        </div>
      </div>

      {/* Details */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide mb-1 capitalize">
          {item.category}
        </p>
        <h3 className="font-semibold text-sm text-gray-800 line-clamp-2 flex-1 leading-snug">
          {item.title}
        </h3>
        <div className="flex items-center gap-1 mt-2 mb-3">
          {[1,2,3,4,5].map(s => (
            <FiStar key={s} className="text-amber-400 text-xs fill-amber-400" />
          ))}
          <span className="text-xs text-gray-400 ml-1">(4.5)</span>
        </div>
        <p className="font-black text-lg text-gray-900">
          ₹{item.price?.toLocaleString()}
        </p>

        {/* Actions */}
        <div className="flex gap-2 mt-3">
          <Link to={`/product/${item._id}`}
            className="flex-1 text-center text-xs sm:text-sm py-2.5
              border border-gray-200 rounded-xl font-medium text-gray-700
              hover:bg-gray-50 hover:border-gray-300 transition">
            Details
          </Link>
          <button onClick={handleAdd}
            disabled={item.stock === 0}
            className={`flex-1 text-xs sm:text-sm py-2.5 rounded-xl font-semibold
              flex items-center justify-center gap-1.5 transition-all duration-200
              ${item.stock === 0
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : added
                  ? "bg-emerald-600 text-white"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200 hover:-translate-y-0.5"
              }`}>
            {added ? "✓ Added" : <><FiShoppingCart className="text-xs" /> Add</>}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Home ─────────────────────────────────────────────────────────────────
const CATEGORIES = ["", "Laptop", "Mobile", "Tablet", "Electronics", "Accessories"];
const CAT_ICONS = { "": "🛍️", Laptop: "💻", Mobile: "📱", Tablet: "🖥️", Electronics: "⚡", Accessories: "🎧" };

export default function Home() {
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/products")
      .then(res => { setAllProducts(res.data); setFilteredProducts(res.data); })
      .catch(err => console.error("Failed to load products", err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let data = [...allProducts];
    if (activeCategory) {
      data = data.filter(p => p.category?.toLowerCase() === activeCategory.toLowerCase() ||
        p.title?.toLowerCase().includes(activeCategory.toLowerCase()));
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(p =>
        p.title?.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q));
    }
    setFilteredProducts(data);
  }, [search, activeCategory, allProducts]);

  const addToCart = async (productId) => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) {
      alert("Please log in again — your session has expired.");
      return;
    }
    try {
      await api.post("/cart/add", { userId, productId, quantity: 1 });
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      console.group("%c=== CART ADD FAILED ===", "color:red;font-size:14px");
      console.log("HTTP Status:", err.response?.status);
      console.log("Server message:", err.response?.data);
      console.log("userId in localStorage:", localStorage.getItem("userId"));
      console.log("token present:", !!localStorage.getItem("token"));
      console.groupEnd();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
      {/* Hero */}
      <HeroSlider />

      {/* Features Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { icon: "🚚", label: "Free Delivery", sub: "On all orders" },
          { icon: "🔒", label: "Secure Payment", sub: "100% protected" },
          { icon: "↩️", label: "Easy Returns", sub: "7-day policy" },
          { icon: "🎧", label: "24/7 Support", sub: "Always here" },
        ].map(({ icon, label, sub }) => (
          <div key={label} className="bg-white rounded-xl sm:rounded-2xl px-3 py-3 flex items-center gap-3
            shadow-sm border border-gray-100 hover:shadow-md transition">
            <span className="text-2xl flex-shrink-0">{icon}</span>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-bold text-gray-800 truncate">{label}</p>
              <p className="text-xs text-gray-400 hidden sm:block">{sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg">🔍</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search laptops, mobiles, tablets..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200
                focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400
                outline-none text-sm transition"
            />
          </div>
          <div className="flex gap-2 flex-wrap sm:flex-nowrap">
            {CATEGORIES.map(cat => (
              <button key={cat || "all"}
                onClick={() => setActiveCategory(cat)}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold
                  whitespace-nowrap transition-all duration-200
                  ${activeCategory === cat
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                <span className="text-base">{CAT_ICONS[cat]}</span>
                {cat === "" ? "All" : cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Section Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900">
            {activeCategory ? `${activeCategory}s` : "All Products"}
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {filteredProducts.length} products found
          </p>
        </div>
        {search && (
          <button onClick={() => setSearch("")}
            className="text-sm text-indigo-600 hover:underline font-medium">
            Clear search
          </button>
        )}
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {[1,2,3,4,5,6,7,8].map(i => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
              <div className="bg-gray-200 h-48" />
              <div className="p-4 space-y-3">
                <div className="h-3 bg-gray-200 rounded w-1/3" />
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-2/3" />
                <div className="h-6 bg-gray-200 rounded w-1/2" />
                <div className="grid grid-cols-2 gap-2">
                  <div className="h-10 bg-gray-200 rounded-xl" />
                  <div className="h-10 bg-gray-200 rounded-xl" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-gray-600 font-semibold text-lg">No products found</p>
          <p className="text-gray-400 text-sm mt-1">Try a different search or category</p>
          <button onClick={() => { setSearch(""); setActiveCategory(""); }}
            className="mt-5 text-indigo-600 hover:underline font-medium text-sm">
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredProducts.map(item => (
            <ProductCard key={item._id} item={item} onAddToCart={addToCart} />
          ))}
        </div>
      )}
    </div>
  );
}
