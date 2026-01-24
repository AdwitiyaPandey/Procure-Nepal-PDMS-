import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function AdminDashboard() {
  const [suppliers, setSuppliers] = useState([])
  const [loading, setLoading] = useState(false)

  const API_BASE = 'http://localhost:4000'

  function fetchSuppliers() {
    setLoading(true)
    fetch(`${API_BASE}/api/admin/suppliers`)
      .then(r => r.json())
      .then(list => setSuppliers(Array.isArray(list) ? list : []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchSuppliers()
  }, [])

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <img 
                src="/src/assets/images/favicon/favicon.ico" 
                alt="ProcureNP" 
                className="h-8 w-auto"
              />
              <span className="font-semibold text-gray-900">ProcureNP Admin</span>
            </Link>
            <Link to="/" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
              Back to site
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Buyers</p>
                <p className="text-3xl font-bold text-gray-900">{buyersCount}</p>
              </div>
              <div className="text-4xl text-black opacity-20">👥</div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Suppliers</p>
                <p className="text-3xl font-bold text-gray-900">{suppliersCount}</p>
              </div>
              <div className="text-4xl text-black opacity-20">🏢</div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-yellow-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Pending Approvals</p>
                <p className="text-3xl font-bold text-yellow-600">{pendingCount}</p>
              </div>
              <div className="text-4xl opacity-20">⏳</div>
            </div>
          </div>
        </div>

        {/* Suppliers Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Supplier Registrations</h2>
            <p className="text-sm text-gray-600 mt-1">Review and approve pending supplier applications</p>
          </div>

          {loading ? (
            <div className="px-6 py-12 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
              <p className="mt-4 text-gray-600">Loading suppliers...</p>
            </div>
          ) : suppliers.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-gray-600">No suppliers found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Company</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {suppliers.map(s => (
                    <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{s.fullname}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{s.companyName}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{s.email}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                          s.status === 'pending' ? 'bg-yellow-50 text-yellow-700' :
                          s.status === 'approved' ? 'bg-green-50 text-green-700' :
                          'bg-red-50 text-red-700'
                        }`}>
                          {s.status.charAt(0).toUpperCase() + s.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm space-x-2">
                        {s.status === 'pending' ? (
                          <div className="flex gap-2">
                            <button 
                              onClick={() => approveSupplier(s.id)} 
                              className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded transition-colors"
                            >
                              Approve
                            </button>
                            <button 
                              onClick={() => rejectSupplier(s.id)} 
                              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded transition-colors"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-500">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard

