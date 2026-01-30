import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../AuthContext';
import { motion } from "framer-motion";

function GetStarted() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({
    fullname: '',
    email: '',
    phone: '',
    agreeToTerms: false,
    companyName: '',
    panNumber: '',
    vatNumber: '',
    citizenship: '',
    establishedDate: '',
    turnover: '',
    password: '',
    confirmPassword: '',
    pan: '',
    vat: '',
    turnover: '',
    established: '',
    citizenship: null,
    panVatDoc: null,
    profilePhoto: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 } 
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  function handleChange(e) {
    const { name, value, files } = e.target;
    if (files) {
      setForm(prev => ({ ...prev, [name]: files[0] }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
    setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.fullname || !form.email || !form.password || !form.confirmPassword || !form.companyName) {
      setError('All required fields must be filled');
      return;
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      // First register the user
      await register(
        form.fullname,
        form.email,
        form.phone,
        form.password,
        form.confirmPassword,
        'seller',
        form.profilePhoto
      );

      // Then submit supplier details
      const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';
      const token = localStorage.getItem('authToken');
      
      const formData = new FormData();
      formData.append('companyName', form.companyName);
      formData.append('pan', form.pan);
      formData.append('vat', form.vat);
      formData.append('turnover', form.turnover);
      formData.append('established', form.established);
      formData.append('citizenship', form.citizenship);
      if (form.panVatDoc) formData.append('panVatDoc', form.panVatDoc);

      await axios.post(`${API_BASE}/api/suppliers`, formData, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });

      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false)
    }
  }

  return (
  <div className="min-h-screen bg-white flex flex-col md:flex-row overflow-hidden">
      {/* Left Side - Brand Section */}
      <motion.div 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="hidden md:flex md:w-1/2 bg-black text-white flex-col justify-center items-center p-8"
      >
        <motion.img 
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          src="/src/assets/images/favicon/favicon.ico" 
          alt="ProcureNP" 
          className="h-32 w-32 mb-8" 
        />
        <p className="text-gray-300 text-lg text-center mb-8">
          Join Nepal's trusted wholesale community
        </p>
        <div className="space-y-4 text-gray-300">
          {[
            "Access to verified suppliers",
            "Competitive wholesale prices",
            "Secure transactions"
          ].map((text, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + (i * 0.2) }}
              className="flex items-center gap-3"
            >
              <i className="bi bi-check-circle text-xl text-green-500"></i>
              <span>{text}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Right Side - Registration Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-8">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md"
        >
          <motion.div variants={itemVariants} className="mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-6 md:hidden hover:opacity-70">
              <img src="/src/assets/images/favicon/favicon.ico" alt="ProcureNP" className="h-10 w-10" />
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Create Seller Account</h1>
            <p className="text-gray-600 mt-2">Sign up to start selling</p>
          </motion.div>

          {error && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg overflow-hidden"
            >
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
            {/* Wrap your inputs in motion.div with variants={itemVariants} */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
              <input 
                name="fullname"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black transition-all"
                {...otherProps}
              />
            </motion.div>

            {/* Repeat the motion.div wrapper for other fields... */}

            <motion.div variants={itemVariants} className="pt-4">
              <button 
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit" 
                disabled={loading} 
                className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-3 rounded-lg transition-colors uppercase shadow-lg"
              >
                {loading ? 'Creating Account...' : 'Create Seller Account'}
              </button>
            </motion.div>
          </form>

          <motion.p variants={itemVariants} className="text-center text-gray-600 text-sm mt-8">
            Already have an account? <Link to="/login" className="text-black hover:underline font-semibold">SIGN IN</Link>
          </motion.p>
        </motion.div>
      </div>
    </div>
  )
}

export default GetStarted
// Commit-marker: Ujjwal incremental commit

