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
import { toast, ToastContainer } from "react-toastify";

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
  const notifications = localStorage.getItem("notifications");
  console.log("dashboard notifications", notifications);

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
    const emailHash = sha256(userEmail || "demo@securewatch.io");
    setHash(emailHash.substring(0, 8));

    if (localStorage.getItem("is_demo") === "true") {
      setValues({
        listeners: [{ active_listeners: 12 }],
        alerts: [{ alerts: 5 }],
        monitors: [{ id: 1 }, { id: 2 }, { id: 3 }],
      });
      setListeners(12);
      setAlert(5);
      setMonitorcount(3);
      return;
    }

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
    if (localStorage.getItem("is_demo") === "true") {
      setWalletAlert(2);
      setWalletMoniterCount(4);
      return;
    }

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

  const DASHBOARD_TOAST_CONTAINER_ID = "dashboard-notification-container";

  const ensureDashboardToastContainer = () => {
    if (!document.getElementById(DASHBOARD_TOAST_CONTAINER_ID)) {
      const dashboardContainer = toast.createContainer({
        containerId: DASHBOARD_TOAST_CONTAINER_ID,
        position: "bottom-right",
        theme: "colored"
      });
      
      return dashboardContainer;
    }
    return true;
  };
  
  const dashboardToast = (message) => {
    // Skip toast if message is null, undefined, not a string, empty, or "null"
    if (!message || typeof message !== 'string' || !message.trim() || message.trim() === "null") {
      return;
    }
    
    ensureDashboardToastContainer();
    
    toast(message.replace(/^"|"$/g, ""), {
      position: "bottom-right",
      autoClose: false,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
      containerId: DASHBOARD_TOAST_CONTAINER_ID, 
      style: {
        backgroundColor: "#60a5fa", 
        color: "#ffffff", 
        fontWeight: "bold",
      },
    });
  };
  
  useEffect(() => {
    // Skip if notifications is null, undefined, not a string, empty, or "null"
    if (!notifications || typeof notifications !== 'string' || !notifications.trim() || notifications.trim() === "null") {
      return;
    }
    
    const trimmedNotifications = notifications.trim();
    
    if (trimmedNotifications.includes("::")) {
      const notificationArray = trimmedNotifications
        .split("::")
        .map(msg => msg.trim().replace(/^"|"$/g, ""))
        .filter(msg => msg.length > 0);
      
      notificationArray.forEach(msg => {
        dashboardToast(msg);
      });
    } else {
      dashboardToast(trimmedNotifications);
    }
  }, [notifications]);

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC]">
      <NewNavbar email={userEmail} />
      <div className="w-full flex flex-col h-full pb-10">
        <div className="hidden sm:block">
          <Sidebar />
        </div>

        <div className="sm:ml-[88px] w-full sm:w-[calc(100%-88px)] flex flex-col h-full pb-8 px-4 sm:px-8 lg:px-12 pt-24 transition-all">
          {/* Top Subnav & Tab Controls */}
          <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-2">
                <span className="text-xs font-semibold uppercase text-blue-700">Tenant ID</span>
                <span className="text-xs font-mono font-bold text-slate-800">#{hash || "8ded2b49"}</span>
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-full text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Node Active
              </span>
            </div>

            {/* In-Page Navigation Tabs */}
            <div className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200 w-full sm:w-auto overflow-x-auto">
              {[
                { id: "overview", label: "Overview" },
                { id: "contracts", label: "Contract Security" },
                { id: "wallets", label: "Wallet Security" },
                { id: "incidents", label: "Incident Feed" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-150 whitespace-nowrap cursor-pointer ${
                    activeTab === tab.id
                      ? "bg-white text-blue-700 shadow-sm font-semibold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="w-full max-w-7xl mx-auto mt-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Security Operations Center
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Real-time threat monitoring, wallet surveillance, and decentralized contract activity.
            </p>
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="w-full max-w-7xl mx-auto mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
                {/* Card 1: Contract Monitor */}
                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                        <MdMonitor className="text-xl" />
                      </div>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${
                        Number(monitorcount) > 0 ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-slate-100 text-slate-600 border-slate-200"
                      }`}>
                        {Number(monitorcount) > 0 ? `${listeners || 3} Listeners Active` : "Idle"}
                      </span>
                    </div>
                    <div className="mt-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Contract Monitor</p>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-3xl font-extrabold text-slate-900">{monitorcount || 0}</span>
                        <span className="text-xs text-slate-500 font-medium">monitored contracts</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-2 line-clamp-2">
                        {Number(monitorcount) > 0
                          ? "Real-time bytecode verification and automated function listener triggers."
                          : "No smart contracts configured. Deploy a monitor to start threat detection."}
                      </p>
                    </div>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <Link
                      to={Number(monitorcount) > 0 ? "/monitor" : "/monitor_create"}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      {Number(monitorcount) > 0 ? "View Monitors →" : "+ Deploy First Monitor"}
                    </Link>
                  </div>
                </div>

                {/* Card 2: Wallet Security */}
                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                        <MdOutlineHeadphones className="text-xl" />
                      </div>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${
                        Number(walletMoniterCount) > 0 ? "bg-indigo-50 text-indigo-700 border-indigo-200" : "bg-slate-100 text-slate-600 border-slate-200"
                      }`}>
                        {Number(walletMoniterCount) > 0 ? "Surveillance Active" : "No Watchers"}
                      </span>
                    </div>
                    <div className="mt-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Wallet Surveillance</p>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-3xl font-extrabold text-slate-900">{walletMoniterCount || 0}</span>
                        <span className="text-xs text-slate-500 font-medium">tracked addresses</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-2 line-clamp-2">
                        {Number(walletMoniterCount) > 0
                          ? "Tracking suspicious inflows, multi-sig transactions, and authorized signer shifts."
                          : "No wallet watchers set up. Add treasury or deployer addresses to monitor."}
                      </p>
                    </div>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <Link
                      to={Number(walletMoniterCount) > 0 ? "/wallet_security" : "/wallet_monitor_create"}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                    >
                      {Number(walletMoniterCount) > 0 ? "View Wallets →" : "+ Add Wallet Watch"}
                    </Link>
                  </div>
                </div>

                {/* Card 3: Threat Incidents */}
                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
                        <TbAlertTriangle className="text-xl" />
                      </div>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${
                        Number(alert) > 0 ? "bg-rose-50 text-rose-700 border-rose-200" : "bg-emerald-50 text-emerald-700 border-emerald-200"
                      }`}>
                        {Number(alert) > 0 ? "Threats Intercepted" : "Zero Incidents"}
                      </span>
                    </div>
                    <div className="mt-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Security Incidents</p>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-3xl font-extrabold text-slate-900">{alert || 0}</span>
                        <span className="text-xs text-slate-500 font-medium">incident reports</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-2 line-clamp-2">
                        {Number(alert) > 0
                          ? "Automated attack patterns and anomaly thresholds triggered."
                          : "All security parameters normal. No exploit attempts logged."}
                      </p>
                    </div>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <Link
                      to="/contract_incidents"
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-600 hover:text-amber-800 transition-colors"
                    >
                      {Number(alert) > 0 ? "Investigate Incidents →" : "View Incident History →"}
                    </Link>
                  </div>
                </div>

                {/* Card 4: Wallet Alerts */}
                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
                        <FaRegBell className="text-xl" />
                      </div>
                      <span className="text-xs px-2.5 py-1 rounded-full font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                        Realtime Webhooks
                      </span>
                    </div>
                    <div className="mt-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Alert Dispatches</p>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-3xl font-extrabold text-slate-900">{walletAlert || 0}</span>
                        <span className="text-xs text-slate-500 font-medium">active alert triggers</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-2 line-clamp-2">
                        Connected through Discord, Telegram, Slack, and email channels.
                      </p>
                    </div>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <Link
                      to="/wallet_alerts"
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-purple-600 hover:text-purple-800 transition-colors"
                    >
                      Configure Alert Rules →
                    </Link>
                  </div>
                </div>

                {/* Card 5: User Plan & Credits Meter */}
                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 md:col-span-2 xl:col-span-2">
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 font-bold">
                          <TbUserSquare className="text-2xl" />
                        </div>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Subscription & Credits</p>
                          <h3 className="text-lg font-bold text-slate-900">
                            {localStorage.getItem("planType") || "Enterprise Plan"}
                          </h3>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold rounded-full">
                        Expires: {formatExpiryDate(planexpiry)}
                      </span>
                    </div>

                    <div className="mt-5 grid grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <div>
                        <span className="text-xs text-slate-500 font-medium">Total Credits</span>
                        <p className="text-xl font-bold text-slate-900 mt-0.5">{credits || 500}</p>
                      </div>
                      <div>
                        <span className="text-xs text-slate-500 font-medium">Used Credits</span>
                        <p className="text-xl font-bold text-slate-600 mt-0.5">{Number(alert || 0) + Number(walletAlert || 0)}</p>
                      </div>
                      <div>
                        <span className="text-xs text-slate-500 font-medium">Remaining</span>
                        <p className="text-xl font-bold text-blue-600 mt-0.5">
                          {Math.max(0, Number(credits || 500) - (Number(alert || 0) + Number(walletAlert || 0)))}
                        </p>
                      </div>
                    </div>

                    {/* Visual Credits Progress Bar */}
                    <div className="mt-4">
                      <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
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
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                      Need custom monitor capacity? Contact enterprise support.
                    </span>
                    <Link
                      to="/billing"
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors"
                    >
                      Manage Plan & Invoices
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
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} containerId="dashboard-notification-container" />
    </div>
  );
}

export default Dashboard;
