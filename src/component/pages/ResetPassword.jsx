import { useState, useEffect } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../AuthContext'
import { validateFormData, ResetPasswordSchema } from '../../utils/validationSchemas'

const ResetPassword = () => {
  const { resetPassword, error: authError } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  const [form, setForm] = useState({
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!token) {
      setErrors({ general: 'Invalid reset link. Please try again.' })
    }
  }, [token])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!token) {
      setErrors({ general: 'Invalid reset link. Please try again.' })
      return
    }

    // Validate with Zod
    const validation = validateFormData(ResetPasswordSchema, form)
    if (!validation.success) {
      setErrors(validation.errors)
      return
    }

    setLoading(true)

    try {
      await resetPassword(token, form.password, form.confirmPassword)
      setSuccess(true)
      setForm({ password: '', confirmPassword: '' })
      setErrors({})
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login')
      }, 3000)
    } catch (error) {
      setErrors({ general: error.message || 'Failed to reset password. Try again.' })
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-white flex flex-col justify-center items-center p-4">
        <div className="max-w-md w-full text-center">
          {/* Success Icon */}
          <div className="mb-6">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
              <i className="bi bi-check-circle text-2xl text-green-600"></i>
            </div>
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Password Reset</h1>
          <p className="text-gray-600 mb-6">
            Your password has been successfully reset. Redirecting to login...
          </p>

          {/* Spinner */}
          <div className="flex justify-center mb-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
          </div>

          {/* Manual redirect link */}
          <Link to="/login" className="inline-block text-black hover:text-gray-700 font-semibold">
            Go to login now
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row">
      {/* Left Side - Brand Section (Hidden on mobile) */}
      <div className="hidden md:flex md:w-1/2 bg-black text-white flex-col justify-center items-center p-8">
        <img src="/src/assets/images/favicon/android-chrome-192x192.png" alt="ProcureNP" className="h-32 w-32 mb-8" />
        <p className="text-gray-300 text-lg text-center mb-8">
          Create a new password to secure your account
        </p>
        <div className="space-y-4 text-gray-300">
          <div className="flex items-center gap-3">
            <i className="bi bi-shield-lock text-xl"></i>
            <span>Strong password protection</span>
          </div>
          <div className="flex items-center gap-3">
            <i className="bi bi-lightning text-xl"></i>
            <span>Instant activation</span>
          </div>
          <div className="flex items-center gap-3">
            <i className="bi bi-check-circle text-xl"></i>
            <span>Secure your account</span>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-6 md:hidden hover:opacity-70 transition-opacity duration-300">
              <img src="/src/assets/images/favicon/android-chrome-192x192.png" alt="ProcureNP" className="h-10 w-10" />
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Reset Password</h1>
            <p className="text-gray-600 mt-2">Enter your new password below</p>
          </div>

          {/* Invalid Link Error */}
          {!token && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm font-medium">
                This reset link is invalid or has expired. 
                <Link to="/forgot-password" className="block text-red-700 font-semibold hover:underline mt-2">
                  Request a new reset link
                </Link>
              </p>
            </div>
          )}

          {/* General Error */}
          {errors.general && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm font-medium">{errors.general}</p>
            </div>
          )}

          {/* Auth Error */}
          {authError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm font-medium">{authError}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5" disabled={!token}>
            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
              <div className="relative">
                <input 
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  disabled={!token}
                  className={`w-full px-4 py-2.5 bg-gray-50 border rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                    errors.password ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-black'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={!token}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
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
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  disabled={!token}
                  className={`w-full px-4 py-2.5 bg-gray-50 border rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                    errors.confirmPassword ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-black'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={!token}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                >
                  <i className={`bi ${showConfirmPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={loading || !token}
              className="w-full bg-black hover:bg-gray-900 text-white font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed uppercase"
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>

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

export default ResetPassword
