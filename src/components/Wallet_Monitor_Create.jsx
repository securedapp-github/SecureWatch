import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import NewNavbar from "./NewNavbar";
import Sidebar from "./Sidebar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoMdCheckmarkCircle } from "react-icons/io";

function Monitor_create() {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("email");
  const parent_id = localStorage.getItem("parent_id");
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const [monitorName, setMonitorName] = useState("");
  const [network, setNetwork] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!monitorName || !network || !address || !email) {
      toast.error("All fields are required!");
      return;
    }

    // Email Validation
    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    const requestBody = {
      user_id: parent_id != 0 ? parseInt(parent_id) : parseInt(userId),
      name: monitorName,
      network: network,
      address: address,
      mail: email,
    };

    try {
      const response = await fetch(
        "https://139-59-5-56.nip.io:3443/add_wallet_monitor",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestBody),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMonitorName("");
        setNetwork("");
        setAddress("");
        setEmail("");
        toast.success("Wallet Monitor Created Successfully!", {
          autoClose: 1000,
          onClose: () => {
            navigate("/wallet_security");
          },
        });
      } else {
        toast.error(data.message || "Failed to create wallet monitor.");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }
  };
  return (
    <div className="w-full h-full">
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
      <NewNavbar email={userEmail} />
      <div className="bg-[#FAFAFA] w-full flex min-h-full">
        <Sidebar />

        <div className=" h-full lg:flex flex-col gap-5 ml-[100px] hidden lg:mt-20 fixed ">
          <div className={`mt-5 py-3 pl-4 pr-9 rounded-r-full bg-[#6A6A6A1A]`}>
            <h1 className="text-[#6A6A6A]  font-semibold text-nowrap">
              Realtime Security
            </h1>
          </div>
          <div className="flex flex-col gap-5 ml-5">
            <Link to="/dashboard" className="text-[#6A6A6A]">
            Dashboard
            </Link>
            <Link to="/monitor" className="text-[#6A6A6A]">
            Contract Monitor
            </Link>
            <Link to="/wallet_security" className="text-[#6A6A6A]">
              Wallet Monitor
            </Link>
            {/* <Link to="/log" className="text-[#6A6A6A]">
              Logs
            </Link> */}
          </div>
        </div>

        <div className="mt-24 w-full sm:ml-28  lg:ml-72 flex justify-start flex-col md:flex-row md:gap-10 lg:gap-20 px-4">
          <div className="w-full lg:w-1/4 ">
            <Link to="/wallet_security">
              <div className="flex">
                <div>
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clip-path="url(#clip0_173_1147)">
                      <path
                        d="M22.6223 15.9674H9.3152"
                        stroke="#7D7D7D"
                        stroke-width="1.88191"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M15.9688 22.621L9.3152 15.9674L15.9688 9.31387"
                        stroke="#7D7D7D"
                        stroke-width="1.88191"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_173_1147">
                        <rect
                          width="22.5829"
                          height="22.5829"
                          fill="white"
                          transform="translate(15.9688 31.9368) rotate(-135)"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                </div>
                <div
                  className="text-base text-[#7D7D7D] my-auto"
                  style={{ color: "black" }}
                >
                  Back to Wallet Monitors
                </div>
              </div>
            </Link>
            <div
              className="text-3xl font-medium mt-3"
              style={{ color: "black" }}
            >
              Create Wallet Monitor
            </div>

            <div
              className="mt-5 hidden sm:flex gap-2 px-4 py-3 rounded-sm bg-white"
              style={{ border: "1px solid #2D5C8F" }}
            >
              <div className="my-auto" style={{ color: "black" }}>
                General Information
              </div>
              <div className="my-auto ml-auto">
                <IoMdCheckmarkCircle className="text-2xl text-[#2D5C8F]" />
              </div>
            </div>
            <div className="sm:hidden flex gap-2 items-center justify-around mt-5  w-full">
              <div className=" flex gap-1 items-center ">
                <IoMdCheckmarkCircle className="text-3xl text-[#2D5C8F]" />
                <p className="text-black">
                  General <br /> Information
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 lg:mt-0 w-full lg:w-1/2 pb-20">
            <form
              onSubmit={handleSubmit}
              className="bg-white sm:bg-inherit sm:p-0 sm:px-0 sm:rounded-none sm:border-0 p-2 px-3 rounded-md border-2"
            >
              <label className="text-lg font-medium text-black">
                Monitor Name
              </label>
              <input
                type="text"
                value={monitorName}
                onChange={(e) => setMonitorName(e.target.value)}
                placeholder="Enter monitor name"
                className="outline-none border-2 py-3 rounded-xl w-full px-3 bg-white mt-1"
              />

              <label className="text-lg font-medium text-black mt-5 block">
                Network
              </label>
              <select
                value={network}
                onChange={(e) => setNetwork(e.target.value)}
                className="outline-none border-2 py-3 rounded-md w-full px-3 bg-white"
              >
                <option value="" disabled hidden>
                  Select a network
                </option>
                <option value="1">Ethereum Mainnet</option>
                <option value="11155111">Sepolia Testnet</option>
                <option value="137">Polygon Mainnet</option>
                <option value="56">Binance Smart Chain</option>
                <option value="8453">Base</option>
                <option value="43114">Avalanche</option>
                <option value="42161">Arbitrum</option>
                <option value="100">Gnosis</option>
                <option value="59144">Linea</option>
                <option value="1313161554">Aurora</option>
                <option value="10">Optimism</option>
                <option value="80002">Amoy</option>
                <option value="1300">Algorand Mainnet</option>
                <option value="1301">Algorand Testnet</option>
              </select>

              <label className="text-lg font-medium text-black mt-5 block">
                Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter address (0x.......)"
                className="outline-none border-2 py-3 rounded-xl w-full px-3 bg-white mt-1"
              />

              <label className="text-lg font-medium text-black mt-5 block">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
                className="outline-none border-2 py-3 rounded-xl w-full px-3 bg-white mt-1"
              />

              <div className="text-center w-full">
                <button
                  type="submit"
                  className="mt-6 px-6 py-3 w-full bg-[#2D5C8F] text-white rounded-lg"
                >
                  Create Monitor
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Monitor_create;
