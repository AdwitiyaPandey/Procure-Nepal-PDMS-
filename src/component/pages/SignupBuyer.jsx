import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function SignupBuyer() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    fullname: '',
    businessName: '',
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
    // For now just simulate submission — in real app send to backend for verification
    alert('Signup submitted. Documents pending admin approval.')
    navigate('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-2xl bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Buyer Signup</h2>

        <label className="block mb-2">Full name</label>
        <input name="fullname" value={form.fullname} onChange={handleChange} className="w-full p-2 border mb-3" />

        <label className="block mb-2">Business name</label>
        <input name="businessName" value={form.businessName} onChange={handleChange} className="w-full p-2 border mb-3" />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2">PAN</label>
            <input name="pan" value={form.pan} onChange={handleChange} className="w-full p-2 border mb-3" />
          </div>
          <div>
            <label className="block mb-2">VAT No.</label>
            <input name="vat" value={form.vat} onChange={handleChange} className="w-full p-2 border mb-3" />
          </div>
        </div>

        <label className="block mb-2">Estimated turnover</label>
        <input name="turnover" value={form.turnover} onChange={handleChange} className="w-full p-2 border mb-3" placeholder="e.g., NPR 10,000,000" />

        <label className="block mb-2">Date of establishment</label>
        <input type="date" name="established" value={form.established} onChange={handleChange} className="w-full p-2 border mb-3" />

        <label className="block mb-2">Citizenship (image)</label>
        <input type="file" accept="image/*" name="citizenship" onChange={handleChange} className="w-full mb-3" />

        <label className="block mb-2">Profile photo</label>
        <input type="file" accept="image/*" name="profilePhoto" onChange={handleChange} className="w-full mb-4" />

        <div className="flex gap-4">
          <button className="bg-blue-600 text-white px-4 py-2 rounded">Submit & Upload</button>
          <button type="button" onClick={() => navigate(-1)} className="px-4 py-2 border rounded">Cancel</button>
        </div>
      </form>
    </div>
  )
}

export default SignupBuyer
