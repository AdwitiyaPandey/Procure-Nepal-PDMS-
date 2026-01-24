import React, { createContext, useState, useEffect } from 'react'
import axios from 'axios'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(localStorage.getItem('token'))

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
          // Decode token to get user info (basic JWT decoding)
          const parts = token.split('.')
          if (parts.length === 3) {
            const decoded = JSON.parse(atob(parts[1]))
            setUser({
              id: decoded.id,
              email: decoded.email,
              role: decoded.role
            })
          }
        } catch (error) {
          console.error('Invalid token:', error)
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

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
    delete axios.defaults.headers.common['Authorization']
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAuthenticated: !!user }}>
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
