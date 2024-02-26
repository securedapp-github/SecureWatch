import React,{useState} from 'react'
import Navbar1 from './navbar1'
import { Switch } from '@headlessui/react'


function Monitor() {
    const [enabled, setEnabled] = useState(false)
    const [disp,setDisp]=useState('block')
    const handleToggle=()=>{
        if(disp=='none')setDisp('block')
        else setDisp('none')
    }
  return (
    <div className='mt-10' style={{'backgroundColor':'#FCFFFD'}}>
      <Navbar1/>
      <div className='w-4/6 mx-auto mt-20'>
        <div className='flex justify-between'> 
        <div className='text-4xl font-medium'>Monitor (2)</div>
        <div className='flex gap-2'>
            <div className='border border-black rounded-xl font-medium px-3 py-2 my-auto'>See Monitor Activity</div>
            <div className='bg-[#0CA851] rounded-xl text-white font-medium px-7 py-2 my-auto'>Create Monitor</div>
        </div>
        </div>
      <div className='flex mt-10 justify-between w-3/5 py-3 px-5 rounded-2xl' style={{'border':'1px solid #7D7D7D'}}>
        <input type="text" className='outline-none font-medium w-4/5' placeholder='Search by name, network or address...'/>
    <div className='my-auto'>
        <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M8.00127 15.0025C11.868 15.0025 15.0025 11.868 15.0025 8.00127C15.0025 4.13457 11.868 1 8.00127 1C4.13457 1 1 4.13457 1 8.00127C1 11.868 4.13457 15.0025 8.00127 15.0025Z" stroke="#7D7D7D" stroke-width="1.7625" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M13.4254 13.4244L17.826 17.825" stroke="#7D7D7D" stroke-width="1.7625" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
</div>
</div>
<div className='mt-10 p-6 flex justify-between rounded-2xl' style={{'border':'1px solid #0CA851',boxShadow: '4px 4px 0px 0px #0CA851'
}}>
    <div>
    <div className='flex gap-3'>
    <div className='text-xl font-semibold'>First Monitor</div>
    <div className='text-[12px] mt-auto text-[#7D7D7D]'>Governance</div>
    </div>
    <div className='flex gap-4'>
        <div>
            <div className='text-center font-medium'>Networks</div>
            <div className='bg-[#0CA851] px-3 py-2 rounded-md text-[13px] my-auto text-white'>MAINNET</div>
        </div>
        <div>
            <div className='text-center font-medium'>Monitoring</div>
            <div className='bg-[#E9E9E9] px-3 py-2 rounded-md  my-auto flex gap-2'>
                <div>
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="0.759766" y="0.909415" width="20.4938" height="20.4938" rx="4.55417" fill="#0CA851"/>
</svg>
                </div>
                <div className='my-auto text-[14px]'>First Monitor</div>
            </div>
        </div>
        <div>
            <div className='text-center font-medium'>Conditions</div>
            <div className=' px-3 py-2 rounded-md text-[14px] my-auto'>2 events and 3 functions</div>
        </div>
        <div>
            <div className='text-center font-medium'>Alerts Severity</div>
            <div className='bg-[#E9E9E9] px-3 py-2 rounded-md text-[14px] my-auto '>Medium Severity</div>
        </div>
    </div>
    </div>
    <div>
        <div className='flex justify-end gap-3'>
    <Switch
      checked={enabled}
      onChange={setEnabled}
      className={`${
        enabled ? 'bg-[#0CA851]' : 'bg-[#B8B8B8]'
      } relative inline-flex h-6 w-11 items-center rounded-full`}
    >
      <span className="sr-only">Enable notifications</span>
      <span
        className={`${
          enabled ? 'translate-x-6' : 'translate-x-1'
        } inline-block h-4 w-4 transform rounded-full bg-white transition`}
      />
    </Switch> 
    <div className='cursor-pointer' onClick={()=>{handleToggle()}}>
    <svg  width="6" height="21" viewBox="0 0 6 21" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle  cx="2.83594" cy="2.86066" r="2.5" fill="#0CA851"/>
<circle  cx="2.83594" cy="10.3607" r="2.5" fill="#0CA851"/>
<circle  cx="2.83594" cy="17.8607" r="2.5" fill="#0CA851"/>
</svg>
</div>
    </div>
    <div className='px-2 py-1 rounded-2xl mt-1'
     style={{'border':'1px solid #0CA851','display':disp}}>
        <div className='mb-2' >Save as template</div>
        <hr />
        <div className='text-center mt-2'>Delete</div>
    </div>
    </div>
</div>
<div className='mt-10 p-6 flex justify-between rounded-2xl' style={{'border':'1px solid #0CA851',boxShadow: '4px 4px 0px 0px #0CA851'
}}>
    <div>
    <div className='flex gap-3'>
    <div className='text-xl font-semibold'>Second Monitor</div>
    <div className='text-[12px] mt-auto text-[#7D7D7D]'>Governance</div>
    </div>
    <div className='flex gap-4'>
        <div>
            <div className='text-center font-medium'>Networks</div>
            <div className='bg-[#0CA851] px-3 py-2 rounded-md text-[13px] my-auto text-white'>MAINNET</div>
        </div>
        <div>
            <div className='text-center font-medium'>Monitoring</div>
            <div className='bg-[#E9E9E9] px-3 py-2 rounded-md  my-auto flex gap-2'>
                <div>
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="0.759766" y="0.909415" width="20.4938" height="20.4938" rx="4.55417" fill="#0CA851"/>
</svg>
                </div>
                <div className='my-auto text-[14px]'>Second Monitor</div>
            </div>
        </div>
        <div>
            <div className='text-center font-medium'>Conditions</div>
            <div className=' px-3 py-2 rounded-md text-[14px] my-auto'>2 events and 3 functions</div>
        </div>
        <div>
            <div className='text-center font-medium'>Alerts Severity</div>
            <div className='bg-[#E9E9E9] px-3 py-2 rounded-md text-[14px] my-auto '>Medium Severity</div>
        </div>
    </div>
    </div>
    <div>
        <div className='flex justify-end gap-3'>
    <Switch
      checked={enabled}
      onChange={setEnabled}
      className={`${
        enabled ? 'bg-[#0CA851]' : 'bg-[#B8B8B8]'
      } relative inline-flex h-6 w-11 items-center rounded-full`}
    >
      <span className="sr-only">Enable notifications</span>
      <span
        className={`${
          enabled ? 'translate-x-6' : 'translate-x-1'
        } inline-block h-4 w-4 transform rounded-full bg-white transition`}
      />
    </Switch> 
    <div className='cursor-pointer' onClick={()=>{handleToggle()}}>
    <svg  width="6" height="21" viewBox="0 0 6 21" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle  cx="2.83594" cy="2.86066" r="2.5" fill="#0CA851"/>
<circle  cx="2.83594" cy="10.3607" r="2.5" fill="#0CA851"/>
<circle  cx="2.83594" cy="17.8607" r="2.5" fill="#0CA851"/>
</svg>
</div>
    </div>
    <div className='px-2 py-1 rounded-2xl mt-1'
     style={{'border':'1px solid #0CA851','display':disp}}>
        <div className='mb-2' >Save as template</div>
        <hr />
        <div className='text-center mt-2'>Delete</div>
    </div>
    </div>
</div>
</div>
    </div>
  )
}

export default Monitor
