import React, { useState } from 'react';

const SellerRegistrationRequest = () => {
  
  const [formData, setFormData] = useState({
    pan: '',
    businessName: '',
    businessAddress: '',
    vatId: '', 
    contactName: '',
    contactEmail: '',
  });
  
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    
   
    if (!formData.pan || !formData.businessName) {
        setError('Please fill in all required fields.');
        setLoading(false);
        return;
    }
    
  
    if (formData.vatId) {
       
        const vatRegex = /^\d{9}$/; 
        if (!vatRegex.test(formData.vatId)) {
            setError('VAT ID must be a unique 9-digit number.');
            setLoading(false);
            return;
        }
    }

    try {
      
      const response = await fetch('/api/seller-registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Registration failed. Please try again.');
      }

      
      const result = await response.json();
      alert(`Registration Successful! Application ID: ${result.applicationId}`); 
     
      
      setFormData({ pan: '', businessName: '', businessAddress: '', vatId: '', contactName: '', contactEmail: '' });

    } catch (err) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white shadow-xl rounded-lg p-8">
        <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">
          🛍️ Seller Account Registration
        </h2>
        <p className="text-center text-gray-500 mb-8">
          Submit your business information to apply for a verified seller account.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Section 1: Business and PAN Information (Critical) */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Business Details</h3>
            
            {/* Responsive Grid for 2 Columns on medium screens and up */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* PAN Number (Required and Primary Key) */}
              <div className="col-span-1">
                <label htmlFor="pan" className="block text-sm font-medium text-gray-700">
                  PAN Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="pan"
                  id="pan"
                  value={formData.pan}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border"
                  placeholder="ABCDE1234F"
                  maxLength="10" 
                />
              </div>

              {/* Business Name */}
              <div className="col-span-1">
                <label htmlFor="businessName" className="block text-sm font-medium text-gray-700">
                  Business Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="businessName"
                  id="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border"
                  placeholder="Pvt. Ltd., LLP, etc."
                />
              </div>

              {/* 5. VAT ID */}
              <div className="col-span-1">
                <label htmlFor="vatId" className="block text-sm font-medium text-gray-700">
                  VAT ID (9-Digit Unique ID)
                </label>
                <input
                  type="text"
                  name="vatId"
                  id="vatId"
                  value={formData.vatId}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border"
                  placeholder="123456789"
                  maxLength="9" // Set max length to 9 digits for user input
                />
              </div>

              {/* Business Address (Full width for better input experience) */}
              <div className="md:col-span-2">
                <label htmlFor="businessAddress" className="block text-sm font-medium text-gray-700">
                  Business Address
                </label>
                <textarea
                  name="businessAddress"
                  id="businessAddress"
                  rows="3"
                  value={formData.businessAddress}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border"
                  placeholder="Street, City, State, Pincode"
                ></textarea>
              </div>
            </div>
          </div>
          
          {/* Section 2: Contact Information */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Primary Contact</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Contact Person Name */}
              <div className="col-span-1">
                <label htmlFor="contactName" className="block text-sm font-medium text-gray-700">
                  Contact Person Name
                </label>
                <input
                  type="text"
                  name="contactName"
                  id="contactName"
                  value={formData.contactName}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border"
                  placeholder="John Doe"
                />
              </div>

              {/* Contact Email */}
              <div className="col-span-1">
                <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">
                  Contact Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="contactEmail"
                  id="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 border"
                  placeholder="contact@business.com"
                />
              </div>
            </div>
          </div>

          {/* Error and Submission */}
          {error && (
            <div className="p-3 text-sm font-medium text-red-700 bg-red-100 rounded-md">
              Error: {error}
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className={`py-3 px-6 border border-transparent rounded-md shadow-sm text-lg font-medium text-white transition duration-150 ease-in-out ${
                loading
                  ? 'bg-indigo-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
              }`}
            >
              {loading ? 'Submitting...' : 'Submit Registration Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SellerRegistrationRequest;