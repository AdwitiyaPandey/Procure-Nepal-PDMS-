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
    <div className="min-h-screen bg-gray-50 p-8"><div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow">Product not found. <Link to="/">Back</Link></div></div>
  )

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto bg-white p-6 md:p-8 rounded-xl shadow">
        <h2 className="text-2xl font-semibold mb-2">Request Quote — {product.title}</h2>
        <div className="text-gray-600 mb-4">Price reference: NPR {product.price.toLocaleString()}</div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <input name="name" value={form.name} onChange={handleChange} placeholder="Your name" className="w-full p-3 border rounded-md" />
          </div>
          <div>
            <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="w-full p-3 border rounded-md" />
          </div>
          <div>
            <textarea name="message" value={form.message} onChange={handleChange} placeholder="Message / quantity / delivery" className="w-full p-3 border rounded-md h-28" />
          </div>
          <div className="flex gap-2">
            <button className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 py-2 rounded-md">Send Request</button>
            <Link to="/" className="px-4 py-2 border rounded-md">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RequestQuote
