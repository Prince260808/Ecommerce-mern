import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FiCheckCircle, FiHome, FiPackage, FiArrowRight } from "react-icons/fi";

export default function OrderSuccess() {
  const { id } = useParams();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-emerald-50 via-white to-indigo-50/30
      flex items-center justify-center px-4 py-10">
      <div
        className={`w-full max-w-md text-center transition-all duration-700
          ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      >
        {/* Success Icon */}
        <div className="relative inline-flex items-center justify-center mb-6">
          <div className="w-28 h-28 rounded-full bg-emerald-100 flex items-center justify-center">
            <FiCheckCircle className="text-emerald-600 text-6xl" />
          </div>
          {/* Ripple */}
          <div className="absolute inset-0 rounded-full bg-emerald-400/20 animate-ping" />
        </div>

        <h1 className="text-3xl font-black text-gray-900 mb-2">Order Placed! 🎉</h1>
        <p className="text-gray-500 text-base mb-1">
          Your order has been placed successfully.
        </p>
        {id && id !== "success" && (
          <p className="text-sm text-gray-400 mb-6">
            Order ID: <span className="font-mono font-semibold text-gray-600">#{id.slice(-8).toUpperCase()}</span>
          </p>
        )}

        {/* Info Cards */}
        <div className="grid grid-cols-3 gap-3 mb-8 mt-6">
          {[
            { icon: "📦", label: "Processing", desc: "Order confirmed" },
            { icon: "🚚", label: "Shipping", desc: "Within 24 hrs" },
            { icon: "🏠", label: "Delivery", desc: "3–5 business days" },
          ].map(({ icon, label, desc }) => (
            <div key={label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="text-2xl mb-1.5">{icon}</div>
              <p className="text-xs font-bold text-gray-800">{label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link to="/"
            className="flex-1 flex items-center justify-center gap-2 py-3.5 border border-gray-300
              rounded-xl text-gray-700 text-sm font-semibold hover:bg-gray-50 transition">
            <FiHome /> Back to Home
          </Link>
          <Link to="/"
            className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-indigo-600
              hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold
              shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5">
            <FiPackage /> Continue Shopping <FiArrowRight className="text-xs" />
          </Link>
        </div>

        <p className="text-xs text-gray-400 mt-5">
          A confirmation will be sent to your registered email.
        </p>
      </div>
    </div>
  );
}
