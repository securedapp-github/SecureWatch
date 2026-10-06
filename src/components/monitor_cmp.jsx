import React, { useState, useEffect, useMemo } from "react";
import { Switch } from "@headlessui/react";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { baseUrl } from "../Constants/data";
import { ALL_NETWORKS } from "../Constants/networks";
import {
  LuBellRing,
  LuBarChart3,
  LuPencil,
  LuTrash2,
  LuCopy,
  LuCheck,
  LuSearch,
  LuX,
  LuCode2,
  LuShieldAlert,
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

const Monitor_cmp = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [moniter, setMoniter] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedAddress, setCopiedAddress] = useState(null);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const is_admin = localStorage.getItem("is_admin");
  const parent_id = localStorage.getItem("parent_id");

  const [currentPage, setCurrentPage] = useState(1);
  const dataPerPage = 10;

  useEffect(() => {
    const fetchMoniter = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${baseUrl}/get_monitor`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            user_id: parent_id != 0 ? parseInt(parent_id) : parseInt(userId),
          }),
        });
        const data = await res.json();
        const monitorsList = data.monitors || [];
        const sorted = [...monitorsList].sort(
          (a, b) => new Date(b.created_on || 0) - new Date(a.created_on || 0)
        );
        setMoniter(sorted);
      } catch (err) {
        console.warn("Fetch monitor error:", err);
        setMoniter([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMoniter();
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

  // Search filter
  const filteredMonitors = useMemo(() => {
    if (!searchQuery.trim()) return moniter;
    const q = searchQuery.toLowerCase().trim();
    return moniter.filter((m) => {
      const netMeta = getNetworkMeta(m.network);
      return (
        m.name?.toLowerCase().includes(q) ||
        m.address?.toLowerCase().includes(q) ||
        netMeta.name.toLowerCase().includes(q) ||
        netMeta.tag.toLowerCase().includes(q)
      );
    });
  }, [moniter, searchQuery]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredMonitors.length / dataPerPage));
  const indexOfLast = currentPage * dataPerPage;
  const indexOfFirst = indexOfLast - dataPerPage;
  const currentData = filteredMonitors.slice(indexOfFirst, indexOfLast);

  // Copy address helper
  const handleCopy = (address) => {
    if (!address) return;
    navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    toast.info("Address copied to clipboard", { autoClose: 900 });
    setTimeout(() => setCopiedAddress(null), 1800);
  };

  // Toggle status
  const handleToggleStatus = async (mid, currentStatus) => {
    const newStatus = currentStatus === 1 || currentStatus === true ? 0 : 1;

    // Optimistic UI update
    setMoniter((prev) =>
      prev.map((m) => (m.mid === mid ? { ...m, status: newStatus } : m))
    );

    try {
      const res = await fetch(`${baseUrl}/update_monitor`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          monitor_id: mid,
          status: newStatus,
        }),
      });
      if (res.ok) {
        toast.success(
          newStatus === 1 ? "Sentinel resumed & active" : "Sentinel paused",
          { autoClose: 1000 }
        );
      }
    } catch (e) {
      console.warn("Status toggle backend note:", e);
    }
  };

  // Delete monitor
  const handleDeleteMonitor = async (mid) => {
    if (!window.confirm("Are you sure you want to delete this sentinel monitor?"))
      return;

    try {
      const response = await fetch(`${baseUrl}/delete_monitor`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ monitor_id: mid }),
      });
      if (response.ok) {
        setMoniter((prev) => prev.filter((m) => m.mid !== mid));
        toast.success("Monitor removed successfully.");
      } else {
        toast.error("Failed to delete monitor. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="w-full bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-12 flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-semibold text-slate-500">Loading active monitors...</p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-4">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Toolbar: Search + Quick Stats */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-3.5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <LuSearch className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by monitor name, address, or network..."
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
          <span>Total Monitors:</span>
          <span className="font-bold text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
            {filteredMonitors.length}
          </span>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        {filteredMonitors.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400">
              <LuShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              {searchQuery ? "No matching monitors found" : "No contract monitors deployed"}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm">
              {searchQuery
                ? "Try adjusting your search query or clear the filter."
                : "Arm a new real-time event watcher to monitor contract transactions and security events."}
            </p>
            {!searchQuery && (
              <Link
                to="/monitor_create"
                className="mt-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition"
              >
                + Deploy First Monitor
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-4 sm:px-6">Monitor Name</th>
                  <th className="py-3.5 px-4">Network</th>
                  <th className="py-3.5 px-4">Contract Address</th>
                  <th className="py-3.5 px-4">Created On</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700 font-medium">
                {currentData.map((item) => {
                  const netMeta = getNetworkMeta(item.network);
                  const isChecked = item.status === 1 || item.status === true;
                  const isCopying = copiedAddress === item.address;

                  return (
                    <tr
                      key={item.mid}
                      className="hover:bg-slate-50/60 transition-colors"
                    >
                      {/* Monitor Name & Category */}
                      <td className="py-4 px-4 sm:px-6">
                        <div className="flex flex-col gap-0.5">
                          <strong className="text-sm font-bold text-slate-900 leading-tight">
                            {item.name || "Unnamed Sentinel"}
                          </strong>
                          {item.category && (
                            <span className="text-[10px] text-slate-400 font-medium">
                              Type: {item.category}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Network Badge */}
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${netMeta.badgeColor}`}
                        >
                          {netMeta.tag} · {netMeta.name}
                        </span>
                      </td>

                      {/* Address */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        {item.address ? (
                          <div className="inline-flex items-center gap-1.5 font-mono text-[11px] bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 px-2.5 py-1 rounded-lg transition-colors group/addr">
                            <a
                              href={getExplorerAddressUrl(item.network, item.address)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-slate-700 hover:text-blue-600 flex items-center gap-1 font-mono"
                              title="View Contract on Block Explorer"
                            >
                              <span>
                                {item.address.slice(0, 6)}...{item.address.slice(-4)}
                              </span>
                              <LuExternalLink className="w-3 h-3 text-slate-400 group-hover/addr:text-blue-600" />
                            </a>
                            <button
                              type="button"
                              onClick={() => handleCopy(item.address)}
                              title="Copy full contract address"
                              className="text-slate-400 hover:text-slate-700 ml-1 p-0.5 transition cursor-pointer"
                            >
                              {isCopying ? (
                                <LuCheck className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <LuCopy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        ) : (
                          <span className="text-slate-400 font-italic">N/A</span>
                        )}
                      </td>

                      {/* Created On */}
                      <td className="py-4 px-4 text-slate-500 whitespace-nowrap text-xs font-medium tabular-nums">
                        {item.created_on
                          ? new Date(item.created_on).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })
                          : "Recent"}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 sm:px-6">
                        <div className="flex items-center justify-end gap-2">
                          {/* Dedicated Alerts Badge Button */}
                          <button
                            type="button"
                            onClick={() => {
                              if (item.network === 1300 || item.network === 1301) {
                                navigate("/algo_alerts", {
                                  state: { mid: item.mid, network: item.network },
                                });
                              } else {
                                navigate("/monitor_alerts", {
                                  state: { mid: item.mid, network: item.network },
                                });
                              }
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold border border-blue-200/80 transition cursor-pointer shadow-2xs"
                          >
                            <LuBellRing className="w-3.5 h-3.5" />
                            <span>Alerts</span>
                          </button>

                          {/* Analytics Icon Button */}
                          <button
                            type="button"
                            onClick={() =>
                              navigate("/analyticsmodule", {
                                state: {
                                  mid: item.mid,
                                  network: item.network,
                                  address: item.address,
                                },
                              })
                            }
                            title="View Analytics & Trends"
                            className="p-1.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition cursor-pointer"
                          >
                            <LuBarChart3 className="w-4 h-4" />
                          </button>

                          {/* Interact Button (If Admin) */}
                          {is_admin == 1 && (
                            <button
                              type="button"
                              onClick={() =>
                                navigate("/api_builder?id=" + item.mid, {
                                  state: {
                                    mid: item.mid,
                                    name: item.name,
                                    network: item.network,
                                    address: item.address,
                                    alert_data: item.alert_data,
                                    alert_type: item.alert_type,
                                  },
                                })
                              }
                              title="Smart Contract Interface & Testing"
                              className="p-1.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition cursor-pointer"
                            >
                              <LuCode2 className="w-4 h-4" />
                            </button>
                          )}

                          {/* Edit Button (If Admin) */}
                          {is_admin == 1 && (
                            <button
                              type="button"
                              onClick={() =>
                                navigate("/monitor_Edit?id=" + item.mid, {
                                  state: {
                                    mid: item.mid,
                                    name: item.name,
                                    network: item.network,
                                    address: item.address,
                                    alert_data: item.alert_data,
                                    alert_type: item.alert_type,
                                    slack_webhook: item.slack_webhook,
                                  },
                                })
                              }
                              title="Edit Monitor Settings"
                              className="p-1.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition cursor-pointer"
                            >
                              <LuPencil className="w-4 h-4" />
                            </button>
                          )}

                          {/* Delete Button (If Admin) */}
                          {is_admin == 1 && (
                            <button
                              type="button"
                              onClick={() => handleDeleteMonitor(item.mid)}
                              title="Delete Sentinel"
                              className="p-1.5 rounded-lg border border-slate-200 hover:border-rose-300 hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition cursor-pointer"
                            >
                              <LuTrash2 className="w-4 h-4" />
                            </button>
                          )}

                          {/* Active / Inactive Status Switch */}
                          {is_admin == 1 && (
                            <div className="pl-1 flex items-center" title={isChecked ? "Active Surveillance" : "Sentinel Paused"}>
                              <Switch
                                checked={isChecked}
                                onChange={() => handleToggleStatus(item.mid, item.status)}
                                className={`${
                                  isChecked ? "bg-emerald-600" : "bg-slate-200"
                                } relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer`}
                              >
                                <span className="sr-only">Toggle monitor status</span>
                                <span
                                  className={`${
                                    isChecked ? "translate-x-4.5" : "translate-x-1"
                                  } inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform`}
                                />
                              </Switch>
                            </div>
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

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>
              Showing {indexOfFirst + 1}–{Math.min(indexOfLast, filteredMonitors.length)} of{" "}
              {filteredMonitors.length} monitors
            </span>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 transition cursor-pointer"
              >
                <LuChevronLeft className="w-4 h-4" />
              </button>

              <span className="px-3 py-1 font-bold text-slate-900 bg-slate-100 rounded-lg">
                {currentPage} / {totalPages}
              </span>

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 transition cursor-pointer"
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

export default Monitor_cmp;
