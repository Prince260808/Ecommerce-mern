import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { FiMail, FiLock, FiEye, FiEyeOff, FiAlertCircle, FiShoppingCart } from "react-icons/fi";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.email || !form.password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/auth/login", form);
      const data = res.data;
      const token = data.token;

      // Decode userId from JWT payload (works regardless of response shape)
      const jwtPayload = JSON.parse(atob(token.split(".")[1]));
      const userId = jwtPayload.id || jwtPayload._id || jwtPayload.userId || jwtPayload.sub;

      // Try response fields for role, fall back to JWT
      const role = data.role || data.user?.role || jwtPayload.role || "user";

      console.log("JWT payload keys:", Object.keys(jwtPayload));
      console.log("Resolved userId:", userId);

      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      localStorage.setItem("role", role);
      navigate(role === "admin" ? "/admin" : "/");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-gray-50 via-indigo-50/30 to-violet-50/20
      flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 px-8 py-8 text-center">
            <div className="w-14 h-14 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
              <FiShoppingCart className="text-white text-2xl" />
            </div>
            <h1 className="text-2xl font-black text-white">Welcome Back</h1>
            <p className="text-indigo-200 text-sm mt-1">Sign in to your GuptaStore account</p>
          </div>

          {/* Form */}
          <div className="px-8 py-8 space-y-5">
            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700
                rounded-xl px-4 py-3 text-sm">
                <FiAlertCircle className="flex-shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
                <div className="relative flex items-center">
                  <FiMail className="absolute left-3.5 text-gray-400" />
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200
                      focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400
                      text-sm transition"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                <div className="relative flex items-center">
                  <FiLock className="absolute left-3.5 text-gray-400" />
                  <input
                    name="password"
                    type={showPw ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200
                      focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400
                      text-sm transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3.5 text-gray-400 hover:text-gray-600 transition"
                  >
                    {showPw ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70
                  text-white rounded-xl font-semibold text-sm transition-all duration-200
                  shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500">
              Don't have an account?{" "}
              <Link to="/signup" className="text-indigo-600 font-semibold hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
