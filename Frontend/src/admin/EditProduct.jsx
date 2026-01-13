import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate, useParams } from "react-router-dom";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    image: "",
    stock: "",
  });

  const loadProduct = async () => {
    try {
      const res = await api.get(`/products/${id}`);
      setForm({
        title: res.data.title || "",
        description: res.data.description || "",
        price: res.data.price?.toString() || "",
        category: res.data.category || "",
        image: res.data.image || "",
        stock: res.data.stock?.toString() || "",
      });
    } catch (error) {
      console.error(error);
      alert("Product not found");
    }
  };

  useEffect(() => {
    loadProduct();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/products/update/${id}`, {
        title: form.title,
        description: form.description,
        price: Number(form.price),
        category: form.category,
        image: form.image,
        stock: Number(form.stock),
      });
      alert("Product updated successfully");
      navigate("/admin/products");
    } catch (error) {
      console.error("Update error:", error.response?.data || error);
      alert("Update failed");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white p-6 shadow rounded">
      <h2 className="text-2xl font-bold mb-6">Edit Product</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        {Object.keys(form).map((key) => (
          <input
            key={key}
            name={key}
            value={form[key]}
            onChange={handleChange}
            placeholder={key}
            className="w-full p-2 border rounded"
          />
        ))}
        <button className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          Update Product
        </button>
      </form>
    </div>
  );
}
