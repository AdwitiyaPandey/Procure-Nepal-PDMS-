import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../AuthContext'
import { validateFormData, SellerRegistrationSchema } from '../../utils/validationSchemas'

const GetStarted = () => {
  const navigate = useNavigate()
  const { register, error: authError } = useAuth()
  
  const [form, setForm] = useState({
    fullname: '',
    email: '',
    phone: '',
    companyName: '',
    panNumber: '',
    vatNumber: '',
    citizenship: '',
    establishedDate: '',
    turnover: '',
    password: '',
    confirmPassword: '',
    profilePhoto: null
  })
  
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [step, setStep] = useState(1) // 1: Personal, 2: Business, 3: Security

  const handleChange = (e) => {
    const { name, value, type, files } = e.target
    
    if (type === 'file') {
      setForm(prev => ({ ...prev, [name]: files[0] }))
    } else {
      setForm(prev => ({ ...prev, [name]: value }))
    }
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const validateStep = () => {
    let stepData = {}
    let stepFields = []

    if (step === 1) {
      stepFields = ['fullname', 'email', 'phone']
      stepData = { fullname: form.fullname, email: form.email, phone: form.phone }
    } else if (step === 2) {
      stepFields = ['companyName', 'panNumber', 'vatNumber', 'citizenship', 'establishedDate', 'turnover']
      stepData = {
        companyName: form.companyName,
        panNumber: form.panNumber,
        vatNumber: form.vatNumber,
        citizenship: form.citizenship,
        establishedDate: form.establishedDate,
        turnover: form.turnover
      }
    } else if (step === 3) {
      stepFields = ['password', 'confirmPassword']
      stepData = { password: form.password, confirmPassword: form.confirmPassword }
    }

    const stepErrors = {}
    stepFields.forEach(field => {
      if (!stepData[field]) {
        stepErrors[field] = 'This field is required'
      }
    })

    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors)
      return false
    }

    return true
  }

  const handleNext = () => {
    if (validateStep()) {
      setStep(step + 1)
    }
  }

  const handlePrevious = () => {
    setStep(step - 1)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateStep()) {
      return
    }

    const validation = validateFormData(SellerRegistrationSchema, form)
    if (!validation.success) {
      setErrors(validation.errors)
      return
    }

    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('fullname', form.fullname)
      formData.append('email', form.email)
      formData.append('phone', form.phone)
      formData.append('companyName', form.companyName)
      formData.append('panNumber', form.panNumber)
      formData.append('vatNumber', form.vatNumber)
      formData.append('citizenship', form.citizenship)
      formData.append('establishedDate', form.establishedDate)
      formData.append('turnover', form.turnover)
      formData.append('password', form.password)
      if (form.profilePhoto) {
        formData.append('profilePhoto', form.profilePhoto)
      }

      await register(formData, 'seller')
      navigate('/')
    } catch (error) {
      setErrors({ general: error.message })
    } finally {
      setLoading(false)
    }
  }


  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-black text-white py-4 px-4 md:px-8 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 hover:opacity-70 transition-opacity duration-300">
          <img src="/src/assets/images/favicon/favicon.ico" alt="ProcureNP" className="h-8 w-8" />
          <span className="font-semibold text-lg">ProcureNP</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors text-sm font-medium">
            <i className="bi bi-arrow-left"></i>
            <span>Back to Home</span>
          </Link>
          <p className="text-sm text-gray-300">Step {step} of 3</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 md:px-8 py-8 md:py-12">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex gap-2">
            {[1, 2, 3].map(s => (
              <div
                key={s}
                className={`h-2 flex-1 rounded-full transition-colors ${
                  s <= step ? 'bg-black' : 'bg-gray-300'
                }`}
              ></div>
            ))}
          </div>
        </div>

        {/* Form Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {step === 1 && 'Personal Information'}
            {step === 2 && 'Business Information'}
            {step === 3 && 'Create Your Password'}
          </h1>
          <p className="text-gray-600">
            {step === 1 && 'Tell us about yourself'}
            {step === 2 && 'Provide your business details'}
            {step === 3 && 'Secure your account'}
          </p>
        </div>

        {/* Errors */}
        {errors.general && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm font-medium">{errors.general}</p>
          </div>
        )}

        {authError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm font-medium">{authError}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: Personal Information */}
          {step === 1 && (
            <div className="space-y-5">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input 
                  name="fullname"
                  value={form.fullname}
                  onChange={handleChange}
                  type="text"
                  placeholder="Your full name"
                  className={`w-full px-4 py-2.5 bg-gray-50 border rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                    errors.fullname ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-black'
                  }`}
                />
                {errors.fullname && <p className="text-red-500 text-sm mt-1">{errors.fullname}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input 
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  type="text"
                  placeholder="you@example.com"
                  className={`w-full px-4 py-2.5 bg-gray-50 border rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                    errors.email ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-black'
                  }`}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input 
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  type="tel"
                  placeholder="+977 98XXXXXXXX"
                  className={`w-full px-4 py-2.5 bg-gray-50 border rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                    errors.phone ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-black'
                  }`}
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>

              {/* Profile Photo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Profile Photo</label>
                <div className={`relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                  errors.profilePhoto ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                }`}>
                  <input 
                    name="profilePhoto"
                    onChange={handleChange}
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <div className="py-2">
                    <i className="bi bi-cloud-upload text-3xl text-gray-400"></i>
                    <p className="text-sm text-gray-600 mt-2">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                  </div>
                </div>
                {errors.profilePhoto && <p className="text-red-500 text-sm mt-1">{errors.profilePhoto}</p>}
              </div>
            </div>
          )}

          {/* Step 2: Business Information */}
          {step === 2 && (
            <div className="space-y-5">
              {/* Company Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                <input 
                  name="companyName"
                  value={form.companyName}
                  onChange={handleChange}
                  type="text"
                  placeholder="Your company name"
                  className={`w-full px-4 py-2.5 bg-gray-50 border rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                    errors.companyName ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-black'
                  }`}
                />
                {errors.companyName && <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>}
              </div>

              {/* PAN Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">PAN Number</label>
                <input 
                  name="panNumber"
                  value={form.panNumber}
                  onChange={handleChange}
                  type="text"
                  placeholder="Your PAN number"
                  className={`w-full px-4 py-2.5 bg-gray-50 border rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                    errors.panNumber ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-black'
                  }`}
                />
                {errors.panNumber && <p className="text-red-500 text-sm mt-1">{errors.panNumber}</p>}
              </div>

              {/* VAT Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">VAT Number (Optional)</label>
                <input 
                  name="vatNumber"
                  value={form.vatNumber}
                  onChange={handleChange}
                  type="text"
                  placeholder="Your VAT number"
                  className={`w-full px-4 py-2.5 bg-gray-50 border rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                    errors.vatNumber ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-black'
                  }`}
                />
                {errors.vatNumber && <p className="text-red-500 text-sm mt-1">{errors.vatNumber}</p>}
              </div>

              {/* Citizenship */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Citizenship</label>
                <input 
                  name="citizenship"
                  value={form.citizenship}
                  onChange={handleChange}
                  type="text"
                  placeholder="Your citizenship number"
                  className={`w-full px-4 py-2.5 bg-gray-50 border rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                    errors.citizenship ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-black'
                  }`}
                />
                {errors.citizenship && <p className="text-red-500 text-sm mt-1">{errors.citizenship}</p>}
              </div>

              {/* Established Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Established Date</label>
                <input 
                  name="establishedDate"
                  value={form.establishedDate}
                  onChange={handleChange}
                  type="date"
                  className={`w-full px-4 py-2.5 bg-gray-50 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                    errors.establishedDate ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-black'
                  }`}
                />
                {errors.establishedDate && <p className="text-red-500 text-sm mt-1">{errors.establishedDate}</p>}
              </div>

              {/* Annual Turnover */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Annual Turnover (NPR)</label>
                <input 
                  name="turnover"
                  value={form.turnover}
                  onChange={handleChange}
                  type="number"
                  placeholder="0"
                  className={`w-full px-4 py-2.5 bg-gray-50 border rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                    errors.turnover ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-black'
                  }`}
                />
                {errors.turnover && <p className="text-red-500 text-sm mt-1">{errors.turnover}</p>}
              </div>
            </div>
          )}

          {/* Step 3: Security */}
          {step === 3 && (
            <div className="space-y-5">
              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <input 
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className={`w-full px-4 py-2.5 bg-gray-50 border rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                      errors.password ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-black'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                <div className="relative">
                  <input 
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className={`w-full px-4 py-2.5 bg-gray-50 border rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                      errors.confirmPassword ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-black'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    <i className={`bi ${showConfirmPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
              </div>

              {/* Terms */}
              <div className="flex items-start gap-2">
                <input type="checkbox" id="terms" className="w-4 h-4 text-black bg-gray-50 border-gray-200 rounded mt-1 cursor-pointer" />
                <label htmlFor="terms" className="text-sm text-gray-600 cursor-pointer">
                  I agree to the <a href="#" className="text-black hover:underline font-medium">Terms of Service</a> and <a href="#" className="text-black hover:underline font-medium">Privacy Policy</a>
                </label>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-4 pt-8">
            {step > 1 && (
              <button
                type="button"
                onClick={handlePrevious}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-2.5 rounded-lg transition-colors"
              >
                Previous
              </button>
            )}
            
            {step < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex-1 bg-black hover:bg-gray-900 text-white font-semibold py-2.5 rounded-lg transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-black hover:bg-gray-900 text-white font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating Account...' : 'Create Seller Account'}
              </button>
            )}
          </div>
        </form>

        {/* Login Link */}
        <p className="text-center text-gray-600 text-sm mt-8">
          Already have an account?{' '}
          <Link to="/login" className="text-black hover:text-gray-700 font-semibold">
            Sign in
          </Link>
        </p>

        {/* Buyer CTA */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200 text-center">
          <p className="text-sm text-gray-700 mb-3">
            Want to buy on ProcureNP instead?
          </p>
          <Link 
            to="/register" 
            className="inline-block bg-black hover:bg-gray-900 text-white px-6 py-2 rounded-lg font-semibold transition-colors text-sm w-full text-center uppercase"
          >
            Register as Buyer
          </Link>
        </div>
      </div>
    </div>
  )
}

export default GetStarted

