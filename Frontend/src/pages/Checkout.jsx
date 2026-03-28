import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import {
  FiArrowLeft, FiCreditCard, FiSmartphone, FiDollarSign,
  FiMapPin, FiLock, FiCheck
} from "react-icons/fi";

const PAYMENT_METHODS = [
  { id: "upi", label: "UPI", icon: FiSmartphone, desc: "Pay via UPI apps" },
  { id: "card", label: "Credit / Debit Card", icon: FiCreditCard, desc: "All major cards accepted" },
  { id: "cod", label: "Cash on Delivery", icon: FiDollarSign, desc: "Pay when delivered" },
];

export default function Checkout() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const [items, setItems] = useState([]);
  const [address, setAddress] = useState(null);
  const [payMethod, setPayMethod] = useState("upi");
  const [upiId, setUpiId] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!userId) { navigate("/login"); return; }
    const addr = sessionStorage.getItem("shippingAddress");
    if (!addr) { navigate("/checkout-address"); return; }
    setAddress(JSON.parse(addr));

    api.get(`/cart/${userId}`)
      .then(res => setItems(res.data?.items || []))
      .catch(() => navigate("/cart"))
      .finally(() => setFetching(false));
  }, []);

  const subtotal = items.reduce((s, i) => s + (i.productId?.price || 0) * i.quantity, 0);
  const totalQty = items.reduce((s, i) => s + i.quantity, 0);

  const placeOrder = async () => {
    if (payMethod === "upi" && !upiId.trim()) {
      alert("Please enter your UPI ID");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/order/place-order", {
        userId,
        address: {
          fullName: address.fullName || address.name,
          phone: address.phone,
          addressLine: address.addressLine || [address.addressLine1, address.addressLine2].filter(Boolean).join(", "),
          city: address.city,
          state: address.state,
          pincode: address.pincode,
        },
      });

      sessionStorage.removeItem("shippingAddress");
      window.dispatchEvent(new Event("cartUpdated"));
      navigate(`/order-success/${res.data?.orderId || "success"}`);
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to place order. Try again.";
      alert(msg);
      console.error("Order error:", err.response?.data ?? err);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 animate-pulse">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {[1,2,3].map(i => <div key={i} className="bg-white rounded-2xl h-24 border border-gray-100" />)}
          </div>
          <div className="bg-white rounded-2xl h-64 border border-gray-100" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link to="/checkout-address"
          className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center
            justify-center text-gray-600 hover:bg-gray-50 transition shadow-sm">
          <FiArrowLeft />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-gray-900">Checkout</h1>
          <p className="text-sm text-gray-500">Review & place your order</p>
        </div>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2 mb-6">
        {["Cart", "Address", "Payment"].map((step, i) => (
          <div key={step} className="flex items-center gap-2 flex-1">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold
              ${i === 2 ? "bg-indigo-600 text-white" : "bg-emerald-500 text-white"}`}>
              {i < 2 ? "✓" : i + 1}
            </div>
            <span className={`text-xs font-medium hidden sm:block ${i === 2 ? "text-indigo-600" : "text-gray-400"}`}>{step}</span>
            {i < 2 && <div className="flex-1 h-px bg-emerald-200" />}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {/* Delivery Address */}
          {address && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <FiMapPin className="text-indigo-500" /> Delivery Address
                </h3>
                <Link to="/checkout-address" className="text-xs text-indigo-600 hover:underline font-medium">
                  Change
                </Link>
              </div>
              <div className="bg-indigo-50/50 rounded-xl p-3 text-sm text-gray-700 space-y-0.5">
                <p className="font-semibold">{address.name} · {address.phone}</p>
                <p>{address.addressLine1}{address.addressLine2 ? `, ${address.addressLine2}` : ""}</p>
                <p>{address.city}, {address.state} – {address.pincode}</p>
                <span className="inline-block bg-indigo-100 text-indigo-700 text-xs px-2 py-0.5 rounded-full font-medium mt-1">
                  {address.type}
                </span>
              </div>
            </div>
          )}

          {/* Payment Method */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-4">
              <FiLock className="text-indigo-500" /> Payment Method
            </h3>
            <div className="space-y-2.5">
              {PAYMENT_METHODS.map(({ id, label, icon: Icon, desc }) => (
                <button key={id} type="button"
                  onClick={() => setPayMethod(id)}
                  className={`w-full flex items-center gap-3 p-3.5 rounded-xl border transition text-left
                    ${payMethod === id
                      ? "border-indigo-500 bg-indigo-50 ring-1 ring-indigo-300"
                      : "border-gray-200 hover:border-indigo-200"}`}>
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0
                    ${payMethod === id ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-500"}`}>
                    <Icon className="text-base" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800">{label}</p>
                    <p className="text-xs text-gray-400">{desc}</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0
                    ${payMethod === id ? "border-indigo-600 bg-indigo-600" : "border-gray-300"}`}>
                    {payMethod === id && <FiCheck className="text-white text-xs" />}
                  </div>
                </button>
              ))}
            </div>

            {/* UPI Input */}
            {payMethod === "upi" && (
              <div className="mt-4">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">UPI ID</label>
                <input
                  value={upiId}
                  onChange={e => setUpiId(e.target.value)}
                  placeholder="yourname@upi"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200
                    focus:outline-none focus:ring-2 focus:ring-indigo-300 text-sm"
                />
              </div>
            )}
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-bold text-gray-800 mb-4">Order Items ({items.length})</h3>
            <div className="space-y-3">
              {items.map((item, i) => {
                const product = item.productId || {};
                return (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <img src={product.image} alt={product.title}
                        className="w-full h-full object-contain p-1"
                        onError={e => { e.target.style.display = "none"; }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{product.title}</p>
                      <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-bold text-gray-900 flex-shrink-0">
                      ₹{((product.price || 0) * item.quantity).toLocaleString()}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-20">
            <h3 className="font-bold text-gray-900 mb-5">Price Details</h3>
            <div className="space-y-3 text-sm mb-5">
              <div className="flex justify-between text-gray-600">
                <span>MRP ({totalQty} item{totalQty !== 1 ? "s" : ""})</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Charges</span>
                <span className="text-emerald-600 font-medium">Free</span>
              </div>
              <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-gray-900 text-base">
                <span>Total Amount</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={placeOrder}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-indigo-600
                hover:bg-indigo-700 disabled:opacity-70 text-white rounded-xl font-semibold
                text-sm transition-all shadow-lg shadow-indigo-200 hover:-translate-y-0.5"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Placing Order...
                </>
              ) : (
                <><FiLock className="text-sm" /> Place Order</>
              )}
            </button>

            <p className="text-center text-xs text-gray-400 mt-3 flex items-center justify-center gap-1">
              <FiLock className="text-xs" /> 100% Secure Checkout
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
