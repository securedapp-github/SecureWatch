import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { baseUrl } from "../Constants/data";
import Sidebar from "./Sidebar";
import Navbar from "./NewNavbar";
import DateRangePicker from "../components/DateRangePicker";
import { TbTriangleSquareCircle } from "react-icons/tb";
import { FaCopy } from 'react-icons/fa';
import { HiMenuAlt2 } from "react-icons/hi";




const renderLoadingSpinner = () => (
  <div className="flex justify-center items-center p-8">
    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
    <p className="ml-4 text-gray-600">Loading history insight logs...</p>
  </div>
);


const getTransactionExplorerUrl = (network, transactionHash) => {
  const explorerUrls = {
    80002: "https://amoy.polygonscan.com/tx/",
    11155111: "https://sepolia.etherscan.io/tx/",
    1: "https://etherscan.io/tx/",
    56: "https://bscscan.com/tx/",
    137: "https://polygonscan.com/tx/",
    8453: "https://basescan.org/tx/",
    43114: "https://snowtrace.io/tx/",
    42161: "https://arbiscan.io/tx/",
    100: "https://gnosisscan.io/tx/",
    59144: "https://explorer.linea.build/tx/",
    1313161554: "https://explorer.mainnet.aurora.dev/tx/",
    10: "https://optimistic.etherscan.io/tx/"
  };


  return explorerUrls[network] ? `${explorerUrls[network]}${transactionHash}` : null;
};


const truncateAddress = (address, startLength = 5, endLength = 4) => {
  if (!address) return "";
  return `${address.slice(0, startLength)}...${address.slice(-endLength)}`;
};


const HistoricalInsights = () => {
  const [value, setValue] = useState(10);
  const [loading, setLoading] = useState(true);
  const [moniter, setMoniter] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [start_date_time, setStartDateTime] = useState("");
  const [end_date_time, setEndDateTime] = useState("");
  const [selectedMonitor, setSelectedMonitor] = useState(null);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyResponse, setHistoryResponse] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null); // New state for selected transaction
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const parent_id = localStorage.getItem("parent_id");
 


  useEffect(() => {
    setLoading(true);
    const fetchMoniter = async () => {
      setLoading(true);
      try {
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
        setMoniter(data);
      } catch (error) {
        console.error("Error fetching monitors:", error);
        toast.error("Error fetching monitors");
      } finally {
        setLoading(false);
      }
    };
    fetchMoniter();
  }, [value]);


  const handleGetLogs = (monitor) => {
    setSelectedMonitor(monitor);
    setShowDatePicker(true);
  };


  const handleCopy = (text) => {
    navigator.clipboard.writeText(text)
  };


  const handleDateRangeApply = async (startDate, endDate, startTime, endTime) => {
    setShowDatePicker(false);
    setHistoryLoading(true);


    // Format dates as "YYYY/MM/DD HH:MM:SS"
    const formatDateForHistoryEvents = (date, time) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");


      // Ensure time is in HH:MM:SS format
      const formattedTime = time.includes(":") && time.split(":").length === 2
        ? `${time}:00`
        : time;


      return `${year}/${month}/${day} ${formattedTime}`;
    };


    // Store formatted date strings in state variables
    const formattedStartDate = formatDateForHistoryEvents(startDate, startTime);
    const formattedEndDate = formatDateForHistoryEvents(endDate, endTime);


    setStartDateTime(formattedStartDate);
    setEndDateTime(formattedEndDate);


    // Get user_id
    const user_id = parent_id != 0 ? parseInt(parent_id) : parseInt(userId);
    // Get mid from selected monitor
    const mid = selectedMonitor?.mid;


    if (!user_id || !mid || !formattedStartDate || !formattedEndDate) {
      toast.error("Missing required parameters for history fetch");
      setHistoryLoading(false);
      return;
    }


    // Create the request body
    const requestBody = {
      user_id: user_id,
      mid: mid,
      start_date_time: formattedStartDate,
      end_date_time: formattedEndDate,
    };


    // Make the API call with POST method and request body
    try {
      const res = await fetch(`${baseUrl}/historical_insights`, {
        method: "POST", // Use POST instead of GET
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody), // Include the request body
      });


      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to fetch history events");
      }


      const data = await res.json();
      console.log("History event response:", data);
      setHistoryResponse(data);
      toast.success("Historical events fetched successfully");
    } catch (error) {
      console.error("Error fetching history events:", error);
      toast.error(`Error fetching history: ${error.message}`);
    } finally {
      setHistoryLoading(false);
    }
  };


  const handleBackToMonitors = () => {
    setHistoryResponse(null); // Reset history response to go back to monitors table
  };


  const handleViewDecodedData = (transaction) => {
    setSelectedTransaction(transaction); // Set the selected transaction
  };


  const formatTimestamp = (timestamp) => {
    const slicedTimestamp = timestamp.slice(4, -4);
    const day = slicedTimestamp.slice(0, 3);
    const month = slicedTimestamp.slice(4, 7);
    const yearAndTime = slicedTimestamp.slice(8);
   
    const monthToNumber = {
      'Jan': '01',
      'Feb': '02',
      'Mar': '03',
      'Apr': '04',
      'May': '05',
      'Jun': '06',
      'Jul': '07',
      'Aug': '08',
      'Sep': '09',
      'Oct': '10',
      'Nov': '11',
      'Dec': '12'
    };
   
    return `${yearAndTime.slice(0, 4)}-${monthToNumber[month]}-${day} ${yearAndTime.slice(5)}`;
  };


  const handleCloseDecodedData = () => {
    setSelectedTransaction(null); // Clear the selected transaction
  };


  if (loading) {
    return (
      <div className="flex flex-col h-screen">
        <Navbar />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          {renderLoadingSpinner()}
        </div>
      </div>
    );
  }


  if (
    (loading === false && !moniter) ||
    !Array.isArray(moniter.monitors) ||
    moniter.monitors.length === 0
  ) {
    return (
      <div className="flex flex-col h-screen">
        <Navbar />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <div className="flex-1 text-center mt-20 text-4xl font-medium text-black">
            Please create a monitor.
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />


        {/* Historical Insights sidebar */}
        <div className="h-full sm:flex flex-col gap-5 ml-[100px] w-56 mt-20 hidden fixed">
          <div className="mt-5 py-3 pl-4 pr-9 rounded-r-full bg-[#6A6A6A1A]">
            <p className="text-[#6A6A6A] font-semibold text-nowrap px-2">
              Historical Insights
            </p>
          </div>
        </div>


        <div className="flex-1 overflow-auto p-7">
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />


          {/* Content Container - Aligned with Historical Insights */}
          <div className="ml-0 sm:ml-96 pt-20">


            {/* Conditionally render monitors table or history response */}
            {!historyResponse ? (
              <div className="w-full">
                            <div className="w-full mb-4 flex items-center">
              <h2 className="text-2xl font-bold text-black pl-4">
                Contract Monitor
              </h2>
            </div>
                <div className="w-full rounded-md custom-scrollbar border-2 border-gray-400 overflow-x-auto">
                  <table className="w-full rounded-md overflow-hidden border-2 shadow-4xl bg-red shadow-[#303030F7] table">
                    <thead>
                      <tr>
                        <th className="py-4 border-2 border-none text-black text-sm font-medium">
                          Name
                        </th>
                        <th className="py-4 border-2 border-none text-black text-sm font-medium">
                          Networks
                        </th>
                        <th className="py-4 border-2 border-none text-black text-sm font-medium">
                          Created on
                        </th>
                        <th className="py-4 border-2 text-center border-none text-black text-sm font-medium">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {moniter.monitors.map((i) => {
                        const mid = i.mid;
                        const name = i.name;
                        const network = i.network;
                        const created_on = i.created_on;


                        return (
                          <tr className="border-gray-400 border-2 border-l-0 border-r-0" key={mid}>
                            <td className="px-4">
                              <p className="text-md text-black">{name}</p>
                            </td>
                            <td className="px-4">
                              <span className="text-md text-black">
                                {network === 80002
                                  ? "Amoy"
                                  : network === 1
                                  ? "Ethereum Mainnet"
                                  : network === 11155111
                                  ? "Sepolia Testnet"
                                  : network === 137
                                  ? "Polygon Mainnet"
                                  : network === 1300
                                  ? "Algorand Mainnet"
                                  : network === 1301
                                  ? "Unknown"
                                  : "Unknown"}
                              </span>
                            </td>
                            <td className="text-md text-black text-nowrap px-4">
                              {created_on?.slice(0, 10)}
                            </td>
                            <td className="px-4 py-2 text-center">
                              <button
                                className="bg-[#2D5C8F] text-white px-4 py-2 rounded-lg hover:bg-[#1D4C7F]"
                                onClick={() => handleGetLogs(i)}
                              >
                                Fetch
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
<div>
  <div className="flex items-center relative mb-4">
    <button
      className="absolute left-0 text-black px-4 py-2 rounded-lg border-2 border-white hover:border-2 hover:border-black"
      onClick={handleBackToMonitors}
    >
      ⮜ Back
    </button>


    {/* History Event Response Title */}
    <h3 className="font-bold text-xl mx-auto">History Event Alerts</h3>
  </div>


  <div className="w-full mt-6 bg-white rounded-md border border-gray-900 custom-scrollbar" style={{ maxHeight: "500px", overflowY: "auto" }}>
    {/* Table for History Response */}
    <table className="w-full rounded overflow-hidden border-2 shadow-4xl bg-red shadow-[#303030F7] table">
      <thead>
        <tr>
          <th className="py-4 border-2 border-none text-black text-sm font-medium">link</th>
          <th className="py-4 border-2 border-none text-black text-sm font-medium">Event Time</th>
          <th className="py-4 border-2 border-none text-black text-sm font-medium">Event Name</th>
          <th className="py-4 border-2 border-none text-black text-sm font-medium">From Address</th>
          <th className="py-4 border-2 border-none text-black text-sm font-medium">To Address</th>
          <th className="py-4 border-2 border-none text-black text-sm font-medium text-center lg:pl-28 pl-12"> <HiMenuAlt2 /> </th>
        </tr>
      </thead>
      <tbody>
      {historyResponse.transactions.map((transaction, index) => (
          transaction.logs.map((log, logIndex) => {
            const matchingEvent = historyResponse.events.find(
              event => event.db_event_signature === log.trans_signature
            );


            return (
              <tr key={`${index}-${logIndex}`} className="border-gray-400 border-2 border-l-0 border-r-0">
<td className="px-2 py-2 text-sm text-black">
  <a
    href={getTransactionExplorerUrl(selectedMonitor.network, transaction.transaction_hash)}
    target="_blank"
    rel="noopener noreferrer"
    className="text-blue-600 hover:underline"
  >
    {getTransactionExplorerUrl(selectedMonitor.network, transaction.transaction_hash.slice(0, 0))}...{transaction.transaction_hash.slice(-4)}
  </a>
</td>
<td className="px-6 py-2 text-sm text-black">
                {formatTimestamp(transaction.timestamp)}
              </td>
                <td className="px-4 py-2 text-sm text-black">
                  {log.trans_event_name}
                </td>
                <td className="px-4 py-2 text-sm text-black">
                  {truncateAddress(transaction.from_address)}
                </td>
                <td className="px-4 py-2 text-sm text-black">
                  {truncateAddress(transaction.to_address)}
                </td>
                <td className="px-4 py-2 text-center">
                  <button
                    className="bg-[#2D5C8F] text-white px-4 py-2 rounded-lg hover:bg-[#1D4C7F]"
                    onClick={() => handleViewDecodedData(transaction)}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            );
          })
        ))}
      </tbody>
    </table>
  </div>
</div>
            )}


            {/* Display loading state */}
            {historyLoading && renderLoadingSpinner()}
          </div>
        </div>
      </div>


      {/* Date Range Picker Pop-up */}
      {showDatePicker && (
        <DateRangePicker
          onApply={handleDateRangeApply}
          onCancel={() => setShowDatePicker(false)}
        />
      )}


{/* Modal for Decoded Data */}
{selectedTransaction && (
  <div className="p-7 fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="w-full bg-white sm:w-[60%] md:w-[600px] flex flex-col gap-5 p-5 rounded-2xl">
      <div className="bg-[#F2FBF6] flex flex-col gap-2 p-4 rounded-2xl border shadow-lg">
        <div className="bg-[#EBF6EE] border rounded-full w-8 h-8 flex items-center justify-center">
          <TbTriangleSquareCircle className="text-emerald-400 text-xl" />
        </div>
        <p className="text-black text-xl font-medium">Logs Details</p>
        <p className="text-slate-600 text-sm font-medium">Event: {selectedTransaction.logs[0]?.trans_event_name || "N/A"}</p>
      </div>


      {/* Updated format for decoded_data display */}
      <div className="bg-white rounded-md pt-4">
        {Object.entries(selectedTransaction.logs[0].decoded_data).map(([key, value]) => (
          <div key={key} className="mb-3">
            <span className="font-bold text-xl capitalize">{key}</span>
            <div className="ml-2 bg-gray-200 rounded-lg p-2 break-all flex justify-between items-center">
              <span>
                {typeof value === "object" ? JSON.stringify(value, null, 2) : value}
              </span>
              <button
                onClick={() => handleCopy(typeof value === "object" ? JSON.stringify(value, null, 2) : value)}
                className="text-gray-600 hover:text-gray-800"
              >
                <FaCopy className="text-lg" />
              </button>
            </div>
          </div>
        ))}
      </div>


      {/* Display the timestamp */}
      {selectedTransaction.timestamp && (
        <div className="mt-4">
          <h4 className="font-bold text-xl mb-2">Timestamp</h4>
          <p>{selectedTransaction.timestamp}</p>
        </div>
      )}


      <div className="flex justify-end">
        <button
          className="mt-4 bg-gray-200 text-black px-4 py-2 rounded-xl hover:bg-gray-300"
          onClick={handleCloseDecodedData}
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};


export default HistoricalInsights;