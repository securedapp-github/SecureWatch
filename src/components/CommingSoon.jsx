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

        <div className="  mt-20 w-full  flex flex-col gap justify-center items-center ">
          <h1 className="text-black font-medium text-2xl md:text-5xl text-center">
          Great things coming soon.
          </h1>

          <p className="text-slate-400 py-1 text-xs sm:text-sm md:text-lg text-center sm:text-center px-3 ">
          We're working hard to bring you something amazing. Stay tuned!
          </p>
        </div>
      </div>
    </div>
  );
}

export default Logs;
