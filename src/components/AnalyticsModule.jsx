import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import NewNavbar from "./NewNavbar";
import Sidebar from "./Sidebar";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { ALL_NETWORKS } from "../Constants/networks";
import {
  LuArrowLeft,
  LuBarChart3,
  LuSearch,
  LuX,
  LuCalendar,
  LuCopy,
  LuCheck,
  LuLayers,
} from "react-icons/lu";

function AnalyticsModule() {
  const userEmail = localStorage.getItem("email");
  const [loading, setLoading] = useState(true);
  const [monitors, setMonitors] = useState([]);
  const [selectedMonitor, setSelectedMonitor] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedAddress, setCopiedAddress] = useState(null);
  const navigate = useNavigate();

  const [tempStartDate, setTempStartDate] = useState(new Date());
  const [tempEndDate, setTempEndDate] = useState(new Date());

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const parent_id = localStorage.getItem("parent_id");
  const baseUrl = "https://139-59-5-56.nip.io:3443";

  useEffect(() => {
    setLoading(true);
    const fetchMonitors = async () => {
      try {
        const res = await fetch(`${baseUrl}/get_monitor`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            user_id: parent_id !== "0" ? parseInt(parent_id) : parseInt(userId),
          }),
        });
        const data = await res.json();
        const list = data.monitors || [];
        setMonitors(list);
      } catch (error) {
        console.warn("Error fetching monitors:", error);
        setMonitors([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMonitors();
  }, [parent_id, token, userId]);

  // Helper to resolve network metadata
  const getNetworkMeta = (networkId) => {
    const netIdStr = String(networkId);
    const found = ALL_NETWORKS.find(
      (n) => n.id === netIdStr || String(n.chainId) === netIdStr
    );
    if (found) return found;

    return {
      name: `Chain ${networkId}`,
      tag: `ID:${networkId}`,
      badgeColor: "bg-slate-100 text-slate-700 border-slate-200",
    };
  };

  const filteredMonitors = useMemo(() => {
    if (!searchQuery.trim()) return monitors;
    const q = searchQuery.toLowerCase().trim();
    return monitors.filter((m) => {
      const netMeta = getNetworkMeta(m.network);
      return (
        m.name?.toLowerCase().includes(q) ||
        m.address?.toLowerCase().includes(q) ||
        netMeta.name.toLowerCase().includes(q) ||
        netMeta.tag.toLowerCase().includes(q)
      );
    });
  }, [monitors, searchQuery]);

  const handleCopy = (address) => {
    if (!address) return;
    navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    setTimeout(() => setCopiedAddress(null), 1800);
  };

  const handleViewAnalytics = (mid) => {
    const monitor = monitors.find((m) => m.mid === mid);
    setSelectedMonitor(monitor);

    const today = new Date();
    const startOfDay = new Date(today);
    startOfDay.setHours(0, 1, 0);
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 0);

    setTempStartDate(startOfDay);
    setTempEndDate(endOfDay);
    setShowCalendar(true);
  };

  const formatDateTime = (date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  };

  const handleApply = () => {
    if (selectedMonitor) {
      const formattedStartDate = formatDateTime(tempStartDate);
      const formattedEndDate = formatDateTime(tempEndDate);

      const currentUserId =
        parent_id !== "0" ? parseInt(parent_id) : parseInt(userId);

      navigate(`/analytics`, {
        state: {
          user_id: currentUserId,
          mid: selectedMonitor.mid,
          start_date_time: formattedStartDate,
          end_date_time: formattedEndDate,
          monitorName: selectedMonitor.name,
          monitorNetwork: selectedMonitor.network,
          monitorAddress: selectedMonitor.address,
        },
      });
    }
  };

  const handleCancel = () => {
    setShowCalendar(false);
  };

  const handleStartDateChange = (date) => {
    setTempStartDate(date);
    if (date > tempEndDate) setTempEndDate(date);
  };

  const handleEndDateChange = (date) => {
    setTempEndDate(date);
    if (date < tempStartDate) setTempStartDate(date);
  };

  return (
    <div className="w-full min-h-screen bg-[#FAFAFB]">
      <NewNavbar email={userEmail} />
      <div className="w-full flex min-h-screen">
        <Sidebar />

        <div className="main-content-layout p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
          {/* Top Breadcrumb & Header */}
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
                <span className="text-xs font-semibold text-slate-700">Analytics & Reports</span>
              </div>

              <div className="flex items-center gap-2 mt-1">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  Contract Analytics & Reports
                </h1>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/80">
                  Forensic Intelligence
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500">
                Select a monitored smart contract to inspect transaction activity, gas usage, and security incident trends.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/algotics")}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs sm:text-sm font-semibold shadow-2xs transition self-start sm:self-auto cursor-pointer"
            >
              <LuLayers className="w-4 h-4 text-blue-600" />
              <span>Algorand Analytics</span>
            </button>
          </div>

          {/* Search Toolbar */}
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-3.5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <LuSearch className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search contract by name, address, or chain..."
                style={{ paddingLeft: "36px", paddingRight: "30px" }}
                className="w-full py-2 rounded-lg border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition placeholder:text-slate-400"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <LuX className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium self-end sm:self-auto">
              <span>Monitors Available:</span>
              <span className="font-bold text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                {filteredMonitors.length}
              </span>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
            {loading ? (
              <div className="p-12 text-center flex flex-col items-center justify-center gap-3">
                <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xs font-semibold text-slate-500">Loading contracts...</p>
              </div>
            ) : filteredMonitors.length === 0 ? (
              <div className="p-12 text-center flex flex-col items-center justify-center gap-2">
                <p className="text-sm font-bold text-slate-900">No contract monitors found</p>
                <p className="text-xs text-slate-500">
                  {searchQuery ? "Try searching for a different name or address." : "Deploy a monitor first to unlock analytics."}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      <th className="py-3.5 px-4 sm:px-6">Contract Name</th>
                      <th className="py-3.5 px-4">Network</th>
                      <th className="py-3.5 px-4">Target Address</th>
                      <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs text-slate-700 font-medium">
                    {filteredMonitors.map((monitor) => {
                      const netMeta = getNetworkMeta(monitor.network);
                      const isCopying = copiedAddress === monitor.address;

                      return (
                        <tr
                          key={monitor.mid}
                          className="hover:bg-slate-50/60 transition-colors"
                        >
                          <td className="py-4 px-4 sm:px-6">
                            <strong className="text-sm font-bold text-slate-900 leading-tight">
                              {monitor.name || "Contract Sentinel"}
                            </strong>
                          </td>

                          <td className="py-4 px-4">
                            <span
                              className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${netMeta.badgeColor}`}
                            >
                              {netMeta.tag} · {netMeta.name}
                            </span>
                          </td>

                          <td className="py-4 px-4">
                            {monitor.address ? (
                              <div className="inline-flex items-center gap-1.5 font-mono text-[11px] bg-slate-50 border border-slate-200 px-2 py-1 rounded-lg">
                                <span>
                                  {monitor.address.slice(0, 10)}...{monitor.address.slice(-6)}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleCopy(monitor.address)}
                                  title="Copy address"
                                  className="text-slate-400 hover:text-slate-700 transition cursor-pointer"
                                >
                                  {isCopying ? (
                                    <LuCheck className="w-3.5 h-3.5 text-emerald-600" />
                                  ) : (
                                    <LuCopy className="w-3.5 h-3.5" />
                                  )}
                                </button>
                              </div>
                            ) : (
                              <span className="text-slate-400">N/A</span>
                            )}
                          </td>

                          <td className="py-4 px-4 sm:px-6 text-right">
                            <button
                              type="button"
                              onClick={() => handleViewAnalytics(monitor.mid)}
                              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-2xs transition cursor-pointer"
                            >
                              <LuBarChart3 className="w-3.5 h-3.5" />
                              <span>View Analytics</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Date Range Modal */}
          {showCalendar && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-xl p-6 flex flex-col gap-5 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                      <LuCalendar className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        Select Analysis Time Window
                      </h3>
                      <p className="text-xs text-slate-500">
                        {selectedMonitor?.name}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleCancel}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                  >
                    <LuX className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-bold text-slate-700">Start Date</span>
                    <Calendar
                      value={tempStartDate}
                      onChange={handleStartDateChange}
                      className="custom-calendar shadow-2xs rounded-xl p-2 w-full border border-slate-200"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-bold text-slate-700">End Date</span>
                    <Calendar
                      value={tempEndDate}
                      onChange={handleEndDateChange}
                      className="custom-calendar shadow-2xs rounded-xl p-2 w-full border border-slate-200"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleApply}
                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
                  >
                    Apply & Generate Report
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AnalyticsModule;
