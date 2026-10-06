import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { LuHeadphones, LuMail, LuPhone, LuCopy, LuCheck } from "react-icons/lu";
import SecureDappLogo from "../images/SecureDapp.png";

export default function NewNavbar2() {
  const [isSupportMenuOpen, setIsSupportMenuOpen] = useState(false);
  const [copiedItem, setCopiedItem] = useState(null);
  const supportRef = useRef(null);

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(type);
    setTimeout(() => setCopiedItem(null), 1800);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (supportRef.current && !supportRef.current.contains(e.target)) {
        setIsSupportMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="h-16 w-full fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between select-none">
      <Link
        to="/"
        className="flex items-center gap-2.5 group no-underline p-1 -m-1 rounded-xl transition hover:opacity-95 focus:outline-none"
        title="SecureWatch"
        aria-label="SecureWatch"
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

      <div className="relative" ref={supportRef}>
        <button
          type="button"
          aria-label="Support contacts"
          onClick={() => setIsSupportMenuOpen(!isSupportMenuOpen)}
          className={`p-2 rounded-lg transition-colors border ${
            isSupportMenuOpen
              ? "bg-[#EBF3FA] text-[#2D5C8F] border-[#2D5C8F]/40"
              : "text-slate-600 hover:text-[#2D5C8F] hover:bg-[#EBF3FA] border-transparent"
          }`}
          title="Assistance Desk"
        >
          <LuHeadphones className="w-5 h-5" />
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
              >
                {copiedItem === "phone" ? (
                  <LuCheck className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <LuCopy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

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
    </header>
  );
}
