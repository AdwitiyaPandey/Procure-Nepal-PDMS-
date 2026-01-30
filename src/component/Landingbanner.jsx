import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../AuthContext'

function Landingbanner() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [wishlist, setWishlist] = useState(new Set())
  const { user } = useAuth()

  const calculateMargin = (price, marginPercentage) => {
    const p = Number(price) || 0
    const m = Number(marginPercentage) || 0
    return Math.round(p * (1 + m / 100))
  }

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
            <h2 className="text-3xl font-bold text-gray-900 mb-2"style={{ letterSpacing: '0.05em', lineHeight: 1.7 }}>Newly Added Products</h2>
            <div className="w-12 h-1 bg-teal-500 rounded-full"></div>
          </div>

          {newlyAddedProducts.length > 0 ? (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {newlyAddedProducts.map(p => (
                <div key={p.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="aspect-square bg-gray-100 relative">
                    {p.image ? (
                      <img loading="lazy" src={p.image} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <i className="bi bi-box text-5xl text-gray-400"></i>
                      </div>
                    )}
                    <button
                      onClick={() => toggleWishlist(p.id)}
                      className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white shadow flex items-center justify-center hover:bg-gray-50 transition-all duration-200"
                    >
                      <i className={`bi ${wishlist.has(p.id) ? 'bi-heart-fill text-red-500' : 'bi-heart text-gray-600'}`}></i>
                    </button>
                  </div>

                  <div className="p-4">
                    <h3 className="font-bold text-black text-lg mb-2 line-clamp-2">{p.name}</h3>
                    <p className="text-black text-sm line-clamp-2 mb-3">{p.description || 'High-quality product available for wholesale'}</p>

                    <div className="space-y-1 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Wholesale Price:</span>
                        <span className="font-semibold text-teal-600">NPR {Number(p.price || 0).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Est. Retail Price:</span>
                        <span className="font-semibold text-green-600">NPR {calculateMargin(p.price, p.marginPercentage).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Margin:</span>
                        <span className="text-sm font-medium text-orange-600">{p.marginPercentage || 20}%</span>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          const phoneRaw = p.supplier?.user?.phone || ''
                          let phone = phoneRaw.replace(/\D/g, '')
                          if (phone.length === 10) phone = '977' + phone
                          const text = encodeURIComponent(`Can I know more about ${p.name}? ${p.description || ''}`)
                          const url = `https://wa.me/${phone}?text=${text}`
                          window.open(url, '_blank')
                        }}
                        className="flex-1 bg-teal-600 hover:bg-teal-700 text-white text-center py-2 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        <i className="bi bi-whatsapp text-lg"></i>
                        <span>Request Quote</span>
                      </button>
                      <button
                        onClick={() => toggleWishlist(p.id)}
                        className="w-12 h-10 border border-gray-200 rounded-md flex items-center justify-center hover:bg-gray-50 transition-colors"
                      >
                        <i className={`bi ${wishlist.has(p.id) ? 'bi-heart-fill text-red-500' : 'bi-heart text-gray-600'}`}></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              </div>

              <div className="mt-8 text-center">
                <Link to="/search" className="inline-block bg-black text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-900 transition-colors">
                  Browse more products
                </Link>
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.filter(p => p.category === 'Construction & Building').map(p => (
                <div key={p.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="aspect-square bg-gray-100 relative">
                    {p.image ? (
                      <img loading="lazy" src={p.image} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <i className="bi bi-box text-5xl text-gray-400"></i>
                      </div>
                    )}
                    <button
                      onClick={() => toggleWishlist(p.id)}
                      className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white shadow flex items-center justify-center hover:bg-gray-50 transition-all duration-200"
                    >
                      <i className={`bi ${wishlist.has(p.id) ? 'bi-heart-fill text-red-500' : 'bi-heart text-gray-600'}`}></i>
                    </button>
                  </div>

                  <div className="p-4">
                    <h3 className="font-bold text-black text-lg mb-2 line-clamp-2">{p.name}</h3>
                    <p className="text-black text-sm line-clamp-2 mb-3">{p.description || 'High-quality product available for wholesale'}</p>

                    <div className="space-y-1 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Wholesale Price:</span>
                        <span className="font-semibold text-teal-600">NPR {Number(p.price || 0).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Est. Retail Price:</span>
                        <span className="font-semibold text-green-600">NPR {calculateMargin(p.price, p.marginPercentage).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Margin:</span>
                        <span className="text-sm font-medium text-orange-600">{p.marginPercentage || 20}%</span>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          const phoneRaw = p.supplier?.user?.phone || ''
                          let phone = phoneRaw.replace(/\D/g, '')
                          if (phone.length === 10) phone = '977' + phone
                          const text = encodeURIComponent(`Can I know more about ${p.name}? ${p.description || ''}`)
                          const url = `https://wa.me/${phone}?text=${text}`
                          window.open(url, '_blank')
                        }}
                        className="flex-1 bg-teal-600 hover:bg-teal-700 text-white text-center py-2 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        <i className="bi bi-whatsapp text-lg"></i>
                        <span>Request Quote</span>
                      </button>
                      <button
                        onClick={() => toggleWishlist(p.id)}
                        className="w-12 h-10 border border-gray-200 rounded-md flex items-center justify-center hover:bg-gray-50 transition-colors"
                      >
                        <i className={`bi ${wishlist.has(p.id) ? 'bi-heart-fill text-red-500' : 'bi-heart text-gray-600'}`}></i>
                      </button>
                    </div>
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

