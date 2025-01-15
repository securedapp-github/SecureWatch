import React, { useState } from 'react'
import { BsHeadset } from "react-icons/bs";
import { IoClose } from "react-icons/io5";
import {HiMenuAlt4} from 'react-icons/hi';
import {AiOutlineClose} from 'react-icons/ai';
import { LuClock9 } from "react-icons/lu";
import { FaPlus } from "react-icons/fa6";
import { GrDocumentText } from "react-icons/gr";
import { FaRegCalendarAlt } from "react-icons/fa";
import { PiSquaresFourBold } from "react-icons/pi";
import { RiPieChartLine } from "react-icons/ri";
import { IoPersonSharp } from "react-icons/io5";
import { LuNetwork } from "react-icons/lu";
import SecureDapp from "../images/SecureDapp.png";
import { Link } from 'react-router-dom';
import { MdPhoneIphone } from "react-icons/md";
import { MdOutlineEmail } from "react-icons/md";

export default function NewNavbar({ email }) {
  const [toggleMenu, setToggleMenu] = useState(false);
  const [expandRealtimeSecurity, setExpandRealtimeSecurity] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSupportMenuOpen, setIsSupportMenuOpen] = useState(false);
  const toggleMenu1 = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const extractNameFromEmail = (email) => {
    if (!email) return '';
    return email.split('@')[0];
  };
  const getFirstLetterFromEmail = (email) => {
    if (!email) return '';
    return email.charAt(0).toUpperCase();
  };
  
  // Usage in your component
  const firstLetter = getFirstLetterFromEmail(email);
  const name = extractNameFromEmail(email);
  function handleLogout(){
    localStorage.clear()
    window.location.href = '/'
  }
  return (
    <div className=" bg-white w-full px-4 py-5 flex justify-between items-center fixed z-50">
      <button className="p-0 sm:hidden" onClick={()=>setIsSupportMenuOpen(!isSupportMenuOpen)}>
          <BsHeadset className="text-[#535252] text-2xl" />
        </button>
        {isSupportMenuOpen && (
          <div className='absolute sm:hidden customShadow z-50 left-12 mt-32   bg-white rounded-md  py-3 w-56  flex flex-col justify-center items-start gap-3'>    
              <p className='text-black flex gap-3 items-center text-sm pl-5'> <MdPhoneIphone className='text-black text-sm' /> 9606015868</p>
              <div className='w-full h-[0.5px] bg-slate-300'></div>
              <p className='text-black flex gap-3 items-center text-sm pl-5'><MdOutlineEmail className='text-black text-sm' /> hello@securedapp.in</p>
          </div>)  
        }
      <h1 className="logo text-black text-xl sm:text-3xl">Securewatch</h1>
      {toggleMenu
      ?<AiOutlineClose fontSize={28} className='text-black cursor-pointer sm:hidden ' onClick={()=>{setToggleMenu(false)}} />
      :<HiMenuAlt4 fontSize={28} className='text-black cursor-pointer sm:hidden' onClick={()=>{setToggleMenu(true)}} />
      }
      {toggleMenu &&(
        <ul className='z-10 fixed top-0 right-0  w-[80vw] h-screen shadow-2xl sm:hidden list-none flex flex-col justify-start  bg-white rounded-none text-black animate-slide-in'>
          <li className='text-xl w-full  bg-[#2D5C8F] flex justify-between p-3 items-center'>
            <div className='flex items-center gap-3'>
            <button className="p-0 shadow-lg rounded-full " >
          <div className="avatar placeholder">
            <div className="bg-white text-[#2d5c8f] w-10 rounded-full">
              <span>{firstLetter}</span>
            </div>
          </div>
        </button>
              <div className='flex flex-col '>
              <h1 className="text-white">Hi, {name}!</h1>
              <button className=' text-white p-0 text-start text-sm underline' onClick={handleLogout}>Signout</button>
              </div>
            </div>
            <AiOutlineClose fontSize={28} className='text-white cursor-pointer ' onClick={()=>setToggleMenu(false)}/>
          </li>
          <div className='flex mt-1 flex-col'>
            <div className='w-full  pl-8 pr-5 py-4'>
            <button className='text-[#6A6A6A]  p-0 flex items-center justify-between text-xl w-full' onClick={()=>setExpandRealtimeSecurity(!expandRealtimeSecurity)}><span className='flex items-center gap-4'><LuClock9 className='text-black text-2xl' /> Realtime Security</span> <FaPlus className='text-[#6A6A6A] text-lg' /></button>
            </div>
            {
              expandRealtimeSecurity && (
                <div className="flex flex-col gap-5 pl-[70px] mb-3">
                <Link to="/dashboard" className="text-[#6A6A6A]">
                  Overview
                </Link>
                <Link to="/monitor" className="text-[#6A6A6A]">
                  Monitor
                </Link>
                <Link to="/log" className="text-[#6A6A6A]">
                  Logs
                </Link>
              </div>
              )
            }

        
        <div className='w-full  pl-8 pr-5 border-t py-4'>
        <a href="https://securedapp.io/solidity-shield" className='text-[#6A6A6A]  p-0 flex items-center justify-between text-xl w-full'><span className='flex items-center gap-4'><GrDocumentText className='text-[#6A6A6A] text-2xl' /> Security Audit</span> <FaPlus className='text-[#6A6A6A] text-lg' /></a>
        </div>

        <div className='w-full  pl-8 pr-5 border-t py-4'>
        <Link to="/comingsoon" className='text-[#6A6A6A]  p-0 flex items-center justify-between text-xl w-full'><span className='flex items-center gap-4'><FaRegCalendarAlt className='text-[#6A6A6A] text-2xl' /> Historic events</span> <FaPlus className='text-[#6A6A6A] text-lg' /></Link>
        </div>

        <div className='w-full  pl-8 pr-5 border-t py-4'>
        <a href="https://securedapp.io/secure-trace" className='text-[#6A6A6A]  p-0 flex items-center justify-between text-xl w-full'><span className='flex items-center gap-4'><PiSquaresFourBold className='text-[#6A6A6A] text-2xl' /> Blockchain Forensics</span> <FaPlus className='text-[#6A6A6A] text-lg' /></a>
        </div>

        <div className='w-full  pl-8 pr-5 border-t py-4'>
        <Link to="/comingsoon" className='text-[#6A6A6A]  p-0 flex items-center justify-between text-xl w-full'><span className='flex items-center gap-4'><RiPieChartLine className='text-[#6A6A6A] text-2xl' /> Analytics & Report</span> <FaPlus className='text-[#6A6A6A] text-lg' /></Link>
        </div>

<div className='w-full  pl-8 pr-5 border-t py-4'>
        <Link to="/admin" className='text-[#6A6A6A]  p-0 flex items-center justify-between text-xl w-full'><span className='flex items-center gap-4'><IoPersonSharp className='text-[#6A6A6A] text-2xl' /> Admin</span> </Link>
</div>

<div className='w-full  pl-8 pr-5 border-t border-b py-4'>
        <Link to="/comingsoon" className='text-[#6A6A6A]  p-0 flex items-center justify-between text-xl w-full'><span className='flex items-center gap-4'><LuNetwork className='text-[#6A6A6A] text-2xl' /> Integration Hub</span> </Link>
        </div>
          </div>

          <div className="mt-auto m-5 flex gap-1 items-center justify-start">
        <img src={SecureDapp} alt="SecureDapp logo" className="w-10" />
        <span className="text-black logo text-lg">
         Securewatch
        </span>
      </div>
        </ul>
      )
      }

      <div className="sm:flex items-center gap-7 hidden ">
        <button className="p-0" onClick={()=>setIsSupportMenuOpen(!isSupportMenuOpen)}>
          <BsHeadset className="text-[#535252] text-2xl" />
        </button>
        {isSupportMenuOpen && (
          <div className='hidden  absolute customShadow z-50 right-12 mt-32   bg-white rounded-md  py-3 w-56  sm:flex flex-col justify-center items-start gap-3'>    
              <p className='text-black flex gap-3 items-center text-sm pl-5'> <MdPhoneIphone className='text-black text-sm' /> 9606015868</p>
              <div className='w-full h-[0.5px] bg-slate-300'></div>
              <p className='text-black flex gap-3 items-center text-sm pl-5'><MdOutlineEmail className='text-black text-sm' /> hello@securedapp.in</p>
          </div>)  
        }
        <button className="p-0 shadow-lg rounded-full " onClick={toggleMenu1}>
          <div className="avatar placeholder">
            <div className="bg-[#2d5c8f] text-white w-10 rounded-full">
              <span>{firstLetter}</span>
            </div>
          </div>
        </button>
        {isMenuOpen && (
          <div className="absolute z-50 right-12 mt-72 bg-[#F1F8FF] rounded-3xl drop-shadow-lg py-5 px-14 pt-8 flex flex-col justify-center items-center gap-4">
            <button onClick={()=>setIsMenuOpen(false)} className='a absolute top-2 right-3'>
            <IoClose className='text-black text-2xl' />
            </button>
            <h1 className="text-[#6A6A6A]">{email}</h1>

            <div className='flex flex-col items-center justify-center gap-3'>
              <div className="avatar placeholder">
                <div className="bg-[#2d5c8f] text-white w-16 rounded-full">
                  <span className='text-3xl'>{firstLetter}</span>
                </div>
              </div>
              <h1 className="text-[#6A6A6A]">Hi, {name}!</h1>
            </div>

            <button className='rounded-full px-7 py-2 border text-[#6A6A6A] border-[#6A6A6A] hover:bg-[#2d5c8f] hover:text-white' onClick={handleLogout}>Signout</button>
          </div>
        )}
      </div>
    </div>
  );
}
