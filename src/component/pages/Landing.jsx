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
        if (q) {
            navigate(`/search?q=${encodeURIComponent(q)}`)
        }
    }

    async function handleLogout() {
        try {
            await logout()
            navigate('/')
        } catch (err) {
            console.error("Logout failed:", err)
        }
    }

    return (
        <div className="min-h-screen bg-white">
            {/* NAVBAR */}
            <nav className="w-full bg-white shadow-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        {/* Logo Section */}
                        <Link to="/" className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center">
                                <span className="text-white font-bold text-lg">P</span>
                            </div>
                            <span className="font-bold text-xl text-gray-800">Procure Nepal</span>
                        </Link>

                        {/* Search Bar - Center */}
                        <div className="flex-1 mx-8">
                            <form onSubmit={handleSearch} className="flex">
                                <div className="relative flex-1">
                                    <input 
                                        value={query} 
                                        onChange={e => setQuery(e.target.value)} 
                                        type="text" 
                                        placeholder="Search for products (e.g. mobile, jackets, shoes)" 
                                        className="w-full px-4 py-3 border border-gray-300 rounded-l-lg focus:outline-none focus:border-teal-500 transition-all"
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
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full">
                                        <i className="bi bi-person-circle text-xl text-teal-600"></i>
                                        <span className="text-gray-700 font-medium text-sm">
                                            {user.name || user.email.split('@')[0]}
                                        </span>
                                    </div>
                                    
                                    {/* Show Dashboard Link only if they are a supplier */}
                                    {user.role === 'supplier' ? (
                                        <Link to="/supplier-dashboard" className="text-teal-600 hover:text-teal-700 font-medium text-sm transition-colors">
                                            My Dashboard
                                        </Link>
                                    ) : (
                                        <Link to="/get-started" className="text-teal-600 hover:text-teal-700 font-medium text-sm transition-colors">
                                            Start Selling
                                        </Link>
                                    )}

                                    <button 
                                        onClick={handleLogout} 
                                        className="text-gray-500 hover:text-red-600 font-medium text-sm transition-colors border-l pl-4"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                            <a href="tel:+977123456789" className="hidden lg:flex text-gray-700 hover:text-teal-600 font-medium items-center gap-1">
                                <i className="bi bi-telephone-fill"></i>
                                <span>Helpline</span>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Secondary Nav */}
                <div className="border-t border-gray-200 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-8">
                        <button className="text-gray-700 hover:text-teal-600 font-medium flex items-center gap-2 transition-colors group">
                            <span>All Categories</span>
                            <i className="bi bi-chevron-down text-sm"></i>
                        </button>
                        <Link to="#" className="text-gray-600 hover:text-teal-600 font-medium transition-colors text-sm">
                            Post Your Requirements
                        </Link>
                        {(!user || user.role !== 'supplier') && (
                            <Link to="/get-started" className="text-teal-600 hover:text-teal-700 font-bold transition-colors text-sm">
                                Become a seller
                            </Link>
                        )}
                    </div>
                </div>
            </nav>

            {/* HERO BANNER */}
            <div className="w-full bg-gradient-to-r from-teal-50 to-blue-50 py-16">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h1 className="text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
                                <span className="text-teal-600">Nepal's 1<sup>st</sup></span>
                                <br /> Wholesale Marketplace
                            </h1>
                            <p className="text-gray-600 text-lg mb-8 max-w-lg">
                                Connect with verified suppliers and access thousands of wholesale products at competitive prices. Bulk buying made easy.
                            </p>
                            
                            <div className="flex flex-wrap gap-4">
                                {!user ? (
                                    <>
                                        <Link to="/register" className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-4 rounded-lg font-bold shadow-lg shadow-teal-200 transition-all transform hover:-translate-y-1">
                                            Join Now
                                        </Link>
                                        <button className="border-2 border-teal-600 text-teal-600 hover:bg-white px-8 py-4 rounded-lg font-bold transition-all">
                                            Learn More
                                        </button>
                                    </>
                                ) : (
                                    <div className="bg-white p-6 rounded-xl border border-teal-100 shadow-sm">
                                        <h3 className="text-xl font-bold text-gray-800 mb-2">Welcome back, {user.name}!</h3>
                                        <p className="text-gray-500 mb-4 text-sm">Find new products or manage your requests.</p>
                                        <div className="flex gap-3">
                                            <Link to="/search" className="bg-teal-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-teal-700">
                                                Browse Products
                                            </Link>
                                            {user.role === 'supplier' && (
                                                <Link to="/supplier-dashboard" className="bg-gray-800 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-black">
                                                    Manage Inventory
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="hidden md:block">
                            <img 
                                src="https://img.freepik.com/free-vector/isometric-e-commerce-concept_23-2148564680.jpg?semt=ais_hybrid&w=740&q=80" 
                                alt="Wholesale Marketplace Nepal" 
                                className="w-full h-auto drop-shadow-2xl rounded-2xl" 
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* CONTENT SECTIONS */}
            <main>
                <Landingbanner />
                <Categories />
            </main>
        </div>
    )
}

export default Landing
