import React, { useState, useEffect, useMemo } from "react";
import { Switch } from "@headlessui/react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { baseUrl } from "../Constants/data";
import { ALL_NETWORKS } from "../Constants/networks";
import {
  LuBellRing,
  LuTrash2,
  LuCopy,
  LuCheck,
  LuSearch,
  LuX,
  LuWallet,
  LuShieldCheck,
  LuChevronLeft,
  LuChevronRight,
  LuExternalLink,
} from "react-icons/lu";

const EXPLORER_BASE = {
  1: "https://etherscan.io/address/",
  11155111: "https://sepolia.etherscan.io/address/",
  42161: "https://arbiscan.io/address/",
  8453: "https://basescan.org/address/",
  56: "https://bscscan.com/address/",
  137: "https://polygonscan.com/address/",
  80002: "https://amoy.polygonscan.com/address/",
  43114: "https://snowtrace.io/address/",
  100: "https://gnosisscan.io/address/",
  59144: "https://explorer.linea.build/address/",
  1313161554: "https://explorer.mainnet.aurora.dev/address/",
  10: "https://optimistic.etherscan.io/address/",
  50: "https://xdcscan.com/address/",
  169: "https://pacific-info.manta.network/address/",
  146: "https://explorer.soniclabs.com/address/",
  1625: "https://gscan.xyz/address/",
  7000: "https://explorer.mainnet.zetachain.com/address/",
  47763: "https://xexplorer.neo.org/address/",
  592: "https://astar.subscan.io/address/",
  1868: "https://soneium.blockscout.com/address/",
  747474: "https://explorer.katanarpc.com/address/",
  43111: "https://explorer.hemi.xyz/address/",
  185: "https://explorer.mintchain.io/address/",
  1116: "https://scan.coredao.org/address/",
};

const Wallet_Security_Cmp = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [monitors, setMonitors] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedAddress, setCopiedAddress] = useState(null);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const is_admin = localStorage.getItem("is_admin");
  const parent_id = localStorage.getItem("parent_id");

  const [currentPage, setCurrentPage] = useState(1);
  const dataPerPage = 10;

  useEffect(() => {
    const fetchMonitors = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${baseUrl}/get_wallet_monitor`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            user_id: parent_id && parent_id !== "0" ? parseInt(parent_id) : parseInt(userId || 0),
          }),
        });

        if (res.status === 401 || res.status === 403) {
          toast.error("Session expired, please login again");
          localStorage.clear();
          navigate("/login");
          return;
        }

        const data = await res.json();
        const list = data.monitors || [];

        // Sort by created_on descending
        list.sort((a, b) => new Date(b.created_on || 0) - new Date(a.created_on || 0));
        setMonitors(list);
      } catch (err) {
        console.error("Failed to load wallet monitors:", err);
        setMonitors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMonitors();
  }, [parent_id, token, userId, navigate]);

  // Helper to resolve network metadata
  const getNetworkMeta = (networkId) => {
    const netIdStr = String(networkId);
    const found = ALL_NETWORKS.find(
      (n) => n.id === netIdStr || String(n.chainId) === netIdStr || n.name.toLowerCase() === netIdStr.toLowerCase()
    );
    if (found) return found;

    return {
      name: typeof networkId === "string" ? networkId : `Chain ${networkId}`,
      tag: "CHAIN",
      badgeColor: "bg-slate-100 text-slate-700 border-slate-300",
    };
  };

  const getExplorerAddressUrl = (networkVal, address) => {
    if (!address) return "#";
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
      base = "https://etherscan.io/address/";
    }
    return `${base}${address}`;
  };

  const handleCopy = (address) => {
    if (!address) return;
    navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    toast.success("Wallet address copied!", { autoClose: 1500 });
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  const handleDeleteMonitor = async (monitor_id) => {
    if (!window.confirm("Are you sure you want to delete this wallet monitor?")) return;

    try {
      const response = await fetch(`${baseUrl}/delete_wallet_monitor`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ monitor_id }),
      });

      if (response.ok) {
        setMonitors((prev) => prev.filter((m) => m.mid !== monitor_id));
        toast.success("Wallet monitor deleted successfully.");
      } else {
        toast.error("Failed to delete monitor. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting monitor:", error);
      toast.error("Network error while deleting monitor.");
    }
  };

  const handleToggleStatus = async (item) => {
    const newStatus = item.status === 1 || item.status === true ? 0 : 1;
    // Optimistic UI update
    setMonitors((prev) =>
      prev.map((m) => (m.mid === item.mid ? { ...m, status: newStatus } : m))
    );

    try {
      await fetch(`${baseUrl}/update_wallet_monitor`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          monitor_id: item.mid,
          status: newStatus,
        }),
      });
      toast.success(
        `Monitor ${newStatus === 1 ? "activated" : "paused"}`
      );
    } catch (e) {
      console.error("Failed to update status:", e);
    }
  };

  // Filtered monitors based on search
  const filteredMonitors = useMemo(() => {
    if (!searchQuery.trim()) return monitors;
    const q = searchQuery.toLowerCase();
    return monitors.filter((m) => {
      const name = (m.name || "").toLowerCase();
      const addr = (m.address || "").toLowerCase();
      const meta = getNetworkMeta(m.network);
      return (
        name.includes(q) ||
        addr.includes(q) ||
        meta.name.toLowerCase().includes(q) ||
        meta.tag.toLowerCase().includes(q)
      );
    });
  }, [monitors, searchQuery]);

  // Pagination slice
  const totalPages = Math.max(1, Math.ceil(filteredMonitors.length / dataPerPage));
  const displayedMonitors = useMemo(() => {
    const start = (currentPage - 1) * dataPerPage;
    return filteredMonitors.slice(start, start + dataPerPage);
  }, [filteredMonitors, currentPage, dataPerPage]);

  return (
    <div className="w-full space-y-4">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />

      {/* Control Bar: Search & Status summary */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div className="relative flex-1 max-w-md">
          <LuSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search wallet name, network, or address..."
            style={{ paddingLeft: "2.5rem", paddingRight: "2.25rem" }}
            className="w-full py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
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

        <div className="flex items-center gap-3 justify-end text-xs text-slate-500">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-50 border border-slate-200/80 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Total Active:{" "}
            <strong className="text-slate-700">
              {monitors.filter((m) => m.status === 1 || m.status === true).length}
            </strong>
          </span>
          <span className="text-slate-400">·</span>
          <span>
            Total Watched: <strong className="text-slate-700">{monitors.length}</strong>
          </span>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-16 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-[3px] border-slate-200 border-t-blue-600 mb-3"></div>
            <p className="text-sm font-medium text-slate-600">Loading wallet surveillance...</p>
          </div>
        ) : filteredMonitors.length === 0 ? (
          <div className="p-16 text-center max-w-md mx-auto">
            <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <LuWallet className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-slate-900 mb-1">
              {searchQuery ? "No matching wallets found" : "No Wallet Monitors Deployed"}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mb-5 leading-relaxed">
              {searchQuery
                ? "Try searching with a different wallet name, chain, or address."
                : "Add treasury multisigs, team cold wallets, or operational hot wallets to detect unexpected balance drops and suspicious approvals."}
            </p>
            {is_admin == 1 && (
              <button
                onClick={() => navigate("/wallet_monitor_create")}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors"
              >
                <span>Deploy First Wallet Monitor</span>
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-4 sm:px-6">Name</th>
                  <th className="py-3.5 px-4">Network</th>
                  <th className="py-3.5 px-4">Created On</th>
                  <th className="py-3.5 px-4">Watched Address</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                {displayedMonitors.map((item) => {
                  const meta = getNetworkMeta(item.network);
                  const isEnabled = item.status === 1 || item.status === true;
                  const dateStr = item.created_on
                    ? new Date(item.created_on).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "—";

                  return (
                    <tr
                      key={item.mid}
                      className="hover:bg-slate-50/70 transition-colors group"
                    >
                      {/* Name & Category */}
                      <td className="py-3.5 px-4 sm:px-6 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                            <LuWallet className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                              {item.name}
                            </span>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span
                                className={`text-[10px] font-medium px-1.5 py-0.2 rounded ${
                                  item.category === "Critical"
                                    ? "bg-rose-50 text-rose-700 border border-rose-200/60"
                                    : item.category === "High"
                                    ? "bg-amber-50 text-amber-700 border border-amber-200/60"
                                    : "bg-slate-100 text-slate-600 border border-slate-200/60"
                                }`}
                              >
                                {item.category || "Standard"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Network Badge */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${meta.badgeColor}`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70"></span>
                          <span>{meta.name}</span>
                        </span>
                      </td>

                      {/* Created On */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-slate-500 font-medium">
                        {dateStr}
                      </td>

                      {/* Address with copy pill & block explorer link */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100/80 px-2.5 py-1 rounded-lg border border-slate-200/80 text-xs font-mono text-slate-700 transition-colors">
                          <a
                            href={getExplorerAddressUrl(item.network, item.address)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-blue-600 flex items-center gap-1"
                            title="View Address on Explorer"
                          >
                            <span>
                              {item.address
                                ? `${item.address.slice(0, 6)}...${item.address.slice(-4)}`
                                : "N/A"}
                            </span>
                            <LuExternalLink className="w-3 h-3 text-slate-400 group-hover:text-blue-600" />
                          </a>
                          <button
                            type="button"
                            onClick={() => handleCopy(item.address)}
                            className="text-slate-400 hover:text-slate-700 ml-1 p-0.5"
                            title="Copy address"
                          >
                            {copiedAddress === item.address ? (
                              <LuCheck className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <LuCopy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 sm:px-6 whitespace-nowrap text-right">
                        <div className="inline-flex items-center gap-2 justify-end">
                          {/* Alerts Button */}
                          <button
                            onClick={() => {
                              navigate("/wallet_monitor_alerts", {
                                state: { mid: item.mid, network: item.network },
                              });
                            }}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200/80 bg-white hover:bg-rose-50 hover:border-rose-200 text-slate-700 hover:text-rose-700 text-xs font-semibold shadow-2xs transition-all"
                            title="View Incident Alerts for this Wallet"
                          >
                            <LuBellRing className="w-3.5 h-3.5 text-rose-500" />
                            <span>Alerts</span>
                          </button>

                          {/* Delete Button (admin only) */}
                          {is_admin == 1 && (
                            <button
                              onClick={() => handleDeleteMonitor(item.mid)}
                              className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                              title="Delete Monitor"
                            >
                              <LuTrash2 className="w-4 h-4" />
                            </button>
                          )}

                          {/* Active / Inactive Switch */}
                          {is_admin == 1 && (
                            <Switch
                              checked={isEnabled}
                              onChange={() => handleToggleStatus(item)}
                              className={`${
                                isEnabled ? "bg-emerald-500" : "bg-slate-200"
                              } relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500/20`}
                              title={isEnabled ? "Active Sentinel" : "Paused"}
                            >
                              <span
                                aria-hidden="true"
                                className={`${
                                  isEnabled ? "translate-x-4" : "translate-x-0"
                                } pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out`}
                              />
                            </Switch>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls */}
        {filteredMonitors.length > dataPerPage && (
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3.5 bg-slate-50/50 border-t border-slate-200/80">
            <span className="text-xs text-slate-500 font-medium">
              Showing {(currentPage - 1) * dataPerPage + 1} to{" "}
              {Math.min(currentPage * dataPerPage, filteredMonitors.length)} of{" "}
              {filteredMonitors.length} wallets
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
  );
};

export default Wallet_Security_Cmp;
