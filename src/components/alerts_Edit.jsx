import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./navbar2";
import Modal from "react-modal";
import Load from "../images/loading.png";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {baseUrl} from '../Constants/data.js';
import { Link } from "react-router-dom";
import NewNavbar from "./NewNavbar";
import Sidebar from "./Sidebar";
import { IoMdCheckmarkCircle } from "react-icons/io";
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import { TbLoader2 } from "react-icons/tb";

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

function Alerts_Edit() {
  const token = localStorage.getItem("token");
  const location = useLocation();
  const navigate = useNavigate();
  const { name, email, m_id, network, address, rk, selectedEventNames, alert_data, alert_type } = location.state || {};
  console.log("Alert Data",alert_data);
  const userEmail = localStorage.getItem("email");
  console.log(userEmail);
  console.log("Alert Type",alert_type);

  const [riskCategory, setRiskCategory] = useState("");
  const [emailInput, setEmailInput] = useState(alert_data || "");
  const [actionType, setActionType] = useState(alert_type=== 1 ?"email":"other" || "default");
  const [isSaved, setIsSaved] = useState(false);
  const [open, setOpen] = useState(false);
  const [previousData, setPreviousData] = useState({});
  

  
 
  // Fetch monitor data on component mount
  // useEffect(() => {
  //   const fetchMonitorData = async () => {
  //     try {
  //       const response = await axios.post(
  //         `${baseUrl}/get_monitor`,
  //         { monitor_id: m_id }
  //       );
  //       const monitorData = response.data;
  //       setPreviousData(monitorData);
  //       console.log(monitorData);
        

  //       // Prefill the form with the retrieved data
  //       setRiskCategory(monitorData.risk_category || "");
  //       setEmailInput(monitorData.alert_data || "");
  //       setActionType(monitorData.alerts[0].alerts ? "email" : "other");
  //     } catch (error) {
  //       console.error("Error fetching monitor data:", error);
  //       toast.error("Failed to fetch monitor data. Please try again!");
  //     }
  //   };

  //   fetchMonitorData();
  // }, [m_id]);



  function openModal() {
    setOpen(true);
    setTimeout(() => {
      closeModal();
    }, 2000);
  }

  function closeModal() {
    setOpen(false);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (riskCategory === "default" || actionType === "default") {
      console.error("No actions selected.");
      setOpen(false);
      toast.error("Please select all required fields!");
      return;
    }

    if (actionType === "email" && emailInput.trim() === "") {
      setOpen(false);
      console.error("Please enter a valid email.");
      toast.error("Please enter a valid email.");
      return;
    }

    const emails = emailInput.split(",").map((email) => email.trim());
    const emailString = emails.join(",");
    const postData = {
      monitor_id: m_id,
      name: name,
      alert_type: actionType === "email" ? 1 : 0,
      alert_data: actionType === "email" ?emailString:"",
    };

    try {
      const response = await axios.post(
        `${baseUrl}/update_monitor`,
        postData,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }

      );
      console.log(response.data);
      toast.success("Monitor Updated successfully!", {
        autoClose: 500,
        onClose: () => {
          navigate("/monitor");
        },
      });
    } catch (error) {
      console.error("Error updating monitor:", error);
      toast.error("Failed to Update Monitor. Please try again!");
    }
  };

  const copyMessage = () => {
    navigator.clipboard.writeText(address);
    toast.success("Address copied successfully!");
  };

  return (
    <div className="w-full h-full">
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
            Overview
          </Link>
          <Link to="/monitor" className="text-[#6A6A6A]">
            Monitor
          </Link>
          <Link to="/log" className="text-[#6A6A6A]">
            Logs
          </Link>
        </div>
      </div>
    
    
      <div className="mt-20 w-full sm:ml-[100px] md:ml-[100px] xl:ml-72 pt-6  flex flex-col lg:flex-row lg:justify-start lg:items-start   justify-center items-center gap-10 flex-wrap pb-10">
        
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
                className="mt-5 hidden sm:flex gap-2 px-4 py-3 rounded-sm bg-white"
                style={{ border: "1px solid #2D5C8F" }}
              >
                
                <div className="my-auto text-black" >
                  Alerts
                </div>
                <div className="my-auto ml-auto">
                  <IoMdCheckmarkCircle className="text-2xl text-[#2D5C8F]" />
                </div>
              </div>

              <div className="sm:hidden flex gap-2 items-center justify-around mt-5  w-full">
    <div className=" flex gap-1 items-center " >
                <IoMdCheckmarkCircle className="text-3xl text-[#2D5C8F]" />
                <p className="text-black">General <br /> Information</p>  
              </div>
    <div className=" flex gap-1 items-center" >
                 <IoMdCheckmarkCircle className="text-3xl text-[#2D5C8F]" />
                 <p className=" text-black">Events</p>
                
              </div>
              
    <div className=" flex gap-1 items-center" >
    <IoMdCheckmarkCircle className="text-3xl text-[#2D5C8F]" />
    <p className=" text-black">Alerts</p>
                
              </div>
</div>
            </div>
    
          
          <div className="w-[97%] md:w-1/3 lg:w-1/4 mt-5 md:mt-0 mx-auto md:mx-0 sm:bg-inherit sm:border-0  bg-white px-2 border-2 rounded-md py-2">
              <form onSubmit={handleSubmit}>
                <div className="font-medium mt-5 text-lg" style={{ color: "black" }}>
                  Risk Category
                </div>
                <select
                  style={{ backgroundColor: "white" }}
                  name="category"
                  id="category"
                  value={riskCategory}
                  onChange={(e) => setRiskCategory(e.target.value)}
                  className="outline-none border-2 border-[#4C4C4C] py-3 rounded-xl  w-full px-3"
                >
                  <option value="none" disabled hidden className="text-xl font-medium">
                    None
                  </option>
                  <option value="Low Severity" className="text-[13px] text-[#959595]">
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
                        <option value="default" hidden>
                          Select Action
                        </option>
                        <option value="email">Email</option>
                        <option value="other">Other Action</option>
                      </select>
                      {actionType === "email" && (
                        <input
                          style={{ backgroundColor: "white" }}
                          type="text"
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
                  className="py-3 w-full bg-[#2D5C8F] mt-10 rounded-lg text-white"
                  onClick={() => {
                    openModal();
                    setIsSaved(true);
                  }}
                >
                  Save Monitor
                </button>
              </form>
            </div>
    
          
         

            <div className=" mt-4 md:mt-0 border mx-auto md:mx-0 border-[#2D5C8F] shadow-md p-5 rounded-xl">
            <div className="text-lg font-medium text-[#2D5C8F]" >
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
                  {address.slice(0, 6)}...{address.slice(-4)}
                </div>
                {/* <button onClick={copyMessage}>
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
                </button> */}
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
                <div className="text-[13px]">approve(address,uint256)</div>
                <div className="text-[13px]">decreaseAllowance(address,uint256)</div>
                <div className="text-[13px]">increaseAllowance(address,uint256)</div>
                <div className="text-[13px]">transfer(address,uint256)</div>
                <div className="text-[13px]">transferFrom(address,address,uint256)</div>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <div className="font-medium w-40 flex justify-between items-center" style={{ color: "black" }}>
                Alerts <span>:</span>
              </div>
              <div className="flex gap-1 flex-col items-center">
                <div className="text-[13px] text-black">Marked as</div>
                <div className=" bg-[#E9E9E9] rounded-md py-1 px-2 text-[13px]">
                  {riskCategory || "Select Severity"}
                </div>
              </div>
            </div>
          </div>
    
    
          <Modal isOpen={open} onRequestClose={closeModal} style={customStyles}  >
              <div className="text-xl font-medium text-center mt-[30px] mx-[60px] md:mx-[120px] text-black">
                Updating Monitor
              </div>
              <TbLoader2 className="mt-6 mb-[30px] mx-[60px] md:mx-[120px] text-[#2D5C8F] text-9xl" />
             
            </Modal>
      </div>
    
    
    </div>
    </div>
  );
}

export default Alerts_Edit;
