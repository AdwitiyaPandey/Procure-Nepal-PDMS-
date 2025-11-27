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
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Search results for "{q}"</h2>
        {!query && <p className="text-gray-600">Enter a search term to find products.</p>}
        {query && results.length === 0 && <p className="text-gray-600">No products found.</p>}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {results.map(p => (
            <div key={p.id} className="border rounded p-3">
              <div className="font-semibold">{p.title}</div>
              <div className="text-sm text-gray-600">NPR {p.price.toLocaleString()}</div>
              <div className="mt-2">
                <Link to={`/request-quote/${p.id}`} className="text-white bg-blue-600 px-3 py-1 rounded">Request Quote</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SearchResults
