import React, { useState } from "react";
import Modal from "react-modal";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { baseUrl } from '../Constants/data.js';
import { Link } from "react-router-dom";
import NewNavbar from "./NewNavbar";
import Sidebar from "./Sidebar";
import { IoMdCheckmarkCircle } from "react-icons/io";
import Select from "react-select";
import { IoMdCopy } from "react-icons/io";
import { IoCheckmarkCircleOutline } from "react-icons/io5";

Modal.setAppElement("#root");

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

function Autodefend() {
  const navigate = useNavigate();
  const location = useLocation();
  const userEmail = localStorage.getItem("email");
  const planType = parseInt(localStorage.getItem("planType")) || 0;
  const { abi, name, email, m_id, network, address, rk, selectedEventNames, responseDatas, alert_data, alert_type, slack_webhook } = location.state || {};

  const [Abi, setAbi] = useState(JSON.parse(abi) || []);
  const [eventNames, setEventNames] = useState(selectedEventNames || []);
  const [previousData, setPreviousData] = useState(responseDatas || []);
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [eventFunctions, setEventFunctions] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleFunctionSelect = (eventId, selectedOption) => {
    const selectedFunc = Abi.find(f => f.name === selectedOption.value);
    setEventFunctions(prev => ({
      ...prev,
      [eventId]: {
        ...prev[eventId],
        function: selectedFunc,
        params: {}
      }
    }));
  };

  const handleFunctionInputChange = (e, eventId, inputName) => {
    setEventFunctions(prev => ({
      ...prev,
      [eventId]: {
        ...prev[eventId],
        params: {
          ...prev[eventId]?.params,
          [inputName]: e.target.value
        }
      }
    }));
  };


  const handleEventToggle = (eventId) => {
    setSelectedEvents(prevEvents => {
      if (prevEvents.includes(eventId)) {
        const newEventFunctions = {...eventFunctions};
        delete newEventFunctions[eventId];
        setEventFunctions(newEventFunctions);
        return prevEvents.filter(id => id !== eventId);
      } else {
        return [...prevEvents, eventId];
      }
    });
  };

  const handleSubmit = async () => {
    if (selectedEvents.length === 0) {
      toast.error("Please select at least one event");
      return;
    }

    setIsLoading(true);
    
    try {
      const requests = selectedEvents.map(eventId => {
        const eventData = previousData.find(e => e.eid === eventId);
        const functionData = eventFunctions[eventId];
        
        if (!functionData?.function) {
          throw new Error(`Please select a function for ${eventData.name}`);
        }
        console.log("Event Id:", eventId);
        console.log("function Data:",functionData);
        

        return fetch("https://139-59-5-56.nip.io:3443/addDefender", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            mid: m_id,
            eid: eventId,
            name: functionData.function.name,
            params: functionData.params || {},
            status: true
          })
        });
      });

      const responses = await Promise.all(requests);
      console.log("Responses:",responses);
      const results = await Promise.all(responses.map(res => res.json()));
      console.log("Results:",results);


      // const errors = results.filter(result => !result.success);
      // if (errors.length > 0) {
      //   throw new Error(`Failed to save ${errors.length} event(s)`);
      // }
      

      
      const navigationState = {
        abi: abi,
        monitorName: name,
        m_id: m_id,
        email: email,
        alert_data: alert_data,
        alert_type: alert_type,
        slack_webhook: slack_webhook,
        address: address,
        autodefend_settings: {
          events: selectedEvents.map(eventId => ({
            eid: eventId,
            ...eventFunctions[eventId]
          }))
        }
      };
      toast.success("AutoDefend settings saved successfully!", {
        autoClose: 500,
        onClose: () => {
          navigate("/alerts", { state: navigationState });
        },
    });
     

    } catch (error) {
      console.error('Error:', error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const isLocked = planType === 0;

  return (
    <div className="w-full h-full overflow-auto">
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      <NewNavbar email={userEmail} />
      <div className="bg-[#FAFAFA] w-full flex min-h-full">
        <Sidebar />

        <div className=" h-full xl:flex flex-col gap-5 ml-[100px] hidden lg:mt-20 fixed ">
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
          </div>
        </div>

        <div className={`mt-20 w-full sm:ml-[100px] md:ml-[100px] xl:ml-72 pt-6 flex flex-col lg:flex-row lg:justify-start lg:items-start justify-center items-center gap-10 flex-wrap pb-10 ${isLocked ? 'blur-sm pointer-events-none select-none' : ''}`}>
          <div className="w-full sm:w-80  px-4">
            <Link to="/monitor">
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
                <div className="text-base text-[#7D7D7D] my-auto" style={{ color: "black" }}>
                  Back to Monitors
                </div>
              </div>
            </Link>
            <div className="text-3xl font-medium mt-3" style={{ color: "black" }}>
              Edit Monitor
            </div>

            <div className="mt-5 hidden sm:flex gap-2 px-4 py-3 rounded-sm bg-white" style={{ border: "1px solid #2D5C8F" }}>
              <div className="my-auto" style={{ color: "black" }}>
                General Information
              </div>
              <div className="my-auto ml-auto">
                <IoMdCheckmarkCircle className="text-2xl text-[#2D5C8F]" />
              </div>
            </div>
            <div className="mt-5 hidden sm:flex gap-2 px-4 py-3 rounded-sm bg-white" style={{ border: "1px solid #2D5C8F" }}>
              <div className="my-auto text-black">
                Events
              </div>
              <div className="my-auto ml-auto">
                <IoMdCheckmarkCircle className="text-2xl text-[#2D5C8F]" />
              </div>
            </div>
            <div className="mt-5 hidden sm:flex gap-2 px-4 py-3 rounded-sm bg-white" style={{ border: "1px solid #2D5C8F" }}>
              <div className="my-auto text-black">
                Auto Defend
              </div>
              <div className="my-auto ml-auto">
                <IoMdCheckmarkCircle className="text-2xl text-[#2D5C8F]" />
              </div>
            </div>
            <div className="mt-5 hidden sm:flex gap-2 px-4 py-3 rounded-sm bg-white" style={{ border: "1px solid #CACACA" }}>
              <div className="my-auto">
                Alerts
              </div>
              <div className="my-auto ml-auto">
                <IoCheckmarkCircleOutline className="text-2xl text-[#2D5C8F]" />
              </div>
            </div>

            <div className="sm:hidden flex gap-2 items-center justify-around mt-5 w-full">
              <div className="flex gap-1 items-center">
                <IoMdCheckmarkCircle className="text-3xl text-[#2D5C8F]" />
                <p className="text-black">General <br /> Information</p>
              </div>
              <div className="flex gap-1 items-center">
                <IoMdCheckmarkCircle className="text-3xl text-[#2D5C8F]" />
                <p className="text-black">Events</p>
              </div>
              <div className="flex gap-1 items-center">
                <IoMdCheckmarkCircle className="text-3xl text-[#2D5C8F]" />
                <p className="text-black">Alerts</p>
              </div>
            </div>
          </div>

          <div className="w-[97%] md:w-1/3 lg:w-1/3 mt-5 md:mt-0 mx-auto md:mx-0 sm:bg-inherit sm:border-0 bg-white px-2 border-2 rounded-md py-2">
            <h2 className="text-2xl font-semibold mb-2 text-black">Auto Defend</h2>
            <h2 className="text-md font-medium mb-1 text-black mt-5">Please grant access to the wallet below to run the AutoDefend protocol:</h2>
            <h2 className="text-md font-medium mb-2 text-[#2D5C8F] flex items-center">
              0xe08E5dC46D7C555346822A7859B15b90c4B43e07
              <span className="text-2xl">
                <IoMdCopy
                  className="ml-2 cursor-pointer text-black hover:text-gray-600 text-2xl font-bold"
                  onClick={() => {
                    navigator.clipboard.writeText("0xe08E5dC46D7C555346822A7859B15b90c4B43e07");
                    toast.success("Address copied successfully!");
                  }}
                />
              </span>
            </h2>
            <h2 className="text-md font-medium mb-2 text-black mt-5">Selected Events:</h2>
            
            {previousData?.map((data) => (
              <div key={data.eid} className="mb-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="checkbox border-2 border-gray-400 rounded"
                    checked={selectedEvents.includes(data.eid)}
                    onChange={() => handleEventToggle(data.eid)}
                  />
                  <span className="text-black">{data.name}</span>
                </label>
                
                {selectedEvents.includes(data.eid) && (
                  <div className="mt-4 p-4 border rounded">
                    <h2 className="text-lg font-semibold mb-2 text-black">
                      {data.name} - Select Function
                    </h2>
                    <Select
                      options={Abi
                        ?.filter(func => func.type === "function")
                        .map(func => ({ value: func.name, label: func.name }))}
                      onChange={(option) => handleFunctionSelect(data.eid, option)}
                      placeholder="Select Function"
                      className="mb-4 text-black"
                      isMulti={false}
                    />

                    {eventFunctions[data.eid]?.function && (
                      <div className="mb-6 p-4 border rounded">
                        <h2 className="text-md font-semibold mb-2 text-black">
                          {eventFunctions[data.eid].function.name} Parameters
                        </h2>
                        {eventFunctions[data.eid].function.inputs?.map(input => (
                          <div key={input.name} className="mb-2">
                            <label className="block text-sm font-medium text-black">
                              {input.name} ({input.type})
                            </label>
                            <input
                              type="text"
                              value={eventFunctions[data.eid]?.params?.[input.name] || ""}
                              onChange={(e) => handleFunctionInputChange(e, data.eid, input.name)}
                              className="w-full p-2 border rounded bg-white text-black"
                              placeholder={`Enter ${input.type}`}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            <div className="w-full flex justify-center items-center mt-5">
              <button 
                className="py-3 w-full bg-[#2D5C8F] rounded-lg text-white mt-5 disabled:opacity-50" 
                onClick={handleSubmit}
                disabled={isLoading || selectedEvents.length === 0}
              >
                {isLoading ? "Saving..." : "Save AutoDefend Settings"}
              </button>
            </div>
          </div>

          <div className="mt-4 md:mt-0 border mx-auto md:mx-0 border-[#2D5C8F] shadow-md p-5 rounded-xl">
            <div className="text-lg font-medium text-[#2D5C8F]">
              Monitor Summary
            </div>
            <div className="flex flex-col gap-2 justify-start items-start">
              <div className="flex items-center gap-2">
                <div className="text-center font-medium w-40 flex justify-between items-center" style={{ color: "black" }}>
                  Networks <span>:</span>
                </div>
                <div className="text-white bg-[#2D5C8F] rounded-md p-1 px-2 text-sm">
                  {network}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-center font-medium w-40 flex justify-between items-center" style={{ color: "black" }}>
                  Risk Category <span>:</span>
                </div>
                <div className="bg-[#E9E9E9] rounded-md p-2 text-[13px]">
                  {rk}
                </div>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <div className="font-medium w-40 flex justify-between items-center" style={{ color: "black" }}>
                Contracts <span>:</span>
              </div>
              <div className="flex gap-1">
                <div className="bg-[#E9E9E9] rounded-md p-1 text-sm">
                  {address.slice(0, 6)}...{address.slice(-4)}
                </div>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <div className="font-medium w-40 flex justify-between items-center" style={{ color: "black" }}>
                Event Conditions <span>:</span>
              </div>
              {selectedEventNames && selectedEventNames.length > 0 ? (
                <ul>
                  {selectedEventNames.map((event, index) => (
                    <li key={index} className="text-[13px]">
                      {event.name} ({event.argTypes})
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-[13px]">No events selected</div>
              )}
            </div>
            <div className="mt-3">
              <div className="font-medium w-40 flex justify-between items-center" style={{ color: "black" }}>
                Function Conditions <span>:</span>
              </div>
              <div>
                {selectedEvents.length > 0 ? (
                  selectedEvents.map(eventId => {
                    const eventData = previousData.find(e => e.eid === eventId);
                    const funcData = eventFunctions[eventId];
                    return (
                      <div key={eventId} className="text-[13px]">
                        {funcData?.function?.name || "No function selected"} for {eventData?.name}
                      </div>
                    );
                  })
                ) : (
                  <div className="text-[13px]">No functions selected</div>
                )}
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <div className="font-medium w-40 flex justify-between items-center" style={{ color: "black" }}>
                Alerts <span>:</span>
              </div>
              <div className="flex gap-1 flex-col items-center">
                <div className="text-[13px] text-black">Marked as</div>
                <div className="bg-[#E9E9E9] rounded-md py-1 px-2 text-[13px]">
                  {/* {riskCategory || "Select Severity"} */}
                </div>
              </div>
            </div>
          </div>
        </div>

        {isLocked && (
          <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center bg-white bg-opacity-90 z-50">
            <h2 className="text-2xl font-semibold text-[#2D5C8F] mb-4">Unlock Pro Subscription</h2>
            <p className="text-gray-700 text-center px-4 mb-6">
              This feature is available only for Pro users. Upgrade your plan to access Auto Defend.
            </p>
            <div className="flex items-center gap-4 flex-wrap justify-center">
              <button
               onClick={() => {
                navigate("/pricing");
              }
            }
                className="bg-[#2D5C8F] text-white px-6 py-2 rounded-lg hover:bg-[#1e3c5a]"
              >
                View Plans
              </button>
              <button
                onClick={() => {
                  const navigationState = {
                    abi: abi,
                    monitorName: name,
                    m_id: m_id,
                    email: email,
                    alert_data: alert_data,
                    alert_type: alert_type,
                    slack_webhook: slack_webhook,
                    address: address,
                  };
                  navigate("/alerts", { state: navigationState });
                }}
                className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-700"
              >
                Continue without Auto Defend
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Autodefend;