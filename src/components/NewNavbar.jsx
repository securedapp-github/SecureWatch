import React, { useState } from 'react'
import { BsHeadset } from "react-icons/bs";
import { IoClose } from "react-icons/io5";

export default function NewNavbar({ email }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => {
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
    <div className=" bg-white w-full px-4 py-5 flex justify-between items-center">
      <h1 className="logo text-black text-3xl">Securewatch</h1>
      <div className="flex items-center gap-7">
        <button className="p-0">
          <BsHeadset className="text-[#535252] text-2xl" />
        </button>
        <button className="p-0 shadow-lg rounded-full " onClick={toggleMenu}>
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
