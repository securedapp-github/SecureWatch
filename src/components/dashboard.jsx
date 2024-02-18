import React from 'react'
import Navbar1 from './navbar1'

function dashboard() {
  return (
    <div className='mt-10'>
      <Navbar1/>
      <div className='flex justify-around mt-10'>
        <div className='flex'>
            <div className='text-3xl text-[#0CA851] font-bold bg-[#A7FFCE] p-2 rounded-lg' >SecureWatch Org</div>
            <div className='my-auto'>
            <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_180_3184)">
<path d="M9.5809 3.53229H3.48412C3.02213 3.53229 2.57906 3.71581 2.25239 4.04249C1.92571 4.36916 1.74219 4.81223 1.74219 5.27422V17.4678C1.74219 17.9298 1.92571 18.3728 2.25239 18.6995C2.57906 19.0262 3.02213 19.2097 3.48412 19.2097H15.6777C16.1397 19.2097 16.5827 19.0262 16.9094 18.6995C17.2361 18.3728 17.4196 17.9298 17.4196 17.4678V11.371" stroke="#0CA851" stroke-width="1.39355" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M16.112 2.22584C16.4585 1.87935 16.9284 1.68469 17.4184 1.68469C17.9084 1.68469 18.3784 1.87935 18.7249 2.22584C19.0714 2.57233 19.266 3.04228 19.266 3.53229C19.266 4.02231 19.0714 4.49225 18.7249 4.83875L10.4507 13.1129L6.9668 13.9839L7.83776 10.5L16.112 2.22584Z" stroke="#0CA851" stroke-width="1.39355" stroke-linecap="round" stroke-linejoin="round"/>
</g>
<defs>
<clipPath id="clip0_180_3184">
<rect width="20.9032" height="20.9032" fill="white" transform="translate(0 0.0484009)"/>
</clipPath>
</defs>
</svg>

            </div>
        </div>
        <div className='flex'>
            <div className='my-auto'>
            <span className='text-[#0CA851] font-bold text-xl'>Tenant ID </span>
            <span>#833f1c5e...</span>
            </div>
            <div className='my-auto'>
            <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M20.1289 9.5H11.1289C10.0243 9.5 9.12891 10.3954 9.12891 11.5V20.5C9.12891 21.6046 10.0243 22.5 11.1289 22.5H20.1289C21.2335 22.5 22.1289 21.6046 22.1289 20.5V11.5C22.1289 10.3954 21.2335 9.5 20.1289 9.5Z" stroke="#434343" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M5.12891 15.5H4.12891C3.59847 15.5 3.08977 15.2893 2.71469 14.9142C2.33962 14.5391 2.12891 14.0304 2.12891 13.5V4.5C2.12891 3.96957 2.33962 3.46086 2.71469 3.08579C3.08977 2.71071 3.59847 2.5 4.12891 2.5H13.1289C13.6593 2.5 14.168 2.71071 14.5431 3.08579C14.9182 3.46086 15.1289 3.96957 15.1289 4.5V5.5" stroke="#434343" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

            </div>
        </div>
      </div>
      <div className='flex justify-center gap-10 mt-10'>
    <div className='p-3 rounded-md' style={{border:'1px solid #C9C9C9'}}>
        <div className='text-start'>Deploy</div>
        <div className='flex mt-5'>
            <span className='text-5xl mr-10'>04</span>
            <span>
                <div>CHECK</div>
                <div>DEPLOYED CONTRACT</div>
            </span>
            <span><svg width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_167_85)">
<path d="M9.76833 16.654H23.0754" stroke="black" stroke-width="1.88191" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M16.4219 10.0004L23.0754 16.654L16.4219 23.3075" stroke="black" stroke-width="1.88191" stroke-linecap="round" stroke-linejoin="round"/>
</g>
<defs>
<clipPath id="clip0_167_85">
<rect width="22.5829" height="22.5829" fill="white" transform="translate(16.4219 0.685921) rotate(45)"/>
</clipPath>
</defs>
</svg>
</span>
        </div>
    </div>
    <div className='p-3 rounded-md' style={{border:'1px solid #C9C9C9'}}>
        <div className='text-start'>Access Control</div>
        <div className='flex mt-5'>
            <span className='text-5xl mr-10'>00</span>
            <span>
                <div>CHECK</div>
                <div>MANAGED CONTRACT</div>
            </span>
            <span><svg width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_167_85)">
<path d="M9.76833 16.654H23.0754" stroke="black" stroke-width="1.88191" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M16.4219 10.0004L23.0754 16.654L16.4219 23.3075" stroke="black" stroke-width="1.88191" stroke-linecap="round" stroke-linejoin="round"/>
</g>
<defs>
<clipPath id="clip0_167_85">
<rect width="22.5829" height="22.5829" fill="white" transform="translate(16.4219 0.685921) rotate(45)"/>
</clipPath>
</defs>
</svg>
</span>
        </div>
    </div>
    <div className='p-3 rounded-md' style={{border:'1px solid #C9C9C9'}}>
        <div className='text-start'>Monitor</div>
        <div className='flex mt-5'>
            <span className='text-5xl mr-10'>02</span>
            <span>
                <div>CHECK</div>
                <div>ACTIVE MONITOR</div>
            </span>
            <span><svg width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_167_85)">
<path d="M9.76833 16.654H23.0754" stroke="black" stroke-width="1.88191" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M16.4219 10.0004L23.0754 16.654L16.4219 23.3075" stroke="black" stroke-width="1.88191" stroke-linecap="round" stroke-linejoin="round"/>
</g>
<defs>
<clipPath id="clip0_167_85">
<rect width="22.5829" height="22.5829" fill="white" transform="translate(16.4219 0.685921) rotate(45)"/>
</clipPath>
</defs>
</svg>
</span>
        </div>
    </div>
      </div>
      <div className='flex justify-center gap-10 mt-10'>
    <div className='p-3 rounded-md' style={{border:'1px solid #C9C9C9'}}>
        <div className='text-start'>Incident Response</div>
        <div className='flex mt-5'>
            <span className='text-5xl mr-10'>02</span>
            <span>
                <div>CHECK</div>
                <div>ACTIVE SCENARIOS</div>
            </span>
            <span><svg width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_167_85)">
<path d="M9.76833 16.654H23.0754" stroke="black" stroke-width="1.88191" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M16.4219 10.0004L23.0754 16.654L16.4219 23.3075" stroke="black" stroke-width="1.88191" stroke-linecap="round" stroke-linejoin="round"/>
</g>
<defs>
<clipPath id="clip0_167_85">
<rect width="22.5829" height="22.5829" fill="white" transform="translate(16.4219 0.685921) rotate(45)"/>
</clipPath>
</defs>
</svg>
</span>
        </div>
    </div>
    <div className='p-3 rounded-md' style={{border:'1px solid #C9C9C9'}}>
        <div className='text-start'>Actions</div>
        <div className='flex mt-5'>
            <div className='flex mr-10'>
            <span className='text-5xl mr-2'>02</span>
            <span>
                <div>ACTIVE</div>
                <div>ACTIONS</div>
            </span>
            </div>
            <div className='flex'>
            <span className='text-5xl mr-2'>02</span>
            <span>
                <div>PENDING</div>
                <div>TX PROPOSALS</div>
            </span>
            </div>
            <span><svg width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_167_85)">
<path d="M9.76833 16.654H23.0754" stroke="black" stroke-width="1.88191" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M16.4219 10.0004L23.0754 16.654L16.4219 23.3075" stroke="black" stroke-width="1.88191" stroke-linecap="round" stroke-linejoin="round"/>
</g>
<defs>
<clipPath id="clip0_167_85">
<rect width="22.5829" height="22.5829" fill="white" transform="translate(16.4219 0.685921) rotate(45)"/>
</clipPath>
</defs>
</svg>
</span>
        </div>
    </div>
      </div>
      <div className='p-3 rounded-md  mt-10 w-3/4  mx-auto' style={{border:'1px solid #C9C9C9'}}>
        <div className='text-start'>Code</div>
        <div className='flex mt-5 justify-evenly'>
            <div className='flex mr-10'>
            <span className='text-5xl mr-2'>02</span>
                <div className='my-auto text-3xl'>SUCCESSFULL REPORT</div>
            </div>
            <div className='flex'>
            <span className='text-3xl mr-2'>00</span>
            <span>
                <div className='text-base'>CRITICAL FINDINGS</div>
                <div className='text-base'>TO RESOLVE</div>
            </span>
            </div>
            <div className='flex'>
            <span className='text-3xl mr-2'>00</span>
            <span>
                <div className='text-base'>HIGH FINDINGS</div>
                <div className='text-base'>TO RESOLVE</div>
            </span>
            </div>
            <div className='flex'>
            <span className='text-3xl mr-2'>00</span>
            <span>
                <div className='text-base'>MEDIUM FINDINGS</div>
                <div className='text-base'>TO RESOLVE</div>
            </span>
            </div>
            <div className='flex'>
            <span className='text-3xl mr-2'>00</span>
            <span>
                <div className='text-base'>LOW FINDINGS</div>
                <div className='text-base'>TO RESOLVE</div>
            </span>
            </div>
            <span><svg width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_167_85)">
<path d="M9.76833 16.654H23.0754" stroke="black" stroke-width="1.88191" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M16.4219 10.0004L23.0754 16.654L16.4219 23.3075" stroke="black" stroke-width="1.88191" stroke-linecap="round" stroke-linejoin="round"/>
</g>
<defs>
<clipPath id="clip0_167_85">
<rect width="22.5829" height="22.5829" fill="white" transform="translate(16.4219 0.685921) rotate(45)"/>
</clipPath>
</defs>
</svg>
</span>
        </div>
    </div>
    </div>
  )
}

export default dashboard
