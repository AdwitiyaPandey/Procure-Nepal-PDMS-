import React from 'react'
import { Link } from 'react-router-dom'

function GetStarted() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-md rounded p-8">
        <h1 className="text-2xl font-bold mb-4">Welcome to Procure Nepal</h1>
        <p className="mb-6">Are you signing up as a Buyer or a Supplier? Choose one to continue the onboarding flow.</p>

        <div className="flex gap-4">
          <Link to="/signup/buyer" className="flex-1 text-center bg-blue-600 text-white py-2 rounded">I'm a Buyer</Link>
          <Link to="/signup/supplier" className="flex-1 text-center bg-yellow-500 text-black py-2 rounded">I'm a Supplier</Link>
        </div>

        <p className="mt-6 text-sm text-gray-600">After signup you'll be asked to provide business details and verification documents for admin approval.</p>
      </div>
    </div>
  )
}

export default GetStarted
