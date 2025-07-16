import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { baseUrl } from "../Constants/data";
import { FaRegBell } from "react-icons/fa";
import { FaRegTrashAlt } from "react-icons/fa";
import { MdOutlineToggleOn } from "react-icons/md";
import { MdOutlineToggleOff } from "react-icons/md";
import { HiMenuAlt2 } from "react-icons/hi";
import ResponsivePagination from 'react-responsive-pagination';
import 'react-responsive-pagination/themes/classic.css';


const Wallet_Security_Cmp = () => {
  const navigate = useNavigate();
  const [value, setValue] = useState(10);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [moniter, setMoniter] = useState([]);
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  console.log("user id:", userId);
  const is_admin = localStorage.getItem("is_admin");
  const parent_id = localStorage.getItem("parent_id");
  console.log("parent_id:", parent_id);

  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [dataPerPage, setDataPerPage] = useState(15);
  const [totalPages, setTotalPages] = useState(1);

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
      console.log("Data", data);
      // Sort monitors by created_on in descending order (present to past)
      const sortedMonitors = data.monitors?.sort((a, b) => 
        new Date(b.created_on) - new Date(a.created_on)
      );
      setTotalPages(Math.ceil(sortedMonitors?.length / dataPerPage));
      if (res.status === 401) {
        toast.error("Session Expired, Please login again", {
          autoClose: 500,
          onClose: () => {
            localStorage.clear();
            navigate("/login");
          },
        });
      }
      if (res.status === 403) {
        toast.error("Unauthorized Access, Please login again", {
          autoClose: 500,
          onClose: () => {
            localStorage.clear();
            navigate("/login");
          },
        });
      }
      setMoniter({ ...data, monitors: sortedMonitors });
      setLoading(false);
    };
    fetchMoniter();
  }, [value]);
  
  const indexOfLastData = currentPage * dataPerPage;
  const indexOfFirstData = indexOfLastData - dataPerPage;
  const currentData = moniter.monitors?.slice(indexOfFirstData, indexOfLastData);
  console.log("Current Data", currentData);

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
          setValue(value + 1);
          toast.success("Monitor deleted successfully.");
        } else {
          setDeleteLoading(false);
          toast.error("Failed to delete monitor. Please try again.");
        }
      } catch (error) {
        setDeleteLoading(false);
        toast.error("An error occurred. Please try again.");
        console.error("Error deleting monitor:", error);
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
    <div className=" w-full xl:w-[97%] overflow-auto flex justify-center items-center xl:justify-start xl:ml-4 xl:items-start flex-col pb-10 bg-white">
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
          <div className="xl:hidden w-[93%] sm:w-[91%] rounded-md shadow-md  mb-10">
            {currentData.map((i) => {
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
                    {network === 1
    ? "Ethereum Mainnet"
    : network === 56
        ? "Binance Smart Chain"
        : network === 8453
            ? "Base"
            : network === 43114
                ? "Avalanche"
                : network === 42161
                    ? "Arbitrum"
                    : network === 100
                        ? "Gnosis"
                        : network === 59144
                            ? "Linea"
                            : network === 1313161554
                                ? "Aurora"
                                : network === 10
                                    ? "Optimism"
                                    : network === 11155111
                                        ? "Sepolia Testnet"
                                        : network === 137
                                            ? "Polygon Mainnet"
                                            : network === 80002
                                                ? "Amoy"
                                                : network === 204
                                                    ? "opBNB"
                                                    : network === 1101
                                                        ? "Polygon zkEVM"
                                                        : network === 250
                                                            ? "Fantom"
                                                            : network === 25
                                                                ? "Cronos"
                                                                : network === 592
                                                                    ? "Astar"
                                                                    : network === 42220
                                                                        ? "Celo"
                                                                        : network === 324
                                                                            ? "ZkSync Era"
                                                                            : network === 288
                                                                                ? "Boba Network"
                                                                                : network === 534352
                                                                                    ? "Scroll"
                                                                                    : network === 2040
                                                                                        ? "Vanar"
                                                                                        : network === 143
                                                                                            ? "Monad"
                                                                                            : network === 50
                                                                                                ? "XDC Network"
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
                  <div className="flex flex-col gap-3 md:gap-5 justify-center items-center">
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

                    {is_admin == 1 ? (
                      status === 1 ? (
                        <button
                          className="text-black text-3xl"
                          onClick={() => {
                            fetch(`${baseUrl}/update_wallet_monitor`, {
                              method: "POST",
                              headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`,
                              },
                              body: JSON.stringify({
                                monitor_id: mid,
                                status: 0,
                              }),
                            })
                              .then((response) => response.json())
                              .then((data) => {
                                console.log("Success:", data);
                                setValue(value + 1);
                              })
                              .catch((error) => {
                                console.error("Error:", error);
                              });
                          }}
                        >
                          <MdOutlineToggleOn />
                        </button>
                      ) : (
                        <button
                          className="text-black text-3xl"
                          onClick={() => {
                            fetch(`${baseUrl}/update_wallet_monitor`, {
                              method: "POST",
                              headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`,
                              },
                              body: JSON.stringify({
                                monitor_id: mid,
                                status: 1,
                              }),
                            })
                              .then((response) => response.json())
                              .then((data) => {
                                console.log("Success:", data);
                                setValue(value + 1);
                              })
                              .catch((error) => {
                                console.error("Error:", error);
                              });
                          }}
                        >
                          <MdOutlineToggleOff />
                        </button>
                      )
                    ) : null}
                  </div>

                </div>
              );
            })}
          </div>

          <div className="overflow-x-auto w-[85%] rounded-md  custom-scrollbar bg-white hidden xl:block border-2 border-gray-400 mt-5">
            <table className="rounded-md overflow-hidden shadow-4xl shadow-[#303030F7] table  ">
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
                    Address
                  </th>
                  <th className=" text-black text-sm font-medium flex items-center ml-16 gap-12">
                    Actions <HiMenuAlt2 className="text-lg" />
                  </th>

                </tr>
              </thead>
              <tbody>
                {currentData.map((i) => {
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
                    <tr className="border-gray-400 border-2 border-l-0 border-r-0 last:border-b-0">
                      <td className=" ">
                        <span className="text-md  text-black">{name}</span>
                      </td>

                      <td className=" ">
                        <span className="text-md  text-black">
                          {network === 1
    ? "Ethereum Mainnet"
    : network === 56
        ? "Binance Smart Chain"
        : network === 8453
            ? "Base"
            : network === 43114
                ? "Avalanche"
                : network === 42161
                    ? "Arbitrum"
                    : network === 100
                        ? "Gnosis"
                        : network === 59144
                            ? "Linea"
                            : network === 1313161554
                                ? "Aurora"
                                : network === 10
                                    ? "Optimism"
                                    : network === 11155111
                                        ? "Sepolia Testnet"
                                        : network === 137
                                            ? "Polygon Mainnet"
                                            : network === 80002
                                                ? "Amoy"
                                                : network === 204
                                                    ? "opBNB"
                                                    : network === 1101
                                                        ? "Polygon zkEVM"
                                                        : network === 250
                                                            ? "Fantom"
                                                            : network === 25
                                                                ? "Cronos"
                                                                : network === 592
                                                                    ? "Astar"
                                                                    : network === 42220
                                                                        ? "Celo"
                                                                        : network === 324
                                                                            ? "ZkSync Era"
                                                                            : network === 288
                                                                                ? "Boba Network"
                                                                                : network === 534352
                                                                                    ? "Scroll"
                                                                                    : network === 2040
                                                                                        ? "Vanar"
                                                                                        : network === 143
                                                                                            ? "Monad"
                                                                                            : network === 50
                                                                                                ? "XDC Network"
                                                                                                : "Unknown"}
                        </span>
                      </td>

                      <td className=" text-md text-black text-nowrap">
                        {created_on?.slice(0, 10)}
                      </td>

                      <td className="text-black">
                        {address ? `${address.slice(0, 5)}...${address.slice(-4)}` : ""}
                      </td>

                      <td className="mx-14 flex gap-8 items-center py-4">
                        <button
                          className=" text-black text-lg tooltip"
                          data-tip="Alerts"
                          onClick={() => {
                            navigate("/wallet_monitor_alerts", {
                              state: { mid, network },
                            });
                          }}
                        >
                          <FaRegBell />
                        </button>

                        {is_admin == 1 && (
                          <button className=" tooltip" data-tip="Delete" onClick={() => handleDeleteMonitor(mid)}>
                            <FaRegTrashAlt className="text-black text-lg " />
                          </button>
                        )}

                        {is_admin == 1 ? (
                          status === 1 ? (
                            <button
                              className="text-[#12D576] text-3xl"
                              onClick={() => {
                                fetch(`${baseUrl}/update_wallet_monitor`, {
                                  method: "POST",
                                  headers: {
                                    "Content-Type": "application/json",
                                    Authorization: `Bearer ${token}`,
                                  },
                                  body: JSON.stringify({
                                    monitor_id: mid,
                                    status: 0,
                                  }),
                                })
                                  .then((response) => response.json())
                                  .then((data) => {
                                    console.log("Success:", data);
                                    setValue(value + 1);
                                  })
                                  .catch((error) => {
                                    console.error("Error:", error);
                                  });
                              }}
                            >
                              <MdOutlineToggleOn />
                            </button>
                          ) : (
                            <button
                              className="text-black text-3xl"
                              onClick={() => {
                                fetch(`${baseUrl}/update_wallet_monitor`, {
                                  method: "POST",
                                  headers: {
                                    "Content-Type": "application/json",
                                    Authorization: `Bearer ${token}`,
                                  },
                                  body: JSON.stringify({
                                    monitor_id: mid,
                                    status: 1,
                                  }),
                                })
                                  .then((response) => response.json())
                                  .then((data) => {
                                    console.log("Success:", data);
                                    setValue(value + 1);
                                  })
                                  .catch((error) => {
                                    console.error("Error:", error);
                                  });
                              }}
                            >
                              <MdOutlineToggleOff />
                            </button>
                          )
                        ) : null}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <div className="w-full mt-10 mx-auto flex justify-center items-center">
        <ResponsivePagination
          current={currentPage}
          total={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default Wallet_Security_Cmp;
