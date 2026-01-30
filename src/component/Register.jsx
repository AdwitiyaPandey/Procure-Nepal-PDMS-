import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import { BuyerRegistrationSchema, validateFormData } from '../utils/validationSchemas'

function Register() {
  const navigate = useNavigate()
  const { register, error: authError, clearError } = useAuth()
  const [form, setForm] = useState({
    fullname: '',
    email: '',
    phone: '',
    agreeToTerms: false,
    password: '',
    confirmPassword: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
function inputField({ label, name, type, placeholder, value, onChange }) {
  return (
    <div>
      <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2">{label}</label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        type={type}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all"
      />
    </div>
  );
}
  function handleChange(e) {
    const { name, value, files } = e.target
    if (files) {
      setForm(prev => ({ ...prev, [name]: files[0] }))
    } else {
      setForm(prev => ({ ...prev, [name]: value }))
    }
    if (authError) {
      clearError()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const validation = validateFormData(BuyerRegistrationSchema, form)
    if (!validation.success) {
      setErrors(validation.errors)
      return
    }

    setLoading(true)
    setErrors({})

    try {
      const formData = new FormData()
      formData.append('fullname', form.fullname)
      formData.append('email', form.email)
      formData.append('phone', form.phone)
      formData.append('agreeToTerms', form.agreeToTerms ? '1' : '0')
      formData.append('password', form.password)
      formData.append('confirmPassword', form.confirmPassword)
      // No profile photo field on buyer registration (handled on profile later)

      await register(formData, 'buyer')
      navigate('/')
    } catch (error) {
      setErrors({ general: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
   <div className="min-h-screen bg-white flex flex-col md:flex-row">
  {/* Left Side - Brand Section */}
  <div className="hidden md:flex md:w-1/2 bg-black text-white flex-col justify-center items-center p-6 lg:p-8">
    <img
      src="/src/assets/images/favicon/favicon.ico"
      alt="ProcureNP"
      className="h-28 w-28 md:h-32 md:w-32 mb-6 md:mb-8"
    />
    <p className="text-gray-300 text-center text-base md:text-lg mb-6 md:mb-8">
      Join Nepal's trusted wholesale community
    </p>
    <div className="space-y-3 md:space-y-4 text-gray-300">
      {[
        "Access to verified suppliers",
        "Competitive wholesale prices",
        "Secure transactions"
      ].map((text, idx) => (
        <div key={idx} className="flex items-center gap-2 md:gap-3">
          <i className="bi bi-check-circle text-lg md:text-xl"></i>
          <span className="text-sm md:text-base">{text}</span>
        </div>
      ))}
    </div>
  </div>

  {/* Right Side - Registration Form */}
  <div className="w-full md:w-1/2 flex items-center justify-center p-4 sm:p-6 md:p-8">
    <div className="w-full max-w-md">
      <div className="mb-6 md:mb-8 text-center md:text-left">
        <Link
          to="/"
          className="inline-flex items-center gap-2 mb-4 md:hidden hover:opacity-70 transition-opacity duration-300"
        >
          <img
            src="/src/assets/images/favicon/favicon.ico"
            alt="ProcureNP"
            className="h-10 w-10"
          />
        </Link>
        <h1 className="text-2xl sm:text-3xl md:text-3xl font-bold text-gray-900">
          Create Account
        </h1>
        <p className="text-gray-600 mt-1 sm:mt-2">
          Sign up to start buying or selling
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm sm:text-base font-medium">{error}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
        <inputField label="Full Name" name="fullname" type="text" placeholder="Your full name" value={form.fullname} onChange={handleChange} />
        <inputField label="Email Address" name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} />
        <inputField label="Password" name="password" type="password" placeholder="••••••••" value={form.password} onChange={handleChange} />
        <inputField label="Confirm Password" name="confirmPassword" type="password" placeholder="••••••••" value={form.confirmPassword} onChange={handleChange} />

        {/* Terms */}
        <div className="flex items-start gap-2">
          <input type="checkbox" id="terms" className="w-4 h-4 text-black bg-gray-50 border-gray-200 rounded mt-1 cursor-pointer" />
          <label htmlFor="terms" className="text-sm text-gray-600 cursor-pointer">
            I agree to the <a href="#" className="text-black hover:underline font-medium">Terms of Service</a> and <a href="#" className="text-black hover:underline font-medium">Privacy Policy</a>
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black hover:bg-gray-900 text-white font-semibold py-2.5 sm:py-3 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed uppercase"
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>

      {/* Login Link */}
      <p className="text-center md:text-left text-gray-600 text-sm mt-5 sm:mt-6">
        Already have an account?
        <Link to="/login" className="text-black hover:text-gray-700 font-semibold ml-1">
          Sign in
        </Link>
      </p>

      {/* Seller CTA */}
      <div className="mt-6 sm:mt-8 p-4 sm:p-5 bg-gray-50 rounded-lg border border-gray-200 text-center">
        <p className="text-sm sm:text-base text-gray-700 mb-2 sm:mb-3">
          Want to sell on ProcureNP?
        </p>
        <Link
          to="/seller-register"
          className="inline-block bg-black hover:bg-gray-900 text-white px-6 py-2 sm:py-2.5 rounded-lg font-semibold transition-all duration-300 text-sm sm:text-base w-full text-center uppercase"
        >
          Become a Seller
        </Link>
      </div>
    </div>
  </div>
</div>


  )
}

export default Register
// Commit: 2026-01-01 Ujjwal

