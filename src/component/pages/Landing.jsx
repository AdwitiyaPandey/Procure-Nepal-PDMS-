import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import { toast, Toaster } from 'react-hot-toast';


import Categories from '../Categories';
import SupplierProfile from '../SupplierProfile'; 
import AddProductForm from '../AddProductForm'; 

function Landing() {
    const [query, setQuery] = useState('');
    const [activeView, setActiveView] = useState('buyer'); 
    const [showAddForm, setShowAddForm] = useState(false); 
    const navigate = useNavigate();
    const { user, logout } = useAuth(); 

    function handleSearch(e) {
        e.preventDefault();
        const q = query.trim();
        if (q) {
            navigate(`/search?q=${encodeURIComponent(q)}`);
        }
    }

    const handleLogout = () => {
        if (window.confirm("Are you sure you want to logout?")) {
            logout();
            toast.success("Logged out successfully");
            navigate('/');
        }
    };

    const toggleView = () => {
        setActiveView(activeView === 'buyer' ? 'seller' : 'buyer');
        setShowAddForm(false);
    };
    useEffect(() => {
        if (user && user.role === 'seller' && !user.isApproved) {
            
            const checkStatus = async () => {
                try {
                    const res = await axios.get(`http://localhost:5000/api/auth/status/${user.id}`);
                    if (res.data.isApproved) {
                        
                        toast.success("Your account has been approved! Please re-login to access seller tools.");
                    }
                } catch (err) {
                    console.log("Still pending...");
                }
            };
            checkStatus();
        }
    }, [user]);

    return (
        <div className="min-h-screen bg-white">
            <Toaster position="top-center" />
            

            <nav className="w-full bg-white shadow-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                     
                        <Link to="/" onClick={() => {setActiveView('buyer'); setShowAddForm(false);}} className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center">
                                <span className="text-white font-bold text-lg">P</span>
                            </div>
                            <span className="font-bold text-xl text-gray-800">Procure Nepal</span>
                        </Link>


                        <div className={`flex-1 mx-8 transition-opacity ${activeView === 'seller' ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}>
                            <form onSubmit={handleSearch} className="flex">
                                <input 
                                    value={query} 
                                    onChange={e => setQuery(e.target.value)} 
                                    type="text" 
                                    placeholder="Search wholesale products..." 
                                    className="w-full px-4 py-3 border border-gray-300 rounded-l-lg focus:outline-none focus:border-teal-500"
                                />
                                <button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-r-lg">
                                    <i className="bi bi-search"></i>
                                </button>
                            </form>
                        </div>


                        <div className="flex items-center gap-5">
                            {!user ? (
                                <Link to="/login" className="bg-teal-600 text-white px-6 py-2 rounded-lg font-bold">Login</Link>
                            ) : (
                                <div className="flex items-center gap-4">
                                    
                                    {/* --- 1. BECOME A SELLER BUTTON (For Buyers) --- */}
                                    {user.role === 'buyer' && (
                                        <Link 
                                            to="/become-seller" 
                                            className="bg-amber-100 text-amber-700 px-4 py-2 rounded-lg font-bold border border-amber-200 hover:bg-amber-200 transition-all flex items-center gap-2"
                                        >
                                            <i className="bi bi-shop-window"></i> Become a Seller
                                        </Link>
                                    )}

                                    {/* --- 2. PENDING APPROVAL MESSAGE --- */}
                                    {user.role === 'seller' && !user.isApproved && (
                                        <div className="bg-gray-100 text-gray-500 px-4 py-2 rounded-lg text-sm italic border border-gray-200">
                                            <i className="bi bi-clock-history mr-2"></i>
                                            Seller Approval Pending
                                        </div>
                                    )}

                                    {/* --- 3. ADD PRODUCT BUTTON (Visible only in Seller View) --- */}
                                    {activeView === 'seller' && !showAddForm && (
                                        <button 
                                            onClick={() => setShowAddForm(true)}
                                            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-bold transition-all flex items-center gap-2 shadow-sm"
                                        >
                                            <i className="bi bi-plus-circle"></i> Add Product
                                        </button>
                                    )}

                                    {/* --- 4. SWITCH VIEW BUTTON (Only for Approved Sellers) --- */}
                                    {user.role === 'seller' && user.isApproved && (
                                        <button 
                                            onClick={toggleView}
                                            className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${
                                                activeView === 'seller' 
                                                ? 'bg-orange-600 text-white border-orange-600 shadow-lg' 
                                                : 'bg-white text-teal-600 border-teal-200 hover:bg-teal-50'
                                            }`}
                                        >
                                            <i className={`bi ${activeView === 'buyer' ? 'bi-shop' : 'bi-cart'} mr-2`}></i>
                                            {activeView === 'buyer' ? 'Switch to Supplier View' : 'Back to Shopping'}
                                        </button>
                                    )}


                                    {user.role === 'admin' && (
                                        <Link to="/admin-dashboard" className="text-teal-600 font-bold text-sm bg-teal-50 px-3 py-2 rounded-lg">
                                            Admin Panel
                                        </Link>
                                    )}

                                    <div className="h-8 w-[1px] bg-gray-200 mx-2"></div>

                                    <button onClick={handleLogout} className="text-gray-400 hover:text-red-600 transition-colors">
                                        <i className="bi bi-box-arrow-right text-xl"></i>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>


            <main className="min-h-[70vh]">
                {activeView === 'buyer' ? (

                    <>
                        <div className="w-full bg-gradient-to-r from-teal-50 to-blue-50 py-16">
                            <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-8 items-center">
                                <div>
                                    <h1 className="text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
                                        Nepal's <span className="text-teal-600">Wholesale</span> Hub
                                    </h1>
                                    <p className="text-gray-600 text-lg mb-8">
                                        Connect with verified local suppliers. Bulk buying made simple.
                                    </p>
                                    {!user && (
                                        <Link to="/register" className="bg-teal-600 text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-teal-100 hover:bg-teal-700 transition-all">
                                            Get Started Now
                                        </Link>
                                    )}
                                </div>
                                <div className="hidden md:block">
                                    <img 
                                        src="https://img.freepik.com/free-vector/isometric-e-commerce-concept_23-2148564680.jpg?w=740" 
                                        alt="Wholesale" 
                                        className="rounded-3xl shadow-2xl" 
                                    />
                                </div>
                            </div>
                        </div>
                        <Categories />
                    </>
                ) : (
                    showAddForm ? (
                        <AddProductForm onBack={() => setShowAddForm(false)} />
                    ) : (
                        <SupplierProfile user={user} />
                    )
                )}
            </main>


            <footer className="bg-gray-900 text-white py-12 mt-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-8">
                        <div>
                            <h3 className="text-xl font-bold mb-4">Procure Nepal</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Empowering Nepalese businesses by bridging the gap between local manufacturers and wholesale buyers.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4">Quick Links</h4>
                            <ul className="text-gray-400 text-sm space-y-2">
                                <li className="hover:text-teal-400 cursor-pointer">About Us</li>
                                <li className="hover:text-teal-400 cursor-pointer">Terms & Conditions</li>
                                <li className="hover:text-teal-400 cursor-pointer">Help Center</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4">Contact</h4>
                            <p className="text-gray-400 text-sm">Kathmandu, Nepal</p>
                            <p className="text-gray-400 text-sm">Email: support@procurenepal.com</p>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-xs">
                        &copy; 2026 Procure Nepal. Designed for local growth.
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Landing;