import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useAuth } from "./../AuthContext";


function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("Please enter email and password");
      return;
    }



    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
          email: form.email,
          password: form.password,
      });

      login(res.data.user);
      toast.success("Login successful!");

      
      if (res.data.user.role === 'admin') {
          navigate("/admin-dashboard");
      } else {
          navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }


  return (
<div className="min-h-screen bg-white flex flex-col md:flex-row">
  {/* Left Side - Brand Section (Hidden on mobile) */}
  <div className="hidden md:flex md:w-1/2 bg-black text-white flex-col justify-center items-center p-8">
    <img
      src="/src/assets/images/favicon/favicon.ico"
      alt="ProcureNP"
      className="h-32 w-32 mb-8"
    />
    <p className="text-gray-300 text-lg text-center mb-8">
      Connect with Nepal's trusted suppliers and grow your business
    </p>
    <div className="space-y-4 text-gray-300">
      {["Verified suppliers", "Secure transactions", "Competitive pricing"].map((text, idx) => (
        <div key={idx} className="flex items-center gap-3">
          <i className="bi bi-check-circle text-xl"></i>
          <span>{text}</span>
        </div>
      ))}
    </div>
  </div>

  {/* Right Side - Login Form */}
  <div className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-8">
    <div className="w-full max-w-md">
      <div className="mb-6 md:mb-8 text-center md:text-left">
        <Link
          to="/"
          className="inline-flex items-center gap-2 mb-4 md:hidden hover:opacity-70 transition-opacity duration-300"
        >
          <img
            src="/src/assets/images/favicon/favicon.ico"
            alt="ProcureNP"
            className="h-10 w-10"
          />
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Sign In</h1>
        <p className="text-gray-600 mt-1 sm:mt-2">Welcome back</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm sm:text-base font-medium">{error}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
        <div>
          <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2">
            Email
          </label>
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            type="email"
            placeholder="you@example.com"
            className="w-full px-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all"
          />
        </div>

        <div>
          <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2">
            Password
          </label>
          <input
            name="password"
            value={form.password}
            onChange={handleChange}
            type="password"
            placeholder="••••••••"
            className="w-full px-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all"
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center text-sm sm:text-base">
          <label className="flex items-center gap-2 mb-2 sm:mb-0">
            <input type="checkbox" className="w-4 h-4 text-black bg-gray-50 border-gray-200 rounded" />
            <span className="text-gray-600">Remember me</span>
          </label>
          <a href="#" className="text-black hover:text-gray-700 font-medium">
            Forgot password?
          </a>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black hover:bg-gray-900 text-white font-semibold py-2.5 sm:py-3 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg active:scale-95 uppercase"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      {/* Signup Link */}
      <p className="text-center sm:text-left text-gray-600 text-sm mt-5 sm:mt-6">
        Don't have an account?
        <Link to="/register" className="text-black hover:text-gray-700 font-semibold ml-1">
          Sign up
        </Link>
      </p>

      {/* Seller CTA */}
      <div className="mt-6 sm:mt-8 p-4 sm:p-5 bg-gray-100 rounded-lg border border-gray-300 text-center">
        <p className="text-sm sm:text-base text-gray-700 mb-2 sm:mb-3">
          Want to sell on ProcureNP?
        </p>
        <Link
          to="/seller-register"
          className="inline-block bg-black hover:bg-gray-900 text-white px-6 py-2 sm:py-2.5 rounded-lg font-semibold transition-all duration-300 text-sm sm:text-base w-full text-center hover:shadow-lg active:scale-95"
        >
          Become a Seller
        </Link>
      </div>
    </div>
  </div>
</div>
  )
}

export default Login
