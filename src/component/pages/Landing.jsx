import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../AuthContext'
import Landingbanner from '../Landingbanner'
import Categories from '../Categories'

function Landing() {
    const [query, setQuery] = useState('')
    const navigate = useNavigate()
    const { user, logout } = useAuth()

    function handleSearch(e) {
        e.preventDefault()
        const q = query.trim()
        navigate(`/search?q=${encodeURIComponent(q)}`)
    }

    async function handleLogout() {
        try {
            await logout()
            navigate('/')
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <>
            {/* NAVBAR */}
            <nav className="w-full bg-white shadow-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        {/* Logo Section */}
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center">
                                <span className="text-white font-bold text-lg">P</span>
                            </div>
                            <span className="font-bold text-xl text-gray-800">Procure Nepal</span>
                        </div>

                        {/* Search Bar - Center */}
                        <div className="flex-1 mx-8">
                            <form onSubmit={handleSearch} className="flex">
                                <div className="relative flex-1">
                                    <input 
                                        value={query} 
                                        onChange={e => setQuery(e.target.value)} 
                                        type="text" 
                                        placeholder="Search for products (e.g. mobile, jackets, shoes)" 
                                        className="w-full px-4 py-3 border border-gray-300 rounded-l-lg focus:outline-none focus:border-teal-500"
                                    />
                                </div>
                                <button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-r-lg transition-colors">
                                    <i className="bi bi-search"></i>
                                </button>
                            </form>
                        </div>

                        {/* Right Section - Auth & Menu */}
                        <div className="flex items-center gap-6 ml-8">
                            {!user ? (
                                <>
                                    <Link to="/login" className="text-gray-700 hover:text-teal-600 font-medium transition-colors">
                                        Login
                                    </Link>
                                    <Link to="/register" className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2 rounded-lg font-medium transition-colors">
                                        Register
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <div className="flex items-center gap-2">
                                        <i className="bi bi-person-circle text-xl text-gray-600"></i>
                                        <span className="text-gray-700 font-medium">{user.displayName || user.email.split('@')[0]}</span>
                                    </div>
                                    {user.role === 'supplier' && (
                                        <Link to="/supplier-dashboard" className="text-teal-600 hover:text-teal-700 font-medium transition-colors">
                                            Become a seller
                                        </Link>
                                    )}
                                    <button onClick={handleLogout} className="text-gray-700 hover:text-red-600 font-medium transition-colors">
                                        Logout
                                    </button>
                                </>
                            )}
                            <a href="tel:+977123456789" className="text-gray-700 hover:text-teal-600 font-medium flex items-center gap-1">
                                <i className="bi bi-telephone-fill"></i>
                                <span>Helpline</span>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Secondary Nav */}
                <div className="border-t border-gray-200">
                    <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-8">
                        <button className="text-gray-700 hover:text-teal-600 font-medium flex items-center gap-2 transition-colors group">
                            <span>Products</span>
                            <i className="bi bi-chevron-down text-sm"></i>
                        </button>
                        <Link to="#" className="text-gray-700 hover:text-teal-600 font-medium transition-colors">
                            Post Your Requirements
                        </Link>
                        <Link to="/get-started" className="text-teal-600 hover:text-teal-700 font-bold transition-colors">
                            Become a seller
                        </Link>
                    </div>
                </div>
            </nav>

            {/* HERO BANNER */}
            <div className="w-full bg-gradient-to-r from-teal-50 to-blue-50 py-12">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-2 gap-8 items-center">
                        <div>
                            <h1 className="text-5xl font-bold text-gray-900 mb-4">
                                <span className="text-teal-600">Nepal's 1</span><span className="text-3xl">st</span>
                            </h1>
                            <h2 className="text-4xl font-bold text-gray-800 mb-6">Wholesale Marketplace</h2>
                            <p className="text-gray-600 text-lg mb-8">
                                Connect with verified suppliers and access thousands of wholesale products at competitive prices.
                            </p>
                            <div className="flex gap-4">
                                {!user ? (
                                    <>
                                        <Link to="/get-started" className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-lg font-bold transition-colors">
                                            Get Started
                                        </Link>
                                        <button className="border-2 border-teal-600 text-teal-600 hover:bg-teal-50 px-8 py-3 rounded-lg font-bold transition-colors">
                                            Learn More
                                        </button>
                                    </>
                                ) : null}
                            </div>
                        </div>
                        <div className="text-center">
                            <img src="https://img.freepik.com/free-vector/isometric-e-commerce-concept_23-2148564680.jpg?semt=ais_hybrid&w=740&q=80" alt="Wholesale" className="w-full h-auto object-contain" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Sections */}
            <Landingbanner />
            <Categories />
        </>
    )
}

export default Landing
