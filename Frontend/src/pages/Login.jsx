import { useState } from 'react';
import { useNavigate } from 'react-router';
import api from '../api/axios';
import { HiOutlineMail, HiOutlineLockClosed } from "react-icons/hi";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/auth/login", form);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userId",response.data.user.id)
      setMsg("Login Successful");
      setTimeout(() => navigate("/"), 1000);
    } catch (err) {
      setMsg(err.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50'>
      <div className='bg-white p-8 rounded-xl shadow-xl w-full max-w-md'>
        <h2 className='text-3xl font-bold mb-6 text-center text-gray-800'>Welcome Back</h2>

        {msg && (
          <div className='mb-4 text-center text-sm text-blue-600 font-medium'>
            {msg}
          </div>
        )}

        <form onSubmit={handleSubmit} className='space-y-5'>
          <div className='relative'>
            <HiOutlineMail className='absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400' />
            <input
              name='email'
              type='email'
              placeholder='Email Address'
              value={form.email}
              onChange={handleChange}
              className='w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent'
              required
            />
          </div>

          <div className='relative'>
            <HiOutlineLockClosed className='absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400' />
            <input
              name='password'
              type='password'
              placeholder='Password'
              value={form.password}
              onChange={handleChange}
              className='w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent'
              required
            />
          </div>

          <button
            type='submit'
            className='w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors'
          >
            Login
          </button>
        </form>

        <p className='mt-5 text-center text-gray-500'>
          Don't have an account?{' '}
          <span
            onClick={() => navigate("/signup")}
            className='text-blue-600 font-semibold cursor-pointer hover:underline'
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}
