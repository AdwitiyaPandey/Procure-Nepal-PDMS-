import React, { useState, lazy, Suspense, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../AuthContext'
const Landingbanner = lazy(() => import('../Landingbanner'))
const Categories = lazy(() => import('../Categories'))

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
        <div className="min-h-screen flex flex-col">
            <main className="flex-grow">
            {/* NAVBAR */}
            <nav className="w-full bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo Section */}
                        <Link
                            to="/"
                            onClick={(e) => { e.preventDefault(); window.location.href = '/'; }}
                            className="flex items-center gap-2 flex-shrink-0 group hover:opacity-70 transition-opacity duration-300"
                        >
                            <img src="src\assets\images\favicon\android-chrome-512x512.png" alt="ProcureNP" className="h-10 w-auto" />
                        </Link>

                        {/* Search Bar - Center - Hidden on mobile */}
                        <div className="hidden md:flex flex-1 mx-4 lg:mx-8 max-w-md">
                            <form onSubmit={handleSearch} className="w-full">
                                <div className="relative">
                                    <input
                                        value={query}
                                        onChange={e => setQuery(e.target.value)}
                                        type="text"
                                        placeholder="Search products..."
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all duration-300"
                                    />

                                    {/* Suggestions dropdown */}
                                    <SuggestionsInput query={query} onSelect={(q) => { setQuery(q); navigate(`/search?q=${encodeURIComponent(q)}`); }} />
                                </div>
                            </form>
                        </div>

                        {/* Right Section - Auth & Menu */}
                        <div className="flex items-center gap-2 sm:gap-4">
                            {!user ? (
                                <>
                                    <Link to="/login" className="text-gray-700 hover:text-gray-900 font-medium text-sm transition-colors duration-300 uppercase">
                                        Sign in
                                    </Link>
                                    <Link to="/register" className="text-gray-700 hover:text-gray-900 font-medium text-sm transition-colors duration-300 uppercase">
                                        Sign up
                                    </Link>
                                    <Link to="/seller-register" className="bg-black hover:bg-gray-900 text-white px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 hover:shadow-lg active:scale-95 uppercase">
                                        Become a seller
                                    </Link>
                                </>
                            ) : (
                                <>
                                                                        <Link 
                                                                            to="/favourites" 
                                                                            className="relative text-gray-700 hover:text-red-600 font-medium text-sm transition-colors duration-300 flex items-center gap-1 group"
                                                                            title="View my favourite products"
                                                                        >
                                                                            <i className="bi bi-heart text-lg group-hover:scale-110 transition-transform"></i>
                                                                            <span className="hidden sm:inline uppercase">Favourites</span>
                                                                        </Link>
                                                                        {user.role === 'seller' ? (
                                                                            <Link to="/supplier-dashboard" className="hidden sm:flex items-center gap-2 border-r border-gray-200 pr-4">
                                                                                <i className="bi bi-person-circle text-gray-600"></i>
                                                                                <span className="text-gray-700 font-medium text-sm">{user.displayName || user.email.split('@')[0]}</span>
                                                                            </Link>
                                                                        ) : (
                                                                            <div className="hidden sm:flex items-center gap-2 border-r border-gray-200 pr-4">
                                                                                <i className="bi bi-person-circle text-gray-600"></i>
                                                                                <span className="text-gray-700 font-medium text-sm">{user.displayName || user.email.split('@')[0]}</span>
                                                                            </div>
                                                                        )}
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
                                                            <div className="hidden sm:flex border-t border-gray-100 gap-8 py-3">
                                                                <button
                                                                    onClick={() => {
                                                                        // scroll to popular categories section if present
                                                                        const el = document.getElementById('popular-categories');
                                                                        if (el) {
                                                                            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                                                        } else {
                                                                            // fallback: navigate to landing root (current) then try setting hash
                                                                            window.location.hash = '#popular-categories';
                                                                        }
                                                                    }}
                                                                    className="text-gray-600 hover:text-gray-900 font-medium text-sm flex items-center gap-1 transition-colors"
                                                                >
                                                                    <span>Categories</span>
                                                                </button>
                                                                <button
                                                                    onClick={() => navigate('/search')}
                                                                    className="text-gray-600 hover:text-gray-900 font-medium text-sm flex items-center gap-1 transition-colors"
                                                                >
                                                                    <span>Products</span>
                                                                </button>
                                                            </div>
                                                        </div>
                                                        </nav>

                                                                    <div className="w-full bg-white py-12 md:py-20">
                                                                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-15 items-center">
                                                                                <div className="text-center md:text-left">
                                                                                    <h1 className="text-5xl md:text-4xl lg:text-6xl font-bold text-gray-900 mb-6"
                                                                                        style={{ letterSpacing: '0.07em', lineHeight: 1.7 }}
                                                                                    >
                                                                                        Nepal's Wholesale Marketplace
                                                                                    </h1>
                                                                                    <p className="text-gray-600 text-base md:text-lg mb-8 leading-relaxed">
                                                                                        Connect with verified suppliers and access thousands of wholesale products at competitive prices. Streamline your sourcing process with Nepal's most trusted B2B platform.
                                                                                    </p>
                                                                                    <div className="flex flex-col sm:flex-row gap-10 mb-8 justify-left items-center">
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
                                                                                    <div className="mt-15 flex gap-20 text-sm text-gray-600">
                                                                                        <div className="flex items-center gap-5">
                                                                                            <i className="bi bi-check-circle text-black text-lg"></i>
                                                                                            <span>Verified Suppliers</span>
                                                                                        </div>
                                                                                        <div className="flex items-center gap-5">
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

                                                                                        <Suspense fallback={<div className="py-12 text-center">Loading...</div>}>
                                                                                                <Landingbanner />
                                                                                                <div id="popular-categories">
                                                                                                    <Categories />
                                                                                                </div>
                                                                                        </Suspense>
                                                                                </main>
                        <footer className="bg-gray-900 text-gray-200 mt-auto">
                                <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
                                    <div>
                                        <h4 className="font-semibold mb-3 text-white">Company</h4>
                                        <ul className="space-y-2 text-sm">
                                            <li><a href="#" className="hover:underline">About ProcureNP</a></li>
                                            <li><a href="#" className="hover:underline">Careers</a></li>
                                            <li><a href="mailto:procurenepal@gmail.com" className="hover:underline">Contact</a></li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold mb-3 text-white">Business</h4>
                                        <ul className="space-y-2 text-sm">
                                            <li><a href="#" className="hover:underline">Sell on ProcureNP</a></li>
                                            <li><a href="#" className="hover:underline">Supplier Help</a></li>
                                            <li><a href="#" className="hover:underline">Buyer Help</a></li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold mb-3 text-white">Business & Trade</h4>
                                        <ul className="space-y-2 text-sm">
                                            <li><a href="#" className="hover:underline">Market Insights</a></li>
                                            <li><a href="#" className="hover:underline">Trade Directories</a></li>
                                            <li><a href="#" className="hover:underline">Import / Export Guides</a></li>
                                            <li><a href="#" className="hover:underline">Trade Events & Conferences</a></li>
                                            <li><a href="#" className="hover:underline">Government Resources</a></li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold mb-3 text-white">News</h4>
                                        <ul className="space-y-2 text-sm">
                                            <li><a href="https://ekantipur.com" target="_blank" rel="noopener noreferrer" className="hover:underline">Ekantipur</a></li>
                                            <li><a href="https://kathmandupost.com" target="_blank" rel="noopener noreferrer" className="hover:underline">The Kathmandu Post</a></li>
                                            <li><a href="https://english.onlinekhabar.com" target="_blank" rel="noopener noreferrer" className="hover:underline">OnlineKhabar</a></li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="border-t border-gray-800 py-4">
                                    <div className="max-w-7xl mx-auto px-6 text-sm text-gray-400 flex items-center justify-between">
                                        <div>© {new Date().getFullYear()} ProcureNP. All rights reserved.</div>
                                        <div className="space-x-4">
                                            <a href="#" className="hover:underline">Facebook</a>
                                            <a href="#" className="hover:underline">Instagram</a>
                                            <a href="#" className="hover:underline">LinkedIn</a>
                                        </div>
                                    </div>
                                </div>
                        </footer>
                </div>
    )
}

export default Landing
// Commit-marker: Ujjwal incremental commit

// --- Helper component: SuggestionsInput ---
function SuggestionsInput({ query, onSelect }) {
    const [items, setItems] = useState([])
    const [show, setShow] = useState(false)
    const controllerRef = useRef(null)

    useEffect(() => {
        if (!query || query.trim().length < 2) {
            setItems([])
            setShow(false)
            return
        }

        // debounce
        const t = setTimeout(async () => {
            try {
                if (controllerRef.current) controllerRef.current.abort()
                controllerRef.current = new AbortController()
                const res = await fetch(`http://localhost:4000/api/products?q=${encodeURIComponent(query)}&limit=6`, { signal: controllerRef.current.signal })
                if (!res.ok) return
                const data = await res.json()
                const list = data.products || []
                setItems(list.slice(0,6))
                setShow(true)
            } catch (err) {
                // ignore
            }
        }, 250)

        return () => { clearTimeout(t); if (controllerRef.current) controllerRef.current.abort() }
    }, [query])

    if (!show || items.length === 0) return null

    return (
        <ul className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-56 overflow-auto">
            {items.map(it => (
                <li key={it.id} className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm" onMouseDown={(e) => { e.preventDefault(); onSelect(it.name) }}>
                    {it.name}
                </li>
            ))}
        </ul>
    )
}

