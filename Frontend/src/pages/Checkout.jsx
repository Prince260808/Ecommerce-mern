import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import api from "../api/axios";

export default function Checkout() {
  const userId = localStorage.getItem("userId");
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Load cart and addresses
  useEffect(() => {
    if (!userId) {
      navigate("/");
      return;
    }

    api.get(`/cart/${userId}`)
      .then((res) => setCart(res.data))
      .catch((err) => console.error("CART FETCH ERROR:", err));

    api.get(`/address/${userId}`)
      .then((res) => {
        setAddresses(res.data);
        if (res.data.length > 0) setSelectedAddress(res.data[0]); // default address
      })
      .catch((err) => console.error("ADDRESS FETCH ERROR:", err));
  }, [userId, navigate]);

  if (!cart || !cart.items) return <div>Loading...</div>;

  const total = cart.items.reduce((sum, item) => {
    if (!item.productId || !item.productId.price) return sum;
    return sum + item.quantity * item.productId.price;
  }, 0);

  const placeOrder = async () => {
    if (!selectedAddress) {
      alert("Please select an address");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/order/place-order", {
        userId,
        address: selectedAddress,
      });

      const orderId = res.data.orderId;

      // Clear cart in frontend
      setCart({ ...cart, items: [] });

      // Redirect to order success page
      navigate(`/order-success/${orderId}`);
    } catch (error) {
      console.error("PLACE ORDER ERROR:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>

      <h2 className="text-xl font-semibold mb-2">Select Address</h2>
      {addresses.length === 0 && <p>No addresses found. Please add one first.</p>}
      {addresses.map((addr) => (
        <label
          key={addr._id}
          className="block border p-3 rounded cursor-pointer mb-2"
        >
          <input
            type="radio"
            name="address"
            checked={selectedAddress?._id === addr._id}
            onChange={() => setSelectedAddress(addr)}
            className="mr-2"
          />
          <strong>{addr.fullName}</strong>
          <p className="text-sm">
            {addr.addressLine}, {addr.city}, {addr.state} - {addr.pincode}
          </p>
          <p className="text-sm">Phone: {addr.phone}</p>
        </label>
      ))}

      <h2 className="font-semibold mt-4 mb-2">Order Summary</h2>
      <p className="text-sm mb-2">Items: {cart.items.length}</p>
      <p className="font-bold text-2xl mb-4">Total Amount: ₹{total}</p>

      <button
        onClick={placeOrder}
        disabled={loading}
        className={`mt-4 w-full p-2 rounded text-white ${
          loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-500"
        }`}
      >
        {loading ? "Placing Order..." : "Place Order (COD)"}
      </button>
    </div>
  );
}
