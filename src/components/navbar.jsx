import React,{useState} from 'react'

function Navbar() {
  const [open,setOpen]=useState(false)
  return (
    <>
    <div className={`flex justify-between items-center flex-row  px-5 py-3 mx-auto w-full xl:w-4/6 rounded-full`} style={{'backgroundColor':'#303030F7'}}>
      <div className='hidden sm:flex gap-2'>
        <div><svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="18.1766" cy="18" r="17.4706" fill="#107F41"/>
</svg>
</div>
    <div className='text-white my-auto font-poppin'>Securewatch</div>
      </div>
      <div className='hidden md:flex gap-2'>
        <div className='text-white my-auto font-poppin'>SecureWatch Platform</div>
        <div className='my-auto'><svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M5.14862 5.65393L0.765086 1.2704L1.68944 0.346049L5.14862 3.80523L8.60885 0.346049L9.5332 1.2704L5.14862 5.65393Z" fill="white" fill-opacity="0.6"/>
</svg>
</div>
      </div>
      <div className='hidden md:flex gap-2'>
        <div className='text-white my-auto font-poppin'>Services</div>
        <div className='my-auto'><svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M5.14862 5.65393L0.765086 1.2704L1.68944 0.346049L5.14862 3.80523L8.60885 0.346049L9.5332 1.2704L5.14862 5.65393Z" fill="white" fill-opacity="0.6"/>
</svg>
</div>
      </div>
      <div className='hidden md:flex gap-2'>
        <div className='text-white my-auto font-poppin'>Learn</div>
        <div className='my-auto'><svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M5.14862 5.65393L0.765086 1.2704L1.68944 0.346049L5.14862 3.80523L8.60885 0.346049L9.5332 1.2704L5.14862 5.65393Z" fill="white" fill-opacity="0.6"/>
</svg>
</div>
      </div>
      <div className='hidden md:block text-white my-auto font-poppin'>Login</div>
      <div className='bg-white rounded-full px-3 py-2 font-medium font-inter'>Sign Up to Securewatch</div>
      <div className='flex md:hidden mx-2 my-auto items-center' onClick={()=>{setOpen(!open)}}>
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="absolute right-12 w-10 h-10 text-white">
  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
</svg>
    </div>
    <div className={`absolute right-2 top-32 ${open?'block':'hidden'} md:hidden bg-white rounded-lg p-5 border-2 border-[#0CA851]`}>
    <div className='flex gap-2'>
        <div className='text-black my-auto font-poppin'>SecureWatch Platform</div>
        <div className='my-auto'><svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M5.14862 5.65393L0.765086 1.2704L1.68944 0.346049L5.14862 3.80523L8.60885 0.346049L9.5332 1.2704L5.14862 5.65393Z" fill="white" fill-opacity="0.6"/>
</svg>
</div>
      </div>
      <div className='flex gap-2'>
        <div className='text-black my-auto font-poppin'>Services</div>
        <div className='my-auto'><svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M5.14862 5.65393L0.765086 1.2704L1.68944 0.346049L5.14862 3.80523L8.60885 0.346049L9.5332 1.2704L5.14862 5.65393Z" fill="white" fill-opacity="0.6"/>
</svg>
</div>
      </div>
      <div className='flex gap-2'>
        <div className='text-black my-auto font-poppin'>Learn</div>
        <div className='my-auto'><svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M5.14862 5.65393L0.765086 1.2704L1.68944 0.346049L5.14862 3.80523L8.60885 0.346049L9.5332 1.2704L5.14862 5.65393Z" fill="white" fill-opacity="0.6"/>
</svg>
</div>
      </div>
      <div className='text-black my-auto font-poppin'>Login</div> 
</div>
    </div>
    </>
  )
}

export default Navbar
