import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../AuthContext'

function Favourites() {
  const [favourites, setFavourites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!user) {
      navigate('/login')
      return
    }
    fetchFavourites()
  }, [user, navigate])

  const fetchFavourites = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      const res = await fetch('http://localhost:4000/api/favourites', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!res.ok) {
        throw new Error('Failed to fetch favourites')
      }

      const data = await res.json()
      setFavourites(data.data || [])
      setError('')
    } catch (err) {
      console.error('Error fetching favourites:', err)
      setError('Failed to load favourites')
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveFromFavourites = async (productId) => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`http://localhost:4000/api/favourites/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!res.ok) {
        throw new Error('Failed to remove from favourites')
      }

      // Remove from local state
      setFavourites(fav => fav.filter(f => f.product.id !== productId))
    } catch (err) {
      console.error('Error removing from favourites:', err)
      setError('Failed to remove from favourites')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-black mb-4"></div>
          <p className="text-gray-600">Loading favourites...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="text-teal-600 hover:text-teal-700 font-medium text-sm mb-4 flex items-center gap-1">
            <i className="bi bi-arrow-left"></i>
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Favourites</h1>
          <p className="text-gray-600">You have {favourites.length} favourite product{favourites.length !== 1 ? 's' : ''}</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Products Grid or Empty State */}
        {favourites.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <i className="bi bi-heart text-5xl text-gray-300 mb-4 block"></i>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Favourites Yet</h2>
            <p className="text-gray-600 mb-6">Start adding products to your favourites to see them here!</p>
            <Link
              to="/"
              className="inline-block bg-black hover:bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {favourites.map(fav => {
              const product = fav.product
              return (
                <div key={product.id} className="group bg-white rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300">
                  {/* Image Container */}
                  <div className="relative h-56 bg-gray-100 overflow-hidden">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <i className="bi bi-box text-5xl text-gray-400"></i>
                      </div>
                    )}
                    {/* Remove from Favourites Button */}
                    <button
                      onClick={() => handleRemoveFromFavourites(product.id)}
                      className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-red-50 transition-all duration-200"
                      title="Remove from favourites"
                    >
                      <i className="bi bi-heart-fill text-lg text-red-500"></i>
                    </button>
                  </div>

                  {/* Product Details */}
                  <div className="p-5">
                    <h3 className="font-bold text-gray-900 text-base line-clamp-2 mb-2">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                      {product.description || 'High-quality product available for wholesale'}
                    </p>

                    {/* Price */}
                    <div className="mb-4">
                      <p className="text-blue-600 font-bold text-lg">
                        ${(product.price || 0).toLocaleString()}
                      </p>
                      {product.marginPercentage && (
                        <p className="text-xs text-gray-500">Expected Margin: {product.marginPercentage}%</p>
                      )}
                    </div>

                    {/* Supplier Info */}
                    {product.supplier && (
                      <p className="text-xs text-gray-500 mb-4">
                        Supplier: {product.supplier.companyName || 'ProcureNP Supplier'}
                      </p>
                    )}

                    {/* Request Quote Button */}
                    <Link
                      to={`/request-quote/${product.id}`}
                      className="w-full inline-block text-center bg-black hover:bg-gray-900 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 active:scale-95"
                    >
                      Request Quote
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default Favourites
