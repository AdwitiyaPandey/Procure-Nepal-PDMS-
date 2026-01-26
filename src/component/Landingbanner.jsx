import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../AuthContext'; // 1. Import useAuth

function Landingbanner() {
  const { user } = useAuth(); // 2. Access the logged-in user state
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

  const newlyAddedProducts = products.slice(0, 12)

  return (
    <div className="bg-gray-50">
      
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12 text-center md:text-left">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">B2B Wholesale Deals</h2>
            <p className="text-gray-500 mb-4">Direct negotiation with verified suppliers</p>
            <div className="w-12 h-1 bg-teal-500 rounded-full mx-auto md:mx-0"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            {newlyAddedProducts.map(p => (
              <div key={p.id} className="group bg-white rounded-lg border border-teal-200 overflow-hidden hover:shadow-lg transition-all duration-300">
                {/* Product Image */}
                <div className="h-40 bg-gray-100 overflow-hidden relative">
                  {p.image ? (
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-teal-50">
                      <i className="bi bi-box text-3xl text-teal-200"></i>
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 text-sm line-clamp-2 h-10 mb-2">
                    {p.name}
                  </h3>
                  <p className="text-xs text-gray-500 mb-3">MOQ: {p.quantity || 'Negotiable'} Units</p>
                  
                  {/* NEGOTIATION LOGIC */}
                  {user ? (
                    <div className="space-y-2">
                      <a 
                        href={`tel:${p.sellerPhone || '977xxxxxxxx'}`} 
                        className="block w-full text-center bg-teal-600 text-white py-2 rounded-md text-xs font-bold hover:bg-teal-700 transition-colors"
                      >
                        <i className="bi bi-telephone-fill mr-2"></i>
                        Call Seller
                      </a>
                      <p className="text-[10px] text-center text-gray-400 italic">Mention "Procure Nepal" for best rates</p>
                    </div>
                  ) : (

                    <Link 
                      to="/login" 
                      className="block w-full text-center border-2 border-teal-600 text-teal-600 py-2 rounded-md text-xs font-bold hover:bg-teal-50 transition-colors"
                    >
                      Login to see Number
                    </Link>
                  )}
                </div>
              </div>
            ))}

            {/* CTA Card for New Sellers */}
            <div className="bg-teal-500 rounded-lg p-6 flex flex-col justify-center items-center text-center text-white">
              <p className="font-bold text-lg mb-2">Are you a Supplier?</p>
              <p className="text-sm mb-6 opacity-90">List your products and get direct calls from buyers across Nepal.</p>
              <Link 
                to={user?.role === 'seller' ? "/supplier-dashboard" : "/get-started"} 
                className="bg-white text-teal-600 px-6 py-2 rounded-full font-bold text-sm shadow-md"
              >
                {user?.role === 'seller' ? "GO TO DASHBOARD" : "START SELLING"}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Landingbanner;