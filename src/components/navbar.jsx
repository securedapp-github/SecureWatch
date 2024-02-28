import React from 'react'

function navbar() {
  return (
    <div className='flex flex-col justify-between items-center rounded-md xl:flex-row  px-5 py-3 mx-auto w-full sm:w-1/2 xl:w-4/6 xl:rounded-full' style={{'backgroundColor':'#303030F7'}}>
      <div className='flex gap-2'>
        <div><svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="18.1766" cy="18" r="17.4706" fill="#107F41"/>
</svg>
</div>
    <div className='text-white my-auto font-poppin'>Securewatch</div>
      </div>
      <div className='flex gap-2'>
        <div className='text-white my-auto font-poppin'>SecureWatch Platform</div>
        <div className='my-auto'><svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M5.14862 5.65393L0.765086 1.2704L1.68944 0.346049L5.14862 3.80523L8.60885 0.346049L9.5332 1.2704L5.14862 5.65393Z" fill="white" fill-opacity="0.6"/>
</svg>
</div>
      </div>
      <div className='flex gap-2'>
        <div className='text-white my-auto font-poppin'>Services</div>
        <div className='my-auto'><svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M5.14862 5.65393L0.765086 1.2704L1.68944 0.346049L5.14862 3.80523L8.60885 0.346049L9.5332 1.2704L5.14862 5.65393Z" fill="white" fill-opacity="0.6"/>
</svg>
</div>
      </div>
      <div className='flex gap-2'>
        <div className='text-white my-auto font-poppin'>Learn</div>
        <div className='my-auto'><svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M5.14862 5.65393L0.765086 1.2704L1.68944 0.346049L5.14862 3.80523L8.60885 0.346049L9.5332 1.2704L5.14862 5.65393Z" fill="white" fill-opacity="0.6"/>
</svg>
</div>
      </div>
      <div className='text-white my-auto font-poppin'>Login</div>
      <div className='bg-white rounded-md xl:rounded-full px-3 py-2 font-medium font-inter'>Sign Up to Securewatch</div>
    </div>
  )
}

export default navbar
