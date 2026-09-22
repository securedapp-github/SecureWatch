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

  const navigationItems = [
    { to: "/dashboard", icon: <TbClockHour9 className="text-2xl" />, text: "Realtime Security" },
    { href: "https://securedapp.io/solidity-shield", icon: <GrDocumentText className="text-2xl" />, text: "Security Audit", external: true },
    { to: "/historical_insights", icon: <FaRegCalendarAlt className="text-2xl" />, text: "Historical Insights" },
    { href: "https://securedapp.io/secure-trace", icon: <PiSquaresFourBold className="text-2xl" />, text: "Blockchain Forensics", external: true },
    { to: "/analyticsmodule", icon: <RiPieChartLine className="text-2xl" />, text: "Analytics & Reporting" },
    { to: "/admin", icon: <IoPersonSharp className="text-2xl" />, text: "Admin Panel" },
    { to: "/comingsoon", icon: <LuNetwork className="text-2xl" />, text: "Integration Hub" },
  ];

  const sidebarVariants = {
    expanded: { width: "270px", transition: { duration: 0.25, ease: "easeOut" } },
    collapsed: { width: "88px", transition: { duration: 0.25, ease: "easeOut" } },
  };

  const textVariants = {
    hidden: { opacity: 0, x: -8 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.2 } },
  };

  return (
    <motion.aside
      id="sidebar"
      onMouseEnter={() => setExpand(true)}
      onMouseLeave={() => setExpand(false)}
      animate={expand ? "expanded" : "collapsed"}
      variants={sidebarVariants}
      className={`${
        expand ? "bg-white shadow-2xl items-start" : "bg-[#FAFAFA] items-center"
      } border-r border-gray-200 border-t border-gray-200 h-[calc(100vh-80px)] ${
        isAdminRoute ? "lg:flex" : "sm:flex"
      } flex-col justify-between fixed top-20 left-0 hidden z-40 py-5 transition-colors select-none`}
    >
      <div className={`flex flex-col w-full gap-2 ${expand ? "px-4" : "px-3"}`}>
        {navigationItems.map((item, index) => {
          const isActive = item.to && (location.pathname === item.to || (item.to !== "/dashboard" && location.pathname.startsWith(item.to)));

          const content = (
            <div
              className={`group relative flex items-center gap-3.5 w-full px-3 py-2.5 rounded-xl transition-all duration-150 cursor-pointer ${
                isActive
                  ? "bg-[#2d5c8f] text-white shadow-sm font-medium"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
              title={!expand ? item.text : ""}
            >
              {/* Active bar indicator */}
              {isActive && (
                <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-blue-300 rounded-r-full" />
              )}

              <div className={`flex-shrink-0 flex items-center justify-center ${isActive ? "text-white" : "text-slate-600 group-hover:text-blue-600"}`}>
                {item.icon}
              </div>

              <AnimatePresence>
                {expand && (
                  <motion.span
                    variants={textVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="text-sm text-nowrap tracking-wide font-medium"
                  >
                    {item.text}
                  </motion.span>
                )}
              </AnimatePresence>

              {/* Floating Tooltip when collapsed */}
              {!expand && (
                <div className="pointer-events-none absolute left-full ml-3 px-2.5 py-1 bg-slate-900 text-white text-xs rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-150 whitespace-nowrap z-50">
                  {item.text}
                </div>
              )}
            </div>
          );

          const LinkComponent = item.external ? "a" : Link;
          const linkProps = item.external
            ? { href: item.href, target: "_blank", rel: "noopener noreferrer" }
            : { to: item.to };

          return (
            <LinkComponent key={index} {...linkProps} className="w-full block">
              {content}
            </LinkComponent>
          );
        })}
      </div>

      <div className={`flex items-center gap-3 w-full border-t border-gray-200 pt-4 ${expand ? "px-5" : "justify-center"}`}>
        <img
          src={SecureDapp}
          alt="SecureDapp logo"
          className="w-8 h-8 object-contain flex-shrink-0"
        />
        <AnimatePresence>
          {expand && (
            <motion.div
              variants={textVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="flex flex-col overflow-hidden"
            >
              <span className="text-slate-900 font-bold text-sm tracking-tight">SecureWatch</span>
              <span className="text-slate-400 text-xs font-normal">v1.2.0 • Online</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.aside>
  );
}
