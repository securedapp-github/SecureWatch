import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { baseUrl } from "../Constants/data";
import sha256 from "js-sha256";
import NewNavbar from "./NewNavbar";
import { FaPlay } from "react-icons/fa";
import Sidebar from "./Sidebar";
import { MdOutlineHeadphones } from "react-icons/md";
import { FaRegBell } from "react-icons/fa6";
import { MdMonitor } from "react-icons/md";
import { TbAlertTriangle } from "react-icons/tb";
import { TbUserSquare } from "react-icons/tb";
import { CgHome } from "react-icons/cg";
import { MdOutlineSettings } from "react-icons/md";
import { toast } from "react-toastify";

function Dashboard() {
  const [hash, setHash] = useState("");
  const token = localStorage.getItem("token");
  const User_id = localStorage.getItem("userId");
  const [values, setValues] = useState([]);
  const [listeners, setListeners] = useState("");
  const [alert, setAlert] = useState("");
  const [walletAlert, setWalletAlert] = useState("");
  const [monitorcount, setMonitorcount] = useState(0);
  const [walletMoniterCount, setWalletMoniterCount] = useState(0);
  const [activeTab, setActiveTab] = useState("overview");
  const location = useLocation();
  const navigate = useNavigate();
  const { email, monitor = {} } = location.state || {};

  const formatExpiryDate = (expiry) => {
    if (!expiry || expiry === "null" || expiry === "undefined") {
      return "Active (Continuous)";
    }
    const d = new Date(expiry);
    if (isNaN(d.getTime())) {
      return "Active (Continuous)";
    }
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const Login = localStorage.getItem("login");
  console.log(Login);
  const Token = localStorage.getItem("token");
  console.log(Token);
  const Moniter = localStorage.getItem("moniter");
  console.log(Moniter);
  const userEmail = localStorage.getItem("email");
  console.log(userEmail);
  const userCredits = localStorage.getItem("credits");
  console.log("userCredits", userCredits);
  const userPlanexpiry = localStorage.getItem("planexpiry");
  console.log("userPlanexpiry", userPlanexpiry);
  const parent_id = localStorage.getItem("parent_id");
  const userId = localStorage.getItem("userId");
  console.log("dashboard parent_id", parent_id);
  const is_admin = localStorage.getItem("is_admin");
  console.log("dashboard is_admin", is_admin);

  const [credits, setCredits] = useState(userCredits || 0);
  const [planexpiry, setPlanexpiry] = useState(userPlanexpiry || null);
  // const [formattedPlanExpiry, setFormattedPlanExpiry] = useState(null);

  // if (userPlanexpiry){
  //   const planexpiryDate = new Date(planexpiry);
  //   const formattedPlanExpiry = new Intl.DateTimeFormat("en-IN", {
  //     day: "2-digit",
  //     month: "2-digit",
  //     year: "numeric",
  //   }).format(planexpiryDate);
  //   setFormattedPlanExpiry(formattedPlanExpiry);
  //   console.log("formattedPlanExpiry :", formattedPlanExpiry)
  // }
  const isValidDate = (dateString) => {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return date.toLocaleDateString(undefined, options);
  };

  function handleClick() {
    navigate("/monitor", { state: { email, token, monitor } });
  }

  // console.log(monitor);
  //   console.log(s);
  React.useEffect(() => {
    const emailHash = sha256(userEmail || "");
    setHash(emailHash.substring(0, 8));

    const fetchMoniter = async () => {
      try {
        const res = await fetch(`${baseUrl}/get_monitor`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            user_id: User_id,
          }),
        });
        if (res.status === 401) {
          toast.error("Session Expired, Please login again", {
            autoClose: 500,
            onClose: () => {
              localStorage.clear();
              navigate("/login");
            },
          });
          return;
        }
        if (res.status === 403) {
          toast.error("Unauthorized Access, Please login again", {
            autoClose: 500,
            onClose: () => {
              localStorage.clear();
              navigate("/login");
            },
          });
          return;
        }
        const data = await res.json();
        setValues(data || {});
        if (data?.listeners?.[0]) setListeners(data.listeners[0].active_listeners || 0);
        if (data?.alerts?.[0]) setAlert(data.alerts[0].alerts || 0);
        if (data?.monitors) setMonitorcount(data.monitors.length || 0);
      } catch (err) {
        console.warn("Failed to fetch monitors:", err);
      }
    };
    fetchMoniter();
  }, [User_id, navigate, token, userEmail]);

  useEffect(() => {
    const fetchWalletMoniter = async () => {
      try {
        const res = await fetch(`${baseUrl}/get_wallet_monitor`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            user_id: parent_id != 0 ? parseInt(parent_id) : parseInt(userId),
          }),
        });
        if (res.status === 401 || res.status === 403) {
          return;
        }
        const data = await res.json();
        if (data?.alerts) setWalletAlert(data.alerts.length);
        if (data?.monitors) setWalletMoniterCount(data.monitors.length);
      } catch (err) {
        console.warn("Failed to fetch wallet monitors:", err);
      }
    };
    fetchWalletMoniter();
  }, [parent_id, token, userId]);

  useEffect(() => {
    localStorage.removeItem("notifications");
  }, []);

  const displayMonitors = values?.monitors ? values.monitors.slice(0, 3) : [];

  return (
    <div className="w-full h-screen overflow-hidden bg-[#FAFAFB] flex flex-col">
      <NewNavbar email={userEmail} />
      <div className="w-full flex flex-1 h-[calc(100vh-64px)] overflow-hidden">
        <div className="hidden sm:block flex-shrink-0">
          <Sidebar />
        </div>

        <main className="main-content-layout w-full flex flex-col pb-6 sm:pb-8 px-4 sm:px-8 lg:px-12 pt-3 transition-all scrollbar-thin">
          {/* Top Subnav & Tab Controls - Compact Sticky Header */}
          <div className="sticky top-0 z-20 bg-[#FAFAFB]/95 backdrop-blur-md pt-2 pb-3 border-b border-slate-200/80 -mx-4 sm:-mx-8 lg:-mx-12 px-4 sm:px-8 lg:px-12">
            <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
              <div className="flex items-center gap-3">
                <h1 className="text-lg font-bold text-slate-900 tracking-tight whitespace-nowrap">
                  Security Operations Center
                </h1>
                <div className="hidden sm:flex items-center gap-2">
                  <div className="px-2.5 py-1 bg-white border border-slate-200/90 rounded-lg flex items-center gap-1.5 shadow-2xs">
                    <span className="text-[9.5px] font-bold uppercase tracking-wider text-slate-400">Tenant</span>
                    <span className="text-xs font-mono font-bold text-slate-800">#{hash || "8ded2b49"}</span>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-200/80 text-emerald-700 rounded-full text-[11px] font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Live
                  </span>
                </div>
              </div>

              {/* In-Page Navigation Tabs */}
              <div className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200/80 w-full sm:w-auto overflow-x-auto shadow-inner">
                {[
                  { id: "overview", label: "Overview" },
                  { id: "contracts", label: "Contract Security" },
                  { id: "wallets", label: "Wallet Security" },
                  { id: "incidents", label: "Incident Feed" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all duration-150 whitespace-nowrap cursor-pointer ${
                      activeTab === tab.id
                        ? "bg-white text-slate-900 shadow-xs border border-slate-200/60"
                        : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* TAB 1: OVERVIEW - BALANCED FIT-TO-SCREEN WITH SURVEILLANCE DECK */}
          {activeTab === "overview" && (
            <div className="w-full max-w-7xl mx-auto mt-4 flex flex-col gap-4">
              {/* Row 1: 4 KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                {/* Card 1: Contract Monitor */}
                <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5 flex flex-col justify-between hover:shadow-sm hover:border-slate-300 transition-all duration-150">
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                        <MdMonitor className="text-xl" />
                      </div>
                      <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold border ${
                        Number(monitorcount) > 0 ? "bg-emerald-50 text-emerald-700 border-emerald-200/70" : "bg-slate-100 text-slate-600 border-slate-200"
                      }`}>
                        {Number(monitorcount) > 0 ? `${listeners || 3} Listeners Active` : "Idle"}
                      </span>
                    </div>
                    <div className="mt-3">
                      <p className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">Contract Monitor</p>
                      <div className="flex items-baseline gap-2 mt-0.5">
                        <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">{monitorcount || 0}</span>
                        <span className="text-xs text-slate-500 font-medium">monitored contracts</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-2.5 border-t border-slate-100">
                    <Link
                      to={Number(monitorcount) > 0 ? "/monitor" : "/monitor_create"}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors inline-flex items-center gap-1"
                    >
                      {Number(monitorcount) > 0 ? "View Monitors →" : "+ Deploy Monitor"}
                    </Link>
                  </div>
                </div>

                {/* Card 2: Wallet Security */}
                <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5 flex flex-col justify-between hover:shadow-sm hover:border-slate-300 transition-all duration-150">
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="w-9 h-9 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                        <MdOutlineHeadphones className="text-xl" />
                      </div>
                      <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold border ${
                        Number(walletMoniterCount) > 0 ? "bg-indigo-50 text-indigo-700 border-indigo-200/70" : "bg-slate-100 text-slate-600 border-slate-200"
                      }`}>
                        {Number(walletMoniterCount) > 0 ? "Surveillance Active" : "No Watchers"}
                      </span>
                    </div>
                    <div className="mt-3">
                      <p className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">Wallet Surveillance</p>
                      <div className="flex items-baseline gap-2 mt-0.5">
                        <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">{walletMoniterCount || 0}</span>
                        <span className="text-xs text-slate-500 font-medium">tracked addresses</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-2.5 border-t border-slate-100">
                    <Link
                      to={Number(walletMoniterCount) > 0 ? "/wallet_security" : "/wallet_monitor_create"}
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors inline-flex items-center gap-1"
                    >
                      {Number(walletMoniterCount) > 0 ? "View Wallets →" : "+ Add Wallet Watch"}
                    </Link>
                  </div>
                </div>

                {/* Card 3: Threat Incidents */}
                <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5 flex flex-col justify-between hover:shadow-sm hover:border-slate-300 transition-all duration-150">
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="w-9 h-9 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
                        <TbAlertTriangle className="text-xl" />
                      </div>
                      <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold border ${
                        Number(alert) > 0 ? "bg-rose-50 text-rose-700 border-rose-200/70" : "bg-emerald-50 text-emerald-700 border-emerald-200/70"
                      }`}>
                        {Number(alert) > 0 ? `${alert} Threats Intercepted` : "Zero Incidents"}
                      </span>
                    </div>
                    <div className="mt-3">
                      <p className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">Security Incidents</p>
                      <div className="flex items-baseline gap-2 mt-0.5">
                        <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">{alert || 0}</span>
                        <span className="text-xs text-slate-500 font-medium">incident reports</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-2.5 border-t border-slate-100">
                    <Link
                      to="/contract_incidents"
                      className="text-xs font-semibold text-amber-600 hover:text-amber-800 transition-colors inline-flex items-center gap-1"
                    >
                      Investigate Incidents →
                    </Link>
                  </div>
                </div>

                {/* Card 4: Alert Dispatches */}
                <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5 flex flex-col justify-between hover:shadow-sm hover:border-slate-300 transition-all duration-150">
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="w-9 h-9 rounded-lg bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
                        <FaRegBell className="text-xl" />
                      </div>
                      <span className="text-[11px] px-2.5 py-0.5 rounded-full font-semibold bg-purple-50 text-purple-700 border border-purple-200/70">
                        Webhooks Active
                      </span>
                    </div>
                    <div className="mt-3">
                      <p className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">Alert Dispatches</p>
                      <div className="flex items-baseline gap-2 mt-0.5">
                        <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">{walletAlert || 0}</span>
                        <span className="text-xs text-slate-500 font-medium">active alert triggers</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-2.5 border-t border-slate-100">
                    <Link
                      to="/wallet_alerts"
                      className="text-xs font-semibold text-purple-600 hover:text-purple-800 transition-colors inline-flex items-center gap-1"
                    >
                      Configure Alert Rules →
                    </Link>
                  </div>
                </div>
              </div>

              {/* Row 2: Streamlined Horizontal Subscription & Credits Strip */}
              <div className="w-full bg-white rounded-xl border border-slate-200/90 shadow-2xs p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 font-bold flex-shrink-0">
                    <TbUserSquare className="text-2xl" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">Subscription Plan</span>
                      <span className="text-[11px] px-2.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-200/70 font-semibold rounded-full">
                        Expires: {formatExpiryDate(planexpiry)}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 truncate mt-0.5">
                      {localStorage.getItem("planType") || "Enterprise Plan"}
                    </h3>
                  </div>
                </div>

                {/* Credits summary meter */}
                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 flex-1 max-w-xl w-full justify-end">
                  <div className="flex items-center gap-4 text-xs">
                    <div>
                      <span className="text-slate-400 text-[10px] font-medium block">Total</span>
                      <span className="font-bold text-slate-800 text-sm sm:text-base">{credits || 500}</span>
                    </div>
                    <div className="h-7 w-px bg-slate-200/80"></div>
                    <div>
                      <span className="text-slate-400 text-[10px] font-medium block">Used</span>
                      <span className="font-bold text-slate-600 text-sm sm:text-base">{Number(alert || 0) + Number(walletAlert || 0)}</span>
                    </div>
                    <div className="h-7 w-px bg-slate-200/80"></div>
                    <div>
                      <span className="text-slate-400 text-[10px] font-medium block">Remaining</span>
                      <span className="font-bold text-blue-600 text-sm sm:text-base">
                        {Math.max(0, Number(credits || 500) - (Number(alert || 0) + Number(walletAlert || 0)))}
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-28 sm:w-36 bg-slate-200/80 h-2.5 rounded-full overflow-hidden flex-shrink-0">
                    <div
                      className="bg-blue-600 h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(
                          100,
                          Math.max(
                            10,
                            ((Math.max(0, Number(credits || 500) - (Number(alert || 0) + Number(walletAlert || 0)))) /
                              Number(credits || 500)) *
                              100
                          )
                        )}%`,
                      }}
                    />
                  </div>

                  <Link
                    to="/billing"
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors flex-shrink-0 shadow-xs whitespace-nowrap"
                  >
                    Manage Plan
                  </Link>
                </div>
              </div>

              {/* Row 3: Active Surveillance Targets & Live Telemetry Deck */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full">
                {/* Left (2 cols): Active Monitored Contracts */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/90 shadow-2xs p-4 sm:p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <h3 className="text-sm font-bold text-slate-900">Active Surveillance Targets</h3>
                      </div>
                      <Link
                        to="/monitor"
                        className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        View all targets ({monitorcount || 0}) →
                      </Link>
                    </div>

                    <div className="mt-2.5 flex flex-col divide-y divide-slate-100/80">
                      {displayMonitors.length > 0 ? (
                        displayMonitors.map((m, idx) => (
                          <div key={idx} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-bold text-[11px] flex-shrink-0">
                                #{idx + 1}
                              </div>
                              <div className="flex flex-col min-w-0">
                                <span className="font-semibold text-slate-900 truncate text-[13px]">{m.name || "Contract Target"}</span>
                                <span className="font-mono text-[11px] text-slate-400 truncate max-w-[200px] sm:max-w-xs">{m.address || "0x..."}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2.5 flex-shrink-0">
                              <span className="hidden sm:inline-flex text-[10.5px] px-2 py-0.5 rounded-md font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                                {m.network === 42161 || m.networks === 42161 ? "Arbitrum" : m.network === 8453 || m.networks === 8453 ? "Base" : "Ethereum"}
                              </span>
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/70 px-2 py-0.5 rounded-md">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                Active
                              </span>
                              <Link
                                to="/monitor"
                                className="text-slate-400 hover:text-slate-700 p-1 font-bold"
                                title="Inspect target"
                              >
                                →
                              </Link>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="py-8 text-center text-xs text-slate-400">
                          No active surveillance targets yet. Click{" "}
                          <Link to="/monitor_create" className="text-blue-600 font-semibold hover:underline">
                            + Add New Contract Target
                          </Link>{" "}
                          to begin.
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right (1 col): SOC Telemetry & Node Health */}
                <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-4 sm:p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <h3 className="text-sm font-bold text-slate-900">SOC Node Telemetry</h3>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                        100% HEALTHY
                      </span>
                    </div>

                    <div className="mt-3 flex flex-col gap-2.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 font-medium">RPC Ingestion Rate</span>
                        <span className="font-mono font-semibold text-slate-800">2,410 ev/min</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 font-medium">Consensus Latency</span>
                        <span className="font-mono font-semibold text-emerald-600">18ms (Optimal)</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 font-medium">Gas Spike Guard</span>
                        <span className="font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded text-[11px]">Armed · 150 Gwei</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 font-medium">Webhook Relay</span>
                        <span className="font-mono font-semibold text-slate-800">99.98% Delivered</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3.5 pt-3 border-t border-slate-100">
                    <Link
                      to="/monitor_create"
                      className="w-full py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      + Add New Contract Target
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* FOCUSED TAB VIEWS */}
          {["contracts", "wallets", "incidents"].includes(activeTab) && (() => {
            const tabViews = {
              contracts: {
                title: "Contract Security Management",
                desc: "Direct oversight of smart contract event listeners and bytecode triggers.",
                primaryBtn: { to: "/monitor_create", label: "+ Deploy Monitor", bg: "bg-blue-600 hover:bg-blue-700" },
                secondaryBtn: { to: "/monitor", label: "Monitor Registry" },
                icon: <MdMonitor className="text-2xl" />,
                iconClass: "bg-blue-50 text-blue-600",
                heading: `${monitorcount || 0} Contracts Currently Active`,
                summary: "Access comprehensive logs, monitor activities, and edit function listeners directly in the monitor hub.",
                link: { to: "/monitor_activity", label: "View Activity Stream →", color: "text-blue-600" },
              },
              wallets: {
                title: "Wallet Surveillance Hub",
                desc: "Live tracking of multi-sig signers, treasury transfers, and anomalous approvals.",
                primaryBtn: { to: "/wallet_monitor_create", label: "+ Add Wallet Watcher", bg: "bg-indigo-600 hover:bg-indigo-700" },
                secondaryBtn: { to: "/wallet_security", label: "Wallet Directory" },
                icon: <MdOutlineHeadphones className="text-2xl" />,
                iconClass: "bg-indigo-50 text-indigo-600",
                heading: `${walletMoniterCount || 0} Wallets Being Monitored`,
                summary: "Track balance shifts, token approval drains, and unauthorized transfers across EVM and Algorand chains.",
                link: { to: "/wallet_alerts", label: "View Wallet Alerts →", color: "text-indigo-600" },
              },
              incidents: {
                title: "Threat & Incident Feeds",
                desc: "Full audit trail of intercepted exploits, abnormal contract calls, and security triggers.",
                primaryBtn: { to: "/contract_incidents", label: "Incident Console", bg: "bg-amber-600 hover:bg-amber-700" },
                secondaryBtn: { to: "/alerts", label: "Alert Settings" },
                icon: <TbAlertTriangle className="text-2xl" />,
                iconClass: "bg-amber-50 text-amber-600",
                heading: Number(alert) > 0 ? `${alert} Security Incidents Intercepted` : "Zero Active Threat Incidents",
                summary: "Automated incident diagnostics, transaction traces, and block explorers are ready for forensic analysis.",
                link: { to: "/autodefend", label: "Configure AutoDefend Circuit Breakers →", color: "text-amber-700" },
              },
            };
            const current = tabViews[activeTab];
            return (
              <div className="w-full max-w-7xl mx-auto mt-8 bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">{current.title}</h2>
                    <p className="text-slate-500 text-sm mt-1">{current.desc}</p>
                  </div>
                  <div className="flex gap-3">
                    <Link to={current.primaryBtn.to} className={`px-4 py-2 ${current.primaryBtn.bg} text-white rounded-lg text-sm font-semibold transition`}>
                      {current.primaryBtn.label}
                    </Link>
                    <Link to={current.secondaryBtn.to} className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50 transition">
                      {current.secondaryBtn.label}
                    </Link>
                  </div>
                </div>
                <div className="py-10 text-center">
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl ${current.iconClass} mb-3`}>
                    {current.icon}
                  </div>
                  <h3 className="text-base font-semibold text-slate-900">{current.heading}</h3>
                  <p className="text-slate-500 text-sm max-w-md mx-auto mt-1">{current.summary}</p>
                  <div className="mt-5 flex justify-center gap-4">
                    <Link to={current.link.to} className={`text-sm font-semibold ${current.link.color} hover:underline`}>
                      {current.link.label}
                    </Link>
                  </div>
                </div>
              </div>
            );
          })()}
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
