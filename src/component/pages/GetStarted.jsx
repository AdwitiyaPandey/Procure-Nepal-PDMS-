import React from 'react'
import { Link } from 'react-router-dom'

function GetStarted() {
  return (
    <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
      <div className="max-w-md w-full bg-white shadow-md rounded-xl p-8">
        <h1 className="text-2xl font-semibold mb-4">Welcome to Procure Nepal</h1>
        <p className="mb-6 text-gray-600">Are you signing up as a Buyer or a Supplier? Choose one to continue the onboarding flow.</p>

        <div className="flex gap-4">
          <Link to="/signup/buyer" className="flex-1 text-center bg-gradient-to-r from-green-600 to-blue-600 text-white py-2 rounded-md">I'm a Buyer</Link>
          <Link to="/signup/supplier" className="flex-1 text-center bg-yellow-500 text-black py-2 rounded-md">I'm a Supplier</Link>
        </div>

        <p className="mt-6 text-sm text-gray-600">After signup you'll be asked to provide business details and verification documents for admin approval.</p>
      </div>
    </div>
  )
}

export default GetStarted
