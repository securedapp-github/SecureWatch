import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { FaCaretDown, FaCopy, FaExternalLinkAlt } from "react-icons/fa";
import { showErrorAlert, showSuccessAlert } from "./toastifyalert";
import { baseUrl } from "../Constants/data";
import NewNavbar from "./NewNavbar";
import Sidebar from "./Sidebar";
import { IoClose } from "react-icons/io5";
import { TbTriangleSquareCircle } from "react-icons/tb";

function Monitor_alerts() {
  const userEmail = localStorage.getItem("email");
  const token = localStorage.getItem("token");
  const location = useLocation();
  const { mid } = location.state;
  const { network } = location.state;
  console.log("transfered mid", mid);
  console.log("Network", network);
  const [alert, setAlert] = useState([]);
  const email = localStorage.getItem("email");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [loading, setLoading] = useState(true);

  const openModal = (alert) => {
    setSelectedAlert(alert);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAlert(null);
  };

  useEffect(() => {
    const fetchAlert = async () => {
      setLoading(true);
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
      setAlert(data);
      setLoading(false);
    };
    fetchAlert();
    console.log("alert", alert);
  }, []);

  if (loading) {
    return (
      <div className=" bg-white">
        <NewNavbar email={userEmail} />
        <div className="text-lg lg:text-3xl font-medium text-black text-center  pt-52">
          <span className="loading loading-spinner loading-lg text-[#2D5C8F]"></span>
        </div>
      </div>
    );
  }
  if (!alert.alerts || alert.alerts.length === 0 || alert === undefined) {
    return (
      <div className=" bg-white">
        <NewNavbar email={userEmail} />
        <div className="bg-white w-full flex h-full ">
          <Sidebar />

          <div className=" h-full sm:flex flex-col gap-5 ml-[100px] w-56 mt-20 hidden fixed">
            <div className={`mt-5 py-3 pl-4 pr-9 rounded-r-full bg-[#6A6A6A1A]`}>
              <h1 className="text-[#6A6A6A]  font-semibold text-nowrap">
                Realtime Security
              </h1>
            </div>
            <div className="flex flex-col gap-5 ml-5">
              <Link to="/dashboard" className="text-[#6A6A6A]">
              Dashboard
              </Link>
              <Link to="/monitor" className="text-[#6A6A6A] ">
              Contract Monitor
              </Link>
              <Link to="/wallet_security" className="text-[#6A6A6A]">
                Wallet Monitor
              </Link>
              {/* <Link to="/log" className="text-[#6A6A6A] ">
                Logs
              </Link> */}
            </div>
          </div>

          <div className="text-lg lg:text-3xl font-medium text-black text-center  pt-52 self-center mx-auto">
            You don't have any monitor alerts.
          </div>
        </div>



      </div>
    );
  }
  // console.log(alert)
  const CopyIcon = ({ onClick }) => (
    <FaCopy onClick={onClick} className="bi bi-clipboard cursor-pointer" />
    // <svg  xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-clipboard cursor-pointer" viewBox="0 0 16 16" style={{ marginLeft: '5px' }}>
    //   <path d="M10.5 0a.5.5 0 0 1 .5.5H11v1h2V.5a.5.5 0 0 1 1 0v1h.5a.5.5 0 0 1 .5.5v13a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5v-13a.5.5 0 0 1 .5-.5H4v-1a.5.5 0 0 1 1 0v1h2v-1a.5.5 0 0 1 .5-.5h3ZM10 1H6v1h4V1ZM4.5 4a.5.5 0 0 0-.5.5v12a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5v-12a.5.5 0 0 0-.5-.5h-7Z"/>
    // </svg>
  );

  // Function to copy text to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        showSuccessAlert("Address copied Successful");
        // alert('Text copied to clipboard');
      })
      .catch((err) => {
        showErrorAlert("Failed to copy");
        // console.error('Failed to copy: ', err);
      });
  };

  return (
    <div className="w-full min-h-full ">
      <NewNavbar email={userEmail} />
      <div className="bg-[#FAFAFA] w-full flex h-full">
        <Sidebar />

        <div className=" h-full sm:flex flex-col gap-5 ml-[100px] w-56 mt-20 hidden fixed">
          <div className={`mt-5 py-3 pl-4 pr-9 rounded-r-full bg-[#6A6A6A1A]`}>
            <h1 className="text-[#6A6A6A]  font-semibold text-nowrap">
              Realtime Security
            </h1>
          </div>
          <div className="flex flex-col gap-5 ml-5">
            <Link to="/dashboard" className="text-[#6A6A6A]">
            Dashboard
            </Link>
            <Link to="/monitor" className="text-[#2D5C8F] font-semibold">
            Contract Monitor
            </Link>
            <Link to="/wallet_security" className="text-[#6A6A6A]">
              Wallet Monitor
            </Link>
            <Link to="/log" className="text-[#6A6A6A] "></Link>
            {/* <Link to="/log" className="text-[#6A6A6A] ">
              Logs
            </Link> */}
          </div>
        </div>

        <div className="pt-20  pb-10 sm:ml-80 w-full px-3 pr-5">
          <div className="text-2xl text-center lg:text-3xl font-bold text-black lg:text-start ml-5 mt-5 mb-5 ">
            Your Monitor Alerts{" "}
          </div>
          <div className="xl:hidden w-[93%] sm:w-[91%] rounded-md shadow-md bg-white mb-10 mx-auto">
            {alert.alerts &&
              alert.alerts.map((alert, index) => {
                const id = alert.id;
                const hash = alert.hash;
                const arguemant = alert.arguments;
                const created_on = alert.created_on;
                const from_address = alert.from_address;
                const to_address = alert.to_address;
                const eid = alert.eid;
                const name = alert.event_name;
                return (
                  <div className="w-full flex p-3 md:p-10 justify-between border-b-2">
                    <div className="flex flex-col gap-2">
                      <span className="  text-[#2D5C8F] font-medium ">
                        <a
                          href={
                            network === 80002
                              ? `https://amoy.polygonscan.com/tx/${hash}`
                              : network === 11155111
                                ? `https://sepolia.etherscan.io/tx/${hash}`
                                : "#"
                          }
                          target="_blank"
                        >
                          {network === 80002
                            ? `https://amoy.poly...${hash.slice(
                              hash.length - 4
                            )}`
                            : network === 11155111
                              ? `https://sepo...${hash.slice(hash.length - 4)}`
                              : "Unknown"}{" "}
                        </a>
                      </span>
                      <p className=" text-black text-nowrap">
                        {created_on.slice(0, 10)} {created_on.slice(11, 16)}
                      </p>
                      <p className="">
                        <span className=" mt-auto text-black">{`${from_address.slice(
                          0,
                          5
                        )}...${from_address.slice(
                          from_address.length - 4
                        )}`}</span>{" "}
                      </p>
                      <p className="">
                        <span className=" mt-auto text-black">{`${to_address.slice(
                          0,
                          5
                        )}...${to_address.slice(to_address.length - 4)}`}</span>
                      </p>
                    </div>

                    <div className=" flex flex-col gap-3 md:gap-5 justify-center items-center">
                      <button
                        onClick={() => openModal(alert)}
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
                    Link
                  </th>
                  <th className="py-4 border-2 border-none text-[#6A6A6A] text-lg font-semibold">
                    Created on
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
                  alert.alerts.map((alert, index) => {
                    const id = alert.id;
                    const hash = alert.hash;
                    const arguemant = alert.arguments;
                    const created_on = alert.created_on;
                    const from_address = alert.from_address;
                    const to_address = alert.to_address;
                    const eid = alert.eid;
                    const name = alert.event_name;
                    return (
                      <tr className="border-gray-400 border-2 border-l-0 border-r-0 last:last:border-0">
                        <td className=" ">
                          <span className="text-lg  text-blue-600 font-medium underline ">
                            <a
                              href={
                                network === 80002
                                  ? `https://amoy.polygonscan.com/tx/${hash}`
                                  : network === 11155111
                                    ? `https://sepolia.etherscan.io/tx/${hash}`
                                    : "#"
                              }
                              target="_blank"
                            >
                              {network === 80002
                                ? `https://amoy.poly...${hash.slice(
                                  hash.length - 4
                                )}`
                                : network === 11155111
                                  ? `https://sepo...${hash.slice(
                                    hash.length - 4
                                  )}`
                                  : "Unknown"}{" "}
                            </a>
                          </span>
                        </td>
                        <td className="  text-[#6A6A6A] text-nowrap text-lg ">
                          {created_on.slice(0, 10)} {created_on.slice(11, 16)}
                        </td>

                        <td className=" ">
                          <span className="text-lg mt-auto text-[#6A6A6A]">{`${from_address.slice(
                            0,
                            5
                          )}...${from_address.slice(
                            from_address.length - 4
                          )}`}</span>{" "}
                        </td>

                        <td className=" ">
                          <span className="text-lg mt-auto text-[#6A6A6A]">{`${to_address.slice(
                            0,
                            5
                          )}...${to_address.slice(
                            to_address.length - 4
                          )}`}</span>
                        </td>

                        <td className=" flex justify-center items-center">
                          <button
                            onClick={() => openModal(alert)}
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
          <div className="fixed inset-0  bg-black bg-opacity-85 flex justify-center items-center z-50">
            <div className="w-full bg-white sm:w-[60%] md:w-[600px] flex flex-col gap-5 p-5 rounded-2xl">

              <div className="bg-[#F2FBF6] flex flex-col gap-2 p-4 rounded-2xl border shadow-lg">
                <div className="bg-[#EBF6EE] border rounded-full w-8 h-8 flex items-center justify-center">
                  <TbTriangleSquareCircle className="text-green-400 text-xl" />
                </div>
                <p className="text-black text-xl font-medium">Alert Details</p>
                <p className="text-slate-600 text-sm font-medium">Event: {selectedAlert.event_name}</p>
              </div>


              <div className=" ">
                <p className="text-slate-700 mb-3 font-medium">From</p>
                <p className="hidden text-sm text-black bg-gray-100  md:flex items-center justify-between px-3 py-2 rounded-xl">{selectedAlert.from_address} <button onClick={() => copyToClipboard(selectedAlert.from_address)}><FaCopy /></button></p>
                <p className="text-sm text-black bg-gray-100 md:hidden flex items-center justify-between px-3 py-2 rounded-xl">{selectedAlert.from_address.slice(0, 5)}
                ....
                {selectedAlert.from_address.slice(
                  selectedAlert.from_address.length - 4
                )} <button onClick={() => copyToClipboard(selectedAlert.from_address)}><FaCopy /></button></p>
                
              </div>
              <div className=" ">
                <p className="text-slate-700 mb-3 font-medium">To</p>
                <p className="hidden text-sm text-black bg-gray-100  md:flex items-center justify-between px-3 py-2 rounded-xl">{selectedAlert.to_address} <button onClick={() => copyToClipboard(selectedAlert.to_address)}><FaCopy /></button></p>
                <p className="text-sm md:hidden text-black bg-gray-100  flex items-center justify-between px-3 py-2 rounded-xl">{selectedAlert.to_address.slice(0, 5)}
                ....
                {selectedAlert.to_address.slice(
                  selectedAlert.to_address.length - 4
                )} <button onClick={() => copyToClipboard(selectedAlert.to_address)}><FaCopy /></button></p>
              </div>


              <div className=" ">
                <p className="text-slate-700 mb-3 font-medium">Created on</p>
                <p className="text-sm text-black bg-gray-100  flex items-center justify-between px-3 py-2 rounded-xl">{selectedAlert.created_on.slice(0, 10)} {selectedAlert.created_on.slice(11, 16)} </p>
              </div>

              <div className=" ">
                <p className="text-slate-700 mb-3 font-medium">Transaction link</p>
                <a
                  className="text-sm text-black bg-gray-100  flex items-center justify-between px-3 py-2 rounded-xl"
                  href={
                    network === 80002
                      ? `https://amoy.polygonscan.com/tx/${selectedAlert.hash}`
                      : network === 11155111
                        ? `https://sepolia.etherscan.io/tx/${selectedAlert.hash}`
                        : "#"
                  }
                  target="_blank"
                >
                  {network === 80002
                    ? `https://amoy.poly...${selectedAlert.hash.slice(selectedAlert.hash.length - 4)}`
                    : network === 11155111
                      ? `https://sepo...${selectedAlert.hash.slice(selectedAlert.hash.length - 4)}`
                      : "Unknown"}<FaExternalLinkAlt />
                </a>
              </div>

              <button
                onClick={closeModal}
                className=" text-sm text-black bg-gray-100   px-3 py-2 rounded-xl w-16 self-end"
              >
                Close
              </button>

            </div>
          </div>
        )}


      </div>
    </div>
  );
}

export default Monitor_alerts;