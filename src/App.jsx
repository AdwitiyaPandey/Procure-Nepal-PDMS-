import './App.css'
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
          <Route path="/seller-register" element={<GetStarted />} />
          <Route path="/signup/buyer" element={<SignupBuyer />} />
          <Route path="/signup/supplier" element={<SignupSupplier />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/request-quote/:id" element={<RequestQuote />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/contact-seller/:id" element={<RequestQuote />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/supplier-dashboard" element={<SupplierDashboard />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
