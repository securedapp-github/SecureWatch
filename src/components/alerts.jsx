import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./navbar2";
import Modal from "react-modal";
import Load from "../images/loading.png";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { baseUrl } from "../Constants/data.js";

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

function Alerts() {
  const location = useLocation();
  const navigate = useNavigate();

  const { name, email, m_id, token, network, address, rk, selectedEventNames } = location.state || {};
  console.log("name:",name);
  console.log("MID:",m_id);


  const [emailInput, setEmailInput] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [riskCategory, setRiskCategory] = useState("default");
  const [actionType, setActionType] = useState("default");
  
  console.log("riskCategory",riskCategory);
  console.log("actionType",actionType);
  




  const [open, setOpen] = useState(false);

  function openModal() {
    setOpen(true);
    setTimeout(() => {
      closeModal();
    }, 2000);
  }

  function closeModal() {
    setOpen(false);
  }
  useEffect(()=>{
    console.log("emailInput",emailInput);
    
  },[emailInput])

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (riskCategory === "" || riskCategory === "default" || actionType === "" || actionType === "default") {
      console.error("No actions selected.");
      setOpen(false);
      toast.error("Please select all required fields!");
      return;
    }

    if (actionType === "email" && (emailInput === "" || emailInput === undefined || emailInput === null)) {
      setOpen(false);
      console.error("Please enter a valid email.");
      toast.error("Please enter a valid email.");
      return;
    }

    // const emails = emailInput.split(",").map((email) => email.trim());
    // const emailString = emails.join(",");

    // const postData = {
    //   name: name,
    //   monitor_id: m_id,
    //   alert_type: actionType === "email" ? 1: 0, // Example: "1" for email, "0" for other actions
    //   alert_data: actionType === "email" ? JSON.stringify(emailInput) : null, // Store email if email action is selected
    //   risk_category: riskCategory,
    //   // other_data: actionType !== "email" ? "other action data" : null, // Placeholder for other action data
    // };

    // console.log("Storing the following data:", postData); // Log the stored details

    try {
      const response = await fetch(`${baseUrl}/update_monitor`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          monitor_id: m_id,
          alert_type: actionType === "email" ? 1: 0, 
          alert_data: actionType === "email" ? emailInput : "", 
        }),
      });
      console.log("Response from server:", response.data);

      toast.success("Monitor Updated successfully!", {
        autoClose: 500,
        onClose: () => {
          navigate("/monitor", { state: { email, token } });
        },
      });
    } catch (error) {
      console.error("Error updating monitor:", error);
      toast.error("Failed to Update Monitor. Please try again!");
    }
  };

  const copyMessage = () => {
    navigator.clipboard.writeText(address);
    toast.success("Address Copied successfully!");
  }

  return (
    <div className="font-poppin pt-2 bg-white min-h-full" style={{ backgroundColor: "#FCFFFD" }}>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      <Navbar email={email} />
      <div className="w-full h-full mx-auto mt-10 md:mt-20 flex items-start justify-center flex-col md:flex-row md:gap-10 lg:gap-20 ">
        <div className="mx-auto md:mx-0">
          <div className="flex">
            <div>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_173_1147)">
                  <path d="M22.6223 15.9674H9.3152" stroke="#7D7D7D" stroke-width="1.88191" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M15.9688 22.621L9.3152 15.9674L15.9688 9.31387" stroke="#7D7D7D" stroke-width="1.88191" stroke-linecap="round" stroke-linejoin="round" />
                </g>
                <defs>
                  <clipPath id="clip0_173_1147">
                    <rect width="22.5829" height="22.5829" fill="white" transform="translate(15.9688 31.9368) rotate(-135)" />
                  </clipPath>
                </defs>
              </svg>
            </div>
            <div className="text-base text-[#7D7D7D] my-auto" style={{ color: "black" }}>
              Back to Monitors
            </div>
          </div>
          <div className="text-3xl font-medium mt-3" style={{ color: "black" }}>
            Create Monitor
          </div>
          <div className="mt-10 flex gap-2 px-4 py-3 rounded-2xl" style={{ border: "1px solid #CACACA" }}>
            <div className="my-auto">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_173_1156)">
                  <path d="M18.3327 9.23333V10C18.3317 11.797 17.7498 13.5456 16.6738 14.9849C15.5978 16.4241 14.0854 17.4771 12.3621 17.9866C10.6389 18.4961 8.79707 18.4349 7.11141 17.8122C5.42575 17.1894 3.98656 16.0384 3.00848 14.5309C2.0304 13.0234 1.56584 11.2401 1.68408 9.44693C1.80232 7.6538 2.49702 5.94694 3.66458 4.58089C4.83214 3.21485 6.41 2.26282 8.16284 1.86679C9.91568 1.47076 11.7496 1.65195 13.391 2.38333" stroke="#0CA851" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M18.3333 3.33325L10 11.6749L7.5 9.17492" stroke="#0CA851" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
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
              <svg width="27" height="26" viewBox="0 0 27 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.5059 18.6469L16.5765 13.5763L11.5059 8.50562" stroke="black" stroke-width="1.69021" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
          </div>
          <div className="mt-10 flex gap-2 px-4 py-3 rounded-2xl" style={{ border: "1px solid #CACACA" }}>
            <div className="my-auto">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_173_1156)">
                  <path d="M18.3327 9.23333V10C18.3317 11.797 17.7498 13.5456 16.6738 14.9849C15.5978 16.4241 14.0854 17.4771 12.3621 17.9866C10.6389 18.4961 8.79707 18.4349 7.11141 17.8122C5.42575 17.1894 3.98656 16.0384 3.00848 14.5309C2.0304 13.0234 1.56584 11.2401 1.68408 9.44693C1.80232 7.6538 2.49702 5.94694 3.66458 4.58089C4.83214 3.21485 6.41 2.26282 8.16284 1.86679C9.91568 1.47076 11.7496 1.65195 13.391 2.38333" stroke="#0CA851" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M18.3333 3.33325L10 11.6749L7.5 9.17492" stroke="#0CA851" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
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
              <svg width="27" height="26" viewBox="0 0 27 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.5059 18.6469L16.5765 13.5763L11.5059 8.50562" stroke="black" stroke-width="1.69021" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
          </div>
          <div className="mt-10 flex gap-2 px-4 py-3 rounded-2xl" style={{ border: "1px solid #CACACA" }}>
            <div className="my-auto">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_173_1156)">
                  <path d="M18.3327 9.23333V10C18.3317 11.797 17.7498 13.5456 16.6738 14.9849C15.5978 16.4241 14.0854 17.4771 12.3621 17.9866C10.6389 18.4961 8.79707 18.4349 7.11141 17.8122C5.42575 17.1894 3.98656 16.0384 3.00848 14.5309C2.0304 13.0234 1.56584 11.2401 1.68408 9.44693C1.80232 7.6538 2.49702 5.94694 3.66458 4.58089C4.83214 3.21485 6.41 2.26282 8.16284 1.86679C9.91568 1.47076 11.7496 1.65195 13.391 2.38333" stroke="#0CA851" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M18.3333 3.33325L10 11.6749L7.5 9.17492" stroke="#0CA851" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
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
              <svg width="27" height="26" viewBox="0 0 27 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.5059 18.6469L16.5765 13.5763L11.5059 8.50562" stroke="black" stroke-width="1.69021" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
          </div>
          <div className="mt-10 flex gap-2 px-4 py-3 rounded-2xl" style={{ border: "1px solid #0CA851" }}>
            <div className="my-auto">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_173_1156)">
                  <path d="M18.3327 9.23333V10C18.3317 11.797 17.7498 13.5456 16.6738 14.9849C15.5978 16.4241 14.0854 17.4771 12.3621 17.9866C10.6389 18.4961 8.79707 18.4349 7.11141 17.8122C5.42575 17.1894 3.98656 16.0384 3.00848 14.5309C2.0304 13.0234 1.56584 11.2401 1.68408 9.44693C1.80232 7.6538 2.49702 5.94694 3.66458 4.58089C4.83214 3.21485 6.41 2.26282 8.16284 1.86679C9.91568 1.47076 11.7496 1.65195 13.391 2.38333" stroke="#0CA851" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M18.3333 3.33325L10 11.6749L7.5 9.17492" stroke="#0CA851" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
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
              <svg width="27" height="26" viewBox="0 0 27 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="0.832031" y="26" width="26" height="26" rx="2.92308" transform="rotate(-90 0.832031 26)" fill="#0CA851" />
                <path d="M11.5469 18.647L16.6175 13.5763L11.5469 8.50571" stroke="white" stroke-width="1.23515" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
          </div>
        </div>
        <div className="w-[97%] md:w-1/3 lg:w-1/4 mt-5 md:mt-0 mx-auto md:mx-0 ">
          <form onSubmit={handleSubmit}>
            <div className="font-medium mt-5 text-lg" style={{ color: "black" }}>
              Risk Category
            </div>
            <select
              style={{ backgroundColor: "white" }}
              name="category"
              id="category"
              required
              onChange={(e) => setRiskCategory(e.target.value)}
              value={riskCategory}
              className="outline-none border-2 border-[#4C4C4C] py-3 rounded-xl  w-full px-3"
            >
              
              <option value="default" className="text-[13px] text-[#959595] ">
                None
              </option>
              <option value="Low Severity" className="text-[13px] text-[#959595] ">
                Low Severity
              </option>
              <option value="Medium Severity" className="text-[13px] text-[#959595]">
                Medium Severity
              </option>
              <option value="High Severity" className="text-[13px] text-[#959595]">
                High Severity
              </option>
            </select>

            <div className="mt-5">
              <div className="font-medium" style={{ color: "black" }}>
                Execute an action
              </div>
              <div className="">
                <div className="font-medium">
                  <select
                    style={{ backgroundColor: "white" }}
                    className="outline-none border-2 border-[#4C4C4C] py-3 rounded-xl  w-full px-3"
                    value={actionType}
                    required
                    onChange={(e) => setActionType(e.target.value)}
                  >
                    <option value="default" hidden>Select Action</option>
                    <option value="email">Email</option>
                    <option value="other">Other Action</option>
                  </select>
                  {actionType === "email" && (
                    <input
                      style={{ backgroundColor: "white" }}
                      type="email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className="mt-2 w-full border-2 border-gray-300 p-2 rounded-lg"
                      placeholder="Enter emails, e.g., example1@gmail.com, example2@gmail.com"
                    />
                  )}
                </div>
                <div>
                  <svg width="21" height="22" viewBox="0 0 21 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path />
                  </svg>
                </div>
              </div>
            </div>

            <button
              className="py-3 w-full bg-[#28AA61] mt-10 rounded-lg text-white"
              onClick={() => {
                openModal();
                setIsSaved(true);
              }}
            >
              Save Monitor
            </button>
          </form>
        </div>
        <div className=" mt-4 md:mt-0 border mx-auto md:mx-0 border-[#0CA851] shadow-md p-5 rounded-xl">
          <div className="text-lg font-medium" style={{ color: "black" }}>
            Monitor Summary
          </div>
          <div className="flex gap-2">
            <div>
              <div className="text-center font-medium" style={{ color: "black" }}>
                Networks
              </div>
              <div className="text-white bg-[#0CA851] rounded-md p-2 text-[13px]">
                {network}
              </div>
            </div>
            <div>
              <div className="text-center font-medium" style={{ color: "black" }}>
                Risk Category
              </div>
              <div className=" bg-[#E9E9E9] rounded-md p-2 text-[13px]">
                {riskCategory}
              </div>
            </div>
          </div>
          <div className="mt-3">
            <div className="font-medium" style={{ color: "black" }}>
              Contracts
            </div>
            <div className="flex gap-1">
              <div className=" bg-[#E9E9E9] rounded-md p-2 text-[13px]">
                {address}
              </div>
              <button onClick={copyMessage}>
                <div className="my-auto">
                  <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_179_2771)">
                      <path d="M15.1074 7.65955H8.35742C7.52899 7.65955 6.85742 8.33112 6.85742 9.15955V15.9095C6.85742 16.738 7.52899 17.4095 8.35742 17.4095H15.1074C15.9358 17.4095 16.6074 16.738 16.6074 15.9095V9.15955C16.6074 8.33112 15.9358 7.65955 15.1074 7.65955Z" stroke="#434343" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                      <path d="M3.85742 12.1595H3.10742C2.7096 12.1595 2.32807 12.0015 2.04676 11.7202C1.76546 11.4389 1.60742 11.0574 1.60742 10.6595V3.90955C1.60742 3.51172 1.76546 3.13019 2.04676 2.84889C2.32807 2.56758 2.7096 2.40955 3.10742 2.40955H9.85742C10.2552 2.40955 10.6368 2.56758 10.9181 2.84889C11.1994 3.13019 11.3574 3.51172 11.3574 3.90955V4.65955" stroke="#434343" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    </g>
                    <defs>
                      <clipPath id="clip0_179_2771">
                        <rect width="18" height="18" fill="white" transform="translate(0.107422 0.909546)" />
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
            {selectedEventNames && selectedEventNames.length > 0 ? (
              <ul>
                {selectedEventNames.map((event, index) => (
                  <li key={index} className="text-[13px]">
                    {event} ({event.argTypes})
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-[13px]">No events selected</div>
            )}
          </div>
          <div className="mt-3">
            <div className="font-medium" style={{ color: "black" }}>
              Function Conditions
            </div>
            <div>
              <div className="text-[13px]">approve(address,uint256)</div>
              <div className="text-[13px]">decreaseAllowance(address,uint256)</div>
              <div className="text-[13px]">increaseAllowance(address,uint256)</div>
              <div className="text-[13px]">transfer(address,uint256)</div>
              <div className="text-[13px]">transferFrom(address,address,uint256)</div>
            </div>
          </div>
          <div className="mt-3">
            <div className="font-medium" style={{ color: "black" }}>
              Alerts
            </div>
            <div className="flex gap-1 items-center">
              <div className="text-[13px]">Marked as</div>
              <div className=" bg-[#E9E9E9] rounded-md py-1 px-2 text-[13px]">
                {riskCategory || "Select Severity"}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal isOpen={open} onRequestClose={closeModal} style={customStyles} contentLabel="Example Modal">
        <div className="text-xl font-medium text-center mt-[30px] mx-[60px] md:mx-[120px]">
          Creating Monitor
        </div>
        <img src={Load} alt="Loading" className="mt-6 mb-[30px] mx-[60px] md:mx-[120px]" />
      </Modal>
    </div>
  );
}

export default Alerts;
