import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NewNavbar from "./NewNavbar";
import Sidebar from "./Sidebar";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { baseUrl } from '../Constants/data.js';

function AlgoticsModule() {
  const userEmail = localStorage.getItem("email");
  const [loading, setLoading] = useState(true);
  const [monitors, setMonitors] = useState([]);
  const [selectedMonitor, setSelectedMonitor] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showManDeshiData, setShowManDeshiData] = useState(null); // 'accounts', 'assets', or 'wallets'
  const [showSewaData, setShowSewaData] = useState(null); // 'accounts', 'assets', or 'wallets'
  const [sewaStats, setSewaStats] = useState(null);
  const [sewaAssetCategories, setSewaAssetCategories] = useState(null);
  const [sewaStatsLoading, setSewaStatsLoading] = useState(false);
  const [sewaStatsError, setSewaStatsError] = useState(null);
  const [sewaAssetsLoading, setSewaAssetsLoading] = useState(false);
  const [sewaAssetsError, setSewaAssetsError] = useState(null);
  const [mannDeshiUserStats, setMannDeshiUserStats] = useState(null);
  const [mannDeshiUserStatsLoading, setMannDeshiUserStatsLoading] = useState(false);
  const [mannDeshiUserStatsError, setMannDeshiUserStatsError] = useState(null);

  const [activeTab, setActiveTab] = useState("sewa"); // 'sewa' or 'manDeshi'
  const navigate = useNavigate();

  const [tempStartDate, setTempStartDate] = useState(new Date());
  const [tempEndDate, setTempEndDate] = useState(new Date());

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const parent_id = localStorage.getItem("parent_id");

  // Add state for counts and analytics
  const [mannDeshiCounts, setMannDeshiCounts] = useState({ assetsCount: 0, usersCount: 0 });
  const [sewaCounts, setSewaCounts] = useState({ assetsCount: 0, usersCount: 0 });
  const [mannDeshiAnalytics, setMannDeshiAnalytics] = useState(null);
  const [mannDeshiAssetsLoading, setMannDeshiAssetsLoading] = useState(false);
  const [mannDeshiAssetsError, setMannDeshiAssetsError] = useState(null);
  const [countsLoading, setCountsLoading] = useState(false);
  const [countsError, setCountsError] = useState(null);

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

  useEffect(() => {
    setCountsLoading(true);
    setCountsError(null);
    Promise.all([
      fetch(`${baseUrl}/getMannDeshiCount`).then(r => r.json()),
      fetch(`${baseUrl}/getSewaCount`).then(r => r.json()),
      fetch(`${baseUrl}/getMannDeshiAnalytics`).then(r => r.json())
    ])
      .then(([mannDeshi, sewa, mannDeshiAnalytics]) => {
        setMannDeshiCounts(mannDeshi);
        setSewaCounts(sewa);
        setMannDeshiUserStats(mannDeshiAnalytics.users);
      })
      .catch(e => setCountsError('Failed to fetch counts'))
      .finally(() => setCountsLoading(false));
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

  // Handler for MannDeshi View Assets
  const handleViewMannDeshiAssets = () => {
    setShowManDeshiData('assets');
    setMannDeshiAssetsLoading(true);
    setMannDeshiAssetsError(null);
    fetch(`${baseUrl}/getMannDeshiAnalytics`)
      .then(r => r.json())
      .then(data => setMannDeshiAnalytics(data.tokenCategoryStats))
      .catch(e => setMannDeshiAssetsError('Failed to fetch analytics'))
      .finally(() => setMannDeshiAssetsLoading(false));
  };

  const handleViewSewaStats = () => {
    setShowSewaData('stats');
    setSewaStatsLoading(true);
    setSewaStatsError(null);
    fetch(`${baseUrl}/getSewaAnalytics`)
      .then(r => r.json())
      .then(data => {
        setSewaStats(data.users);
        setSewaAssetCategories(null); // Clear asset categories when viewing stats
      })
      .catch(e => setSewaStatsError('Failed to fetch stats'))
      .finally(() => setSewaStatsLoading(false));
  };

  const handleViewSewaAssets = () => {
    setShowSewaData('assets');
    setSewaAssetsLoading(true);
    setSewaAssetsError(null);
    fetch(`${baseUrl}/getSewaAnalytics`)
      .then(r => r.json())
      .then(data => setSewaAssetCategories(data.assetCategoryCounts))
      .catch(e => setSewaAssetsError('Failed to fetch asset categories'))
      .finally(() => setSewaAssetsLoading(false));
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

  const [sewaWalletTab, setSewaWalletTab] = useState('weekly');
  const [manDeshiWalletTab, setManDeshiWalletTab] = useState('weekly');

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
              MannDeshi Foundation
            </p>
          </div>
        </div>

        {/* Main content area - adjusted margins for responsive layout */}
        <div className="mt-12 w-full px-2 md:px-4 py-6 relative md:ml-80">
          <div className="bg-white w-full min-h-full">
            <div className="w-full min-h-full relative">
              <div className="container mx-auto p-2 md:p-4 text-black mt-5">
                <h2 className="text-xl md:text-2xl font-bold mb-4">
                  {activeTab === 'sewa' ? 'Sewa Dashboard' : 'MannDeshi Foundation Dashboard'}
                </h2>

                {activeTab === 'sewa' && (
                  <div className="flex flex-col gap-6 mt-4">
                    {/* Dashboard Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                      <div className="bg-gradient-to-br from-blue-100 to-blue-300 p-6 rounded-2xl shadow-lg flex flex-col items-center relative">
                        <div className="bg-blue-500 text-white rounded-full p-3 mb-2 shadow-md">
                          <svg xmlns='http://www.w3.org/2000/svg' className='h-7 w-7' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-4V7a4 4 0 10-8 0v3m12 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2v-1' /></svg>
                        </div>
                        <h3 className="text-lg font-semibold mb-1">Total Accounts</h3>
                        <p className="text-3xl font-bold text-blue-700 mb-2">{countsLoading ? '...' : sewaCounts.usersCount}</p>
                        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition" onClick={handleViewSewaStats}>View Stats</button>
                      </div>
                      <div className="bg-gradient-to-br from-green-100 to-green-300 p-6 rounded-2xl shadow-lg flex flex-col items-center relative">
                        <div className="bg-green-500 text-white rounded-full p-3 mb-2 shadow-md">
                          <svg xmlns='http://www.w3.org/2000/svg' className='h-7 w-7' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 0V4m0 7v7m0 0h4m-4 0H8' /></svg>
                        </div>
                        <h3 className="text-lg font-semibold mb-1">Total Assets</h3>
                        <p className="text-3xl font-bold text-green-700 mb-2">{countsLoading ? '...' : sewaCounts.assetsCount}</p>
                        <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition" onClick={handleViewSewaAssets}>View Assets</button>
                      </div>
                    </div>
                    {/* Sewa Stats Card/Table */}
                    {showSewaData === 'stats' && (
                      <div className="rounded-xl border-2 mt-4 bg-white shadow-2xl relative max-w-xl mx-auto p-6">
                        <button className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-2xl font-bold" onClick={() => setShowSewaData(null)}>&times;</button>
                        <h3 className="text-2xl font-bold mb-4 p-2 text-center">User Stats</h3>
                        {sewaStatsLoading && <div className="p-6 text-center text-xl text-gray-500">Loading...</div>}
                        {sewaStatsError && <div className="p-6 text-center text-xl text-red-500">{sewaStatsError}</div>}
                        {!sewaStatsLoading && !sewaStatsError && sewaStats && (
                          <table className="min-w-full border-gray-300 bg-white rounded-xl text-lg mb-8">
                            <thead className="bg-blue-50">
                              <tr>
                                <th className="px-6 py-4 text-center text-xl font-bold">Weekly</th>
                                <th className="px-6 py-4 text-center text-xl font-bold">Monthly</th>
                                <th className="px-6 py-4 text-center text-xl font-bold">Yearly</th>
                                <th className="px-6 py-4 text-center text-xl font-bold">Total</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="border-t-2 border-b bg-gray-50 text-2xl font-semibold">
                                <td className="px-6 py-4 text-center">{sewaStats.weekly}</td>
                                <td className="px-6 py-4 text-center">{sewaStats.monthly}</td>
                                <td className="px-6 py-4 text-center">{sewaStats.yearly}</td>
                                <td className="px-6 py-4 text-center">{sewaStats.total}</td>
                              </tr>
                            </tbody>
                          </table>
                        )}
                      </div>
                    )}
                    {/* Sewa Asset Category Table */}
                    {showSewaData === 'assets' && (
                      <div className="rounded-xl border-2 mt-4 bg-white shadow-2xl relative max-w-xl mx-auto p-6">
                        <button className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-2xl font-bold" onClick={() => setShowSewaData(null)}>&times;</button>
                        <h4 className="text-xl font-bold mb-3 text-blue-700">Asset Category Breakdown</h4>
                        {sewaAssetsLoading && <div className="p-6 text-center text-xl text-gray-500">Loading...</div>}
                        {sewaAssetsError && <div className="p-6 text-center text-xl text-red-500">{sewaAssetsError}</div>}
                        {!sewaAssetsLoading && !sewaAssetsError && sewaAssetCategories && (
                          <table className="min-w-full border-gray-300 bg-white rounded-xl text-lg">
                            <thead className="bg-green-50">
                              <tr>
                                <th className="px-6 py-3 text-left font-bold">Category</th>
                                <th className="px-6 py-3 text-center font-bold">Count</th>
                              </tr>
                            </thead>
                            <tbody>
                              {Object.entries(sewaAssetCategories).map(([cat, count], idx) => (
                                <tr key={cat} className={`border-t-2 border-b ${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}> 
                                  <td className="px-6 py-3 text-blue-900 font-semibold">{cat}</td>
                                  <td className="px-6 py-3 text-center text-green-700 font-bold">{count}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}
                      </div>
                    )}

                    {showSewaData === 'wallets' && (
                      <div className="overflow-x-auto rounded-xl border-2 mt-4 bg-white shadow-lg relative">
                        <button className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-xl font-bold" onClick={() => setShowSewaData(null)}>&times;</button>
                        <h3 className="text-lg font-semibold mb-2 p-2">Demo Sewa Wallets</h3>
                        {/* Tabs for Weekly, Monthly, Yearly */}
                        <div className="flex gap-2 mb-4 px-2">
                          <button onClick={() => setSewaWalletTab('weekly')} className={`px-4 py-2 rounded-t-lg font-semibold transition ${sewaWalletTab === 'weekly' ? 'bg-purple-500 text-white' : 'bg-purple-100 text-purple-700 hover:bg-purple-200'}`}>Weekly</button>
                          <button onClick={() => setSewaWalletTab('monthly')} className={`px-4 py-2 rounded-t-lg font-semibold transition ${sewaWalletTab === 'monthly' ? 'bg-purple-500 text-white' : 'bg-purple-100 text-purple-700 hover:bg-purple-200'}`}>Monthly</button>
                          <button onClick={() => setSewaWalletTab('yearly')} className={`px-4 py-2 rounded-t-lg font-semibold transition ${sewaWalletTab === 'yearly' ? 'bg-purple-500 text-white' : 'bg-purple-100 text-purple-700 hover:bg-purple-200'}`}>Yearly</button>
                        </div>
                        <table className="min-w-full border-gray-300 bg-white rounded-xl">
                          <thead className="bg-purple-50">
                            <tr>
                              <th className="px-2 md:px-4 py-2 text-left">Wallet ID</th>
                              <th className="px-2 md:px-4 py-2 text-left">Address</th>
                              <th className="px-2 md:px-4 py-2 text-left">Created Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(sewaWalletTab === 'weekly' ? sewaWalletsWeekly : sewaWalletTab === 'monthly' ? sewaWalletsMonthly : sewaWalletsYearly).map((wallet, idx) => (
                              <tr key={wallet.id} className={`hover:bg-purple-50 border-t-2 border-b ${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                                <td className="px-2 md:px-4 py-2 font-mono text-purple-700">{wallet.id}</td>
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
                  <div className="flex flex-col gap-6 mt-4">
                    {/* Dashboard Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                      <div className="bg-gradient-to-br from-blue-100 to-blue-300 p-6 rounded-2xl shadow-lg flex flex-col items-center relative">
                        <div className="bg-blue-500 text-white rounded-full p-3 mb-2 shadow-md">
                          <svg xmlns='http://www.w3.org/2000/svg' className='h-7 w-7' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-4V7a4 4 0 10-8 0v3m12 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2v-1' /></svg>
                        </div>
                        <h3 className="text-lg font-semibold mb-1">Total Accounts</h3>
                        <p className="text-3xl font-bold text-blue-700 mb-2">{mannDeshiUserStatsLoading || countsLoading ? '...' : mannDeshiUserStats ? mannDeshiUserStats.total : mannDeshiCounts.usersCount}</p>
                        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition" onClick={() => setShowManDeshiData('accounts')}>View Accounts</button>
                      </div>
                      <div className="bg-gradient-to-br from-green-100 to-green-300 p-6 rounded-2xl shadow-lg flex flex-col items-center relative">
                        <div className="bg-green-500 text-white rounded-full p-3 mb-2 shadow-md">
                          <svg xmlns='http://www.w3.org/2000/svg' className='h-7 w-7' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 0V4m0 7v7m0 0h4m-4 0H8' /></svg>
                        </div>
                        <h3 className="text-lg font-semibold mb-1">Total Assets</h3>
                        <p className="text-3xl font-bold text-green-700 mb-2">{countsLoading ? '...' : mannDeshiCounts.assetsCount}</p>
                        <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition" onClick={handleViewMannDeshiAssets}>View Assets</button>
                      </div>
                    </div>
                    {/* MannDeshi User Stats Table (optional, if you want to show it on View Accounts) */}
                    {showManDeshiData === 'accounts' && (
                      <div className="rounded-xl border-2 mt-4 bg-white shadow-2xl relative max-w-xl mx-auto p-6">
                        <button className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-2xl font-bold" onClick={() => setShowManDeshiData(null)}>&times;</button>
                        <h3 className="text-2xl font-bold mb-4 p-2 text-center">User Stats</h3>
                        {mannDeshiUserStatsLoading && <div className="p-6 text-center text-xl text-gray-500">Loading...</div>}
                        {mannDeshiUserStatsError && <div className="p-6 text-center text-xl text-red-500">{mannDeshiUserStatsError}</div>}
                        {!mannDeshiUserStatsLoading && !mannDeshiUserStatsError && mannDeshiUserStats && (
                          <table className="min-w-full border-gray-300 bg-white rounded-xl text-lg mb-8">
                            <thead className="bg-blue-50">
                              <tr>
                                <th className="px-6 py-4 text-center text-xl font-bold">Weekly</th>
                                <th className="px-6 py-4 text-center text-xl font-bold">Monthly</th>
                                <th className="px-6 py-4 text-center text-xl font-bold">Yearly</th>
                                <th className="px-6 py-4 text-center text-xl font-bold">Total</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="border-t-2 border-b bg-gray-50 text-2xl font-semibold">
                                <td className="px-6 py-4 text-center">{mannDeshiUserStats.weekly}</td>
                                <td className="px-6 py-4 text-center">{mannDeshiUserStats.monthly}</td>
                                <td className="px-6 py-4 text-center">{mannDeshiUserStats.yearly}</td>
                                <td className="px-6 py-4 text-center">{mannDeshiUserStats.total}</td>
                              </tr>
                            </tbody>
                          </table>
                        )}
                      </div>
                    )}

                    {showManDeshiData === 'assets' && (
                      <div className="overflow-x-auto rounded-xl border-2 mt-4 bg-white shadow-lg relative">
                        <button className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-xl font-bold" onClick={() => setShowManDeshiData(null)}>&times;</button>
                        <h3 className="text-lg font-semibold mb-2 p-2">Asset Category Breakdown</h3>
                        {mannDeshiAssetsLoading && <div className="p-4 text-center text-gray-500">Loading...</div>}
                        {mannDeshiAssetsError && <div className="p-4 text-center text-red-500">{mannDeshiAssetsError}</div>}
                        {!mannDeshiAssetsLoading && !mannDeshiAssetsError && mannDeshiAnalytics && (
                          <table className="min-w-full border-gray-300 bg-white rounded-xl">
                            <thead className="bg-pink-50">
                              <tr>
                                <th className="px-2 md:px-4 py-2 text-left">Category</th>
                                <th className="px-2 md:px-4 py-2 text-left">Weekly</th>
                                <th className="px-2 md:px-4 py-2 text-left">Monthly</th>
                                <th className="px-2 md:px-4 py-2 text-left">Yearly</th>
                                <th className="px-2 md:px-4 py-2 text-left">Total</th>
                              </tr>
                            </thead>
                            <tbody>
                              {Object.entries(mannDeshiAnalytics).map(([cat, stats], idx) => (
                                <tr key={cat} className={`hover:bg-pink-50 border-t-2 border-b ${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                                  <td className="px-2 md:px-4 py-2 font-semibold text-pink-700">{cat}</td>
                                  <td className="px-2 md:px-4 py-2">{stats.weekly}</td>
                                  <td className="px-2 md:px-4 py-2">{stats.monthly}</td>
                                  <td className="px-2 md:px-4 py-2">{stats.yearly}</td>
                                  <td className="px-2 md:px-4 py-2">{stats.total}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}
                      </div>
                    )}

                    {showManDeshiData === 'wallets' && (
                      <div className="overflow-x-auto rounded-xl border-2 mt-4 bg-white shadow-lg relative">
                        <button className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-xl font-bold" onClick={() => setShowManDeshiData(null)}>&times;</button>
                        <h3 className="text-lg font-semibold mb-2 p-2">Demo Wallets</h3>
                        {/* Tabs for Weekly, Monthly, Yearly */}
                        <div className="flex gap-2 mb-4 px-2">
                          <button onClick={() => setManDeshiWalletTab('weekly')} className={`px-4 py-2 rounded-t-lg font-semibold transition ${manDeshiWalletTab === 'weekly' ? 'bg-yellow-500 text-white' : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'}`}>Weekly</button>
                          <button onClick={() => setManDeshiWalletTab('monthly')} className={`px-4 py-2 rounded-t-lg font-semibold transition ${manDeshiWalletTab === 'monthly' ? 'bg-yellow-500 text-white' : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'}`}>Monthly</button>
                          <button onClick={() => setManDeshiWalletTab('yearly')} className={`px-4 py-2 rounded-t-lg font-semibold transition ${manDeshiWalletTab === 'yearly' ? 'bg-yellow-500 text-white' : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'}`}>Yearly</button>
                        </div>
                        <table className="min-w-full border-gray-300 bg-white rounded-xl">
                          <thead className="bg-yellow-50">
                            <tr>
                              <th className="px-2 md:px-4 py-2 text-left">Wallet ID</th>
                              <th className="px-2 md:px-4 py-2 text-left">Address</th>
                              <th className="px-2 md:px-4 py-2 text-left">Created Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(manDeshiWalletTab === 'weekly' ? manDeshiWalletsWeekly : manDeshiWalletTab === 'monthly' ? manDeshiWalletsMonthly : manDeshiWalletsYearly).map((wallet, idx) => (
                              <tr key={wallet.id} className={`hover:bg-yellow-50 border-t-2 border-b ${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                                <td className="px-2 md:px-4 py-2 font-mono text-yellow-700">{wallet.id}</td>
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
