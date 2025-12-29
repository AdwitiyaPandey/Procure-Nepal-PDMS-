import React from 'react'

function Login() {
  return (
    <>
    <span className='flex w-[100%] h-20 border-b'></span>
    <section className=" flex  w-[100%] h-[100%] gap-70  items-center justify-around bg-gray-100">

<div className=" right_banner w-[50%]  flex flex-col justify-center items-center ">
    <h1 className='text-9xl font-bold text-center mb-10'>Login</h1>
    <form className='flex flex-col gap-1'>
      <h3 className='text-left text-2xl mt-2 font-extrabold'>Email<a className='text-red-500'>*</a></h3>
        <input className='p-2 border border-gray-300 text-2xl text-white rounded bg-black' type="text" placeholder='Enter your email' />
        <h3 className='text-left text-2xl mt-4 font-extrabold'>Password<a className='text-red-500'>*</a></h3>
        <input className='p-2 border border-gray-300  text-2xl rounded bg-black text-white mb-20' type="password" placeholder='********' />

        <button className='bg-black text-white p-2  text-2xl rounded hover:bg-black-600 transition font-extrabold cursor-pointer'>Login</button>
      
       <p className='mt-4 text-2xl font-semibold'> Not registered yet? <a href="#" className='text-red-500 hover:underline font-semibold'> Create a new account</a></p>   

    </form>
</div>

<div className="left-banner w-[50%] ">
    <p className="w-[50%]   h-screen flex flex-col justify-center items-center text-[100px] font-extrabold">ProCuRe NePaL</p>

</div>







</section>
    </>
  )
}

export default Login
