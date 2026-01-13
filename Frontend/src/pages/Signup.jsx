import { useState } from 'react';
import api from "../api/axios";
import { HiOutlineUser, HiOutlineMail, HiOutlineLockClosed } from "react-icons/hi";

const Signup = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/auth/signup", form);
      setMsg(response.data.message);
    } catch (err) {
      setMsg(err.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50'>
      <div className='bg-white p-8 rounded-xl shadow-xl w-full max-w-md'>
        <h2 className='text-3xl font-bold mb-6 text-center text-gray-800'>Create Your Account</h2>

        {msg && (
          <div className='mb-4 text-center text-sm text-blue-600 font-medium'>
            {msg}
          </div>
        )}

        <form onSubmit={handleSubmit} className='space-y-5'>
          <div className='relative'>
            <HiOutlineUser className='absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400' />
            <input
              name='name'
              type='text'
              placeholder='Full Name'
              value={form.name}
              onChange={handleChange}
              className='w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent'
              required
            />
          </div>

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
            Sign Up
          </button>
        </form>

        <p className='mt-5 text-center text-gray-500'>
          Already have an account?{' '}
          <span className='text-blue-600 font-semibold cursor-pointer hover:underline' onClick={() => window.location.href='/login'}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Signup;
