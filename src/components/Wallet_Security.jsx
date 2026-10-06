import React from "react";
import { Link } from "react-router-dom";
import NewNavbar from "./NewNavbar";
import Sidebar from "./Sidebar";
import Wallet_Security_Cmp from "./Wallet_Security_Cmp";
import { LuArrowLeft, LuPlus, LuWallet } from "react-icons/lu";

function Wallet_Security() {
  const userEmail = localStorage.getItem("email");
  const is_admin = localStorage.getItem("is_admin");

  return (
    <div className="w-full min-h-screen bg-[#FAFAFB]">
      <NewNavbar email={userEmail} />
      <div className="w-full flex min-h-screen">
        <Sidebar />

        <div className="main-content-layout p-4 sm:p-6 lg:p-8 flex flex-col gap-6 w-full">
          {/* Top Navigation & Breadcrumb */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 bg-white border border-slate-200 hover:border-blue-200 px-3 py-1.5 rounded-lg shadow-2xs transition"
                >
                  <LuArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Dashboard</span>
                </Link>
                <span className="text-slate-300">/</span>
                <span className="text-xs font-semibold text-slate-700">Wallet Monitors</span>
              </div>

              <div className="flex items-center gap-2 mt-1">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100">
                  <LuWallet className="w-5 h-5" />
                </div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  Wallet Monitors
                </h1>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                  Active Sentinel
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500">
                Continuous surveillance for treasury accounts, multisigs, and hot wallets against unauthorized transfers and abnormal outflows.
              </p>
            </div>

            {is_admin == 1 && (
              <Link
                to="/wallet_monitor_create"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold shadow-xs transition-all self-start sm:self-auto cursor-pointer"
              >
                <LuPlus className="w-4 h-4" />
                <span>Deploy Wallet Monitor</span>
              </Link>
            )}
          </div>

          {/* Wallet Monitors Table Component */}
          <Wallet_Security_Cmp />
        </div>
      </div>
    </div>
  );
}

export default Wallet_Security;
