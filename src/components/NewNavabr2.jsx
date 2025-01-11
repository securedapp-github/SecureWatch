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

export default function NewNavbar({ email }) {
  const [toggleMenu, setToggleMenu] = useState(false);
  const [expandRealtimeSecurity, setExpandRealtimeSecurity] = useState(false);
  
  return (
    <div className=" bg-white w-full px-4 py-5 flex justify-between items-center fixed z-50">
      
      <h1 className="logo text-black text-xl sm:text-3xl">Securewatch</h1>
     
      <div className="flex items-center gap-7  ">
        <button className="p-0">
          <BsHeadset className="text-[#535252] text-2xl" />
        </button>
      </div>

    </div>
  );
}
