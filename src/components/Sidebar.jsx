import React, { useState } from "react";
import { TbClockHour9 } from "react-icons/tb";
import { GrDocumentText } from "react-icons/gr";
import { FaRegCalendarAlt } from "react-icons/fa";
import { PiSquaresFourBold } from "react-icons/pi";
import { RiPieChartLine } from "react-icons/ri";
import { IoPersonSharp } from "react-icons/io5";
import { LuNetwork } from "react-icons/lu";
import SecureDapp from "../images/SecureDapp.png";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const [expand, setExpand] = useState(false);
  const location = useLocation();
  const isAdminRoute = location.pathname === "/admin";
  return (
    <div
      id="sidebar"
      onMouseOver={() => setExpand(true)}
      onMouseLeave={() => setExpand(false)}
      className={`${
        expand ? "bg-white shadow-2xl items-start" : "bg-[#FAFAFA] items-center"
      } border-r-2 border-r-[#D3D3D3] border-t-2 border-t-[#D3D3D3] h-full ${isAdminRoute ? "lg:flex" : "sm:flex"} flex-col justify-start  fixed mt-20 hidden z-50 `}
    >
      <div
        className={` flex flex-col  gap-7  ${
          expand ? "m-0 pr-12 mt-5" : "m-0 mt-5"
        }`}
      >
        {expand ? (
          <div className="flex flex-col justify-center">
            <Link to="/dashboard" className="bg-[#2d5c8f] rounded-r-full p-3 text-white flex items-center gap-3 pr-14 py-4">
              <TbClockHour9 className="text-white text-2xl" /> Realtime Security
            </Link>
          </div>
        ) : (
          <div to="/dashboard" className="flex flex-col justify-center">
            <button className="bg-[#2d5c8f] rounded-full p-3">
              <TbClockHour9 className="text-white text-2xl" />
            </button>
          </div>
        )}

        <div
          className={`flex flex-col  ${
            expand ? "items-start ml-5 " : "items-center "
          } justify-center gap-7 `}
        >
          <a href="https://securedapp.io/solidity-shield" className={`${expand ? "flex items-center gap-3" : ""}`}>
            <GrDocumentText className="text-2xl text-gray-600" />{" "}
            <span className="text-[#6A6A6A]">
              {expand ? "Security Audit" : ""}
            </span>{" "}
          </a>
          <Link to="/historical_insights" className={`${expand ? "flex items-center gap-3" : ""}`}>
            <FaRegCalendarAlt className="text-2xl text-gray-600" />{" "}
            <span className="text-[#6A6A6A]">
              {expand ? "Historical Insights" : ""}
            </span>{" "}
          </Link>
          <a href="https://securedapp.io/secure-trace" className={`${expand ? "flex items-center gap-2" : ""}`}>
            <PiSquaresFourBold className="text-3xl text-gray-600" />{" "}
            <span className="text-[#6A6A6A]">
              {expand ? "Blockchain Forensics" : ""}
            </span>{" "}
          </a>
          <Link to="/analyticsmodule" className={`${expand ? "flex items-center gap-2" : ""}`}>
            <RiPieChartLine className="text-3xl text-gray-600" />{" "}
            <span className="text-[#6A6A6A]">
              {expand ? "Analytics & Reporting" : ""}
            </span>{" "}
          </Link>
          <Link to="/admin" className={`${expand ? "flex items-center gap-2" : ""}`}>
            <IoPersonSharp className="text-3xl text-gray-600" />{" "}
            <span className="text-[#6A6A6A]">{expand ? "Admin Panel" : ""}</span>{" "}
          </Link>
          <Link to="/comingsoon" className={`${expand ? "flex items-center gap-2" : ""}`}>
            <LuNetwork className="text-3xl text-gray-600" />{" "}
            <span className="text-[#6A6A6A]">
              {expand ? "Integration Hub" : ""}
            </span>{" "}
          </Link>
        </div>
      </div>
      <div className="mt-24 m-5 flex gap-1 items-center justify-start">
        <img src={SecureDapp} alt="SecureDapp logo" className="w-14" />
        <span className="text-black logo text-lg">
          {expand ? "Securewatch" : ""}
        </span>
      </div>
    </div>
  );
}
