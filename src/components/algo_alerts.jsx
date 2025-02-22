import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { FaCaretDown, FaCopy } from "react-icons/fa";
import { showErrorAlert, showSuccessAlert } from "./toastifyalert";
import { baseUrl } from "../Constants/data";
import NewNavbar from "./NewNavbar";
import Sidebar from "./Sidebar";
import { IoClose } from "react-icons/io5";

function Algo_alerts() {
  const userEmail = localStorage.getItem("email");
  const token = localStorage.getItem("token");
  const location = useLocation();
  const { mid } = location.state;
  const { network } = location.state;
  const [alert, setAlert] = useState([]);
  const email = localStorage.getItem("email");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);

  const openModal = (alertItem) => {
    setSelectedAlert(alertItem);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAlert(null);
  };

  let networkname;
  if (network === 1300) {
    networkname = "Algorand Mainnet";
  } else {
    networkname = "Algorand Testnet";
  }
  useEffect(
  ()=>{
    console.log("Selected Alert:",selectedAlert);
    
  },[selectedAlert]
  )
  useEffect(() => {
    const fetchAlert = async () => {
      const res = await fetch(`${baseUrl}/get_alerts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          mid: mid,
        }),
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
        <NewNavbar email={userEmail} />
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
    navigator.clipboard
      .writeText(text)
      .then(() => {
        showSuccessAlert("Address copied Successfully");
      })
      .catch((err) => {
        showErrorAlert("Failed to copy");
      });
  };

  return (
    <div className="w-full min-h-full bg-[#FAFAFA]">
      <NewNavbar email={userEmail} />
      <div className=" w-full flex h-full">
        <Sidebar />

        <div className=" h-full sm:flex flex-col gap-5 ml-[100px] w-56 mt-20 hidden fixed">
          <div className={`mt-5 py-3 pl-4 pr-9 rounded-r-full bg-[#6A6A6A1A]`}>
            <h1 className="text-[#6A6A6A]  font-semibold text-nowrap">
              Realtime Security
            </h1>
          </div>
          <div className="flex flex-col gap-5 ml-5">
            <Link to="/dashboard" className="text-[#6A6A6A]">
              Overview
            </Link>
            <Link to="/monitor" className="text-[#2D5C8F] font-semibold">
              Monitor
            </Link>
            <Link to="/log" className="text-[#6A6A6A] ">
              Logs
            </Link>
          </div>
        </div>
        <div className="pt-20  pb-10 sm:ml-80 w-full px-3 pr-5">
          <div className="text-2xl text-center lg:text-3xl font-bold text-black lg:text-start ml-5 mt-5 mb-5">
            Your Monitor Alerts
          </div>

          <div className="xl:hidden w-[93%] sm:w-[91%] rounded-md shadow-md bg-white mb-10 mx-auto">
            {alert.alerts &&
              alert.alerts.map((alertItem, index) => {
                const {
                  id,
                  hash, // Use hash for link
                  created_on,
                  alldata,
                  event_name,
                } = alertItem;

                const txnHash = hash || null; // Use the hash directly for the link
                const group = alldata?.group || null; // Group ID
                const sender = alldata?.sender || "N/A";
                const receiver =
                  alldata?.["asset-transfer-transaction"]?.receiver || "N/A"; // Receiver address
                const amount =
                  alldata?.["asset-transfer-transaction"]?.amount || "N/A"; // Transferred value (amount)
                const fee = alldata?.fee || "N/A"; // Fee

                // Log the transaction and group IDs for debugging
                console.log(`Transaction Hash: ${txnHash}, Group ID: ${group}`);

                // Determine the URL for the transaction or group transaction
                // const transactionLink = group
                //   ? `https://allo.info/tx/group/${encodeURIComponent(group)}`
                //   : txnHash
                //   ? `https://allo.info/tx/${txnHash}`
                //   : null; // No link available if neither is present
                const transactionLink = group
                  ? `https://allo.info/tx/group/${encodeURIComponent(group)}` // No change for grouped transactions
                  : txnHash
                  ? network === 1301
                    ? `https://lora.algokit.io/testnet/transaction/${txnHash}` // Use DappFlow for Testnet
                    : `https://lora.algokit.io/mainnet/transaction/${txnHash}` // Use allo.info for Mainnet
                  : null; // No link available if neither is present

                return (
                  <div className="w-full flex p-3 md:p-10 justify-between border-b-2">
                    <div className="flex flex-col gap-2">
                      {transactionLink ? (
                        <span className="text-lg text-blue-600 font-medium underline">
                          <a
                            href={transactionLink}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {txnHash
                              ? txnHash.slice(0, 5) +
                                "..." +
                                txnHash.slice(txnHash.length - 4)
                              : "Group Txn"}
                          </a>
                        </span>
                      ) : (
                        <span className="text-lg text-gray-600">
                          No Link Available
                        </span>
                      )}
                      <p className=" text-black text-nowrap">
                        {new Date(created_on).toLocaleString()}
                      </p>
                      <p className="">
                        <span className=" mt-auto text-black">{`${sender.slice(
                          0,
                          5
                        )}...${sender.slice(sender.length - 4)}`}</span>{" "}
                      </p>
                      <p className="">
                        <span className=" mt-auto text-black">{`${receiver.slice(
                          0,
                          5
                        )}...${receiver.slice(receiver.length - 4)}`}</span>
                      </p>
                    </div>

                    <div className=" flex flex-col gap-3 md:gap-5 justify-center items-center">
                      <button
                        onClick={() => openModal(alertItem)}
                        className=" text-md font-semibold  border-0 rounded-lg bg-[#2D5C8F] px-2 py-1 text-white"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>

        
          <div className="overflow-x-auto rounded-md border-2 border-gray-400 custom-scrollbar bg-white hidden xl:block mt-5 shadow-xl">
            <table className="min-w-full rounded-md overflow-hidden shadow-4xl shadow-[#303030F7] table border-gray-400 ">
              <thead>
                <tr className="">
                  <th className="py-4 border-2 border-none text-[#6A6A6A] text-lg font-semibold">
                    Txn Hash
                  </th>
                  <th className="py-4 border-2 border-none text-[#6A6A6A] text-lg font-semibold">
                    Created On
                  </th>
                  <th className="py-4 border-2 border-none text-[#6A6A6A] text-lg font-semibold">
                    From
                  </th>
                  <th className="py-4 border-2 border-none text-[#6A6A6A] text-lg font-semibold">
                    To
                  </th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {alert.alerts &&
                  alert.alerts.map((alertItem, index) => {
                    const {
                      id,
                      hash, // Use hash for link
                      created_on,
                      alldata,
                      event_name,
                    } = alertItem;

                    const txnHash = hash || null; // Use the hash directly for the link
                    const group = alldata?.group || null; // Group ID
                    const sender = alldata?.sender || "N/A";
                    const receiver =
                      alldata?.["asset-transfer-transaction"]?.receiver ||
                      "N/A"; // Receiver address
                    const amount =
                      alldata?.["asset-transfer-transaction"]?.amount || "N/A"; // Transferred value (amount)
                    const fee = alldata?.fee || "N/A"; // Fee

                    // Log the transaction and group IDs for debugging
                    console.log(
                      `Transaction Hash: ${txnHash}, Group ID: ${group}`
                    );

                    // Determine the URL for the transaction or group transaction
                    // const transactionLink = group
                    //   ? `https://allo.info/tx/group/${encodeURIComponent(group)}`
                    //   : txnHash
                    //   ? `https://allo.info/tx/${txnHash}`
                    //   : null; // No link available if neither is present
                    const transactionLink = group
                      ? `https://allo.info/tx/group/${encodeURIComponent(
                          group
                        )}` // No change for grouped transactions
                      : txnHash
                      ? network === 1301
                        ? `https://lora.algokit.io/testnet/transaction/${txnHash}` // Use DappFlow for Testnet
                        : `https://lora.algokit.io/mainnet/transaction/${txnHash}` // Use allo.info for Mainnet
                      : null; // No link available if neither is present

                    return (
                      <tr className="border-gray-400 border-2 border-l-0 border-r-0 last:last:border-0">
                        <td>
                          {transactionLink ? (
                            <span className="text-lg text-blue-600 font-medium underline">
                              <a
                                href={transactionLink}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {txnHash
                                  ? txnHash.slice(0, 5) +
                                    "..." +
                                    txnHash.slice(txnHash.length - 4)
                                  : "Group Txn"}
                              </a>
                            </span>
                          ) : (
                            <span className="text-lg text-gray-600">
                              No Link Available
                            </span>
                          )}
                        </td>
                        <td className="text-[#6A6A6A] text-lg">
                          {new Date(created_on).toLocaleString()}
                        </td>
                        <td className="">
                          <span className="text-lg text-[#6A6A6A]">
                            {`${sender.slice(0, 5)}...${sender.slice(
                              sender.length - 4
                            )}`}
                          </span>
                        </td>
                        <td className="">
                          <span className="text-lg text-[#6A6A6A]">
                            {`${receiver.slice(0, 5)}...${receiver.slice(
                              receiver.length - 4
                            )}`}
                          </span>
                        </td>
                        <td className=" flex justify-center items-center">
                          <button
                            onClick={() => openModal(alertItem)}
                            className=" text-md font-semibold  border-0 rounded-lg bg-[#2D5C8F] px-3 py-1 text-white"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>

        {isModalOpen && selectedAlert && (
  <div className="fixed inset-0 bg-black bg-opacity-85 flex justify-center items-center z-50">
    <div className="bg-white  p-6 pt-0 w-[95%] sm:w-[600px] relative">
      <button
        onClick={closeModal}
        className="p-1 bg-[#2D5C8F] absolute top-0 right-0"
      >
        <IoClose className=" text-3xl  text-white   " />
      </button>
      <h2 className="text-lg font-bold mb-4 mt-4 text-black">
        Alert Details
      </h2>
      
      <p className="sm:flex gap-2 items-center text-wrap hidden text-black">
                <strong>From:</strong> {selectedAlert.sender}{" "}
                <span>
                  <CopyIcon
                    onClick={() => copyToClipboard(selectedAlert.sender)}
                  />
                </span>
              </p>
              <p className="flex gap-2 items-center text-wrap sm:hidden text-black">
                <strong>From:</strong> {selectedAlert.sender}
                ...$
                {selectedAlert.sender}
                <span>
                  <CopyIcon
                    onClick={() => copyToClipboard(selectedAlert.sender)}
                  />
                </span>
              </p>
              <p className="sm:flex gap-2 items-center text-wrap hidden text-black">
                <strong>To:</strong> {selectedAlert.receiver}{" "}
                <span>
                  <CopyIcon
                    onClick={() => copyToClipboard(selectedAlert.receiver)}
                  />
                </span>
              </p>
              <p className="flex gap-2 items-center text-wrap sm:hidden text-black">
                <strong>From:</strong> {selectedAlert.receiver}
                <span>
                  <CopyIcon
                    onClick={() => copyToClipboard(selectedAlert.receiver)}
                  />
                </span>
              </p>
              <p className="text-black">
                <strong>Created On:</strong>{" "}
                {new Date(selectedAlert.created_on).toLocaleString()}
        
              </p>

              <p className="text-black">
                <strong>Link:</strong>{" "}
                {selectedAlert.transactionLink ? (
                            <span className="text-lg text-blue-600 font-medium underline">
                              <a
                                href={selectedAlert.transactionLink}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {selectedAlert.txnHash
                                  ? selectedAlert.txnHash.slice(0, 5) +
                                    "..." +
                                    selectedAlert.txnHash.slice(selectedAlert.txnHash.length - 4)
                                  : "Group Txn"}
                              </a>
                            </span>
                          ) : (
                            <span className="text-lg text-gray-600">
                              No Link Available
                            </span>
                          )}
              </p>
    </div>
  </div>
)}



      </div>
    </div>
  );
}

export default Algo_alerts;
