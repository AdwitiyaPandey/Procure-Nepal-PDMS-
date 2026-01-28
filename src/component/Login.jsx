import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import { LoginSchema, validateFormData } from '../utils/validationSchemas'

function Login() {
  const navigate = useNavigate()
  const { login, error: authError, clearError } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
    if (authError) {
      clearError()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate form
    const validation = validateFormData(LoginSchema, form)
    if (!validation.success) {
      setErrors(validation.errors)
      return
    }

    setLoading(true)
    setErrors({})

    try {
      await login(form.email, form.password)
      navigate('/')
    } catch (error) {
      setErrors({ general: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row">
      {/* Left Side - Brand Section (Hidden on mobile) */}
      <div className="hidden md:flex md:w-1/2 bg-black text-white flex-col justify-center items-center p-8">
        <div className="mb-8">
          <img src="/src/assets/images/favicon/favicon.ico" alt="ProcureNP Logo" className="h-16 w-16 mx-auto mb-4" />
          <p className="text-center text-xl font-bold">ProcureNP</p>
        </div>
        <img src="/wb-logo.svg" alt="WB Logo" className="h-24 w-24 mb-8" />
        <p className="text-gray-300 text-lg text-center mb-8">
          Welcome back to Nepal's trusted wholesale marketplace
        </p>
        <div className="space-y-4 text-gray-300">
          <div className="flex items-center gap-3">
            <i className="bi bi-check-circle text-xl"></i>
            <span>Access to verified suppliers</span>
          </div>
          <div className="flex items-center gap-3">
            <i className="bi bi-check-circle text-xl"></i>
            <span>Competitive wholesale prices</span>
          </div>
          <div className="flex items-center gap-3">
            <i className="bi bi-check-circle text-xl"></i>
            <span>Secure transactions</span>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-8 md:overflow-y-auto md:max-h-screen">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-6 md:hidden hover:opacity-70 transition-opacity duration-300">
              <img src="/src/assets/images/favicon/favicon.ico" alt="ProcureNP" className="h-10 w-10" />
            </Link>
            <Link to="/" className="inline-flex items-center gap-2 mb-4 text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium">
              <i className="bi bi-arrow-left"></i>
              <span>Back to Home</span>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
            <p className="text-gray-600 mt-2">Sign in to access your account</p>
          </div>

          {/* General Error Message */}
          {errors.general && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm font-medium">{errors.general}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input 
                name="email"
                value={form.email}
                onChange={handleChange}
                type="text"
                placeholder="you@example.com"
                className={`w-full px-4 py-2.5 bg-gray-50 border rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                  errors.email ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-black'
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <input 
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className={`w-full px-4 py-2.5 bg-gray-50 border rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                    errors.password ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-black'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* Remember & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="w-4 h-4 text-black bg-gray-50 border-gray-200 rounded cursor-pointer" />
                <span className="ml-2 text-sm text-gray-600 cursor-pointer">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-black hover:text-gray-700 font-medium">
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-black hover:bg-gray-900 text-white font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed uppercase"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Sign Up Link */}
          <p className="text-center text-gray-600 text-sm mt-6">
            Don't have an account? 
            <Link to="/register" className="text-black hover:text-gray-700 font-semibold ml-1">
              Create one
            </Link>
          </p>

          {/* Seller CTA */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200 text-center">
            <p className="text-sm text-gray-700 mb-3">
              Want to sell on ProcureNP?
            </p>
            <Link 
              to="/seller-register" 
              className="inline-block bg-black hover:bg-gray-900 text-white px-6 py-2 rounded-lg font-semibold transition-colors text-sm uppercase"
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