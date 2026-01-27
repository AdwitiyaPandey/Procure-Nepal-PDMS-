import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function Landingbanner() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  function fetchProducts() {
    fetch('http://localhost:4000/api/products?limit=6')
      .then(r => r.json())
      .then(data => {
        const productList = Array.isArray(data.products) ? data.products : []
        setProducts(productList)
      })
      .catch(err => {
        console.error(err)
        setProducts([])
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchProducts()
  }, 
  [])

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
  const newlyAddedProducts = products.slice(0, 6)

  return (
   <div className="bg-gray-50">

  {/* Newly Added Products */}
  <section className="py-12">
    <div className="max-w-7xl mx-auto px-4">

      <h2 className="text-2xl font-bold mb-6">
        Newly Added Products
      </h2>

      {newlyAddedProducts.length ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">

          {newlyAddedProducts.map((p, i) => (
            <div
              key={p.id}
              style={{
                animation: "fadeUp 0.6s ease forwards",
                animationDelay: `${i * 0.1}s`,
              }}
              className="bg-white border rounded-md overflow-hidden
                         opacity-0
                         hover:shadow-lg hover:-translate-y-1
                         transition-all duration-300"
            >
              <div className="h-36 bg-gray-100 overflow-hidden">
                {p.image ? (
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover
                               transition-transform duration-300
                               hover:scale-105"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                    No Image
                  </div>
                )}
              </div>

              <div className="p-3">
                <p className="font-medium text-sm line-clamp-2">{p.name}</p>
                <p className="text-xs text-gray-500 my-1">
                  MOQ: {p.quantity} PCS
                </p>

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
            style={{ animation: "fadeUp 0.6s ease forwards", animationDelay: "0.6s" }}
            className="opacity-0 bg-teal-600 text-white rounded-md
                       flex flex-col items-center justify-center text-center p-4
                       hover:bg-teal-700 hover:scale-105
                       transition-all duration-300"
          >
            <p className="font-bold mb-1">Post Your Product</p>
            <p className="text-sm">Become a Seller</p>
          </Link>

        </div>
      ) : (
        <p className="text-gray-500 text-center">No products available</p>
      )}
    </div>

    {/* Inline animation keyframes */}
    <style>
      {`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}
    </style>
  </section>

</div>
  )
}

export default Landingbanner
