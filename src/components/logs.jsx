import React,{useState} from 'react'
import Navbar1 from './navbar1'

function logs() {
  return (
    <div className='mt-10 mx-2' style={{'backgroundColor':'#FCFFFD'}}>
      <Navbar1/>
      <div className='w-full md:w-4/6 mt-[10vw] mx-auto'>
        <div className='text-3xl md:text-4xl text-center font-medium'>Activity Tracking Simplified</div>
        <div className='mt-5 w-full md:w-3/4 text-lg mx-auto text-center'> Our system meticulously maintains a detailed log of all activities, providing you with a comprehensive overview of your account's operations. From adjustments in settings and configurations to automated processes such as transactions and alerts, every action is carefully tracked.</div>
      </div>
    </div>
  )
}

export default logs
