import React, { useState } from 'react';
import AddProduct from './AddProduct';

function SupplierProfile({ user }) {
  const [showForm, setShowForm] = useState(false);
  const [stats] = useState({
    totalProducts: 0,
    activeLeads: 0,
    profileViews: 124,
    rating: 4.8
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 animate-fadeIn">
      {/* Header Summary */}
      <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 bg-teal-100 rounded-2xl flex items-center justify-center text-teal-700">
              <i className="bi bi-building text-4xl"></i>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">{user.companyName || "Your Company"}</h2>
              <div className="flex items-center gap-3 mt-1 text-gray-500">
                <span className="flex items-center gap-1 text-sm bg-teal-50 text-teal-700 px-2 py-0.5 rounded-md border border-teal-100">
                  <i className="bi bi-patch-check-fill"></i> Verified Supplier
                </span>
                <span className="text-sm">• {user.email}</span>
              </div>
            </div>
          </div>
          
          {/* Toggle Button */}
          <button 
            onClick={() => setShowForm(!showForm)}
            className={`${showForm ? 'bg-gray-100 text-gray-600' : 'bg-teal-600 text-white shadow-teal-100'} hover:opacity-90 px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg`}
          >
            <i className={`bi ${showForm ? 'bi-x-lg' : 'bi-plus-circle'}`}></i>
            {showForm ? "Cancel / Back" : "List New Product"}
          </button>
        </div>
      </div>

      {showForm ? (
        
        <AddProduct user={user} onSuccess={() => setShowForm(false)} />
      ) : (
       
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <StatCard icon="bi-box-seam" label="My Products" value={stats.totalProducts} color="teal" />
            <StatCard icon="bi-graph-up-arrow" label="Profile Views" value={stats.profileViews} color="blue" />
            <StatCard icon="bi-chat-dots" label="Inquiries" value={stats.activeLeads} color="orange" />
            <StatCard icon="bi-star" label="Seller Rating" value={stats.rating} color="purple" />
          </div>

          <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl p-16 text-center">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
              <i className="bi bi-archive text-4xl text-gray-300"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No products listed yet</h3>
            <p className="text-gray-500 max-w-sm mx-auto mb-8">
              Start reaching wholesale buyers across Nepal by listing your first bulk product.
            </p>
            <button onClick={() => setShowForm(true)} className="text-teal-600 font-bold hover:underline">
              Click here to add your first product
            </button>
          </div>
        </>
      )}
    </div>
  );
}



function StatCard({ icon, label, value, color }) {
  const colors = {
    teal: "bg-teal-50 text-teal-600",
    blue: "bg-blue-50 text-blue-600",
    orange: "bg-orange-50 text-orange-600",
    purple: "bg-purple-50 text-purple-600"
  };
  
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${colors[color]}`}>
        <i className={`bi ${icon}`}></i>
      </div>
      <div>
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}

export default SupplierProfile;