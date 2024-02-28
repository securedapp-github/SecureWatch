import React,{useState} from 'react'
import Navbar1 from './navbar1'
import Modal from 'react-modal';
import Load from '../images/loading.png'

const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  };

function Alerts() {
    
    const [open,setOpen]=useState(false)
    function openModal() {
      setOpen(true);
      setTimeout(()=>{
        closeModal();
      },2000)
    }
    function closeModal() {
      setOpen(false);
    }
  return (
    <div className='font-poppin mt-10 mx-2' style={{'backgroundColor':'#FCFFFD'}}>
     <Navbar1/> 
     <div className='w-full mx-auto mt-10 md:mt-20 flex items-start justify-center flex-col md:flex-row md:gap-10 lg:gap-20 '>
     <div className='mx-auto md:mx-0'>
            <div className='flex'>
            <div><svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_173_1147)">
<path d="M22.6223 15.9674H9.3152" stroke="#7D7D7D" stroke-width="1.88191" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M15.9688 22.621L9.3152 15.9674L15.9688 9.31387" stroke="#7D7D7D" stroke-width="1.88191" stroke-linecap="round" stroke-linejoin="round"/>
</g>
<defs>
<clipPath id="clip0_173_1147">
<rect width="22.5829" height="22.5829" fill="white" transform="translate(15.9688 31.9368) rotate(-135)"/>
</clipPath>
</defs>
</svg></div>
            <div className='text-base text-[#7D7D7D] my-auto'>Back to Monitors</div>
            </div>
            <div className='text-3xl font-medium mt-3'>Create Monitor</div>
            <div className='mt-10 flex gap-2 px-4 py-3 rounded-2xl' style={{'border':'1px solid #CACACA'}}>
            <div className='my-auto'><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_173_1156)">
<path d="M18.3327 9.23333V10C18.3317 11.797 17.7498 13.5456 16.6738 14.9849C15.5978 16.4241 14.0854 17.4771 12.3621 17.9866C10.6389 18.4961 8.79707 18.4349 7.11141 17.8122C5.42575 17.1894 3.98656 16.0384 3.00848 14.5309C2.0304 13.0234 1.56584 11.2401 1.68408 9.44693C1.80232 7.6538 2.49702 5.94694 3.66458 4.58089C4.83214 3.21485 6.41 2.26282 8.16284 1.86679C9.91568 1.47076 11.7496 1.65195 13.391 2.38333" stroke="#0CA851" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M18.3333 3.33325L10 11.6749L7.5 9.17492" stroke="#0CA851" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</g>
<defs>
<clipPath id="clip0_173_1156">
<rect width="20" height="20" fill="white"/>
</clipPath>
</defs>
</svg></div>
            <div className='my-auto'>General Information</div>
            <div className='my-auto ml-auto'>
                <svg width="27" height="26" viewBox="0 0 27 26" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M11.5059 18.6469L16.5765 13.5763L11.5059 8.50562" stroke="black" stroke-width="1.69021" stroke-linecap="round" stroke-linejoin="round"/>
</svg></div>
            </div>
            <div className='mt-10 flex gap-2 px-4 py-3 rounded-2xl' style={{'border':'1px solid #CACACA'}}>
            <div className='my-auto'><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_173_1156)">
<path d="M18.3327 9.23333V10C18.3317 11.797 17.7498 13.5456 16.6738 14.9849C15.5978 16.4241 14.0854 17.4771 12.3621 17.9866C10.6389 18.4961 8.79707 18.4349 7.11141 17.8122C5.42575 17.1894 3.98656 16.0384 3.00848 14.5309C2.0304 13.0234 1.56584 11.2401 1.68408 9.44693C1.80232 7.6538 2.49702 5.94694 3.66458 4.58089C4.83214 3.21485 6.41 2.26282 8.16284 1.86679C9.91568 1.47076 11.7496 1.65195 13.391 2.38333" stroke="#0CA851" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M18.3333 3.33325L10 11.6749L7.5 9.17492" stroke="#0CA851" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</g>
<defs>
<clipPath id="clip0_173_1156">
<rect width="20" height="20" fill="white"/>
</clipPath>
</defs>
</svg></div>
            <div className='my-auto'>Events</div>
            <div className='my-auto ml-auto'>
            <svg width="27" height="26" viewBox="0 0 27 26" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M11.5059 18.6469L16.5765 13.5763L11.5059 8.50562" stroke="black" stroke-width="1.69021" stroke-linecap="round" stroke-linejoin="round"/>
</svg></div>
            </div>
            <div className='mt-10 flex gap-2 px-4 py-3 rounded-2xl' style={{'border':'1px solid #CACACA'}}>
            <div className='my-auto'><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_173_1156)">
<path d="M18.3327 9.23333V10C18.3317 11.797 17.7498 13.5456 16.6738 14.9849C15.5978 16.4241 14.0854 17.4771 12.3621 17.9866C10.6389 18.4961 8.79707 18.4349 7.11141 17.8122C5.42575 17.1894 3.98656 16.0384 3.00848 14.5309C2.0304 13.0234 1.56584 11.2401 1.68408 9.44693C1.80232 7.6538 2.49702 5.94694 3.66458 4.58089C4.83214 3.21485 6.41 2.26282 8.16284 1.86679C9.91568 1.47076 11.7496 1.65195 13.391 2.38333" stroke="#0CA851" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M18.3333 3.33325L10 11.6749L7.5 9.17492" stroke="#0CA851" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</g>
<defs>
<clipPath id="clip0_173_1156">
<rect width="20" height="20" fill="white"/>
</clipPath>
</defs>
</svg></div>
            <div className='my-auto'>Functions</div>
            <div className='ml-auto my-auto'>
            <svg width="27" height="26" viewBox="0 0 27 26" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M11.5059 18.6469L16.5765 13.5763L11.5059 8.50562" stroke="black" stroke-width="1.69021" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
                </div>
            </div>
            <div className='mt-10 flex gap-2 px-4 py-3 rounded-2xl' style={{'border':'1px solid #0CA851'}}>
            <div className='my-auto'><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_173_1156)">
<path d="M18.3327 9.23333V10C18.3317 11.797 17.7498 13.5456 16.6738 14.9849C15.5978 16.4241 14.0854 17.4771 12.3621 17.9866C10.6389 18.4961 8.79707 18.4349 7.11141 17.8122C5.42575 17.1894 3.98656 16.0384 3.00848 14.5309C2.0304 13.0234 1.56584 11.2401 1.68408 9.44693C1.80232 7.6538 2.49702 5.94694 3.66458 4.58089C4.83214 3.21485 6.41 2.26282 8.16284 1.86679C9.91568 1.47076 11.7496 1.65195 13.391 2.38333" stroke="#0CA851" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M18.3333 3.33325L10 11.6749L7.5 9.17492" stroke="#0CA851" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</g>
<defs>
<clipPath id="clip0_173_1156">
<rect width="20" height="20" fill="white"/>
</clipPath>
</defs>
</svg></div>
            <div className='my-auto'>Alerts</div>
            <div className='my-auto ml-auto'><svg width="27" height="26" viewBox="0 0 27 26" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="0.832031" y="26" width="26" height="26" rx="2.92308" transform="rotate(-90 0.832031 26)" fill="#0CA851"/>
<path d="M11.5469 18.647L16.6175 13.5763L11.5469 8.50571" stroke="white" stroke-width="1.23515" stroke-linecap="round" stroke-linejoin="round"/>
</svg></div>
            </div>
        </div>
        <div className='w-full md:w-1/3 lg:w-1/4 mt-5 md:mt-0'>
            <div className='font-medium text-lg'>Risk Category</div>
            <div className='w-inherit border-2 border-[#B4B4B4] shadow-md p-3 rounded-lg flex px-3 justify-between py-3'>
                <div className='text-lg font-medium'>Low Severity</div>
                <div><svg width="21" height="22" viewBox="0 0 21 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M5.52539 8.4642L10.596 13.5348L15.6667 8.4642" stroke="black" stroke-width="1.69021" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
</div>
            </div>
            <div className='rounded-lg border-2 border-[#B4B4B4] border-t-0 shadow-md'>
      <div className='p-3'>
        <label htmlFor="opt1" className='text-[#8E8E8E] text-[13px]'>Low Severity</label>
        </div>
      <div className='p-3'>
        <label htmlFor="opt1" className='text-[#8E8E8E] text-[13px]'>Medium Severity</label>
        </div>
      <div className='p-3'>
        <label htmlFor="opt1" className='text-[#8E8E8E] text-[13px]'>High Severity</label>
        </div>
        </div>
        <div className='mt-5'>
            <div className='font-medium'>Execute an action</div>
            <div className='w-inherit border-2 border-[#B4B4B4] shadow-md p-3 rounded-lg flex px-3 justify-between py-3'>
                <div className='font-medium'>None</div>
                <div><svg width="21" height="22" viewBox="0 0 21 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M5.52539 8.4642L10.596 13.5348L15.6667 8.4642" stroke="black" stroke-width="1.69021" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
</div>
            </div>
        </div>
        <div className='mt-5'>
        <div className='font-medium'>Execute an Incident Response Scenario</div>
        <div className='w-inherit border-2 border-[#B4B4B4] shadow-md p-3 rounded-lg flex px-3 justify-between py-3'>
                <div className='font-medium'>None</div>
                <div><svg width="21" height="22" viewBox="0 0 21 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M5.52539 8.4642L10.596 13.5348L15.6667 8.4642" stroke="black" stroke-width="1.69021" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
</div>
            </div>
        </div>
        <div className='flex gap-2'>
        <div className='mt-5 w-1/4'>
        <div className='font-medium'>Alert</div>
            <input type="text" value='1' className='w-full rounded-lg p-3 outline-none border border-black' placeholder='Variables: owner, spender, value'/>
        </div>
        <div className='mt-5 w-3/4'>
        <div className='font-medium'>Minimum time between notifications</div>
            <div className='flex gap-1'>
            <input type="text" value='0' className='w-1/2 rounded-lg p-3 outline-none border border-black' placeholder='Variables: owner, spender, value'/>
            <div className='w-1/2 border border-black shadow-md p-3 rounded-lg flex px-3 justify-between py-3'>
                <div className='font-medium'>Minute</div>
                <div><svg width="21" height="22" viewBox="0 0 21 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M5.52539 8.4642L10.596 13.5348L15.6667 8.4642" stroke="black" stroke-width="1.69021" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
</div>
            </div>
            </div>
        </div>
        </div>
    <button className='py-3 w-full bg-[#28AA61] mt-10 rounded-lg text-white' onClick={openModal}>Save Monitor</button>
        </div>
        <div className=' mt-4 md:mt-0 border mx-auto md:mx-0 border-[#0CA851] shadow-md p-5 rounded-xl'>
            <div className='text-lg font-medium'>Monitor Summary</div>
            <div className='flex gap-2'>
                <div>
                    <div className='text-center font-medium'>Networks</div>
                    <div className='text-white bg-[#0CA851] rounded-md p-2 text-[13px]'>MAINNET</div>
                </div>
                <div>
                    <div className='text-center font-medium'>Risk Category</div>
                    <div className=' bg-[#E9E9E9] rounded-md p-2 text-[13px]'>Medium Severity</div>
                </div>
            </div>
            <div className='mt-3'>
                <div className='font-medium'>Contracts</div>
                <div className='flex gap-1'>
                <div className=' bg-[#E9E9E9] rounded-md p-2 text-[13px]'>0x1d54....49844</div>
    <div className='my-auto'><svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_179_2771)">
<path d="M15.1074 7.65955H8.35742C7.52899 7.65955 6.85742 8.33112 6.85742 9.15955V15.9095C6.85742 16.738 7.52899 17.4095 8.35742 17.4095H15.1074C15.9358 17.4095 16.6074 16.738 16.6074 15.9095V9.15955C16.6074 8.33112 15.9358 7.65955 15.1074 7.65955Z" stroke="#434343" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M3.85742 12.1595H3.10742C2.7096 12.1595 2.32807 12.0015 2.04676 11.7202C1.76546 11.4389 1.60742 11.0574 1.60742 10.6595V3.90955C1.60742 3.51172 1.76546 3.13019 2.04676 2.84889C2.32807 2.56758 2.7096 2.40955 3.10742 2.40955H9.85742C10.2552 2.40955 10.6368 2.56758 10.9181 2.84889C11.1994 3.13019 11.3574 3.51172 11.3574 3.90955V4.65955" stroke="#434343" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</g>
<defs>
<clipPath id="clip0_179_2771">
<rect width="18" height="18" fill="white" transform="translate(0.107422 0.909546)"/>
</clipPath>
</defs>
</svg>
</div>
                </div>
            </div>
            <div className='mt-3'>
                <div className='font-medium'>Event Conditions</div>
                <div className='text-[13px]'>Approval(address,address,uint256)</div>
                <div className='text-[13px]'>Transfer(address,address,uint256)</div>
            </div>
            <div className='mt-3'>
                <div className='font-medium'>Function Conditions</div>
                <div>
                <div className='text-[13px]'>approve(address,uint256)</div>
                <div className='text-[13px]'>decreaseAllowance(address,uint256)</div>
                <div className='text-[13px]'>increaseAllowance(address,uint256)</div>
                <div className='text-[13px]'>transfer(address,uint256)</div>
                <div className='text-[13px]'>transferFrom(address,address,uint256)</div>
                </div>
            </div>
            <div className='mt-3'>
                <div className="font-medium">Alerts</div>
                <div className='flex gap-1 items-center'>
                <div className='text-[13px]'>Marked as</div>
                <div className=' bg-[#E9E9E9] rounded-md py-1 px-2 text-[13px]'>Medium Severity</div>
                </div>
            </div>
        </div>
     </div>
     <Modal
        isOpen={open}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
       <div className='text-xl font-medium text-center mt-[30px] mx-[60px] md:mx-[120px]'>Creating Monitor</div>
       <img src={Load} alt="not found" className='mt-6  mb-[30px] mx-[60px] md:mx-[120px]' />
      </Modal>
    </div>
  )
}

export default Alerts
