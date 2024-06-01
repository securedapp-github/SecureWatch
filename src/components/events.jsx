import Navbar from "./navbar2";
import { useLocation, useNavigate } from "react-router-dom";

import * as React from "react";
// import check from "../images/check-circle.png";
// import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import Web3 from "web3";
// import Select from "react-select";
import Select, { components } from "react-select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
//

function Events() {
  const navigate = useNavigate();
  const location = useLocation();

  const { name, email, m_id, token, network, abi, address, rk } =
    location.state || "";
  const [networkState, setNetworkState] = useState(network || ""); // Default to 'MAINNET' if not provided
  //  const [contractNameState, setContractNameState] = useState(alert_data || "");
  const [addressState, setAddressState] = useState(address || "");
  const [riskCategoryState, setRiskCategoryState] = useState(rk || "");
  const [abiState, setAbiState] = useState(abi || "");

  // console.log(token);
  // console.log(m_id);
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
    label: `${event.name} (${event.inputs})`,
    value: event.name,
  }));

  // Handle event selection and prompt for arguments
  const handleEventSelection = (selectedOptions) => {
    setSelectedEventNames(selectedOptions.map((option) => option.label));

    const newSelection = selectedOptions.reduce(
      (acc, option) => ({
        ...acc,
        [option.value]: {
          args: "",
          argDetails: eventDetails
            .find((event) => event.name === option.value)
            .inputs.split(", ")
            .map((arg) => {
              const [name, type] = arg.split(": ");
              return name; // Store only argument names
            })
            .join(", "), // Join names with commas for the placeholder
        },
      }),
      {}
    );

    setSelectedEvents(newSelection);
  };

  const handleArgumentChange = (event, eventName) => {
    const value = event.target.value;
    setSelectedEvents((prevEvents) => ({
      ...prevEvents,
      [eventName]: {
        ...prevEvents[eventName],
        args: value,
      },
    }));
  };

  const web3 = new Web3();

  const handleSaveMonitor = async () => {
    if (!Array.isArray(eventDetails)) {
      console.error("eventDetails is not an array:", eventDetails);
      return; // Exit if eventDetails is not an array
    }

    let navigationState = {
      monitorName: name,
      network: network,
      address: address,
      rk: rk,
      m_id: mid,
      email: email,
      token: token,
      selectedEventNames: Object.keys(selectedEvents), // Storing the names of selected events
    };

    Object.entries(selectedEvents).forEach(
      async ([eventName, eventDetailsEntry]) => {
        const argsObject = eventDetailsEntry.args
          .split(",")
          .reduce((acc, arg, index) => {
            acc[`arg${index + 1}`] = arg.trim(); // Creates a dynamic key for each argument
            return acc;
          }, {});

        const event = eventDetails.find((e) => e.name === eventName);
        if (!event) {
          console.error("Event not found in eventDetails:", eventName);
          return; // Exit if the event is not found
        }

        // Check if 'inputs' is available and correctly formatted
        if (!event.inputs || typeof event.inputs !== "string") {
          console.error(
            "Event inputs are not correctly formatted:",
            event.inputs
          );
          return;
        }

        const eventSignatureInputs = event.inputs
          .split(", ")
          .map((input) => {
            const [name, type] = input.split(": ");
            return type;
          })
          .join(",");

        // The correct format for encodeEventSignature: "EventName(type1,type2,...)"
        const eventSignatureData = `${event.name}(${eventSignatureInputs})`;
        let eventSignature;
        try {
          eventSignature =
            web3.eth.abi.encodeEventSignature(eventSignatureData);
        } catch (error) {
          console.error(
            "Failed to encode event signature:",
            error,
            "with data:",
            eventSignatureData
          );
          return;
        }

        const body = {
          name: eventName,
          mid: mid,
          signature: eventSignature,
          arguments: argsObject,
        };

        try {
          const response = await axios.post(
            "https://139-59-5-56.nip.io:3443/add_event",
            body
          );
          console.log("Event added:", response.data);
          console.log("Arguments Object:", argsObject);
          console.log("signature is:", eventSignature);
          console.log("network in event is", network);
          console.log("event is:", selectedEventNames);
          console.log("monitor id is:", m_id);
          console.log("event name is:", eventName);
          // Navigate to alerts with updated navigation state
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
      }
    );
  };
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
      <div className="w-full  mx-auto mt-10 md:mt-20 flex items-start justify-center flex-col md:flex-row md:gap-10 lg:gap-20">
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
            Create Monitor
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
              navigate("/function", { state: { email, mid, token } });
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
              navigate("/alerts", { state: { email, mid, token } });
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

        <div className="w-full md:w-1/3 lg:w-1/4 mt-5 md:mt-0 ">
          <div className="font-medium text-lg" style={{ color: "black" }}>
            Enter the Signature Name
          </div>
          <div className="my-auto ml-auto">
            {/* w-inherit border-2 border-[#B4B4B4] shadow-md p-3 rounded-lg flex px-3 justify-between py-3 */}
            <div className="font-medium text-lg"></div>
            <div>
              <Select
                options={options}
                isMulti
                closeMenuOnSelect={false}
                components={{ Option: components.Option }}
                onChange={handleEventSelection}
                className=""
                classNamePrefix="select"
                placeholder="Search and select events..."
                noOptionsMessage={() => "No events found"}
                value={selectedEventNames.map((name) =>
                  options.find((option) => option.label === name)
                )} // Set value to reflect current selections
              />
            </div>
          </div>
          {/* <div className="rounded-lg border-2 border-[#B4B4B4] border-t-0 shadow-md">
            <div className="p-3">
              <input
                type="checkbox"
                id="val1"
                value="val1"
                className="checked:bg-green-600 mr-2"
                onChange={handleToggle1}
              />
              <label htmlFor="opt1">Approval (address, address, uint256)</label>
            </div>
            <div className="p-3">
              <input
                type="checkbox"
                id="val2"
                value="val1"
                className="checked:bg-green-600 mr-2"
                onChange={handleToggle2}
              />
              <label htmlFor="opt1">Transfer (address, address, uint256)</label>
            </div>
          </div>
          <div className="mt-5" style={{ display: disp1 }}>
            <div className="font-medium">
              Approval (address, address, uint256)
            </div>
            <input
              type="text"
              className="w-full p-3 rounded-lg outline-none border border-[#4C4C4C]"
              placeholder="Variables: owner, spender, value"
            />
          </div>
          <div className="mt-5" style={{ display: disp2 }}>
            <div className="font-medium">
              Approval (address, address, uint256)
            </div>
            <input
              type="text"
              className="w-full rounded-lg p-3 outline-none border border-[#4C4C4C]"
              placeholder="Variables: owner, spender, value"
            />
          </div> */}
          <div className="mt-5">
            {Object.entries(selectedEvents).map(([eventName, eventData]) => (
              <div key={eventName} className="font-medium">
                <div className="div-51">{eventName}</div>
                <input
                  className="w-full rounded-lg p-3 outline-none border border-[#4C4C4C]"
                  style={{ backgroundColor: "white" }}
                  type="text"
                  value={eventData.args}
                  onChange={(e) => handleArgumentChange(e, eventName)}
                  placeholder={` ${eventData.argDetails} `}
                />
              </div>
            ))}
          </div>
          <button
            className="py-3 w-full bg-[#28AA61] mt-10 rounded-lg text-white"
            onClick={handleSaveMonitor}
          >
            Save Monitor
          </button>
        </div>

        <div className="mt-4 md:mt-0 border border-[#0CA851] shadow-md p-5 rounded-xl">
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
                {networkState}
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
            {Object.keys(selectedEvents).length > 0 ? (
              <ul>
                {Object.entries(selectedEvents).map(
                  ([eventName, eventData]) => (
                    <li key={eventName} className="text-[13px]">
                      {eventName}: {}
                    </li>
                  )
                )}
              </ul>
            ) : (
              <div className="text-[13px]">No events selected</div>
            )}
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

export default Events;
