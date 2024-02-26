import React from 'react'
import c2 from '../images/ellipse.png'

function Footer() {
  return (
    <div className='flex justify-center md:justify-between flex-col md:flex-row px-5 bg-black py-10 w-full'>
      <div className='flex w-[160px] justify-between mx-auto md:mx-0 rounded-full border border-1 border-[#59E296] py-2 px-3'>
                <div>
                    <img src={c2} alt="not found" />
                </div>
                <div className='my-auto text-md font-medium text-white'>Securewatch</div>
            </div>
        <div className='text-white my-auto text-center'>All Rights Reserved. © Copyright 2023. SecureWatch - LLC</div>
    </div>
  )
}

export default Footer
