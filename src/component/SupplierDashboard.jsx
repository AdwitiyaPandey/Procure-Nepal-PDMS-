import React, { useState, useEffect } from 'react'
import { useAuth } from '../AuthContext'
import { useNavigate } from 'react-router-dom'

function SupplierDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')
  
  const [form, setForm] = useState({
    name: '',
    description: '',
    category: 'General',
    price: '',
    quantity: '',
    marginPercentage: '20',
    image: null
  })

  const API_BASE = 'http://localhost:4000'

  function fetchProducts() {
    setLoading(true)
    fetch(`${API_BASE}/api/products/supplier/${user.uid}`)
      .then(r => r.json())
      .then(list => setProducts(Array.isArray(list) ? list : []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    fetchProducts()
  },    )

  function handleChange(e) {
    const { name, value, files } = e.target
    if (files) {
      setForm(prev => ({ ...prev, [name]: files[0] }))
    } else {
      setForm(prev => ({ ...prev, [name]: value }))
    }
  }

  function resetForm() {
    setForm({ name: '', description: '', category: 'General', price: '', quantity: '', marginPercentage: '20', image: null })
    setEditingId(null)
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!form.name || !form.price || !form.quantity) {
      setError('Name, price, and quantity are required')
      return
    }

    setLoading(true)
    try {
      const fd = new FormData()
      fd.append('name', form.name)
      fd.append('description', form.description)
      fd.append('category', form.category)
      fd.append('price', form.price)
      fd.append('quantity', form.quantity)
      fd.append('marginPercentage', form.marginPercentage)
      if (form.image) fd.append('image', form.image)

      let url, method
      if (editingId) {
        url = `${API_BASE}/api/products/${editingId}`
        method = 'PUT'
      } else {
        fd.append('uid', user.uid)
        url = `${API_BASE}/api/products`
        method = 'POST'
      }

      const response = await fetch(url, { method, body: fd })
      const data = await response.json()

      if (data.ok || data.product) {
        fetchProducts()
        setShowForm(false)
        resetForm()
        alert(editingId ? 'Product updated!' : 'Product added!')
      } else {
        setError(data.error || 'Error saving product')
      }
    } catch (err) {
      console.error(err)
      setError('Failed to save product')
    } finally {
      setLoading(false)
    }
  }

  function startEdit(product) {
    setForm({
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price.toString(),
      quantity: product.quantity.toString(),
      marginPercentage: (product.marginPercentage || 20).toString(),
      image: null
    })
    setEditingId(product.id)
    setShowForm(true)
    setError('')
  }

  async function deleteProduct(id) {
    if (!confirm('Are you sure?')) return

    try {
      const response = await fetch(`${API_BASE}/api/products/${id}`, { method: 'DELETE' })
      const data = await response.json()

      if (data.ok) {
        fetchProducts()
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

  const categories = ['General', 'Agriculture & Food', 'Electronics & IT', 'Textiles & Apparel', 'Metal & Machinery', 'Construction Materials', 'Chemicals & Plastics', 'Handicrafts', 'Spices & Condiments']

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Supplier Dashboard</h1>
            <p className="text-gray-600">Manage your products</p>
          </div>
          <button
            onClick={() => { setShowForm(!showForm); resetForm() }}
            className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 py-2 rounded-md"
          >
            {showForm ? 'Cancel' : '➕ Add Product'}
          </button>
        </div>

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
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
              </div>

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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-700">Price (NPR) *</label>
                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                    placeholder="0"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-700">Quantity *</label>
                  <input
                    type="number"
                    name="quantity"
                    value={form.quantity}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                    placeholder="0"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-semibold text-gray-700">Margin %</label>
                  <input
                    type="number"
                    name="marginPercentage"
                    value={form.marginPercentage}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                    placeholder="20"
                    min="0"
                    max="100"
                  />
                  <p className="text-xs text-gray-500 mt-1">Estimated retail margin percentage</p>
                </div>
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
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 text-white py-2 rounded-md disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Product'}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowForm(false); resetForm() }}
                  className="flex-1 border py-2 rounded-md"
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
                      <td className="p-4 font-semibold text-green-600">{product.price.toLocaleString()}</td>
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
      </div>
    </div>
  )
}

export default SupplierDashboard
