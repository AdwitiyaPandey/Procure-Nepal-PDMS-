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
      <section className="min-h-[60vh] flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black"></div>
          <p className="text-sm text-gray-500">Loading categories…</p>
        </div>
      </section>
    )
  }


  return (
    <section className="bg-gray-50 py-10 sm:py-14 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8 sm:mb-10 md:mb-14 text-center sm:text-left">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
            Popular Categories
          </h2>
          <p className="mt-2 text-sm sm:text-base text-gray-600 max-w-xl">
            Browse products across different industries
          </p>
        </div>

        {/* Categories Grid */}
        <div
          className="
            grid
            grid-cols-2
            sm:grid-cols-3
            md:grid-cols-4
            gap-4
            sm:gap-5
            md:gap-6
          "
        >
          {categories.slice(0, 8).map(cat => (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className="
                group
                bg-white
                rounded-2xl
                border border-gray-200
                p-4 sm:p-5 md:p-6
                flex flex-col items-center justify-center
                min-h-[120px] sm:min-h-[150px]
                hover:shadow-xl hover:border-gray-900
                transition-all duration-300
                focus:outline-none focus:ring-2 focus:ring-black
                active:scale-95
              "
            >
              {/* Icon */}
              <div
                className="
                  text-3xl
                  sm:text-4xl
                  md:text-5xl
                  mb-2 sm:mb-3
                  group-hover:scale-110
                  transition-transform
                "
              >
                {categoryIcons[cat] || '📦'}
              </div>

              {/* Label */}
              <h3
                className="
                  text-xs
                  sm:text-sm
                  md:text-base
                  font-medium
                  text-gray-800
                  text-center
                  leading-snug
                "
              >
                {cat}
              </h3>
            </button>
          ))}
        </div>
      </div>
    </section>
  )


}

export default Categories
