import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../AuthContext';

function SignupSupplier() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({
    fullname: '',
    email: '',
    companyName: '',
    pan: '',
    vat: '',
    turnover: '',
    established: '',
    citizenship: null,
    profilePhoto: null,
  })

  function handleChange(e) {
    e.preventDefault();
    const { name, value, files } = e.target
    if (files) {
      setForm(prev => ({ ...prev, [name]: files[0] }))
    } else {
      setForm(prev => ({ ...prev, [name]: value }))
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    // basic client-side validation
    if (!form.fullname || !form.email || !form.companyName) {
      alert('Please fill name, email and company name')
      return
    }

    const fd = new FormData()
    fd.append('fullname', form.fullname)
    fd.append('email', form.email)
    fd.append('companyName', form.companyName)
    fd.append('pan', form.pan)
    fd.append('vat', form.vat)
    fd.append('turnover', form.turnover)
    fd.append('established', form.established)
    if (form.citizenship) fd.append('citizenship', form.citizenship)
    if (form.profilePhoto) fd.append('profilePhoto', form.profilePhoto)

    fetch('http://localhost:5000/api/suppliers', {
      method: 'POST',
      body: fd
    })
      .then(r => r.json())
      .then(data => {
        if (data && data.ok) {
          alert('Supplier signup submitted. Documents pending admin approval.')
          login(data.user);
          navigate('/')
        } else {
          alert('Submission failed: ' + (data.error || 'unknown'))
        }
      })
      .catch(err => {
        console.error(err)
        alert('Submission failed')
      })
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
            <label className="block mb-2 text-sm text-gray-600">Email</label>
            <input name="email" value={form.email} onChange={handleChange} className="w-full p-3 border rounded-md" placeholder="you@example.com" />
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
