import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router";

export default function CheckoutAddress() {
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    addressLine: "",
    city: "",
    state: "",
    pincode: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const saveAddress = async () => {
    if (!userId) {
      alert("User not logged in");
      return;
    }

    await api.post("/address/add", {
      userId,
      ...form
    });

    navigate("/checkout");
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Delivery Address</h1>

      {Object.keys(form).map((key) => (
        <input
          key={key}
          name={key}
          placeholder={key}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded mb-2"
        />
      ))}

      <button
        onClick={saveAddress}
        className="w-full bg-blue-500 text-white p-2 rounded"
      >
        Save Address
      </button>
    </div>
  );
}
