import { useEffect, useState } from "react";
import api from "../api/axios";
import { FiMinus, FiPlus, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router";

export default function Cart() {
  const userId = localStorage.getItem("userId");
  const [cart, setCart] = useState(null);
  const navigate = useNavigate();
  // Load cart
  const loadCart = async () => {
    if (!userId) return;
    const res = await api.get(`/cart/${userId}`);
    setCart(res.data);
  };

  useEffect(() => {
    loadCart();
  }, []);

  // Remove item
  const removeItem = async (productId) => {
    await api.post("/cart/remove", { userId, productId });
    loadCart();
    window.dispatchEvent(new Event("cartUpdated"));
  };

  // Update quantity
  const updateQty = async (productId, quantity) => {
    if (quantity === 0) {
      await removeItem(productId);
      return;
    }

    await api.post("/cart/update", { userId, productId, quantity });
    loadCart();
    window.dispatchEvent(new Event("cartUpdated"));
  };

  if (!cart) return <div className="p-6 text-center">Loading...</div>;

  const total = cart.items.reduce(
    (sum, item) => sum + (item.productId?.price || 0) * item.quantity,
    0
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

      {cart.items.length === 0 ? (
        <p className="text-center text-gray-500">Your cart is empty</p>
      ) : (
        <>
          {/* Cart Items */}
          <div className="space-y-4">
            {cart.items.map((item) => (
              <div
                key={item.productId?._id}
                className="flex flex-col sm:flex-row gap-4
                           bg-white rounded-2xl p-4
                           shadow-[0_8px_25px_rgba(0,0,0,0.08)]"
              >
                {/* Image */}
                <div className="w-full sm:w-28 h-28 bg-gray-50 rounded-xl flex items-center justify-center">
                  <img
                    src={item.productId?.image}
                    alt={item.productId?.title}
                    className="h-20 object-contain"
                  />
                </div>

                {/* Details */}
                <div className="flex-1">
                  <h2 className="font-semibold text-lg">
                    {item.productId?.title}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {item.productId?.category}
                  </p>
                  <p className="font-bold text-blue-600 mt-1">
                    ₹{item.productId?.price}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex sm:flex-col items-center justify-between sm:justify-center gap-3">
                  {/* Quantity */}
                  <div className="flex items-center border rounded-lg overflow-hidden">
                    <button
                      onClick={() =>
                        updateQty(
                          item.productId._id,
                          item.quantity - 1
                        )
                      }
                      className="px-3 py-2 hover:bg-gray-100 transition"
                    >
                      <FiMinus />
                    </button>

                    <span className="px-4 font-medium">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() =>
                        updateQty(
                          item.productId._id,
                          item.quantity + 1
                        )
                      }
                      className="px-3 py-2 hover:bg-gray-100 transition"
                    >
                      <FiPlus />
                    </button>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeItem(item.productId._id)}
                    className="text-red-500 hover:text-red-600
                               flex items-center gap-1 text-sm"
                  >
                    <FiTrash2 />
                    <span className="hidden sm:inline">Remove</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="mt-6 bg-white rounded-2xl p-5
                          shadow-[0_8px_25px_rgba(0,0,0,0.08)]">
            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span className="text-blue-600">₹{total}</span>
            </div>

            <button onClick={()=> navigate("/checkout-address")}
              className="w-full mt-4 bg-blue-600 text-white py-3 rounded-xl
                         hover:bg-blue-700 transition"
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}

