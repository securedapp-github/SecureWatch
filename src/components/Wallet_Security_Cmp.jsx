import React, { useState, useEffect } from "react";
import { Switch } from "@headlessui/react";
import { useNavigate } from "react-router-dom";
import { FaCopy } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import { baseUrl } from "../Constants/data";
import { FaRegEdit } from "react-icons/fa";
import { BsTrash } from "react-icons/bs";
import { FaRegBell } from "react-icons/fa";
import { LuPencil } from "react-icons/lu";
import { FaRegTrashAlt } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { MdOutlineToggleOn } from "react-icons/md";
import { MdOutlineToggleOff } from "react-icons/md";
import { HiMenuAlt2 } from "react-icons/hi";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

const Wallet_Security_Cmp = () => {
  const navigate = useNavigate();
  const [value, setValue] = useState(10);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [moniter, setMoniter] = useState([]);
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const is_admin = localStorage.getItem("is_admin");
  const parent_id = localStorage.getItem("parent_id");

  useEffect(() => {
    setLoading(true);
    const fetchMoniter = async () => {
      setLoading(true);
      const res = await fetch(`${baseUrl}/get_wallet_monitor`, {
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
      setLoading(false);
    };
    fetchMoniter();
  }, [value]);

  const handleDeleteMonitor = async (monitor_id) => {
    setDeleteLoading(true);
    if (window.confirm("Are you sure you want to delete this monitor?")) {
      try {
        const response = await fetch(`${baseUrl}/delete_wallet_monitor`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            monitor_id: monitor_id,
          }),
        });

        if (response.ok) {
          setDeleteLoading(false);
          setValue(value + 1); // Trigger re-fetch after deletion
          toast.success("Monitor deleted successfully.");
          // alert("Monitor deleted successfully.");
        } else {
          setDeleteLoading(false);
          toast.error("Failed to delete monitor. Please try again.");
          // alert("Failed to delete monitor. Please try again.");
        }
      } catch (error) {
        setDeleteLoading(false);
        toast.error("An error occurred. Please try again.");
        console.error("Error deleting monitor:", error);
        // alert("An error occurred. Please try again.");
      }
    }
  };

  useEffect(() => {
    console.log("Wallet Monitors", moniter);
  }, [moniter]);

  if (loading) {
    return (
      <div className="text-center mt-20 text-4xl font-medium text-black">
        <span className="loading loading-spinner loading-lg text-[#2D5C8F]"></span>
      </div>
    );
  }
  if (
    (loading === false && !moniter) ||
    !Array.isArray(moniter.monitors) ||
    moniter.monitors.length === 0
  ) {
    return (
      <div className="text-center mt-20 text-4xl font-medium text-black">
        Please create a monitor.
      </div>
    );
  }

  return (
    <div className=" w-full xl:w-[97%] overflow-auto flex justify-center items-center xl:justify-start xl:ml-4 xl:items-start flex-col pb-10">
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
      {loading ? (
        <div className="text-center mt-20 text-4xl font-medium">
          <span className="loading loading-spinner loading-lg text-[#2D5C8F]"></span>
        </div>
      ) : (
        <div className="w-full flex justify-center items-center">
          <div className="xl:hidden w-[93%] sm:w-[91%] rounded-md shadow-md bg-white mb-10">
            {moniter.monitors.map((i) => {
              const name = i.name;
              const risk = i.category;
              const network = i.network;
              const status = i.status;
              const mid = i.mid;
              const created_on = i.created_on;
              const address = i.address;
              const alert_data = i.alert_data;
              const alert_type = i.alert_type;
              return (
                <div className="w-full flex p-3 md:p-10 justify-between border-b-2">
                  <div className="flex flex-col gap-3">
                    <span className="text-md  text-black">{name}</span>
                    <span className="text-md  text-black">
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
                        ? "Algorand Testnet"
                        : "Unknown"}
                    </span>
                    <p className=" text-md text-black text-nowrap">
                      {created_on?.slice(0, 10)}
                    </p>

                    <p className="  text-black">{created_on?.slice(11, 16)}</p>
                    {/* <p className="text-[#2D5C8F] ">
                {`${address?.slice(0, 5)}...${address?.slice(
                  address.length - 4
                )}`}
              </p> */}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="overflow-x-auto w-full rounded-md  custom-scrollbar bg-white hidden xl:block">
            <table className="w-[65%] rounded-md overflow-hidden shadow-4xl shadow-[#303030F7] table  ">
              <thead>
                <tr className="">
                  <th className=" text-black text-sm font-medium">
                    Name
                  </th>
                  <th className=" text-black text-sm font-medium">
                    Networks
                  </th>
                  <th className=" text-black text-sm font-medium">
                    Created on
                  </th>
                  <th className=" text-black text-sm font-medium">
                    Time
                  </th>
                  <th className=" text-black text-sm font-medium flex items-center gap-16">
                    Actions <HiMenuAlt2 className="text-lg" />
                  </th>

                </tr>
              </thead>
              <tbody>
                {moniter.monitors.map((i) => {
                  const name = i.name;
                  const risk = i.category;
                  const network = i.network;
                  const status = i.status;
                  const mid = i.mid;
                  const created_on = i.created_on;
                  const address = i.address;
                  const alert_data = i.alert_data;
                  const alert_type = i.alert_type;
                  return (
                    <tr className="border-gray-400 border-2 border-l-0 border-r-0 ">
                      <td className=" ">
                        <span className="text-md  text-black">{name}</span>
                      </td>

                      <td className=" ">
                        <span className="text-md  text-black">
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
                            ? "Algorand Testnet"
                            : "Unknown"}
                        </span>
                      </td>

                      <td className=" text-md text-black text-nowrap">
                        {created_on?.slice(0, 10)}
                      </td>

                      <td className="  text-black">
                        {created_on?.slice(11, 16)}
                      </td>

                      <td className="mx-14 flex gap-8 items-center py-4">
                        <button
                          className=" text-black text-lg"
                          onClick={() => {
                            navigate("/wallet_monitor_alerts", {
                              state: { mid, network },
                            });
                          }}
                        >
                          <FaRegBell />
                        </button>

                        {is_admin == 1 && (
                          <button onClick={() => handleDeleteMonitor(mid)}>
                            <FaRegTrashAlt className="text-black text-lg" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wallet_Security_Cmp;
