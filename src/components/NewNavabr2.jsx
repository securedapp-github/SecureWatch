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
  const [isSupportMenuOpen, setIsSupportMenuOpen] = useState(false);
  
  return (
    <div className=" bg-white w-full px-4 py-5 flex justify-between items-center fixed z-50">
      
      <h1 className="logo text-black text-xl sm:text-3xl">Securewatch</h1>
     
      <div className="flex items-center gap-7  ">
        <button className="p-0" onClick={()=>setIsSupportMenuOpen(!isSupportMenuOpen)}>
          <BsHeadset className="text-[#535252] text-2xl" />
        </button>
      </div>
      {isSupportMenuOpen && (
          <div className='  absolute customShadow z-50 right-12 mt-32   bg-white rounded-md  py-3 w-56 flex flex-col justify-center items-start gap-3'>    
              <p className='text-black flex gap-3 items-center text-sm pl-5'> <MdPhoneIphone className='text-black text-sm' /> 9606015868</p>
              <div className='w-full h-[0.5px] bg-slate-300'></div>
              <p className='text-black flex gap-3 items-center text-sm pl-5'><MdOutlineEmail className='text-black text-sm' /> hello@securedapp.in</p>
          </div>)  
        }

    </div>
  );
}
