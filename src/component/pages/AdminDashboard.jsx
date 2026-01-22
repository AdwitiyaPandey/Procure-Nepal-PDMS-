import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function AdminDashboard() {
  const [suppliers, setSuppliers] = useState([])
  const [loading, setLoading] = useState(false)

  const API_BASE = 'http://localhost:5000'

  useEffect(() => {
    fetchSuppliers()
  }, [])

  function fetchSuppliers() {
    setLoading(true)
    fetch(`${API_BASE}/api/admin/suppliers`)
      .then(r => r.json())
      .then(list => setSuppliers(Array.isArray(list) ? list : []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }

  function approveSupplier(id) {
    if (!confirm('Approve this supplier and send temporary password?')) return
    fetch(`${API_BASE}/api/admin/suppliers/${id}/approve`, { method: 'POST' })
      .then(r => r.json())
      .then(() => fetchSuppliers())
      .catch(err => console.error(err))
  }

  function rejectSupplier(id) {
    const reason = prompt('Optional rejection reason')
    fetch(`${API_BASE}/api/admin/suppliers/${id}/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason })
    })
      .then(r => r.json())
      .then(() => fetchSuppliers())
      .catch(err => console.error(err))
  }

  const buyersCount = 0
  const suppliersCount = suppliers.length
  const pendingCount = suppliers.filter(s => s.status === 'pending').length

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto bg-white p-6 md:p-8 rounded-xl shadow">
        <h1 className="text-2xl font-semibold mb-4">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 border rounded-lg">
            <div className="text-sm text-gray-500">Buyers registered</div>
            <div className="text-2xl font-semibold">{buyersCount}</div>
          </div>
          <div className="p-4 border rounded-lg">
            <div className="text-sm text-gray-500">Suppliers registered</div>
            <div className="text-2xl font-semibold">{suppliersCount}</div>
          </div>
          <div className="p-4 border rounded-lg">
            <div className="text-sm text-gray-500">Pending approvals</div>
            <div className="text-2xl font-semibold">{pendingCount}</div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Supplier Listings</h2>
          <p className="text-sm text-gray-600 mb-4">Approve or reject supplier registrations submitted by users.</p>

          {loading ? <div className="py-6">Loading...</div> : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-2">Name</th>
                  <th className="py-2">Company</th>
                  <th className="py-2">Email</th>
                  <th className="py-2">Status</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {suppliers.map(s => (
                  <tr key={s.id} className="border-b">
                    <td className="py-3">{s.fullname}</td>
                    <td className="py-3">{s.companyName}</td>
                    <td className="py-3">{s.email}</td>
                    <td className="py-3">{s.status}</td>
                    <td className="py-3">
                      {s.status === 'pending' ? (
                        <>
                          <button onClick={() => approveSupplier(s.id)} className="mr-2 px-2 py-1 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-md">Approve</button>
                          <button onClick={() => rejectSupplier(s.id)} className="px-2 py-1 bg-red-600 text-white rounded-md">Reject</button>
                        </>
                      ) : (
                        <span className="text-sm text-gray-500">No actions</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <div className="mt-6">
            <Link to="/" className="text-green-600 underline">Back to site</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
