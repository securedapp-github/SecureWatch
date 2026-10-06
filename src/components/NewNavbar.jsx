import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  LuHeadphones,
  LuMenu,
  LuX,
  LuLogOut,
  LuUser,
  LuCreditCard,
  LuCopy,
  LuCheck,
  LuMail,
  LuPhone,
  LuShieldCheck,
  LuExternalLink,
  LuChevronDown,
} from "react-icons/lu";
import SecureDappLogo from "../images/SecureDapp.png";

export default function NewNavbar({ email: propEmail }) {
  const [toggleMobileMenu, setToggleMobileMenu] = useState(false);
  const [isSupportMenuOpen, setIsSupportMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [copiedItem, setCopiedItem] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  const supportRef = useRef(null);
  const profileRef = useRef(null);

  const storedEmail = localStorage.getItem("email") || "";
  const email = propEmail || storedEmail || "user@securedapp.io";

  const extractNameFromEmail = (e) => {
    if (!e) return "Auditor";
    const part = e.split("@")[0];
    return part.charAt(0).toUpperCase() + part.slice(1);
  };

  const getFirstLetter = (e) => {
    if (!e) return "U";
    return e.charAt(0).toUpperCase();
  };

  const name = extractNameFromEmail(email);
  const firstLetter = getFirstLetter(email);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(type);
    setTimeout(() => setCopiedItem(null), 1800);
  };

  // Close popovers on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (supportRef.current && !supportRef.current.contains(e.target)) {
        setIsSupportMenuOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setToggleMobileMenu(false);
  }, [location.pathname]);

  return (
    <header className="h-16 w-full fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between select-none">
      {/* Left: Brand & Mobile Trigger */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label={toggleMobileMenu ? "Close navigation menu" : "Open navigation menu"}
          onClick={() => setToggleMobileMenu(!toggleMobileMenu)}
          className="sm:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
        >
          {toggleMobileMenu ? <LuX className="w-5 h-5" /> : <LuMenu className="w-5 h-5" />}
        </button>

        <Link
          to="/dashboard"
          className="flex items-center gap-2.5 group no-underline p-1 -m-1 rounded-xl transition hover:opacity-95 focus:outline-none"
          title="SecureWatch"
          aria-label="SecureWatch Dashboard"
        >
          <img
            src={SecureDappLogo}
            alt="SecureWatch Logo"
            className="w-8 h-8 object-contain transition-transform duration-200 group-hover:scale-105 drop-shadow-sm shrink-0"
          />
          <span className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
            SecureWatch
          </span>
        </Link>
      </div>


      {/* Right: Support popover & Profile Pill */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Support Help Popover */}
        <div className="relative" ref={supportRef}>
          <button
            type="button"
            aria-label="Support contacts"
            onClick={() => setIsSupportMenuOpen(!isSupportMenuOpen)}
            className={`p-2 rounded-lg transition-colors border ${
              isSupportMenuOpen
                ? "bg-[#EBF3FA] text-[#2D5C8F] border-[#2D5C8F]/30"
                : "text-slate-600 hover:text-[#2D5C8F] hover:bg-[#EBF3FA] border-transparent"
            }`}
            title="Assistance & SOC Desk"
          >
            <LuHeadphones className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {isSupportMenuOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-50 flex flex-col gap-2.5 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Priority SOC Support
                </span>
                <span className="text-[10px] px-1.5 py-0.5 bg-emerald-50 text-emerald-700 font-semibold rounded border border-emerald-200">
                  24/7 Live
                </span>
              </div>

              {/* Phone Line */}
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100 hover:bg-slate-100/70 transition">
                <div className="flex items-center gap-2.5">
                  <LuPhone className="w-4 h-4 text-slate-600" />
                  <div className="flex flex-col">
                    <span className="text-[11px] text-slate-400 font-medium">Hotline</span>
                    <span className="text-xs font-mono font-semibold text-slate-800">
                      +91 9606015868
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard("9606015868", "phone")}
                  className="p-1 rounded text-slate-400 hover:text-slate-800"
                  title="Copy phone"
                >
                  {copiedItem === "phone" ? (
                    <LuCheck className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <LuCopy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              {/* Email Line */}
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100 hover:bg-slate-100/70 transition">
                <div className="flex items-center gap-2.5">
                  <LuMail className="w-4 h-4 text-slate-600" />
                  <div className="flex flex-col">
                    <span className="text-[11px] text-slate-400 font-medium">Incident Desk</span>
                    <span className="text-xs font-mono font-semibold text-slate-800">
                      hello@securedapp.in
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard("hello@securedapp.in", "email")}
                  className="p-1 rounded text-slate-400 hover:text-slate-800"
                  title="Copy email"
                >
                  {copiedItem === "email" ? (
                    <LuCheck className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <LuCopy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Pill */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-full border border-slate-200/90 hover:border-slate-300 bg-white hover:bg-slate-50 transition shadow-sm"
          >
            <div className="w-7 h-7 rounded-full bg-[#2D5C8F] text-white flex items-center justify-center text-xs font-bold font-mono">
              {firstLetter}
            </div>
            <span className="hidden sm:inline text-xs font-semibold text-slate-800 max-w-[110px] truncate">
              {name}
            </span>
            <LuChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {isProfileMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50 flex flex-col gap-1 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-2.5 border-b border-slate-100 flex flex-col">
                <span className="text-xs font-semibold text-slate-900 truncate">{email}</span>
                <span className="text-[11px] text-slate-400 font-medium">
                  Verified Security Auditor
                </span>
              </div>

              <div className="py-1 flex flex-col gap-0.5">
                <Link
                  to="/admin"
                  onClick={() => setIsProfileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-[#EBF3FA] hover:text-[#2D5C8F] transition"
                >
                  <LuUser className="w-4 h-4 text-slate-500" />
                  <span>Admin Console</span>
                </Link>
                <Link
                  to="/billing"
                  onClick={() => setIsProfileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-[#EBF3FA] hover:text-[#2D5C8F] transition"
                >
                  <LuCreditCard className="w-4 h-4 text-slate-500" />
                  <span>Plans & Subscriptions</span>
                </Link>
              </div>

              <div className="pt-1 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-rose-600 hover:bg-rose-50 transition"
                >
                  <LuLogOut className="w-4 h-4" />
                  <span>Sign out of Workspace</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Slide-Over Navigation Drawer */}
      {toggleMobileMenu && (
        <div className="fixed inset-0 top-16 z-50 sm:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setToggleMobileMenu(false)}
          />

          {/* Drawer Menu */}
          <div className="relative w-4/5 max-w-xs h-[calc(100vh-64px)] bg-white shadow-2xl border-r border-slate-200 flex flex-col justify-between p-4 overflow-y-auto">
            <div className="flex flex-col gap-4">
              {/* Account Quick Card */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#2D5C8F] text-white flex items-center justify-center font-bold text-sm">
                  {firstLetter}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-semibold text-slate-900 truncate">{email}</span>
                  <span className="text-[10px] text-slate-500">Security Operator</span>
                </div>
              </div>

              {/* Navigation Links */}
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1">
                  Monitoring
                </span>
                <Link
                  to="/dashboard"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  <LuShieldCheck className="w-4 h-4 text-slate-500" /> Realtime Security
                </Link>
                <Link
                  to="/contract_incidents"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  Contract Incidents
                </Link>
                <Link
                  to="/autodefend"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  Autodefend Engine
                </Link>

                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 pt-3 py-1">
                  Analytics & Forensics
                </span>
                <Link
                  to="/historical_insights"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  Historical Insights
                </Link>
                <Link
                  to="/analyticsmodule"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  Analytics & Reports
                </Link>
                <a
                  href="https://securedapp.io/solidity-shield"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  <span>Security Audit</span>
                  <LuExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </a>
                <a
                  href="https://securedapp.io/secure-trace"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  <span>Blockchain Forensics</span>
                  <LuExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </a>

                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 pt-3 py-1">
                  System
                </span>
                <Link
                  to="/admin"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  Admin Panel
                </Link>
                <Link
                  to="/billing"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  Billing & Plans
                </Link>
              </div>
            </div>

            {/* Logout button at bottom */}
            <div className="pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-slate-100 text-slate-700 font-semibold text-xs hover:bg-rose-50 hover:text-rose-600 transition"
              >
                <LuLogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
