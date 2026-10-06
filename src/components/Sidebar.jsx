import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LuShieldCheck,
  LuShieldAlert,
  LuZap,
  LuHistory,
  LuBarChart3,
  LuFileSearch,
  LuLayers,
  LuBoxes,
  LuUsers,
  LuCreditCard,
  LuPanelLeftClose,
  LuPanelLeftOpen,
  LuExternalLink,
} from "react-icons/lu";
import SecureDappLogo from "../images/SecureDapp.png";

const SIDEBAR_EXPANDED_WIDTH = 264;
const SIDEBAR_COLLAPSED_WIDTH = 72;

const springTransition = {
  type: "spring",
  stiffness: 300,
  damping: 30,
  mass: 0.8,
};

export default function Sidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(() => {
    const saved = localStorage.getItem("sw_sidebar_collapsed");
    return saved === "true";
  });

  // Keep documentElement class synchronized for responsive CSS variables
  useEffect(() => {
    if (collapsed) {
      document.documentElement.classList.add("sidebar-collapsed");
    } else {
      document.documentElement.classList.remove("sidebar-collapsed");
    }
    localStorage.setItem("sw_sidebar_collapsed", collapsed);
  }, [collapsed]);

  // Keyboard shortcut Ctrl+B / Cmd+B to toggle sidebar
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "b") {
        e.preventDefault();
        setCollapsed((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const toggleSidebar = () => {
    setCollapsed((prev) => !prev);
  };

  const navGroups = [
    {
      groupTitle: "Security & Surveillance",
      items: [
        {
          title: "Realtime Security",
          to: "/dashboard",
          icon: LuShieldCheck,
          badge: "Live",
          badgeVariant: "live",
          matchPrefixes: ["/dashboard", "/monitor", "/alerts", "/function", "/event"],
        },
        {
          title: "Contract Incidents",
          to: "/contract_incidents",
          icon: LuShieldAlert,
        },
        {
          title: "Autodefend Engine",
          to: "/autodefend",
          icon: LuZap,
          badge: "PRO",
          badgeVariant: "pro",
          matchPrefixes: ["/autodefend", "/autodefend_edit"],
        },
      ],
    },
    {
      groupTitle: "Analytics & Forensics",
      items: [
        {
          title: "Historical Insights",
          to: "/historical_insights",
          icon: LuHistory,
        },
        {
          title: "Analytics & Reports",
          to: "/analyticsmodule",
          icon: LuBarChart3,
          matchPrefixes: ["/analyticsmodule", "/analytics", "/algotics"],
        },
        {
          title: "Security Audit",
          href: "https://securedapp.io/solidity-shield",
          icon: LuFileSearch,
          external: true,
        },
        {
          title: "Blockchain Forensics",
          href: "https://securedapp.io/secure-trace",
          icon: LuLayers,
          external: true,
        },
      ],
    },
    {
      groupTitle: "Platform & Governance",
      items: [
        {
          title: "Integration Hub",
          to: "/comingsoon",
          icon: LuBoxes,
        },
        {
          title: "Admin Panel",
          to: "/admin",
          icon: LuUsers,
          matchPrefixes: ["/admin", "/admin_add_user"],
        },
        {
          title: "Plans & Billing",
          to: "/billing",
          icon: LuCreditCard,
          matchPrefixes: ["/billing", "/pricing"],
        },
      ],
    },
  ];

  const checkIsActive = (item) => {
    if (item.external) return false;
    if (location.pathname === item.to) return true;
    if (item.matchPrefixes) {
      return item.matchPrefixes.some((p) => location.pathname.startsWith(p));
    }
    return false;
  };

  // Keep body and documentElement synchronized for app-shell fixed viewport
  useEffect(() => {
    document.body.classList.add("app-shell-active");
    return () => {
      document.body.classList.remove("app-shell-active");
    };
  }, []);

  const badgeStyles = {
    live: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-200/70",
      dot: "bg-emerald-500",
    },
    pro: {
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-200/70",
      dot: null,
    },
  };

  return (
    <motion.aside
      id="main-sidebar"
      aria-label="Sidebar navigation"
      initial={false}
      animate={{
        width: collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_EXPANDED_WIDTH,
      }}
      transition={springTransition}
      className="fixed top-16 left-0 h-[calc(100vh-64px)] z-40 flex flex-col justify-between select-none overflow-hidden bg-white border-r border-slate-200/80 shadow-[1px_0_3px_rgba(0,0,0,0.02)]"
    >
      {/* ── Top: Toggle + Navigation ── */}
      <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin">
        {/* Sidebar Header */}
        <div
          className={`flex items-center h-12 flex-shrink-0 ${
            collapsed ? "justify-center px-2" : "justify-between px-4"
          }`}
        >
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.span
                key="label"
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -6 }}
                transition={{ duration: 0.15 }}
                className="text-[10px] font-bold tracking-[0.1em] uppercase text-slate-400"
              >
                Security Workspace
              </motion.span>
            )}
          </AnimatePresence>

          <button
            type="button"
            onClick={toggleSidebar}
            title={collapsed ? "Expand sidebar (Ctrl+B)" : "Collapse sidebar (Ctrl+B)"}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            {collapsed ? (
              <LuPanelLeftOpen className="w-[18px] h-[18px]" />
            ) : (
              <LuPanelLeftClose className="w-[18px] h-[18px]" />
            )}
          </button>
        </div>

        {/* Divider */}
        <div className="mx-3.5 h-px bg-slate-200/70 flex-shrink-0" />

        {/* Navigation Groups */}
        <nav className="flex flex-col gap-5 pt-3 pb-4">
          {navGroups.map((group, gIdx) => (
            <div key={gIdx} className="flex flex-col">
              {/* Group Title */}
              {!collapsed ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.05, duration: 0.2 }}
                  className="px-4 pb-1.5 text-[10px] font-bold uppercase tracking-[0.09em] text-slate-400"
                >
                  {group.groupTitle}
                </motion.div>
              ) : (
                <div className="mx-auto my-1 w-5 h-px bg-slate-200/50" />
              )}

              {/* Group Items */}
              <div className="flex flex-col gap-0.5 px-2.5">
                {group.items.map((item, iIdx) => {
                  const isActive = checkIsActive(item);
                  const Icon = item.icon;
                  const badge = item.badge
                    ? badgeStyles[item.badgeVariant] || badgeStyles.pro
                    : null;

                  const LinkWrapper = item.external ? "a" : Link;
                  const linkProps = item.external
                    ? {
                        href: item.href,
                        target: "_blank",
                        rel: "noopener noreferrer",
                      }
                    : { to: item.to };

                  return (
                    <div key={iIdx} className="relative group">
                      <LinkWrapper
                        {...linkProps}
                        className={`
                          relative flex items-center gap-3 w-full rounded-xl text-[13px]
                          transition-all duration-150 ease-out
                          ${collapsed ? "justify-center px-2 py-2.5" : "px-3 py-2"}
                          ${
                            isActive
                              ? "bg-blue-50/80 text-blue-700 font-semibold shadow-[inset_0_0_0_1px_rgba(59,130,246,0.15)]"
                              : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium"
                          }
                        `}
                      >
                        {/* Active left indicator pill */}
                        {isActive && (
                          <motion.div
                            layoutId="sidebar-active-indicator"
                            className="absolute left-1 top-[7px] bottom-[7px] w-1 rounded-full bg-blue-600"
                            transition={springTransition}
                          />
                        )}

                        <div className="flex items-center gap-3 min-w-0">
                          <Icon
                            className={`w-[18px] h-[18px] flex-shrink-0 transition-colors duration-150 ${
                              isActive
                                ? "text-blue-600"
                                : "text-slate-400 group-hover:text-slate-600"
                            }`}
                          />
                          <AnimatePresence mode="wait">
                            {!collapsed && (
                              <motion.span
                                key={`label-${item.title}`}
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: "auto" }}
                                exit={{ opacity: 0, width: 0 }}
                                transition={{ duration: 0.15 }}
                                className="truncate whitespace-nowrap"
                              >
                                {item.title}
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </div>

                        {/* Badges & External icon */}
                        <AnimatePresence>
                          {!collapsed && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.1 }}
                              className="flex items-center gap-1.5 flex-shrink-0 ml-auto"
                            >
                              {badge && (
                                <span
                                  className={`
                                    inline-flex items-center gap-1 text-[9.5px] uppercase font-bold
                                    tracking-wider px-1.5 py-[2px] rounded-md border
                                    ${badge.bg} ${badge.text} ${badge.border}
                                  `}
                                >
                                  {badge.dot && (
                                    <span
                                      className={`w-1.5 h-1.5 rounded-full ${badge.dot} animate-pulse`}
                                    />
                                  )}
                                  {item.badge}
                                </span>
                              )}
                              {item.external && (
                                <LuExternalLink className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-70 transition-opacity duration-150" />
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </LinkWrapper>

                      {/* Tooltip (Collapsed Mode) */}
                      {collapsed && (
                        <div
                          className="
                            pointer-events-none absolute left-[calc(100%+8px)] top-1/2 -translate-y-1/2 z-50
                            hidden group-hover:flex items-center gap-2
                            px-3 py-1.5 bg-slate-900 text-white text-xs font-medium
                            rounded-lg shadow-xl whitespace-nowrap
                            border border-slate-800
                          "
                        >
                          <span>{item.title}</span>
                          {item.badge && (
                            <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-px rounded">
                              {item.badge}
                            </span>
                          )}
                          {item.external && (
                            <LuExternalLink className="w-3 h-3 text-slate-400" />
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* ── Footer: Brand Pill ── */}
      <div className="flex-shrink-0 border-t border-slate-200/70 bg-slate-50/50">
        {!collapsed ? (
          <div className="p-3">
            <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white border border-slate-200/80 shadow-xs">
              <img
                src={SecureDappLogo}
                alt="SecureWatch"
                className="w-6 h-6 object-contain flex-shrink-0"
              />
              <span className="text-[12px] font-semibold text-slate-800 leading-tight truncate">
                SecureWatch
              </span>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center py-3 group relative">
            <img
              src={SecureDappLogo}
              alt="SecureWatch"
              className="w-6 h-6 object-contain opacity-90 group-hover:opacity-100 transition-opacity duration-150"
            />

            {/* Collapsed footer tooltip */}
            <div
              className="
                pointer-events-none absolute left-[calc(100%+8px)] top-1/2 -translate-y-1/2 z-50
                hidden group-hover:flex items-center gap-2
                px-3 py-1.5 bg-slate-900 text-white text-xs font-medium
                rounded-lg shadow-xl whitespace-nowrap border border-slate-800
              "
            >
              <span>SecureWatch</span>
            </div>
          </div>
        )}
      </div>
    </motion.aside>
  );
}
