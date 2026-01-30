import React, { useState, useEffect, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'

function RequestQuote() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', quantity: '', message: '' })
  const [submitting, setSubmitting] = useState(false)

  const fetchProduct = useCallback(async () => {
    try {
      // For now, we'll assume the ID is the product ID from backend
      // In a real app, you might need to search or have a direct endpoint
      const response = await fetch(`http://localhost:4000/api/products`)
      const products = await response.json()
      const found = Array.isArray(products) ? products.find(p => p.id === id) : null
      setProduct(found)
    } catch (err) {
      console.error('Error fetching product:', err)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchProduct()
  }, [fetchProduct])

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    
    try {
      // Here you would send the quote request to backend
      // For now, just show success
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      alert('Quote request submitted successfully! The supplier will contact you soon.')
    } catch (err) {
      console.error('Error submitting request:', err)
      alert('Failed to submit request. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
      </div>
    )
  }

  if (!product) return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow">
        <p className="text-gray-600">Product not found.</p>
        <Link to="/search" className="text-teal-600 hover:text-teal-700">← Back to search</Link>
      </div>
    </div>
  )

  const calculateMargin = (price, marginPercentage) => {
    return price * (1 + marginPercentage / 100)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow overflow-hidden">
          {/* Product Header */}
          <div className="p-6 border-b bg-gray-50">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Request Quote</h1>
            <div className="flex items-start gap-4">
              <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                {product.image ? (
                  <img src={`http://localhost:4000${product.image}`} alt={product.name} className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <i className="bi bi-image text-2xl text-gray-400"></i>
                )}
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900">{product.name}</h2>
                <p className="text-gray-600 mt-1">{product.description}</p>
                <div className="mt-3 space-y-1">
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">Wholesale Price:</span>
                    <span className="font-semibold text-teal-600">NPR {product.price.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">Est. Retail Price:</span>
                    <span className="font-semibold text-green-600">
                      NPR {calculateMargin(product.price, product.marginPercentage).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">Margin:</span>
                    <span className="text-sm font-medium text-orange-600">{product.marginPercentage}%</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">Available Quantity:</span>
                    <span className="font-medium">{product.quantity}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quote Request Form */}
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Supplier</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Your Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-teal-500"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-teal-500"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={(e) => {
                        // allow only digits and limit to 10
                        const v = e.target.value.replace(/\D/g, '').slice(0, 10)
                        setForm(prev => ({ ...prev, phone: v }))
                      }}
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={10}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-teal-500"
                      placeholder="98XXXXXXXX"
                    />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                  <input
                    type="text"
                    name="company"
                    value={form.company}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-teal-500"
                    placeholder="Your company name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Required Quantity</label>
                <input
                  type="text"
                  name="quantity"
                  value={form.quantity}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-teal-500"
                  placeholder="e.g., 100 kg, 500 pieces"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Additional Message</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-teal-500"
                  placeholder="Tell the supplier about your requirements, delivery preferences, etc."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-3 px-6 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Sending Request...' : 'Send Quote Request'}
                </button>
                <Link
                  to="/search"
                  className="px-6 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RequestQuote
