import React from 'react'
import { useLocation, Link } from 'react-router-dom'

const products = [
  { id: 'p1', title: 'Bulk Rice - 50kg Bag', price: 4500 },
  { id: 'p2', title: 'Industrial Flour (25kg)', price: 2200 },
  { id: 'p3', title: 'Stainless Steel Bolts (1000pcs)', price: 12500 }
]

function useQuery() {
  return new URLSearchParams(useLocation().search)
}

function SearchResults() {
  const q = useQuery().get('q') || ''
  const query = q.trim().toLowerCase()
  const results = query ? products.filter(p => p.title.toLowerCase().includes(query)) : []

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto bg-white p-6 md:p-8 rounded-xl shadow">
        <h2 className="text-2xl font-semibold mb-4">Search results for "{q}"</h2>
        {!query && <p className="text-gray-600">Enter a search term to find products.</p>}
        {query && results.length === 0 && <p className="text-gray-600">No products found.</p>}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {results.map(p => (
            <div key={p.id} className="border rounded-lg p-4">
              <div className="font-semibold mb-2">{p.title}</div>
              <div className="text-sm text-gray-600 mb-3">NPR {p.price.toLocaleString()}</div>
              <div>
                <Link to={`/request-quote/${p.id}`} className="inline-block bg-gradient-to-r from-green-600 to-blue-600 text-white px-3 py-1 rounded-md">Request Quote</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SearchResults
