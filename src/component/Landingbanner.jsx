import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../AuthContext'

function Landingbanner() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [wishlist, setWishlist] = useState(new Set())
  const { user } = useAuth()

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
    if (user) {
      loadUserFavourites()
    }
  }, [user])

  const loadUserFavourites = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const res = await fetch('http://localhost:4000/api/favourites', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (res.ok) {
        const data = await res.json()
        const favIds = new Set(data.data?.map(f => f.product.id) || [])
        setWishlist(favIds)
      }
    } catch (err) {
      console.error('Error loading favourites:', err)
    }
  }

  const toggleWishlist = async (productId) => {
    if (!user) {
      alert('Please sign in to add products to favourites')
      return
    }

    const token = localStorage.getItem('token')
    const isFavourite = wishlist.has(productId)

    try {
      if (isFavourite) {
        // Remove from favourites
        const res = await fetch(`http://localhost:4000/api/favourites/${productId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (res.ok) {
          const newWishlist = new Set(wishlist)
          newWishlist.delete(productId)
          setWishlist(newWishlist)
        }
      } else {
        // Add to favourites
        const res = await fetch('http://localhost:4000/api/favourites/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ productId })
        })

        if (res.ok) {
          const newWishlist = new Set(wishlist)
          newWishlist.add(productId)
          setWishlist(newWishlist)
        }
      }
    } catch (err) {
      console.error('Error toggling favourite:', err)
      alert('Failed to update favourite status')
    }
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
  const newlyAddedProducts = products.slice(0, 6)

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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {newlyAddedProducts.map(p => (
                <div key={p.id} className="group bg-white rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300">
                  {/* Image Container with Wishlist Heart */}
                  <div className="relative h-56 bg-gray-100 overflow-hidden">
                    {p.image ? (
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <i className="bi bi-box text-5xl text-gray-400"></i>
                      </div>
                    )}
                    {/* Wishlist Heart Button */}
                    <button
                      onClick={() => toggleWishlist(p.id)}
                      className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition-all duration-200"
                    >
                      <i className={`bi ${wishlist.has(p.id) ? 'bi-heart-fill' : 'bi-heart'} text-lg ${wishlist.has(p.id) ? 'text-red-500' : 'text-gray-400'}`}></i>
                    </button>
                  </div>
                  
                  {/* Product Details */}
                  <div className="p-5">
                    <h3 className="font-bold text-gray-900 text-base line-clamp-2 mb-2 group-hover:text-black transition-colors">
                      {p.name}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-4 leading-relaxed">
                      {p.description || 'High-quality product available for wholesale'}
                    </p>
                    
                    {/* Price */}
                    <div className="mb-4">
                      <p className="text-blue-600 font-bold text-lg">
                        ${(p.price || 0).toLocaleString()}
                      </p>
                      {p.marginPercentage && (
                        <p className="text-xs text-gray-500">Expected Margin: {p.marginPercentage}%</p>
                      )}
                    </div>
                    
                    {/* Request Quote Button */}
                    <Link 
                      to={`/request-quote/${p.id}`} 
                      className="w-full inline-block text-center bg-black hover:bg-gray-900 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 active:scale-95"
                    >
                      Request Quote
                    </Link>
                  </div>
                </div>
              ))}
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.filter(p => p.category === 'Construction & Building').map(p => (
                <div key={p.id} className="group bg-white rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300">
                  {/* Image Container with Wishlist Heart */}
                  <div className="relative h-56 bg-gray-100 overflow-hidden">
                    {p.image ? (
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <i className="bi bi-box text-5xl text-gray-400"></i>
                      </div>
                    )}
                    {/* Wishlist Heart Button */}
                    <button
                      onClick={() => toggleWishlist(p.id)}
                      className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition-all duration-200"
                    >
                      <i className={`bi ${wishlist.has(p.id) ? 'bi-heart-fill' : 'bi-heart'} text-lg ${wishlist.has(p.id) ? 'text-red-500' : 'text-gray-400'}`}></i>
                    </button>
                  </div>
                  
                  {/* Product Details */}
                  <div className="p-5">
                    <h3 className="font-bold text-gray-900 text-base line-clamp-2 mb-2 group-hover:text-black transition-colors">
                      {p.name}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-4 leading-relaxed">
                      {p.description || 'High-quality product available for wholesale'}
                    </p>
                    
                    {/* Price */}
                    <div className="mb-4">
                      <p className="text-blue-600 font-bold text-lg">
                        ${(p.price || 0).toLocaleString()}
                      </p>
                      {p.marginPercentage && (
                        <p className="text-xs text-gray-500">Expected Margin: {p.marginPercentage}%</p>
                      )}
                    </div>
                    
                    {/* Request Quote Button */}
                    <Link 
                      to={`/request-quote/${p.id}`} 
                      className="w-full inline-block text-center bg-black hover:bg-gray-900 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 active:scale-95"
                    >
                      Request Quote
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
// Commit: 2026-01-01 Ujjwal
