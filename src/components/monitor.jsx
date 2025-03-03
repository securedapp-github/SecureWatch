import React from "react";
import { Link, useNavigate } from "react-router-dom";
import NewNavbar from "./NewNavbar";
import Sidebar from "./Sidebar";
import { FaCirclePlus } from "react-icons/fa6";
import Monitor_cmp from "./monitor_cmp";

function Monitor() {
  const userEmail = localStorage.getItem("email");
  console.log(userEmail);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const email = localStorage.getItem("email");
  const is_admin = localStorage.getItem("is_admin");
  console.log(token);
  console.log(email);

  return (
    <div className="w-full min-h-full bg-white">
      <NewNavbar email={userEmail} />
      <div className="bg-white w-full flex min-h-full">
        <Sidebar />

        <div className=" h-full sm:flex flex-col gap-5 ml-[100px] w-56 mt-20 hidden fixed">
          <div className={`mt-5 py-3 pl-4 pr-9 rounded-r-full bg-[#6A6A6A1A]`}>
            <h1 className="text-[#6A6A6A]  font-semibold text-nowrap">
              Realtime Security
            </h1>
          </div>
          <div className="flex flex-col gap-5 ml-5">
            <Link to="/dashboard" className="text-[#6A6A6A]">
            Dashboard
            </Link>
            <Link to="/monitor" className="text-[#2D5C8F] font-semibold">
            Contract Monitor
            </Link>
            <Link to="/wallet_security" className="text-[#6A6A6A]">
                        Wallet Monitor
                        </Link>
            {/* <Link to="/log" className="text-[#6A6A6A] ">
              Logs
            </Link> */}
          </div>
        </div>

        <div className=" mt-20 w-full sm:ml-80  min-h-full">
          <div className="w-full flex justify-between items-center px-4 py-4 mt-4 xl:px-[109px]">
            <p className="text-black font-semibold text-lg">Monitors</p>
            {is_admin== 1 && (
              <Link
              to="/monitor_create"
              className="bg-[#6549FD] text-white px-3 py-2 rounded-lg text-sm font-medium"
            >
              Create Monitor
            </Link>
            )}
            
          </div>
          <Monitor_cmp />
        </div>
        
      </div>
    </div>
  );
}

export default Monitor;
