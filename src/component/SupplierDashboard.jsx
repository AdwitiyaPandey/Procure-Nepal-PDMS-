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
   <div className="min-h-screen bg-gray-100 p-6">
  <div className="max-w-6xl mx-auto space-y-6">

    {/* Header */}
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold">Supplier Dashboard</h1>
        <p className="text-gray-500 text-sm">Manage your products</p>
      </div>
      <button
        onClick={() => { setShowForm(!showForm); resetForm() }}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        {showForm ? 'Cancel' : '+ Add Product'}
      </button>
    </div>

    {/* Form */}
    {showForm && (
      <div className="bg-white p-5 rounded shadow space-y-4">
        <h2 className="font-semibold">
          {editingId ? 'Edit Product' : 'Add Product'}
        </h2>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Product Name"
            className="w-full border p-2 rounded"
            required
          />

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            {categories.map(c => (
              <option key={c}>{c}</option>
            ))}
          </select>

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full border p-2 rounded"
          />

          <div className="grid grid-cols-3 gap-3">
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="Price (NPR)"
              className="border p-2 rounded"
              required
            />
            <input
              type="number"
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
              placeholder="Qty"
              className="border p-2 rounded"
              required
            />
            <input
              type="number"
              name="marginPercentage"
              value={form.marginPercentage}
              onChange={handleChange}
              placeholder="Margin %"
              className="border p-2 rounded"
            />
          </div>

          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded"
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </form>
      </div>
    )}

    {/* Product List */}
    <div className="bg-white rounded shadow">
      <div className="p-4 font-semibold border-b">
        Products ({products.length})
      </div>

      {products.length === 0 ? (
        <p className="p-4 text-gray-500 text-center">No products yet</p>
      ) : (
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3">Category</th>
              <th className="p-3">Price</th>
              <th className="p-3">Qty</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} className="border-t">
                <td className="p-3">{p.name}</td>
                <td className="p-3 text-center">{p.category}</td>
                <td className="p-3 text-center">{p.price}</td>
                <td className="p-3 text-center">{p.quantity}</td>
                <td className="p-3 flex gap-2 justify-center">
                  <button
                    onClick={() => startEdit(p)}
                    className="text-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteProduct(p.id)}
                    className="text-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>

  </div>
</div>
  )
}

export default SupplierDashboard
