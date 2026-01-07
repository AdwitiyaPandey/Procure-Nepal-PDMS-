import './App.css'

import { toast, Toaster } from "react-hot-toast";
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './AuthContext'
import Landing from './component/pages/Landing'
import GetStarted from './component/pages/GetStarted'
import SignupBuyer from './component/pages/SignupBuyer'
import SignupSupplier from './component/pages/SignupSupplier'
import AdminDashboard from './component/pages/AdminDashboard'
import SearchResults from './component/pages/SearchResults'
import RequestQuote from './component/pages/RequestQuote'
import React from 'react' 
import Landingbanner from './component/Landingbanner'
import Login from './component/Login'
import Register from './component/Register'
import ForgetPassword from './component/ForgetPassword'
import SupplierDashboard from './component/SupplierDashboard'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
      <Toaster position="top-center" />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/get-started" element={<GetStarted />} />
          <Route path="/signup/buyer" element={<SignupBuyer />} />
          <Route path="/signup/supplier" element={<SignupSupplier />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/request-quote/:id" element={<RequestQuote />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forget-password" element= {<ForgetPassword />} />
          <Route path="/contact-seller/:id" element={<RequestQuote />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/supplier-dashboard" element={<SupplierDashboard />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
