import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import NewNavbar from "./NewNavbar";
import Sidebar from "./Sidebar";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
} from "recharts";

function Analytics() {
  const location = useLocation();
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("email");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [transactionData, setTransactionData] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [tempStartDate, setTempStartDate] = useState(new Date());
  const [tempEndDate, setTempEndDate] = useState(new Date());
  const calendarRef = useRef(null);
  const token = localStorage.getItem("token");
  const baseUrl = "https://139-59-5-56.nip.io:3443";
  const previousRequest = useRef(null);

  // Parse a date string in DD/MM/YYYY HH:MM:SS format to a Date object
  const parseDateTime = (dateString) => {
    const [datePart, timePart] = dateString.split(" ");
    const [day, month, year] = datePart.split("/");
    const [hours, minutes, seconds] = timePart.split(":");
    return new Date(year, month - 1, day, hours, minutes, seconds);
  };

  useEffect(() => {
    if (!location.state) {
      console.error("No data provided in location state");
      setError(
        "No analytics data provided. Please select a monitor from the Analytics Module."
      );
      setLoading(false);
      return;
    }

    if (location.state.start_date_time && location.state.end_date_time) {
      // Parse the date strings correctly if they're in DD/MM/YYYY format
      try {
        setTempStartDate(parseDateTime(location.state.start_date_time));
        setTempEndDate(parseDateTime(location.state.end_date_time));
      } catch (err) {
        console.error("Error parsing dates:", err);
        // Fallback to default dates if parsing fails
        setTempStartDate(new Date());
        setTempEndDate(new Date());
      }
    }

    const { user_id, mid, start_date_time, end_date_time } = location.state;
    const requestKey = `${user_id}-${mid}-${start_date_time}-${end_date_time}`;

    if (previousRequest.current === requestKey) {
      return;
    }

    previousRequest.current = requestKey;

    const fetchTransactionDetails = async () => {
      try {
        setLoading(true);
        const requestPayload = {
          user_id,
          mid,
          start_date_time,
          end_date_time,
        };

        const response = await fetch(`${baseUrl}/get_transaction_details`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestPayload),
        });

        console.log("API Response status:", response.status);
        const data = await response.json();
        console.log("API Response data:", data);

        if (response.ok) {
          setTransactionData(data);
        } else {
          console.log(
            "API returned error status but we're still processing available data"
          );
          if (data) setTransactionData(data);
        }
      } catch (err) {
        console.error("Error fetching transaction details:", err);
        setError(
          "An error occurred while fetching transaction details. Using location state data instead."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTransactionDetails();

    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [location.state, token, baseUrl]);

  const formatDateTime = (date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  };

  const handleScan = () => {
    if (!tempStartDate || !tempEndDate || !location.state) return;
    const formattedStartDate = formatDateTime(tempStartDate);
    const formattedEndDate = formatDateTime(tempEndDate);
    const newState = {
      ...location.state,
      start_date_time: formattedStartDate,
      end_date_time: formattedEndDate,
    };
    navigate(".", { state: newState, replace: true });
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

  const formatNumber = (num) => {
    return num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || "0";
  };

  const formatCryptoValue = (value) => {
    if (!value) return "0.00000";

    // If value is already a string (likely from API)
    if (typeof value === "string") {
      // Extract numeric part and token part using regex
      const match = value.match(/([0-9.]+)\s*([A-Za-z]+)?/);

      if (match) {
        const numericValue = match[1];
        const tokenSymbol = match[2] || ""; // Get token or empty string if not present

        // Format the number to 5 decimal places and keep the original token
        return (
          parseFloat(numericValue).toFixed(5) +
          (tokenSymbol ? ` ${tokenSymbol}` : "")
        );
      }

      return "0.00000"; // Return default if no match
    }

    // If value is a number, format it but don't add any token symbol
    return value.toFixed(5);
  };

  const renderLoadingSpinner = () => (
    <div className="flex justify-center items-center p-8">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      <p className="ml-4 text-gray-600">Loading analytics data...</p>
    </div>
  );

  const renderError = () => (
    <div className="bg-yellow-50 border border-yellow-100 text-yellow-700 p-3 rounded mb-4">
      <p>{error}</p>
    </div>
  );

  const renderCalendar = () => {
    // Use the location's date format consistently by using formatDateTime
    const formatDateRange = () => {
      const diffTime = Math.abs(tempEndDate - tempStartDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      const startDateStr =
        tempStartDate.getDate() +
        " " +
        tempStartDate.toLocaleString("default", { month: "short" });
      const endDateStr =
        tempEndDate.getDate() +
        " " +
        tempEndDate.toLocaleString("default", { month: "short" });

      return `last ${diffDays} days ${startDateStr} - ${endDateStr}`;
    };

    return (
      <div className="relative" ref={calendarRef}>
        <button
          onClick={() => setShowCalendar(!showCalendar)}
          className="flex items-center px-3 py-1.5 text-xl font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
        >
          <span className="mr-2">{formatDateRange()}</span>
          <svg
            className="h-4 w-4 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        {showCalendar && (
          <div className="absolute right-0 z-50 mt-2 sm:w-[500px] lg:w-[650px] bg-white p-4 rounded-lg shadow-2xl border">
            {/* Calendar UI Structure - Responsive grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-0">
              {/* Start Date Section */}
              <div className="calendar-section md:pr-3">
                <p className="text-sm font-semibold text-blue-700 mb-1 text-center">
                  Start Date
                </p>
                <div
                  className="calendar-container"
                  style={{ minHeight: "250px" }}
                >
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

                {/* Start Time Section - Mobile: Below calendar, Desktop: Hidden */}
                <div className="time-section text-center mt-2 md:hidden">
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

              {/* End Date Section */}
              <div className="calendar-section md:pl-3 md:border-l md:border-gray-200">
                <p className="text-sm font-semibold text-blue-700 mb-1 text-center">
                  End Date
                </p>
                <div
                  className="calendar-container"
                  style={{ minHeight: "250px" }}
                >
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

                {/* End Time Section - Mobile: Below calendar, Desktop: Hidden */}
                <div className="time-section text-center mt-2 md:hidden">
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

            {/* Time selector row - Desktop only, hidden on mobile */}
            <div className="hidden md:grid grid-cols-2 gap-0 mt-2">
              {/* Start Time Section - Desktop only */}
              <div className="time-section text-center md:pr-3">
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

              {/* End Time Section - Desktop only */}
              <div className="time-section text-center md:pl-3 md:border-l md:border-gray-200">
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

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setShowCalendar(false)}
                className="bg-gray-400 text-white px-4 py-1.5 rounded-md transition-all hover:bg-gray-500 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleScan}
                className="bg-blue-500 text-white px-4 py-1.5 rounded-md transition-all hover:bg-blue-600 text-sm"
              >
                Apply
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderTransactionsChart = () => {
    if (!transactionData || !transactionData.transactionAnalysis) {
      return null;
    }

    const { transactionsPerDay } = transactionData.transactionAnalysis;

    // Transform the data for the chart
    const chartData = Object.entries(transactionsPerDay).map(
      ([date, count]) => ({
        date,
        transactions: count,
      })
    );

    return (
      <div className="bg-white p-4 rounded-lg shadow-md mb-4 w-full">
        <h3 className="text-lg md:text-xl font-semibold text-gray-700 mb-3 text-center md:text-left">
          Transactions Over Time
        </h3>
        <div className="h-48 md:h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 5,
                right: 10,
                left: 0,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => {
                  // On mobile, show shorter date format
                  return window.innerWidth < 768 ? value.split(" ")[0] : value;
                }}
              />
              <YAxis
                width={40}
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => {
                  // Abbreviate large numbers on mobile
                  return window.innerWidth < 768 && value >= 1000
                    ? `${(value / 1000).toFixed(0)}k`
                    : value.toLocaleString();
                }}
              />
              <Tooltip
                formatter={(value) => [
                  `${value.toLocaleString()} transactions`,
                  "Count",
                ]}
                labelFormatter={(label) => `Date: ${label}`}
                contentStyle={{
                  fontSize: "12px",
                  padding: "8px",
                  borderRadius: "4px",
                }}
              />
              <Bar dataKey="transactions" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  const renderGasAnalysisChart = () => {
    if (
      !transactionData ||
      !transactionData.gasAnalysis ||
      !transactionData.gasAnalysis.dailyGasFees
    ) {
      return null;
    }

    const { dailyGasFees } = transactionData.gasAnalysis;

    // Transform the data for the chart
    const chartData = Object.entries(dailyGasFees).map(([date, gasInfo]) => {
      // Extract both numeric value and token name
      const totalGasParts = gasInfo.totalGas.split(" ");
      const averageGasParts = gasInfo.averageGasPerDay.split(" ");

      const totalGasValue = parseFloat(totalGasParts[0]);
      const averageGasValue = parseFloat(averageGasParts[0]);

      // Get token name (should be the same for both)
      const tokenName = totalGasParts[1] || averageGasParts[1] || "";

      return {
        date,
        totalGas: totalGasValue,
        averageGas: averageGasValue,
        tokenName: tokenName,
      };
    });

    // Get the token name from the first data point (if available)
    const tokenName = chartData.length > 0 ? chartData[0].tokenName : "";

    return (
      <div className="bg-white p-4 rounded-lg shadow-md mb-4">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">
          Gas Usage Over Time ({tokenName})
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => {
                  // On mobile, show shorter date format
                  return window.innerWidth < 768 ? value.split(" ")[0] : value;
                }}
              />
              <YAxis
                width={40}
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                formatter={(value, name) => [
                  `${value.toFixed(5)} ${tokenName}`,
                  name,
                ]}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="totalGas"
                stroke="#10B981"
                name={`Total Gas (${tokenName})`}
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="averageGas"
                stroke="#6366F1"
                name={`Avg Gas (${tokenName})`}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  const renderUniqueUsersChart = () => {
    if (!transactionData || !transactionData.userAnalysis) {
      return null;
    }

    const { uniqueUsersPerDay } = transactionData.userAnalysis;
    const chartData = Object.entries(uniqueUsersPerDay).map(
      ([date, count]) => ({
        date,
        uniqueUsers: count,
      })
    );

    return (
      <div className="bg-white p-4 rounded-lg shadow-md mb-4">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">
          Unique Users Over Time
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => {
                  // On mobile, show shorter date format
                  return window.innerWidth < 768 ? value.split(" ")[0] : value;
                }}
              />
              <YAxis
                width={40}
                tick={{ fontSize: 12 }}
                allowDecimals={false}
              />
              <Tooltip
                formatter={(value) => [
                  `${value.toLocaleString()} unique users`,
                  "Count",
                ]}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Bar dataKey="uniqueUsers" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  const renderMetricCards = () => {
    if (!transactionData) return null;
    const { transactionAnalysis, gasAnalysis, userAnalysis, contractAnalysis } =
      transactionData;
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-4 text-white h-36 flex flex-col">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="text-white text-opacity-80 text-xs font-medium mb-1">
                Total Transactions
              </p>
              <h3 className="text-2xl font-bold">
                {formatNumber(transactionAnalysis?.totalTransactions)}
              </h3>
            </div>
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
          <div className="mt-auto">
            <div className="text-xs font-medium text-white text-opacity-80">
              <span>Processed during selected period</span>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-4 text-white h-36 flex flex-col">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="text-white text-opacity-80 text-xs font-medium mb-1">
                Total Gas Fees
              </p>
              <h3 className="text-2xl font-bold">
                {formatCryptoValue(gasAnalysis?.totalGasFees)}
              </h3>
            </div>
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <div className="mt-auto">
            <div className="text-xs font-medium text-white text-opacity-80">
              <span>Total Value spent on gas</span>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl shadow-lg p-4 text-white h-36 flex flex-col">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="text-white text-opacity-80 text-xs font-medium mb-1">
                Unique Users
              </p>
              <h3 className="text-2xl font-bold">
                {formatNumber(userAnalysis?.totalUniqueUsers)}
              </h3>
            </div>
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
          </div>
          <div className="mt-auto">
            <div className="text-xs font-medium text-white text-opacity-80">
              <span>Distinct addresses interacting</span>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-lg p-4 text-white h-36 flex flex-col">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="text-white text-opacity-80 text-xs font-medium mb-1">
                Contract Balance
              </p>
              <h3 className="text-2xl font-bold">
                {formatCryptoValue(contractAnalysis?.contractBalance)}
              </h3>
            </div>
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
            </div>
          </div>
          <div className="mt-auto">
            <div className="text-xs font-medium text-white text-opacity-80">
              <span>Current contract balance</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full min-h-screen bg-white">
      <NewNavbar email={userEmail} />
      <div className="bg-white w-full flex flex-col sm:flex-row min-h-full">
        <Sidebar />
        <div className="h-full sm:flex flex-col gap-5 sm:ml-[100px] sm:w-56 mt-20 hidden sm:fixed">
          <div className="mt-5 py-3 pl-4 pr-9 rounded-r-full bg-[#6A6A6A1A]">
            <p className="text-[#6A6A6A] font-semibold text-nowrap px-2">
              Analytics & Report
            </p>
          </div>
        </div>
        <div className="mt-20 w-full sm:ml-80 min-h-full px-4 py-4 relative">
          <div className="container mx-auto p-3">
            <div className="mb-6">
              {/* Back Button */}
              <button
                onClick={() => navigate("/analyticsmodule")}
                className="flex items-center text-gray-700 hover:text-gray-900 transition"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19l-7-7 7-7"
                  ></path>
                </svg>
                <span className="text-sm font-medium">Back</span>
              </button>
            </div>

            {/* Content Section */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Analytics for {location.state?.monitorName || "Contract"}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Contract Address:{" "}
                    <span className="font-medium">
                      {transactionData?.Address ||
                        location.state?.monitorAddress ||
                        "Ethereum"}
                    </span>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Network:{" "}
                    <span className="font-medium">
                      {transactionData?.network ||
                        location.state?.monitorNetwork ||
                        "Ethereum"}
                    </span>
                  </p>
                  
                </div>
                {/* Calendar Component - Aligned properly */}
                <div className="mt-4 sm:mt-0">{renderCalendar()}</div>
              </div>
            </div>

            <div className="bg-white shadow-md rounded-lg p-4 mt-6">
              {loading ? (
                renderLoadingSpinner()
              ) : (
                <>
                  {error && renderError()}
                  {renderMetricCards()}
                  {transactionData && renderTransactionsChart()}
                  {transactionData && renderGasAnalysisChart()}
                  {transactionData && renderUniqueUsersChart()}
                  {transactionData && (
                    <div className="bg-gray-50 rounded-lg p-3 text-center text-gray-700 text-sm mt-4">
                      <span className="font-medium">Analysis Period:</span>{" "}
                      {transactionData.start_date_time} -{" "}
                      {transactionData.end_date_time}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
