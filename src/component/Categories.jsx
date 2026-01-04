import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const categoryIcons = {
  'Agriculture & Food': '🌾',
  'Metal & Machinery': '⚙️',
  'Textiles & Apparel': '👕',
  'Construction Materials': '🏗️',
  'Chemicals & Plastics': '🧪',
  'Handicrafts': '🎨',
  'Spices & Condiments': '🌶️',
  'Electronics & IT': '💻'
}

function Categories() {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/categories')
      const data = await res.json()
      setCategories(data)
    } catch (err) {
      console.error('Error fetching categories:', err)
      // Fallback to some default categories
      setCategories(['Agriculture & Food', 'Metal & Machinery', 'Textiles & Apparel', 'Construction Materials'])
    } finally {
      setLoading(false)
    }
  }

  function handleCategoryClick(categoryName) {
    navigate(`/search?category=${encodeURIComponent(categoryName)}`)
  }

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Popular Categories</h2>
          <div className="w-12 h-1 bg-teal-500 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {categories.slice(0, 8).map(cat => (
            <div
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className="group cursor-pointer bg-white border border-teal-300 rounded-lg overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1 duration-300"
            >
              <div className="h-40 overflow-hidden bg-gray-100 border-b border-teal-300 flex items-center justify-center">
                <span className="text-6xl">{categoryIcons[cat] || '📦'}</span>
              </div>
              <div className="p-4">
                <h3 className="text-md font-semibold text-gray-800 group-hover:text-teal-600 transition-colors line-clamp-2">
                  {cat}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Categories
