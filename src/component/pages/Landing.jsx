import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Landingbanner from '../Landingbanner'

function Landing() {
    const [query, setQuery] = useState('')
    const navigate = useNavigate()

    function handleSearch(e) {
        e.preventDefault()
        const q = query.trim()
        navigate(`/search?q=${encodeURIComponent(q)}`)
    }

    return (
        <>
            <section className='w-full'>
                <div className="landing-container flex justify-between items-center px-20 bg-blue-100">
                    <div className="logo-2 p-2">
                        <img width={50} src="https://img.freepik.com/free-vector/bird-colorful-gradient-design-vector_343694-2506.jpg?semt=ais_hybrid&w=740&q=80" alt="logo" />
                    </div>

                    <form onSubmit={handleSearch} className="search flex gap-1">
                        <input value={query} onChange={e => setQuery(e.target.value)} className='border rounded p-3 w-140 text-black' type="text" placeholder="Enter your product name........" />
                        <button type="submit" className='bg-green-600 p-1 text-lime-50'> Search <i className="bi bi-search"></i></button>
                    </form>

                    <div className="navbar m-2">
                        <ul className='flex gap-8 font-semibold'>
                            <li>
                                <Link to="/get-started" className="flex items-center gap-2">
                                    <i className="bi text-2xl font-bold bi-box-arrow-in-right"></i>
                                    <span>Get Started</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/signup/supplier" className="flex items-center gap-2">
                                    <i className="bi text-2xl font-bold bi-tags"></i>
                                    <span>Sell</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/login" className="flex items-center gap-2">
                                    <i className="bi text-2xl bi-box-arrow-in-right"></i>
                                    <span>Login</span>
                                </Link>
                            </li>
                            <li>
                                <a href="#" className="flex items-center gap-2"><i className="bi text-2xl bi-archive-fill"></i><span>Categories</span></a>
                            </li>
                            <li>
                                <a href="#" className="flex items-center gap-2"><i className="bi text-2xl bi-person-raised-hand"></i><span>Help</span></a>
                            </li>
                        </ul>
                    </div>

                    {/* <div className="cta ml-4">
                        <Link to="/get-started" className='bg-green-600 text-white px-4 py-2 rounded font-semibold'>Get Started</Link>
                    </div> */}
                </div>
            </section>

            <Landingbanner />
        </>
    )
}

export default Landing
