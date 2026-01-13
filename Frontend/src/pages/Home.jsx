import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

export default function Home() {
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("");

  // Load all products once
  const loadProducts = async () => {
    try {
      const res = await api.get("/products");
      setAllProducts(res.data);
      setFilteredProducts(res.data);
    } catch (err) {
      console.error("Failed to load products", err);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Frontend filtering
  useEffect(() => {
    let data = [...allProducts];

    if (activeCategory) {
      data = data.filter(
        (p) => p.category?.toLowerCase() === activeCategory.toLowerCase()
      );
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(
        (p) =>
          p.category.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q)
      );
    }

    setFilteredProducts(data);
  }, [search, activeCategory, allProducts]);

  // Add to cart
  const addToCart = async (productId) => {
    const userId = localStorage.getItem("userId");
    if (!userId) return alert("Please login first");

    try {
      await api.post("/cart/add", { userId, productId, quantity: 1 });
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      console.error("Add to cart failed", err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">

      {/* 🔍 Search & Categories */}
      <div className="bg-white rounded-2xl shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search laptops, mobiles, tablets..."
            className="w-full md:flex-1 px-4 py-3 border rounded-xl
                       focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <div className="flex gap-3 overflow-x-auto">
            {["", "Laptop", "Mobile", "Tablet"].map((cat) => (
              <button
                key={cat || "all"}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm border whitespace-nowrap transition
                  ${
                    activeCategory === cat
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                {cat === "" ? "All" : cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <h1 className="text-2xl font-bold mb-4">Products</h1>
      {/* 🛍️ Product Grid */}
      {filteredProducts.length === 0 ? (
        <p className="text-center text-gray-500">No products found</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredProducts.map((item) => (
            <div
              key={item._id}
              className="group bg-white rounded-2xl p-3 flex flex-col
                         shadow-[0_8px_25px_rgba(0,0,0,0.08)]
                         hover:shadow-[0_18px_45px_rgba(0,0,0,0.18)]
                         transition-all duration-300
                         hover:-translate-y-1 h-full"
            >
              {/* Image */}
              <div className="bg-gray-50 rounded-xl h-36  sm:h-56 md:h-64 flex items-center justify-center overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="max-h-full object-contain
                             transition-transform duration-300
                             group-hover:scale-105"
                />
              </div>

              {/* Details */}
              <div className="mt-3 flex-grow">
                <h3 className="font-semibold text-sm sm:text-base text-gray-800 line-clamp-2">
                  {item.title}
                </h3>

                <p className="text-xs sm:text-sm text-gray-500 capitalize mt-1">
                  {item.category}
                </p>

                <p className="font-bold text-base sm:text-lg text-blue-600 mt-2">
                  ₹{item.price}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-4">
                <Link
                  to={`/product/${item._id}`}
                  className="flex-1 text-center text-sm py-2.5
                             border border-gray-300 rounded-lg
                             hover:bg-gray-100 transition"
                >
                  View Details
                </Link>

                <button
                  onClick={() => addToCart(item._id)}
                  className="flex-1 text-sm py-2.5
                             bg-blue-600 text-white rounded-lg
                             hover:bg-blue-700 transition"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


