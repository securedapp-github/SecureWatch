import React from 'react'
import { FaHandshakeAngle } from "react-icons/fa6";
import { MdSpeed } from "react-icons/md";
import { FaSearch } from "react-icons/fa";
import { IoDocumentTextOutline } from "react-icons/io5";
import { FiUnlock } from "react-icons/fi";
import { RiDiscountPercentLine } from "react-icons/ri";
import { RiBugLine } from "react-icons/ri";
import { LuShieldClose } from "react-icons/lu";
import { GrDocumentPerformance } from "react-icons/gr";
import GraphicTop from "../images/Graphic-top.png";
import GraphicBottom from "../images/Graphic-bottom.png";
import { FaDiscord } from "react-icons/fa";
import { RiTwitterXLine } from "react-icons/ri";
import { FaLinkedin } from "react-icons/fa";
import { FaTelegram } from "react-icons/fa";
import { GoDotFill } from "react-icons/go";
import SecureDappLogo from "../images/securedapp.svg"


export default function Footer1() {
    const currentYear = new Date().getFullYear();
  return (
    <div >

<div className="w-full  bg-white flex justify-center items-center pt-24">
          <div className="w-[80%] h-[1px]  bg-black"></div>
        </div>


        <div className="w-full bg-white  flex justify-around py-7 gap-6 flex-wrap">
            <div className='flex flex-col justify-between  items-start gap-6 '>
               
                <img src={SecureDappLogo} className=' h-12  sm:bg-white' alt="SecureDapp Logo" />
                
                <div className="flex gap-6 ">
            <a target="_blank" href="https://discord.com/invite/pqDC8ddnYQ"> <FaDiscord className="text-black  text-3xl" /></a>
            <a target="_blank" href="https://x.com/secure_dapp"> <RiTwitterXLine className="text-black  text-3xl" /></a>
            <a target="_blank" href="https://www.linkedin.com/company/securedapp/"><FaLinkedin className="text-black  text-3xl" /></a>
            <a target="_blank" href="https://telegram.me/securedappcommunity"><FaTelegram className="text-black  text-3xl" /></a>
          </div>
            </div>
          

          <div className="flex gap-10 flex-wrap justify-center ">
            <div className="flex flex-col gap-5">
              <div>
                <p className="text-black  text-xl font-medium">Product</p>
              </div>
              <div className="flex flex-col gap-3">
                <a className="text-black text-sm " href="https://securedapp.io/solidity-shield">Solidity Shield Scan</a>
                <a href="https://securedapp.io/secure-watch" className="text-black text-sm ">Secure Watch</a>
                <a href="https://securedapp.io/auditexpress/home" className="text-black text-sm ">Audit Express</a>
                <a href="https://securedapp.io/secure-trace" className="text-black text-sm ">Secure Trace</a>
                <a href="https://securedapp.io/secure-pad" className="text-black text-sm ">Secure Pad</a>
              </div>
            </div>

            <div className="flex flex-col gap-5">
              <div>
                <p className="text-black  text-xl font-medium">Services</p>
              </div>
              <div className="flex flex-col gap-3">
                <a href="https://securedapp.io/smart-contract-audit" className="text-black text-sm ">Audit</a>
                <a href="https://securedapp.io/web3-security" className="text-black text-sm ">Security </a>
                <a href="https://securedapp.io/crypto-compliance-aml" className="text-black text-sm ">Regulatory Solutions</a>
                <a href="https://securedapp.io/levelup-academy" className="text-black text-sm ">Training & Education</a>
              </div>
            </div>

            <div className="flex flex-col gap-5">
              <div>
                <a href="https://securedapp.io/" className="text-black  text-xl font-medium">Company</a>
              </div>
              <div className="flex flex-col gap-3">
                <a href="https://securedapp.io/about" className="text-black text-sm ">About Us</a>
                <a href="https://securedapp.io/authors" className="text-black text-sm ">Authors</a>
                <a href="https://securedapp.io/media" className="text-black text-sm ">Media</a>
                <a href="https://securedapp.gitbook.io/securedapp-launchpad/careers" className="text-black text-sm ">Career</a>
                <a href="https://securedapp.gitbook.io/securedapp-launchpad/contact-us" className="text-black text-sm ">Contact Us</a>
              </div>
            </div>

            <div className="flex flex-col gap-5">
              <div>
                <a href="https://securedapp.gitbook.io/securedapp-launchpad" className="text-black  text-xl font-medium">Resources</a>
              </div>
              <div className="flex flex-col gap-3">
                <a href="https://securedapp.io/blog" className="text-black text-sm ">Blogs</a>
                <a href="https://securedapp.io/audits" className="text-black text-sm ">Audits</a>
                <a href="https://securedapp.io/solidity-shield-vulnerabilities" className="text-black text-sm ">Vulnerabilities</a>
                <a href="https://github.com/securedapp-github" className="text-black text-sm ">Github</a>
                <a href="https://securedapp.gitbook.io/securedapp-launchpad/workplace-policy" className="text-black text-sm ">Workplace Policy</a>
                <a href="https://securedapp.gitbook.io/securedapp-launchpad/shipping-and-delivery-policy" className="text-black text-sm ">Shipping & Delivery Policy</a>
                <a href="https://securedapp.gitbook.io/securedapp-launchpad/pricing-policy" className="text-black text-sm ">Pricing Policy</a>
                <a href="https://securedapp.gitbook.io/securedapp-launchpad/cancellation-and-refund-policy" className="text-black text-sm ">Cancellation & Refunds</a>
                <a href="https://securedapp.gitbook.io/securedapp-launchpad" className="text-black text-sm ">Whitepaper</a>
                
              </div>
            </div>
          </div>
        </div>

        <div className="w-full  bg-white flex justify-center items-center">
          <div className="w-[80%] h-[1px]  bg-black"></div>
        </div>

        <div className="w-full bg-white  flex justify-around gap-6 flex-wrap py-16">
          <div className="flex gap-5 flex-wrap items-center">
            <a className="text-black  text-center font-medium" href='https://securedapp.gitbook.io/securedapp-launchpad/privacy-policy-securedapp' target='_blank'>Privacy Policy</a>
            <GoDotFill className="text-black text-xl  text-center font-medium" />
            <a className="text-black  text-center font-medium" href='https://securedapp.gitbook.io/securedapp-launchpad/disclaimer-and-risk-securedapp' target='_blank'>Term of Conditions</a>
          </div>

          <div>
            <p className="text-black  text-center font-medium">
              © {currentYear}, Vettedcode Technologies India Pvt. Ltd.. All rights reserved 
            </p>
          </div>
        </div>
    </div>
  )
}
