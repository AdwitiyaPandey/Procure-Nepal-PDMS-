import React, { useState } from 'react';


const STATUSES = {
  ACTIVE: 'Active',
  DEACTIVATED: 'Deactivated',
  PENDING_TERMINATION: 'Pending Termination',
  TERMINATED: 'Terminated',
  PENDING_REVIEW: 'Pending Review'
};

const SellerAccountStatus = () => {
  
  const [currentStatus, setCurrentStatus] = useState(STATUSES.ACTIVE);
  
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  
  const [showTerminateModal, setShowTerminateModal] = useState(false);

 

  const getStatusColor = (status) => {
    switch (status) {
      case STATUSES.ACTIVE:
        return 'bg-green-100 text-green-800';
      case STATUSES.DEACTIVATED:
        return 'bg-yellow-100 text-yellow-800';
      case STATUSES.PENDING_TERMINATION:
      case STATUSES.TERMINATED:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };


  const handleStatusChange = async (newStatus) => {
    
    if (currentStatus === newStatus || loading) return;

    setLoading(true);
    setMessage('');

    try {
      
      console.log(`Sending request to change status to: ${newStatus}`);
      await new Promise(resolve => setTimeout(resolve, 1500)); 

      
      setCurrentStatus(newStatus);
      setMessage(`Account successfully set to ${newStatus}.`);

    } catch (error) {
      setMessage('Error updating status. Please try again.');
      console.error('Status Update Error:', error);
    } finally {
      setLoading(false);
      setShowTerminateModal(false);
    }
  };
  
  
  const TerminationModal = () => (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
      <div className="relative bg-white rounded-lg shadow-xl max-w-lg w-full m-4 p-6">
        <h3 className="text-2xl font-bold text-red-600 mb-4">
          ⚠️ Confirm Account Termination
        </h3>
        <p className="text-gray-700 mb-6">
          Are you absolutely sure you want to terminate your account? This action is usually irreversible and will stop all product distribution activities immediately.
        </p>
        
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => setShowTerminateModal(false)}
            className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 transition duration-150"
          >
            Cancel
          </button>
          <button
            onClick={() => handleStatusChange(STATUSES.TERMINATED)}
            disabled={loading}
            className={`py-2 px-4 rounded-md shadow-sm text-sm font-medium text-white transition duration-150 ${
                loading ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {loading ? 'Processing...' : 'Yes, Terminate Account'}
          </button>
        </div>
      </div>
    </div>
  );

 

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-3xl mx-auto bg-white shadow-2xl rounded-xl overflow-hidden">
        
        {/* Header Section */}
        <div className="p-6 border-b border-gray-200 bg-indigo-50">
          <h2 className="text-3xl font-extrabold text-indigo-800">
            📊 Account Status Management
          </h2>
          <p className="mt-1 text-gray-600">
            Control the operational status of your seller account in the distribution system.
          </p>
        </div>

        {/* Current Status Display */}
        <div className="p-6 sm:p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Current Status
          </h3>
          <div className={`inline-flex items-center px-4 py-2 rounded-full text-lg font-bold ${getStatusColor(currentStatus)} transition duration-300 ease-in-out`}>
            {currentStatus}
          </div>
          
          <p className="mt-4 text-sm text-gray-500">
            {currentStatus === STATUSES.ACTIVE && "Your account is fully operational. Your products are visible and available for distribution."}
            {currentStatus === STATUSES.DEACTIVATED && "Your account is temporarily deactivated. Your products are hidden, but your data is safe. You can reactivate anytime."}
            {currentStatus === STATUSES.TERMINATED && "Your account has been terminated. Please contact support if you believe this is an error."}
            {(currentStatus === STATUSES.PENDING_TERMINATION || currentStatus === STATUSES.PENDING_REVIEW) && "A status change request is currently being processed."}
          </p>

          {/* Success/Error Message */}
          {message && (
             <div className={`mt-4 p-3 rounded-md text-sm ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                {message}
             </div>
          )}
        </div>

        {/* Action Buttons Section */}
        <div className="p-6 sm:p-8 border-t border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-4">
            
          {/* Activate Button */}
          <button
            onClick={() => handleStatusChange(STATUSES.ACTIVE)}
            disabled={loading || currentStatus === STATUSES.ACTIVE || currentStatus === STATUSES.TERMINATED}
            className={`w-full py-3 px-4 rounded-lg text-lg font-medium transition duration-200 ${
              currentStatus === STATUSES.ACTIVE || currentStatus === STATUSES.TERMINATED
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700 shadow-md'
            }`}
          >
            Activate Account
          </button>

          {/* Deactivate Button */}
          <button
            onClick={() => handleStatusChange(STATUSES.DEACTIVATED)}
            disabled={loading || currentStatus === STATUSES.DEACTIVATED || currentStatus === STATUSES.TERMINATED}
            className={`w-full py-3 px-4 rounded-lg text-lg font-medium transition duration-200 ${
              currentStatus === STATUSES.DEACTIVATED || currentStatus === STATUSES.TERMINATED
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-yellow-600 text-white hover:bg-yellow-700 shadow-md'
            }`}
          >
            Deactivate
          </button>
          
          {/* Terminate Button */}
          <button
            onClick={() => setShowTerminateModal(true)}
            disabled={loading || currentStatus === STATUSES.TERMINATED}
            className={`w-full py-3 px-4 rounded-lg text-lg font-medium transition duration-200 ${
              currentStatus === STATUSES.TERMINATED
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-red-600 text-white hover:bg-red-700 shadow-md'
            }`}
          >
            Terminate Account
          </button>
        </div>
      </div>
      
      {/* Render Termination Modal */}
      {showTerminateModal && <TerminationModal />}
    </div>
  );
};

export default SellerAccountStatus;