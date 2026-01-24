# Frontend - JWT Authentication & API Integration Guide

## Setup Instructions

### 1. Install Dependencies

```bash
npm install axios
```

### 2. Update AuthContext.jsx

```javascript
import React, { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(localStorage.getItem('token'))

  const API_BASE = 'http://localhost:4000'

  // Set axios default header
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      delete axios.defaults.headers.common['Authorization']
    }
  }, [token])

  // Initialize user from token
  useEffect(() => {
    const initUser = async () => {
      if (token) {
        try {
          // Verify token by checking if we can access protected route
          const response = await axios.get(`${API_BASE}/api/user/profile`, {
            headers: { Authorization: `Bearer ${token}` }
          })
          setUser(response.data.user)
        } catch (error) {
          // Token is invalid
          localStorage.removeItem('token')
          setToken(null)
          setUser(null)
        }
      }
      setLoading(false)
    }
    initUser()
  }, [token])

  const register = async (fullname, email, phone, password, confirmPassword, role = 'buyer', profilePhoto = null) => {
    try {
      const formData = new FormData()
      formData.append('fullname', fullname)
      formData.append('email', email)
      formData.append('phone', phone)
      formData.append('password', password)
      formData.append('confirmPassword', confirmPassword)
      formData.append('role', role)
      if (profilePhoto) {
        formData.append('profilePhoto', profilePhoto)
      }

      const response = await axios.post(`${API_BASE}/api/auth/register`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      const { token: newToken, user: userData } = response.data
      localStorage.setItem('token', newToken)
      setToken(newToken)
      setUser(userData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Registration failed')
    }
  }

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_BASE}/api/auth/login`, {
        email,
        password
      })

      const { token: newToken, user: userData } = response.data
      localStorage.setItem('token', newToken)
      setToken(newToken)
      setUser(userData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Login failed')
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
```

### 3. Update Login.jsx

```javascript
import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../AuthContext'

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
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row">
      {/* Left Side - Brand Section */}
      <div className="hidden md:flex md:w-1/2 bg-black text-white flex-col justify-center items-center p-8">
        <img src="/src/assets/images/procure_logo.png" alt="ProcureNP" className="h-32 w-auto mb-8" />
        <p className="text-gray-300 text-lg text-center mb-8">
          Connect with Nepal's trusted suppliers and grow your business
        </p>
        {/* ... rest of the component */}
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 font-medium text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black hover:bg-gray-900 text-white py-2.5 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="mt-6 text-center text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-black font-semibold hover:text-gray-700 transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
```

### 4. Update Register.jsx

```javascript
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
      {/* Left Side - Brand Section */}
      <div className="hidden md:flex md:w-1/2 bg-black text-white flex-col justify-center items-center p-8">
        <img src="/src/assets/images/procure_logo.png" alt="ProcureNP" className="h-32 w-auto mb-8" />
        <p className="text-gray-300 text-lg text-center mb-8">
          Join Nepal's trusted wholesale community
        </p>
        {/* ... rest */}
      </div>

      {/* Right Side - Registration Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 font-medium text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                name="fullname"
                value={form.fullname}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+977-980xxxxx"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Profile Photo (Optional)</label>
              <input
                type="file"
                name="profilePhoto"
                onChange={handleChange}
                accept="image/*"
                className="w-full"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black hover:bg-gray-900 text-white py-2.5 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="mt-6 text-center text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-black font-semibold hover:text-gray-700 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
```

## Product API Integration

For SearchResults.jsx, ProductCard, etc., use axios with token:

```javascript
import axios from 'axios'
import { useAuth } from '../AuthContext'

const API_BASE = 'http://localhost:4000'

function MyComponent() {
  const { token } = useAuth()

  // Fetch products
  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_BASE}/api/products`, {
        params: { q: 'search term', category: 'Electronics', page: 1, limit: 12 }
      })
      console.log(response.data)
    } catch (error) {
      console.error('Error fetching products:', error.message)
    }
  }

  // Create product (supplier only)
  const createProduct = async (formData) => {
    try {
      const response = await axios.post(
        `${API_BASE}/api/products`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        }
      )
      console.log('Product created:', response.data)
    } catch (error) {
      console.error('Error creating product:', error.message)
    }
  }

  // Update product
  const updateProduct = async (productId, formData) => {
    try {
      const response = await axios.put(
        `${API_BASE}/api/products/${productId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        }
      )
      return response.data
    } catch (error) {
      console.error('Error updating product:', error.message)
    }
  }

  // Delete product
  const deleteProduct = async (productId) => {
    try {
      const response = await axios.delete(
        `${API_BASE}/api/products/${productId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      return response.data
    } catch (error) {
      console.error('Error deleting product:', error.message)
    }
  }
}
```

## Environment Variables (Frontend)

Create `.env` in root directory:

```
VITE_API_BASE=http://localhost:4000
```

Update axios calls:

```javascript
const API_BASE = import.meta.env.VITE_API_BASE
```

---

**Important:** Update main.jsx to wrap your app with AuthProvider!
