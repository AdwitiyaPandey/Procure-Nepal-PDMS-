import React from 'react'
import { Link } from 'react-router-dom'

export default function SellerRegistered() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
      <div className="max-w-xl w-full bg-white p-8 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-4">Registration Successful</h1>
        <p className="text-gray-700 mb-4">
          Thank you for registering as a seller. Your application has been received. If all provided documents are valid, you will receive your account details (email and password) via email once your account is approved.
        </p>
        <p className="text-gray-600 mb-6">You can return to the dashboard after approval.</p>
        <div className="flex gap-3">
          <Link to="/" className="flex-1 text-center py-2 bg-black text-white rounded">Back to Home</Link>
          <Link to="/login" className="flex-1 text-center py-2 border rounded">Sign in</Link>
        </div>
      </div>
    </div>
  )
}
