import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import { toast } from 'react-toastify'


function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    setError('')
  }

  async function handleSubmit(e) {
  e.preventDefault()

  if (!form.email || !form.password) {
    setError('Please enter email and password')
    return
  }

  setLoading(true)
  try {
    await login(form.email, form.password)

    toast.success('Login successful!')

    navigate('/')
  } catch (err) {
    setError(err.message)

    toast.error(err.message || 'Login failed')
  } finally {
    setLoading(false)
  }
}

 return (
  <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">

    {/* Brand / Info Section */}
    <div className="w-full md:w-1/2 bg-black text-white flex flex-col justify-center items-center px-6 py-10 md:py-0">
      <img
        src="/src/assets/images/favicon/favicon.ico"
        alt="ProcureNP"
        className="h-20 w-20 md:h-32 md:w-32 mb-4 md:mb-8"
      />

      <h2 className="text-xl md:text-2xl font-bold text-center">
        Welcome to ProcureNP
      </h2>

      <p className="text-gray-300 text-sm md:text-lg text-center mt-3 max-w-sm">
        Connect with Nepal's trusted suppliers and grow your business
      </p>

      <div className="hidden md:block mt-8 space-y-4 text-gray-300">
        <div className="flex items-center gap-3">
          <i className="bi bi-check-circle text-xl"></i>
          <span>Verified suppliers</span>
        </div>
        <div className="flex items-center gap-3">
          <i className="bi bi-check-circle text-xl"></i>
          <span>Secure transactions</span>
        </div>
        <div className="flex items-center gap-3">
          <i className="bi bi-check-circle text-xl"></i>
          <span>Competitive pricing</span>
        </div>
      </div>
    </div>

    {/* Login Section */}
    <div className="w-full md:w-1/2 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 md:p-8">

        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Sign In
        </h1>
        <p className="text-gray-600 mt-1 mb-6">
          Welcome back 👋
        </p>

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              type="email"
              placeholder="you@example.com"
              className="mt-1 w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-black outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Password</label>
            <input
              name="password"
              value={form.password}
              onChange={handleChange}
              type="password"
              placeholder="••••••••"
              className="mt-1 w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-black outline-none"
            />
          </div>

          <div className="flex justify-between items-center text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded" />
              Remember me
            </label>
            <a href="#" className="font-medium text-black hover:underline">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2.5 rounded-lg font-semibold hover:bg-gray-900 transition disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Register */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Don’t have an account?
          <Link to="/register" className="font-semibold text-black ml-1">
            Sign up
          </Link>
        </p>

        {/* Seller CTA */}
        <div className="mt-6 p-4 bg-gray-100 rounded-lg text-center">
          <p className="text-sm text-gray-700 mb-2">
            Want to sell on ProcureNP?
          </p>
          <Link
            to="/seller-register"
            className="block bg-black text-white py-2 rounded-lg font-semibold hover:bg-gray-900 transition"
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

