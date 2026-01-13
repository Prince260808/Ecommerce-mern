import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

export default function ProductList() {
  const [products, setProducts] = useState([]);

  const loadProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data);
    } catch (error) {
      console.error("Load products error:", error);
    }
  };

  const deleteProduct = async (id) => {
    try {
      await api.delete(`/products/delete/${id}`);
      alert("Product deleted successfully");
      loadProducts();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Product List</h2>
        <Link
          to="/admin/products/add"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add New Product
        </Link>
      </div>

      <table className="w-full border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Title</th>
            <th className="border p-2">Price</th>
            <th className="border p-2">Stock</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.length === 0 && (
            <tr>
              <td colSpan="4" className="p-4 text-center">
                No products found
              </td>
            </tr>
          )}

          {products.map((product) => (
            <tr key={product._id} className="text-center">
              <td className="border p-2">{product.title}</td>
              <td className="border p-2">{product.price}</td>
              <td className="border p-2">{product.stock}</td>
              <td className="border p-2 space-x-3">
                <Link
                  to={`/admin/products/update/${product._id}`}
                  className="text-blue-600"
                >
                  Edit
                </Link>
                <button
                  onClick={() => deleteProduct(product._id)}
                  className="text-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
