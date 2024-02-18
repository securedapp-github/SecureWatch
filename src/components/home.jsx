import React from 'react'
import Navbar from './navbar'
import Home from '../images/home1.png'
import Security from '../images/security.png'
import c1 from '../images/c1.png'
import c2 from '../images/c2.png'
import c3 from '../images/c3.png'
import c4 from '../images/c4.png'

function home() {
  return (
    <div className='mt-10 flex flex-col justify-center items-center'>
      <Navbar/>
      <button className='rounded-md px-4 py-2 text-white bg-black mt-10'>Confidence in every transaction</button>
      <div className='text-5xl mt-10'>Empower Your Transactions with </div>
      <div>
        <span className='text-[#107F41] text-5xl'>SecureWatch’s</span>
        <span className='text-5xl'> Real-Time Confidence.</span>
      </div>
      <div className='text-[#8F8F8F] mt-10'>Unlock the Future of Transaction Security – Proactive Monitoring,</div>
      <div className='text-[#8F8F8F]'>Intuitive Insights, and Seamless Scalability Await You with SecureWatch</div>
      <button className='rounded-md px-4 py-2 text-white bg-black mt-10'>Start for free</button>
      <div className='mt-10'>
      <img src={Home} alt="" /></div>
      <div className='text-5xl mx-10 text-center mt-10'>
      Essential Components
      <span className='text-[#43576C]'>&nbsp; Monitoring &nbsp;</span>
      <span className='text-[#D62C1C]'>Anomalies &nbsp;</span>
      with Empowering
      <span className='text-[#02B718]'>&nbsp;Dashboards&nbsp;</span>
      </div>
      <div className='grid grid-cols-2 grid-rows-2 w-4/6'>
        <div className='rounded-3xl mx-4' style={{border:'1px solid #E5E7EB'}}>
            <img src={c1} alt="" />
            <div className='text-xl px-4 py-2'>Fortifying Transaction Integrity</div>
            <div className='px-4 py-2 pb-4'>Real-time analysis using advanced algorithms to scrutinize every transaction, ensuring the security of critical transactions within web applications.</div>
        </div>
        <div className='rounded-3xl mx-4' style={{border:'1px solid #E5E7EB'}}>
            <img src={c2} alt="" />
            <div className='text-xl px-4 py-2'>Anomaly Detection System</div>
            <div className='px-4 py-2 pb-4'>Constantly adapting this system triggers instant alerts upon detecting deviations, supporting company-level alerting rules and efficient case management.</div>
        </div><div className='rounded-3xl mt-4 mx-4' style={{border:'1px solid #E5E7EB'}}>
            <img src={c3} alt="" />
            <div className='text-xl px-4 py-2'>Secure Dashboard</div>
            <div className='px-4 py-2 pb-4'> A user-friendly dashboard offering customizable views, real-time analytics, and historical data for  decision-making in monitoring critical transactions.</div>
        </div><div className='rounded-3xl mt-4 mx-4' style={{border:'1px solid #E5E7EB'}}>
            <img src={c4} alt="" />
            <div className='text-xl px-4 py-2'>Compliance and Reporting</div>
            <div className='px-4 py-2 pb-4'>Built-in reporting ensures regulatory compliance, generating comprehensive reports for audits and data integrity commitment.</div>
        </div>
      </div>
      <div className='text-5xl mt-20'>Benefits</div>
      <div className='grid grid-cols-2 grid-rows-3 w-4/6'>
        
            <div className='rounded-md mx-3 p-4' style={{'border':'2px solid #E5E5E5'}}>
                <img src={Security} alt="" />
                <div className='text-3xl'>Proactive Security</div>
                <div>Identify and address potential security threats in real-time with advanced algorithms and continuous monitoring, ensuring the integrity of critical transactions</div>
            </div>
            <div className='rounded-md mx-3  p-4' style={{'border':'2px solid #E5E5E5'}}>
            <img src={Security} alt="" />
                <div className='text-3xl'>User Confidence</div>
                <div>Build trust with your users by safeguarding their critical transactions, providing a secure environment that fosters confidence and loyalty.</div>
            </div>
            <div className='rounded-md mt-4 mx-3  p-4' style={{'border':'2px solid #E5E5E5'}}>
                <img src={Security} alt="" />
                <div className='text-3xl'>Peace of Mind</div>
                <div>Focus on business growth while SecureWatch takes care of transaction security, providing you peace of mind and allowing you to concentrate on strategic objectives.</div>
            </div>
            <div className='rounded-md  mt-4 mx-3  p-4' style={{'border':'2px solid #E5E5E5'}}>
            <img src={Security} alt="" />
                <div className='text-3xl'>Compliance Assurance</div>
                <div>Meet regulatory requirements effortlessly with SecureWatch's built-in reporting features, facilitating audits and demonstrating a commitment to data integrity and compliance.</div>
            </div>
            <div className='rounded-md  mt-4 mx-3  p-4' style={{'border':'2px solid #E5E5E5'}}>
                <img src={Security} alt="" />
                <div className='text-3xl'>Scalability</div>
                <div>Grow your business with confidence, knowing that SecureWatch's scalable architecture adapts to the evolving needs of your operations, effortlessly.</div>
            </div>
      </div>
      <div className='w-1/2 text-5xl mt-10'>Try SecureWatch now, it's free 
and easy to set up</div>
<button className='rounded-full px-4 py-2 text-white bg-black mt-5'>Sign Up-it's free</button>
    <div className='mt-10'>Need help or have questions?</div>
    <div className='mt-5'>
        <span className='mx-2'>
            Transaction Monitor
        </span>
        <span className='mx-2'>Secure Dashboard</span>
        <span className='mx-2'>Anomaly Detection System</span>
    </div>
    <div className='mt-2'>
        <span lassName='mx-2'>
        Alert and Notification System
        </span>
        <span className='mx-2'>Integration APIs</span>
        <span className='mx-2'>Scalable Architecture</span>
    </div>
    <div className='mt-2'>Compliance and Reporting</div>
    </div>
  )
}

export default home
