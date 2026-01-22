import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function Landingbanner() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  function fetchProducts() {
    fetch('http://localhost:5000/api/products')
      .then(r => r.json())
      .then(data => {
        setProducts(Array.isArray(data) ? data : [])
      })
      .catch(err => {
        console.error(err)
        setProducts([])
      })
      .finally(() => setLoading(false))
  }

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
        </div>
      </section>
    )
  }

  // Split products into sections
  const featuredProducts = products.slice(0, 6)
  const newlyAddedProducts = products.slice(6, 12)

  return (
    <div className="bg-gray-50">
      {/* Newly Added Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Newly added products</h2>
            <div className="w-12 h-1 bg-teal-500 rounded-full"></div>
          </div>

          {newlyAddedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
              {newlyAddedProducts.map(p => (
                <div key={p.id} className="group bg-white rounded-lg border border-teal-200 overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1 duration-300">
                  {p.image ? (
                    <div className="h-40 bg-gray-100 overflow-hidden">
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                  ) : (
                    <div className="h-40 bg-gradient-to-br from-teal-100 to-teal-50 flex items-center justify-center">
                      <i className="bi bi-box text-4xl text-teal-300"></i>
                    </div>
                  )}
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 text-sm line-clamp-2 mb-2 group-hover:text-teal-600 transition-colors">
                      {p.name}
                    </h3>
                    <p className="text-xs text-gray-500 mb-3">MOQs: {p.quantity} PCS</p>
                    <Link 
                      to={`/request-quote/${p.id}`} 
                      className="text-teal-600 hover:text-teal-700 font-semibold text-sm"
                    >
                      Ask For Price
                    </Link>
                  </div>
                </div>
              ))}

              {/* Call to Action Card */}
              <div className="group bg-teal-500 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 duration-300 flex items-center justify-center min-h-96">
                <div className="text-center text-white p-6">
                  <p className="text-xl font-bold mb-2">Want to see your product here?</p>
                  <p className="text-sm mb-6">We Will Help You</p>
                  <Link 
                    to="/get-started" 
                    className="inline-block bg-white text-teal-600 px-6 py-2 rounded-full font-bold hover:bg-gray-100 transition-colors"
                  >
                    START POSTING
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No products available yet</p>
            </div>
          )}
        </div>
      </section>

      {/* Building & Construction Category */}
      {products.filter(p => p.category === 'Construction & Building').length > 0 && (
        <section className="py-16 border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Building & Construction</h2>
              <div className="w-12 h-1 bg-teal-500 rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
              {products.filter(p => p.category === 'Construction & Building').map(p => (
                <div key={p.id} className="group bg-white rounded-lg border border-teal-200 overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1 duration-300">
                  {p.image ? (
                    <div className="h-40 bg-gray-100 overflow-hidden">
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                  ) : (
                    <div className="h-40 bg-gradient-to-br from-teal-100 to-teal-50 flex items-center justify-center">
                      <i className="bi bi-box text-4xl text-teal-300"></i>
                    </div>
                  )}
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 text-sm line-clamp-2 mb-2 group-hover:text-teal-600 transition-colors">
                      {p.name}
                    </h3>
                    <p className="text-xs text-gray-500 mb-3">MOQs: {p.quantity} PCS</p>
                    <Link 
                      to={`/request-quote/${p.id}`} 
                      className="text-teal-600 hover:text-teal-700 font-semibold text-sm"
                    >
                      Ask For Price
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

export default Landingbanner
