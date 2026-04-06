import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiAlertCircle, FiCheck, FiShoppingCart } from "react-icons/fi";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors((er) => ({ ...er, [e.target.name]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 6) e.password = "At least 6 characters";
    if (form.password !== form.confirm) e.confirm = "Passwords don't match";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await api.post("/auth/signup", {
        name: form.name, email: form.email, password: form.password,
      });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 1800);
    } catch (err) {
      setErrors({ submit: err.response?.data?.message || "Registration failed. Try again." });
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: "name", label: "Full Name", placeholder: "John Doe", icon: FiUser, type: "text" },
    { name: "email", label: "Email", placeholder: "you@example.com", icon: FiMail, type: "email" },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-gray-50 via-indigo-50/30 to-violet-50/20
      flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 px-8 py-8 text-center">
            <div className="w-14 h-14 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
              <FiShoppingCart className="text-white text-2xl" />
            </div>
            <h1 className="text-2xl font-black text-white">Create Account</h1>
            <p className="text-indigo-200 text-sm mt-1">Join GuptaStore for exclusive deals</p>
          </div>

          {/* Form */}
          <div className="px-8 py-8 space-y-5">
            {success && (
              <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl px-4 py-3 text-sm">
                <FiCheck className="flex-shrink-0" />
                Account created! Redirecting to login...
              </div>
            )}
            {errors.submit && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
                <FiAlertCircle className="flex-shrink-0" />
                {errors.submit}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {fields.map(({ name, label, placeholder, icon: Icon, type }) => (
                <div key={name}>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
                  <div className="relative flex items-center">
                    <Icon className="absolute left-3.5 text-gray-400" />
                    <input
                      name={name}
                      type={type}
                      value={form[name]}
                      onChange={handleChange}
                      placeholder={placeholder}
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm transition
                        focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400
                        ${errors[name] ? "border-red-300" : "border-gray-200"}`}
                    />
                  </div>
                  {errors[name] && (
                    <p className="mt-1 text-xs text-red-500">{errors[name]}</p>
                  )}
                </div>
              ))}

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
                    placeholder="Min. 6 characters"
                    className={`w-full pl-10 pr-10 py-3 rounded-xl border text-sm transition
                      focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400
                      ${errors.password ? "border-red-300" : "border-gray-200"}`}
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    className="absolute right-3.5 text-gray-400 hover:text-gray-600 transition">
                    {showPw ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm Password</label>
                <div className="relative flex items-center">
                  <FiLock className="absolute left-3.5 text-gray-400" />
                  <input
                    name="confirm"
                    type="password"
                    value={form.confirm}
                    onChange={handleChange}
                    placeholder="Repeat password"
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm transition
                      focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400
                      ${errors.confirm ? "border-red-300" : "border-gray-200"}`}
                  />
                </div>
                {errors.confirm && <p className="mt-1 text-xs text-red-500">{errors.confirm}</p>}
              </div>

              <button
                type="submit"
                disabled={loading || success}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70
                  text-white rounded-xl font-semibold text-sm transition-all duration-200
                  shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating Account...
                  </>
                ) : success ? (
                  <><FiCheck /> Account Created!</>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link to="/login" className="text-indigo-600 font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
