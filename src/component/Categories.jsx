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

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Popular Categories</h2>
          <div className="w-12 h-1 bg-teal-500 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map(cat => (
            <div
              key={cat.id}
              onClick={() => handleCategoryClick(cat.name)}
              className="group cursor-pointer bg-white border border-teal-300 rounded-lg overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1 duration-300"
            >
              <div className="h-40 overflow-hidden bg-gray-100 border-b border-teal-300">
                <img 
                  src={cat.image} 
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h3 className="text-md font-semibold text-gray-800 group-hover:text-teal-600 transition-colors line-clamp-2">
                  {cat.name}
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
