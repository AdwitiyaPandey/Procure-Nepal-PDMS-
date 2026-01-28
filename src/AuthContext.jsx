import React, { createContext, useState, useEffect } from 'react'
import axios from 'axios'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [error, setError] = useState(null)

  const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000'

  // Set axios default header
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      delete axios.defaults.headers.common['Authorization']
    }
  }, [token])

  // Initialize user from token on mount
  useEffect(() => {
    const initUser = async () => {
      if (token) {
        try {
          const response = await axios.get(`${API_BASE}/api/auth/me`)
          setUser(response.data.user)
          setError(null)
        } catch (error) {
          console.error('Failed to fetch user:', error)
          localStorage.removeItem('token')
          setToken(null)
          setUser(null)
        }
      }
      setLoading(false)
    }
    initUser()
  }, [token])

  const login = async (email, password) => {
    try {
      setError(null)
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
      const errorMessage = error.response?.data?.error || 'Login failed'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const register = async (formData, role = 'buyer') => {
    try {
      setError(null)
      const endpoint = role === 'seller' ? 'register/seller' : 'register/buyer'

      const response = await axios.post(`${API_BASE}/api/auth/${endpoint}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      const { token: newToken, user: userData } = response.data
      localStorage.setItem('token', newToken)
      setToken(newToken)
      setUser(userData)
      return response.data
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Registration failed'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const forgotPassword = async (email) => {
    try {
      setError(null)
      const response = await axios.post(`${API_BASE}/api/auth/forgot-password`, {
        email
      })
      return response.data
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to send reset email'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const resetPassword = async (token, password, confirmPassword) => {
    try {
      setError(null)
      const response = await axios.post(`${API_BASE}/api/auth/reset-password`, {
        token,
        password,
        confirmPassword
      })
      return response.data
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to reset password'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
    setError(null)
    delete axios.defaults.headers.common['Authorization']
  }

  const clearError = () => {
    setError(null)
  }

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      error,
      login,
      register,
      logout,
      forgotPassword,
      resetPassword,
      clearError,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = React.useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
