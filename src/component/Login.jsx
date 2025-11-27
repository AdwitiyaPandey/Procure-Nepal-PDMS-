import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import logo from '../assets/images/logo.png'

function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' })

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    // simulate auth — replace with real auth later
    if (!form.username || !form.password) {
      alert('Please enter username and password')
      return
    }
    alert('Logged in (demo)')
    navigate('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center login-bg px-4">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div className="hidden md:flex items-center justify-center">
          <div className="transform-gpu float-img w-full max-w-sm">
            <img src={logo} alt="Procure Nepal logo" className="rounded-xl shadow-lg w-full object-cover" />
          </div>
        </div>

        <div className="login-card p-8 md:p-10 rounded-xl">
          <div className="mb-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white font-bold">P</div>
            <div>
              <h2 className="text-2xl font-semibold">Sign in</h2>
              <p className="text-sm text-gray-500">Welcome back — please sign in to your account</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-left text-sm text-gray-600">Username or Email</label>
              <input name="username" value={form.username} onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-green-300 input-underline" placeholder="you@example.com" />
            </div>

            <div>
              <label className="block text-left text-sm text-gray-600">Password</label>
              <input name="password" value={form.password} onChange={handleChange} type="password" className="w-full p-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-green-300" placeholder="••••••••" />
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <Link to="/get-started" className="text-green-600 hover:underline">Create account</Link>
              </div>
              <div className="text-sm text-gray-500">Forgot password?</div>
            </div>

            <div className="pt-2">
              <button type="submit" className="w-full glass-button bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 rounded-md">Sign in</button>
            </div>
          </form>

          <div className="mt-6 text-sm text-center text-gray-500">Or continue with</div>
          <div className="mt-4 flex gap-3">
            <button className="flex-1 py-2 rounded-md border text-sm">Google</button>
            <button className="flex-1 py-2 rounded-md border text-sm">LinkedIn</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
