import React, { useState, useEffect } from "react";
import { Switch } from "@headlessui/react";
import { useNavigate } from "react-router-dom";
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

const Monitor_cmp = () => {
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
      setLoading(false);
    };
    fetchMoniter();
  }, [value]);

  const handleDeleteMonitor = async (monitor_id) => {
    setDeleteLoading(true);
    if (window.confirm("Are you sure you want to delete this monitor?")) {
      try {
        const response = await fetch(`${baseUrl}/delete_monitor`, {
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
    console.log("Monitors", moniter);
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
              const slack_webhook = i.slack_webhook;
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

                    <p className="  text-black">
                      {created_on?.slice(11, 16)}
                    </p>
                    <p className="text-[#2D5C8F] ">
                      {`${address?.slice(0, 5)}...${address?.slice(
                        address.length - 4
                      )}`}
                    </p>
                  </div>
                  <div className=" flex flex-col gap-3 md:gap-5 justify-center items-center">
                    {(network === 1 ||
                      network === 11155111 ||
                      network === 137 ||
                      network === 80002) &&
                    is_admin == 1 ? (
                      <button
                        //onClick={() => handleInteract(mid)}
                        onClick={() => {
                          navigate("/api_builder?id=" + mid, {
                            state: {
                              mid,
                              name,
                              network,
                              address,
                              alert_data,
                              alert_type,
                            },
                          });
                        }}
                        className="bg-[#2D5C8F] text-white px-3 py-1 rounded-lg w-40"
                      >
                        Interact
                      </button>
                    ) : null}

                    {/* <button className="bg-[#2D5C8F] text-white px-3 py-1 rounded-lg w-40">
                        Interact
                      </button> */}
                    <button
                      className="border-2 border-red-500 text-red-500 px-3 py-[2px] rounded-lg font-medium hover:bg-red-500 hover:text-white w-40"
                      onClick={() => {
                        if (network === 1300 || network === 1301) {
                          // Navigate to algo_alerts page for Algorand Mainnet/Testnet
                          navigate("/algo_alerts", {
                            state: { mid, network },
                          });
                        } else {
                          // Navigate to monitor_alerts for other networks
                          navigate("/monitor_alerts", {
                            state: { mid, network },
                          });
                        }
                      }}
                    >
                      Alerts
                    </button>
                    <div className="flex items-center gap-8 justify-center">
                      {is_admin == 1 && (
                        <button
                          onClick={() => {
                            navigate("/monitor_Edit?id=" + mid, {
                              state: {
                                mid,
                                name,
                                network,
                                address,
                                alert_data,
                                alert_type,
                                slack_webhook,
                              },
                            });
                          }}
                        >
                          <FaRegEdit className="text-[#4A4A4A] text-2xl" />
                        </button>
                      )}
                      {is_admin == 1 && (
                        <button onClick={() => handleDeleteMonitor(mid)}>
                          <BsTrash className="text-[#4A4A4A] text-2xl" />
                        </button>
                      )}
                      {is_admin == 1 && (
                        <Switch
                          checked={status === 1 ? true : false}
                          onChange={() => {
                            const newStatus = status === 0 ? 1 : 0;

                            fetch(`${baseUrl}/update_monitor`, {
                              method: "POST",
                              headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`,
                              },
                              body: JSON.stringify({
                                monitor_id: mid,
                                status: newStatus,
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
                          className={`${
                            status === 1 ? "bg-[#2D5C8F]" : "bg-[#B8B8B8]"
                          } relative inline-flex h-6 w-11 items-center rounded-full`}
                        >
                          <span className="sr-only">Enable notifications</span>
                          <span
                            className={`${
                              status === 1 ? "translate-x-6" : "translate-x-1"
                            } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                          />
                        </Switch>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="overflow-x-auto w-[85%] rounded-md  custom-scrollbar hidden xl:block border-2 border-gray-400 mt-5">
            <table className="w-full rounded-md overflow-hidden border-2 shadow-4xl bg-red shadow-[#303030F7] table   ">
              <thead>
                <tr className="">
                  <th className="py-4  border-2 border-none text-black text-sm font-medium">
                    Name
                  </th>
                  <th className="py-4  border-2 border-none text-black text-sm font-medium">
                    Networks
                  </th>
                  <th className="py-4  border-2 border-none text-black text-sm font-medium">
                    Created on
                  </th>
                  <th className="py-4  border-2 border-none text-black text-sm font-medium">
                    Time
                  </th>
                  <th className="py-4  border-2 border-none text-black text-sm font-medium flex items-center gap-40">
                  Actions <HiMenuAlt2 className="text-lg"/>
                  </th>
                  
                </tr>
              </thead>
              <tbody>
                {moniter.monitors.map((i) => {
                  const mid = i.mid;
                  const name = i.name;
                  const risk = i.category;
                  const network = i.network;
                  const address = i.address;
                  const status = i.status;
                  const created_on = i.created_on;
                  const alert_type = i.alert_type;
                  const alert_data = i.alert_data;
                  const slack_webhook = i.slack_webhook;
                  return (
                    <tr className="border-gray-400 border-2 border-l-0 border-r-0 ">
                      <td className=" ">
                        <p className="text-md  text-black">
                          {name}
                        </p>
                      </td>

                      <td className=" ">
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
                      <td className=" flex gap-8 items-center py-4">
                        {(network === 1 ||
                          network === 11155111 ||
                          network === 137 ||
                          network === 80002) &&
                        is_admin == 1 ? (
                          <button
                            //onClick={() => handleInteract(mid)}
                            // title="Interact"
                            
                            onClick={() => {
                              navigate("/api_builder?id=" + mid, {
                                state: {
                                  mid,
                                  name,
                                  network,
                                  address,
                                  alert_data,
                                  alert_type,
                                  
                                },
                              });
                            }}
                            className=" text-black text-lg tooltip"
                            data-tip="Interact"
                          >
                            <FaEdit />
                          </button>
                        ) : (
                          is_admin == 1 && (
                            <button
                            // title="Interact"
                              className=" text-black text-lg tooltip"
                              data-tip="Interact"
                              onClick={() => {
                                navigate("/api_builder?id=" + mid, {
                                  state: {
                                    mid,
                                    name,
                                    network,
                                    address,
                                    alert_data,
                                    alert_type,
                                  },
                                });
                              }}
                            >
                              <FaEdit />
                            </button>
                          )
                        )}

                        <button
                          className=" text-black text-lg tooltip"
                          data-tip="Alerts"
                          onClick={() => {
                            if (network === 1300 || network === 1301) {
                              // Navigate to algo_alerts page for Algorand Mainnet/Testnet
                              navigate("/algo_alerts", {
                                state: { mid, network },
                              });
                            } else {
                              // Navigate to monitor_alerts for other networks
                              navigate("/monitor_alerts", {
                                state: { mid, network },
                              });
                            }
                          }}
                        >
                          <FaRegBell />
                        </button>

                        {is_admin == 1 && (
                          <button
                            className="text-black text-lg tooltip"
                            data-tip="Edit"
                            onClick={() => {
                              navigate("/monitor_Edit?id=" + mid, {
                                state: {
                                  mid,
                                  name,
                                  network,
                                  address,
                                  alert_data,
                                  alert_type,
                                  slack_webhook,
                                },
                              });
                            }}
                          >
                            <LuPencil />
                          </button>
                        )}

                        {is_admin == 1 && (
                          <button onClick={() => handleDeleteMonitor(mid)} className="tooltip" data-tip="Delete">
                            <FaRegTrashAlt className="text-black text-lg" />
                          </button>
                        )}
                        {is_admin == 1 ? (
                          status === 1 ? (
                            <button
                            className="text-black text-3xl"
                            onClick={() => {
                              fetch(`${baseUrl}/update_monitor`, {
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
                            <MdOutlineToggleOn  />
                            </button>
                          ) : (
                            <button
                            className="text-black text-3xl"
                            onClick={() => {
                              fetch(`${baseUrl}/update_monitor`, {
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
                            <MdOutlineToggleOff  />
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
    </div>
  );
};

export default Monitor_cmp;
