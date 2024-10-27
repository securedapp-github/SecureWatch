import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MdOutlineLightMode } from "react-icons/md";
import { MdDarkMode } from "react-icons/md";

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
  const [productIsopen, setProductIsopen] = useState(false)
  const [resourceIsopen, setResourceIsopen] = useState(false)
  const [serviceIsopen, setServiceIsopen] = useState(false)
  const [dropdown1, setDropdown1] = useState(false)
  const [dropdown2, setDropdown2] = useState(false)
  const [dropdown3, setDropdown3] = useState(false)
  const [audit, setAudit] = useState(false)
  const [security, setSecurity] = useState(false)
  const [regulatory, setRegulatory] = useState(false)
  const [training, setTraining] = useState(false)

  return (
    <>
      <div
        className={`flex justify-between items-center    flex-row w-full  rounded-full px-3 sm:px-9 sm:pl-14 py-8`}
        
      >
        <div className="flex items-center gap-3 ">
          <div className="dark:text-[#001938] text-white my-auto font-sans text-4xl"> <span className="text-green-500">Secure</span >Watch</div>
        </div>
        
<div className=" lg:flex gap-7 flex-row dark:bg-[#f7fafe] bg-[#19304c] px-4 py-3 rounded-full border-2 dark:border-[#dfedff] border-slate-500 hidden ">

        <div className="md:flex items-center gap-1 hidden relative cursor-pointer" onMouseOver={()=>setProductIsopen(true)} onMouseOut={()=>setProductIsopen(false)} >

          <div className="dark:text-[#001938] text-white my-auto font-poppin">
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
                fill={theme === "dark" ? "black" : "white"}
                fill-opacity="0.6"
              />
            </svg>
          </div>

          {productIsopen?(
            <div className="border dark:bg-[#f7fafe] bg-[#001938] absolute top-7 rounded-md  px-4 py-4 flex flex-col justify-center items-start gap-3">
            <a className="text-white text-nowrap dark:text-[#001938]" href="https://securedapp.io/solidity-shield">Solidity Shield</a>
            <a className="text-white text-nowrap dark:text-[#001938]" href="https://securedapp.io/secure-watch">Secure Watch</a>
            <a className="text-white text-nowrap dark:text-[#001938]" href="https://securedapp.io/secure-trace">Secure Trace</a>
            <a className="text-white text-nowrap dark:text-[#001938]" href="https://securedapp.io/secure-pad">Secure Pad</a>
        </div>
          ):null}
        </div>

        <div className="md:flex items-center gap-1 hidden relative cursor-pointer" onMouseOver={()=>setServiceIsopen(true)} onMouseOut={()=>setServiceIsopen(false)}>
          <div className="dark:text-[#001938] text-white my-auto font-poppin">Services</div>
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
                fill={theme === "dark" ? "black" : "white"}
                fill-opacity="0.6"
              />
            </svg>
          </div>
          {serviceIsopen?(
            <div className="border dark:bg-[#f7fafe] bg-[#001938] absolute top-7 -left-32  rounded-md  px-4 py-4 flex gap-6  flex-nowrap">
            <div className="flex flex-col gap-4">
            <p className="text-white text-nowrap dark:text-[#001938] text-lg">Audit</p>
            <div className="flex flex-col gap-2">
            <a className="text-slate-100 text-nowrap dark:text-[#001938] text-sm" href="https://securedapp.io/smart-contract-audit">Smart Contract Audit</a>
            <a className="text-slate-100 text-nowrap dark:text-[#001938] text-sm" href="https://securedapp.io/dapp-security-audit">Dapp Security Audit</a>
            <a className="text-slate-100 text-nowrap dark:text-[#001938] text-sm" href="https://securedapp.io/token-audit">Token Audit</a>
            <a className="text-slate-100 text-nowrap dark:text-[#001938] text-sm" href="https://securedapp.io/rwa-audit">RWA Audit</a>
            </div>
            </div>

            <div className="flex flex-col gap-4">
            <p className="text-white text-nowrap dark:text-[#001938] text-lg">Security</p>
            <div className="flex flex-col gap-3">
              <a className="text-slate-100 text-nowrap dark:text-[#001938] text-sm" href="https://securedapp.io/web3-security">Web3 Security</a>
              <a className="text-slate-100 text-nowrap dark:text-[#001938] text-sm" href="https://securedapp.io/web3-kyc">Web3 KYC</a>
              <a className="text-slate-100 text-nowrap dark:text-[#001938] text-sm" href="https://securedapp.io/blockchain-forensic">Blockchain Forensic</a>
            </div>
            </div>
            <div className="flex flex-col gap-4">
            <p className="text-white text-nowrap dark:text-[#001938] text-lg">Regulatory Solutions</p>
            <div className="flex flex-col gap-3">
            <a className="text-slate-100 text-nowrap dark:text-[#001938] text-sm" href="https://securedapp.io/crypto-compliance-aml">Crypto Compliance & AML</a>
            <a className="text-slate-100 text-nowrap dark:text-[#001938] text-sm" href="https://securedapp.io/decentralized-identity-did">Decentralized Identity (DID)</a>
            <a className="text-slate-100 text-nowrap dark:text-[#001938] text-sm" href="https://securedapp.io/dapp-development">DApp Development</a>
            <a className="text-slate-100 text-nowrap dark:text-[#001938] text-sm" href="https://securedapp.io/nfts-development">NFTs Development</a>
            <a className="text-slate-100 text-nowrap dark:text-[#001938] text-sm" href="https://securedapp.io/defi-development">DeFi Development</a>
            </div>
            
            </div>
            <div className="flex flex-col gap-4">
            <p className="text-white text-nowrap dark:text-[#001938] text-lg">Training & Education</p>
            <div>
              <a className="text-slate-100 text-nowrap dark:text-[#001938] text-sm" href="https://securedapp.io/levelup-academy">LevelUp Academy</a>
            </div>
            </div>
            
        </div>
          ):null}
        </div>

        <div className="md:flex items-center gap-1 hidden relative cursor-pointer " onMouseOver={()=>setResourceIsopen(true)} onMouseOut={()=>setResourceIsopen(false)}>
          <div className="dark:text-[#001938] text-white my-auto font-poppin">Resources</div>
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
                fill={theme === "dark" ? "black" : "white"}
                fill-opacity="0.6"
              />
            </svg>
          </div>
          {resourceIsopen?(
            <div className="border dark:bg-[#f7fafe] bg-[#001938] absolute top-7 rounded-md  px-4 py-4 flex flex-col justify-center items-start gap-3">
            <a className="text-white text-nowrap dark:text-[#001938]" href="https://securedapp.io/blog">Blogs</a>
            <a className="text-white text-nowrap dark:text-[#001938]" href="https://securedapp.io/about">About Us</a>
            <a className="text-white text-nowrap dark:text-[#001938]" href="https://securedapp.io/authors">Our Authors</a>
            <a className="text-white text-nowrap dark:text-[#001938]" href="https://securedapp.io/media">Media</a>
        </div>
          ):null}
        </div>
        <div className="md:flex items-center gap-1 hidden">
          <a className="dark:text-[#001938] text-white my-auto font-poppin" href="https://securedapp.io/solidity-shield-scan/pricing">Pricing</a>
          
        </div>
        </div>

<div className=" flex items-center gap-3 md:gap-12 md:mr-10">

        <div className="">
          {
            theme === "light" ? (
              <MdOutlineLightMode
                className="text-white text-2xl cursor-pointer"
                onClick={toggleTheme}
              />
            ) : (
              <MdDarkMode
                className="text-[#001938] text-2xl cursor-pointer"
                onClick={toggleTheme}
              />
            )
          }

        </div>   
        
        <div className="flex gap-1 sm:gap-3 ">
        <Link to="/login" className="hidden sm:block">
          <div className=" rounded-lg px-3 py-2 font-medium font-inter border-2 border-green-600 hover:bg-green-600 dark:text-[#001938] text-white">
          Login
          </div>
        </Link>
        <button  onClick={toggleMenu} className="lg:hidden inline-flex items-center justify-center p-2 rounded-md dark:text-[#001938] text-white focus:outline-none ">
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            </div>

            </div>

            {isMenuOpen && (
        <div className="z-50 absolute right-6 top-20 bg-[#001938] border border-gray-300 rounded-md shadow-lg py-2 px-3 flex flex-col justify-start items-start gap-3" >
          

          <button className="flex items-center gap-1 " onClick={()=>setDropdown1(!dropdown1)}>


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





</button>

{dropdown1 && (
  <div className="flex flex-col gap-3">
    <a className="text-white text-nowrap dark:text-[#001938]" href="https://securedapp.io/solidity-shield">Solidity Shield</a>
            <a className="text-white text-nowrap dark:text-[#001938]" href="https://securedapp.io/secure-watch">Secure Watch</a>
            <a className="text-white text-nowrap dark:text-[#001938]" href="https://securedapp.io/secure-trace">Secure Trace</a>
            <a className="text-white text-nowrap dark:text-[#001938]" href="https://securedapp.io/secure-pad">Secure Pad</a>
  </div>
)}

<button className="flex items-center gap-1  " onClick={()=>setDropdown2(!dropdown2)}>
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
</button>

{dropdown2 && (
  <div className="flex flex-col gap-3">
    <button className="text-white text-nowrap dark:text-[#001938] flex gap-2 items-center" onClick={()=>setAudit(!audit)}>Audit 
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
  /></svg></button>

{audit && (
  <div className="flex flex-col gap-2">
  <a className="text-slate-100 text-nowrap dark:text-[#001938] text-sm" href="https://securedapp.io/smart-contract-audit">Smart Contract Audit</a>
            <a className="text-slate-100 text-nowrap dark:text-[#001938] text-sm" href="https://securedapp.io/dapp-security-audit">Dapp Security Audit</a>
            <a className="text-slate-100 text-nowrap dark:text-[#001938] text-sm" href="https://securedapp.io/token-audit">Token Audit</a>
            <a className="text-slate-100 text-nowrap dark:text-[#001938] text-sm" href="https://securedapp.io/rwa-audit">RWA Audit</a>
  </div>
)}
  
    <button className="text-white text-nowrap dark:text-[#001938] flex gap-2 items-center" onClick={()=>setSecurity(!security)}>Security 
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
  /></svg></button>

  {security && (
    <div className="flex flex-col gap-3">
    <a className="text-slate-100 text-nowrap dark:text-[#001938] text-sm" href="https://securedapp.io/web3-security">Web3 Security</a>
              <a className="text-slate-100 text-nowrap dark:text-[#001938] text-sm" href="https://securedapp.io/web3-kyc">Web3 KYC</a>
              <a className="text-slate-100 text-nowrap dark:text-[#001938] text-sm" href="https://securedapp.io/blockchain-forensic">Blockchain Forensic</a>
  </div>
  )}

    <button className="text-white text-nowrap dark:text-[#001938] flex gap-2 items-center" onClick={()=>setRegulatory(!regulatory)}>Regulatory Solutions 
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
  /></svg></button>

  {regulatory && (
     <div className="flex flex-col gap-3">
     <a className="text-slate-100 text-nowrap dark:text-[#001938] text-sm" href="https://securedapp.io/crypto-compliance-aml">Crypto Compliance & AML</a>
            <a className="text-slate-100 text-nowrap dark:text-[#001938] text-sm" href="https://securedapp.io/decentralized-identity-did">Decentralized Identity (DID)</a>
            <a className="text-slate-100 text-nowrap dark:text-[#001938] text-sm" href="https://securedapp.io/dapp-development">DApp Development</a>
            <a className="text-slate-100 text-nowrap dark:text-[#001938] text-sm" href="https://securedapp.io/nfts-development">NFTs Development</a>
            <a className="text-slate-100 text-nowrap dark:text-[#001938] text-sm" href="https://securedapp.io/defi-development">DeFi Development</a>
     </div>
  )}

    <button className="text-white text-nowrap dark:text-[#001938] flex gap-2 items-center" onClick={()=>setTraining(!training)}>Training & Education 
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
  /></svg></button>

{training && (
  <div>
  <a className="text-slate-100 text-nowrap dark:text-[#001938] text-sm" href="https://securedapp.io/levelup-academy">LevelUp Academy</a>
</div>
)}


    
  </div>
)}

<button className="flex items-center gap-1 " onClick={()=>setDropdown3(!dropdown3)}>
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
</button>
{dropdown3 && (
  <div className="flex flex-col gap-3">
     <a className="text-white text-nowrap dark:text-[#001938]" href="https://securedapp.io/blog">Blogs</a>
            <a className="text-white text-nowrap dark:text-[#001938]" href="https://securedapp.io/about">About Us</a>
            <a className="text-white text-nowrap dark:text-[#001938]" href="https://securedapp.io/authors">Our Authors</a>
            <a className="text-white text-nowrap dark:text-[#001938]" href="https://securedapp.io/media">Media</a>
  </div>
)}

<div className="flex items-center gap-1 ">
<a className="dark:text-[#001938] text-white my-auto font-poppin" href="https://securedapp.io/solidity-shield-scan/pricing">Pricing</a>
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
