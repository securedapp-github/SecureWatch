import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import NewNavbar from "./NewNavbar";
import Sidebar from "./Sidebar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { isAddress } from "web3-validator";
import {
  LuArrowLeft,
  LuArrowRight,
  LuCheck,
  LuCheckCircle2,
  LuLayers,
  LuTag,
  LuWallet,
  LuKeyRound,
  LuBellRing,
  LuMail,
  LuWebhook,
  LuClipboard,
  LuHelpCircle,
  LuShieldAlert,
  LuSearch,
  LuChevronDown,
  LuChevronUp,
  LuX,
  LuGlobe,
} from "react-icons/lu";
import { TbLoader2 } from "react-icons/tb";
import { ALL_NETWORKS, FEATURED_NETWORKS } from "../Constants/networks";

const STEPS = [
  { step: 1, title: "Network", desc: "Select Chain", icon: LuLayers },
  { step: 2, title: "Wallet Target", desc: "Address & Name", icon: LuWallet },
  { step: 3, title: "Alerts & Launch", desc: "Routing & Deploy", icon: LuBellRing },
];

function WalletMonitorCreate() {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("email") || "user@securedapp.io";
  const parent_id = localStorage.getItem("parent_id");
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  // Step state
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step 1: Network
  const [network, setNetwork] = useState("1");
  const [networkName, setNetworkName] = useState("Ethereum Mainnet");
  const [chainSearch, setChainSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showAllChains, setShowAllChains] = useState(false);

  // Step 2: Target
  const [monitorName, setMonitorName] = useState("");
  const [address, setAddress] = useState("");

  // Step 3: Alerts
  const [email, setEmail] = useState(userEmail);
  const [slack, setSlack] = useState("");

  // Filter networks based on search, category and expansion toggle
  const displayedNetworks = useMemo(() => {
    const query = chainSearch.trim().toLowerCase();

    if (query) {
      return ALL_NETWORKS.filter(
        (n) =>
          n.name.toLowerCase().includes(query) ||
          n.tag.toLowerCase().includes(query) ||
          n.id.includes(query) ||
          n.desc.toLowerCase().includes(query)
      );
    }

    if (selectedCategory === "Featured") {
      return FEATURED_NETWORKS;
    }
    if (selectedCategory !== "All") {
      return ALL_NETWORKS.filter((n) => n.category === selectedCategory);
    }

    // When "All" is selected and not expanded, show featured + currently selected if it is an alt-chain
    if (!showAllChains) {
      const list = [...FEATURED_NETWORKS];
      if (!list.some((n) => n.id === network)) {
        const found = ALL_NETWORKS.find((n) => n.id === network);
        if (found) list.push(found);
      }
      return list;
    }

    return ALL_NETWORKS;
  }, [chainSearch, selectedCategory, showAllChains, network]);

  const isAlgorand = network === "1300" || network === "1301";

  // Address checksum / format validation
  const addressValidation = useMemo(() => {
    if (!address.trim()) return null;
    if (isAlgorand) {
      const isNum = /^[a-zA-Z0-9]{58}$/.test(address.trim()) || /^\d+$/.test(address.trim());
      return {
        valid: isNum,
        severity: isNum ? "success" : "error",
        charsCount: address.trim().length,
        message: isNum ? "Valid Algorand address format" : "Check Algorand address characters",
      };
    }

    const raw = address.trim();
    if (!raw.startsWith("0x") && !raw.startsWith("0X")) {
      const isCleanHex = /^[a-fA-F0-9]+$/.test(raw);
      if (raw.length === 40 && isCleanHex) {
        return {
          valid: false,
          severity: "warning",
          charsCount: raw.length,
          message: "Missing '0x' prefix",
        };
      }
      return {
        valid: false,
        severity: "error",
        charsCount: raw.length,
        message: "Address must begin with '0x'",
      };
    }

    const hexPart = raw.slice(2);
    const hasInvalidChars = !/^[a-fA-F0-9]*$/.test(hexPart);

    if (hasInvalidChars) {
      return {
        valid: false,
        severity: "error",
        charsCount: raw.length,
        message: "Invalid characters: only hexadecimal (0-9, a-f) allowed",
      };
    }

    if (raw.length < 42) {
      return {
        valid: false,
        severity: "warning",
        charsCount: raw.length,
        message: `Incomplete address (${raw.length}/42 chars - need ${42 - raw.length} more)`,
      };
    }

    if (raw.length > 42) {
      return {
        valid: false,
        severity: "error",
        charsCount: raw.length,
        message: `Address exceeds 42 characters (${raw.length}/42 chars)`,
      };
    }

    return {
      valid: true,
      severity: "success",
      charsCount: raw.length,
      message: "Valid EVM 20-byte wallet address",
    };
  }, [address, isAlgorand]);

  // Paste address helper
  const handlePasteAddress = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        let trimmed = text.trim();
        if (/^[a-fA-F0-9]{40}$/.test(trimmed)) {
          trimmed = `0x${trimmed}`;
        }
        setAddress(trimmed);
        toast.info("Pasted address from clipboard.", { autoClose: 1000 });
      }
    } catch {
      toast.error("Clipboard access denied. Please paste manually.");
    }
  };

  const validateEmail = (e) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(e.trim());
  };

  // Step Navigation Check
  const canGoNextFromStep1 = !!network;
  const canGoNextFromStep2 =
    address.trim().length > 0 &&
    monitorName.trim().length > 0 &&
    Boolean(addressValidation?.valid);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!monitorName.trim() || !network || !address.trim() || !email.trim()) {
      toast.error("All required fields must be completed.");
      return;
    }

    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (!isAlgorand && !isAddress(address.trim())) {
      toast.error("Please enter a valid EVM wallet address.");
      return;
    }

    setIsSubmitting(true);

    const requestBody = {
      user_id: parent_id != 0 ? parseInt(parent_id) : parseInt(userId),
      name: monitorName.trim(),
      network: network,
      address: address.trim(),
      mail: email.trim(),
      slack_webhook: slack.trim(),
    };

    try {
      const response = await fetch("https://139-59-5-56.nip.io:3443/add_wallet_monitor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (response.status === 401) {
        toast.error("Session expired, please login again.");
        localStorage.clear();
        navigate("/login");
        return;
      }

      if (response.ok) {
        toast.success("Wallet Surveillance Monitor Armed Successfully!", {
          autoClose: 1000,
          onClose: () => {
            navigate("/wallet_security");
          },
        });
      } else {
        const data = await response.json().catch(() => ({}));
        toast.error(data.message || "Failed to create wallet monitor.");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full h-screen overflow-hidden bg-[#FAFAFB] flex flex-col select-none">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        theme="colored"
      />
      <NewNavbar email={userEmail} />

      <div className="w-full flex flex-1 h-[calc(100vh-64px)] overflow-hidden">
        <div className="hidden sm:block flex-shrink-0">
          <Sidebar />
        </div>

        <main className="main-content-layout w-full flex flex-col pb-16 px-4 sm:px-8 lg:px-12 pt-3 transition-all scrollbar-thin">
          {/* Sticky Top Bar & Breadcrumb */}
          <div className="sticky top-0 z-20 bg-[#FAFAFB]/95 backdrop-blur-md pt-2 pb-3 border-b border-slate-200/80 -mx-4 sm:-mx-8 lg:-mx-12 px-4 sm:px-8 lg:px-12">
            <div className="w-full max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="flex items-center gap-3">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200/90 rounded-lg px-2.5 py-1.5 shadow-2xs transition-all"
                  title="Return to Dashboard"
                >
                  <LuArrowLeft className="w-3.5 h-3.5" />
                  <span>Exit Wizard</span>
                </Link>

                <div className="h-4 w-px bg-slate-200 hidden sm:block" />

                <div className="flex items-baseline gap-2">
                  <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                    Create Wallet Monitor
                  </h1>
                  <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200/70 px-2.5 py-0.5 rounded-full">
                    Step {currentStep} of 3
                  </span>
                </div>
              </div>

              {/* Step indicator tracker */}
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                <span>{STEPS[currentStep - 1].title}</span>
                <div className="w-24 bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${(currentStep / 3) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Centered Wizard Container */}
          <div className="w-full max-w-4xl mx-auto mt-5 flex flex-col gap-5">
            {/* Top Step Breadcrumbs Navigation Bar */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-3 sm:p-4">
              <div className="grid grid-cols-3 gap-2 sm:gap-4">
                {STEPS.map((s) => {
                  const Icon = s.icon;
                  const isActive = currentStep === s.step;
                  const isCompleted = currentStep > s.step;

                  return (
                    <button
                      key={s.step}
                      type="button"
                      disabled={s.step > currentStep}
                      onClick={() => setCurrentStep(s.step)}
                      className={`flex flex-col sm:flex-row items-center sm:items-center gap-2 p-2 sm:px-3 sm:py-2 rounded-xl transition-all text-left ${
                        isActive
                          ? "bg-indigo-50/80 border border-indigo-200 shadow-2xs"
                          : isCompleted
                          ? "hover:bg-slate-50 cursor-pointer"
                          : "opacity-40 cursor-not-allowed"
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all ${
                          isActive
                            ? "bg-indigo-600 text-white shadow-2xs ring-2 ring-indigo-100"
                            : isCompleted
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {isCompleted ? <LuCheck className="w-4 h-4" /> : <Icon className="w-3.5 h-3.5" />}
                      </div>

                      <div className="hidden sm:flex flex-col min-w-0">
                        <span
                          className={`text-xs font-bold truncate ${
                            isActive ? "text-indigo-700" : isCompleted ? "text-slate-900" : "text-slate-400"
                          }`}
                        >
                          {s.title}
                        </span>
                        <span className="text-[10px] text-slate-400 truncate">
                          {s.desc}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── STEP 1: PICK BLOCKCHAIN NETWORK ── */}
            {currentStep === 1 && (
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 sm:p-8 flex flex-col gap-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                      01
                    </span>
                    <div>
                      <h2 className="text-base font-bold text-slate-900">
                        Select Blockchain Network
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Choose the network where the target wallet or multi-sig operates.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Search & Category Filter Toolbar */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  {/* Category Filter Pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                    {["All", "Featured", "Layer 2", "Alt L1", "Testnets"].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          setSelectedCategory(cat);
                          if (cat !== "Featured" && cat !== "All") {
                            setShowAllChains(true);
                          }
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                          selectedCategory === cat
                            ? "bg-indigo-600 text-white shadow-2xs"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Search Bar */}
                  <div className="relative w-full sm:w-64 flex items-center">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <LuSearch className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type="text"
                      value={chainSearch}
                      onChange={(e) => setChainSearch(e.target.value)}
                      placeholder="Search 36+ blockchains..."
                      style={{ paddingLeft: "36px", paddingRight: "30px" }}
                      className="w-full py-2 rounded-lg border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition placeholder:text-slate-400"
                    />
                    {chainSearch && (
                      <button
                        type="button"
                        onClick={() => setChainSearch("")}
                        className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        <LuX className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Grid of visual network cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  {displayedNetworks.map((n) => {
                    const isSelected = network === n.id;
                    return (
                      <div
                        key={n.id}
                        onClick={() => {
                          setNetwork(n.id);
                          setNetworkName(n.name);
                        }}
                        className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between h-28 relative ${
                          isSelected
                            ? "border-indigo-600 bg-indigo-50/50 shadow-xs ring-2 ring-indigo-100"
                            : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded font-bold border ${n.badgeColor}`}
                          >
                            {n.tag}
                          </span>
                          {isSelected && (
                            <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">
                              <LuCheck className="w-3.5 h-3.5" />
                            </span>
                          )}
                        </div>

                        <div>
                          <h3 className="text-sm font-bold text-slate-900 leading-tight">
                            {n.name}
                          </h3>
                          <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                            {n.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Click More Blockchains Button */}
                {!chainSearch && selectedCategory === "All" && (
                  <div className="flex justify-center -mt-1">
                    <button
                      type="button"
                      onClick={() => setShowAllChains(!showAllChains)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-indigo-200 bg-indigo-50/80 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-all shadow-xs cursor-pointer"
                    >
                      {showAllChains ? (
                        <>
                          <LuChevronUp className="w-4 h-4" />
                          <span>Show Featured Only (8 chains)</span>
                        </>
                      ) : (
                        <>
                          <LuChevronDown className="w-4 h-4" />
                          <span>Click More Blockchains (+28 More Chains Available)</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* Complete Categorized Dropdown Selector */}
                <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2">
                    <LuGlobe className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <span className="text-xs font-semibold text-slate-700">
                      Or select from all 36+ supported blockchains:
                    </span>
                  </div>
                  <select
                    value={network}
                    onChange={(e) => {
                      const selId = e.target.value;
                      const found = ALL_NETWORKS.find((n) => n.id === selId);
                      if (found) {
                        setNetwork(found.id);
                        setNetworkName(found.name);
                      }
                    }}
                    className="w-full sm:w-80 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-800 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  >
                    <optgroup label="Featured Chains">
                      {ALL_NETWORKS.filter((n) => n.category === "Featured").map((opt) => (
                        <option key={opt.id} value={opt.id}>
                          {opt.name} ({opt.tag}) · ID {opt.id}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Layer 2 & Rollups">
                      {ALL_NETWORKS.filter((n) => n.category === "Layer 2").map((opt) => (
                        <option key={opt.id} value={opt.id}>
                          {opt.name} ({opt.tag}) · ID {opt.id}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="EVM & Alt-L1s">
                      {ALL_NETWORKS.filter((n) => n.category === "Alt L1").map((opt) => (
                        <option key={opt.id} value={opt.id}>
                          {opt.name} ({opt.tag}) · ID {opt.id}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Testnets">
                      {ALL_NETWORKS.filter((n) => n.category === "Testnets").map((opt) => (
                        <option key={opt.id} value={opt.id}>
                          {opt.name} ({opt.tag}) · ID {opt.id}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                {/* Step 1 Footer Action */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">
                    Selected Network: <strong className="text-slate-900">{networkName}</strong>
                  </span>
                  <button
                    type="button"
                    disabled={!canGoNextFromStep1}
                    onClick={() => setCurrentStep(2)}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <span>Next: Wallet Address</span>
                    <LuArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 2: WALLET ADDRESS & NAME ── */}
            {currentStep === 2 && (
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 sm:p-8 flex flex-col gap-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                      02
                    </span>
                    <div>
                      <h2 className="text-base font-bold text-slate-900">
                        Target Wallet Specifications
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Enter wallet address to arm on <strong>{networkName}</strong>.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Address Field */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <LuKeyRound className="w-3.5 h-3.5 text-slate-400" />
                      <span>Wallet Address <span className="text-rose-500">*</span></span>
                    </label>
                    <button
                      type="button"
                      onClick={handlePasteAddress}
                      className="text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold inline-flex items-center gap-1 cursor-pointer"
                    >
                      <LuClipboard className="w-3.5 h-3.5" />
                      Paste from clipboard
                    </button>
                  </div>

                  <div
                    className={`relative flex items-center rounded-xl border transition-all ${
                      !address.trim()
                        ? "border-slate-200 bg-slate-50/50 hover:border-slate-300 focus-within:border-indigo-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-100"
                        : addressValidation?.valid
                        ? "border-emerald-300 bg-emerald-50/15 focus-within:border-emerald-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-emerald-100"
                        : "border-rose-300 bg-rose-50/15 focus-within:border-rose-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-rose-100"
                    }`}
                  >
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <LuKeyRound className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => {
                        let val = e.target.value.trim();
                        if (/^[a-fA-F0-9]{40}$/.test(val)) {
                          val = `0x${val}`;
                        }
                        setAddress(val);
                      }}
                      placeholder="0xDA9dfA130Df4dE4673b89022EE50ff26f6EB7342"
                      style={{ paddingLeft: "38px", paddingRight: "70px" }}
                      className="w-full py-2.5 rounded-xl bg-transparent font-mono text-xs sm:text-sm text-slate-900 outline-none placeholder:text-slate-400 placeholder:font-sans"
                    />

                    {address && (
                      <button
                        type="button"
                        onClick={() => setAddress("")}
                        className="absolute right-3 px-2 py-1 text-xs text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded font-semibold cursor-pointer transition"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  {/* Validation Badge */}
                  {addressValidation && (
                    <div className="flex items-center justify-between text-[11px] mt-0.5">
                      <div className="flex items-center gap-1.5">
                        {addressValidation.severity === "success" && (
                          <span className="text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-md flex items-center gap-1 font-semibold">
                            <LuCheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            {addressValidation.message}
                          </span>
                        )}
                        {addressValidation.severity === "warning" && (
                          <span className="text-amber-700 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-md flex items-center gap-1 font-medium">
                            <LuHelpCircle className="w-3.5 h-3.5 text-amber-600" />
                            {addressValidation.message}
                          </span>
                        )}
                        {addressValidation.severity === "error" && (
                          <span className="text-rose-700 bg-rose-50 border border-rose-200/80 px-2 py-0.5 rounded-md flex items-center gap-1 font-medium">
                            <LuShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                            {addressValidation.message}
                          </span>
                        )}
                      </div>
                      <span className="font-mono text-[10px] text-slate-400 font-semibold select-none">
                        {address.length}/42 chars
                      </span>
                    </div>
                  )}
                </div>

                {/* Monitor Name Field */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <LuTag className="w-3.5 h-3.5 text-slate-400" />
                    <span>Watcher Identifier / Name <span className="text-rose-500">*</span></span>
                  </label>

                  <input
                    type="text"
                    required
                    value={monitorName}
                    onChange={(e) => setMonitorName(e.target.value)}
                    placeholder="e.g. Treasury Cold Multisig, Operator Hot Wallet"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:border-slate-300 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition-all text-xs sm:text-sm text-slate-900 font-medium placeholder:text-slate-400 outline-none"
                  />

                  {/* Suggestions */}
                  <div className="flex items-center gap-1.5 mt-1 overflow-x-auto text-[11px]">
                    <span className="text-slate-400 font-medium">Suggestions:</span>
                    {["Treasury Cold Multisig", "Operator Hot Wallet", "Founder Reserve", "Whale Surveillance"].map(
                      (sugg) => (
                        <button
                          key={sugg}
                          type="button"
                          onClick={() => setMonitorName(sugg)}
                          className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium transition cursor-pointer"
                        >
                          {sugg}
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* Step 2 Actions */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition"
                  >
                    ← Back to Network
                  </button>

                  <button
                    type="button"
                    disabled={!canGoNextFromStep2}
                    onClick={() => setCurrentStep(3)}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <span>Next: Alert Routing</span>
                    <LuArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 3: ALERT ROUTING & LAUNCH ── */}
            {currentStep === 3 && (
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 sm:p-8 flex flex-col gap-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                      03
                    </span>
                    <div>
                      <h2 className="text-base font-bold text-slate-900">
                        Alert Notification Routing
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Set destination channels for inflows, outflows, and unauthorized signers.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Email Channel */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <LuMail className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Notification Email <span className="text-rose-500">*</span></span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="security@securedapp.io"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 outline-none text-xs sm:text-sm font-medium text-slate-900"
                  />
                  <span className="text-[11px] text-slate-400">
                    Dispatches high-priority security notifications and daily summaries.
                  </span>
                </div>


                {/* Review Card */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-2.5 text-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Surveillance Configuration Review
                  </span>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                    <div>
                      <span className="text-slate-400 text-[10px] block">Network</span>
                      <strong className="text-slate-900 font-semibold">{networkName}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">Target Identifier</span>
                      <strong className="text-slate-900 font-semibold truncate block">
                        {monitorName || "Wallet Watcher"}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">Surveillance</span>
                      <strong className="text-emerald-700 font-semibold">Active Watcher</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">Dispatch</span>
                      <strong className="text-indigo-700 font-semibold">{email || "Email"}</strong>
                    </div>
                  </div>
                </div>

                {/* Step 3 Actions */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition"
                  >
                    ← Back to Target
                  </button>

                  <button
                    type="button"
                    disabled={isSubmitting || !email.trim() || !validateEmail(email)}
                    onClick={handleSubmit}
                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <TbLoader2 className="w-4 h-4 animate-spin" />
                        <span>Arming Surveillance Watcher...</span>
                      </>
                    ) : (
                      <>
                        <span>🚀 Arm & Deploy Wallet Monitor</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default WalletMonitorCreate;
