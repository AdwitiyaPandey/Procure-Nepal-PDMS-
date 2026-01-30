import React from 'react'
import { useNavigate } from 'react-router-dom'

const categories = [
  { id: 1, name: 'Building & Construction', icon: '🏗️', image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=300&h=300&fit=crop' },
  { id: 2, name: 'Industrial Supplies And Machinery', icon: '⚙️', image: 'https://images.unsplash.com/photo-1565043666747-69f6646db940?w=300&h=300&fit=crop' },
  { id: 3, name: 'Hospital And Diagnosis Instrument', icon: '🏥', image: 'https://images.unsplash.com/photo-1576091160550-112173f7f869?w=300&h=300&fit=crop' },
  { id: 4, name: 'Food, Beverage And Health Supplements', icon: '🥗', image: 'https://images.unsplash.com/photo-1542621334-a254cf16f737?w=300&h=300&fit=crop' },
  { id: 5, name: 'Computer & IT Solutions', icon: '💻', image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=300&h=300&fit=crop' },
  { id: 6, name: 'Consumer Electronics', icon: '📱', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop' },
  { id: 7, name: 'Fashion Accessories & Gears', icon: '👗', image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=300&h=300&fit=crop' },
  { id: 8, name: 'Textiles & Fabrics', icon: '🧵', image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=300&h=300&fit=crop' },
]

function Categories() {
  const navigate = useNavigate()

  function handleCategoryClick(categoryName) {
    navigate(`/search?q=${encodeURIComponent(categoryName)}`)
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
