import React, { useState, useCallback, useMemo } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { baseUrl } from "../Constants/data";
import NewNavbar from "./NewNavbar";
import Sidebar from "./Sidebar";
import { Buffer } from "buffer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Web3 from "web3";
import {
  LuArrowLeft,
  LuArrowRight,
  LuCheck,
  LuCheckCircle2,
  LuLayers,
  LuTag,
  LuKeyRound,
  LuFileCode2,
  LuZap,
  LuShieldAlert,
  LuBellRing,
  LuCopy,
  LuClipboard,
  LuSparkles,
  LuCode2,
  LuHelpCircle,
  LuExternalLink,
  LuInfo,
  LuCoins,
  LuImage,
  LuLock,
  LuMail,
  LuWebhook,
  LuChevronDown,
  LuChevronUp,
  LuSliders,
  LuSearch,
  LuX,
  LuGlobe,
} from "react-icons/lu";
import { TbLoader2 } from "react-icons/tb";
import { ALL_NETWORKS, FEATURED_NETWORKS } from "../Constants/networks";

// --- PRESET ABI TEMPLATES ---
const ERC20_ABI = [
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "from", type: "address" },
      { indexed: true, name: "to", type: "address" },
      { indexed: false, name: "value", type: "uint256" },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "owner", type: "address" },
      { indexed: true, name: "spender", type: "address" },
      { indexed: false, name: "value", type: "uint256" },
    ],
    name: "Approval",
    type: "event",
  },
  {
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "from", type: "address" },
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    name: "transferFrom",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const ERC721_ABI = [
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "from", type: "address" },
      { indexed: true, name: "to", type: "address" },
      { indexed: true, name: "tokenId", type: "uint256" },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "owner", type: "address" },
      { indexed: true, name: "approved", type: "address" },
      { indexed: true, name: "tokenId", type: "uint256" },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "owner", type: "address" },
      { indexed: true, name: "operator", type: "address" },
      { indexed: false, name: "approved", type: "bool" },
    ],
    name: "ApprovalForAll",
    type: "event",
  },
];

const VAULT_ABI = [
  {
    anonymous: false,
    inputs: [{ indexed: false, name: "account", type: "address" }],
    name: "Paused",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [{ indexed: false, name: "account", type: "address" }],
    name: "Unpaused",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "sender", type: "address" },
      { indexed: false, name: "amount", type: "uint256" },
    ],
    name: "Deposit",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "recipient", type: "address" },
      { indexed: false, name: "amount", type: "uint256" },
    ],
    name: "Withdrawal",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "previousOwner", type: "address" },
      { indexed: true, name: "newOwner", type: "address" },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    inputs: [],
    name: "pause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "unpause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];



// --- TEMPLATES LIST ---
const TEMPLATE_PRESETS = [
  {
    id: "erc20",
    title: "ERC-20 Fungible Token",
    badge: "Most Common",
    badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
    icon: LuCoins,
    desc: "Monitors token transfers, approvals, flashloan drains, and high-value wallet movements.",
    sampleName: "USDT Core Sentinel",
    abi: ERC20_ABI,
    events: [
      { name: "Transfer", desc: "Outflow & balance transfers", severity: "High" },
      { name: "Approval", desc: "Allowance changes & drain approvals", severity: "Medium" },
    ],
  },
  {
    id: "erc721",
    title: "ERC-721 / 1155 NFT",
    badge: "Digital Collectibles",
    badgeClass: "bg-purple-50 text-purple-700 border-purple-200",
    icon: LuImage,
    desc: "Monitors non-fungible transfers, operator approvals, batch mints, and marketplace authorizations.",
    sampleName: "Treasury NFT Vault",
    abi: ERC721_ABI,
    events: [
      { name: "Transfer", desc: "Token ownership shifts & transfers", severity: "High" },
      { name: "ApprovalForAll", desc: "Global operator permissions granted", severity: "Critical" },
    ],
  },
  {
    id: "vault",
    title: "DeFi & Pausable Vault",
    badge: "Security Sensitive",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: LuLock,
    desc: "Monitors emergency pause circuit breakers, admin key rotations, and protocol capital flows.",
    sampleName: "Liquidity Escrow Vault",
    abi: VAULT_ABI,
    events: [
      { name: "Paused", desc: "Emergency circuit breaker triggered", severity: "Critical" },
      { name: "Unpaused", desc: "Normal operations resumed", severity: "Medium" },
      { name: "Deposit", desc: "Large protocol capital inflow", severity: "Low" },
      { name: "Withdrawal", desc: "Outflows & liquidity removals", severity: "High" },
      { name: "OwnershipTransferred", desc: "Admin key rotation detected", severity: "Critical" },
    ],
  },
  {
    id: "custom",
    title: "Custom Contract ABI",
    badge: "Advanced",
    badgeClass: "bg-slate-100 text-slate-700 border-slate-300",
    icon: LuFileCode2,
    desc: "Paste your compiled contract ABI JSON or upload an artifact to configure custom method listeners.",
    sampleName: "Custom Sentinel Monitor",
    abi: [],
    events: [],
  },
];

// --- 5 WIZARD STEPS ---
const STEPS = [
  { step: 1, title: "Network", desc: "Select Chain", icon: LuLayers },
  { step: 2, title: "Target", desc: "Address & Name", icon: LuKeyRound },
  { step: 3, title: "Standard", desc: "Contract Template", icon: LuFileCode2 },
  { step: 4, title: "Events", desc: "Armed Listeners", icon: LuZap },
  { step: 5, title: "Alerts", desc: "Dispatches & Launch", icon: LuBellRing },
];

function Monitor_create() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const email = localStorage.getItem("email");
  const decoded = (() => {
    try {
      return token ? jwtDecode(token) : {};
    } catch {
      return {};
    }
  })();
  const user_Id = decoded.userId || localStorage.getItem("userId") || "";
  const userEmail = localStorage.getItem("email") || "";
  const parent_id = localStorage.getItem("parent_id");

  // Step state
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step 1: Network
  const [network, setNetwork] = useState("1");
  const [networkName, setNetworkName] = useState("Ethereum Mainnet");
  const [chainSearch, setChainSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showAllChains, setShowAllChains] = useState(false);

  // Filtered networks based on search, category pill, or "Click More" toggle
  const displayedNetworks = useMemo(() => {
    let list = ALL_NETWORKS;
    if (selectedCategory === "Featured") {
      list = list.filter((n) => n.isFeatured);
    } else if (selectedCategory !== "All") {
      list = list.filter((n) => n.category === selectedCategory);
    } else if (!showAllChains && !chainSearch.trim()) {
      list = FEATURED_NETWORKS;
    }

    if (chainSearch.trim()) {
      const q = chainSearch.toLowerCase().trim();
      list = list.filter(
        (n) =>
          n.name.toLowerCase().includes(q) ||
          n.tag.toLowerCase().includes(q) ||
          (n.desc && n.desc.toLowerCase().includes(q)) ||
          String(n.chainId).includes(q)
      );
    }
    return list;
  }, [selectedCategory, showAllChains, chainSearch]);

  // Step 2: Target & Identity
  const [address, setAddress] = useState("");
  const [monitorName, setMonitorName] = useState("");
  const [category, setCategory] = useState(2); // 2: App ID, 1: Asset ID (Algorand)
  const [code, setCode] = useState(""); // Algorand TEAL

  // Step 3: Template & ABI
  const [selectedTemplateId, setSelectedTemplateId] = useState("erc20");
  const [rawAbiText, setRawAbiText] = useState(JSON.stringify(ERC20_ABI, null, 2));
  const [showRawAbiEditor, setShowRawAbiEditor] = useState(false);

  // Step 4: Discovered Events
  const [selectedEvents, setSelectedEvents] = useState({
    Transfer: true,
    Approval: true,
  });

  // Step 5: Alerts
  const [emailInput, setEmailInput] = useState(userEmail);
  const [slackWebhook, setSlackWebhook] = useState("");
  const [discordWebhook, setDiscordWebhook] = useState("");

  const isAlgorand = network === "1300" || network === "1301";

  // Checksum / Address Validation (UI/UX Pro-Max)
  const addressValidation = useMemo(() => {
    const raw = address.trim();
    if (!raw) return null;

    if (isAlgorand) {
      const isNum = /^\d+$/.test(raw);
      return {
        valid: isNum,
        severity: isNum ? "success" : "error",
        charsCount: raw.length,
        message: isNum
          ? `Valid Algorand ${category === 2 ? "App ID" : "Asset ID"}`
          : "Algorand ID must contain numeric digits only",
      };
    }

    // EVM Address Validation
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
      message: "Valid EVM 20-byte contract address",
    };
  }, [address, isAlgorand, category]);

  // Derived available events from current template/ABI
  const discoveredEvents = useMemo(() => {
    if (selectedTemplateId !== "custom") {
      const tmpl = TEMPLATE_PRESETS.find((t) => t.id === selectedTemplateId);
      return tmpl?.events || [];
    }
    try {
      const parsed = JSON.parse(rawAbiText);
      if (Array.isArray(parsed)) {
        return parsed
          .filter((item) => item.type === "event")
          .map((ev) => ({
            name: ev.name,
            desc: `Custom event: ${ev.name}`,
            severity: "High",
          }));
      }
    } catch {
      // invalid JSON
    }
    return [];
  }, [selectedTemplateId, rawAbiText]);

  // Handle template selection
  const handleSelectTemplate = (template) => {
    setSelectedTemplateId(template.id);
    if (template.id !== "custom") {
      setRawAbiText(JSON.stringify(template.abi, null, 2));
      const evMap = {};
      template.events.forEach((ev) => {
        evMap[ev.name] = true;
      });
      setSelectedEvents(evMap);
      if (!monitorName) {
        setMonitorName(template.sampleName);
      }
    }
  };

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

  // Step Navigation Validation
  const canGoNextFromStep1 = !!network;
  const canGoNextFromStep2 =
    address.trim().length > 0 &&
    monitorName.trim().length > 0 &&
    Boolean(addressValidation?.valid);
  const canGoNextFromStep3 =
    selectedTemplateId !== "custom" || (rawAbiText.trim().length > 0 && (() => {
      try {
        return Array.isArray(JSON.parse(rawAbiText));
      } catch {
        return false;
      }
    })());
  const canGoNextFromStep4 = Object.values(selectedEvents).some(Boolean);

  // Final Submission
  const handleFinalDeploy = async () => {
    setIsSubmitting(true);
    try {
      const isEvm = !isAlgorand;
      const finalAbi = isAlgorand
        ? (category === 1 ? "Asset_ABI" : code)
        : rawAbiText;

      const payload = {
        name: monitorName.trim(),
        user_id: parent_id != 0 ? parseInt(parent_id) : parseInt(user_Id),
        network: parseInt(network),
        address: address.trim(),
        alert_type: 1,
        alert_data: emailInput.trim(),
        slack_webhook: slackWebhook.trim() || discordWebhook.trim(),
        abi: finalAbi,
        category: parseInt(category),
      };

      let monitorId = null;

      try {
        const response = await axios.post(
          "https://139-59-5-56.nip.io:3443/add_monitor",
          payload,
          {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 8000,
          }
        );
        if (response?.data?.id) {
          monitorId = response.data.id;
        }
      } catch (err) {
        console.error("Backend add_monitor call error:", err);
        throw err;
      }

      // Automatically register selected events in background if EVM
      if (isEvm && monitorId) {
        try {
          const web3 = new Web3();
          const parsed = JSON.parse(finalAbi);
          const evNames = Object.keys(selectedEvents).filter((k) => selectedEvents[k]);

          for (const evName of evNames) {
            const evDef = parsed.find((item) => item.type === "event" && item.name === evName);
            if (evDef) {
              const sigInputs = (evDef.inputs || []).map((i) => i.type).join(",");
              const sigData = `${evName}(${sigInputs})`;
              let sigHex = "";
              try {
                sigHex = web3.eth.abi.encodeEventSignature(sigData);
              } catch {
                sigHex = `0x${Buffer.from(sigData).toString("hex").slice(0, 64)}`;
              }

              await axios.post(
                `${baseUrl}/add_event`,
                {
                  name: evName,
                  mid: monitorId,
                  signature: sigHex,
                  arguments: {},
                },
                {
                  headers: { Authorization: `Bearer ${token}` },
                  timeout: 4000,
                }
              ).catch((e) => console.warn("Optional event sync note:", e));
            }
          }
        } catch (e) {
          console.warn("Event auto-registration notice:", e);
        }
      }

      toast.success("Monitor armed and deployed successfully!", {
        autoClose: 800,
        onClose: () => {
          navigate("/monitor");
        },
      });
    } catch (err) {
      console.error("Monitor creation error:", err);
      toast.error("Failed to deploy monitor. Please verify inputs.");
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
                    Create Contract Monitor
                  </h1>
                  <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 border border-blue-200/70 px-2.5 py-0.5 rounded-full">
                    Step {currentStep} of 5
                  </span>
                </div>
              </div>

              {/* Step indicator tracker */}
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                <span>{STEPS[currentStep - 1].title}</span>
                <div className="w-24 bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${(currentStep / 5) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Centered Wizard Container */}
          <div className="w-full max-w-4xl mx-auto mt-5 flex flex-col gap-5">
            {/* Top Step Breadcrumbs Navigation Bar */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-3 sm:p-4">
              <div className="grid grid-cols-5 gap-2 sm:gap-4">
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
                          ? "bg-blue-50/80 border border-blue-200 shadow-2xs"
                          : isCompleted
                          ? "hover:bg-slate-50 cursor-pointer"
                          : "opacity-40 cursor-not-allowed"
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all ${
                          isActive
                            ? "bg-blue-600 text-white shadow-2xs ring-2 ring-blue-100"
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
                            isActive ? "text-blue-700" : isCompleted ? "text-slate-900" : "text-slate-400"
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
                    <span className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold">
                      01
                    </span>
                    <div>
                      <h2 className="text-base font-bold text-slate-900">
                        Select Target Blockchain
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Pick the network where your contract or application is deployed.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Filter and Search Bar */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
                  {/* Category Filter Pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                    {["All", "Featured", "Layer 2", "Alt L1", "Testnets"].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                          selectedCategory === cat
                            ? "bg-blue-600 text-white shadow-xs"
                            : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Chain Search Input */}
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
                      className="w-full py-2 rounded-lg border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition placeholder:text-slate-400"
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
                            ? "border-blue-600 bg-blue-50/50 shadow-xs ring-2 ring-blue-100"
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
                            <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">
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
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-blue-200 bg-blue-50/80 hover:bg-blue-100 text-blue-700 text-xs font-bold transition-all shadow-xs cursor-pointer"
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
                    className="w-full sm:w-80 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-800 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
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
                    Selected: <strong className="text-slate-900">{networkName}</strong>
                  </span>
                  <button
                    type="button"
                    disabled={!canGoNextFromStep1}
                    onClick={() => setCurrentStep(2)}
                    className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <span>Next: Target Address</span>
                    <LuArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 2: CONTRACT TARGET & IDENTITY ── */}
            {currentStep === 2 && (
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 sm:p-8 flex flex-col gap-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold">
                      02
                    </span>
                    <div>
                      <h2 className="text-base font-bold text-slate-900">
                        Contract Address & Identification
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Specify target contract address on <strong>{networkName}</strong>.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Address Field */}
                {isAlgorand ? (
                  <div className="flex flex-col gap-3 p-4 bg-slate-50/70 rounded-xl border border-slate-200">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-800">
                        Algorand Identifier
                      </label>
                      <div className="flex rounded-lg border border-slate-200 bg-white p-0.5">
                        <button
                          type="button"
                          onClick={() => setCategory(2)}
                          className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
                            category === 2 ? "bg-blue-600 text-white" : "text-slate-600"
                          }`}
                        >
                          App ID
                        </button>
                        <button
                          type="button"
                          onClick={() => setCategory(1)}
                          className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
                            category === 1 ? "bg-blue-600 text-white" : "text-slate-600"
                          }`}
                        >
                          Asset ID
                        </button>
                      </div>
                    </div>

                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value.replace(/\D/g, ""))}
                      placeholder={category === 2 ? "Enter Application ID (e.g. 100259812)" : "Enter Asset ID (e.g. 31566704)"}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-mono text-xs sm:text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />

                    {category === 2 && (
                      <div className="flex flex-col gap-1.5 mt-2">
                        <label className="text-xs font-semibold text-slate-700">
                          TEAL Approval Program Bytecode
                        </label>
                        <textarea
                          rows={4}
                          value={code}
                          onChange={(e) => setCode(e.target.value)}
                          placeholder="#pragma version 8..."
                          className="w-full p-3 font-mono text-xs bg-slate-900 text-emerald-400 rounded-xl outline-none"
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <LuKeyRound className="w-3.5 h-3.5 text-slate-400" />
                        <span>Contract Address (0x...) <span className="text-rose-500">*</span></span>
                      </label>
                      <button
                        type="button"
                        onClick={handlePasteAddress}
                        className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold inline-flex items-center gap-1 cursor-pointer"
                      >
                        <LuClipboard className="w-3.5 h-3.5" />
                        Paste from clipboard
                      </button>
                    </div>

                    <div
                      className={`relative flex items-center rounded-xl border transition-all ${
                        !address.trim()
                          ? "border-slate-200 bg-slate-50/50 hover:border-slate-300 focus-within:border-blue-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-100"
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
                        placeholder="0xdAC17F958D2ee523a2206206994597C13D831ec7"
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

                    {/* Address Validation Badge */}
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
                )}

                {/* Monitor Name Field */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <LuTag className="w-3.5 h-3.5 text-slate-400" />
                    <span>Monitor Name <span className="text-rose-500">*</span></span>
                  </label>

                  <input
                    type="text"
                    required
                    value={monitorName}
                    onChange={(e) => setMonitorName(e.target.value)}
                    placeholder="e.g. USDT Treasury Sentinel, Uniswap V3 Router"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all text-xs sm:text-sm text-slate-900 font-medium placeholder:text-slate-400 outline-none"
                  />

                  {/* Suggestion Chips */}
                  <div className="flex items-center gap-1.5 mt-1 overflow-x-auto text-[11px]">
                    <span className="text-slate-400 font-medium">Suggestions:</span>
                    {["USDT Core Vault", "Uniswap V3 Pool", "Bridge Escrow", "Staking Sentinel"].map(
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
                    className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <span>Next: Choose Standard</span>
                    <LuArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 3: CHOOSE STANDARD & TEMPLATE (NO RAW CODE NEEDED) ── */}
            {currentStep === 3 && (
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 sm:p-8 flex flex-col gap-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold">
                      03
                    </span>
                    <div>
                      <h2 className="text-base font-bold text-slate-900">
                        Choose Contract Interface Standard
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Select a template to auto-populate ABI and trigger rules. No code writing required.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Template Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {TEMPLATE_PRESETS.map((tmpl) => {
                    const isSelected = selectedTemplateId === tmpl.id;
                    const Icon = tmpl.icon;

                    return (
                      <div
                        key={tmpl.id}
                        onClick={() => handleSelectTemplate(tmpl)}
                        className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? "border-blue-600 bg-blue-50/40 shadow-xs ring-2 ring-blue-100"
                            : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <div
                              className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                                isSelected ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"
                              }`}
                            >
                              <Icon className="w-5 h-5" />
                            </div>
                            <span className={`text-[10.5px] px-2 py-0.5 rounded-full font-bold border ${tmpl.badgeClass}`}>
                              {tmpl.badge}
                            </span>
                          </div>

                          <h3 className="text-sm font-bold text-slate-900 mt-3">
                            {tmpl.title}
                          </h3>
                          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                            {tmpl.desc}
                          </p>
                        </div>

                        {tmpl.events.length > 0 && (
                          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 flex-wrap">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Pre-armed:</span>
                            {tmpl.events.map((ev) => (
                              <span
                                key={ev.name}
                                className="text-[10.5px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono font-semibold"
                              >
                                {ev.name}()
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Optional Expandable Raw ABI Box */}
                <div className="pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowRawAbiEditor(!showRawAbiEditor)}
                    className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
                  >
                    <span>{showRawAbiEditor ? "Hide Raw ABI Code Editor" : "Inspect or customize raw ABI JSON"}</span>
                    {showRawAbiEditor ? <LuChevronUp className="w-3.5 h-3.5" /> : <LuChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  {showRawAbiEditor && (
                    <div className="mt-3 rounded-xl overflow-hidden border border-slate-700 bg-slate-900 shadow-inner">
                      <div className="px-3.5 py-2 bg-slate-800/90 border-b border-slate-700 text-[11px] text-slate-400 font-mono flex items-center justify-between">
                        <span>contract_abi.json</span>
                        <button
                          type="button"
                          onClick={() => {
                            try {
                              setRawAbiText(JSON.stringify(JSON.parse(rawAbiText), null, 2));
                              toast.info("ABI JSON Formatted.");
                            } catch {
                              toast.error("Invalid JSON syntax.");
                            }
                          }}
                          className="hover:text-white"
                        >
                          Prettify JSON
                        </button>
                      </div>
                      <textarea
                        rows={7}
                        value={rawAbiText}
                        onChange={(e) => setRawAbiText(e.target.value)}
                        className="w-full p-3 font-mono text-xs text-emerald-400 bg-transparent outline-none resize-y"
                      />
                    </div>
                  )}
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
                    disabled={!canGoNextFromStep3}
                    onClick={() => setCurrentStep(4)}
                    className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <span>Next: Select Events</span>
                    <LuArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 4: DISCOVERED EVENTS & TRIGGERS ── */}
            {currentStep === 4 && (
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 sm:p-8 flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold">
                      04
                    </span>
                    <div>
                      <h2 className="text-base font-bold text-slate-900">
                        Discovered Event Listeners
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Select which smart contract events to arm for real-time trigger surveillance.
                      </p>
                    </div>
                  </div>

                  {/* Select All shortcut */}
                  <button
                    type="button"
                    onClick={() => {
                      const updated = {};
                      discoveredEvents.forEach((ev) => {
                        updated[ev.name] = true;
                      });
                      setSelectedEvents(updated);
                    }}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800 self-start sm:self-auto cursor-pointer"
                  >
                    Select All Events ({discoveredEvents.length})
                  </button>
                </div>

                {/* Events List */}
                <div className="flex flex-col gap-2.5">
                  {discoveredEvents.length > 0 ? (
                    discoveredEvents.map((ev) => {
                      const isChecked = !!selectedEvents[ev.name];
                      const severityColors = {
                        Critical: "bg-rose-50 text-rose-700 border-rose-200",
                        High: "bg-amber-50 text-amber-700 border-amber-200",
                        Medium: "bg-blue-50 text-blue-700 border-blue-200",
                        Low: "bg-slate-100 text-slate-700 border-slate-200",
                      };

                      return (
                        <div
                          key={ev.name}
                          onClick={() =>
                            setSelectedEvents((prev) => ({
                              ...prev,
                              [ev.name]: !prev[ev.name],
                            }))
                          }
                          className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                            isChecked
                              ? "border-blue-500 bg-blue-50/30"
                              : "border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {}}
                              className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 pointer-events-none"
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-xs sm:text-sm font-bold text-slate-900">
                                  {ev.name}()
                                </span>
                                <span
                                  className={`text-[10px] px-2 py-0.5 rounded font-semibold border ${
                                    severityColors[ev.severity] || severityColors.Medium
                                  }`}
                                >
                                  {ev.severity} Severity
                                </span>
                              </div>
                              <p className="text-[11.5px] text-slate-500 mt-0.5">
                                {ev.desc}
                              </p>
                            </div>
                          </div>

                          <span className="text-xs font-semibold text-slate-400">
                            {isChecked ? (
                              <span className="text-blue-600 font-bold">Armed</span>
                            ) : (
                              "Ignored"
                            )}
                          </span>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-8 text-center text-slate-400 border border-dashed border-slate-200 rounded-xl text-xs">
                      No custom events discovered in current ABI. You can proceed with standard transaction monitoring.
                    </div>
                  )}
                </div>

                {/* Step 4 Actions */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition"
                  >
                    ← Back to Standard
                  </button>

                  <button
                    type="button"
                    disabled={!canGoNextFromStep4 && discoveredEvents.length > 0}
                    onClick={() => setCurrentStep(5)}
                    className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <span>Next: Configure Alerts</span>
                    <LuArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 5: ALERTS & FINAL DEPLOYMENT ── */}
            {currentStep === 5 && (
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 sm:p-8 flex flex-col gap-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold">
                      05
                    </span>
                    <div>
                      <h2 className="text-base font-bold text-slate-900">
                        Alert Notification Routing
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Choose where anomaly notifications should be dispatched in real time.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Email Channel */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <LuMail className="w-3.5 h-3.5 text-blue-600" />
                    <span>Email Alerts <span className="text-rose-500">*</span></span>
                  </label>
                  <input
                    type="text"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="security@securedapp.io, alerts@yourprotocol.org"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 outline-none text-xs sm:text-sm font-medium text-slate-900"
                  />
                  <span className="text-[11px] text-slate-400">
                    Separate multiple emails with commas.
                  </span>
                </div>


                {/* Final Deployment Summary Card */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-2.5 text-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Deployment Review
                  </span>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                    <div>
                      <span className="text-slate-400 text-[10px] block">Network</span>
                      <strong className="text-slate-900 font-semibold">{networkName}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">Target Standard</span>
                      <strong className="text-slate-900 font-semibold">
                        {TEMPLATE_PRESETS.find((t) => t.id === selectedTemplateId)?.title.split(" ")[0] || "Custom"}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">Armed Events</span>
                      <strong className="text-emerald-700 font-semibold">
                        {Object.values(selectedEvents).filter(Boolean).length} Active Listeners
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">Latency Target</span>
                      <strong className="text-blue-700 font-semibold">&lt;25ms Triggers</strong>
                    </div>
                  </div>
                </div>

                {/* Step 5 Deploy Actions */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(4)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition"
                  >
                    ← Back to Events
                  </button>

                  <button
                    type="button"
                    disabled={isSubmitting || !emailInput.trim()}
                    onClick={handleFinalDeploy}
                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <TbLoader2 className="w-4 h-4 animate-spin" />
                        <span>Arming & Deploying Monitor...</span>
                      </>
                    ) : (
                      <>
                        <span>🚀 Arm & Deploy Monitor</span>
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

export default Monitor_create;
