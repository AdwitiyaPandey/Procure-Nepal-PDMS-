import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function SignupBuyer() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    fullname: '',
    email: '',
    phone: '',
    password: '',
    profilePhoto: null,
  })

  function handleChange(e) {
    const { name, value, files } = e.target
    if (files) {
      setForm(prev => ({ ...prev, [name]: files[0] }))
    } else {
      setForm(prev => ({ ...prev, [name]: value }))
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    // Basic validation
    if (!form.email || !form.phone || !form.password) {
      alert('Please provide email, phone and password')
      return
    }

    // Simulate submission — in a real app send to backend for verification
    alert('Buyer signup submitted. Verification email / SMS will be sent.')
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto bg-white p-6 md:p-8 rounded-xl shadow">
        <h2 className="text-2xl font-semibold mb-4">Buyer Signup</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2 text-sm text-gray-600">Full name</label>
            <input name="fullname" value={form.fullname} onChange={handleChange} className="w-full p-3 border rounded-md" />
          </div>

          <div>
            <label className="block mb-2 text-sm text-gray-600">Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} className="w-full p-3 border rounded-md" />
          </div>

          <div>
            <label className="block mb-2 text-sm text-gray-600">Phone number</label>
            <input type="tel" name="phone" value={form.phone} onChange={handleChange} className="w-full p-3 border rounded-md" placeholder="e.g., +9779800xxxxx" />
          </div>

          <div>
            <label className="block mb-2 text-sm text-gray-600">Password</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} className="w-full p-3 border rounded-md" />
          </div>

          <div>
            <label className="block mb-2 text-sm text-gray-600">Profile photo (optional)</label>
            <input type="file" accept="image/*" name="profilePhoto" onChange={handleChange} className="w-full" />
          </div>

          <div className="flex gap-4">
            <button className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 py-2 rounded-md">Submit & Upload</button>
            <button type="button" onClick={() => navigate(-1)} className="px-4 py-2 border rounded-md">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SignupBuyer
