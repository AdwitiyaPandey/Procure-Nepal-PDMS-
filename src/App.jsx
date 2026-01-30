import './App.css'

import { toast, Toaster } from "react-hot-toast";
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './AuthContext'
import Landing from './component/pages/Landing'
import SignupBuyer from './component/pages/SignupBuyer'
import SignupSupplier from './component/pages/SignupSupplier'
import AdminDashboard from './component/pages/AdminDashboard'
import SearchResults from './component/pages/SearchResults'
import RequestQuote from './component/pages/RequestQuote'
import React from 'react' 

import Login from './component/Login'

import ForgetPassword from './component/ForgetPassword'
import SupplierDashboard from './component/SupplierDashboard'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>

      <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          draggable
          theme="light"
        />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/register" element={<SignupBuyer />} />
          <Route path="/signup/supplier" element={<SignupSupplier />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/request-quote/:id" element={<RequestQuote />} />
          <Route path="/login" element={<Login />} />

          <Route path="/forget-password" element= {<ForgetPassword />} />
          <Route path="/contact-seller/:id" element={<RequestQuote />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/supplier-dashboard" element={<SupplierDashboard />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
