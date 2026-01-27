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
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
          </div>
        </div>
      </section>
    )
  }

  return (
  <section className="py-16 md:py-20 bg-gray-50">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="mb-12 text-center">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 animate-fadeUp">
        Popular Categories
      </h2>
      <p className="text-gray-600 animate-fadeUp" style={{ animationDelay: '0.1s' }}>
        Browse products across different industries
      </p>
    </div>

    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 md:gap-6">
      {categories.slice(0, 8).map((cat, i) => (
        <button
          key={cat}
          onClick={() => handleCategoryClick(cat)}
          style={{
            animation: 'fadeUp 0.6s ease forwards',
            animationDelay: `${i * 0.1}s`,
          }}
          className="opacity-0 group flex flex-col items-center p-4 md:p-6
                     bg-gradient-to-b from-white to-gray-50 rounded-lg border border-gray-200
                     hover:shadow-xl hover:scale-105 transition-all duration-300"
        >
          <div className="text-4xl md:text-5xl mb-3 group-hover:rotate-6 transition-transform duration-300">
            {categoryIcons[cat] || '📦'}
          </div>
          <h3 className="text-sm md:text-base font-medium text-gray-900 group-hover:text-teal-600 text-center transition-colors line-clamp-2">
            {cat}
          </h3>
        </button>
      ))}
    </div>
  </div>

  {/* Inline animation keyframes */}
  <style>
    {`
      @keyframes fadeUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `}
  </style>
</section>
  )
}

export default Categories
