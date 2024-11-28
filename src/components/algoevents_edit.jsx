import React, { useState, useEffect } from "react";
import { json, useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./navbar2";
import Select from 'react-select'
import axios from "axios";
import { baseUrl } from "../Constants/data";
import { components } from 'react-select';
import Events from "./events";
import { Buffer } from "buffer";

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

function AlgoEventsedit() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const [options, setOptions] = useState([]);
  const [foundedEvents, setFoundedEvents] = useState([]);
  const [selectedValues, setSelectedValues] = useState([]);
  const [totalEvents, setTotalEvents] = useState([]);
  const [removedEvents, setRemovedEvents] = useState([]);
  const [selectedTransactionTypes, setSelectedTransactionTypes] = useState([]);
  const [selectedTxnTypes, setSelectedTxnTypes] = useState([]);
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [allEvents, setAllEvents] = useState({});
  const [monitorData, setMonitorData] = useState(null);
  const [axferReceiver, setAxferReceiver] = useState('');
const [axferAmount, setAxferAmount] = useState('');
const [axferComparison, setAxferComparison] = useState('<'); 
const [axferSender, setAxferSender] = useState('');
const [axferActive, setAxferActive] = useState(false);

  console.log("Selected values:", selectedValues.length);

  const { name, email, m_id, network, abi, address, rk, alert_data, alert_type, Algoevents } = location.state || "";
  const { category: category, ...otherState } = location.state || {};
  console.log("alert_data",alert_data);
  console.log("category:", category);
  console.log("methods are:", Algoevents);

  console.log("alert_type",alert_type);
  console.log("mid:",m_id);
  
  const [networkState, setNetworkState] = useState(network || "");
  const [addressState, setAddressState] = useState(address || "");
  const [riskCategoryState, setRiskCategoryState] = useState(rk || "");
  const [eventOperators, setEventOperators] = useState({});
  const [abiState, setAbiState] = useState(abi || "");
  const [eventInputs, setEventInputs] = useState({});
 // const mid = m_id;

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

    // Check if "axfer" is selected
    const isAxferSelected = selectedValues.includes("axfer");
    setAxferActive(isAxferSelected);
  
    // Reset axfer-specific fields if "axfer" is deselected
    if (!isAxferSelected) {
      setAxferSender('');
      setAxferReceiver('');
      setAxferAmount('');
      setAxferComparison('=');
    }
};


// const formatTxnTypesForApi = () => {
//   const allOptions = category === 2 ? txnOptionsCategory1 : txnOptionsCategory2;
//   return allOptions.reduce((acc, option) => {
//     acc[option.value] = {
//       active: selectedTxnTypes.includes(option.value)
//     };
//     return acc;
//   }, {});
// };

const formatTxnTypesForApi = () => {
  const allOptions = category === 2 ? txnOptionsCategory1 : txnOptionsCategory2;
  return allOptions.reduce((acc, option) => {
    const isAxfer = option.value === "axfer";

    // Include axfer object with "active": false if axferActive is false
    if (isAxfer) {
      acc[option.value] = {
        active: axferActive,
        ...(axferActive && {
          sender: axferSender || "",
          receiver: axferReceiver || "",
          amount: axferAmount ? `${axferComparison}::${axferAmount}` : "",
        }),
      };
    } else {
      // Handle other transaction types normally
      acc[option.value] = {
        active: selectedTxnTypes.includes(option.value),
      };
    }

    return acc;
  }, {});
};

const encodeToBase64 = (str) => {
  return Buffer.from(str).toString('base64');
};

const formatMethodsForApi = () => {
  const methods = {};
  Object.entries(selectedValues).forEach(([eventid,eventName]) => {
      const base64Name = encodeToBase64(eventName); // Encode method name to Base64
      methods[base64Name] = {
          name: eventName
      };
  });
  return methods;
};

  useEffect(() => {
    const parsedOptions = Algoevents.map((eventName) => ({
      label: eventName,
      value: eventName,
    }));
    // (${event.inputs})
    console.log("Parsed options are:", parsedOptions);
    setTotalEvents(parsedOptions)
  }, [Algoevents])

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

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        const events = data.monitors || [];
        console.log("events:", events);
        setEvents(events);

        // Extracting the latest algo data from monitors array
        let algoData = data.monitors[data.monitors.length - 1].algo;

        // Log the API response to check transaction types
        console.log("API Response:", algoData);

        // If category is 1, we extract the methods
        if (category === 2) {
          const methods = algoData || {};
          const methodNames = Object.keys(methods).map(methodKey => {
            const decodedKey = atob(methodKey); // Decode base64 to regular string
            return methods[methodKey].name || decodedKey;
          });
          console.log('Method names for event selection:', methodNames);

          // Initialize options based on events
          const newOptions = events.map(event => ({
            label: event.name,
            value: event.name,
          }));
          setOptions(newOptions);

          // Set selected method names in the dropdown
          setSelectedValues(methodNames);
        }

        // If category is 2, we extract txnTypes
        if (category === 1) {
          const txnTypes = algoData || {}; // Check if txnTypes is in the response
          const selectedTxnTypesFromApi = Object.keys(algoData)
            .filter((key) => algoData[key]?.active === true);
          console.log('Selected txn types from API:', selectedTxnTypesFromApi);

          // Set the selected transaction types in the state
          setSelectedTxnTypes(selectedTxnTypesFromApi);

        }

        if (algoData.axfer?.active) {
          setAxferActive(true);
          setAxferSender(algoData.axfer.sender || '');
          setAxferReceiver(algoData.axfer.receiver || '');
          const amountField = algoData.axfer.amount || '';
          const comparisonMatch = amountField.match(/([<>=])::(.+)/);
          if (comparisonMatch) {
            setAxferComparison(comparisonMatch[1] || '=');
            setAxferAmount(comparisonMatch[2] || '');
          }
          
        }

      } catch (error) {
        console.error("Failed to fetch events:", error);
      }
    };

    

    fetchMonitorEvents();
  }, [m_id, category]);  // category is now also a dependency


  useEffect(() => {
    
    // console.log("Events are:", events);
    // console.log("Event Inputs are:", eventInputs);
    // console.log("Event Operators are:", eventOperators);
    console.log("Selected values:", selectedValues);
  }, [events, eventInputs, eventOperators, selectedValues]);
  


const handleSelectChange = (selectedOptions) => {
  const values = selectedOptions.map(option => option.value);
  
  // Identify removed events
  const newlyRemovedEvents = selectedValues.filter(value => !values.includes(value));

  // Add removed events to the removedEvents state
  setRemovedEvents(prevRemoved => [
      ...prevRemoved,
      ...newlyRemovedEvents.map(eventName => {
          const eventId = selectedValues.find(event => event.name === eventName)?.id;
          return eventId ? { name: eventName, id: eventId } : null;
      }).filter(Boolean) // Remove null entries
  ]);

  setSelectedValues(values);
};


  // Ensure ABI data is correctly parsed
  const abiData = (abiState || '[]');
  const abiEventsMap = abiData;
   
 const navigationState = {
    monitorName: name,
    network: networkState,
    address: addressState,
   // rk: riskCategoryState,
    m_id: m_id,
    email: email,
    token: token,
    alert_data: alert_data,
    alert_type: alert_type,
    //category: category
  };
console.log("monitor data:",events);

const handleSubmit = async () => {
  try {
    const errors = [];
    const processingEvents = [];
    let hasChanges = false;

    // Helper function to send requests
    const sendRequest = async (url, method, data) => {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(`Error fetching data from ${url}`);
      }
      return response.json(); // Return response JSON for further processing
    };

    // Check if 'events' is an array. If it's not, handle it accordingly
    let eventsArray = Array.isArray(events) ? events : Object.values(events);

    
    // Only keep the last event, assuming it's the last one in the array
    const lastEvent = eventsArray[eventsArray.length - 1]; // Access the last event
    const eventsToDelete = eventsArray.slice(0, -1); // All except the last event

    // Process deletion of other events
    for (const event of eventsToDelete) {
      if (event.id) {
        processingEvents.push(
          sendRequest(`${baseUrl}/delete_event`, "POST", { id: event.id })
            .then(response => {
              console.log(`Event ${event.name} deleted successfully!`, response);
              hasChanges = true;
            })
            .catch(error => {
              console.error(`Error deleting ${event.name}:`, error);
              errors.push({
                eventType: event.name,
                message: `Failed to delete ${event.name} event. Please try again!`,
              });
            })
        );
      }
    }

    // After deleting all unnecessary events, update the last one
    let formattedData;
    if(category === 1){
      formattedData = formatTxnTypesForApi();
    }
    if (category !== 1) {
      formattedData = formatMethodsForApi();
    }

    // 3. Create the JSON object to send
    const dataToSend = {
      name: "Algorand_event",
      mid: m_id, // This contains the active transaction types
      algo: formattedData, // This contains the selected methods with base64-encoded names
    };

    console.log('Data to send:', dataToSend);

    // 4. Update the last event with the new data
    try {
      await sendRequest(`${baseUrl}/update_event`, 'POST', {
        id: lastEvent.id, // Include the ID of the last event
        ...dataToSend, // Include the formatted data
      });
      toast.success('Event updated successfully!');
      hasChanges = true;
    } catch (error) {
      console.error('Error updating last event:', error);
      errors.push({ message: 'Failed to update last event. Please try again!' });
    }

    // Handle any changes
    if (hasChanges) {
      toast.success('Events processed successfully!', {
        autoClose: 500,
        onClose: () => {
          navigate('/alert_edit', { state: navigationState });
        },
      });
    } else {
      toast.error('Failed to process events. Please try again!');
      errors.forEach(({ message }) => toast.error(message));
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    toast.error('An unexpected error occurred. Please try again!');
  }
};




useEffect(() => {
  // Fetch previously selected transaction types (if available) and set them
  if (alert_data && alert_data.transactionTypes) {
    console.log("Alert data txn types:", alert_data.transactionTypes);
    //setSelectedTxnTypes(alert_data.transactionTypes);
  }
}, [alert_data]);
//console.log("Current Options: ", currentOptions);
console.log("Selected Transaction Types: ", selectedTxnTypes);
const currentOptions = category === 2 ? txnOptionsCategory1 : txnOptionsCategory2;

  if (
    !selectedTxnTypes ||
    !Array.isArray(selectedTxnTypes)
  ) {
    return (
      <div
        className="font-poppin pt-2 bg-white min-h-full"
        style={{ backgroundColor: "#FCFFFD" }}
      >
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
        <Navbar email={email} />
        <div className="w-full mx-auto mt-10 md:mt-20 flex items-center justify-center flex-col gap-7  flex-wrap md:flex-row md:gap-10 lg:gap-20">

          <div className="">
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
            <div className="text-3xl font-medium mt-3" style={{ color: "black" }}>
              Edit Monitor
            </div>
            <div
              className="mt-10 flex gap-2 px-4 py-3 rounded-2xl"
              style={{ border: "1px solid #CACACA" }}
            >
              <div className="my-auto">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clip-path="url(#clip0_173_1156)">
                    <path
                      d="M18.3327 9.23333V10C18.3317 11.797 17.7498 13.5456 16.6738 14.9849C15.5978 16.4241 14.0854 17.4771 12.3621 17.9866C10.6389 18.4961 8.79707 18.4349 7.11141 17.8122C5.42575 17.1894 3.98656 16.0384 3.00848 14.5309C2.0304 13.0234 1.56584 11.2401 1.68408 9.44693C1.80232 7.6538 2.49702 5.94694 3.66458 4.58089C4.83214 3.21485 6.41 2.26282 8.16284 1.86679C9.91568 1.47076 11.7496 1.65195 13.391 2.38333"
                      stroke="#0CA851"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M18.3333 3.33325L10 11.6749L7.5 9.17492"
                      stroke="#0CA851"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_173_1156">
                      <rect width="20" height="20" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
              <div className="my-auto" style={{ color: "black" }}>
                General Information
              </div>
              <div className="my-auto ml-auto">
                <svg
                  width="27"
                  height="26"
                  viewBox="0 0 27 26"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11.5059 18.6469L16.5765 13.5763L11.5059 8.50562"
                    stroke="black"
                    stroke-width="1.69021"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
            </div>
            <div
              className="mt-10 flex gap-2 px-4 py-3 rounded-2xl"
              style={{ border: "1px solid #0CA851" }}
            >
              <div className="my-auto">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clip-path="url(#clip0_173_1156)">
                    <path
                      d="M18.3327 9.23333V10C18.3317 11.797 17.7498 13.5456 16.6738 14.9849C15.5978 16.4241 14.0854 17.4771 12.3621 17.9866C10.6389 18.4961 8.79707 18.4349 7.11141 17.8122C5.42575 17.1894 3.98656 16.0384 3.00848 14.5309C2.0304 13.0234 1.56584 11.2401 1.68408 9.44693C1.80232 7.6538 2.49702 5.94694 3.66458 4.58089C4.83214 3.21485 6.41 2.26282 8.16284 1.86679C9.91568 1.47076 11.7496 1.65195 13.391 2.38333"
                      stroke="#0CA851"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M18.3333 3.33325L10 11.6749L7.5 9.17492"
                      stroke="#0CA851"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_173_1156">
                      <rect width="20" height="20" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
              <div className="my-auto" style={{ color: "black" }}>
                Events
              </div>
              <div className="my-auto ml-auto">
                <svg
                  width="27"
                  height="26"
                  viewBox="0 0 27 26"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="0.832031"
                    y="26"
                    width="26"
                    height="26"
                    rx="2.92308"
                    transform="rotate(-90 0.832031 26)"
                    fill="#0CA851"
                  />
                  <path
                    d="M11.5469 18.647L16.6175 13.5763L11.5469 8.50571"
                    stroke="white"
                    stroke-width="1.23515"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
            </div>
            <div
              className="mt-10 flex gap-2 px-4 py-3 rounded-2xl"
              style={{ border: "1px solid #CACACA" }}
              onClick={() => {
                navigate("/function", { state: { email, m_id, token } });
              }}
            >
              <div className="my-auto">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clip-path="url(#clip0_173_1156)">
                    <path
                      d="M18.3327 9.23333V10C18.3317 11.797 17.7498 13.5456 16.6738 14.9849C15.5978 16.4241 14.0854 17.4771 12.3621 17.9866C10.6389 18.4961 8.79707 18.4349 7.11141 17.8122C5.42575 17.1894 3.98656 16.0384 3.00848 14.5309C2.0304 13.0234 1.56584 11.2401 1.68408 9.44693C1.80232 7.6538 2.49702 5.94694 3.66458 4.58089C4.83214 3.21485 6.41 2.26282 8.16284 1.86679C9.91568 1.47076 11.7496 1.65195 13.391 2.38333"
                      stroke="#0CA851"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M18.3333 3.33325L10 11.6749L7.5 9.17492"
                      stroke="#0CA851"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_173_1156">
                      <rect width="20" height="20" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
              <div className="my-auto" style={{ color: "black" }}>
                Functions
              </div>
              <div className="ml-auto my-auto">
                <svg
                  width="27"
                  height="26"
                  viewBox="0 0 27 26"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11.5059 18.6469L16.5765 13.5763L11.5059 8.50562"
                    stroke="black"
                    stroke-width="1.69021"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
            </div>
            <div
              className="mt-10 flex gap-2 px-4 py-3 rounded-2xl"
              style={{ border: "1px solid #CACACA" }}
              onClick={() => {
                navigate("/alerts", { state: { email, m_id, token } });
              }}
            >
              <div className="my-auto">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clip-path="url(#clip0_173_1156)">
                    <path
                      d="M18.3327 9.23333V10C18.3317 11.797 17.7498 13.5456 16.6738 14.9849C15.5978 16.4241 14.0854 17.4771 12.3621 17.9866C10.6389 18.4961 8.79707 18.4349 7.11141 17.8122C5.42575 17.1894 3.98656 16.0384 3.00848 14.5309C2.0304 13.0234 1.56584 11.2401 1.68408 9.44693C1.80232 7.6538 2.49702 5.94694 3.66458 4.58089C4.83214 3.21485 6.41 2.26282 8.16284 1.86679C9.91568 1.47076 11.7496 1.65195 13.391 2.38333"
                      stroke="#0CA851"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M18.3333 3.33325L10 11.6749L7.5 9.17492"
                      stroke="#0CA851"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_173_1156">
                      <rect width="20" height="20" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
              <div className="my-auto" style={{ color: "black" }}>
                Alerts
              </div>
              <div className="my-auto ml-auto">
                <svg
                  width="27"
                  height="26"
                  viewBox="0 0 27 26"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11.5059 18.6469L16.5765 13.5763L11.5059 8.50562"
                    stroke="black"
                    stroke-width="1.69021"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="">
            <div className="font-medium text-lg" style={{ color: "black" }}>
              {loading ? (<span className="loading loading-spinner text-green-800"></span>) : "No Events Found"}
            </div>
          </div>

          <div className="border border-[#0CA851] shadow-md p-5 rounded-xl">
            <div className="text-lg font-medium" style={{ color: "black" }}>
              Monitor Summary
            </div>
            <div className="flex gap-2">
              <div>
                <div
                  className="text-center font-medium"
                  style={{ color: "black" }}
                >
                  Networks
                </div>
                <div className="text-white bg-[#0CA851] rounded-md p-2 text-[13px]">
                  {/* {networkState} */}
                  {networkState === 80002
                    ? "Amoy"
                    : networkState === 1
                      ? "Ethereum Mainnet"
                      : networkState === 11155111
                        ? "Sepolia Testnet"
                        : networkState === 137
                          ? "Polygon Mainnet"
                          : networkState === 1300
                          ? "Algorand Mainnet"
                          : networkState === 1301
                          ? "Algorand Testnet"
                          : "Unknown"}
                </div>
              </div>
              <div>
                <div
                  className="text-center font-medium"
                  style={{ color: "black" }}
                >
                  Risk Category
                </div>
                <div className=" bg-[#E9E9E9] rounded-md p-2 text-[13px]">
                  {rk}
                </div>
              </div>
            </div>
            <div className="mt-3">
              <div className="font-medium" style={{ color: "black" }}>
                Contracts
              </div>
              <div className="flex gap-1">
                <div className=" bg-[#E9E9E9] rounded-md p-2 text-[13px]">
                  {addressState}
                </div>
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
              </div>
            </div>
            <div className="mt-3">
              <div className="font-medium" style={{ color: "black" }}>
                Event Conditions
              </div>
              {/* {Object.keys(selectedEvents).length > 0 ? (
              <ul>
                {Object.entries(selectedEvents).map(
                  ([eventName, eventData]) => {
                    const argTypes = eventDetails
                      .find((e) => e.name === eventName)
                      .inputs.split(", ")
                      .map((arg) => arg.split(": ")[1]) // Extract only the types
                      .join(", "); // Join types with commas

                    return (
                      <li key={eventName} className="text-[13px]">
                        {eventName} ({argTypes})
                      </li>
                    );
                  }
                )}
              </ul>
            ) : (
              <div className="text-[13px]">No events selected</div>
            )} */}
            </div>
            <div className="mt-3">
              <div className="font-medium" style={{ color: "black" }}>
                Function Conditions
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
            <div className="mt-3">
              <div className="font-medium" style={{ color: "black" }}>
                Alerts
              </div>
              <div className="flex gap-1 items-center">
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
    );
  }
  const copyMessage = () => {
    navigator.clipboard.writeText(addressState);
    toast.success("Address Copied successfully!");
  }

  return (
    <div
      className="font-poppin pt-2 bg-white min-h-full"
      style={{ backgroundColor: "#FCFFFD" }}
    >
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
      <Navbar email={email} />
      <div className="mt-16 w-full flex justify-center items-center gap-10 flex-wrap">

        <div className="w-80 ">
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
          <div className="text-3xl font-medium mt-3" style={{ color: "black" }}>
            Edit Monitor
          </div>
          <div
            className="mt-10 flex gap-2 px-4 py-3 rounded-2xl"
            style={{ border: "1px solid #CACACA" }}
          >
            <div className="my-auto">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_173_1156)">
                  <path
                    d="M18.3327 9.23333V10C18.3317 11.797 17.7498 13.5456 16.6738 14.9849C15.5978 16.4241 14.0854 17.4771 12.3621 17.9866C10.6389 18.4961 8.79707 18.4349 7.11141 17.8122C5.42575 17.1894 3.98656 16.0384 3.00848 14.5309C2.0304 13.0234 1.56584 11.2401 1.68408 9.44693C1.80232 7.6538 2.49702 5.94694 3.66458 4.58089C4.83214 3.21485 6.41 2.26282 8.16284 1.86679C9.91568 1.47076 11.7496 1.65195 13.391 2.38333"
                    stroke="#0CA851"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M18.3333 3.33325L10 11.6749L7.5 9.17492"
                    stroke="#0CA851"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_173_1156">
                    <rect width="20" height="20" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </div>
            <div className="my-auto" style={{ color: "black" }}>
              General Information
            </div>
            <div className="my-auto ml-auto">
              <svg
                width="27"
                height="26"
                viewBox="0 0 27 26"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.5059 18.6469L16.5765 13.5763L11.5059 8.50562"
                  stroke="black"
                  stroke-width="1.69021"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
          </div>
          <div
            className="mt-10 flex gap-2 px-4 py-3 rounded-2xl"
            style={{ border: "1px solid #0CA851" }}
          >
            <div className="my-auto">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_173_1156)">
                  <path
                    d="M18.3327 9.23333V10C18.3317 11.797 17.7498 13.5456 16.6738 14.9849C15.5978 16.4241 14.0854 17.4771 12.3621 17.9866C10.6389 18.4961 8.79707 18.4349 7.11141 17.8122C5.42575 17.1894 3.98656 16.0384 3.00848 14.5309C2.0304 13.0234 1.56584 11.2401 1.68408 9.44693C1.80232 7.6538 2.49702 5.94694 3.66458 4.58089C4.83214 3.21485 6.41 2.26282 8.16284 1.86679C9.91568 1.47076 11.7496 1.65195 13.391 2.38333"
                    stroke="#0CA851"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M18.3333 3.33325L10 11.6749L7.5 9.17492"
                    stroke="#0CA851"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_173_1156">
                    <rect width="20" height="20" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </div>
            <div className="my-auto" style={{ color: "black" }}>
              Events
            </div>
            <div className="my-auto ml-auto">
              <svg
                width="27"
                height="26"
                viewBox="0 0 27 26"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="0.832031"
                  y="26"
                  width="26"
                  height="26"
                  rx="2.92308"
                  transform="rotate(-90 0.832031 26)"
                  fill="#0CA851"
                />
                <path
                  d="M11.5469 18.647L16.6175 13.5763L11.5469 8.50571"
                  stroke="white"
                  stroke-width="1.23515"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
          </div>
          <div
            className="mt-10 flex gap-2 px-4 py-3 rounded-2xl"
            style={{ border: "1px solid #CACACA" }}
            onClick={() => {
              navigate("/function", { state: { email, m_id, token } });
            }}
          >
            <div className="my-auto">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_173_1156)">
                  <path
                    d="M18.3327 9.23333V10C18.3317 11.797 17.7498 13.5456 16.6738 14.9849C15.5978 16.4241 14.0854 17.4771 12.3621 17.9866C10.6389 18.4961 8.79707 18.4349 7.11141 17.8122C5.42575 17.1894 3.98656 16.0384 3.00848 14.5309C2.0304 13.0234 1.56584 11.2401 1.68408 9.44693C1.80232 7.6538 2.49702 5.94694 3.66458 4.58089C4.83214 3.21485 6.41 2.26282 8.16284 1.86679C9.91568 1.47076 11.7496 1.65195 13.391 2.38333"
                    stroke="#0CA851"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M18.3333 3.33325L10 11.6749L7.5 9.17492"
                    stroke="#0CA851"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_173_1156">
                    <rect width="20" height="20" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </div>
            <div className="my-auto" style={{ color: "black" }}>
              Functions
            </div>
            <div className="ml-auto my-auto">
              <svg
                width="27"
                height="26"
                viewBox="0 0 27 26"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.5059 18.6469L16.5765 13.5763L11.5059 8.50562"
                  stroke="black"
                  stroke-width="1.69021"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
          </div>
          <div
            className="mt-10 flex gap-2 px-4 py-3 rounded-2xl"
            style={{ border: "1px solid #CACACA" }}
            onClick={() => {
              navigate("/alerts", { state: { email, m_id, token } });
            }}
          >
            <div className="my-auto">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_173_1156)">
                  <path
                    d="M18.3327 9.23333V10C18.3317 11.797 17.7498 13.5456 16.6738 14.9849C15.5978 16.4241 14.0854 17.4771 12.3621 17.9866C10.6389 18.4961 8.79707 18.4349 7.11141 17.8122C5.42575 17.1894 3.98656 16.0384 3.00848 14.5309C2.0304 13.0234 1.56584 11.2401 1.68408 9.44693C1.80232 7.6538 2.49702 5.94694 3.66458 4.58089C4.83214 3.21485 6.41 2.26282 8.16284 1.86679C9.91568 1.47076 11.7496 1.65195 13.391 2.38333"
                    stroke="#0CA851"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M18.3333 3.33325L10 11.6749L7.5 9.17492"
                    stroke="#0CA851"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_173_1156">
                    <rect width="20" height="20" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </div>
            <div className="my-auto" style={{ color: "black" }}>
              Alerts
            </div>
            <div className="my-auto ml-auto">
              <svg
                width="27"
                height="26"
                viewBox="0 0 27 26"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.5059 18.6469L16.5765 13.5763L11.5059 8.50562"
                  stroke="black"
                  stroke-width="1.69021"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>

       
          <div className="w-full md:w-1/3 lg:w-1/4 mt-5 md:mt-0">
  <div className="flex flex-col space-y-5">
    
    {/* Txn Type Selection */}

    {category===1&&(
      <>
    <div className="font-medium text-lg" style={{ color: "black" }}>
      Choose Txn Type for receiving alerts:
    </div>
    <div>
      
      <CustomDropdown
        options={currentOptions}
        onChange={handleTxnTypeSelection}
        // value={currentOptions.filter((option) => selectedTxnTypes.includes(option.value))}
        value={currentOptions.filter((option) => {
          const isIncluded = selectedTxnTypes.includes(option.value);
          console.log(`Option ${option.value} included: ${isIncluded}`);
          return isIncluded;
        })}
      />
    </div>
    </>
    )}
    {selectedTxnTypes.includes("axfer") && (
      <div className="flex flex-col space-y-3">
        <div className="font-medium text-lg" style={{ color: "black" }}>
          axfer Transaction Details
        </div>

        <div>
          <label>Sender:</label>
          <input
            type="text"
            value={axferSender}
            onChange={(e) => setAxferSender(e.target.value)}
            className="w-full rounded-lg p-3 outline-none border border-[#4C4C4C] bg-white mt-2"
          />
        </div>

        <div>
          <label>Receiver:</label>
          <input
            type="text"
            value={axferReceiver}
            onChange={(e) => setAxferReceiver(e.target.value)}
            className="w-full rounded-lg p-3 outline-none border border-[#4C4C4C] bg-white mt-2"
          />
        </div>
        {/* <div>
      
      <select
        value={axferComparison}
        onChange={(e) => setAxferComparison(e.target.value)}
        className="w-2/7 rounded-lg p-2 outline-none border border-[#4C4C4C] bg-white"
      >
        <option value="<">{"<"}</option>
        <option value=">">{">"}</option>
        <option value="=">{"="}</option>
      </select>
    </div> */}
     <label>Amount:</label>

        <div className="flex items-center gap-2 mt-2">
         
          <select
        value={axferComparison}
        onChange={(e) => setAxferComparison(e.target.value)}
        className="w rounded-lg p-2 outline-none border border-[#4C4C4C] bg-white"
      >
        <option value="<">{"<"}</option>
        <option value=">">{">"}</option>
        <option value="=">{"="}</option>
      </select>
          <input
            type="text"
            value={axferAmount}
            onChange={(e) => setAxferAmount(e.target.value)}
            className="w-full rounded-lg p-3 outline-none border border-[#4C4C4C] bg-white mt-2"
          />
        </div>
      </div>
    )}





   {category ===2 &&(
    <>
    <div className="font-medium text-lg" style={{ color: "black" }}>
      Select Methods
    </div>

    {/* <div className="min-w-full"> */}
      <div >
        <Select
          isMulti
          options={totalEvents}
          defaultValue={options}
          onChange={handleSelectChange}
          value={totalEvents.filter((option) => selectedValues.includes(option.value))}
        />
      </div>
      </>
   )}
     
    </div>
  {/* </div> */}

          <div className="mt-5">
    {/* {selectedValues.map((eventName) => (
      
      <div key={eventName} className="font-medium mt-3">
        
        <div>{eventName}</div>
        <input
          className="w-full rounded-lg p-3 outline-none border border-[#4C4C4C]"
          style={{ backgroundColor: "white" }}
          type="text"
          value={eventInputs[eventName]?.args || " "}
          onChange={(e) => handleInputChange(eventName, 'args', e.target.value)}
          placeholder={eventInputs.arguments}
        />
      </div>
    ))} */}
</div>

          <button
            className="py-3 w-full bg-[#28AA61]  rounded-lg text-white mt-5"
            onClick={handleSubmit}
          >
            Save Monitor
          </button>
        </div>

        <div className="border border-[#0CA851]  shadow-md p-4 md:p-10 rounded-xl w-80   mb-10 xl:mb-0">
          <div className="text-lg font-medium" style={{ color: "black" }}>
            Monitor Summary
          </div>
          <div className="flex gap-2">
            <div>
              <div
                className="text-center font-medium"
                style={{ color: "black" }}
              >
                Networks
              </div>
              <div className="text-white bg-[#0CA851] rounded-md p-2 text-[13px]">
                {/* {networkState} */}
                {networkState === 80002
                  ? "Amoy"
                  : networkState === 1
                    ? "Ethereum Mainnet"
                    : networkState === 11155111
                      ? "Sepolia Testnet"
                      : networkState === 137
                        ? "Polygon Mainnet"
                         : networkState === 1300
                        ? "Algorand Mainnet"
                         : networkState === 1301
                        ? "Algorand Testnet"
                        : "Unknown"}
              </div>
            </div>
            <div>
              <div
                className="text-center font-medium"
                style={{ color: "black" }}
              >
                Risk Category
              </div>
              <div className=" bg-[#E9E9E9] rounded-md p-2 text-[13px]">
                {rk}
              </div>
            </div>
          </div>
          <div className="mt-3">
            <div className="font-medium" style={{ color: "black" }}>
              Contracts
            </div>
            <div className="flex gap-1">
              <div className=" bg-[#E9E9E9] rounded-md p-2 text-[13px]">
                {addressState}
              </div>
              <button onClick={copyMessage}>
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
              </button>
            </div>
          </div>
          <div className="mt-3">
            <div className="font-medium" style={{ color: "black" }}>
              Event Conditions
            </div>
            {/* {Object.keys(selectedEvents).length > 0 ? (
              <ul>
                {Object.entries(selectedEvents).map(
                  ([eventName, eventData]) => {
                    const argTypes = eventDetails
                      .find((e) => e.name === eventName)
                      .inputs.split(", ")
                      .map((arg) => arg.split(": ")[1]) // Extract only the types
                      .join(", "); // Join types with commas

                    return (
                      <li key={eventName} className="text-[13px]">
                        {eventName} ({argTypes})
                      </li>
                    );
                  }
                )}
              </ul>
            ) : (
              <div className="text-[13px]">No events selected</div>
            )} */}
          </div>
          <div className="mt-3">
            <div className="font-medium" style={{ color: "black" }}>
              Function Conditions
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
          <div className="mt-3">
            <div className="font-medium" style={{ color: "black" }}>
              Alerts
            </div>
            <div className="flex gap-1 items-center">
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
    </div >
  );
}

export default AlgoEventsedit;
