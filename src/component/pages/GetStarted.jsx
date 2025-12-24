import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { auth } from '../../firebase'

function GetStarted() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('buyer')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [buyerForm, setBuyerForm] = useState({
    fullname: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    profilePhoto: null,
  })

  const [supplierForm, setSupplierForm] = useState({
    fullname: '',
    email: '',
    companyName: '',
    phone: '',
    password: '',
    confirmPassword: '',
    pan: '',
    vat: '',
    turnover: '',
    established: '',
    citizenship: null,
    panVatDoc: null,
    profilePhoto: null,
  })

  function handleBuyerChange(e) {
    const { name, value, files } = e.target
    if (files) {
      setBuyerForm(prev => ({ ...prev, [name]: files[0] }))
    } else {
      setBuyerForm(prev => ({ ...prev, [name]: value }))
    }
  }

  function handleSupplierChange(e) {
    const { name, value, files } = e.target
    if (files) {
      setSupplierForm(prev => ({ ...prev, [name]: files[0] }))
    } else {
      setSupplierForm(prev => ({ ...prev, [name]: value }))
    }
  }

  async function handleBuyerSubmit(e) {
    e.preventDefault()
    setError('')

    if (!buyerForm.fullname || !buyerForm.email || !buyerForm.phone || !buyerForm.password) {
      setError('All fields required')
      return
    }

    if (buyerForm.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    if (buyerForm.password !== buyerForm.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    try {
      const userCred = await createUserWithEmailAndPassword(auth, buyerForm.email, buyerForm.password)
      await updateProfile(userCred.user, { displayName: buyerForm.fullname })
      
      const fd = new FormData()
      fd.append('uid', userCred.user.uid)
      fd.append('role', 'buyer')
      fd.append('fullname', buyerForm.fullname)
      fd.append('email', buyerForm.email)
      fd.append('phone', buyerForm.phone)
      if (buyerForm.profilePhoto) fd.append('profilePhoto', buyerForm.profilePhoto)

      await fetch('http://localhost:4000/api/users', {
        method: 'POST',
        body: fd
      })

      alert('Buyer account created successfully!')
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleSupplierSubmit(e) {
    e.preventDefault()
    setError('')

    if (!supplierForm.fullname || !supplierForm.email || !supplierForm.companyName || !supplierForm.password) {
      setError('All fields required')
      return
    }

    if (supplierForm.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    if (supplierForm.password !== supplierForm.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    try {
      const userCred = await createUserWithEmailAndPassword(auth, supplierForm.email, supplierForm.password)
      await updateProfile(userCred.user, { displayName: supplierForm.fullname })

      const fd = new FormData()
      fd.append('uid', userCred.user.uid)
      fd.append('role', 'supplier')
      fd.append('fullname', supplierForm.fullname)
      fd.append('email', supplierForm.email)
      fd.append('companyName', supplierForm.companyName)
      fd.append('phone', supplierForm.phone)
      fd.append('pan', supplierForm.pan)
      fd.append('vat', supplierForm.vat)
      fd.append('turnover', supplierForm.turnover)
      fd.append('established', supplierForm.established)
      if (supplierForm.citizenship) fd.append('citizenship', supplierForm.citizenship)
      if (supplierForm.panVatDoc) fd.append('panVatDoc', supplierForm.panVatDoc)
      if (supplierForm.profilePhoto) fd.append('profilePhoto', supplierForm.profilePhoto)

      await fetch('http://localhost:4000/api/users', {
        method: 'POST',
        body: fd
      })

      alert('Supplier account created! Pending admin approval.')
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8 md:p-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">P</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Your Account</h1>
          <p className="text-gray-600">Join Nepal's #1 Wholesale Marketplace</p>
        </div>

        {/* Tab Buttons */}
        <div className="flex gap-4 mb-8 border-b-2 border-gray-200">
          <button
            onClick={() => { setTab('buyer'); setError('') }}
            className={`flex-1 py-4 px-6 font-bold text-center transition-all ${tab === 'buyer' 
              ? 'text-teal-600 border-b-2 border-teal-600 -mb-0.5 bg-teal-50' 
              : 'text-gray-600 hover:text-gray-800'}`}
          >
            I'm a Buyer
          </button>
          <button
            onClick={() => { setTab('supplier'); setError('') }}
            className={`flex-1 py-4 px-6 font-bold text-center transition-all ${tab === 'supplier' 
              ? 'text-teal-600 border-b-2 border-teal-600 -mb-0.5 bg-teal-50' 
              : 'text-gray-600 hover:text-gray-800'}`}
          >
            I'm a Seller
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        {/* BUYER FORM */}
        {tab === 'buyer' && (
          <form onSubmit={handleBuyerSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                <input
                  name="fullname"
                  value={buyerForm.fullname}
                  onChange={handleBuyerChange}
                  type="text"
                  placeholder="John Doe"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={buyerForm.email}
                  onChange={handleBuyerChange}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={buyerForm.phone}
                  onChange={handleBuyerChange}
                  placeholder="+977 98......"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Profile Photo (optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  name="profilePhoto"
                  onChange={handleBuyerChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  name="password"
                  value={buyerForm.password}
                  onChange={handleBuyerChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={buyerForm.confirmPassword}
                  onChange={handleBuyerChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-bold py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Create Buyer Account'}
            </button>
          </form>
        )}

        {/* SUPPLIER FORM */}
        {tab === 'supplier' && (
          <form onSubmit={handleSupplierSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                <input
                  name="fullname"
                  value={supplierForm.fullname}
                  onChange={handleSupplierChange}
                  type="text"
                  placeholder="John Doe"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={supplierForm.email}
                  onChange={handleSupplierChange}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Company Name</label>
              <input
                name="companyName"
                value={supplierForm.companyName}
                onChange={handleSupplierChange}
                type="text"
                placeholder="Your Company Name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={supplierForm.phone}
                  onChange={handleSupplierChange}
                  placeholder="+977 98......"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">PAN Number</label>
                <input
                  name="pan"
                  value={supplierForm.pan}
                  onChange={handleSupplierChange}
                  type="text"
                  placeholder="e.g., 123456789"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">VAT Number</label>
                <input
                  name="vat"
                  value={supplierForm.vat}
                  onChange={handleSupplierChange}
                  type="text"
                  placeholder="e.g., 987654321"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Annual Turnover</label>
                <input
                  name="turnover"
                  value={supplierForm.turnover}
                  onChange={handleSupplierChange}
                  type="text"
                  placeholder="e.g., NPR 50,000,000"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Date of Establishment</label>
              <input
                type="date"
                name="established"
                value={supplierForm.established}
                onChange={handleSupplierChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Citizenship Image</label>
                <input
                  type="file"
                  accept="image/*"
                  name="citizenship"
                  onChange={handleSupplierChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">PAN/VAT Document</label>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  name="panVatDoc"
                  onChange={handleSupplierChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Profile Photo (optional)</label>
              <input
                type="file"
                accept="image/*"
                name="profilePhoto"
                onChange={handleSupplierChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  name="password"
                  value={supplierForm.password}
                  onChange={handleSupplierChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={supplierForm.confirmPassword}
                  onChange={handleSupplierChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <p className="text-sm text-blue-800">
                Your account will be verified by our team. You'll receive an email once approved.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-bold py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Create Seller Account'}
            </button>
          </form>
        )}

        {/* Already have account */}
        <p className="text-center text-gray-600 text-sm mt-8">
          Already have an account? <a href="/login" className="text-teal-600 hover:text-teal-700 font-bold">Sign in</a>
        </p>
      </div>
    </div>
  )
}

export default GetStarted
