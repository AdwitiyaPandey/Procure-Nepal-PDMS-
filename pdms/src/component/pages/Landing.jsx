import React from 'react'
import Landingbanner from '../Landingbanner'

function Landing() {
  return (
    <>
    <section className=' w-full  '>
        <div className="landing-container flex justify-between items-center px-20  bg-blue-100">

            <div className="logo-2 p-2">
                <img width={50} src="https://img.freepik.com/free-vector/bird-colorful-gradient-design-vector_343694-2506.jpg?semt=ais_hybrid&w=740&q=80" alt="" />
            </div>

            <div className="search flex gap-1">
                <input className=' border rounded py-1  w-140  text-black' type="text" placeholder="Enter your product name........" />
                <button className=' bg-green-600 p-1  text-lime-50'> Search <i class="bi bi-search"></i></button> 
            </div>


            <div className="navbar m-2">

                  <ul className='flex gap-8  font-semibold'>
                    <li><i class="bi text-2xl font-bold  bi-box-arrow-in-right"></i> <br />
                        <a href="#">sign in</a></li>
                    <li>
                        <i class="bi text-2xl font-bold bi-tags"></i><br />
                        <a href="#">sell</a></li>
                    <li><i class="bi text-2xl  bi-archive-fill"></i><br />
                        <a href="#">categories</a></li>
                    <li>
                        <i class="bi text-2xl bi-person-raised-hand"></i>
                        <br /><a href="#">help</a></li>    
            
           </ul>
            </div>

         
        </div>




    </section>
   
   <Landingbanner/>
      
    </>
  )
}

export default Landing
