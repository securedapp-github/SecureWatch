import React from "react";
import { Link, useNavigate } from "react-router-dom";
import NewNavbar from "./NewNavbar";
import Sidebar from "./Sidebar";
import { FaCirclePlus } from "react-icons/fa6";

import Wallet_Security_Cmp from "./Wallet_Security_Cmp";

function Wallet_Security() {
  const userEmail = localStorage.getItem("email");
  console.log(userEmail);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const email = localStorage.getItem("email");
  const is_admin = localStorage.getItem("is_admin");
  console.log(token);
  console.log(email);

  return (
    <div className="w-full min-h-full bg-[#FAFAFA]">
      <NewNavbar email={userEmail} />
      <div className="bg-[#FAFAFA] w-full flex min-h-full">
        <Sidebar />

        <div className=" h-full sm:flex flex-col gap-5 ml-[100px] w-56 mt-20 hidden fixed">
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
            <Link
              to="/wallet_security"
              className="text-[#2D5C8F] font-semibold"
            >
              Wallet Security
            </Link>
            <Link to="/log" className="text-[#6A6A6A] ">
              Logs
            </Link>
          </div>
        </div>

        <div className=" mt-20 w-full sm:ml-80  min-h-full">
          <div className="w-full flex justify-between items-center px-4 py-4">
            <p className="text-[#6A6A6A] font-semibold text-lg">
              Wallet Security
            </p>
            {is_admin == 1 && (
              <Link
                to="/wallet_monitor_create"
                className="flex items-center gap-2 p-0 text-[#6A6A6A] font-medium "
              >
                Create Wallet Security{" "}
                <FaCirclePlus className="text-5xl text-green-500 p-0" />
              </Link>
            )}
          </div>
          <Wallet_Security_Cmp />
        </div>
      </div>
    </div>
  );
}

export default Wallet_Security;
