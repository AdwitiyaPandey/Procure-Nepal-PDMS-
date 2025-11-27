import React from 'react'
import React from 'react'
import { Link } from 'react-router-dom'

const products = [
  {
    id: 'p1',
    title: 'Bulk Rice - 50kg Bag',
    price: 4500,
    image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3&s=ef8b3f7f2a3a7f0d2c7b1d7a8c6f0b2a',
    rating: 4.6,
    reviews: 124,
    margin: '8-12%'
  },
  {
    id: 'p2',
    title: 'Industrial Flour (25kg)',
    price: 2200,
    image: 'https://images.unsplash.com/photo-1604917877936-4f5e2e07f1d7?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3&s=6e7b6de5c8e1e8c9b2b7a6c3d3f9a1a2',
    rating: 4.3,
    reviews: 58,
    margin: '10-15%'
  },
  {
    id: 'p3',
    title: 'Stainless Steel Bolts (1000pcs)',
    price: 12500,
    image: 'https://images.unsplash.com/photo-1555685812-4b943f1a7d9d?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3&s=3a9a5a6f5c4b2d1e0f6a8b7c9d5e4f6a',
    rating: 4.8,
    reviews: 34,
    margin: '5-9%'
  }
]

function Landingbanner() {
  return (
    <section className="landing-ban w-full px-8 py-8 bg-white">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map(p => (
            <div key={p.id} className="item-card border rounded-lg overflow-hidden shadow-md bg-gray-50">
              <img src={p.image} alt={p.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="font-semibold text-lg">{p.title}</h3>
                <div className="text-sm text-gray-600 mb-2">{p.rating} ★ ({p.reviews})</div>
                <div className="flex items-baseline justify-between mb-3">
                  <div className="text-2xl font-bold">NPR {p.price.toLocaleString()}</div>
                  <div className="text-sm text-green-700">Est. Margin: {p.margin}</div>
                </div>

                <div className="flex gap-2">
                  <Link to={`/request-quote/${p.id}`} className="flex-1 text-center bg-blue-600 text-white py-2 rounded">Request Quote</Link>
                  <Link to={`/contact-seller/${p.id}`} className="flex-1 text-center border py-2 rounded">Contact Seller</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Landingbanner
