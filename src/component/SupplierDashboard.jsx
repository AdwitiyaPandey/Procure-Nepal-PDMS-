import React, { useState, useEffect } from 'react'
import { useAuth } from '../AuthContext'
import { useNavigate } from 'react-router-dom'

function SupplierDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    name: '',
    description: '',
    category: 'General',
    // subCategory, condition and quantity removed from the visible form per request
    price: '',
    // keep an internal quantity default so the backend validation still succeeds
    quantity: '1',
    marginPercentage: '20',
    image: null,
    location: '',
    deliveryAvailable: false,
    deliveryCharge: ''
  })

  const API_BASE = 'http://localhost:4000'

  useEffect(() => {
    if (!user) return
    // fetch freshest profile (includes supplier fields linked by user id)
    fetchProfile()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  async function fetchProfile() {
    try {
      const token = localStorage.getItem('token')
      if (!token) return
      const res = await fetch(`${API_BASE}/api/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
      if (!res.ok) return
      const data = await res.json()
      // auth /me returns { user: { ... } }
      const u = data.user || data
      setProfile(u)
      // after profile, fetch products by supplier id
      const supplierId = u?.supplier?.id
      if (supplierId) await fetchProducts(supplierId)
      else await fetchProducts()
    } catch (err) {
      console.error('Failed to fetch profile', err)
    }
  }

  async function fetchProducts(explicitSupplierId) {
    setLoading(true)
    try {
      // prefer explicit supplier id from profile, fallback to user.supplier
      const supplierId = explicitSupplierId ?? profile?.supplier?.id ?? user?.supplier?.id
      if (!supplierId) {
        setProducts([])
        return
      }
      const res = await fetch(`${API_BASE}/api/products/seller/${supplierId}`)
      const list = await res.json()
      setProducts(Array.isArray(list) ? list : [])
    } catch (err) {
      console.error(err)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  function handleChange(e) {
    const { name, value, files, type, checked } = e.target
    if (files) {
      // single image support - use the first selected file
      setForm(prev => ({ ...prev, image: files[0] }))
    } else if (type === 'checkbox') {
      setForm(prev => ({ ...prev, [name]: checked }))
    } else {
      setForm(prev => ({ ...prev, [name]: value }))
    }
  }

  function resetForm() {
    setForm({ name: '', description: '', category: 'General', price: '', quantity: '1', marginPercentage: '20', image: null, location: '', deliveryAvailable: false, deliveryCharge: '' })
    setEditingId(null)
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!form.name || !form.price) {
      setError('Name and price are required')
      return
    }

    setLoading(true)
    try {
      const fd = new FormData()
      fd.append('name', String(form.name))
      fd.append('description', String(form.description || ''))
      fd.append('category', String(form.category))
      // subCategory and condition removed from UI; not sent
      fd.append('location', String(form.location || ''))
      // send as strings (FormData will convert appropriately)
      fd.append('price', String(parseFloat(String(form.price) || '0')))
      fd.append('quantity', String(parseInt(String(form.quantity) || '1')))
      fd.append('marginPercentage', String(parseFloat(String(form.marginPercentage) || '0')))
      if (form.deliveryAvailable) {
        fd.append('deliveryAvailable', '1')
        fd.append('deliveryCharge', String(form.deliveryCharge || '0'))
      }
      if (form.image) {
        // server expects single file field named 'image'
        fd.append('image', form.image)
      }

      let url = `${API_BASE}/api/products`
      let method = 'POST'
      if (editingId) {
        url = `${API_BASE}/api/products/${editingId}`
        method = 'PUT'
      }

      const token = localStorage.getItem('token')
      const response = await fetch(url, { method, body: fd, headers: token ? { Authorization: `Bearer ${token}` } : {} })

      // Try to parse response safely
      let data
      try {
        data = await response.json()
      } catch (parseErr) {
        const text = await response.text().catch(() => '')
        console.error('Non-JSON response from server:', response.status, text)
        setError(`Server responded with status ${response.status}`)
        return
      }

      if (response.ok) {
        // server returns created product object
        await fetchProducts()
        setShowForm(false)
        resetForm()
        alert(editingId ? 'Product updated!' : 'Product added!')
      } else {
        console.error('Create product failed:', response.status, data)
        setError(data?.error || data?.message || 'Error saving product')
      }
    } catch (err) {
      console.error('Submit error:', err)
      setError('Failed to save product')
    } finally {
      setLoading(false)
    }
  }

  function startEdit(product) {
    setForm({
      name: product.name || '',
      description: product.description || '',
      category: product.category || 'General',
      price: product.price != null ? String(product.price) : '',
      quantity: product.quantity != null ? String(product.quantity) : '1',
      marginPercentage: product.marginPercentage != null ? String(product.marginPercentage) : '20',
      image: null,
      location: product.location || '',
      deliveryAvailable: product.deliveryAvailable || false,
      deliveryCharge: product.deliveryCharge || ''
    })
    setEditingId(product.id)
    setShowForm(true)
    setError('')
  }

  async function deleteProduct(id) {
    if (!confirm('Are you sure?')) return
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${API_BASE}/api/products/${id}`, { method: 'DELETE', headers: token ? { Authorization: `Bearer ${token}` } : {} })
      const data = await res.json()
      if (res.ok && data.ok) {
        await fetchProducts()
        alert('Product deleted!')
      } else {
        setError(data.error || 'Delete failed')
      }
    } catch (err) {
      console.error(err)
      setError('Failed to delete product')
    }
  }

  if (!user) return <div>Redirecting...</div>

  return (
    <div className="min-h-screen bg-white p-8 text-black">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Supplier Dashboard</h1>
            <p className="text-gray-600">Manage your products</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/search')}
              className="bg-gray-800 text-white px-3 py-2 rounded-md text-sm"
            >
              Browse Products
            </button>
            <button
              onClick={() => navigate('/')}
              className="border border-gray-300 px-3 py-2 rounded-md text-sm"
            >
              Home
            </button>
            <button
              onClick={() => { setShowForm(!showForm); if (!showForm) resetForm() }}
              className="bg-black text-white px-4 py-2 rounded-md"
            >
              {showForm ? 'Cancel' : '➕ Add Product'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left: Profile Sidebar */}
          <aside className="bg-white rounded-xl p-6 lg:col-span-1">
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <i className="bi bi-person text-3xl text-gray-400"></i>
              </div>
              <h3 className="text-lg font-semibold">{(profile?.fullname ?? user?.fullname) || user?.name || 'Seller'}</h3>
              <p className="text-sm text-gray-500 mt-1">{profile?.email ?? user?.email ?? 'No email'}</p>
              <p className="text-sm text-gray-500">{profile?.phone ?? user?.phone ?? 'No phone'}</p>
              <div className="mt-4 w-full text-left">
                <h4 className="text-sm font-medium text-gray-700">Business</h4>
                <p className="text-sm text-gray-600">{profile?.supplier?.companyName ?? user?.companyName ?? user?.businessName ?? '—'}</p>
                <p className="text-sm text-gray-600">PAN: {profile?.supplier?.pan ?? user?.panNumber ?? '—'}</p>
                <p className="text-sm text-gray-600">VAT: {profile?.supplier?.vat ?? '—'}</p>
                <p className="text-sm text-gray-600">Turnover: {profile?.supplier?.turnover ?? '—'}</p>
                <p className="text-sm text-gray-600">Citizenship: {profile?.supplier?.citizenship ?? '—'}</p>
              </div>
              {/* 'Update my profile' button removed per request */}
            </div>
          </aside>

          {/* Right: Form + Products */}
          <main className="lg:col-span-3">
            {/* Product Form */}
            {showForm && (
              <div className="bg-white p-6 rounded-xl shadow mb-6">
                <h2 className="text-xl font-semibold mb-4">{editingId ? 'Edit Product' : 'Add New Product'}</h2>

                {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-2 text-sm font-semibold text-gray-700">Product Name *</label>
                      <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                        placeholder="e.g., Premium Rice - 50kg"
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-semibold text-gray-700">Category</label>
                      <select
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                      >
                        <option>General</option>
                        <option>Agriculture &amp; Food</option>
                        <option>Electronics &amp; IT</option>
                        <option>Textiles &amp; Apparel</option>
                        <option>Metal &amp; Machinery</option>
                        <option>Construction Materials</option>
                        <option>Chemicals &amp; Plastics</option>
                        <option>Handicrafts</option>
                        <option>Spices &amp; Condiments</option>
                      </select>
                    </div>
                  </div>

                  {/* Sub Category and Condition removed from UI per request */}

                  <div>
                    <label className="block mb-2 text-sm font-semibold text-gray-700">Description</label>
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 h-24"
                      placeholder="Product details..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-2 text-sm font-semibold text-gray-700">Price (NPR) *</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        name="price"
                        value={form.price}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-black"
                        placeholder="0"
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-semibold text-gray-700">Est. Margin %</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        name="marginPercentage"
                        value={form.marginPercentage}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-black"
                        placeholder="20"
                      />
                      <p className="text-xs text-gray-500 mt-1">Estimated retail margin percentage</p>
                    </div>
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-semibold text-gray-700">Location</label>
                    <input name="location" value={form.location} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md" placeholder="City, District" />
                  </div>

                  <div className="flex items-center gap-4">
                    <label className="inline-flex items-center">
                      <input type="checkbox" name="deliveryAvailable" checked={form.deliveryAvailable} onChange={handleChange} className="mr-2" />
                      <span className="text-sm text-gray-700">Delivery Available</span>
                    </label>
                    {form.deliveryAvailable && (
                      <input name="deliveryCharge" value={form.deliveryCharge} onChange={handleChange} placeholder="Delivery charge (NPR)" className="p-2 border border-gray-300 rounded-md" />
                    )}
                  </div>

                    <div>
                      <label className="block mb-2 text-sm font-semibold text-gray-700">Product Image</label>
                      <input
                        type="file"
                        accept="image/*"
                        name="image"
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                      {form.image && (
                        <div className="mt-3">
                          <img src={URL.createObjectURL(form.image)} alt="preview" className="w-32 h-20 object-cover rounded-md" />
                        </div>
                      )}
                    </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-black text-white py-2 rounded-md disabled:opacity-50"
                    >
                      {loading ? 'Saving...' : 'Save Product'}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setShowForm(false); resetForm() }}
                      className="flex-1 border border-gray-300 py-2 rounded-md"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Products List */}
            <div className="bg-white rounded-xl shadow">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold">Your Products ({products.length})</h2>
              </div>

              {loading && !showForm ? (
                <div className="p-6 text-center text-gray-600">Loading products...</div>
              ) : products.length === 0 ? (
                <div className="p-6 text-center text-gray-600">
                  No products yet. {!showForm && <button onClick={() => setShowForm(true)} className="text-green-600 underline">Add one now</button>}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left border-b bg-gray-50">
                        <th className="p-4">Product Name</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">Price (NPR)</th>
                        <th className="p-4">Margin</th>
                        <th className="p-4">Quantity</th>
                        <th className="p-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map(product => (
                        <tr key={product.id} className="border-b hover:bg-gray-50">
                          <td className="p-4 font-semibold">{product.name}</td>
                          <td className="p-4 text-sm text-gray-600">{product.category}</td>
                          <td className="p-4 font-semibold text-green-600">{product.price?.toLocaleString?.() ?? product.price}</td>
                          <td className="p-4 text-sm text-orange-600">{product.marginPercentage || 20}%</td>
                          <td className="p-4">{product.quantity}</td>
                          <td className="p-4 flex gap-2">
                            <button
                              onClick={() => startEdit(product)}
                              className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => deleteProduct(product.id)}
                              className="px-3 py-1 bg-red-600 text-white rounded-md text-sm"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default SupplierDashboard
// Commit: 2026-01-01 Ujjwal
// Commit: 2026-01-01 Ujjwal