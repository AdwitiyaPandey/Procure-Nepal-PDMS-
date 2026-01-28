import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { validateFormData, ForgotPasswordSchema, ResetPasswordSchema } from '../../utils/validationSchemas'

const ForgotPassword = () => {
  const navigate = useNavigate()
  const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000'

  // State for step 1: Email entry
  const [step, setStep] = useState(1) // 1 = email, 2 = OTP
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [generalError, setGeneralError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [otpEmail, setOtpEmail] = useState('')

  // Step 1: Request OTP
  const handleEmailSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})
    setGeneralError('')

    // Validate email
    const validation = validateFormData(ForgotPasswordSchema, { email })
    if (!validation.success) {
      setErrors(validation.errors)
      setLoading(false)
      return
    }

    try {
      const response = await axios.post(`${API_BASE}/api/auth/forgot-password`, { email })
      setOtpSent(true)
      setOtpEmail(email)
      setStep(2)
      setEmail('')
    } catch (error) {
      setGeneralError(error.response?.data?.error || 'Failed to send OTP. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Step 2: Verify OTP and reset password
  const handleOtpSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})
    setGeneralError('')

    // Validate OTP
    if (!otp || otp.length !== 6) {
      setErrors({ otp: 'Please enter a valid 6-digit OTP' })
      setLoading(false)
      return
    }

    // Validate password
    if (password.length < 8) {
      setErrors({ password: 'Password must be at least 8 characters' })
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setErrors({ confirmPassword: 'Passwords do not match' })
      setLoading(false)
      return
    }

    try {
      const response = await axios.post(`${API_BASE}/api/auth/verify-otp`, {
        email: otpEmail,
        otp,
        password,
        confirmPassword,
      })

      // Success - redirect to login
      setTimeout(() => {
        navigate('/login')
      }, 2000)

      setStep(3) // Success step
    } catch (error) {
      setGeneralError(error.response?.data?.error || 'Failed to reset password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Success screen
  if (step === 3) {
    return (
      <div className="min-h-screen bg-white flex flex-col justify-center items-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
              <i className="bi bi-check-circle text-2xl text-green-600"></i>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-3">Password Reset Successful!</h1>
          <p className="text-gray-600 mb-6">
            Your password has been changed successfully. Redirecting to login...
          </p>

          <Link to="/login" className="inline-block text-black hover:text-gray-700 font-semibold">
            Go to Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row">
      {/* Left Side - Brand Section */}
      <div className="hidden md:flex md:w-1/2 bg-black text-white flex-col justify-center items-center p-8">
        <div className="mb-8">
          <img src="/src/assets/images/favicon/android-chrome-192x192.png" alt="ProcureNP Logo" className="h-16 w-16 mx-auto mb-4" />
          <p className="text-center text-xl font-bold">ProcureNP</p>
        </div>
        <img src="/wb-logo.svg" alt="WB Logo" className="h-24 w-24 mb-8" />
        <p className="text-gray-300 text-lg text-center mb-8">
          Reset your password securely using OTP
        </p>
        <div className="space-y-4 text-gray-300">
          <div className="flex items-center gap-3">
            <i className="bi bi-shield-check text-xl"></i>
            <span>Secure password reset</span>
          </div>
          <div className="flex items-center gap-3">
            <i className="bi bi-lightning text-xl"></i>
            <span>Quick and easy process</span>
          </div>
          <div className="flex items-center gap-3">
            <i className="bi bi-envelope text-xl"></i>
            <span>OTP sent to your email</span>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-8 md:overflow-y-auto md:max-h-screen">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-6 md:hidden hover:opacity-70 transition-opacity duration-300">
              <img src="/src/assets/images/favicon/android-chrome-192x192.png" alt="ProcureNP" className="h-10 w-10" />
            </Link>
            <Link to="/" className="inline-flex items-center gap-2 mb-4 text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium">
              <i className="bi bi-arrow-left"></i>
              <span>Back to Home</span>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Reset Password</h1>
            <p className="text-gray-600 mt-2">
              {step === 1 ? 'Enter your email to receive an OTP' : 'Enter the OTP and your new password'}
            </p>
          </div>

          {/* Progress indicator */}
          <div className="flex gap-3 mb-8">
            <div className={`flex-1 h-2 rounded-full ${step >= 1 ? 'bg-black' : 'bg-gray-200'}`}></div>
            <div className={`flex-1 h-2 rounded-full ${step >= 2 ? 'bg-black' : 'bg-gray-200'}`}></div>
          </div>

          {/* General Error */}
          {generalError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm font-medium">{generalError}</p>
            </div>
          )}

          {/* Step 1: Email */}
          {step === 1 && (
            <form onSubmit={handleEmailSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input 
                  type="text"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (errors.email) setErrors(prev => ({ ...prev, email: undefined }))
                  }}
                  placeholder="you@example.com"
                  className={`w-full px-4 py-2.5 bg-gray-50 border rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                    errors.email ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-black'
                  }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-black hover:bg-gray-900 text-white font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed uppercase"
              >
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </button>
            </form>
          )}

          {/* Step 2: OTP and Password */}
          {step === 2 && (
            <form onSubmit={handleOtpSubmit} className="space-y-5">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-blue-800">
                  We sent a 6-digit OTP to <strong>{otpEmail}</strong>
                </p>
              </div>

              {/* OTP */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">One-Time Password (OTP)</label>
                <input 
                  type="text"
                  maxLength="6"
                  value={otp}
                  onChange={(e) => {
                    setOtp(e.target.value.replace(/\D/g, ''))
                    if (errors.otp) setErrors(prev => ({ ...prev, otp: undefined }))
                  }}
                  placeholder="000000"
                  className={`w-full px-4 py-2.5 bg-gray-50 border rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:bg-white transition-all text-center text-2xl tracking-widest ${
                    errors.otp ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-black'
                  }`}
                />
                {errors.otp && (
                  <p className="text-red-500 text-sm mt-1">{errors.otp}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                <div className="relative">
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      if (errors.password) setErrors(prev => ({ ...prev, password: undefined }))
                    }}
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
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                <div className="relative">
                  <input 
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value)
                      if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: undefined }))
                    }}
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
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                )}
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-black hover:bg-gray-900 text-white font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed uppercase"
              >
                {loading ? 'Resetting Password...' : 'Reset Password'}
              </button>

              {/* Go back option */}
              <button 
                type="button"
                onClick={() => {
                  setStep(1)
                  setOtp('')
                  setPassword('')
                  setConfirmPassword('')
                  setOtpSent(false)
                  setErrors({})
                }}
                className="w-full text-black hover:text-gray-700 font-semibold py-2.5 rounded-lg transition-colors"
              >
                ← Back to Email
              </button>
            </form>
          )}

          {/* Back to Login */}
          <p className="text-center text-gray-600 text-sm mt-6">
            Remember your password?{' '}
            <Link to="/login" className="text-black hover:text-gray-700 font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
