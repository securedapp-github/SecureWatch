import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./navbar";
import Home from "../images/home1.png";
import Security from "../images/security.png";
import c1 from "../images/c1.png";
import c2 from "../images/c2.png";
import c3 from "../images/c3.png";
import c4 from "../images/c4.png";
import c5 from "../images/Rocket.png";
import "../index.css";
import c12 from "../images/c12.png";
import c13 from "../images/c13.png";
import c14 from "../images/c14.png";
import c15 from "../images/c15.png";
import c16 from "../images/c16.png";
import c17 from "../images/c17.png";
import c18 from "../images/c18.png";
import c19 from "../images/c19.jpeg";
import Footer from "./footer";
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
import { FaInstagram } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";

function Home1() {
  const navigate = useNavigate();
  useEffect(() => {
    const login = localStorage.getItem("login");
    if (login) {
      navigate("/dashboard");
    }
  }, []);
  return (
    <>
      <div className=" bg-white">
        <div
          // id="home_heading"
          className=" flex flex-col justify-center items-cente w-full dark:bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-[#4374b0] via-[#13345f] to-[#001938] "
        >
          <Navbar />
          <div className="font-inter text-center text-[#001938] dark:text-white text-2xl">
            {" "}
            Confidence in every transaction
          </div>
          <div className="text-3xl md:text-5xl  font-poppin text-center mt-4 text-[#001938] dark:text-white">
            Empower Your Transactions with{" "}
          </div>
          <div className="mt-1 text-center">
            <span className=" text-3xl md:text-5xl font-poppin text-center text-[#001938] dark:text-white">
              SecureWatch’s
            </span>
            <span className="text-3xl md:text-5xl font-poppin text-center text-[#001938] dark:text-white">
              {" "}
              Real-Time Confidence.
            </span>
          </div>
          <div className=" mt-5 font-inter text-center text-[#001938] dark:text-white">
            Unlock the Future of Transaction Security – Proactive Monitoring,
          </div>
          <div className=" font-inter text-center text-[#001938] dark:text-white">
            Intuitive Insights, and Seamless Scalability Await You with
            SecureWatch
          </div>
          <button className="rounded-xl px-4 py-2 text-[#001938] dark:text-white bg-green-600 mt-10 flex justify-center items-center w-40 mx-auto ">
            <Link to="/signup">
              <div>Start for free</div>
            </Link>
            {/* <div className="my-auto">
              <svg
                width="13"
                height="10"
                viewBox="0 0 13 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M7.58793 9.98251L12.4053 5.16512L7.58793 0.347723L6.6435 1.29316L9.84674 4.4964H0.0976562V5.83384H9.84674L6.6435 9.03708L7.58793 9.98251Z"
                  fill="white"
                />
              </svg>
            </div> */}
          </button>

          <div className="mt-10 mx-auto">
            <img src={Home} alt="" className="s shadow-2xl" />
          </div>
        </div>

        <div className="w-full dark:bg-[#001938]">
          <h1 className="text-[#001938] dark:text-white text-center font-sans text-4xl pt-16">
            About Secure <span className="text-green-500">Watch</span>
          </h1>
          <p className="text-[#001938] dark:text-white text-center font-sans text-lg w-[98%] sm:w-[93%] lg:w-[70%] mx-auto mt-5">
            SecureWatch is a cutting-edge real-time monitoring service crafted
            to ensure the security and integrity of critical transactions within
            web applications. It provides businesses with the peace of mind they
            need to operate confidently in the digital landscape by actively
            detecting and responding to potential threats and anomalies.
          </p>
          <p className="text-[#001938] dark:text-white text-center font-sans text-lg w-[98%] sm:w-[93%] lg:w-[50%] mx-auto mt-5">
            Comply with needed regulations and have complete visibility and
            control of your Web3 environment, 24-7, safeguarding client assets &
            stopping illicit finance.
          </p>

          <div className="mx-auto w-[60%] h-[1px] bg-slate-500 my-10"></div>

          <p className="text-[#001938] dark:text-white text-center font-sans text-2xl w-[98%] sm:w-[93%] lg:w-[50%] mx-auto mt-">
            Essential Components Monitoring Anomalies <br /> with Empowering
            Dashboards{" "}
          </p>

          <div className="w-full mt-6 flex justify-center gap-7 flex-wrap pb-20">
            <div className="w-64 dark:bg-[#0f2744] border-2 border-[#d2e6ff] dark:border-slate-600 flex flex-col justify-start items-start p-5 gap-3 rounded-xl">
              <FaHandshakeAngle className="text-[#001938] dark:text-white text-5xl" />
              <p className="text-2xl text-[#001938] dark:text-white font-sans">
                Fortifying Transaction Integrity
              </p>
              <p className="text-[#001938] dark:text-white font-sans">
                Real-time analysis using advanced algorithms to scrutinize every
                transaction, ensuring the security of critical transactions
                within web applications.
              </p>
            </div>

            <div className="w-64 dark:bg-[#0f2744] border-2 border-[#d2e6ff] dark:border-slate-600 flex flex-col justify-start items-start p-5 gap-3 rounded-xl">
              <MdSpeed className="text-[#001938] dark:text-white text-5xl" />
              <p className="text-2xl text-[#001938] dark:text-white font-sans">Secure Dashboard</p>
              <p className="text-[#001938] dark:text-white font-sans">
                A user-friendly dashboard offering customizable views, real-time
                analytics, and historical data for decision-making in monitoring
                critical transactions.
              </p>
            </div>

            <div className="w-64 dark:bg-[#0f2744] border-2 border-[#d2e6ff] dark:border-slate-600 flex flex-col justify-start items-start p-5 gap-3 rounded-xl">
              <FaSearch className="text-[#001938] dark:text-white text-4xl" />
              <p className="text-2xl text-[#001938] dark:text-white font-sans">
                Anomaly Detection System
              </p>
              <p className="text-[#001938] dark:text-white font-sans">
                Constantly adapting this system triggers instant alerts upon
                detecting deviations, supporting company-level alerting rules
                and efficient case management.
              </p>
            </div>

            <div className="w-64 dark:bg-[#0f2744] border-2 border-[#d2e6ff] dark:border-slate-600 flex flex-col justify-start items-start p-5 gap-3 rounded-xl">
              <IoDocumentTextOutline className="text-[#001938] dark:text-white text-5xl" />
              <p className="text-2xl text-[#001938] dark:text-white font-sans">
                Compliance and Reporting
              </p>
              <p className="text-[#001938] dark:text-white font-sans">
                Built-in reporting ensures regulatory compliance, generating
                comprehensive reports for audits and data integrity commitment.
              </p>
            </div>
          </div>
        </div>

        <div className="text-3xl md:text-5xl mt-20 text-center font-sans text-[#001938]">
          Benefits
        </div>
        <p className="text-[#001938] font-sans text-center font-medium mt-4">
          Empowering Security, Trust, Compliance, Growth, and Peace of Mind
        </p>

        <div className="w-full flex justify-center items-center gap-5 flex-wrap mt-7">
          <div className="pt-5 py-3 px-4 flex flex-col gap-4 rounded-xl border-2 border-[#d2e6ff] w-80 lg:w-[25%] h-72">
            <FiUnlock className="text-[#001938] text-3xl " />
            <div className="flex flex-col gap-3">
              <p className="text-[#001938] text-xl font-medium">
                Proactive Security
              </p>
              <p className="text-[#001938]">
                Identify and address potential security threats in real-time
                with advanced algorithms and continuous monitoring, ensuring the
                integrity of critical transactions
              </p>
            </div>
          </div>

          <div className="pt-5 py-3 px-4 flex flex-col gap-4 rounded-xl border-2 border-[#d2e6ff] w-80 lg:w-[25%] h-72">
            <RiDiscountPercentLine className="text-[#001938] text-3xl " />
            <div className="flex flex-col gap-3">
              <p className="text-[#001938] text-xl font-medium">
                Proactive Security
              </p>
              <p className="text-[#001938]">
                Identify and address potential security threats in real-time
                with advanced algorithms and continuous monitoring, ensuring the
                integrity of critical transactions
              </p>
            </div>
          </div>

          <div className="pt-5 py-3 px-4 flex flex-col gap-4 rounded-xl border-2 border-[#d2e6ff] w-80 lg:w-[25%] h-72">
            <RiBugLine className="text-[#001938] text-3xl " />
            <div className="flex flex-col gap-3">
              <p className="text-[#001938] text-xl font-medium">
                Proactive Security
              </p>
              <p className="text-[#001938]">
                Identify and address potential security threats in real-time
                with advanced algorithms and continuous monitoring, ensuring the
                integrity of critical transactions
              </p>
            </div>
          </div>
        </div>

        <div className="w-full mt-7 flex justify-center flex-wrap gap-7 pb-16">
          <div className="pt-5 py-3 px-4 flex flex-col gap-4 rounded-xl border-2 border-[#d2e6ff] w-80 md:w-[70%] lg:w-[38%] h-72">
            <LuShieldClose className="text-[#001938] text-3xl " />
            <div className="flex flex-col gap-3">
              <p className="text-[#001938] text-xl font-medium">
                Compliance Assurance
              </p>
              <p className="text-[#001938]">
                Meet regulatory requirements effortlessly with SecureWatch's
                built-in reporting features, facilitating audits and
                demonstrating a commitment to data integrity and compliance.
              </p>
            </div>
          </div>

          <div className="pt-5 py-3 px-4 flex flex-col gap-4 rounded-xl border-2 border-[#d2e6ff] w-80 md:w-[70%] lg:w-[38%] h-72">
            <GrDocumentPerformance className="text-[#001938] text-3xl " />
            <div className="flex flex-col gap-3">
              <p className="text-[#001938] text-xl font-medium">Scalability</p>
              <p className="text-[#001938]">
                Grow your business with confidence, knowing that SecureWatch's
                scalable architecture adapts to the evolving needs of your
                operations, effortlessly.
              </p>
            </div>
          </div>
        </div>

        <div className="w-full flex flex-col  dark:bg-[#011b3a] bg-[#f2f4f9]">
          <img src={GraphicTop} alt="" />

          <div className="w-full text-center md:w-1/2 mx-auto text-3xl md:text-4xl mt-14 font-inter text-[#001938] dark:text-white">
            Try SecureWatch now, <br /> it's free and easy to set up
          </div>
          <div className="w-full mx-auto text-center">
            <Link to="/signup">
              <button className="rounded-lg px-4 py-2 text-black mx-auto bg-green-600 my-5 font-inter">
                Sign Up-it's free
              </button>
            </Link>
          </div>

          <img src={GraphicBottom} alt="" />
        </div>

        <div className="w-full dark:bg-[#001938] flex items-center justify-around py-20 gap-6 flex-wrap">
          <div>
            <p className="text-[#001938] dark:text-white text-xl">Join our newsletter</p>
            <p className="text-[#001938] dark:text-white">
              {" "}
              Keep up to date with everything Secure Dapp
            </p>
          </div>

          <div className="flex gap-5 flex-wrap justify-center items-center">
            <input
              type="email"
              className="dark:bg-[#223a58] bg-[#f8fbff] text-[#001938] dark:text-white w-[96%] sm:w-80 border rounded-lg px-4 py-2 dark:border-[#576e8a] border-[#a4cdff] "
              placeholder="Enter Your Email "
            />
            <button className="text-black px-4 py-2 bg-green-600 rounded-lg">
              Subscribe
            </button>
          </div>
        </div>

        <div className="w-full dark:bg-[#001938] flex justify-center items-center">
          <div className="w-[80%] h-[1px] bg-[#22365b]"></div>
        </div>

        <div className="w-full dark:bg-[#001938] flex justify-around py-16 gap-6 flex-wrap">
          <div className="flex gap-6">
            <a href="#"> <FaInstagram className="text-[#001938] dark:text-white text-3xl" /></a>
            <a href="#"> <FaFacebook className="text-[#001938] dark:text-white text-3xl" /></a>
            <a href=""><FaLinkedin className="text-[#001938] dark:text-white text-3xl" /></a>
            <a href=""><FaYoutube className="text-[#001938] dark:text-white text-3xl" /></a>
          </div>

          <div className="flex gap-8 flex-wrap justify-center ">
            <div className="flex flex-col gap-5">
              <div>
                <p className="text-[#001938] dark:text-white text-xl font-medium">Product</p>
              </div>
              <div className="flex flex-col gap-3">
                <p className="text-[#001938] dark:text-white">Solidity Shield Scan</p>
                <p className="text-[#001938] dark:text-white">Secure Watch</p>
                <p className="text-[#001938] dark:text-white">Secure Audit</p>
              </div>
            </div>

            <div className="flex flex-col gap-5">
              <div>
                <p className="text-[#001938] dark:text-white text-xl font-medium">Services</p>
              </div>
              <div className="flex flex-col gap-3">
                <p className="text-[#001938] dark:text-white">Features</p>
                <p className="text-[#001938] dark:text-white">Integrations </p>
                <p className="text-[#001938] dark:text-white">Pricing</p>
                <p className="text-[#001938] dark:text-white">Changelog</p>
                <p className="text-[#001938] dark:text-white">Roadmap</p>
              </div>
            </div>

            <div className="flex flex-col gap-5">
              <div>
                <p className="text-[#001938] dark:text-white text-xl font-medium">Company</p>
              </div>
              <div className="flex flex-col gap-3">
                <p className="text-[#001938] dark:text-white">About Us</p>
              </div>
            </div>

            <div className="flex flex-col gap-5">
              <div>
                <p className="text-[#001938] dark:text-white text-xl font-medium">Resources</p>
              </div>
              <div className="flex flex-col gap-3">
                <p className="text-[#001938] dark:text-white">Blogs</p>
                <p className="text-[#001938] dark:text-white">Documentation </p>
                <p className="text-[#001938] dark:text-white">Contact</p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full dark:bg-[#001938] flex justify-center items-center">
          <div className="w-[80%] h-[1px] bg-[#22365b]"></div>
        </div>

        <div className="w-full dark:bg-[#001938] flex justify-around gap-6 flex-wrap py-16">
          <div className="flex gap-5 flex-wrap ">
            <p className="text-[#001938] dark:text-white text-center">Privacy Policy</p>
            <p className="text-[#001938] dark:text-white text-center">Term of Conditions</p>
          </div>

          <div>
            <p className="text-[#001938] dark:text-white text-center">
              All Rights Reserved. © Copyright 2023. SecureWatch - LLC
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home1;
