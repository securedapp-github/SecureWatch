import * as React from "react";
import { useState } from "react";
import { useLocation, useNavigate,Link } from "react-router-dom";
import axios from "axios";
import Web3 from "web3";
import Select, { components } from "react-select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { baseUrl } from "../Constants/data";
import NewNavbar from "./NewNavbar";
import Sidebar from "./Sidebar";
import { IoMdCheckmarkCircle } from "react-icons/io";
import { IoCheckmarkCircleOutline } from "react-icons/io5";

function Events() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const userEmail = localStorage.getItem("email");
  const planType = parseInt(localStorage.getItem("planType")) || 0;
  console.log(userEmail);
  const { name, email, m_id, network, abi, address, rk } =
    location.state || "";
  const [networkState, setNetworkState] = useState(network || ""); // Default to 'MAINNET' if not provided
  //  const [contractNameState, setContractNameState] = useState(alert_data || "");
  const [addressState, setAddressState] = useState(address || "");
  const [riskCategoryState, setRiskCategoryState] = useState(rk || "");
  const [abiState, setAbiState] = useState(abi || "");
  console.log("name:",name);
  console.log("MID:",m_id);
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

  const [eventDetails, setEventDetails] = React.useState([]);
  const [selectedEvents, setSelectedEvents] = React.useState({});
  const [selectedEventNames, setSelectedEventNames] = useState([]);
  const handleAddEvent = (eventName, argDetails) => {
    const args = argDetails.split(',').map(arg => arg.trim());
    setSelectedEvents(prevState => ({
      ...prevState,
      [eventName]: {
        argDetails,
        args: Array(args.length).fill(''), // Initialize as an array of empty strings
        operators: Array(args.length).fill('') // Initialize operators similarly
      }
    }));
  };

  const handleArgumentChange = (event, eventName, index, type) => {
    const newValue = event.target.value;
  
    setSelectedEvents(prevEvents => {
      // Get current event data or default to empty structure
      const eventData = prevEvents[eventName] || { args: [], operators: [] };
  
      // Ensure args and operators are arrays
      const updatedArgs = Array.isArray(eventData.args) ? [...eventData.args] : [];
      const updatedOperators = Array.isArray(eventData.operators) ? [...eventData.operators] : [];
  
      // Update based on the type
      if (type === 'argument') {
        // Update value at the index or add if index is out of bounds
        if (index < updatedArgs.length) {
          updatedArgs[index] = newValue;
        } else {
          updatedArgs[index] = newValue; // Update if index is out of bounds
        }
  
        return {
          ...prevEvents,
          [eventName]: {
            ...eventData,
            args: updatedArgs
          }
        };
      } else if (type === 'operator') {
        // Update value at the index or add if index is out of bounds
        if (index < updatedOperators.length) {
          updatedOperators[index] = newValue;
        } else {
          updatedOperators[index] = newValue; // Update if index is out of bounds
        }
  
        return {
          ...prevEvents,
          [eventName]: {
            ...eventData,
            operators: updatedOperators
          }
        };
      }
  
      return prevEvents; // Return previous state if type is invalid
    });
  };
  



  const handleOperatorChange = (e, eventName, index) => {
    const newOperator = e.target.value;
    setSelectedEvents(prevEvents => {
      const eventData = prevEvents[eventName] || { args: [], operators: [] };
      const updatedOperators = [...(eventData.operators || [])];
      updatedOperators[index] = newOperator;
      return {
        ...prevEvents,
        [eventName]: {
          ...eventData,
          operators: updatedOperators
        }
      };
    });
  };


  React.useEffect(() => {
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
    setEventDetails(
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
    // contractNameState,
    addressState,
    riskCategoryState,
    abiState,
  ]);

  const options = eventDetails.map((event) => ({
    label: `${event.name}`,
    value: event.name,
  }));
  // (${event.inputs})
  // Handle event selection and prompt for arguments (UPDATED)
  const handleEventSelection = (selectedOptions) => {
    const newSelectedEvents = {};
    selectedOptions.forEach((option) => {
      const eventName = option.value;
      const eventDetail = eventDetails.find((event) => event.name === eventName);

      if (!selectedEvents[eventName]) {
        // Initialize new selected event with arguments and details
        newSelectedEvents[eventName] = {
          args: Array(eventDetail.inputs.split(", ").length).fill(''),
          argDetails: eventDetail.inputs.split(", ").map((arg) => {
            const [name, type] = arg.split(": ");
            return { name, type }; // Extract name and type
          }),
        };
      } else {
        // Preserve existing arguments if the event is already selected
        newSelectedEvents[eventName] = selectedEvents[eventName];
      }
    });

    // Update state with new selected events
    setSelectedEvents(newSelectedEvents);

    // Update the list of selected event names for display purposes
    setSelectedEventNames(selectedOptions.map((option) => option.label));
  };



  const web3 = new Web3();

  // const handleSaveMonitor = async () => {
  //   // Prepare data for valid events
  //   const validEventEntries = Object.entries(selectedEvents);
  
  //   // Prepare navigation state
  //   const navigationState = {
  //     abi:abi,
  //     name: name,
  //     network: network,
  //     address: address,
  //     rk: rk,
  //     m_id: mid,
  //     email: email,
  //     token: token,
  //     selectedEventNames: selectedEventNames,
  //   };
  
  //   // Process each event
  //   const eventPromises = validEventEntries.map(async ([eventName, eventDataEntry]) => {
  //     const event = eventDetails.find((e) => e.name === eventName);
  //     if (!event) {
  //       console.error("Event not found in eventDetails:", eventName);
  //       return; // Exit if the event is not found
  //     }
  
  //     // Ensure args is an array
  //     const argsArray = Array.isArray(eventDataEntry.args)
  //       ? eventDataEntry.args
  //       : eventDataEntry.args.split(",").map(arg => arg.trim());
  
  //     // Ensure operators is an array
  //     const operatorsArray = Array.isArray(eventDataEntry.operators)
  //       ? eventDataEntry.operators
  //       : [];
  
  //     // Map argument details from event inputs
  //     const argDetails = event.inputs.split(", ").map((arg) => {
  //       const [name, type] = arg.split(": ");
  //       return { name, type };
  //     });
  
  //     const argsObject = argDetails.reduce((acc, { name, type }, index) => {
  //       const value = argsArray[index];
  //       const operator = operatorsArray[index] || ''; // Default operator if not provided
        
  //       if (type.startsWith('uint') && !type.startsWith('uint[]')) {
  //         // Apply the operator to 'uint' type values (but not for 'uint[]')
  //         acc[name] = `${operator}${value}`;
  //       } else if (type.startsWith('uint[]')) {
  //         // Handle 'uint[]' types by adding values without operator and colon
  //         const valuesArray = value.split(',').map(val => val.trim());
  //         acc[name] = valuesArray.join(', '); // Just values without operator and colon
  //       } else {
  //         // Just the value for non-uint types
  //         acc[name] = value;
  //       }
      
  //       return acc;
  //     }, {});
      
      
      
      
  
  //     // Check if 'inputs' is available and correctly formatted
  //     if (!event.inputs || typeof event.inputs !== "string") {
  //       console.error("Event inputs are not correctly formatted:", event.inputs);
  //       return;
  //     }
  
  //     // Generate the event signature
  //     const eventSignatureInputs = event.inputs.split(", ")
  //       .map((input) => {
  //         const [, type] = input.split(": ");
  //         return type;
  //       })
  //       .join(",");
  
  //     const eventSignatureData = `${event.name}(${eventSignatureInputs})`;
  //     let eventSignature;
  //     try {
  //       eventSignature = web3.eth.abi.encodeEventSignature(eventSignatureData);
  //     } catch (error) {
  //       console.error("Failed to encode event signature:", error, "with data:", eventSignatureData);
  //       return;
  //     }
  
  //     const body = {
  //       name: eventName,
  //       mid: mid,
  //       signature: eventSignature,
  //       arguments: argsObject,
  //     };
  
  //     // Send data to the server
  //     try {
  //       const response = await axios.post(`${baseUrl}/add_event`, body,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //         }
  //       );
  //       if(response.status === 401){
  //         toast.error("Session Expired, Please login again",
  //           {
  //             autoClose: 500,
  //             onClose: () => {
  //               localStorage.clear();
  //               navigate("/login");
  //             },
  //           }
  
  //         )
  //       }
  //       if(response.status === 403){
  //         toast.error("Unauthorized Access, Please login again",
  //           {
  //             autoClose: 500,
  //             onClose: () => {
  //               localStorage.clear();
  //               navigate("/login");
  //             },
  //           }
  
  //         )
  //       }
  //       console.log("Event added:", response.data);
  //       const updatedNavigationState = {
  //         ...navigationState,
  //         ...response.data, // Merge response data into the navigation state
  //       };
  //       console.log("Updated Navigation State:", updatedNavigationState);
        

  //       // Show success message and navigate to alerts
  //       toast.success("Event Added successfully!", {
  //         autoClose: 500,
  //         onClose: () => {
  //           navigate("/autodefend", { state: updatedNavigationState });
  //           // navigate("/alerts", { state: navigationState });
  //         },
  //       });
  //     } catch (error) {
  //       console.error("Error sending event data:", error);
  //       toast.error("Failed to Add Event. Please try again!");
  //     }
  //   });
  
  //   // Wait for all events to be processed
  //   await Promise.all(eventPromises);
  // };

  const handleSaveMonitor = async () => {
    const validEventEntries = Object.entries(selectedEvents);
  
    // Prepare initial navigation state
    const navigationState = {
      abi: abi,
      name: name,
      network: network,
      address: address,
      rk: rk,
      m_id: mid,
      email: email,
      token: token,
      selectedEventNames: selectedEventNames,
    };
  
    const responseDatas = []; // Array to collect all response data
  
    const eventPromises = validEventEntries.map(async ([eventName, eventDataEntry]) => {
      const event = eventDetails.find((e) => e.name === eventName);
      if (!event) {
        console.error("Event not found in eventDetails:", eventName);
        return;
      }
  
      const argsArray = Array.isArray(eventDataEntry.args)
        ? eventDataEntry.args
        : eventDataEntry.args.split(",").map((arg) => arg.trim());
  
      const operatorsArray = Array.isArray(eventDataEntry.operators)
        ? eventDataEntry.operators
        : [];
  
      const argDetails = event.inputs.split(", ").map((arg) => {
        const [name, type] = arg.split(": ");
        return { name, type };
      });
  
      const argsObject = argDetails.reduce((acc, { name, type }, index) => {
        const value = argsArray[index];
        const operator = operatorsArray[index] || '';
        acc[name] = type.startsWith('uint') && !type.startsWith('uint[]') ? `${operator}${value}` : value;
        return acc;
      }, {});
  
      const eventSignatureInputs = event.inputs.split(", ")
        .map((input) => input.split(": ")[1])
        .join(",");
  
      const eventSignatureData = `${event.name}(${eventSignatureInputs})`;
      let eventSignature;
      try {
        eventSignature = web3.eth.abi.encodeEventSignature(eventSignatureData);
      } catch (error) {
        console.error("Failed to encode event signature:", error);
        return;
      }
  
      const body = {
        name: eventName,
        mid: mid,
        signature: eventSignature,
        arguments: argsObject,
      };
  
      try {
        const response = await axios.post(`${baseUrl}/add_event`, body, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (response.status === 401) {
          toast.error("Session Expired, Please login again", {
            autoClose: 500,
            onClose: () => {
              localStorage.clear();
              navigate("/login");
            },
          });
          return;
        }
  
        if (response.status === 403) {
          toast.error("Unauthorized Access, Please login again", {
            autoClose: 500,
            onClose: () => {
              localStorage.clear();
              navigate("/login");
            },
          });
          return;
        }
  
        console.log("Event added:", response.data);
        responseDatas.push(response.data); // Collect response data
      } catch (error) {
        console.error("Error sending event data:", error);
        toast.error("Failed to Add Event. Please try again!");
      }
    });
  
    await Promise.all(eventPromises);
  
    // Merge responseDatas into navigationState
    const updatedNavigationState = {
      ...navigationState,
      responseDatas, // Add all response data as an array
    };
  
    console.log("Updated Navigation State:", updatedNavigationState);
  
    // Show success message and navigate to autodefend
    toast.success("Events Added successfully!", {
      autoClose: 500,
      onClose: () => {
        navigate("/autodefend", { state: updatedNavigationState });
      },
    });
  };
  

  const copymessage = () => {
    navigator.clipboard.writeText(addressState);
    toast.success("Address Copied successfully!");
  }




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
                Create Monitor
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
    
            <div className=" w-[98%] sm:w-[400px] bg-white md:bg-inherit md:border-0 py-2 rounded-md border-2  px-2">
    
              <div className="flex flex-col justify-center items-center gap-6">
                <div className="font-medium text-lg" style={{ color: "black" }}>
                  Enter the Signature Name
                </div>
                <div className="my-auto   min-w-full">
                  {/* w-inherit border-2 border-[#B4B4B4] shadow-md p-3 rounded-lg flex px-3 justify-between py-3 */}
    
                  <div className="w-full">
                    <Select
                      options={options}
                      isMulti
                      closeMenuOnSelect={false}
                      components={{ Option: components.Option }}
                      onChange={handleEventSelection}
                      className="w-full"
                      classNamePrefix="select"
                      placeholder="Search and select events..."
                      noOptionsMessage={() => "No events found"}
                      value={options.filter((option) =>
                        selectedEventNames.includes(option.label)
                      )} // Filter options based on selectedEventNames
                    />
                  </div>
                </div>
              </div>
    
              <div className="w-full  max-h-[400px] p-5 overflow-y-auto mb-4 edit-event mt-2">
              {Object.entries(selectedEvents).map(([eventName, eventData]) => {
    // Access the argument details directly as an array of objects
    const args = eventData.argDetails || [];

    // Ensure eventData.args and eventData.operators are arrays
    const eventArgs = Array.isArray(eventData.args) ? eventData.args : [];
    const eventOperators = Array.isArray(eventData.operators) ? eventData.operators : [];

    return (
      <div key={eventName} className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">{eventName}</h3>
        {args.length > 0 ? (
          args.map((arg, index) => (
            <div key={index} className="mb-4 flex flex-col space-y-1">
              <label className="text-gray-700 text-sm font-medium">{`${arg.name} :`}</label>
              <div className="flex flex-col md:flex-row md:items-center md:space-x-3">
                {/* Input field for argument values */}
                {arg.type === "bool" ? (
                  <select
                    className="rounded-lg border border-gray-300 shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 py-2 w-full"
                    name="argument"
                    onChange={(e) => handleArgumentChange(e, eventName, index, "argument")}
                    value={eventArgs[index] || "none"}
                  >
                    <option value="none" hidden>None</option>
                    <option value="true">True</option>
                    <option value="false">False</option>
                  </select>
                ) : (
                  <input
                    className="flex-1 rounded-lg p-3 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{ backgroundColor: "#F9FAFB" }}
                    type="text"
                    name="argument"
                    value={eventArgs[index] || ""}
                    onChange={(e) => handleArgumentChange(e, eventName, index, "argument")}
                    placeholder={`Enter value for ${arg.name}`}
                  />
                )}
                {/* Operator selection dropdown */}
                {["uint8", "uint16", "uint32", "uint64", "uint128", "uint256", "int8", "int16", "int32", "int64", "int128", "int256"].includes(arg.type) ? (
                  <select
                    className="rounded-lg border border-gray-300 shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 py-2 w-full md:w-auto"
                    name="operator"
                    onChange={(e) => handleArgumentChange(e, eventName, index, "operator")}
                    value={eventOperators[index] || "none"}
                  >
                    <option value="none" hidden>Select Operator</option>
                    <option value="<::">&lt;</option>
                    <option value=">::">&gt;</option>
                    <option value="==::">==</option>
                  </select>
                ) : null}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm">No arguments available for this event.</p>
        )}
      </div>
    );
  })}
    
    
    
              </div>
              
              <button
  className={`py-3 w-full rounded-lg text-white ${
   Object.keys(selectedEvents).length > 0
      ? "bg-[#2D5C8F] hover:bg-[#245078]"
      : "bg-[#2D5C8F]/50 cursor-not-allowed"
  }`}
  onClick={handleSaveMonitor}
  disabled={!(Object.keys(selectedEvents).length > 0)}
>
  Save Alert
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
                {Object.keys(selectedEvents).length > 0 ? (
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
                )}
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

export default Events;
