import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import {
  FiTrash2, FiArrowRight, FiShoppingBag, FiMinus, FiPlus, FiArrowLeft
} from "react-icons/fi";

export default function Cart() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    if (!userId) { setLoading(false); return; }
    try {
      const res = await api.get(`/cart/${userId}`);
      setItems(res.data?.items || []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCart(); }, []);

  const updateQty = async (productId, qty) => {
    if (qty < 1) return removeItem(productId);
    try {
      await api.put("/cart/update", { userId, productId, quantity: qty });
      setItems(items.map(i =>
        (i.productId?._id || i.productId) === productId ? { ...i, quantity: qty } : i
      ));
      window.dispatchEvent(new Event("cartUpdated"));
    } catch { fetchCart(); }
  };

  const removeItem = async (productId) => {
    try {
      await api.delete("/cart/remove", { data: { userId, productId } });
      setItems(items.filter(i => (i.productId?._id || i.productId) !== productId));
      window.dispatchEvent(new Event("cartUpdated"));
    } catch { fetchCart(); }
  };

  const subtotal = items.reduce((s, i) => s + (i.productId?.price || 0) * i.quantity, 0);
  const totalQty = items.reduce((s, i) => s + i.quantity, 0);
  const shipping = 0;
  const total = subtotal + shipping;

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6 animate-pulse">
          <div className="lg:col-span-2 space-y-4">
            {[1,2,3].map(i => <div key={i} className="bg-white rounded-2xl h-28 border border-gray-100" />)}
          </div>
          <div className="bg-white rounded-2xl h-64 border border-gray-100" />
        </div>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Login to view your cart</h2>
        <p className="text-gray-500 mb-6">Your cart items will be saved after login.</p>
        <Link to="/login"
          className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3
            rounded-xl font-semibold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200">
          Sign In <FiArrowRight />
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">🛍️</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Browse our store and add items you love!</p>
        <Link to="/"
          className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3
            rounded-xl font-semibold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200">
          <FiShoppingBag /> Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center
            justify-center text-gray-600 hover:bg-gray-50 transition shadow-sm">
          <FiArrowLeft />
        </button>
        <div>
          <h1 className="text-2xl font-black text-gray-900">Your Cart</h1>
          <p className="text-sm text-gray-500">{items.length} item{items.length !== 1 ? "s" : ""}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Items */}
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => {
            const product = item.productId || {};
            const pid = product._id || item.productId;
            return (
              <div key={pid}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4
                  flex gap-4 hover:shadow-md transition-shadow">
                {/* Image */}
                <div className="w-20 h-20 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                  <img src={product.image} alt={product.title}
                    className="w-full h-full object-contain p-1"
                    onError={e => { e.target.style.display = "none"; }}
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-indigo-600 font-medium capitalize mb-0.5">{product.category}</p>
                  <p className="font-semibold text-gray-800 text-sm line-clamp-2">{product.title}</p>
                  <p className="text-lg font-black text-gray-900 mt-1">
                    ₹{((product.price || 0) * item.quantity).toLocaleString()}
                  </p>
                </div>

                {/* Controls */}
                <div className="flex flex-col items-end justify-between gap-2 flex-shrink-0">
                  <button onClick={() => removeItem(pid)}
                    className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 flex items-center
                      justify-center text-red-500 transition">
                    <FiTrash2 className="text-sm" />
                  </button>
                  <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                    <button onClick={() => updateQty(pid, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition text-gray-600">
                      <FiMinus className="text-xs" />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                    <button onClick={() => updateQty(pid, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition text-gray-600">
                      <FiPlus className="text-xs" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-20">
            <h3 className="font-bold text-gray-900 mb-5">Order Summary</h3>
            <div className="space-y-3 text-sm mb-5">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({totalQty} item{totalQty !== 1 ? "s" : ""})</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery</span>
                <span className="text-emerald-600 font-medium">Free</span>
              </div>
              <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-gray-900 text-base">
                <span>Total</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={() => navigate("/checkout-address")}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-indigo-600
                hover:bg-indigo-700 text-white rounded-xl font-semibold text-sm transition-all
                shadow-lg shadow-indigo-200 hover:-translate-y-0.5"
            >
              Proceed to Checkout <FiArrowRight />
            </button>

            <Link to="/"
              className="mt-3 w-full flex items-center justify-center gap-1.5 py-2.5
                text-indigo-600 text-sm font-medium hover:underline">
              <FiShoppingBag className="text-xs" /> Continue Shopping
            </Link>

            {/* Trust badges */}
            <div className="mt-5 pt-5 border-t border-gray-100 grid grid-cols-3 gap-2 text-center">
              {["🔒 Secure", "🚚 Free Ship", "↩️ Easy Return"].map(b => (
                <div key={b} className="text-xs text-gray-400 font-medium">{b}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
