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
    <div className='font-poppin flex flex-col h-full justify-center mx-5 md:mx-0 items-center md:gap-[50px] md:flex-row lg:gap-[150px]'>
        <div className='w-[90vw] md:w-[50vw] lg:w-[30vw] my-auto mb-10 md:mb-0 mt-0'>
        <img src={c1} alt="not found" className='my-auto'/>
        </div>
        <div className='my-auto w-full md:w-1/3 lg:w-1/4'>
            <div className='flex w-[160px] justify-between rounded-full border border-1 border-[#59E296] py-2 px-3'>
                <div>
                    <img src={c2} alt="not found" />
                </div>
                <div className='my-auto text-md font-medium'>Securewatch</div>
            </div>
            <div className='font-bold text-lg mt-10'>Verify your email</div>
            <div className='mt-4'>Veification email was sent to prashantd049@gmail.com</div>
            <div className='mt-4'>Complete the verification steps provided in the email unlock all SecureWatch features.</div>
            <div className='mt-4'>
                <span>Still no email? 
                    </span>
                    <span className='cursor-pointer text-[#28AA61]'>&nbsp; Send again</span>
                    <span>&nbsp;
                    in 30 sec</span>
            </div>
            <div className='mt-4'>
                <span className='cursor-pointer text-[#28AA61]'>Sign in now</span>
                <span>&nbsp; with a different email</span>
            </div>
        </div>
    </div>
  )
}

export default Verify
