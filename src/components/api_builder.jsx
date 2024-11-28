
import React, { useState, useEffect, useRef } from "react";
import Web3 from "web3";
import "../App.css";
import Navbar from "./navbar2";
import Connect from "./Connect";
import { useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { baseUrl } from "../Constants/data";

const Api_builder = () => {
  const [userWalletAddress, setUserWalletAddress] = useState(null);
  const [contract, setContract] = useState(null);
  const [writeFunctions, setWriteFunctions] = useState([]);
  const [readFunctions, setReadFunctions] = useState([]);
  const [events, setEvents] = useState([]);
  const [network, setNetwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [consoleLog, setConsoleLog] = useState([]);

  const consoleEndRef = useRef(null);
  const [openFunction, setOpenFunction] = useState(null);

  const toggleFunction = (funcName) => {
    setOpenFunction(openFunction === funcName ? null : funcName); // Toggle visibility
  };

  // Add a console logging function
  const addConsoleLog = (message, type = 'info') => {
    setConsoleLog(prevLogs => [
      ...prevLogs, 
      { message, type, timestamp: new Date().toLocaleTimeString() }
    ]);
  };

  useEffect(() => {
    consoleEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [consoleLog]);

  const token = localStorage.getItem("token");
  const decoded = jwtDecode(token);
  const user_Id = decoded.userId;
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const targetMids = query.get("id");

  const [abi, setAbi] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    const savedAddress = window.localStorage.getItem('userWalletAddress');
    if (savedAddress) {
      setUserWalletAddress(savedAddress);
    }
  }, []);

  useEffect(() => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      const savedAddress = window.localStorage.getItem("userWalletAddress");
      if (savedAddress) {
        setUserWalletAddress(savedAddress);
      }
      
      // Detect network
      window.web3.eth.net.getId().then(networkId => {
        const networks = {
          1: 'Ethereum Mainnet',
          3: 'Ropsten Testnet',
          4: 'Rinkeby Testnet',
          5: 'Goerli Testnet',
          42: 'Kovan Testnet',
          56: 'Binance Smart Chain',
          137: 'Polygon Mainnet',
          80001: 'Mumbai Testnet'
        };
        setNetwork(networks[networkId] || `Network ID: ${networkId}`);
      });
    } else {
      addConsoleLog("Please install MetaMask or any Ethereum Extension Wallet", 'error');
    }
  }, []);

  const handleConnectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        const selectedAccount = accounts[0];
        const normalizedAccount = !selectedAccount.startsWith("0x") 
          ? "0x" + selectedAccount 
          : selectedAccount;
        
        setUserWalletAddress(normalizedAccount);
        addConsoleLog(`Connected Wallet Address: ${normalizedAccount}`, 'success');
      } catch (error) {
        addConsoleLog(`Error connecting wallet: ${error.message}`, 'error');
        console.error("Error connecting wallet:", error);
      }
    }
  };

  const loadContract = (parsedAbi, contractAddress) => {
    try {
      const contractInstance = new window.web3.eth.Contract(
        parsedAbi,
        contractAddress
      );
      setContract(contractInstance);
      setWriteFunctions(
        parsedAbi.filter(
          (item) =>
            item.type === "function" &&
            (item.stateMutability !== "view" && item.stateMutability !== "pure")
        )
      );
      setReadFunctions(
        parsedAbi.filter(
          (item) =>
            item.type === "function" &&
            (item.stateMutability === "view" || item.stateMutability === "pure")
        )
      );
      setEvents(parsedAbi.filter((item) => item.type === "event"));
      
      addConsoleLog(`Contract loaded successfully at ${contractAddress}`, 'success');
    } catch (error) {
      addConsoleLog(`Failed to load contract: ${error.message}`, 'error');
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchMoniter = async () => {
      let data;
      try {
        const res = await fetch(`${baseUrl}/get_monitor`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: user_Id,
          }),
        });
        data = await res.json();

        const _selectedMonitor = data.monitors.find(
          (monitor) => monitor.mid == targetMids
        );
        if (_selectedMonitor) {
          setAbi(_selectedMonitor.abi);
          setAddress(_selectedMonitor.address);
          loadContract(JSON.parse(_selectedMonitor.abi), _selectedMonitor.address);
        }
      } catch (error) {
        addConsoleLog(`Error fetching monitor data: ${error.message}`, 'error');
        console.error("Error fetching monitor data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMoniter();
  }, [user_Id, targetMids]);


  const decodeRevertReason = (error) => {
    try {
      // Check for common revert reasons
      const errorString = error.message.toLowerCase();
      const revertReasons = [
        { 
          check: errorString.includes('insufficient balance'), 
          message: 'Insufficient token balance for transfer' 
        },
        { 
          check: errorString.includes('transfer amount exceeds balance'), 
          message: 'Transfer amount is greater than available balance' 
        },
        { 
          check: errorString.includes('transfer amount must be greater than 0'), 
          message: 'Transfer amount must be positive' 
        },
        { 
          check: errorString.includes('not enough allowance'), 
          message: 'Insufficient allowance for token transfer' 
        },
        { 
          check: errorString.includes('cannot transfer to zero address'), 
          message: 'Cannot transfer tokens to zero address' 
        },
      ];

      // Find the first matching reason
      const matchedReason = revertReasons.find(reason => reason.check);
      
      return matchedReason 
        ? matchedReason.message 
        : 'Unknown transaction revert reason';
    } catch (decodeError) {
      return 'Could not decode revert reason';
    }
  };

  const handleWriteFunction = async (functionName, inputs) => {
    try {
      if (!userWalletAddress) {
        addConsoleLog("Please connect your wallet first.", 'warning');
        await handleConnectWallet();
      }

      const normalizedAddress = userWalletAddress.startsWith("0x") 
        ? userWalletAddress 
        : "0x" + userWalletAddress;

      const isValidAddress = (address) => /^0x[a-fA-F0-9]{40}$/.test(address);

      if (!isValidAddress(normalizedAddress)) {
        addConsoleLog("Invalid Ethereum address format. Please check your wallet address.", 'error');
        return;
      }

      // Get current network
      const networkId = await window.web3.eth.net.getId();
      
      // Fetch gas price with multiple attempts and fallbacks
      let gasPrice;
      try {
        gasPrice = await window.web3.eth.getGasPrice();
      } catch (gasPriceError) {
        addConsoleLog(`Error fetching gas price: ${gasPriceError.message}. Using default.`, 'warning');
        gasPrice = window.web3.utils.toWei('20', 'gwei'); // Fallback gas price
      }

      // Estimate gas with try-catch
      let gasEstimate;
      try {
        gasEstimate = await contract.methods[functionName](...inputs).estimateGas({
          from: normalizedAddress,
        });
      } catch (gasEstimateError) {
        addConsoleLog(`Gas estimation failed: ${gasEstimateError.message}. Using default gas limit.`, 'warning');
        gasEstimate = 300000; // Fallback gas limit
      }

      addConsoleLog(`Executing ${functionName} with inputs: ${JSON.stringify(inputs)}`, 'info');
      addConsoleLog(`Gas Estimate: ${gasEstimate}, Gas Price: ${gasPrice}`, 'info');

      await contract.methods[functionName](...inputs).send({
        from: normalizedAddress,
        gas: gasEstimate,
        gasPrice: parseInt(gasPrice) * 1.2, // Increase gas price slightly (20% higher)
      });

      addConsoleLog(`${functionName} executed successfully!`, 'success');
    } catch (error) {
      addConsoleLog(`Failed to execute ${functionName}: ${error.message}`, 'error');
      console.error("Error in handleWriteFunction:", error);
      
      // Provide more detailed error handling
      if (error.message.includes('Internal RPC error')) {
        addConsoleLog('Possible causes:', 'warning');
        addConsoleLog('1. Insufficient funds for gas', 'warning');
        addConsoleLog('2. Contract function requirements not met', 'warning');
        addConsoleLog('3. Incorrect parameters or contract state', 'warning');
      }
    }
  };

  const handleReadFunction = async (functionName, inputs) => {
    try {
      const result = await contract.methods[functionName](...inputs).call();
  
      // Convert BigInt values to strings before stringifying the result
      const formattedResult = JSON.parse(
        JSON.stringify(result, (key, value) =>
          typeof value === "bigint" ? value.toString() : value
        )
      );
  
      addConsoleLog(`Read Function ${functionName} Result:`, 'success');
      addConsoleLog(JSON.stringify(formattedResult, null, 2), 'info');
    } catch (error) {
      addConsoleLog(`Failed to call ${functionName}: ${error.message}`, 'error');
      console.error(error);
    }
  };

//   return (
//     <div className="App bg-white pb-64 pt-5">
//       <Navbar email={localStorage.getItem("email")} />
//       <h1 className="text-center my-10 text-4xl font-medium text-black">
//         Web3 API Interface
//       </h1>
//       <div className="flex justify-center gap-6 flex-wrap my-7">
//         <Connect />
//         <div id="wallet-info" className="wallet-info py-3 px-4 border-2">
//           <span className="address">Wallet Address: {userWalletAddress}</span>
//           <br />
//           <span className="network">Network: {network}</span>
//         </div>
//       </div>

//       <div id="container" className="container">
//         <h2>Write Functions</h2>
//         {writeFunctions.map((func, idx) => (
//           <div className="group" key={idx}>
//             <button
//               onClick={() =>
//                 handleWriteFunction(
//                   func.name,
//                   func.inputs.map((input) =>
//                     document.getElementById(`write-${func.name}-${input.name}`)
//                       .value
//                   )
//                 )
//               }
//             >
//               {func.name}
//             </button>
//             {func.inputs.map((input, i) => (
//               <input
//                 key={i}
//                 id={`write-${func.name}-${input.name}`}
//                 type="text"
//                 placeholder={`${input.type} ${input.name}`}
//               />
//             ))}
//           </div>
//         ))}

//         <h2>Read Functions</h2>
//         {readFunctions.map((func, idx) => (
//           <div className="group" key={idx}>
//             <button
//               onClick={() =>
//                 handleReadFunction(
//                   func.name,
//                   func.inputs.map((input) =>
//                     document.getElementById(`read-${func.name}-${input.name}`)
//                       .value
//                   )
//                 )
//               }
//             >
//               {func.name}
//             </button>
//             {func.inputs.map((input, i) => (
//               <input
//                 key={i}
//                 id={`read-${func.name}-${input.name}`}
//                 type="text"
//                 placeholder={`${input.type} ${input.name}`}
//               />
//             ))}
//           </div>
//         ))}

//         {/* Console Log Section */}
//         <div className="console-log mt-10">
//           <h2>Console Log</h2>
//           <div className="console-container bg-black text-white p-4 max-h-64 overflow-y-auto">
//             {consoleLog.map((log, index) => (
//               <div 
//                 key={index} 
//                 className={`console-line ${
//                   log.type === 'error' ? 'text-red-500' : 
//                   log.type === 'success' ? 'text-green-500' : 
//                   log.type === 'warning' ? 'text-yellow-500' : 
//                   'text-white'
//                 }`}
//               >
//                 <span className="text-gray-400 mr-2">[{log.timestamp}]</span>
//                 {log.message}
//               </div>
//             ))}
//               <div ref={consoleEndRef} />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Api_builder;

return (
  <div className="App bg-white pb-64 pt-5">
    <Navbar email={localStorage.getItem("email")} />
    <h1 className="text-center my-10 text-4xl font-medium text-black">Web3 API Interface</h1>
    <div className="flex justify-center gap-6 flex-wrap my-7">
      <Connect />
    </div>

    <div id="container" className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold my-4">Write Functions</h2>
      <div className="space-y-4">
        {writeFunctions.map((func, idx) => (
          <div className="bg-orange-100 border border-orange-500 p-4 rounded" key={idx}>
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleFunction(func.name)}
            >
              <span className="text-orange-600 font-medium">{func.name}</span>
              <span className="text-gray-600 text-sm">
                {openFunction === func.name ? "" : func.inputs.map((input) => `${input.name} (${input.type})`).join(", ")}
              </span>
            </div>
            {openFunction === func.name && (
              <div className="mt-3 space-y-3">
                {func.inputs.map((input, i) => (
                  <input
                    key={i}
                    id={`write-${func.name}-${input.name}`}
                    type="text"
                    className="border p-2 w-full rounded"
                    placeholder={`${input.name} (${input.type})`}
                  />
                ))}
                <button
                  onClick={() =>
                    handleWriteFunction(
                      func.name,
                      func.inputs.map((input) => document.getElementById(`write-${func.name}-${input.name}`).value)
                    )
                  }
                  className="bg-orange-500 text-white py-2 px-4 rounded"
                >
                  Execute {func.name}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-semibold my-4 mt-8">Read Functions</h2>
      <div className="space-y-4">
        {readFunctions.map((func, idx) => (
          <div className="bg-blue-100 border border-blue-500 p-4 rounded" key={idx}>
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleFunction(func.name)}
            >
              <span className="text-blue-600 font-medium">{func.name}</span>
              <span className="text-gray-600 text-sm">
                {openFunction === func.name ? "" : func.inputs.map((input) => `${input.name} (${input.type})`).join(", ")}
              </span>
            </div>
            {openFunction === func.name && (
              <div className="mt-3 space-y-3">
                {func.inputs.map((input, i) => (
                  <input
                    key={i}
                    id={`read-${func.name}-${input.name}`}
                    type="text"
                    className="border p-2 w-full rounded"
                    placeholder={`${input.name} (${input.type})`}
                  />
                ))}
                <button
                  onClick={() =>
                    handleReadFunction(
                      func.name,
                      func.inputs.map((input) => document.getElementById(`read-${func.name}-${input.name}`).value)
                    )
                  }
                  className="bg-blue-500 text-white py-2 px-4 rounded"
                >
                  Execute {func.name}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Console Log Section */}
      <div className="console-log mt-10">
        <h2 className="text-2xl font-semibold my-4">Console Log</h2>
        <div className="console-container bg-black text-white p-4 max-h-64 overflow-y-auto rounded">
          {consoleLog.map((log, index) => (
            <div
              key={index}
              className={`console-line ${
                log.type === "error"
                  ? "text-red-500"
                  : log.type === "success"
                  ? "text-green-500"
                  : log.type === "warning"
                  ? "text-yellow-500"
                  : "text-white"
              }`}
            >
              <span className="text-gray-400 mr-2">[{log.timestamp}]</span>
              {log.message}
            </div>
          ))}
          <div ref={consoleEndRef} />
        </div>
      </div>
    </div>
  </div>
);
};

export default Api_builder;



