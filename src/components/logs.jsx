import React from "react";
import { Link } from "react-router-dom";
import NewNavbar from "./NewNavbar";
import Sidebar from "./Sidebar";

function Logs() {
  const userEmail = localStorage.getItem("email");
  console.log(userEmail);

  return (
    <div className="w-full h-full">
      <NewNavbar email={userEmail} />
      <div className="bg-[#FAFAFA] w-full flex h-full">
        <Sidebar />

        <div className=" h-full sm:flex flex-col gap-5 ml-[100px] hidden sm:mt-20 fixed ">
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
            <Link to="/wallet_security" className="text-[#6A6A6A]">
                        Wallet Monitor
                        </Link>
            {/* <Link to="/log" className="text-[#2D5C8F] font-semibold">
              Logs
            </Link> */}
          </div>
        </div>

        <div className="  mt-24 w-full  sm:w-[440px] flex flex-col gap-6 sm:ml-72">
          <h1 className="text-black font-bold text-2xl text-center">
            Activity Tracking Simplified
          </h1>

          <p className="text-black text-left sm:text-center p-3 mx-auto">
            Our system meticulously maintains a detailed log of all activities,
            providing you with a comprehensive overview of your account's
            operations. From adjustments in settings and configurations to
            automated processes such as transactions and alerts, every action is
            carefully tracked.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Logs;
