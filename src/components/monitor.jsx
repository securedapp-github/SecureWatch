import React, { useState,useEffect } from "react";
import Navbar from "./navbar2";
import { Switch } from "@headlessui/react";
import Modal from "react-modal";
import { Link } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import Monitor_cmp from "./monitor_cmp";
import axios from "axios";


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

const Monitor = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const email = localStorage.getItem("email")
  console.log(token);
  console.log(email);
  

  function handleClick() {
    navigate("/monitor_create", { state: { email, token } });
  }

  const [enabled, setEnabled] = useState(false);
  const [disp, setDisp] = useState("block");
  const [disp1, setDisp1] = useState("block");
  const handleToggle = () => {
    if (disp == "none") setDisp("block");
    else setDisp("none");
  };
  const handleToggle1 = () => {
    if (disp1 == "none") setDisp1("block");
    else setDisp1("none");
  };

  const [open, setOpen] = useState(false);
  function openModal() {
    setOpen(true);
  }
  function closeModal() {
    setOpen(false);
  }
  return (
    <div
      className="font-poppin pt-12 bg-white min-h-full"
      // style={{ backgroundColor: "#FCFFFD" }}
    >
      <Navbar email={email} />
      <div className="w-4/6 mx-auto mt-20 ">
        <div className="flex justify-center items-center md:justify-between  flex-col md:flex-row">
          <div className="text-4xl font-medium text-black">Monitors</div>
          <div className="flex flex-wrap justify-center gap-2 mt-2 md:mt-0">
            <div className="border border-black rounded-xl font-medium px-3 py-2 my-auto cursor-pointer">
              See Monitor Activity
            </div>
            <div
              className="bg-[#0CA851] rounded-xl text-white font-medium px-7 py-2 my-auto cursor-pointer"
              onClick={handleClick}
            >
              Create Monitor
            </div>
            <button
              className="bg-[#0CA851] rounded-xl text-white font-medium px-7 py-2 my-auto cursor-pointer"
              
            >
              <Link to="/api_builder" t>Interact with contract</Link>
            </button>
          </div>
        </div>
        {/* <div
          className="flex mt-10 justify-between w-3/5 py-3 px-5 rounded-2xl mx-auto md:mx-0"
          style={{ border: "1px solid #7D7D7D" }}
        >
          <input
            type="text"
            className="outline-none font-medium w-4/5 bg-white"
            placeholder="Search by name, network or address..."
          />
          <div className="my-auto">
            <svg
              width="19"
              height="19"
              viewBox="0 0 19 19"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M8.00127 15.0025C11.868 15.0025 15.0025 11.868 15.0025 8.00127C15.0025 4.13457 11.868 1 8.00127 1C4.13457 1 1 4.13457 1 8.00127C1 11.868 4.13457 15.0025 8.00127 15.0025Z"
                stroke="#7D7D7D"
                stroke-width="1.7625"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M13.4254 13.4244L17.826 17.825"
                stroke="#7D7D7D"
                stroke-width="1.7625"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
        </div> */}

        
        
      </div>
      <Monitor_cmp />
    </div>
  );
}

export default Monitor;
