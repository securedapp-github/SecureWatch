import Navbar from "./NewNavbar";
import { useLocation, useNavigate,Link } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import axios from "axios";
import Select from "react-select";
import { components } from 'react-select';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NewNavbar from "./NewNavbar";
import Sidebar from "./Sidebar";
import { Buffer } from 'buffer'; // Import for Base64 encoding
import { IoMdCheckmarkCircle } from "react-icons/io";
import { IoCheckmarkCircleOutline } from "react-icons/io5";
const CustomDropdown = ({ options, onChange, value }) => {
  return (
    <Select
      isMulti
      options={options}
      onChange={onChange}
      value={value}
      components={{ Option: CheckboxOption }}
    />
  );
};
const CheckboxOption = (props) => {
  return (
    <components.Option {...props}>
      <input
        type="checkbox"
        checked={props.isSelected}
        onChange={() => null} // Prevents default change event
      />
      {props.label}
    </components.Option>
  );
};
function AlgoEvents() {
    const navigate = useNavigate();
    const location = useLocation();
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState('');
    const userEmail = localStorage.getItem("email");
    const [Arguments,setArguments]=useState('');
    const { name, email, m_id, token, network, address, rk, abi,category,Algoevents } = location.state || "";
    const [networkState, setNetworkState] = useState(network || ""); 
    const [addressState, setAddressState] = useState(address || "");
    const [riskCategoryState, setRiskCategoryState] = useState(rk || "");
    const [selectedEvents, setSelectedEvents] = useState({});
    const [selectedTxnTypes, setSelectedTxnTypes] = useState([]);
    const [disp1, setDisp1] = useState("none"); // Added missing useState hook
    const [disp2, setDisp2] = useState("none"); // Assuming disp2 is also required
    const [axferSender, setAxferSender] = useState('');
const [axferReceiver, setAxferReceiver] = useState('');
const [axferAmount, setAxferAmount] = useState('');
const [axferComparison, setAxferComparison] = useState('<');
//const {inputType} = location.state; // Default comparison operator
//const [axferCommission, setAxferCommission] = useState('');


    // console.log("code:",abi);
     console.log("type:", category);
     console.log("mid:", location.state);
     console.log("methodsfrom code:",Algoevents);
    
    // Fetch events from the server when the component mounts

    const txnOptionsCategory1 = [
     
      { value: "acfg", label: "Asset Configuration Transaction (acfg)" },
      { value: "axfer", label: "Asset Transfer Transaction (axfer)" },
      { value: "afrz", label: "Asset Freeze Transaction (afrz)" }
    ];

    const txnOptionsCategory2 = [
      { value: "pay", label: "Payment Transaction (pay)" },
      { value: "acfg", label: "Asset Configuration Transaction (acfg)" },
      { value: "axfer", label: "Asset Transfer Transaction (axfer)" },
      { value: "afrz", label: "Asset Freeze Transaction (afrz)" }
    ];
    
    const handleTxnTypeSelection = (selectedOptions) => {
      const selectedValues = selectedOptions ? selectedOptions.map(option => option.value) : [];
      setSelectedTxnTypes(selectedValues);
    };
    
    const formatTxnTypesForApi = () => {
      const allOptions = category === 2 ? txnOptionsCategory1 : txnOptionsCategory2;
      return allOptions.reduce((acc, option) => {
        const isAxfer = option.value === "axfer";
        const formattedAmount = axferAmount
          ? `${axferComparison}::${axferAmount}`
          : "";
    
        acc[option.value] = {
          active: selectedTxnTypes.includes(option.value),
          ...(isAxfer && selectedTxnTypes.includes("axfer") && {
            sender: axferSender || "",
            receiver: axferReceiver || "",
            amount: formattedAmount,
          }),
        };
        return acc;
      }, {});
    };
    
    

    const encodeToBase64 = (str) => {
      return Buffer.from(str).toString('base64');
  };

  const ApprovalformatMethodsForApi = () => {
    const methods = {};
    Object.entries(selectedEvents).forEach(([eventName, eventDetails]) => {
        const base64Name = encodeToBase64(eventName); // Encode method name to Base64
        methods[base64Name] = {
            name: eventName
        };
    });
    return methods;
};
const Approvaloptions = Algoevents.map((eventName) => ({
    label: eventName,
    value: eventName,
}));

  // const AbiformatMethodsForApi = () => {
  //   const methods = {};
  //   Object.entries(selectedEvents).forEach(([eventName, eventDetails]) => {
  //     const base64Name = encodeToBase64(eventName); // Encode method name to Base64
      
  //     const formattedArgs = eventDetails.args.map((arg, index) => {
  //       const userValue = eventDetails.argValues[index] || "value not provided";
  //       return `${arg}: ${userValue}`; // Include both argument name and user value
  //     });
  
  //     methods[base64Name] = {
  //       name: eventName,
  //       args: formattedArgs,
  //     };
  //   });
  //   return methods;
  // };
  

  const AbiformatMethodsForApi = () => {
    const methods = {};
  
    Object.entries(selectedEvents).forEach(([eventName, eventDetails]) => {
      const base64Name = encodeToBase64(eventName); // Encode method name to Base64
  
      // Prepare arguments with only name-value pairs
      const formattedArgs = {};
      // eventDetails.args.forEach((arg, index) => {
      //   const [argName] = arg.split(":").map(str => str.trim()); // Extract the argument name
      //   formattedArgs[argName] = eventDetails.argValues[index] || ""; // Assign value or empty string
      // });
  
      methods[base64Name] = {
        name: eventName,
        ...formattedArgs, // Spread arguments as individual properties
      };
    });
  
    return methods;
  };
  
  
  const Abioptions = Algoevents.map((event) => ({
    label: event.name,
    value: event.name,
  }));

    // Handle event selection and prompt for arguments
    const handleEventSelection = (selectedOptions) => {
        const newSelectedEvents = {};
        selectedOptions.forEach((option) => {
          const method = Algoevents.find(m => m.name === option.value);
          newSelectedEvents[method.name] = {
            args: method.args,
            argValues: Array(1).fill(""), // Initialize empty values
          };
        });
        setSelectedEvents(newSelectedEvents);
      };

      
      // const handleArgumentChange = (e, eventName, argIndex) => {
      //   setSelectedEvents((prevEvents) => ({
      //     ...prevEvents,
      //     [eventName]: {
      //       ...prevEvents[eventName],
      //       argValues: prevEvents[eventName].argValues.map((val, i) =>
      //         i === argIndex ? e.target.value : val
      //       ),
      //     },
      //   }));
      // };
      
    const handleSaveMonitor = async () => {
      let formattedData;
      if(category === 2){
        
       formattedData = AbiformatMethodsForApi();
    
       
      }
      else {
        formattedData = formatTxnTypesForApi();
        
      }
      let navigationState = {
          monitorName: name,
          network: network,
          address: address,
          rk: rk,
          m_id: m_id,
          email: email,
          token: token,
          selectedEventNames: Object.keys(selectedEvents),
          abi:abi,
          category:category,
      };
  
  
  try {
    const body = {
        name: "Algorand_event",
        mid: m_id,
        algo: formattedData // Full "algo" object with txn types and methods
    };

    // Send a single API request
    const response = await axios.post("https://139-59-5-56.nip.io:3443/add_event", body, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
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
    console.log("Added events:", response.data);
    toast.success("Event Added successfully!", {
        autoClose: 500,
        onClose: () => {
            navigate("/alerts", { state: navigationState });
        },
    });
} catch (error) {
    console.error("Error sending event data:", error);
    toast.error("Failed to Add Event. Please try again!");
}
};
  

  const currentOptions = category === 2 ? txnOptionsCategory1 : txnOptionsCategory2;
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
    
    
    
            
    
            <div className="w-[98%] sm:w-[400px] bg-white md:bg-inherit md:border-0 py-2 rounded-md border-2  px-2">
      <div className="flex flex-col space-y-5">
        
      
    {category === 1 && (
      <>
        <div className="font-medium text-lg" style={{ color: "black" }}>
          Choose Txn Type for receiving alerts:
        </div>
        <div>
          <CustomDropdown
            options={currentOptions}
            onChange={handleTxnTypeSelection}
            value={currentOptions.filter(option => selectedTxnTypes.includes(option.value))}
          />
        </div>
    
        {/* Conditionally render input fields for axfer */}
        {selectedTxnTypes.includes("axfer") && (
          <div className="mt-3">
            <div className="font-medium" style={{ color: "black" }}>
              Asset Transfer Transaction (axfer) Details
            </div>
            <input
              type="text"
              placeholder="Enter sender address"
              className="w-full rounded-lg p-3 outline-none border border-[#4C4C4C] bg-white mt-2"
              value={axferSender}
              onChange={(e) => setAxferSender(e.target.value)}
            />
            <input
              type="text"
              placeholder="Enter receiver address"
              className="w-full rounded-lg p-3 outline-none border border-[#4C4C4C] bg-white mt-2"
              value={axferReceiver}
              onChange={(e) => setAxferReceiver(e.target.value)}
            />
            <div className="flex items-center gap-2 mt-2">
          {/* Operator Dropdown */}
          <select
            className="w-2/7 rounded-lg p-2 outline-none border border-[#4C4C4C] bg-white"
            value={axferComparison}
            onChange={(e) => setAxferComparison(e.target.value)}
          >
            <option value="<">&lt;</option>
            <option value=">">&gt;</option>
            <option value="=">=</option>
          </select>
    
            
          <input
            type="number"
            placeholder="amount"
            className="w-2/3 rounded-lg p-3 outline-none border border-[#4C4C4C] bg-white"
            value={axferAmount}
            onChange={(e) => setAxferAmount(e.target.value)}
          />
    
        </div>
          </div>
        )}
      </>
    )}
    
    
        {/* Signature Name Input */}
        {category !== 1 && (
      <>
        <div className="font-medium text-lg" style={{ color: "black" }}>
          Select Methods
        </div>
        <div>
          <Select
            isMulti
           // options={inputType === "Approval Program" ? Approvaloptions : Abioptions}
           options = {Abioptions}
            onChange={handleEventSelection}
            value={
                 Abioptions.filter(
                  option => selectedEvents[option.value]
                )
              }
            closeMenuOnSelect={false}
            hideSelectedOptions={false}
            components={{
              Option: (props) => {
                const { data, innerRef, innerProps } = props;
                const isSelected = selectedEvents[data.value];
                return (
                  <div ref={innerRef} {...innerProps} className="flex items-center p-2">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => props.selectOption(data)}
                      className="mr-2"
                    />
                    {data.label}
                  </div>
                );
              },
            }}
          />
        </div>
      </>
    )}
    
    {/* <div>
      {Object.entries(selectedEvents).map(([eventName, eventData]) => (
        <div key={eventName} className="font-medium mt-3">
          <div>{eventName}</div>
          {eventData.args.map((arg, index) => (
            <input
              key={`${eventName}-arg-${index}`}
              className="w-full rounded-lg p-3 outline-none border border-[#4C4C4C] mt-2"
              style={{ backgroundColor: "white" }}
              type="text"
              value={eventData.argValues?.[index] || ""}
              onChange={(e) => handleArgumentChange(e, eventName, index)}
              placeholder={`Enter ${arg}`}
            />
          ))}
        </div>
      ))}
    </div> */}
    </div>
              <button
                className="py-3 w-full bg-[#2D5C8F] mt-10 rounded-lg text-white"
                onClick={handleSaveMonitor}
              >
                Save Monitor
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

 export default AlgoEvents;
