import React, { useState, useMemo } from 'react';

// --- Sample Data (Replace with data fetched from your Node.js API) ---
const mockOrders = [
  { id: 'ORD001', customerName: 'Ramesh Sharma', date: '2025-12-10', total: 4500.00, status: 'Pending', products: 3 },
  { id: 'ORD002', customerName: 'Priya Mehra', date: '2025-12-09', total: 8250.50, status: 'Shipped', products: 1 },
  { id: 'ORD003', customerName: 'Vikas Gupta', date: '2025-12-09', total: 1200.00, status: 'Delivered', products: 2 },
  { id: 'ORD004', customerName: 'Sanjana Singh', date: '2025-12-08', total: 670.00, status: 'Cancelled', products: 1 },
  { id: 'ORD005', customerName: 'Alok Kumar', date: '2025-12-07', total: 15300.00, status: 'Pending', products: 5 },
  { id: 'ORD006', customerName: 'Deepa Patel', date: '2025-12-06', total: 3400.00, status: 'Shipped', products: 2 },
];

// --- Utility Function to get status styling ---
const getStatusBadge = (status) => {
  let colorClass = '';
  switch (status) {
    case 'Pending':
      colorClass = 'bg-yellow-100 text-yellow-800';
      break;
    case 'Shipped':
      colorClass = 'bg-blue-100 text-blue-800';
      break;
    case 'Delivered':
      colorClass = 'bg-green-100 text-green-800';
      break;
    case 'Cancelled':
      colorClass = 'bg-red-100 text-red-800';
      break;
    default:
      colorClass = 'bg-gray-100 text-gray-800';
  }
  return (
    <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium ${colorClass}`}>
      {status}
    </span>
  );
};

const ViewCustomerOrder = () => {
  const [orders, setOrders] = useState(mockOrders);
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  
  // In a real application, you would add state for loading and error

  // --- Filter and Search Logic (Memoized for performance) ---
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      // 1. Status Filter
      const statusMatch = filterStatus === 'All' || order.status === filterStatus;
      
      // 2. Search Term Filter (Search by ID or Customer Name)
      const lowerCaseSearch = searchTerm.toLowerCase();
      const searchMatch = 
        order.id.toLowerCase().includes(lowerCaseSearch) ||
        order.customerName.toLowerCase().includes(lowerCaseSearch);

      return statusMatch && searchMatch;
    });
  }, [orders, filterStatus, searchTerm]);


  // --- Helper Component: Mobile Card View ---
  const MobileOrderCard = ({ order }) => (
    <div className="bg-white shadow overflow-hidden sm:hidden p-4 rounded-lg mb-4 border border-gray-200">
      <div className="flex justify-between items-start mb-2">
        <div className="text-sm font-semibold text-indigo-600">
          Order ID: {order.id}
        </div>
        {getStatusBadge(order.status)}
      </div>
      <div className="border-t border-gray-100 pt-2 space-y-1">
        <p className="text-sm text-gray-700">
          <span className="font-medium">Customer:</span> {order.customerName}
        </p>
        <p className="text-sm text-gray-700">
          <span className="font-medium">Date:</span> {order.date}
        </p>
        <p className="text-lg font-bold text-gray-900 mt-2">
          Total: ${order.total.toFixed(2)}
        </p>
        <button 
          onClick={() => alert(`Viewing details for ${order.id}`)}
          className="mt-2 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
        >
          View Details &rarr;
        </button>
      </div>
    </div>
  );

  // --- Main Component Render ---

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-indigo-700 mb-6">
          🛍️ Customer Order Management
        </h2>

        {/* --- Filters and Search Bar --- */}
        <div className="bg-white shadow rounded-lg p-4 mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Search Input */}
          <div className="md:col-span-2">
            <input
              type="text"
              placeholder="Search by Order ID or Customer Name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md bg-white focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="All">Filter by Status: All</option>
              <option value="Pending">Pending</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* --- Orders List --- */}
        <div className="w-full">
          {filteredOrders.length === 0 ? (
            <div className="text-center p-10 bg-white rounded-lg shadow">
              <p className="text-xl text-gray-500">No orders found matching your criteria.</p>
            </div>
          ) : (
            <>
              {/* Desktop Table View (Visible on sm and up) */}
              <div className="hidden sm:block overflow-x-auto bg-white shadow rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">{order.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.customerName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">${order.total.toFixed(2)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(order.status)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button 
                            onClick={() => alert(`Preparing delivery for ${order.id}`)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Prepare Delivery
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View (Visible only on screens smaller than sm) */}
              <div className="sm:hidden space-y-4">
                {filteredOrders.map((order) => (
                  <MobileOrderCard key={order.id} order={order} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewCustomerOrder;