import React from 'react'
import Navbar1 from './navbar1'

function monitor_activity() {
  return (
    <div className='mt-10' style={{'backgroundColor':'#FCFFFD'}}>
      <Navbar1/>
      <div className='w-4/6 mx-auto mt-20'>
        <div className='flex justify-between'>
        <div className='text-4xl font-medium'>Monitor Activity</div>
        <div><svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="44" height="44" rx="8.27511" fill="#0CA851"/>
<path d="M33 14V20H27" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M30.4899 25C29.8399 26.8399 28.6094 28.4187 26.984 29.4985C25.3586 30.5783 23.4263 31.1006 21.4783 30.9866C19.5303 30.8726 17.672 30.1286 16.1836 28.8667C14.6952 27.6047 13.6573 25.8932 13.2262 23.9901C12.7952 22.0869 12.9944 20.0952 13.7937 18.3151C14.5931 16.535 15.9494 15.0629 17.6582 14.1207C19.367 13.1784 21.3358 12.8171 23.2678 13.0912C25.1999 13.3652 26.9905 14.2598 28.3699 15.64L32.9999 20" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg></div>
        </div>
        </div>
    </div>
  )
}

export default monitor_activity
