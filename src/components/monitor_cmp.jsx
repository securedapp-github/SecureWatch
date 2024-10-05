import React, { useState, useEffect } from "react";
import { Switch } from "@headlessui/react";
import { useNavigate } from "react-router-dom";
import Edit from "../images/edit.png";
import Trash from "../images/icons8-trash-48.png"; 
import { ToastContainer, toast } from "react-toastify";
import { baseUrl } from "../Constants/data";

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
  const userId = localStorage.getItem("userId") ;

  useEffect(() => {
    setLoading(true);
    const fetchMoniter = async () => {
      setLoading(true);
      const res = await fetch(`${baseUrl}/get_monitor`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: userId,
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
            'Authorization': `Bearer ${token}`,
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
          toast.error("Failed to delete monitor. Please try again.")
          // alert("Failed to delete monitor. Please try again.");
        }
      } catch (error) {
        setDeleteLoading(false);
        toast.error("An error occurred. Please try again.")
        console.error("Error deleting monitor:", error);
        // alert("An error occurred. Please try again.");
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-20 text-4xl font-medium text-black">
         <span className="loading loading-spinner loading-lg text-[#0ca851]"></span>
      </div>
    );
  }
  if (loading === false && !moniter || !Array.isArray(moniter.monitors) || moniter.monitors.length === 0) {
    return (
      <div className="text-center mt-20 text-4xl font-medium text-black">
        Please create a monitor.
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center items-center flex-col ">
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      {loading?(
        <div className="text-center mt-20 text-4xl font-medium">
          <span className="loading loading-spinner loading-lg text-[#0ca851]"></span>
        </div>
      ):
      moniter.monitors.map((i) => {
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
          <div key={mid} className="w-full mx-auto flex justify-center items-center flex-col ">
             
            <div className="w-full mx-auto flex justify-center items-center flex-col ">
              <div
                className="mt-10 w-[95%] lg:w-4/5  flex flex-wrap   rounded-2xl "
                style={{
                  border: "1px solid #0CA851",
                  boxShadow: "4px 4px 0px 0px #0CA851",
                }}
              >
                <button
                  className="w-[70%] sm:w-[80%] md:w-[90%]  p-6  "
                  onClick={() => {
                    navigate("/monitor_alerts", { state: { mid, network } });
                  }}
                >
                  <div className="">
                    <div className="flex gap-3">
                      <div className="text-xl font-semibold text-black">
                        {name}
                      </div>
                      <div className="text-[12px] mt-auto text-[#7D7D7D]">
                        {risk}
                      </div>
                    </div>
                    <div className="flex gap-4 mt-5 flex-wrap items-center ">
                      <div>
                        <div className="text-center font-medium text-black">
                          Networks
                        </div>
                        <div className="bg-[#0CA851] px-3 py-2 rounded-md text-[13px] my-auto text-white">
                          {network === 80002
                            ? "Amoy"
                            : network === 1
                            ? "Ethereum Mainnet"
                            : network === 11155111
                            ? "Sepolia Testnet"
                            : network === 137
                            ? "Polygon Mainnet"
                            : "Unknown"}
                        </div>
                      </div>
                      <div>
                        <div className="text-center font-medium text-black">
                          Created on
                        </div>
                        <div className="bg-[#E9E9E9] px-3 py-2 rounded-md  my-auto flex gap-2">
                          <div className="my-auto text-[14px] text-black">
                            <span className="text-md font-medium text-black">
                              Date:{" "}
                            </span>
                            {created_on?.slice(0, 10)}{" "}
                            <span>
                              <span className="text-md font-medium text-black">
                                Time:{" "}
                              </span>
                              {created_on?.slice(11, 16)}
                            </span>{" "}
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="text-center font-medium text-black">
                          Contract address
                        </div>
                        <div className=" px-3 py-2 rounded-md text-[14px] my-auto text-black bg-[#E9E9E9] ">
                          {`${address?.slice(0, 5)}...${address?.slice(
                            address.length - 4
                          )}`}
                        </div>
                      </div>
                    </div>
                  </div>
                </button>

                <div className="flex items-center p-6 w-[30%] sm:w-[20%] md:w-[10%] ">
                  <div className="flex flex-col justify-end gap-7 items-center">
                    {/* Dustbin Icon for Deleting Monitor */}
                   
                    
                      <button onClick={() => handleDeleteMonitor(mid)}>
                      <img src={Trash} alt="Delete Monitor" className="h-8 w-8" />
                    </button>
                    
                    {/* Edit Icon */}
                    <button onClick={() => {
                      navigate("/monitor_Edit?id=" + mid, {
                        state: { mid, name, network, address, alert_data, alert_type }
                      });
                    }}>
                      <img src={Edit} alt="Edit Monitor" className="h-8 w-8" />
                    </button>
                    <Switch
                      checked={status === 1 ? true : false}
                      onChange={() => {
                        const newStatus = status === 0 ? 1 : 0;

                        fetch(
                          `${baseUrl}/update_monitor`,
                          {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                              'Authorization': `Bearer ${token}`,
                            },
                            body: JSON.stringify({
                              monitor_id: mid,
                              status: newStatus,
                            }),
                          }
                        )
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
                        status === 1 ? "bg-[#0CA851]" : "bg-[#B8B8B8]"
                      } relative inline-flex h-6 w-11 items-center rounded-full`}
                    >
                      <span className="sr-only">Enable notifications</span>
                      <span
                        className={`${
                          status === 1 ? "translate-x-6" : "translate-x-1"
                        } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                      />
                    </Switch>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })
      }
    </div>
  );
};

export default Monitor_cmp;
