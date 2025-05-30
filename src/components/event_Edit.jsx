import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from 'react-select'
import { baseUrl } from "../Constants/data";
import { Link } from "react-router-dom";
import NewNavbar from "./NewNavbar";
import Sidebar from "./Sidebar";
import { IoMdCheckmarkCircle } from "react-icons/io";
import { IoCheckmarkCircleOutline } from "react-icons/io5";

function Event_Edit() {
  const navigate = useNavigate();
  const location = useLocation();
   const userEmail = localStorage.getItem("email");
  console.log(userEmail);
  const planType = parseInt(localStorage.getItem("planType")) || 0;
  const token = localStorage.getItem("token");
  const [options, setOptions] = useState([]);
  const [foundedEvents, setFoundedEvents] = useState([]);
  const [selectedValues, setSelectedValues] = useState([]);
  const [totalEvents, setTotalEvents] = useState([]);
  const [removedEvents, setRemovedEvents] = useState([]);
  const [waiting, setWaiting] = useState(false);

  console.log("Selected values:", selectedValues.length);

  const { name, email, m_id, network, abi, address, rk, alert_data, alert_type, slack_webhook } = location.state || "";

  console.log("alert_data",alert_data);
  console.log("alert_type",alert_type);
  
  const [networkState, setNetworkState] = useState(network || "");
  const [addressState, setAddressState] = useState(address || "");
  const [riskCategoryState, setRiskCategoryState] = useState(rk || "");
  const [eventOperators, setEventOperators] = useState({});
  const [abiState, setAbiState] = useState(abi || "");
  const [eventInputs, setEventInputs] = useState({});
  const mid = m_id;

  const [disp1, setDisp1] = useState("none");
  const [disp2, setDisp2] = useState("none");
  const handleToggle1 = (e) => {
    if (e.target.checked) setDisp1("block");
    else setDisp1("none");
  };
  const handleToggle2 = (e) => {
    if (e.target.checked) setDisp2("block");
    else setDisp2("none");
  };

  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState({});




  useEffect(() => {
    if (!location.state || !location.state.abi) {
      console.error("ABI is not provided");
      return;
    }

    let parsedAbi;
    try {
      parsedAbi = JSON.parse(location.state.abi);
    } catch (error) {
      console.error("Failed to parse ABI:", error);
      return;
    }

    const events = parsedAbi.filter((item) => item.type === "event");
    setFoundedEvents(
      events.map((event) => ({
        name: event.name,
        inputs: event.inputs
          .map((input) => `${input.name}: ${input.type}`)
          .join(", "),
      }))
    );
  }, [
    location.state,
    networkState,
    addressState,
    riskCategoryState,
    abiState,
  ]);

  useEffect(() => {
    const parsedOptions = foundedEvents.map((event) => ({
      label: `${event.name} `,
      value: event.name,
    }));
    // (${event.inputs})
    console.log("Parsed options are:", parsedOptions);
    setTotalEvents(parsedOptions)
  }, [foundedEvents])



  useEffect(() => {
    const fetchMonitorEvents = async () => {
      try {
        if (!m_id) {
          console.warn('m_id is not set');
          return;
        }
        const res = await fetch(`${baseUrl}/get_event`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ mid: m_id }),
        });
        if(res.status === 401){
          toast.error("Session Expired, Please login again",
            {
              autoClose: 500,
              onClose: () => {
                localStorage.clear();
                navigate("/login");
              },
            }
  
          )
        }
        if(res.status === 403){
          toast.error("Unauthorized Access, Please login again",
            {
              autoClose: 500,
              onClose: () => {
                localStorage.clear();
                navigate("/login");
              },
            }
  
          )
        }
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        const events = data.monitors || [];

        // Initialize options
        const newOptions = events.map(event => ({
          label: event.name,
          value: event.name,
        }));
        setOptions(newOptions);

        // Initialize eventInputs and eventOperators
        const newEventInputs = {};
        const newEventOperators = {};

        events.forEach(event => {
          const parsedArgs = parseArguments(event.arguments);
          newEventInputs[event.name] = parsedArgs;

          if (parsedArgs.value) {
            const operatorMatch = parsedArgs.value.match(/^(<|>|==)::/);
            if (operatorMatch) {
              newEventOperators[event.name] = operatorMatch[0];
            }
          }
        });

        setEvents(events);
        setEventInputs(newEventInputs);
        setEventOperators(newEventOperators);

        // Select previously updated events
        const previouslySelected = Object.keys(newEventInputs);
        setSelectedValues(previouslySelected);

      } catch (error) {
        console.error("Failed to fetch events:", error);
      }
    };

    fetchMonitorEvents();
  }, [m_id]);


  useEffect(() => {
    console.log("Events are:", events);
    console.log("Event Inputs are:", eventInputs);
    console.log("Event Operators are:", eventOperators);
    console.log("Selected values:", selectedValues);
  }, [events, eventInputs, eventOperators, selectedValues]);

  const parseArguments = (argumentsString) => {
    try {
      const cleanString = argumentsString.startsWith('"') && argumentsString.endsWith('"')
        ? argumentsString.slice(1, -1)
        : argumentsString;
      const unescapedString = cleanString.replace(/\\(.)/g, "$1");
      return JSON.parse(unescapedString);
    } catch (error) {
      console.error("Failed to parse arguments:", error);
      return {};
    }
  };

  const handleInputChange = (eventName, inputName, value) => {
    setEventInputs(prevInputs => ({
      ...prevInputs,
      [eventName]: {
        ...prevInputs[eventName],
        [inputName]: value
      }
    }));
  };



const handleOperatorChange = (eventName, inputName, operator) => {
    setEventInputs(prevInputs => {
      const currentInput = prevInputs[eventName]?.[inputName] || '';
  
      // Regex to check if the currentInput already has an operator
      const operatorPattern = /^(<|>|==)::/;
      
      let newValue;
  
      if (operatorPattern.test(currentInput)) {
        // Replace existing operator with the new one, preserving existing value
        newValue = currentInput.replace(operatorPattern, `${operator}`);
      } else {
        // Add the new operator with :: if no operator exists
        newValue = `${operator}${currentInput}`;
      }
  
      return {
        ...prevInputs,
        [eventName]: {
          ...prevInputs[eventName],
          [inputName]: newValue,
        },
     };
});
};

const handleSelectChange = (selectedOptions) => {
  const values = selectedOptions.map(option => option.value);
  
  // Identify removed events
  const newlyRemovedEvents = selectedValues.filter(value => !values.includes(value));

  // Add removed events to the removedEvents state
  setRemovedEvents(prevRemoved => [
      ...prevRemoved,
      ...newlyRemovedEvents.map(eventName => {
          const eventId = events.find(event => event.name === eventName)?.id;
          return eventId ? { name: eventName, id: eventId } : null;
      }).filter(Boolean) // Remove null entries
  ]);

  setSelectedValues(values);
};


  // Ensure ABI data is correctly parsed
  const abiData = JSON.parse(abiState || '[]');
  const abiEventsMap = abiData.reduce((acc, e) => {
    acc[e.name] = e;
    return acc;
  }, {});




  const navigationState = {
    abi:abi,
    monitorName: name,
    network: networkState,
    address: addressState,
    rk: riskCategoryState,
    m_id: m_id,
    email: email,
    token: token,
    alert_data: alert_data,
    alert_type: alert_type,
    slack_webhook, slack_webhook,
    selectedEventNames: selectedValues
  };

  const handleSubmit = async () => {
    try {
        const errors = [];
        const processingEvents = [];
        let hasChanges = false;

        // Helper function to send requests
        const sendRequest = async (url, method, data) => {
            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json",
                  'Authorization': `Bearer ${token}`,
                 },
                body: JSON.stringify(data),
            });
            if(response.status === 401){
              toast.error("Session Expired, Please login again",
                {
                  autoClose: 500,
                  onClose: () => {
                    localStorage.clear();
                    navigate("/login");
                  },
                }
      
              )
            }
            if(response.status === 403){
              toast.error("Unauthorized Access, Please login again",
                {
                  autoClose: 500,
                  onClose: () => {
                    localStorage.clear();
                    navigate("/login");
                  },
                }
      
              )
            }
            if (!response.ok) {
                throw new Error(`Error fetching data from ${url}`);
            }
            return response.json(); // Return response JSON for further processing
        };

        // Delete removed events
        for (const removedEvent of removedEvents) {
            if (removedEvent.id) {
                processingEvents.push(
                    sendRequest(`${baseUrl}/delete_event`, "POST", { id: removedEvent.id })
                        .then(response => {
                            console.log(`Event ${removedEvent.name} deleted successfully!`, response);
                            hasChanges = true;
                        })
                        .catch(error => {
                            console.error(`Error deleting ${removedEvent.name}:`, error);
                            errors.push({
                                eventType: removedEvent.name,
                                message: `Failed to delete ${removedEvent.name} event. Please try again!`
                            });
                        })
                );
            }
        }

        // Fetch existing events from the monitor
        const fetchEventsFromMonitor = async (monitorId) => {
            const response = await fetch(`${baseUrl}/get_event`, {
                method: 'POST',
                headers: { "Content-Type": "application/json",
                  'Authorization': `Bearer ${token}`,
                 },
                body: JSON.stringify({ mid: monitorId }),
            });
            if(response.status === 401){
              toast.error("Session Expired, Please login again",
                {
                  autoClose: 500,
                  onClose: () => {
                    localStorage.clear();
                    navigate("/login");
                  },
                }
      
              )
            }
            if(response.status === 403){
              toast.error("Unauthorized Access, Please login again",
                {
                  autoClose: 500,
                  onClose: () => {
                    localStorage.clear();
                    navigate("/login");
                  },
                }
      
              )
            }
            if (!response.ok) {
                throw new Error('Error fetching event data');
            }
            return response.json(); // Return response JSON for further processing
        };

        // Fetch events from monitor
        const monitorEventsResponse = await fetchEventsFromMonitor(m_id);

        // Log the entire response to verify structure
        console.log("Fetched monitor events response:", monitorEventsResponse);

        // Extract the monitorEvents array from the response
        const monitorEvents = monitorEventsResponse.monitors || []; // Default to empty array if missing

        // Check if monitorEvents is an array
        if (Array.isArray(monitorEvents)) {
            // Create a map of existing events by their ID for quick lookup
            const eventMap = new Map(monitorEvents.map(event => [event.id, event]));

            // Log the eventMap to verify its content
            console.log("Event map:", Array.from(eventMap.entries()));

            // Process each selected event dynamically
            for (const eventType of selectedValues) {
                const inputs = eventInputs[eventType] || {};

                // Log inputs to verify data
                console.log(`Processing eventType: ${eventType}`);
                console.log(`Inputs for ${eventType}:`, inputs);

                // Prepare request data
                const eventData = {
                    name: eventType,
                    arguments: {
                        ...inputs,
                        value: (inputs.value || "").trim(),
                    },
                };

                // Get the event ID from inputs and sanitize
                const eventId = (inputs.id || "").trim();

                // Debugging logs
                console.log(`Event ID to check: ${eventId}`);

                // Find the existing event based on ID or fallback to name
                let existingEvent = null;

                // Check if the eventId is a valid number and if it exists in eventMap
                if (eventId && !isNaN(Number(eventId))) {
                    existingEvent = eventMap.get(Number(eventId));
                }

                if (!existingEvent) {
                    // If no event found by ID, try to find by name (fallback method)
                    const normalizedEventType = eventType.trim().toLowerCase();
                    existingEvent = monitorEvents.find(event => event.name.trim().toLowerCase() === normalizedEventType);
                }

                // Log the existing event details
                console.log(`Existing event:`, existingEvent);
                
                console.log("Existing event arguments:", existingEvent?.arguments);
                console.log("Existing event arguments value:", existingEvent?.arguments?.value);

                // If an existing event is found, update it
                if (existingEvent) {
                    if (existingEvent.name.trim().toLowerCase() === eventType.trim().toLowerCase()) {
                        console.log(`Updating existing event: ${eventType} with ID: ${existingEvent.id}`);

                        const requestData = { id: existingEvent.id, ...eventData };

                        processingEvents.push(
                            sendRequest(`${baseUrl}/update_event`, "POST", requestData)
                                .then(response => {
                                    console.log(`${eventType} updated successfully!`, response);
                                    hasChanges = true;
                                })
                                .catch(error => {
                                    console.error(`Error updating ${eventType}:`, error);
                                    errors.push({
                                        eventType,
                                        message: `Failed to update ${eventType} event. Please try again!`
                                    });
                                })
                        );
                    } else {
                        console.log(`Event name mismatch: '${eventType}' does not match '${existingEvent.name}'. Skipping.`);
                    }
                } else {
                    // If no existing event is found, add it as a new event
                    console.log(`No matching event found for: ${eventType}. Adding as new.`);
                    const requestData = { mid: m_id, ...eventData };
                    processingEvents.push(
                        sendRequest(`${baseUrl}/add_event`, "POST", requestData)
                            .then(response => {
                                toast.success(`${eventType} event added successfully!`);
                                console.log(`${eventType} 1 added successfully!`, response);
                                hasChanges = true;
                            })
                            .catch(error => {
                                console.error(`Error adding ${eventType}:`, error);
                                errors.push({
                                    eventType,
                                    message: `Failed to add ${eventType} event. Please try again!`
                                });
                            })
                    );
                }
            }

            // Wait for all event requests to complete
            await Promise.all(processingEvents);

            // Display success and error toasts
            if (hasChanges) {
                selectedValues.forEach(eventType => {
                    if (hasChanges) {
                        toast.success(`${eventType} event processed successfully!`);
                    }
                });
                toast.success("Events processed successfully!", {
                    autoClose: 500,
                    onClose: () => {
                        navigate("/autodefend_edit", { state: navigationState });
                        // navigate("/alert_edit", { state: navigationState });
                    },
                });
            } else {
                toast.error("Failed to process events. Please try again!");
                errors.forEach(({ eventType, message }) => toast.error(message));
            }
        } else {
            console.error("monitorEvents is not an array or is missing.");
        }
    } catch (error) {
        console.error("Unexpected error:", error);
        toast.error("An unexpected error occurred. Please try again!");
    }
};

  if (
    !events ||
    !Array.isArray(events)
  ) {
    return (
      <div className="w-full h-full">
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover
            />
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
            {/* <Link to="/log" className="text-[#6A6A6A]">
              Logs
            </Link> */}
          </div>
        </div>
      
      
        <div className="mt-20 w-full sm:ml-[100px] md:ml-72 pt-6  flex flex-col xl:flex-row xl:justify-start xl:items-start   justify-center items-center gap-10 flex-wrap ">
      
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
                  <div
                    className="text-base text-[#7D7D7D] my-auto"
                    style={{ color: "black" }}
                  >
                    Back to Monitors
                  </div>
                </div>
                </Link>
                <div className="text-3xl font-medium mt-3" style={{ color: "black" }}>
                  Edit Monitor
                </div>
      
                <div
                  className="mt-5 flex gap-2 px-4 py-3 rounded-sm bg-white"
                  style={{ border: "1px solid #2D5C8F" }}
                >
                  <div className="my-auto" style={{ color: "black" }}>
                    General Information
                  </div>
                  <div className="my-auto ml-auto">
                    
                    <IoMdCheckmarkCircle className="text-2xl text-[#2D5C8F]" />
                  </div>
                </div>
                <div
                  className="mt-5 flex gap-2 px-4 py-3 rounded-sm bg-white"
                  style={{ border: "1px solid #2D5C8F" }}
                >
                  
                  <div className="my-auto text-black" >
                    {" "}
                    Events
                  </div>
                  <div className="my-auto ml-auto">
                    
                    <IoMdCheckmarkCircle className="text-2xl text-[#2D5C8F]" />
                  </div>
                </div>

                 <div
                              className="mt-5 hidden sm:flex gap-2 px-4 py-3 rounded-sm "
                              style={{ border: "1px solid #CACACA" }}
                            >
                
                              <div className="my-auto " >
                                {" "}
                                {planType === 0 ? "This feature is available only for Pro users. Upgrade your plan to access Auto Defend.":"Autodefend"}
                              </div>
                              <div className="my-auto ml-auto">
                
                                <IoCheckmarkCircleOutline className="text-2xl " />
                              </div>
                            </div>
                
                <div
                  className="mt-5 flex gap-2 px-4 py-3 rounded-sm"
                  style={{ border: "1px solid #CACACA" }}
                >
                  
                  <div className="my-auto" >
                    Alerts
                  </div>
                  <div className="my-auto ml-auto">
                    <IoCheckmarkCircleOutline className="text-2xl " />
                  </div>
                </div>
              </div>
      
      
              <div className="">
                  <div className="font-medium text-lg" style={{ color: "black" }}>
                    {loading ? (<span className="loading loading-spinner text-green-800"></span>) : "No Events Found"}
                  </div>
                </div>
      
              <div className="border border-[#2D5C8F]  shadow-md p-4  rounded-xl w-80   mb-10 xl:mb-0">
                <div className="text-lg font-medium text-[#2D5C8F]" >
                  Monitor Summary
                </div>
                <div className="flex flex-col justify-center items-start gap-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="text-center font-medium  w-40 flex justify-between items-center"
                      style={{ color: "black" }}
                    >
                      Networks <span>:</span>
                    </div>
                    <div className="text-white bg-[#2D5C8F] rounded-md p-1 px-2 text-sm ">
                      {networkState}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className="text-center font-medium w-40 flex justify-between items-center"
                      style={{ color: "black" }}
                    >
                      Risk Category <span>:</span>
                    </div>
                    <div className=" bg-[#E9E9E9] rounded-md p-2 text-[13px]">
                      {rk}
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <div className="font-medium w-40 flex justify-between items-center" style={{ color: "black" }}>
                    Contracts <span>:</span>
                  </div>
                  <div className="flex gap-1">
                    <div className=" bg-[#E9E9E9] rounded-md p-1 text-sm">
                      {addressState.slice(0, 6) + "..." + addressState.slice(-4)}
                    </div>
                    {/* <button onClick={copymessage}>
                      <div className="my-auto">
                        <svg
                          width="19"
                          height="19"
                          viewBox="0 0 19 19"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g clip-path="url(#clip0_179_2771)">
                            <path
                              d="M15.1074 7.65955H8.35742C7.52899 7.65955 6.85742 8.33112 6.85742 9.15955V15.9095C6.85742 16.738 7.52899 17.4095 8.35742 17.4095H15.1074C15.9358 17.4095 16.6074 16.738 16.6074 15.9095V9.15955C16.6074 8.33112 15.9358 7.65955 15.1074 7.65955Z"
                              stroke="#434343"
                              stroke-width="1.5"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              d="M3.85742 12.1595H3.10742C2.7096 12.1595 2.32807 12.0015 2.04676 11.7202C1.76546 11.4389 1.60742 11.0574 1.60742 10.6595V3.90955C1.60742 3.51172 1.76546 3.13019 2.04676 2.84889C2.32807 2.56758 2.7096 2.40955 3.10742 2.40955H9.85742C10.2552 2.40955 10.6368 2.56758 10.9181 2.84889C11.1994 3.13019 11.3574 3.51172 11.3574 3.90955V4.65955"
                              stroke="#434343"
                              stroke-width="1.5"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_179_2771">
                              <rect
                                width="18"
                                height="18"
                                fill="white"
                                transform="translate(0.107422 0.909546)"
                              />
                            </clipPath>
                          </defs>
                        </svg>
                      </div>
                    </button> */}
                  </div>
                </div>
                <div className="mt-3 flex items-start gap-2 ">
                  <div className="font-medium w-40 flex justify-between items-center" style={{ color: "black" }}>
                    Event Conditions <span>:</span>
                  </div>
                  {/* {Object.keys(selectedEvents).length > 0 ? (
                    <ul className="text-sm flex gap-1  items-start flex-col text-wrap">
                      {Object.entries(selectedEvents).map(
                        ([eventName, eventData]) => {
                          const argTypes = eventDetails
                            .find((e) => e.name === eventName)
                            .inputs.split(", ")
                            .map((arg) => arg.split(": ")[1]) // Extract only the types
                            .join(", "); // Join types with commas
      
                          return (
                            <li key={eventName} className="text-[13px] flex gap-1">
                              {eventName} 
                            </li>
                            // ({argTypes})
                          );
                        }
                      )}
                    </ul>
                  ) : (
                    <div className="text-[13px]">No events selected</div>
                  )} */}
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <div className="font-medium w-40 flex justify-between items-center" style={{ color: "black" }}>
                    Function Conditions <span>:</span>
                  </div>
                  <div
                    className="text-[13px]"
                    style={{ display: `${disp1 == "none" ? "block" : "none"}` }}
                  >
                    None
                  </div>
                  <div style={{ display: disp1 }}>
                    <div className="text-[13px]">approve(address,uint256)</div>
                    <div className="text-[13px]">
                      decreaseAllowance(address,uint256)
                    </div>
                    <div className="text-[13px]">
                      increaseAllowance(address,uint256)
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <div className="font-medium w-40 flex justify-between items-center" style={{ color: "black" }}>
                    Alerts <span>:</span>
                  </div>
                  <div className="flex gap-1 flex-col  items-start">
                    <div className="text-[13px]" style={{ color: "black" }}>
                      Marked as
                    </div>
                    <div className=" bg-[#E9E9E9] rounded-md py-1 px-2 text-[13px]">
                      Medium Severity
                    </div>
                  </div>
                </div>
              </div>
            </div>
      
      
      </div>
      </div>
    );
  }
  const copyMessage = () => {
    navigator.clipboard.writeText(addressState);
    toast.success("Address Copied successfully!");
  }

  return (
    <div className="w-full h-full">
    <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover
          />
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
           {/* <Link to="/log" className="text-[#6A6A6A]">
            Logs
          </Link> */}
        </div>
      </div>
    
    
      <div className="mt-20 w-full sm:ml-[100px] md:ml-72 pt-6  flex flex-col xl:flex-row xl:justify-start xl:items-start   justify-center items-center gap-10 flex-wrap ">
    
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
                <div
                  className="text-base text-[#7D7D7D] my-auto"
                  style={{ color: "black" }}
                >
                  Back to Monitors
                </div>
              </div>
              </Link>
              <div className="text-3xl font-medium mt-3" style={{ color: "black" }}>
              Edit Monitor
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
              <div
                className="mt-5 hidden sm:flex gap-2 px-4 py-3 rounded-sm bg-white"
                style={{ border: "1px solid #2D5C8F" }}
              >
                
                <div className="my-auto text-black" >
                  {" "}
                  Events
                </div>
                <div className="my-auto ml-auto">
                  
                  <IoMdCheckmarkCircle className="text-2xl text-[#2D5C8F]" />
                </div>
              </div>

              <div
              data-tip="This feature is available only for Pro users. Upgrade your plan to access Auto Defend."
              className={`${planType===0?"tooltip  cursor-pointer":""} mt-5 hidden sm:flex gap-2 px-4 py-3 rounded-sm`}
                             
                              style={{ border: "1px solid #CACACA" }}
                            >
                
                              <div className="my-auto " >
                                {" "}
                                Autodefend
                              </div>
                              <div className="my-auto ml-auto">
                
                                <IoCheckmarkCircleOutline className="text-2xl " />
                              </div>
                            </div>
              
              <div
                className="mt-5 hidden sm:flex gap-2 px-4 py-3 rounded-sm"
                style={{ border: "1px solid #CACACA" }}
              >
                
                <div className="my-auto" >
                  Alerts
                </div>
                <div className="my-auto ml-auto">
                  <IoCheckmarkCircleOutline className="text-2xl " />
                </div>
              </div>

              <div className="sm:hidden flex gap-2 items-center justify-around mt-5  w-full">
    <div className=" flex gap-1 items-center " >
                <IoMdCheckmarkCircle className="text-3xl text-[#2D5C8F]" />
                <p className="text-black">General <br /> Information</p>  
              </div>
    <div className=" flex gap-1 items-center" >
                 <IoMdCheckmarkCircle className="text-3xl text-[#2D5C8F]" />
                 <p className="text-black">Events</p>
                
              </div>
              
    <div className=" flex gap-1 items-center" >
    <IoCheckmarkCircleOutline className="text-3xl " />
    <p className="">Alerts</p>
                
              </div>
</div>

            </div>
    
    
            <div className="w-[98%] sm:w-[400px] bg-white md:bg-inherit md:border-0 py-2 rounded-md border-2 px-2">
  <div className="flex flex-col justify-center items-center gap-6">
    <div className="font-medium text-lg" style={{ color: "black" }}>
      Choose the Signature Name
    </div>

    <div className="my-auto min-w-full">
      <div className="flex flex-col gap-4 m-3">
        <Select
          isMulti
          options={totalEvents}
          defaultValue={options}
          onChange={handleSelectChange}
        />
      </div>
    </div>
  </div>

  <div className="w-full max-h-[400px] p-5 overflow-y-auto mb-2 edit-event mt-2">
    {selectedValues.length === 0 ? (
      <p>No events selected.</p>
    ) : (
      selectedValues.map(eventName => {
        const abiEvent = abiEventsMap[eventName];
        if (!abiEvent) {
          console.warn(`ABI Event not found for: ${eventName}`);
          return null;
        }
        console.log("abiEvent", abiEvent);

        return (
          <div key={eventName} className="mb-4">
            <div className="mt-3 text-black font-medium mb-3">{eventName} :</div>
            <div className="flex flex-col gap-3">
              {abiEvent.inputs.map(input => (
                <div key={input.name} className="flex flex-col gap-2">
                  <label className="text-gray-700 text-sm font-medium">
                    {`${input.name} :`}
                  </label>
                  {input.type === 'bool' ? (
                    <select
                      className="w-full rounded-lg p-2 border border-[#4C4C4C] bg-white outline-none"
                      onChange={(e) => handleInputChange(eventName, input.name, e.target.value)}
                      value={eventInputs[eventName]?.[input.name] || 'none'}
                      required
                    >
                      <option value="none" hidden>None</option>
                      <option value="true">True</option>
                      <option value="false">False</option>
                    </select>
                  ) : (
                    <input
                      className="w-full rounded-lg p-2 border border-[#4C4C4C] bg-white outline-none"
                      placeholder={`${input.name}: ${input.type}`}
                      value={
                        eventInputs[eventName]?.[input.name]
                          ? eventInputs[eventName][input.name].startsWith('<') ? eventInputs[eventName][input.name].substring(3)
                          : eventInputs[eventName][input.name].startsWith('>') ? eventInputs[eventName][input.name].substring(3)
                          : eventInputs[eventName][input.name].startsWith('=') ? eventInputs[eventName][input.name].substring(4)
                          : eventInputs[eventName][input.name]
                          : ""
                      }
                      required
                      onChange={(e) => handleInputChange(eventName, input.name, e.target.value)}
                    />
                  )}
                  {['uint8', 'uint16', 'uint32', 'uint64', 'uint128', 'uint256', 'int8', 'int16', 'int32', 'int64', 'int128', 'int256'].includes(input.type) && (
                    <div className="flex gap-3 mt-2">
                      <select
                        className="w-full py-2 bg-white border rounded-lg border-black"
                        onChange={(e) => handleOperatorChange(eventName, input.name, e.target.value)}
                        value={
                          eventInputs[eventName]?.[input.name]
                            ? eventInputs[eventName][input.name].startsWith('<') ? "<::"
                            : eventInputs[eventName][input.name].startsWith('>') ? ">::"
                            : eventInputs[eventName][input.name].startsWith('=') ? "==::"
                            : "None"
                            : "None"
                        }
                        required
                      >
                        <option value="None" hidden>None</option>
                        <option value="<::"> &lt; </option>
                        <option value=">::"> &gt; </option>
                        <option value="==::"> == </option>
                      </select>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })
    )}
  </div>

  <button
    className={`py-3 w-full rounded-lg text-white mt-5 ${
      selectedValues.length > 0
        ? "bg-[#2D5C8F] hover:bg-[#245078]"
        : "bg-[#2D5C8F]/50 cursor-not-allowed"
    }`}
    onClick={handleSubmit}
    disabled={selectedValues.length === 0}
  >
    Update Events
  </button>
          </div>
    
            <div className="border border-[#2D5C8F]  shadow-md p-4  rounded-xl w-80   mb-10 xl:mb-0">
              <div className="text-lg font-medium text-[#2D5C8F]" >
                Monitor Summary
              </div>
              <div className="flex flex-col justify-center items-start gap-2">
                <div className="flex items-center gap-2">
                  <div
                    className="text-center font-medium  w-40 flex justify-between items-center"
                    style={{ color: "black" }}
                  >
                    Networks <span>:</span>
                  </div>
                  <div className="text-white bg-[#2D5C8F] rounded-md p-1 px-2 text-sm ">
                    {networkState}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="text-center font-medium w-40 flex justify-between items-center"
                    style={{ color: "black" }}
                  >
                    Risk Category <span>:</span>
                  </div>
                  <div className=" bg-[#E9E9E9] rounded-md p-2 text-[13px]">
                    {rk}
                  </div>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <div className="font-medium w-40 flex justify-between items-center" style={{ color: "black" }}>
                  Contracts <span>:</span>
                </div>
                <div className="flex gap-1">
                  <div className=" bg-[#E9E9E9] rounded-md p-1 text-sm">
                    {addressState.slice(0, 6) + "..." + addressState.slice(-4)}
                  </div>
                  {/* <button onClick={copymessage}>
                    <div className="my-auto">
                      <svg
                        width="19"
                        height="19"
                        viewBox="0 0 19 19"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clip-path="url(#clip0_179_2771)">
                          <path
                            d="M15.1074 7.65955H8.35742C7.52899 7.65955 6.85742 8.33112 6.85742 9.15955V15.9095C6.85742 16.738 7.52899 17.4095 8.35742 17.4095H15.1074C15.9358 17.4095 16.6074 16.738 16.6074 15.9095V9.15955C16.6074 8.33112 15.9358 7.65955 15.1074 7.65955Z"
                            stroke="#434343"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M3.85742 12.1595H3.10742C2.7096 12.1595 2.32807 12.0015 2.04676 11.7202C1.76546 11.4389 1.60742 11.0574 1.60742 10.6595V3.90955C1.60742 3.51172 1.76546 3.13019 2.04676 2.84889C2.32807 2.56758 2.7096 2.40955 3.10742 2.40955H9.85742C10.2552 2.40955 10.6368 2.56758 10.9181 2.84889C11.1994 3.13019 11.3574 3.51172 11.3574 3.90955V4.65955"
                            stroke="#434343"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_179_2771">
                            <rect
                              width="18"
                              height="18"
                              fill="white"
                              transform="translate(0.107422 0.909546)"
                            />
                          </clipPath>
                        </defs>
                      </svg>
                    </div>
                  </button> */}
                </div>
              </div>
              <div className="mt-3 flex items-start gap-2 ">
                <div className="font-medium w-40 flex justify-between items-center" style={{ color: "black" }}>
                  Event Conditions <span>:</span>
                </div>
                {/* {Object.keys(selectedEvents).length > 0 ? (
                  <ul className="text-sm flex gap-1  items-start flex-col text-wrap">
                    {Object.entries(selectedEvents).map(
                      ([eventName, eventData]) => {
                        const argTypes = eventDetails
                          .find((e) => e.name === eventName)
                          .inputs.split(", ")
                          .map((arg) => arg.split(": ")[1]) // Extract only the types
                          .join(", "); // Join types with commas
    
                        return (
                          <li key={eventName} className="text-[13px] flex gap-1">
                            {eventName} 
                          </li>
                          // ({argTypes})
                        );
                      }
                    )}
                  </ul>
                ) : (
                  <div className="text-[13px]">No events selected</div>
                )} */}
              </div>
              <div className="mt-3 flex items-center gap-2">
                <div className="font-medium w-40 flex justify-between items-center" style={{ color: "black" }}>
                  Function Conditions <span>:</span>
                </div>
                <div
                  className="text-[13px]"
                  style={{ display: `${disp1 == "none" ? "block" : "none"}` }}
                >
                  None
                </div>
                <div style={{ display: disp1 }}>
                  <div className="text-[13px]">approve(address,uint256)</div>
                  <div className="text-[13px]">
                    decreaseAllowance(address,uint256)
                  </div>
                  <div className="text-[13px]">
                    increaseAllowance(address,uint256)
                  </div>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <div className="font-medium w-40 flex justify-between items-center" style={{ color: "black" }}>
                  Alerts <span>:</span>
                </div>
                <div className="flex gap-1 flex-col  items-start">
                  <div className="text-[13px]" style={{ color: "black" }}>
                    Marked as
                  </div>
                  <div className=" bg-[#E9E9E9] rounded-md py-1 px-2 text-[13px]">
                    Medium Severity
                  </div>
                </div>
              </div>
            </div>
          </div>
    
    
    </div>
    </div>
  );
}

export default Event_Edit;