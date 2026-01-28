import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { useAuth } from '../../AuthContext'; // Import useAuth
import { toast, Toaster } from 'react-hot-toast';

function AdminDashboard() {
  const [pendingSellers, setPendingSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();
  const { logout } = useAuth(); // Destructure logout from context

  useEffect(() => {
    fetchPendingSellers();
  }, []);

  const fetchPendingSellers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/pending-sellers');
      setPendingSellers(res.data);
    } catch (err) {
      toast.error("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  // --- Logout Logic ---
  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout from the Admin Panel?");
    if (confirmLogout) {
      logout(); // Clears user state
      toast.success("Logged out successfully");
      navigate('/login'); // Redirect to login
    }
  };

  const handleAction = async (userId, action) => {
    try {
      await axios.post('http://localhost:5000/api/admin/verify-seller', { userId, action });
      toast.success(`Seller ${action}d successfully`);
      fetchPendingSellers(); 
    } catch (err) {
      toast.error("Action failed");
    }
  };

  if (loading) return <div className="p-10 text-center">Loading Applications...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <Toaster />
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Control Panel</h1>
            <p className="text-gray-600">Review and verify new seller applications</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="bg-teal-100 text-teal-800 px-4 py-2 rounded-full font-bold text-sm">
              {pendingSellers.length} Pending
            </div>
            
            {/* Logout Button */}
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white px-4 py-2 rounded-lg font-bold transition-all border border-red-100"
            >
              <i className="bi bi-box-arrow-right"></i>
              Logout
            </button>
          </div>
        </header>

        {pendingSellers.length === 0 ? (
          <div className="bg-white p-20 rounded-2xl shadow text-center">
            <i className="bi bi-check2-circle text-6xl text-teal-500 mb-4"></i>
            <h2 className="text-xl font-semibold text-gray-800">All caught up!</h2>
            <p className="text-gray-500">No new applications to review.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {pendingSellers.map((seller) => (
              <div key={seller.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6 md:flex gap-8">
                  
                  {/* Business Identity */}
                  <div className="md:w-1/3 mb-6 md:mb-0">
                    <h2 className="text-xl font-bold text-gray-900 mb-1">{seller.companyName}</h2>
                    <p className="text-teal-600 font-medium mb-4">{seller.name}</p>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p><span className="font-bold">Email:</span> {seller.email}</p>
                      <p><span className="font-bold">PAN:</span> {seller.pan}</p>
                      <p><span className="font-bold">VAT:</span> {seller.vat || 'N/A'}</p>
                      <p><span className="font-bold">Est:</span> {seller.established}</p>
                    </div>
                  </div>

                  {/* Document Review Section */}
                  <div className="md:w-1/3 flex gap-4 mb-6 md:mb-0">
                    <div className="flex-1">
                      <p className="text-xs font-bold text-gray-400 uppercase mb-2">Citizenship</p>
                      <a href={`http://localhost:5000/${seller.citizenshipImage}`} target="_blank" rel="noreferrer">
                        <img 
                          src={`http://localhost:5000/${seller.citizenshipImage}`} 
                          alt="Citizenship" 
                          className="w-full h-32 object-cover rounded-lg border hover:opacity-80 transition-opacity"
                        />
                      </a>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-gray-400 uppercase mb-2">Profile Photo</p>
                      <img 
                        src={`http://localhost:5000/${seller.profilePhoto}`} 
                        alt="Profile" 
                        className="w-full h-32 object-cover rounded-lg border"
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="md:w-1/3 flex flex-col justify-center gap-3">
                    <button 
                      onClick={() => handleAction(seller.id, 'approve')}
                      className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-teal-100"
                    >
                      <i className="bi bi-patch-check mr-2"></i> Approve Seller
                    </button>
                    <button 
                      onClick={() => handleAction(seller.id, 'decline')}
                      className="w-full bg-white border border-red-200 text-red-600 hover:bg-red-50 font-bold py-3 rounded-xl transition-colors"
                    >
                      Decline Application
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;