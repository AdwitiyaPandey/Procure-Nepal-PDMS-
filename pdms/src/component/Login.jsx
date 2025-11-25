import React from 'react'

function Login() {
  return (
    <>
    <section className=" flex  w-[100%] h-[100%] gap-20  items-center justify-aroun ">

<div className="left-banner w-[50%]  mt-20 h-screen ">
    <img className='img-1 w-1000 h-230'  src="https://media.istockphoto.com/id/1484852942/photo/smart-warehouse-inventory-management-system-concept.jpg?s=612x612&w=0&k=20&c=q5hzpG2i4A7iVLT7sseXdKIsVxClkLJrUlLsZJNIGMs=" alt="" />

</div>


<div className=" right_banner w-[50%] my-auto  h-screen flex flex-col justify-center items-center ">
    <h1 className='text-9xl font-bold text-center mb-10'>Login</h1>
    <form className='flex flex-col gap-4'>
      <h3 className='text-left text-2xl mt-2'>Username:</h3>
        <input className='p-2 border border-gray-300 text-2xl text-white rounded bg-black' type="text" placeholder='Username' />
        <h3 className='text-left text-2xl mt-4'>Password:</h3>
        <input className='p-2 border border-gray-300  text-2xl rounded bg-black text-white' type="password" placeholder='Password' />

        <button className='bg-black text-white p-2  text-2xl rounded hover:bg-black-600 transition'>Login</button>
      
       <p className='mt-4 text-2xl'> Not registered yet? <a href="#" className='text-red-500 hover:underline'> Create a new account</a></p>   

    </form>
</div>




</section>
    </>
  )
}

export default Login
