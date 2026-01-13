import { useEffect, useState } from "react";
import api from "../api/axios";
import { useParams } from "react-router-dom";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data);
      } catch (error) {
        console.error("Load product error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (!product) return <div className="p-6 text-center">Product not found</div>;

  const addToCart = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return alert("Please login first");

    try {
      await api.post("/cart/add", {
        userId,
        productId: product._id,
        quantity: 1,
      });

      window.dispatchEvent(new Event("cartUpdated"));
      alert("Added to cart ✅");
    } catch (error) {
      console.error("Add to cart error:", error.response?.data || error.message);
      alert("Failed to add to cart ❌");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Product Image */}
        <div className="bg-white rounded-xl p-4 flex items-center justify-center">
          <img
            src={product.image}
            alt={product.title}
            className="w-full max-h-[380px] object-contain"
          />
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">
            {product.title}
          </h1>

          {product.category && (
            <p className="text-sm text-gray-500 mt-1">
              Category: {product.category}
            </p>
          )}

          <p className="text-2xl font-semibold text-green-600 mt-4">
            ₹{product.price}
          </p>

          {/* Stock */}
          <p
            className={`mt-2 font-medium ${
              product.stock > 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {product.stock > 0
              ? `In Stock (${product.stock} available)`
              : "Out of Stock"}
          </p>

          {/* Description */}
          {product.description && (
            <div className="mt-4">
              <h3 className="font-semibold mb-1">Description</h3>
              <p className="text-gray-700 leading-relaxed">
                {product.description}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-6 flex gap-4">
            <button
              onClick={addToCart}
              disabled={product.stock === 0}
              className={`px-6 py-3 rounded-lg text-white font-medium transition ${
                product.stock === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
