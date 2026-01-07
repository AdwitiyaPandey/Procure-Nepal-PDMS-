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

      toast.success(res.data.message || "Login successful!");
      if (res.data.user.role === 'supplier') {
        navigate("/supplier-dashboard");
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
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">P</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Sign In</h1>
            <p className="text-gray-600 mt-2">Welcome back to Procure Nepal</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <input 
                name="email" 
                value={form.email} 
                onChange={handleChange} 
                type="email"
                placeholder="you@example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <input 
                name="password" 
                value={form.password} 
                onChange={handleChange} 
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center">
                <input type="checkbox" className="w-4 h-4 text-teal-600 rounded" />
                <span className="ml-2 text-gray-600">Remember me</span>
              </label>
              <Link to="/forget-password" className="text-teal-600 hover:text-teal-700 font-medium">Forgot password?</Link>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-bold py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          {/* Signup Link */}
          <p className="text-center text-gray-600 text-sm mt-8">
            Don't have an account? 
            <Link to="/register" className="text-teal-600 hover:text-teal-700 font-bold ml-1">
              Sign up
            </Link>
          </p>

          {/* Seller CTA */}
          <div className="mt-8 p-4 bg-teal-50 rounded-lg border border-teal-200 text-center">
            <p className="text-sm text-gray-700 mb-3">
              Want to sell on Procure Nepal?
            </p>
            <Link 
              to="/get-started" 
              className="inline-block bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              Become a Seller
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>By signing in, you agree to our <a href="#" className="text-teal-600 hover:underline">Terms of Service</a> and <a href="#" className="text-teal-600 hover:underline">Privacy Policy</a></p>
        </div>
      </div>
    </div>
  )
}

export default Login
