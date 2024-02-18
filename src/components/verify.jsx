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
    <div className='flex flex-col h-full justify-center items-center md:gap-[50px] md:flex-row lg:gap-[100px]'>
        <div className='w-[30vw] my-auto'>
        <img src={c1} alt="not found" className='my-auto'/>
        </div>
        <div className='my-auto w-1/4'>
            <div className='flex w-[160px] justify-between rounded-full border border-1 border-[#59E296] py-2 px-3'>
                <div>
                    <img src={c2} alt="not found" />
                </div>
                <div className='my-auto text-md font-medium'>Securewatch</div>
            </div>
            <div className='font-bold text-lg'>Verify your email</div>
            <div>Veification email was sent to prashantd049@gmail.com</div>
            <div>Complete the verification steps provided in the email unlock all SecureWatch features.</div>
            <div>
                <span>Still no email? 
                    </span>
                    <span className='cursor-pointer text-[#28AA61]'>&nbsp; Send again</span>
                    <span>&nbsp;
                    in 30 sec</span>
            </div>
            <div>
                <span className='cursor-pointer text-[#28AA61]'>Sign in now</span>
                <span>&nbsp; with a different email</span>
            </div>
        </div>
    </div>
  )
}

export default Verify
