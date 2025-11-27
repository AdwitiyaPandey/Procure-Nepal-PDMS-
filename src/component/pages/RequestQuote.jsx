import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'

const productMap = {
  p1: { id: 'p1', title: 'Bulk Rice - 50kg Bag', price: 4500 },
  p2: { id: 'p2', title: 'Industrial Flour (25kg)', price: 2200 },
  p3: { id: 'p3', title: 'Stainless Steel Bolts (1000pcs)', price: 12500 }
}

function RequestQuote() {
  const { id } = useParams()
  const product = productMap[id]
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    alert('Request submitted. Supplier will contact you soon.')
  }

  if (!product) return (
    <div className="p-8">Product not found. <Link to="/">Back</Link></div>
  )

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-semibold mb-2">Request Quote — {product.title}</h2>
        <div className="text-gray-600 mb-4">Price reference: NPR {product.price.toLocaleString()}</div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input name="name" value={form.name} onChange={handleChange} placeholder="Your name" className="w-full p-2 border rounded" />
          <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="w-full p-2 border rounded" />
          <textarea name="message" value={form.message} onChange={handleChange} placeholder="Message / quantity / delivery" className="w-full p-2 border rounded h-28" />
          <div className="flex gap-2">
            <button className="bg-blue-600 text-white px-4 py-2 rounded">Send Request</button>
            <Link to="/" className="px-4 py-2 border rounded">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RequestQuote
