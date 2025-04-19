import React, { useEffect, useState } from "react";
import { HiDotsVertical } from "react-icons/hi";
import NewNavbar from "./NewNavbar";
import Sidebar from "./Sidebar";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Polygon from "../images/Polygon.png"
import Ethereum from "../images/Eth.png"
import Blits from "../images/Blits.png"
import Algorand from "../images/Algorand.png"
import Base from "../images/Base.png"

const plans = [
    {
      title: "Guardian",
      price: 69, // Store as number for calculation
      planDetails: [
        "Protection for small teams",
        "Startups, freelancers, small teams (1–5 users)",
        "251 Securewatch Credits per month",
      ],
      features: [
        "Real-time threat detection and alert",
        "Up to 5 monitors",
        "Analytics",
        "Historic Incidents",
        "No credit card required",
        "DPDP/GDPR compliant",
      ],
    },
    {
      title: "Sentinel",
      price: 199,
      planDetails: [
        "SMBs (5–20 users)",
        "999 Securewatch Credits per month",
      ],
      features: [
        "Everything in Guardian.",
        "Up to 10 monitors",
        "Advanced threat intelligence",
        "DPDP/GDPR compliant",
        "AutoGuard Feature",
        "Historic Incidents & download Reports",
        "Priority email support (24/hr res)",
        "Analytics and Reports",
        "Trusted by 1,000+ businesses",
      ],
    },
    {
      title: "Fortress",
      price: 399,
      planDetails: [
        "Comprehensive, enterprise",
        "Enterprises",
        "Custom Securewatch Credits",
      ],
      features: [
        "Everything in Sentinel",
        "Upto 25 monitors",
        "Custom integrations (API access).",
        "Dedicated account manager + 24/7 email support",
        "AutoGuard",
        "Historic Incidents and Reports",
        "Custom integrations (API access).",
        "Used by Big Brand",
        "99.9% uptime SLA",
        "Onboarding Support",
        "Priority support",
        "Dev Setup Support",
      ],
    },
];

const PricingCard = ({ title, price, planDetails, features, isAnnual }) => {
  const monthlyPrice = `$${price}/mth`;
  const annualPrice = `$${Math.round(price * 0.83)}/mth`; // 17% discount

  return (
    <div className="bg-white rounded-3xl border-2 border-[#ECECEC] shadow-md p-6 w-full max-w-md mx-auto hover:scale-105 transition-transform">
      <div className="flex items-center justify-between ">
        <h2 className="text-4xl font-bold text-[#2D5C8F]">{title}</h2>
        <div className="text-white text-lg font-semibold bg-green-500 w-fit px-6 py-2 rounded-xl">
          {isAnnual ? (
            <div>
              <span className="line-through text-sm">{monthlyPrice}</span>
              <br />
              <span>{annualPrice}</span>
            </div>
          ) : (
            monthlyPrice
          )}
        </div>
      </div>
      
      <div className="mb-4 mt-4">
        <div className="w-full flex gap-3 items-center">
          <h3 className="text-[#2D5C8F] font-semibold mb-1">Plan</h3>
          <div className="w-[90%] h-[2px] bg-[#D3D3D3] rounded-full"></div>
        </div>
        
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          {planDetails.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </div>
      <div>
        <div className="w-full flex gap-3 items-center">
          <h3 className="text-[#2D5C8F] font-semibold mb-1">Features</h3>
          <div className="w-[90%] h-[2px] bg-[#D3D3D3] rounded-full"></div>
        </div>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          {features.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const Pricing = () => {
    const navigate = useNavigate();
    const userEmail = localStorage.getItem("email");
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const parent_id = localStorage.getItem("parent_id");
    const is_admin = localStorage.getItem("is_admin");

    const [loading, setLoading] = useState(true);
    const [value, setValue] = useState(10);
    const [isAnnual, setIsAnnual] = useState(false); // New state for billing toggle

    return (
        <div className="w-full min-h-full">
            <NewNavbar email={userEmail} />
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            <div className="bg-[#FAFAFA] w-full flex h-full">
                <Sidebar />

                <div className="h-full lg:flex flex-col gap-5 ml-[100px] mt-20 hidden">
                    <div className="mt-5 py-3 pl-4 pr-20 rounded-r-full bg-[#0A65C9]">
                        <h1 className="text-white font-semibold text-nowrap">Admin Panel</h1>
                    </div>
                    <div className="flex flex-col gap-5 ml-5">
                        <Link to="/admin" className="text-[#6A6A6A]">
                            Account access
                        </Link>
                        <Link to="/billing" className="text-[#6A6A6A]">
                            Billing
                        </Link>
                        <Link to="/pricing" className="text-[#2D5C8F] font-semibold">
                            Plans
                        </Link>
                    </div>
                </div>

                <div className="min-h-screen mt-20 w-full pb-20">
                    <div className="py-12 px-4 bg-gray-50 min-h-screen">
                        <div className="text-center mb-10">
                            <h1 className="text-3xl font-bold text-[#2D5C8F]">
                                Start Free Trial - <span className="text-[#4A4A4A] font-medium">No card required during trial period.</span>
                            </h1>
                            <p className="text-[#4A4A4A] mt-2">
                                SecureWatch: Global Protection, Trusted by Thousands
                            </p>
                            <div className="flex justify-center space-x-4 mt-4">
                                <label className="flex items-center space-x-2 text-black">
                                    <input 
                                        type="radio" 
                                        name="billing" 
                                        checked={!isAnnual}
                                        onChange={() => setIsAnnual(false)}
                                        className="radio bg-white" 
                                    />
                                    <span>Pay monthly</span>
                                </label>
                                <label className="flex items-center space-x-2 text-black">
                                    <input 
                                        type="radio" 
                                        name="billing" 
                                        checked={isAnnual}
                                        onChange={() => setIsAnnual(true)}
                                        className="radio bg-white" 
                                    />
                                    <span>Pay annually (Save 17%)</span>
                                </label>
                            </div>
                        </div>
                        <div className="grid gap-6 md:grid-cols-3 max-w-6xl mx-auto">
                            {plans.map((plan, index) => (
                                <PricingCard key={index} {...plan} isAnnual={isAnnual} />
                            ))}
                        </div>
                    </div>
                    <div className="mt-16 max-w-6xl mx-auto w-full space-y-6">
                        <div className="flex flex-wrap items-center justify-around gap-6">
                            <span className="text-lg font-semibold text-gray-700">Trusted by:</span>
                            <img src={Polygon} alt="polygon" className="h-8" />
                            <img src={Ethereum} alt="ethereum" className="h-8" />
                            <img src={Blits} alt="BlitsEstates" className="h-8" />
                            <img src={Algorand} alt="algorand" className="h-8" />
                            <img src={Base} alt="base" className="h-8" />
                        </div>

                        <div className="bg-white rounded-full shadow px-6 py-4 flex flex-col flex-wrap md:flex-row md:justify-between md:items-center gap-4">
                            <div className="text-center md:text-left">
                                <p className="text-lg font-bold text-[#2D5C8F]">Build your first dashboard in minutes</p>
                                <p className="text-sm text-gray-500">Want to know more? Learn how to create dashboard.</p>
                            </div>
                            <button
                                onClick={() => navigate("/login")}
                                className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 transition"
                            >
                                Get started
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Pricing;