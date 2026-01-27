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
   <div className="bg-gray-50">
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Newly Added Products</h2>

          {newlyAddedProducts.length ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {newlyAddedProducts.map((p, i) => (
                <div
                  key={p.id}
                  className={`
                    bg-white border rounded-md overflow-hidden
                    transition-all duration-500 ease-out
                    transform
                    ${visibleIndexes.includes(i) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}
                    hover:shadow-lg hover:-translate-y-1
                  `}
                >
                  <div className="h-36 bg-gray-100 overflow-hidden">
                    {p.image ? (
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                        No Image
                      </div>
                    )}
                  </div>

                  <div className="p-3">
                    <p className="font-medium text-sm line-clamp-2">{p.name}</p>
                    <p className="text-xs text-gray-500 my-1">MOQ: {p.quantity} PCS</p>

                    <Link
                      to={`/request-quote/${p.id}`}
                      className="text-sm text-teal-600 font-semibold hover:underline"
                    >
                      Ask for Price
                    </Link>
                  </div>
                </div>
              ))}

              {/* CTA */}
              <Link
                to="/seller-register"
                className={`
                  bg-teal-600 text-white rounded-md flex flex-col items-center justify-center text-center p-4
                  transition-all duration-500 ease-out transform
                  ${visibleIndexes.includes(newlyAddedProducts.length) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}
                  hover:bg-teal-700 hover:scale-105
                `}
              >
                <p className="font-bold mb-1">Post Your Product</p>
                <p className="text-sm">Become a Seller</p>
              </Link>
            </div>
          ) : (
            <p className="text-gray-500 text-center">No products available</p>
          )}
        </div>
      </section>
    </div>
  )
}

export default SupplierDashboard
