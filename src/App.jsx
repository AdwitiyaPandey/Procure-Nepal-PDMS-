import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/get-started" element={<GetStarted />} />
        <Route path="/signup/buyer" element={<SignupBuyer />} />
        <Route path="/signup/supplier" element={<SignupSupplier />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/request-quote/:id" element={<RequestQuote />} />
        <Route path="/login" element={<Login />} />
        <Route path="/contact-seller/:id" element={<RequestQuote />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
