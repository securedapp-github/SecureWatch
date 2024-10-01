import React, { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import Navbar from "./navbar2";
import { FaCaretDown, FaCopy } from 'react-icons/fa';
import { showErrorAlert, showSuccessAlert } from "./toastifyalert";
import { baseUrl } from "../Constants/data";

function Algo_alerts() {
  const token = localStorage.getItem("token");
  const location = useLocation();
  const { mid } = location.state;
  const { network } = location.state;
  const [alert, setAlert] = useState([]);
  const email = localStorage.getItem("email");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDiv, setActiveDiv] = useState(null);
  
  let networkname;
  if(network===1300){
    networkname="Algorand Mainnet" 
  }
  else{
    networkname = "Algorand Testnet"
  }
  useEffect(() => {
    const fetchAlert = async () => {
      const res = await fetch(`${baseUrl}/get_alerts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          "mid": mid
        })
      });
      const data = await res.json();
      console.log("API Data:", data); // Log the API data for debugging
      setAlert(data);
    };
    fetchAlert();
  }, [mid, token]);

  if (!alert.alerts || alert.alerts.length === 0 || alert === undefined) {
    return (
      <div className="pt-10 bg-white">
        <Navbar email={email} />
        <div className="text-lg lg:text-3xl font-medium text-black text-center mt-20">
          You don't have any monitor alerts.
        </div>
      </div>
    );
  }

  const CopyIcon = ({ onClick }) => (
    <FaCopy onClick={onClick} className="bi bi-clipboard cursor-pointer" />
  );

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      showSuccessAlert("Address copied Successfully");
    }).catch(err => {
      showErrorAlert("Failed to copy");
    });
  };

  return (
    <div className="pt-10 bg-white pb-10">
      <Navbar email={email} />
      <div className="text-lg lg:text-3xl font-medium text-black text-center mt-10">
        Your Monitor Alerts
      </div>

      <div>
        {alert.alerts && alert.alerts.map((alertItem, index) => {
          const {
            id,
            hash, // Use hash for link
            created_on,
            alldata,
            event_name
          } = alertItem;

          const txnHash = hash || null; // Use the hash directly for the link
          const group = alldata?.group || null; // Group ID
          const sender = alldata?.sender || "N/A";
          const receiver = alldata?.['asset-transfer-transaction']?.receiver || "N/A"; // Receiver address
          const amount = alldata?.['asset-transfer-transaction']?.amount || "N/A"; // Transferred value (amount)
          const fee = alldata?.fee || "N/A"; // Fee

          // Log the transaction and group IDs for debugging
          console.log(`Transaction Hash: ${txnHash}, Group ID: ${group}`);

          // Determine the URL for the transaction or group transaction
          const transactionLink = group
            ? `https://allo.info/tx/group/${encodeURIComponent(group)}`
            : txnHash
            ? `https://allo.info/tx/${txnHash}`
            : null; // No link available if neither is present

          return (
            <div key={index} className="w-[95%] lg:w-4/6 mx-auto flex flex-col mb-14 mt-10">
              <div className="overflow-x-auto rounded-lg border-2 border-gray-400 custom-scrollbar">
                <table className="min-w-full rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="px-4 py-2 border-2 border-gray-300 text-black">Txn Hash:</th>
                      <th className="px-4 py-2 border-2 border-gray-300 text-black">Created On:</th>
                      <th className="px-4 py-2 border-2 border-gray-300 text-black">From (Sender):</th>
                      <th className="px-4 py-2 border-2 border-gray-300 text-black">To (Receiver):</th>
                      <th className="px-4 py-2 border-2 border-gray-300 text-black">More Details:</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-4 py-2 border-2 border-gray-300">
                        {transactionLink ? (
                          <span className="text-lg text-green-600 font-medium">
                            <a href={transactionLink} target="_blank" rel="noopener noreferrer">
                              {txnHash ? txnHash.slice(0, 5) + "..." + txnHash.slice(txnHash.length - 4) : "Group Txn"}
                            </a>
                          </span>
                        ) : (
                          <span className="text-lg text-gray-600">No Link Available</span>
                        )}
                      </td>
                      <td className="px-4 py-2 border-2 border-gray-300">{new Date(created_on).toLocaleString()}</td>
                      <td className="px-4 py-2 border-2 border-gray-300">
                        <span className="text-lg text-black">
                          {`${sender.slice(0, 5)}...${sender.slice(sender.length - 4)}`}
                        </span>
                      </td>
                      <td className="px-4 py-2 border-2 border-gray-300">
                        <span className="text-lg text-black">
                          {`${receiver.slice(0, 5)}...${receiver.slice(receiver.length - 4)}`}
                        </span>
                      </td>
                      <td className="border-b-2 border-gray-300 flex justify-center items-center">
                        <button onClick={() => setActiveDiv(activeDiv === index ? null : index)} className="flex relative gap-2 items-center justify-center text-lg font-semibold text-black w-full h-12 border-0 rounded-lg">
                          View <FaCaretDown />
                        </button>
                      </td>
                    </tr>
                    {activeDiv === index && (
                      <tr>
                        <td colSpan="5">
                          <div className="flex gap-1 flex-col mt-3 ml-3">
                          <div className="text-lg font-semibold text-gray-500">Network: {networkname}</div>
                            <div className="text-lg font-semibold text-gray-500">Event: {event_name}</div>
                            <div className="text-lg font-semibold text-gray-500 flex gap-1">
                              Sender: <span className="flex justify-center items-center gap-3">
                                <span className="text-lg text-[#7D7D7D] line-clamp-5">{sender}</span>
                                <CopyIcon onClick={() => copyToClipboard(sender)} />
                              </span>
                            </div>
                            <div className="text-lg font-semibold text-gray-500 flex gap-1">
                              Receiver: <span className="flex justify-center items-center gap-3">
                                <span className="text-lg text-[#7D7D7D] line-clamp-5">{receiver}</span>
                                <CopyIcon onClick={() => copyToClipboard(receiver)} />
                              </span>
                            </div>
                            <div className="text-lg font-semibold text-gray-500">Amount: {amount}</div>
                           
                            <div className="text-lg font-semibold text-gray-500">Fee: {fee}</div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Algo_alerts;