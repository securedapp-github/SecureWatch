import React,{useState} from 'react'
import c1 from '../images/backg.png'
import c2 from '../images/ellipse.png'
import { Switch } from '@headlessui/react'
import {Link} from 'react-router-dom'

function Verify() {
    const [vis,setVis]=useState('password')
    const handleToggle=()=>{
        if(vis==='password')setVis('text')
        else setVis('password')
    }
    const [enabled, setEnabled] = useState(false)
  return (
    <div className='font-poppin bg-white flex justify-center items-center flex-wrap min-h-full gap-6 md:gap-20  p-3'>
        <div className=''>
        <img src={c1} alt="not found" className='w-96'/>
        </div>
        <div className=' w-[97%] md:w-96'>
            <div className='flex w-[160px] justify-between rounded-full border border-1 border-[#59E296] py-2 px-3'>
                <div>
                    <img src={c2} alt="not found" />
                </div>
                <div className='my-auto text-md font-medium text-black'>Securewatch</div>
            </div>
            <div className='font-bold text-lg mt-10 text-black'>Verify your email</div>
            <div className='mt-4 text-black'>Veification email was sent to prashantd049@gmail.com</div>
            <div className='mt-4 text-black'>Complete the verification steps provided in the email unlock all SecureWatch features.</div>
            <div className='mt-4 text-black'>
                <span>Still no email? 
                    </span>
                    <span className='cursor-pointer text-[#28AA61]'>&nbsp; Send again</span>
                    <span>&nbsp;
                    in 30 sec</span>
            </div>
            <div className='mt-4'>
                <span className='cursor-pointer text-[#28AA61]'>Sign in now</span>
                <span className='text-black'>&nbsp; with a different email</span>
            </div>
        </div>
    </div>
  )
}

export default Verify
