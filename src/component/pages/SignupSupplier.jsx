import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function SignupSupplier() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    fullname: '',
    companyName: '',
    pan: '',
    vat: '',
    turnover: '',
    established: '',
    citizenship: null,
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
    alert('Supplier signup submitted. Documents pending admin approval.')
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto bg-white p-6 md:p-8 rounded-xl shadow">
        <h2 className="text-2xl font-semibold mb-4">Supplier Signup</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2 text-sm text-gray-600">Full name</label>
            <input name="fullname" value={form.fullname} onChange={handleChange} className="w-full p-3 border rounded-md" />
          </div>

          <div>
            <label className="block mb-2 text-sm text-gray-600">Company / Business name</label>
            <input name="companyName" value={form.companyName} onChange={handleChange} className="w-full p-3 border rounded-md" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm text-gray-600">PAN</label>
              <input name="pan" value={form.pan} onChange={handleChange} className="w-full p-3 border rounded-md" />
            </div>
            <div>
              <label className="block mb-2 text-sm text-gray-600">VAT No.</label>
              <input name="vat" value={form.vat} onChange={handleChange} className="w-full p-3 border rounded-md" />
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm text-gray-600">Estimated turnover</label>
            <input name="turnover" value={form.turnover} onChange={handleChange} className="w-full p-3 border rounded-md" placeholder="e.g., NPR 50,000,000" />
          </div>

          <div>
            <label className="block mb-2 text-sm text-gray-600">Date of establishment</label>
            <input type="date" name="established" value={form.established} onChange={handleChange} className="w-full p-3 border rounded-md" />
          </div>

          <div>
            <label className="block mb-2 text-sm text-gray-600">Citizenship (image)</label>
            <input type="file" accept="image/*" name="citizenship" onChange={handleChange} className="w-full" />
          </div>

          <div>
            <label className="block mb-2 text-sm text-gray-600">Profile photo</label>
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

export default SignupSupplier
