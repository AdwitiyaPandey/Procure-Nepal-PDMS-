import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './AuthContext'
import Landing from './component/pages/Landing'
import GetStarted from './component/pages/GetStarted'
import AdminDashboard from './component/pages/AdminDashboard'
import SearchResults from './component/pages/SearchResults'
import RequestQuote from './component/pages/RequestQuote'
import Favourites from './component/pages/Favourites'
import React from 'react' 
import Landingbanner from './component/Landingbanner'
import Login from './component/Login'
import Register from './component/Register'
import SupplierDashboard from './component/SupplierDashboard'
import ForgotPassword from './component/pages/ForgotPassword'
import SellerRegistered from './component/pages/SellerRegistered'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/seller-register" element={<GetStarted />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/request-quote/:id" element={<RequestQuote />} />
          <Route path="/contact-seller/:id" element={<RequestQuote />} />
          <Route path="/favourites" element={<Favourites />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/supplier-dashboard" element={<SupplierDashboard />} />
          <Route path="/seller-registered" element={<SellerRegistered />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App

// Commit: 2026-01-29 Ujjwal
