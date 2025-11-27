import React from 'react'
import { Link } from 'react-router-dom'

function AdminDashboard() {
  // Placeholder UI — in a real app this would fetch data from the server
  const buyersCount = 12
  const suppliersCount = 8

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="p-4 border rounded">
            <div className="text-sm text-gray-500">Buyers registered</div>
            <div className="text-2xl font-semibold">{buyersCount}</div>
          </div>
          <div className="p-4 border rounded">
            <div className="text-sm text-gray-500">Suppliers registered</div>
            <div className="text-2xl font-semibold">{suppliersCount}</div>
          </div>
          <div className="p-4 border rounded">
            <div className="text-sm text-gray-500">Pending approvals</div>
            <div className="text-2xl font-semibold">3</div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Supplier Listings</h2>
          <p className="text-sm text-gray-600 mb-4">Use the action buttons to read, update, or delete listings (placeholder UI).</p>

          <table className="w-full border-collapse">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2">Listing</th>
                <th className="py-2">Supplier</th>
                <th className="py-2">Price</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-3">Sample Item A</td>
                <td className="py-3">Supplier X</td>
                <td className="py-3">NPR 25,000</td>
                <td className="py-3">
                  <button className="mr-2 px-2 py-1 border rounded">Read</button>
                  <button className="mr-2 px-2 py-1 bg-blue-600 text-white rounded">Update</button>
                  <button className="px-2 py-1 bg-red-600 text-white rounded">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>

          <div className="mt-6">
            <Link to="/" className="text-blue-600 underline">Back to site</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
