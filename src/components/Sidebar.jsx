import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

  // Sidebar animations
  const sidebarVariants = {
    expanded: { width: "290px", transition: { duration: 0.4, ease: "easeInOut" } },
    collapsed: { width: "100px", transition: { duration: 0.4, ease: "easeInOut" } },
  };

  // Text animations
  const textVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3, delay: 0.2 } },
  };

  return (
    <motion.div
      id="sidebar"
      onMouseEnter={() => setExpand(true)}
      onMouseLeave={() => setExpand(false)}
      animate={expand ? "expanded" : "collapsed"}
      variants={sidebarVariants}
      className={`${
        expand ? "bg-white shadow-2xl items-start" : "bg-[#FAFAFA] items-center"
      } border-r-2 border-r-[#D3D3D3] border-t-2 border-t-[#D3D3D3] h-full ${
        isAdminRoute ? "lg:flex" : "sm:flex"
      } flex-col justify-start fixed mt-20 hidden z-50`}
    >
      <div className={`flex flex-col gap-7 ${expand ? "m-0 pr-12 mt-5" : "m-0 mt-5"}`}>
        <div className="flex justify-center">
          <Link
            to="/dashboard"
            className={`flex items-center gap-3 transition-all duration-300  ${
              expand ? "bg-[#2d5c8f] px-5 py-3 pr-14 rounded-r-full" : "bg-[#2d5c8f] p-3 rounded-full"
            } hover:bg-[#244d76]`}
          >
            <TbClockHour9 className="text-white text-2xl" />
            <AnimatePresence>
              {expand && (
                <motion.span
                  variants={textVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="text-white text-nowrap"
                >
                  Realtime Security
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        </div>

        <div className={`flex flex-col ${expand ? "items-start ml-5" : "items-center"} justify-center gap-7`}>
          {[
            { href: "https://securedapp.io/solidity-shield", icon: <GrDocumentText className="text-2xl text-gray-600" />, text: "Security Audit" },
            { to: "/comingsoon", icon: <FaRegCalendarAlt className="text-2xl text-gray-600" />, text: "Historical Insights" },
            { href: "https://securedapp.io/secure-trace", icon: <PiSquaresFourBold className="text-3xl text-gray-600" />, text: "Blockchain Forensics" },
            { to: "/comingsoon", icon: <RiPieChartLine className="text-3xl text-gray-600" />, text: "Analytics & Reporting" },
            { to: "/admin", icon: <IoPersonSharp className="text-3xl text-gray-600" />, text: "Admin Panel" },
            { to: "/comingsoon", icon: <LuNetwork className="text-3xl text-gray-600" />, text: "Integration Hub" },
          ].map((item, index) => (
            <motion.div
              key={index}
              className={`flex items-center ${expand ? "gap-3" : ""} hover:scale-105 transition`}
            >
              {item.href ? (
                <a href={item.href} className="flex items-center gap-2">
                  {item.icon}
                  <AnimatePresence>
                    {expand && (
                      <motion.span
                        variants={textVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className="text-[#6A6A6A] text-nowrap"
                      >
                        {item.text}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </a>
              ) : (
                <Link to={item.to} className="flex items-center gap-2">
                  {item.icon}
                  <AnimatePresence>
                    {expand && (
                      <motion.span
                        variants={textVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className="text-[#6A6A6A] text-nowrap"
                      >
                        {item.text}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      <div className="mt-24 m-5 flex gap-1 items-center justify-start">
        <motion.img
          src={SecureDapp}
          alt="SecureDapp logo"
          className="w-14"
          animate={{ scale: expand ? 1 : 0.9 }}
          transition={{ duration: 0.3 }}
        />
        <AnimatePresence>
          {expand && (
            <motion.span
              className="text-black logo text-lg"
              variants={textVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              Securewatch
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
