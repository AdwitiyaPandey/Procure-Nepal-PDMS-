import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';

function Landingbanner() {
    const { user } = useAuth(); // Access the global auth state
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    function fetchProducts() {
        // Replace with your actual product API endpoint
        fetch('http://localhost:5000/api/products')
            .then(r => r.json())
            .then(data => {
                setProducts(Array.isArray(data) ? data : []);
            })
            .catch(err => {
                console.error("Fetch error:", err);
                setProducts([]);
            })
            .finally(() => setLoading(false));
    }

    if (loading) {
        return (
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-teal-600"></div>
                    <p className="mt-4 text-gray-500">Loading wholesale deals...</p>
                </div>
            </section>
        );
    }

    // Take the first 11 products to leave the 12th slot for the "Seller CTA" card
    const displayProducts = products.slice(0, 11);

    return (
        <div className="bg-gray-50 pb-16">
            <section className="py-12">
                <div className="max-w-7xl mx-auto px-6">
                    {/* Section Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Wholesale Products</h2>
                            <p className="text-gray-600">Direct from verified Nepalese suppliers</p>
                        </div>
                        <Link to="/all-products" className="text-teal-600 font-semibold hover:underline">
                            View All Products <i className="bi bi-arrow-right"></i>
                        </Link>
                    </div>

                    {/* Product Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
                        {displayProducts.map(p => (
                            <div key={p.id} className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col">
                                {/* Image Container */}
                                <div className="h-44 bg-gray-100 overflow-hidden relative">
                                    {p.image ? (
                                        <img 
                                            src={p.image} 
                                            alt={p.name} 
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-teal-50">
                                            <i className="bi bi-box text-4xl text-teal-200"></i>
                                        </div>
                                    )}
                                    <div className="absolute top-2 left-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-[10px] font-bold text-teal-700 uppercase">
                                        Verified Lead
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-4 flex-1 flex flex-col">
                                    <h3 className="font-bold text-gray-800 text-sm line-clamp-2 mb-1 group-hover:text-teal-600 transition-colors">
                                        {p.name}
                                    </h3>
                                    <p className="text-xs text-gray-500 mb-4">MOQ: <span className="text-gray-800 font-medium">{p.quantity || 'Negotiable'} Units</span></p>
                                    
                                    <div className="mt-auto">
                                        {user ? (
                                            <a 
                                                href={`tel:${p.sellerPhone || '977xxxxxxxx'}`}
                                                className="block w-full text-center bg-teal-600 text-white py-2.5 rounded-lg text-xs font-bold hover:bg-teal-700 transition-all transform active:scale-95"
                                            >
                                                <i className="bi bi-telephone-fill mr-2"></i> Call to Negotiate
                                            </a>
                                        ) : (
                                            <Link 
                                                to="/login" 
                                                className="block w-full text-center border-2 border-teal-600 text-teal-600 py-2 rounded-lg text-xs font-bold hover:bg-teal-50 transition-colors"
                                            >
                                                Login to Call
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* DYNAMIC CALL TO ACTION CARD */}
                        <div className="group bg-gradient-to-br from-teal-500 to-teal-700 rounded-xl overflow-hidden shadow-lg p-6 flex flex-col justify-center items-center text-center text-white min-h-[300px]">
                            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
                                <i className="bi bi-megaphone text-2xl"></i>
                            </div>
                            
                            {!user ? (
                                <>
                                    <h4 className="font-bold text-lg mb-2">New to Procure Nepal?</h4>
                                    <p className="text-xs mb-6 opacity-90 leading-relaxed">Register as a buyer to contact sellers and start negotiating deals.</p>
                                    <Link to="/register" className="bg-white text-teal-700 px-6 py-2.5 rounded-full font-bold text-sm hover:bg-gray-100 transition-colors shadow-lg">
                                        JOIN NOW
                                    </Link>
                                </>
                            ) : user.role === 'buyer' ? (
                                <>
                                    <h4 className="font-bold text-lg mb-2">Become a Seller</h4>
                                    <p className="text-xs mb-6 opacity-90 leading-relaxed">List your products and get direct calls from bulk buyers across Nepal.</p>
                                    <Link to="/get-started" className="bg-white text-teal-700 px-6 py-2.5 rounded-full font-bold text-sm hover:bg-gray-100 transition-colors shadow-lg">
                                        APPLY FOR SELLER
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <h4 className="font-bold text-lg mb-2">Supplier Panel</h4>
                                    <p className="text-xs mb-6 opacity-90 leading-relaxed">Ready to add more products or view your leads?</p>
                                    <Link to="/supplier-dashboard" className="bg-white text-teal-700 px-6 py-2.5 rounded-full font-bold text-sm hover:bg-gray-100 transition-colors shadow-lg">
                                        GO TO DASHBOARD
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Landingbanner;