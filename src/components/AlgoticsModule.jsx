import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NewNavbar from "./NewNavbar";
import Sidebar from "./Sidebar";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

function AlgoticsModule() {
  const userEmail = localStorage.getItem("email");
  const [loading, setLoading] = useState(true);
  const [monitors, setMonitors] = useState([]);
  const [selectedMonitor, setSelectedMonitor] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showManDeshiData, setShowManDeshiData] = useState(null); // 'accounts', 'assets', or 'wallets'
  const [showSewaData, setShowSewaData] = useState(null); // 'accounts', 'assets', or 'wallets'

  const mockAccounts = [
    { id: 'ACC001', name: 'Demo Account 1', createdDate: '2023-01-15' },
    { id: 'ACC002', name: 'Demo Account 2', createdDate: '2023-02-20' },
    { id: 'ACC003', name: 'Demo Account 3', createdDate: '2023-03-10' },
  ];

  const mockAssets = [
    { id: 'AST001', name: 'Demo Asset A', count: 100 },
    { id: 'AST002', name: 'Demo Asset B', count: 50 },
    { id: 'AST003', name: 'Demo Asset C', count: 75 },
  ];

  const mockWallets = [
    { id: 'WLT001', address: '0xabc...123', createdDate: '2024-07-01' },
    { id: 'WLT002', address: '0xdef...456', createdDate: '2024-06-25' },
    { id: 'WLT003', address: '0xghi...789', createdDate: '2024-05-10' },
  ];

  const walletStats = {
    weekly: 10,
    monthly: 40,
    yearly: 300,
  };

  const sewaAccounts = [
    { id: 'SEWA001', name: 'Sewa Account 1', createdDate: '2023-01-01' },
    { id: 'SEWA002', name: 'Sewa Account 2', createdDate: '2023-02-05' },
    { id: 'SEWA003', name: 'Sewa Account 3', createdDate: '2023-03-15' },
  ];

  const sewaAssets = [
    { id: 'SEWA_AST001', name: 'Sewa Asset X', count: 200 },
    { id: 'SEWA_AST002', name: 'Sewa Asset Y', count: 120 },
    { id: 'SEWA_AST003', name: 'Sewa Asset Z', count: 90 },
  ];

  const sewaWalletStats = {
    weekly: 5,
    monthly: 20,
    yearly: 150,
  };
  const [activeTab, setActiveTab] = useState("sewa"); // 'sewa' or 'manDeshi'
  const navigate = useNavigate();

  const [tempStartDate, setTempStartDate] = useState(new Date());
  const [tempEndDate, setTempEndDate] = useState(new Date());

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const parent_id = localStorage.getItem("parent_id");
  const baseUrl = "https://139-59-5-56.nip.io:3443";

  const ALLOWED_CHAINS = {
    1: "Ethereum Mainnet",
    137: "Polygon Mainnet",
    11155111: "Sepolia Testnet",
    80002: "Amoy Testnet",
    100: "Gnosis Mainnet",
    56: "Binance Smart Chain Mainnet",
    8453: "Base Mainnet",
    42161: "Arbitrum Mainnet",
    50: "Xdc Mainnet",
  };

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
        setMonitors(data.monitors || []);
      } catch (error) {
        console.error("Error fetching monitors:", error);
      }
      setLoading(false);
    };
    fetchMonitors();
  }, []);

  const handleViewAnalytics = (mid) => {
    // Find the selected monitor
    const monitor = monitors.find((m) => m.mid === mid);
    setSelectedMonitor(monitor);

    // Set default dates (today)
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

      // Get user ID from parent_id or userId
      const currentUserId =
        parent_id !== "0" ? parseInt(parent_id) : parseInt(userId);

      // Navigate to analytics page with monitor and date information in the format specified
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
    <div className="w-full min-h-full bg-white">
      <NewNavbar email={userEmail} />
      <div className="bg-white w-full flex flex-col md:flex-row min-h-full">
        <Sidebar />

        {/* Hidden on mobile, visible on sm and up */}
        <div className="hidden sm:flex flex-col gap-5 fixed left-0 ml-[100px] w-56 mt-20">
          <div 
            className={`mt-5 py-3 pl-4 pr-9 rounded-r-full cursor-pointer ${activeTab === 'sewa' ? 'bg-[#6A6A6A1A]' : ''}`}
            onClick={() => setActiveTab('sewa')}
          >
            <p className="text-[#6A6A6A] font-semibold text-nowrap px-2">
              Sewa
            </p>
          </div>
          <div 
            className={`py-3 pl-4 pr-9 rounded-r-full cursor-pointer ${activeTab === 'manDeshi' ? 'bg-[#6A6A6A1A]' : ''}`}
            onClick={() => setActiveTab('manDeshi')}
          >
            <p className="text-[#6A6A6A] font-semibold text-nowrap px-2">
              Man Deshi Foundation
            </p>
          </div>
        </div>

        {/* Main content area - adjusted margins for responsive layout */}
        <div className="mt-12 w-full px-2 md:px-4 py-6 relative md:ml-80">
          <div className="bg-white w-full min-h-full">
            <div className="w-full min-h-full relative">
              <div className="container mx-auto p-2 md:p-4 text-black mt-5">
                <h2 className="text-xl md:text-2xl font-bold mb-4">
                  {activeTab === 'sewa' ? 'Sewa Dashboard' : 'Man Deshi Foundation Dashboard'}
                </h2>

                {activeTab === 'sewa' && (
                  {activeTab === 'sewa' && (
                  <div className="flex flex-col gap-4 mt-4">
                    <div className="bg-gray-100 p-4 rounded-md shadow-md">
                      <h3 className="text-lg font-semibold mb-2">Total Accounts Created: 120</h3>
                      <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                        onClick={() => setShowSewaData('accounts')}
                      >
                        View Accounts
                      </button>
                    </div>

                    <div className="bg-gray-100 p-4 rounded-md shadow-md">
                      <h3 className="text-lg font-semibold mb-2">Total Assets Created: 200</h3>
                      <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                        onClick={() => setShowSewaData('assets')}
                      >
                        View Assets
                      </button>
                    </div>

                    <div className="bg-gray-100 p-4 rounded-md shadow-md">
                      <h3 className="text-lg font-semibold mb-2">Total Wallets Created</h3>
                      <p className="text-md mb-1">Weekly: {sewaWalletStats.weekly}</p>
                      <p className="text-md mb-1">Monthly: {sewaWalletStats.monthly}</p>
                      <p className="text-md mb-2">Yearly: {sewaWalletStats.yearly}</p>
                      <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                        onClick={() => setShowSewaData('wallets')}
                      >
                        View Wallets
                      </button>
                    </div>

                    {showSewaData === 'accounts' && (
                      <div className="overflow-x-auto rounded-md border-2 mt-4">
                        <h3 className="text-lg font-semibold mb-2 p-2">Demo Sewa Accounts</h3>
                        <table className="min-w-full border-gray-300 bg-white">
                          <thead>
                            <tr>
                              <th className="px-2 md:px-4 py-2 text-left">Account ID</th>
                              <th className="px-2 md:px-4 py-2 text-left">Name</th>
                              <th className="px-2 md:px-4 py-2 text-left">Created Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {sewaAccounts.map((account) => (
                              <tr key={account.id} className="hover:bg-white border-t-2 border-b">
                                <td className="px-2 md:px-4 py-2">{account.id}</td>
                                <td className="px-2 md:px-4 py-2">{account.name}</td>
                                <td className="px-2 md:px-4 py-2">{account.createdDate}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {showSewaData === 'assets' && (
                      <div className="overflow-x-auto rounded-md border-2 mt-4">
                        <h3 className="text-lg font-semibold mb-2 p-2">Demo Sewa Assets</h3>
                        <table className="min-w-full border-gray-300 bg-white">
                          <thead>
                            <tr>
                              <th className="px-2 md:px-4 py-2 text-left">Asset ID</th>
                              <th className="px-2 md:px-4 py-2 text-left">Asset Name</th>
                              <th className="px-2 md:px-4 py-2 text-left">Count</th>
                            </tr>
                          </thead>
                          <tbody>
                            {sewaAssets.map((asset) => (
                              <tr key={asset.id} className="hover:bg-white border-t-2 border-b">
                                <td className="px-2 md:px-4 py-2">{asset.id}</td>
                                <td className="px-2 md:px-4 py-2">{asset.name}</td>
                                <td className="px-2 md:px-4 py-2">{asset.count}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {showSewaData === 'wallets' && (
                      <div className="overflow-x-auto rounded-md border-2 mt-4">
                        <h3 className="text-lg font-semibold mb-2 p-2">Demo Sewa Wallets</h3>
                        <table className="min-w-full border-gray-300 bg-white">
                          <thead>
                            <tr>
                              <th className="px-2 md:px-4 py-2 text-left">Wallet ID</th>
                              <th className="px-2 md:px-4 py-2 text-left">Address</th>
                              <th className="px-2 md:px-4 py-2 text-left">Created Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {mockWallets.map((wallet) => (
                              <tr key={wallet.id} className="hover:bg-white border-t-2 border-b">
                                <td className="px-2 md:px-4 py-2">{wallet.id}</td>
                                <td className="px-2 md:px-4 py-2">{wallet.address}</td>
                                <td className="px-2 md:px-4 py-2">{wallet.createdDate}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'manDeshi' && (
                  <div className="flex flex-col gap-4 mt-4">
                    <div className="bg-gray-100 p-4 rounded-md shadow-md">
                      <h3 className="text-lg font-semibold mb-2">Total Accounts Created: 150</h3>
                      <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                        onClick={() => setShowManDeshiData('accounts')}
                      >
                        View Accounts
                      </button>
                    </div>

                    <div className="bg-gray-100 p-4 rounded-md shadow-md">
                      <h3 className="text-lg font-semibold mb-2">Total Assets Created: 250</h3>
                      <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                        onClick={() => setShowManDeshiData('assets')}
                      >
                        View Assets
                      </button>
                    </div>

                    <div className="bg-gray-100 p-4 rounded-md shadow-md">
                      <h3 className="text-lg font-semibold mb-2">Total Wallets Created</h3>
                      <p className="text-md mb-1">Weekly: {walletStats.weekly}</p>
                      <p className="text-md mb-1">Monthly: {walletStats.monthly}</p>
                      <p className="text-md mb-2">Yearly: {walletStats.yearly}</p>
                      <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                        onClick={() => setShowManDeshiData('wallets')}
                      >
                        View Wallets
                      </button>
                    </div>

                    {showManDeshiData === 'accounts' && (
                      <div className="overflow-x-auto rounded-md border-2 mt-4">
                        <h3 className="text-lg font-semibold mb-2 p-2">Demo Accounts</h3>
                        <table className="min-w-full border-gray-300 bg-white">
                          <thead>
                            <tr>
                              <th className="px-2 md:px-4 py-2 text-left">Account ID</th>
                              <th className="px-2 md:px-4 py-2 text-left">Name</th>
                              <th className="px-2 md:px-4 py-2 text-left">Created Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {mockAccounts.map((account) => (
                              <tr key={account.id} className="hover:bg-white border-t-2 border-b">
                                <td className="px-2 md:px-4 py-2">{account.id}</td>
                                <td className="px-2 md:px-4 py-2">{account.name}</td>
                                <td className="px-2 md:px-4 py-2">{account.createdDate}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {showManDeshiData === 'assets' && (
                      <div className="overflow-x-auto rounded-md border-2 mt-4">
                        <h3 className="text-lg font-semibold mb-2 p-2">Demo Assets</h3>
                        <table className="min-w-full border-gray-300 bg-white">
                          <thead>
                            <tr>
                              <th className="px-2 md:px-4 py-2 text-left">Asset ID</th>
                              <th className="px-2 md:px-4 py-2 text-left">Asset Name</th>
                              <th className="px-2 md:px-4 py-2 text-left">Count</th>
                            </tr>
                          </thead>
                          <tbody>
                            {mockAssets.map((asset) => (
                              <tr key={asset.id} className="hover:bg-white border-t-2 border-b">
                                <td className="px-2 md:px-4 py-2">{asset.id}</td>
                                <td className="px-2 md:px-4 py-2">{asset.name}</td>
                                <td className="px-2 md:px-4 py-2">{asset.count}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {showManDeshiData === 'wallets' && (
                      <div className="overflow-x-auto rounded-md border-2 mt-4">
                        <h3 className="text-lg font-semibold mb-2 p-2">Demo Wallets</h3>
                        <table className="min-w-full border-gray-300 bg-white">
                          <thead>
                            <tr>
                              <th className="px-2 md:px-4 py-2 text-left">Wallet ID</th>
                              <th className="px-2 md:px-4 py-2 text-left">Address</th>
                              <th className="px-2 md:px-4 py-2 text-left">Created Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {mockWallets.map((wallet) => (
                              <tr key={wallet.id} className="hover:bg-white border-t-2 border-b">
                                <td className="px-2 md:px-4 py-2">{wallet.id}</td>
                                <td className="px-2 md:px-4 py-2">{wallet.address}</td>
                                <td className="px-2 md:px-4 py-2">{wallet.createdDate}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Calendar Popup - Made responsive */}
              {showCalendar && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2">
                  <div className="bg-white p-3 md:p-6 rounded-lg shadow-2xl border w-full max-w-[700px] max-h-[90vh] overflow-y-auto">
                    <h3 className="text-base md:text-lg font-semibold text-gray-700 mb-4 text-center">
                      Select Date Range
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Start Date Calendar Section */}
                      <div className="calendar-section md:pr-5 flex flex-col">
                        <p className="text-sm font-semibold text-blue-700 mb-2 text-center">
                          Start Date
                        </p>
                        <div className="flex-grow">
                          <Calendar
                            value={tempStartDate}
                            onChange={handleStartDateChange}
                            className="custom-calendar shadow-md rounded-md p-2 mx-auto w-full"
                            nextLabel={
                              <span className="text-black text-2xl px-2 border rounded-md shadow-md mb-1">
                                →
                              </span>
                            }
                            prevLabel={
                              <span className="text-black text-2xl px-2 border rounded-md shadow-md mb-1">
                                ←
                              </span>
                            }
                            next2Label={null}
                            prev2Label={null}
                            tileClassName={({ date }) =>
                              date.getTime() === tempStartDate.getTime() ||
                              date.getTime() === tempEndDate.getTime()
                                ? "selected-date"
                                : date > tempStartDate && date < tempEndDate
                                ? "highlight-range"
                                : null
                            }
                            tileContent={null}
                          />
                        </div>

                        {/* Start Time - Fixed position at bottom of container */}
                        <div className="time-section text-center mt-auto pt-3">
                          <p className="text-sm font-semibold text-gray-700 mb-2">
                            Start Time
                          </p>
                          <div className="flex gap-2 justify-center">
                            <select
                              className="p-2 border rounded-md bg-white shadow-lg"
                              value={tempStartDate.getHours()}
                              onChange={(e) => {
                                const newDate = new Date(tempStartDate);
                                newDate.setHours(parseInt(e.target.value));
                                setTempStartDate(newDate);
                              }}
                            >
                              {[...Array(24).keys()].map((hour) => (
                                <option key={hour} value={hour}>
                                  {hour.toString().padStart(2, "0")}
                                </option>
                              ))}
                            </select>
                            <span className="flex items-center">:</span>
                            <select
                              className="p-2 border rounded-md bg-white shadow-lg"
                              value={tempStartDate.getMinutes()}
                              onChange={(e) => {
                                const newDate = new Date(tempStartDate);
                                newDate.setMinutes(parseInt(e.target.value));
                                setTempStartDate(newDate);
                              }}
                            >
                              {[...Array(12).keys()].map((i) => {
                                const minute = i * 5;
                                return (
                                  <option key={minute} value={minute}>
                                    {minute.toString().padStart(2, "0")}
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* End Date Calendar Section */}
                      <div className="calendar-section md:pl-5 md:border-l md:border-gray-200 flex flex-col">
                        <p className="text-sm font-semibold text-blue-700 mb-2 text-center">
                          End Date
                        </p>
                        <div className="flex-grow">
                          <Calendar
                            value={tempEndDate}
                            onChange={handleEndDateChange}
                            className="custom-calendar shadow-md rounded-md p-2 mx-auto w-full"
                            nextLabel={
                              <span className="text-black text-2xl px-2 border rounded-md shadow-md mb-1">
                                →
                              </span>
                            }
                            prevLabel={
                              <span className="text-black text-2xl px-2 border rounded-md shadow-md mb-1">
                                ←
                              </span>
                            }
                            next2Label={null}
                            prev2Label={null}
                            tileClassName={({ date }) =>
                              date.getTime() === tempStartDate.getTime() ||
                              date.getTime() === tempEndDate.getTime()
                                ? "selected-date"
                                : date > tempStartDate && date < tempEndDate
                                ? "highlight-range"
                                : null
                            }
                            tileContent={null}
                          />
                        </div>

                        {/* End Time - Fixed position at bottom of container */}
                        <div className="time-section text-center mt-auto pt-3">
                          <p className="text-sm font-semibold text-gray-700 mb-2">
                            End Time
                          </p>
                          <div className="flex gap-2 justify-center">
                            <select
                              className="p-2 border rounded-md bg-white shadow-lg"
                              value={tempEndDate.getHours()}
                              onChange={(e) => {
                                const newDate = new Date(tempEndDate);
                                newDate.setHours(parseInt(e.target.value));
                                setTempEndDate(newDate);
                              }}
                            >
                              {[...Array(24).keys()].map((hour) => (
                                <option key={hour} value={hour}>
                                  {hour.toString().padStart(2, "0")}
                                </option>
                              ))}
                            </select>
                            <span className="flex items-center">:</span>
                            <select
                              className="p-2 border rounded-md bg-white shadow-lg"
                              value={tempEndDate.getMinutes()}
                              onChange={(e) => {
                                const newDate = new Date(tempEndDate);
                                newDate.setMinutes(parseInt(e.target.value));
                                setTempEndDate(newDate);
                              }}
                            >
                              {[...Array(12).keys()].map((i) => {
                                const minute = i * 5;
                                return (
                                  <option key={minute} value={minute}>
                                    {minute.toString().padStart(2, "0")}
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Buttons Section */}
                    <div className="mt-5 border-t pt-3 flex justify-end gap-2">
                      <button
                        onClick={handleCancel}
                        className="bg-gray-400 text-white px-3 md:px-5 py-1 md:py-2 rounded-md transition-all hover:bg-gray-500 text-sm md:text-base"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleApply}
                        className="bg-blue-500 text-white px-3 md:px-5 py-1 md:py-2 rounded-md transition-all hover:bg-blue-600 text-sm md:text-base"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AlgoticsModule;
