import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  FiArrowLeft, FiPackage, FiDollarSign, FiTag, FiImage,
  FiAlignLeft, FiHash, FiCheck, FiAlertCircle, FiSave
} from "react-icons/fi";

const CATEGORIES = ["Electronics", "Laptop", "Mobile", "Tablet", "Accessories", "Other"];

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "", description: "", price: "", category: "", image: "", stock: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    api.get(`/products/${id}`)
      .then(res => {
        const d = res.data;
        setForm({
          title: d.title || "", description: d.description || "",
          price: d.price?.toString() || "", category: d.category || "",
          image: d.image || "", stock: d.stock?.toString() || "",
        });
      })
      .catch(() => setErrors({ fetch: "Product not found" }))
      .finally(() => setFetching(false));
  }, [id]);

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0) e.price = "Valid price is required";
    if (!form.stock || isNaN(form.stock) || Number(form.stock) < 0) e.stock = "Valid stock is required";
    if (!form.category) e.category = "Category is required";
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (errors[name]) setErrors(er => ({ ...er, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await api.put(`/products/update/${id}`, {
        title: form.title, description: form.description,
        price: Number(form.price), category: form.category,
        image: form.image, stock: Number(form.stock),
      });
      setSuccess(true);
      setTimeout(() => navigate("/admin/products"), 1500);
    } catch (err) {
      setErrors({ submit: err.response?.data?.message || "Update failed" });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-4 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3" />
          <div className="h-48 bg-gray-100 rounded-xl" />
          {[1,2,3,4].map(i => <div key={i} className="h-12 bg-gray-100 rounded-xl" />)}
        </div>
      </div>
    );
  }

  if (errors.fetch) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <FiAlertCircle className="text-5xl text-red-400 mx-auto mb-4" />
        <p className="text-gray-600 font-medium">Product not found</p>
        <Link to="/admin/products" className="mt-4 inline-block text-indigo-600 hover:underline text-sm">
          ← Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <Link to="/admin/products"
          className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center
            justify-center text-gray-600 hover:bg-gray-50 transition shadow-sm">
          <FiArrowLeft />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
          <p className="text-sm text-gray-500 truncate max-w-xs">{form.title}</p>
        </div>
      </div>

      {success && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
            <FiCheck className="text-emerald-600" />
          </div>
          <div>
            <p className="font-semibold text-emerald-800 text-sm">Product updated successfully!</p>
            <p className="text-emerald-600 text-xs">Redirecting to product list...</p>
          </div>
        </div>
      )}

      {errors.submit && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3">
          <FiAlertCircle className="text-red-600 flex-shrink-0" />
          <p className="text-red-700 text-sm">{errors.submit}</p>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {form.image && (
          <div className="bg-gradient-to-br from-gray-50 to-indigo-50/30 p-6 flex justify-center border-b border-gray-100">
            <img src={form.image} alt="Preview"
              className="max-h-40 object-contain rounded-xl shadow-sm"
              onError={e => { e.target.style.display = "none"; }}
            />
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Product Title</label>
            <div className={`flex items-center rounded-xl border ${errors.title ? "border-red-300" : "border-gray-200"}
              focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all`}>
              <FiPackage className="ml-3.5 text-gray-400 flex-shrink-0" />
              <input name="title" value={form.title} onChange={handleChange}
                placeholder="Product title"
                className="w-full pl-3 pr-4 py-3 text-sm focus:outline-none bg-transparent"
              />
            </div>
            {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Description <span className="font-normal text-gray-400">(optional)</span>
            </label>
            <div className="relative rounded-xl border border-gray-200
              focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
              <FiAlignLeft className="absolute top-3.5 left-3.5 text-gray-400" />
              <textarea name="description" value={form.description} onChange={handleChange}
                placeholder="Describe the product..." rows={3}
                className="w-full pl-10 pr-4 py-3 text-sm focus:outline-none bg-transparent resize-none"
              />
            </div>
          </div>

          {/* Price & Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Price (₹)</label>
              <div className={`flex items-center rounded-xl border ${errors.price ? "border-red-300" : "border-gray-200"}
                focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all`}>
                <FiDollarSign className="ml-3.5 text-gray-400 flex-shrink-0" />
                <input name="price" type="number" value={form.price} onChange={handleChange}
                  placeholder="0.00" min="0"
                  className="w-full pl-3 pr-4 py-3 text-sm focus:outline-none bg-transparent"
                />
              </div>
              {errors.price && <p className="mt-1 text-xs text-red-500">{errors.price}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Stock Quantity</label>
              <div className={`flex items-center rounded-xl border ${errors.stock ? "border-red-300" : "border-gray-200"}
                focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all`}>
                <FiHash className="ml-3.5 text-gray-400 flex-shrink-0" />
                <input name="stock" type="number" value={form.stock} onChange={handleChange}
                  placeholder="0" min="0"
                  className="w-full pl-3 pr-4 py-3 text-sm focus:outline-none bg-transparent"
                />
              </div>
              {errors.stock && <p className="mt-1 text-xs text-red-500">{errors.stock}</p>}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category</label>
            <div className={`flex items-center rounded-xl border ${errors.category ? "border-red-300" : "border-gray-200"}
              focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all`}>
              <FiTag className="ml-3.5 text-gray-400 flex-shrink-0" />
              <select name="category" value={form.category} onChange={handleChange}
                className="w-full pl-3 pr-4 py-3 text-sm focus:outline-none bg-transparent text-gray-700 appearance-none">
                <option value="">Select a category</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            {errors.category && <p className="mt-1 text-xs text-red-500">{errors.category}</p>}
            <div className="flex flex-wrap gap-2 mt-2">
              {CATEGORIES.map(c => (
                <button key={c} type="button"
                  onClick={() => handleChange({ target: { name: "category", value: c } })}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition
                    ${form.category === c ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-indigo-50 hover:text-indigo-700"}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Image URL</label>
            <div className="flex items-center rounded-xl border border-gray-200
              focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
              <FiImage className="ml-3.5 text-gray-400 flex-shrink-0" />
              <input name="image" value={form.image} onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                className="w-full pl-3 pr-4 py-3 text-sm focus:outline-none bg-transparent"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Link to="/admin/products"
              className="flex-1 py-3 text-center rounded-xl border border-gray-300
                text-gray-700 text-sm font-semibold hover:bg-gray-50 transition">
              Cancel
            </Link>
            <button type="submit" disabled={loading || success}
              className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70
                text-white rounded-xl text-sm font-semibold shadow-lg shadow-indigo-200
                transition-all duration-200 flex items-center justify-center gap-2">
              {loading ? (
                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...</>
              ) : success ? (
                <><FiCheck /> Saved!</>
              ) : (
                <><FiSave /> Save Changes</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
