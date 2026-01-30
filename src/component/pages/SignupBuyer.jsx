import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';

function SignupBuyer() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullname: '',
    email: '',
    phone: '',
    password: '',
    profilePhoto: null,
  });
  const [loading, setLoading] = useState(false);

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
    setLoading(true);

    const payload = {
      name: form.fullname,
      email: form.email,
      phone: form.phone,
      password: form.password,
      role: 'buyer'
    };

    try {
      
      const res = await axios.post('http://localhost:5000/api/auth/register', payload);
      
      toast.success('Account created!');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  return (
   <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-8">
  <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
    {/* Decorative Header Bar */}
    <div className="h-2 bg-gradient-to-r from-green-500 to-blue-600"></div>

    <div className="p-6 md:p-10">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Buyer Signup</h2>
        <p className="text-gray-500 mt-2 text-sm">Create your account to start sourcing products.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 gap-5">
          {/* Full Name */}
          <div className="group">
            <label className="block mb-1.5 text-sm font-semibold text-gray-700 group-focus-within:text-blue-600 transition-colors">
              Full name
            </label>
            <input 
              name="fullname" 
              value={form.fullname} 
              onChange={handleChange} 
              placeholder="Enter your full name"
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400" 
            />
          </div>

          {/* Email */}
          <div className="group">
            <label className="block mb-1.5 text-sm font-semibold text-gray-700 group-focus-within:text-blue-600 transition-colors">
              Email Address
            </label>
            <input 
              type="email" 
              name="email" 
              value={form.email} 
              onChange={handleChange} 
              placeholder="example@mail.com"
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400" 
            />
          </div>

          {/* Phone */}
          <div className="group">
            <label className="block mb-1.5 text-sm font-semibold text-gray-700 group-focus-within:text-blue-600 transition-colors">
              Phone number
            </label>
            <input 
              type="tel" 
              name="phone" 
              value={form.phone} 
              onChange={handleChange} 
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" 
              placeholder="e.g., +9779800xxxxx" 
            />
          </div>

          {/* Password */}
          <div className="group">
            <label className="block mb-1.5 text-sm font-semibold text-gray-700 group-focus-within:text-blue-600 transition-colors">
              Password
            </label>
            <input 
              type="password" 
              name="password" 
              value={form.password} 
              onChange={handleChange} 
              placeholder="••••••••"
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" 
            />
          </div>

          {/* Profile Photo */}
          <div>
            <label className="block mb-1.5 text-sm font-semibold text-gray-700">
              Profile photo <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-200 border-dashed rounded-xl hover:border-blue-400 transition-colors bg-gray-50/50">
              <div className="space-y-1 text-center">
                <div className="flex text-sm text-gray-600">
                  <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                    <span className="px-2 py-1">Upload a file</span>
                    <input type="file" accept="image/*" name="profilePhoto" onChange={handleChange} className="sr-only" />
                  </label>
                  <p className="pl-1 pt-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-6">
          <button className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold py-3 px-4 rounded-xl shadow-md shadow-blue-200 active:scale-95 transition-all">
            Submit & Upload
          </button>
          <button 
            type="button" 
            onClick={() => navigate(-1)} 
            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-all"
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

export default SignupBuyer;