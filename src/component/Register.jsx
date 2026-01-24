import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../AuthContext'

function Register() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [form, setForm] = useState({
    fullname: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    profilePhoto: null
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function handleChange(e) {
    const { name, value, files } = e.target
    if (files) {
      setForm(prev => ({ ...prev, [name]: files[0] }))
    } else {
      setForm(prev => ({ ...prev, [name]: value }))
    }
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    
    if (!form.fullname || !form.email || !form.password || !form.confirmPassword) {
      setError('All fields are required')
      return
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    try {
      await register(
        form.fullname,
        form.email,
        form.phone,
        form.password,
        form.confirmPassword,
        'buyer',
        form.profilePhoto
      )
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row">
      {/* Left Side - Brand Section (Hidden on mobile) */}
      <div className="hidden md:flex md:w-1/2 bg-black text-white flex-col justify-center items-center p-8">
        <img src="/src/assets/images/favicon/favicon.ico" alt="ProcureNP" className="h-32 w-32 mb-8" />
        <p className="text-gray-300 text-lg text-center mb-8">
          Join Nepal's trusted wholesale community
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

      {/* Right Side - Registration Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-6 md:hidden hover:opacity-70 transition-opacity duration-300">
              <img src="/src/assets/images/favicon/favicon.ico" alt="ProcureNP" className="h-10 w-10" />
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
            <p className="text-gray-600 mt-2">Sign up to start buying or selling</p>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input 
                name="fullname"
                value={form.fullname}
                onChange={handleChange}
                type="text"
                placeholder="Your full name"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input 
                name="email"
                value={form.email}
                onChange={handleChange}
                type="email"
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input 
                name="password"
                value={form.password}
                onChange={handleChange}
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
              <input 
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all"
              />
            </div>

            <div className="flex items-start gap-2">
              <input type="checkbox" id="terms" className="w-4 h-4 text-black bg-gray-50 border-gray-200 rounded mt-1 cursor-pointer" />
              <label htmlFor="terms" className="text-sm text-gray-600 cursor-pointer">
                I agree to the <a href="#" className="text-black hover:underline font-medium">Terms of Service</a> and <a href="#" className="text-black hover:underline font-medium">Privacy Policy</a>
              </label>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-black hover:bg-gray-900 text-white font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed uppercase"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center text-gray-600 text-sm mt-6">
            Already have an account? 
            <Link to="/login" className="text-black hover:text-gray-700 font-semibold ml-1">
              Sign in
            </Link>
          </p>

          {/* Seller CTA */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200 text-center">
            <p className="text-sm text-gray-700 mb-3">
              Want to sell on ProcureNP?
            </p>
            <Link 
              to="/seller-register" 
              className="inline-block bg-black hover:bg-gray-900 text-white px-6 py-2 rounded-lg font-semibold transition-colors text-sm w-full text-center uppercase"
            >
              Become a Seller
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register

