import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import { toast, Toaster } from 'react-hot-toast';
import axios from 'axios';

function SignupSupplier() {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    fullname: user?.name || '',
    email: user?.email || '',
    companyName: '',
    pan: '',
    vat: '',
    turnover: '',
    established: '',
    citizenship: null,
    profilePhoto: null,
  });

  // Redirect if not logged in (only buyers can upgrade)
  useEffect(() => {
    if (!user) {
      toast.error("Please login as a buyer first");
      navigate('/login');
    }
  }, [user, navigate]);

  function handleChange(e) {
    const { name, value, files } = e.target;
    if (files) {
      setForm((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.companyName || !form.pan || !form.established) {
      toast.error('Please fill in business details and PAN');
      return;
    }

    setLoading(true);
    const fd = new FormData();
    fd.append('fullname', form.fullname);
    fd.append('email', form.email);
    fd.append('companyName', form.companyName);
    fd.append('pan', form.pan);
    fd.append('vat', form.vat);
    fd.append('turnover', form.turnover);
    fd.append('established', form.established);
    if (form.citizenship) fd.append('citizenship', form.citizenship);
    if (form.profilePhoto) fd.append('profilePhoto', form.profilePhoto);

    try {
      const res = await axios.post('http://localhost:5000/api/upgrade-to-seller', fd);
      
      if (res.data.ok) {
        toast.success('Application submitted! Awaiting admin approval.');
        login(res.data.user); // Update local role to 'seller'
        setTimeout(() => navigate('/'), 2000);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center px-4 py-12">
      <Toaster position="top-center" />
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10">
          
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center mx-auto mb-4 text-white">
              <i className="bi bi-briefcase text-2xl"></i>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Seller Application</h1>
            <p className="text-gray-600 mt-2">Verify your business to start selling wholesale</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Personal Info (Read Only) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                <input 
                  name="fullname" 
                  value={form.fullname} 
                  readOnly 
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed" 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <input 
                  name="email" 
                  value={form.email} 
                  readOnly 
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed" 
                />
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Business Info */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Company / Business Name</label>
              <input 
                name="companyName" 
                value={form.companyName} 
                onChange={handleChange} 
                placeholder="As per registration"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition-all" 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">PAN Number</label>
                <input 
                  name="pan" 
                  value={form.pan} 
                  onChange={handleChange} 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition-all" 
                />
              </div>x
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">VAT No. (Optional)</label>
                <input 
                  name="vat" 
                  value={form.vat} 
                  onChange={handleChange} 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition-all" 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Est. Annual Turnover</label>
                <input 
                  name="turnover" 
                  value={form.turnover} 
                  onChange={handleChange} 
                  placeholder="e.g. NPR 5,000,000"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition-all" 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Established Date</label>
                <input 
                  type="date" 
                  name="established" 
                  value={form.established} 
                  onChange={handleChange} 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition-all" 
                />
              </div>
            </div>

            {/* Document Uploads */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Citizenship Image</label>
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-teal-50 transition-all">
                  <i className="bi bi-card-image text-gray-400 text-xl"></i>
                  <span className="text-xs text-gray-500 mt-2">{form.citizenship ? form.citizenship.name : 'Click to upload'}</span>
                  <input type="file" name="citizenship" accept="image/*" onChange={handleChange} className="hidden" />
                </label>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Business Profile Photo</label>
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-teal-50 transition-all">
                  <i className="bi bi-person-badge text-gray-400 text-xl"></i>
                  <span className="text-xs text-gray-500 mt-2">{form.profilePhoto ? form.profilePhoto.name : 'Click to upload'}</span>
                  <input type="file" name="profilePhoto" accept="image/*" onChange={handleChange} className="hidden" />
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button 
                type="submit" 
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-bold py-3 rounded-lg shadow-lg transition-all disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Submit & Upgrade Account'}
              </button>
              <button 
                type="button" 
                onClick={() => navigate(-1)} 
                className="px-8 py-3 border border-gray-300 text-gray-600 rounded-lg font-semibold hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SignupSupplier;