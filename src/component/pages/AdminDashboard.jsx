import React, { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'

// Simple admin login UI: when not authenticated, show a login form

function AdminDashboard() {
  const [suppliers, setSuppliers] = useState([])
  const [buyers, setBuyers] = useState([])
  const [loading, setLoading] = useState(false)
  const [token, setToken] = useState(localStorage.getItem('adminToken') || '')
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError] = useState('')

  const API_BASE = 'http://localhost:4000'

  const fetchSuppliers = useCallback(() => {
    setLoading(true)
    const headers = token ? { Authorization: `Bearer ${token}` } : {}
    fetch(`${API_BASE}/api/admin/suppliers`, { headers })
      .then(async (r) => {
        if (!r.ok) {
          const err = await r.json().catch(() => ({}))
          throw new Error(err.error || 'Failed to fetch suppliers')
        }
        return r.json()
      })
      .then(data => setSuppliers(Array.isArray(data.suppliers) ? data.suppliers : []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [token])

  const fetchBuyers = useCallback(() => {
    const headers = token ? { Authorization: `Bearer ${token}` } : {}
    fetch(`${API_BASE}/api/admin/buyers`, { headers })
      .then(async (r) => {
        if (!r.ok) {
          const err = await r.json().catch(() => ({}))
          throw new Error(err.error || 'Failed to fetch buyers')
        }
        return r.json()
      })
      .then(data => setBuyers(Array.isArray(data.buyers) ? data.buyers : []))
      .catch(err => console.error(err))
  }, [token])

  useEffect(() => {
    if (token) {
      fetchSuppliers()
      fetchBuyers()
    }
  }, [fetchSuppliers, fetchBuyers])

  const handleAdminLogin = async (e) => {
    e.preventDefault()
    setLoginError('')
    try {
      const res = await fetch(`${API_BASE}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: loginEmail, password: loginPassword }),
      })
      const data = await res.json()
      if (!res.ok) {
        setLoginError(data.error || 'Login failed')
        return
      }
      localStorage.setItem('adminToken', data.token)
      setToken(data.token)
    } catch (err) {
      console.error(err)
      setLoginError('Login failed')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    setToken('')
    setSuppliers([])
  }

  function approveSupplier(id) {
    if (!confirm('Approve this supplier and send temporary password?')) return
    const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
    fetch(`${API_BASE}/api/admin/suppliers/${id}/approve`, { method: 'PATCH', headers })
      .then(async (r) => {
        if (!r.ok) {
          const err = await r.json().catch(() => ({}))
          throw new Error(err.error || 'Failed to approve')
        }
        return r.json()
      })
      .then(() => fetchSuppliers())
      .catch(err => console.error(err))
  }

  function rejectSupplier(id) {
    const reason = prompt('Rejection reason (required)')
    if (!reason) return alert('Rejection reason is required')
    const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
    fetch(`${API_BASE}/api/admin/suppliers/${id}/reject`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ reason })
    })
      .then(async (r) => {
        if (!r.ok) {
          const err = await r.json().catch(() => ({}))
          throw new Error(err.error || 'Failed to reject')
        }
        return r.json()
      })
      .then(() => fetchSuppliers())
      .catch(err => console.error(err))
  }

  function blockSupplier(id) {
    if (!confirm('Block this supplier? This will prevent them from selling on the platform.')) return
    const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
    fetch(`${API_BASE}/api/admin/suppliers/${id}/block`, { method: 'PATCH', headers })
      .then(async (r) => {
        if (!r.ok) {
          const err = await r.json().catch(() => ({}))
          throw new Error(err.error || 'Failed to block')
        }
        return r.json()
      })
      .then(() => fetchSuppliers())
      .catch(err => console.error(err))
  }

  function unblockSupplier(id) {
    if (!confirm('Unblock this supplier? This will allow them to sell again.')) return
    const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
    fetch(`${API_BASE}/api/admin/suppliers/${id}/unblock`, { method: 'PATCH', headers })
      .then(async (r) => {
        if (!r.ok) {
          const err = await r.json().catch(() => ({}))
          throw new Error(err.error || 'Failed to unblock')
        }
        return r.json()
      })
      .then(() => {
        fetchSuppliers()
        fetchBuyers()
      })
      .catch(err => console.error(err))
  }

  const buyersCount = buyers.length
  const suppliersCount = suppliers.length
  const pendingCount = suppliers.filter(s => s.status === 'pending').length

  // If not logged in as admin show login form
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">Admin Login</h2>
          {loginError && <p className="text-red-600 mb-3">{loginError}</p>}
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Username</label>
              <input value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} className="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Password</label>
              <input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} className="w-full px-3 py-2 border rounded" />
            </div>
            <div className="flex justify-end">
              <button type="submit" className="px-4 py-2 bg-black text-white rounded">Sign in</button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
                <img
                  src="/src/assets/images/procure_logo.png"
                  alt="ProcureNP"
                  className="h-8 w-auto"
                />
              <span className="font-semibold text-gray-900">ProcureNP Admin</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link to="/" className="text-gray-600 hover:text-gray-900 text-sm font-medium">Back to site</Link>
              <button onClick={handleLogout} className="text-sm text-red-600 hover:underline">Logout</button>
            </div>
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
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Mobile</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">PAN</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">VAT</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Citizenship</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {suppliers.map(s => (
                    <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{s.user?.fullname || '-'}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{s.companyName || '-'}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{s.user?.phone || '-'}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{s.pan || '-'}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{s.vat || '-'}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{s.citizenship || '-'}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{s.user?.email || '-'}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                          s.status === 'pending' ? 'bg-yellow-50 text-yellow-700' :
                          s.status === 'approved' ? 'bg-green-50 text-green-700' :
                          s.status === 'blocked' ? 'bg-red-50 text-red-700' :
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
                          <div className="flex gap-2 items-center">
                            <span className="text-xs text-gray-500">—</span>
                            {s.status !== 'blocked' ? (
                              <button
                                onClick={() => blockSupplier(s.id)}
                                className="px-3 py-1.5 bg-yellow-600 hover:bg-yellow-700 text-white text-xs font-medium rounded transition-colors"
                              >
                                Block
                              </button>
                            ) : (
                              <button
                                onClick={() => unblockSupplier(s.id)}
                                className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded transition-colors"
                              >
                                Unblock
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Buyers Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mt-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Buyers</h2>
            <p className="text-sm text-gray-600 mt-1">List of registered buyers (read-only)</p>
          </div>

          {buyers.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-gray-600">No buyers found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Mobile</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {buyers.map(b => (
                    <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{b.fullname || '-'}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{b.email || '-'}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{b.phone || '-'}</td>
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

// Commit: 2026-01-29 Ujjwal

