import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MdOutlineLightMode } from "react-icons/md";

function Navbar() {
  const [theme, setTheme] = useState("light");
  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    } else {
      setTheme("light");
      document.documentElement.classList.remove("dark");
    }
  };
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <div
        className={`flex justify-between items-center  dark:bg-red-600  flex-row w-full  rounded-full px-6 py-8`}
        
      >
        <div className="flex items-center gap-3 ">
          <div className="text-white my-auto font-sans text-4xl"> <span className="text-green-500">Secure</span>Watch</div>
        </div>
        
<div className=" lg:flex gap-7 flex-row bg-[#19304c] px-4 py-3 rounded-full border-2 border-slate-500 hidden ">

        <div className="md:flex items-center gap-1 hidden">

          <div className="text-white my-auto font-poppin">
            Product
          </div>
          <div className="my-auto">
            <svg
              width="10"
              height="6"
              viewBox="0 0 10 6"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M5.14862 5.65393L0.765086 1.2704L1.68944 0.346049L5.14862 3.80523L8.60885 0.346049L9.5332 1.2704L5.14862 5.65393Z"
                fill="white"
                fill-opacity="0.6"
              />
            </svg>
          </div>
        </div>

        <div className="md:flex items-center gap-1 hidden ">
          <div className="text-white my-auto font-poppin">Services</div>
          <div className="my-auto">
            <svg
              width="10"
              height="6"
              viewBox="0 0 10 6"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M5.14862 5.65393L0.765086 1.2704L1.68944 0.346049L5.14862 3.80523L8.60885 0.346049L9.5332 1.2704L5.14862 5.65393Z"
                fill="white"
                fill-opacity="0.6"
              />
            </svg>
          </div>
        </div>

        <div className="md:flex items-center gap-1 hidden">
          <div className="text-white my-auto font-poppin">Resources</div>
          <div className="my-auto">
            <svg
              width="10"
              height="6"
              viewBox="0 0 10 6"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M5.14862 5.65393L0.765086 1.2704L1.68944 0.346049L5.14862 3.80523L8.60885 0.346049L9.5332 1.2704L5.14862 5.65393Z"
                fill="white"
                fill-opacity="0.6"
              />
            </svg>
          </div>
        </div>
        <div className="md:flex items-center gap-1 hidden">
          <div className="text-white my-auto font-poppin">Pricing</div>
          
        </div>
        </div>

<div className=" flex items-center gap-20 md:mr-10">

        <div className="hidden lg:block">
        <MdOutlineLightMode className="text-white text-2xl" />
        </div>   
        
        <div className="flex gap-1 sm:gap-3 ">
        <Link to="/login" className="hidden sm:block">
          <div className=" rounded-lg px-3 py-2 font-medium font-inter border-2 border-green-600 hover:bg-green-600 text-white">
          Login
          </div>
        </Link>
        <button  onClick={toggleMenu} className="lg:hidden inline-flex items-center justify-center p-2 rounded-md text-white  hover:text-white  focus:outline-none  focus:text-white">
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            </div>

            </div>

            {isMenuOpen && (
        <div className="absolute right-6 mt-48 bg-[#303030F7] border border-gray-300 rounded-md shadow-lg py-2 px-3 flex flex-col justify-start items-start gap-3" >
          
          <div className="flex items-center gap-1 ">

<div className="text-white my-auto font-poppin">
  SecureWatch Platform
</div>
<div className="my-auto">
  <svg
    width="10"
    height="6"
    viewBox="0 0 10 6"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M5.14862 5.65393L0.765086 1.2704L1.68944 0.346049L5.14862 3.80523L8.60885 0.346049L9.5332 1.2704L5.14862 5.65393Z"
      fill="white"
      fill-opacity="0.6"
    />
  </svg>
</div>
</div>

<div className="flex items-center gap-1  ">
<div className="text-white my-auto font-poppin">Services</div>
<div className="my-auto">
  <svg
    width="10"
    height="6"
    viewBox="0 0 10 6"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M5.14862 5.65393L0.765086 1.2704L1.68944 0.346049L5.14862 3.80523L8.60885 0.346049L9.5332 1.2704L5.14862 5.65393Z"
      fill="white"
      fill-opacity="0.6"
    />
  </svg>
</div>
</div>

<div className="flex items-center gap-1 ">
<div className="text-white my-auto font-poppin">Learn</div>
<div className="my-auto">
  <svg
    width="10"
    height="6"
    viewBox="0 0 10 6"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M5.14862 5.65393L0.765086 1.2704L1.68944 0.346049L5.14862 3.80523L8.60885 0.346049L9.5332 1.2704L5.14862 5.65393Z"
      fill="white"
      fill-opacity="0.6"
    />
  </svg>
</div>
</div>

<Link to="/login" className="sm:hidden">
          <div className="text-white font-medium font-inter">
          Login
          </div>
        </Link>
        </div>
      )}

      </div>
    </>
  );
}

export default Navbar;
