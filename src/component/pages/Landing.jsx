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
            <nav className="w-full bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo Section */}
                        <Link to="/" className="flex items-center gap-2 flex-shrink-0 group hover:opacity-70 transition-opacity duration-300">
                            <img src="/src/assets/images/favicon/favicon.ico" alt="ProcureNP" className="h-10 w-10" />
                        </Link>

                        {/* Search Bar - Center - Hidden on mobile */}
                        <div className="hidden md:flex flex-1 mx-4 lg:mx-8 max-w-md">
                            <form onSubmit={handleSearch} className="w-full flex">
                                <div className="relative flex-1">
                                    <input 
                                        value={query} 
                                        onChange={e => setQuery(e.target.value)} 
                                        type="text" 
                                        placeholder="Search products..." 
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all duration-300"
                                    />
                                </div>
                                <button type="submit" className="bg-black hover:bg-gray-900 text-white px-4 py-2 rounded-lg ml-2 transition-all duration-300 text-sm font-medium active:scale-95">
                                    <i className="bi bi-search"></i>
                                </button>
                            </form>
                        </div>

                        {/* Right Section - Auth & Menu */}
                        <div className="flex items-center gap-2 sm:gap-4">
                            {!user ? (
                                <>
                                    <Link to="/login" className="text-gray-700 hover:text-gray-900 font-medium text-sm transition-colors duration-300 uppercase">
                                        Sign in
                                    </Link>
                                    <Link to="/seller-register" className="bg-black hover:bg-gray-900 text-white px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 hover:shadow-lg active:scale-95 uppercase">
                                        Start selling
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <div className="hidden sm:flex items-center gap-2 border-r border-gray-200 pr-4">
                                        <i className="bi bi-person-circle text-gray-600"></i>
                                        <span className="text-gray-700 font-medium text-sm">{user.displayName || user.email.split('@')[0]}</span>
                                    </div>
                                    {user.role === 'supplier' && (
                                        <Link to="/supplier-dashboard" className="text-teal-600 hover:text-teal-700 font-medium text-sm transition-colors hidden sm:inline">
                                            Dashboard
                                        </Link>
                                    )}
                                    <button onClick={handleLogout} className="text-gray-700 hover:text-red-600 font-medium text-sm transition-colors">
                                        <i className="bi bi-box-arrow-right"></i>
                                    </button>
                                </>
                            )}
                            <a href="tel:+977123456789" className="text-gray-700 hover:text-teal-600 font-medium hidden md:flex items-center gap-1 text-sm">
                                <i className="bi bi-telephone-fill"></i>
                            </a>
                        </div>
                    </div>

                    {/* Mobile Search - Visible only on mobile */}
                    <div className="md:hidden pb-4">
                        <form onSubmit={handleSearch} className="flex gap-2">
                            <input 
                                value={query} 
                                onChange={e => setQuery(e.target.value)} 
                                type="text" 
                                placeholder="Search..." 
                                className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                            />
                            <button type="submit" className="bg-teal-600 text-white px-4 py-2 rounded-lg transition-colors">
                                <i className="bi bi-search"></i>
                            </button>
                        </form>
                    </div>

                    {/* Secondary Nav */}
                    <div className="hidden sm:flex border-t border-gray-100 gap-8 py-3">
                        <button className="text-gray-600 hover:text-gray-900 font-medium text-sm flex items-center gap-1 transition-colors">
                            <span>Products</span>
                        </button>
                        <Link to="#" className="text-gray-600 hover:text-gray-900 font-medium text-sm transition-colors">
                            Post Requirements
                        </Link>
                    </div>
                </div>
            </nav>

            <div className="w-full bg-white py-12 md:py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-15 items-center">
                        <div>
                            <h1 className="text-5xl md:text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight tracking-tight">
                                Nepal's Wholesale Marketplace
                            </h1>
                            <p className="text-gray-600 text-base md:text-lg mb-8 leading-relaxed">
                                Connect with verified suppliers and access thousands of wholesale products at competitive prices. Streamline your sourcing process with Nepal's most trusted B2B platform.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                                {!user ? (
                                    <>
                                        <Link to="/seller-register" className="bg-black hover:bg-gray-900 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 text-center hover:shadow-lg active:scale-95 uppercase">
                                            Start Selling
                                        </Link>
                                        <button className="border-2 border-gray-300 text-gray-900 hover:border-black hover:bg-gray-50 px-8 py-3 rounded-lg font-semibold transition-all duration-300 active:scale-95 uppercase">
                                            Learn More
                                        </button>
                                    </>
                                ) : null}
                            </div>
                            <div className="mt-8 flex gap-6 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                    <i className="bi bi-check-circle text-black text-lg"></i>
                                    <span>Verified Suppliers</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <i className="bi bi-check-circle text-black text-lg"></i>
                                    <span>Secure Transactions</span>
                                </div>
                            </div>
                        </div>
                        <div className="hidden md:block animate-fade-in">
                            <img src="src\assets\images\landing.jpg" alt="Wholesale" className="w-full h-auto object-contain rounded-xl" />
                        </div>
                    </div>
                </div>
            </div>

            <Landingbanner />
            <Categories />
        </>
    )
}

export default Landing

