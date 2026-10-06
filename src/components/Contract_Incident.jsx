import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../Constants/data";
import { ALL_NETWORKS } from "../Constants/networks";
import NewNavbar from "./NewNavbar";
import Sidebar from "./Sidebar";
import { toast, ToastContainer } from "react-toastify";
import {
  LuArrowLeft,
  LuSearch,
  LuX,
  LuExternalLink,
  LuCopy,
  LuCheck,
  LuShieldAlert,
  LuBellRing,
  LuChevronLeft,
  LuChevronRight,
  LuActivity,
  LuCheckCircle2,
  LuAlertTriangle,
} from "react-icons/lu";

const EXPLORER_BASE = {
  1: "https://etherscan.io/tx/",
  11155111: "https://sepolia.etherscan.io/tx/",
  42161: "https://arbiscan.io/tx/",
  8453: "https://basescan.org/tx/",
  56: "https://bscscan.com/tx/",
  137: "https://polygonscan.com/tx/",
  80002: "https://amoy.polygonscan.com/tx/",
  43114: "https://snowtrace.io/tx/",
  100: "https://gnosisscan.io/tx/",
  59144: "https://explorer.linea.build/tx/",
  1313161554: "https://explorer.mainnet.aurora.dev/tx/",
  10: "https://optimistic.etherscan.io/tx/",
  50: "https://xdcscan.com/tx/",
  169: "https://pacific-info.manta.network/tx/",
  146: "https://explorer.soniclabs.com/tx/",
  1625: "https://gscan.xyz/tx/",
  7000: "https://explorer.mainnet.zetachain.com/tx/",
  47763: "https://xexplorer.neo.org/tx/",
  592: "https://astar.subscan.io/tx/",
  1868: "https://soneium.blockscout.com/tx/",
  747474: "https://explorer.katanarpc.com/tx/",
  43111: "https://explorer.hemi.xyz/tx/",
  185: "https://explorer.mintchain.io/tx/",
  1116: "https://scan.coredao.org/tx/",
  1300: "https://explorer.bitquery.io/algorand/tx/",
  1301: "https://explorer.bitquery.io/algorand_testnet/tx/",
};

function Contract_Incident() {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("email");
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const parent_id = localStorage.getItem("parent_id");

  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedHash, setCopiedHash] = useState(null);
  const [copiedAddr, setCopiedAddr] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const dataPerPage = 10;

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${baseUrl}/get_alerts`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            mid: 0,
            uid: parent_id && parent_id !== "0" ? parseInt(parent_id) : parseInt(userId || 0),
          }),
        });

        if (res.status === 401 || res.status === 403) {
          toast.error("Session expired, please login again");
          localStorage.clear();
          navigate("/login");
          return;
        }

        const data = await res.json();
        const list = data.alerts || [];

        // Sort descending by created date
        list.sort((a, b) => new Date(b.created_on || 0) - new Date(a.created_on || 0));
        setAlerts(list);
      } catch (err) {
        console.error("Failed to fetch contract incidents:", err);
        setAlerts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, [token, userId, parent_id, navigate]);

  const copyToClipboard = (text, type = "addr") => {
    if (!text || text === "N/A") return;
    navigator.clipboard.writeText(text);
    if (type === "hash") {
      setCopiedHash(text);
      setTimeout(() => setCopiedHash(null), 2000);
    } else {
      setCopiedAddr(text);
      setTimeout(() => setCopiedAddr(null), 2000);
    }
    toast.success("Copied to clipboard!", { autoClose: 1500 });
  };

  const getExplorerTxUrl = (networkVal, txHash) => {
    if (!txHash) return null;
    let base = EXPLORER_BASE[networkVal];
    if (!base && typeof networkVal === "string") {
      const match = ALL_NETWORKS.find(
        (n) =>
          n.name.toLowerCase() === networkVal.toLowerCase() ||
          n.tag.toLowerCase() === networkVal.toLowerCase() ||
          String(n.chainId) === networkVal
      );
      if (match && EXPLORER_BASE[match.chainId]) {
        base = EXPLORER_BASE[match.chainId];
      }
    }
    if (!base) {
      base = "https://etherscan.io/tx/";
    }
    return `${base}${txHash}`;
  };

  const formatTimestamp = (dateStr) => {
    if (!dateStr) return "Just now";
    try {
      const d = new Date(dateStr);
      return d.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    } catch (e) {
      return String(dateStr).slice(0, 16);
    }
  };

  // Filter alerts by search query
  const filteredAlerts = useMemo(() => {
    if (!searchQuery.trim()) return alerts;
    const q = searchQuery.toLowerCase();
    return alerts.filter((a) => {
      const name = (a.event_name || a.name || "").toLowerCase();
      const hash = (a.hash || a.tx_hash || "").toLowerCase();
      const from = (a.from_address || "").toLowerCase();
      const to = (a.to_address || "").toLowerCase();
      return name.includes(q) || hash.includes(q) || from.includes(q) || to.includes(q);
    });
  }, [alerts, searchQuery]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredAlerts.length / dataPerPage));
  const displayedAlerts = useMemo(() => {
    const start = (currentPage - 1) * dataPerPage;
    return filteredAlerts.slice(start, start + dataPerPage);
  }, [filteredAlerts, currentPage, dataPerPage]);

  return (
    <div className="min-h-screen bg-[#FAFAFB]">
      <NewNavbar email={userEmail} />
      <Sidebar />
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />

      <main className="main-content-layout pt-20 px-4 sm:px-6 lg:px-10 pb-16 transition-all duration-300">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Top Back Navigation Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/dashboard")}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs hover:border-slate-300 transition-all group"
                title="Return to Dashboard"
              >
                <LuArrowLeft className="w-3.5 h-3.5 text-slate-400 group-hover:-translate-x-0.5 transition-transform" />
                <span>Back to Dashboard</span>
              </button>

              <button
                onClick={() => navigate("/monitor")}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200/80 bg-white hover:bg-slate-50 text-slate-600 text-xs font-medium transition-all"
              >
                <span>Contract Monitors</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Global Incident Feed
              </span>
            </div>
          </div>

          {/* Header Title Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-slate-200/70">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-rose-50 text-rose-600 rounded-xl border border-rose-100">
                  <LuBellRing className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                    All Contract Incidents & Alerts
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    Centralized timeline of all contract triggers, anomalous calls, and security alerts.
                  </p>
                </div>
              </div>
            </div>

            {/* Search Input */}
            <div className="w-full md:w-80">
              <div className="relative">
                <LuSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search by event, tx, or address..."
                  style={{ paddingLeft: "2.5rem", paddingRight: "2.25rem" }}
                  className="w-full py-2 rounded-xl text-xs sm:text-sm bg-white border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-2xs transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                  >
                    <LuX className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Main Card Container */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
            {loading ? (
              <div className="p-16 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-[3px] border-slate-200 border-t-blue-600 mb-3"></div>
                <p className="text-sm font-medium text-slate-600">Loading incident records...</p>
              </div>
            ) : filteredAlerts.length === 0 ? (
              <div className="p-16 text-center max-w-md mx-auto">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100 flex items-center justify-center mx-auto mb-4">
                  <LuCheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-base font-semibold text-slate-900 mb-1">
                  {searchQuery ? "No matching incidents found" : "No Incidents Recorded"}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mb-5 leading-relaxed">
                  {searchQuery
                    ? "Try adjusting your search criteria or clear the query filter."
                    : "All monitored contracts and rules are running smoothly without any recorded incident breaches."}
                </p>
                {searchQuery ? (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs"
                  >
                    Clear Filter
                  </button>
                ) : (
                  <button
                    onClick={() => navigate("/dashboard")}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 shadow-xs transition-colors"
                  >
                    <LuArrowLeft className="w-3.5 h-3.5" />
                    Back to Dashboard
                  </button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                      <th className="py-3 px-4 sm:px-6">Timestamp</th>
                      <th className="py-3 px-4">Event Type</th>
                      <th className="py-3 px-4">Transaction / Link</th>
                      <th className="py-3 px-4 sm:px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                    {displayedAlerts.map((item, idx) => {
                      const hash = item.hash || item.tx_hash;
                      const eventName = item.event_name || item.name || "Incident Trigger";
                      const createdOn = item.created_on;
                      const networkVal = item.network || 1;
                      const explorerUrl = getExplorerTxUrl(networkVal, hash);
                      const isHighSeverity =
                        item.severity === "High" ||
                        item.severity === "Critical" ||
                        eventName.toLowerCase().includes("suspicious") ||
                        eventName.toLowerCase().includes("reentrancy");

                      return (
                        <tr
                          key={item.id || idx}
                          className="hover:bg-slate-50/70 transition-colors group"
                        >
                          {/* Timestamp */}
                          <td className="py-3.5 px-4 sm:px-6 whitespace-nowrap text-slate-700 font-medium">
                            <div className="flex items-center gap-2">
                              <span
                                className={`w-2 h-2 rounded-full ${
                                  isHighSeverity ? "bg-rose-500" : "bg-emerald-500"
                                }`}
                              ></span>
                              <span>{formatTimestamp(createdOn)}</span>
                            </div>
                          </td>

                          {/* Event Type Badge */}
                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                                isHighSeverity
                                  ? "bg-rose-50 text-rose-700 border-rose-200/80"
                                  : "bg-blue-50 text-blue-700 border-blue-200/80"
                              }`}
                            >
                              <LuActivity className="w-3.5 h-3.5" />
                              <span className="truncate max-w-[200px] sm:max-w-xs">{eventName}</span>
                            </span>
                          </td>

                          {/* Transaction Link */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            {hash ? (
                              <div className="inline-flex items-center gap-1.5 bg-slate-100/90 hover:bg-slate-200/70 px-2.5 py-1 rounded-lg border border-slate-200 text-xs font-mono text-slate-700 transition-colors">
                                <a
                                  href={explorerUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline"
                                  title="View on Block Explorer"
                                >
                                  <span>{`${hash.slice(0, 8)}...${hash.slice(-6)}`}</span>
                                  <LuExternalLink className="w-3 h-3 text-slate-400 group-hover:text-blue-600" />
                                </a>
                                <button
                                  type="button"
                                  onClick={() => copyToClipboard(hash, "hash")}
                                  className="text-slate-400 hover:text-slate-700 ml-1 p-0.5"
                                  title="Copy transaction hash"
                                >
                                  {copiedHash === hash ? (
                                    <LuCheck className="w-3 h-3 text-emerald-600" />
                                  ) : (
                                    <LuCopy className="w-3 h-3" />
                                  )}
                                </button>
                              </div>
                            ) : (
                              <span className="text-slate-400 text-xs font-mono">No Hash</span>
                            )}
                          </td>

                          {/* Action Button */}
                          <td className="py-3.5 px-4 sm:px-6 text-right whitespace-nowrap">
                            <button
                              onClick={() => {
                                setSelectedAlert(item);
                                setIsModalOpen(true);
                              }}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors"
                            >
                              <span>View Details</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination Controls */}
            {filteredAlerts.length > dataPerPage && (
              <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3.5 bg-slate-50/50 border-t border-slate-200/80">
                <span className="text-xs text-slate-500 font-medium">
                  Showing {(currentPage - 1) * dataPerPage + 1} to{" "}
                  {Math.min(currentPage * dataPerPage, filteredAlerts.length)} of{" "}
                  {filteredAlerts.length} incidents
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs"
                  >
                    <LuChevronLeft className="w-4 h-4" />
                  </button>

                  <div className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-white rounded-lg border border-slate-200 shadow-2xs">
                    Page {currentPage} of {totalPages}
                  </div>

                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs"
                  >
                    <LuChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Alert Detail Modal */}
      {isModalOpen && selectedAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200/80 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center">
                  <LuShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Incident Details</h3>
                  <p className="text-xs text-slate-500">
                    Event:{" "}
                    <span className="font-semibold text-slate-700">
                      {selectedAlert.event_name || selectedAlert.name || "Incident"}
                    </span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
              >
                <LuX className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 overflow-y-auto text-xs sm:text-sm">
              {/* Message if present */}
              {selectedAlert.message && (
                <div className="p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-xl text-amber-900 text-xs leading-relaxed flex items-start gap-2.5">
                  <LuAlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block mb-0.5">Incident Anomaly Description:</span>
                    {selectedAlert.message}
                  </div>
                </div>
              )}

              {/* Grid Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                    Timestamp
                  </span>
                  <span className="font-medium text-slate-800">
                    {formatTimestamp(selectedAlert.created_on)}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                    Severity
                  </span>
                  <span
                    className={`inline-flex px-2 py-0.5 rounded-md text-xs font-semibold ${
                      selectedAlert.severity === "Critical"
                        ? "bg-rose-100 text-rose-800"
                        : selectedAlert.severity === "High"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {selectedAlert.severity || "Standard"}
                  </span>
                </div>
              </div>

              {/* From Address */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Origin Address (From)
                </span>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs font-mono text-slate-800">
                  <span className="truncate pr-2">
                    {selectedAlert.from_address || "N/A (System / Contract Genesis)"}
                  </span>
                  {selectedAlert.from_address && (
                    <button
                      onClick={() => copyToClipboard(selectedAlert.from_address, "from")}
                      className="text-slate-400 hover:text-slate-700 shrink-0 p-1"
                    >
                      {copiedAddr === selectedAlert.from_address ? (
                        <LuCheck className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <LuCopy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* To Address */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Target Contract Address (To)
                </span>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs font-mono text-slate-800">
                  <span className="truncate pr-2">
                    {selectedAlert.to_address || "N/A"}
                  </span>
                  {selectedAlert.to_address && (
                    <button
                      onClick={() => copyToClipboard(selectedAlert.to_address, "to")}
                      className="text-slate-400 hover:text-slate-700 shrink-0 p-1"
                    >
                      {copiedAddr === selectedAlert.to_address ? (
                        <LuCheck className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <LuCopy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Transaction Hash */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Transaction Hash
                </span>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs font-mono text-slate-800">
                  <span className="truncate pr-2">
                    {selectedAlert.hash || selectedAlert.tx_hash || "No on-chain hash recorded"}
                  </span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {(selectedAlert.hash || selectedAlert.tx_hash) && (
                      <>
                        <button
                          onClick={() =>
                            copyToClipboard(selectedAlert.hash || selectedAlert.tx_hash, "hash")
                          }
                          className="text-slate-400 hover:text-slate-700 p-1"
                          title="Copy Hash"
                        >
                          {copiedHash === (selectedAlert.hash || selectedAlert.tx_hash) ? (
                            <LuCheck className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <LuCopy className="w-3.5 h-3.5" />
                          )}
                        </button>

                        <a
                          href={getExplorerTxUrl(
                            selectedAlert.network || 1,
                            selectedAlert.hash || selectedAlert.tx_hash
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 p-1"
                          title="Open in Block Explorer"
                        >
                          <LuExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Arguments / Payload */}
              {selectedAlert.arguments && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Event Arguments & Data
                  </span>
                  <pre className="p-3 rounded-xl bg-slate-900 text-slate-100 text-xs font-mono overflow-x-auto max-h-40">
                    {typeof selectedAlert.arguments === "object"
                      ? JSON.stringify(selectedAlert.arguments, null, 2)
                      : String(selectedAlert.arguments)}
                  </pre>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200/80 bg-slate-50/50 flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Contract_Incident;