import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { baseUrl } from "../Constants/data";
import sha256 from "js-sha256";
import NewNavbar from "./NewNavbar";
import { FaPlay } from "react-icons/fa";
import Sidebar from "./Sidebar";
import { MdOutlineHeadphones } from "react-icons/md";
import { FaRegBell } from "react-icons/fa6";
import { MdMonitor } from "react-icons/md";
import { TbAlertTriangle } from "react-icons/tb";
import { TbUserSquare } from "react-icons/tb";
import { CgHome } from "react-icons/cg";
import { MdOutlineSettings } from "react-icons/md";

function Dashboard() {
  const [hash, setHash] = useState("");
  const token = localStorage.getItem("token");
  const User_id = localStorage.getItem("userId");
  const [values, setValues] = useState([]);
  const [listeners, setListeners] = useState("");
  const [alert, setAlert] = useState("");
  const [monitorcount, setMonitorcount] = useState([]);
  const [walletMoniterCount, setWalletMoniterCount] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { email, monitor = {} } = location.state || {};

  const Login = localStorage.getItem("login");
  console.log(Login);
  const Token = localStorage.getItem("token");
  console.log(Token);
  const Moniter = localStorage.getItem("moniter");
  console.log(Moniter);
  const userEmail = localStorage.getItem("email");
  console.log(userEmail);
  const userCredits = localStorage.getItem("credits");
  console.log("userCredits", userCredits);
  const userPlanexpiry = localStorage.getItem("planexpiry");
  console.log("userPlanexpiry", userPlanexpiry);
  const parent_id = localStorage.getItem("parent_id");
  const userId = localStorage.getItem("userId");
  console.log("dashboard parent_id", parent_id);
  const is_admin = localStorage.getItem("is_admin") ;
  console.log("dashboard is_admin", is_admin);

  const [credits, setCredits] = useState(userCredits || 0);
  const [planexpiry, setPlanexpiry] = useState(userPlanexpiry || null);
  // const [formattedPlanExpiry, setFormattedPlanExpiry] = useState(null);
  
  // if (userPlanexpiry){
  //   const planexpiryDate = new Date(planexpiry);
  //   const formattedPlanExpiry = new Intl.DateTimeFormat("en-IN", {
  //     day: "2-digit",
  //     month: "2-digit",
  //     year: "numeric",
  //   }).format(planexpiryDate);
  //   setFormattedPlanExpiry(formattedPlanExpiry);
  // }
  const isValidDate = (dateString) => {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };

  function handleClick() {
    navigate("/monitor", { state: { email, token, monitor } });
  }

  // console.log(monitor);
  //   console.log(s);
  React.useEffect(() => {
    const emailHash = sha256(userEmail);
    setHash(emailHash.substring(0, 8));
    const fetchMoniter = async () => {
      const res = await fetch(`${baseUrl}/get_monitor`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: User_id,
        }),
      });
      const data = await res.json();
      setValues(data);
      setListeners(data.listeners[0].active_listeners);
      setAlert(data.alerts[0].alerts);
      setMonitorcount(data.monitors.length);
    };
    fetchMoniter();
  }, []);
  

  console.log(values);
  console.log("Monitors", monitorcount);

  useEffect(() => {
    const fetchMoniter = async () => {
      const res = await fetch(`${baseUrl}/get_wallet_monitor`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: parent_id != 0 ? parseInt(parent_id) : parseInt(userId),
        }),
      });
      const data = await res.json();
      console.log("wallet monitor count", data.monitors.length);
      setWalletMoniterCount(data.monitors.length);
      
    };
    fetchMoniter();
  }, []);

  return (
    <div className="w-full min-h-screen">
      <NewNavbar email={userEmail} />
      <div className=" w-full flex flex-col h-full bg-white pb-4">
        <div className="hidden sm:block">
        <Sidebar />
        </div>
        <div className="w-[calc(100%-96px)]  px-3  lg:ml-24  mt-20 hidden lg:flex justify-between items-center border-b-2 border-b-[#D3D3D3] py-4  ">
          <div className="flex flex-row gap-3"> 
          <span className="text-black font-bold text-center ">
                  Tenant ID
                  <span className="text-black ">
                  {"  " + "#" + hash}
                </span>
                </span>

        <Link to="dashboard" className="text-black flex gap-1 items-center"><CgHome /> <span className="text-sm font-medium">Dashboard</span></Link>
        <Link className="text-black flex gap-1 items-center"><MdOutlineSettings  /><span className="text-sm font-medium">Settings</span> </Link>
          </div>

       

        </div>

        <div className=" md:ml-24 mt-20 lg:mt-0 w-full lg:w-[calc(100%-96px)] h-full flex flex-col justify-start items-start bg-white     ">

        <p className="text-black text-xl font-medium lg:ml-20 xl:ml-36 mt-5 md:mt-10 mb-5 self-center lg:self-start text-center lg:text-start">Overview</p>

          <div className="font-inter w-full xl:w-[1300px] flex gap-4 flex-wrap flex-col md:flex-row justify-center items-center  ">

            

            <div className=" w-[330px] h-[210px] p-4 flex flex-col justify-start items-start  gap-3 rounded-2xl bg-[#F7F5FF]  shadow ">
              <div className="bg-[#E7E6F4] rounded-full w-7 h-7 flex justify-center items-center"><MdOutlineHeadphones className="text-[#6549FD]"/></div>
              <p className=" text-black text-sm font-medium">WALLET MONITOR</p>
              <p className="text-sm  text-black">{walletMoniterCount}</p>
              <p className="text-[#6A6A6A] text-xs sm:text-sm font-medium">CHECK WALLET MONITORS</p>
              <Link to="/wallet_security" className="bg-[#6549FD] text-white px-3 py-1 rounded-lg text-sm font-medium">View Monitors</Link>
            </div>


            <div className=" w-[330px] h-[210px] p-4 flex flex-col justify-start items-start  gap-3 rounded-2xl bg-[#F7F5FF]  shadow ">
              <div className="bg-[#E7E6F4] rounded-full w-7 h-7 flex justify-center items-center"><FaRegBell className="text-[#6549FD]"/></div>
              <p className=" text-black text-sm font-medium">ONCHAIN ALERTS</p>
              <p className="text-sm  text-black">{alert}</p>
              <p className="text-[#6A6A6A] text-xs sm:text-sm font-medium">CHECK ALL ALERTS</p>
              <Link to="#" className="bg-[#6549FD] text-white px-3 py-1 rounded-lg text-sm font-medium">View Alerts</Link>
            </div>

            <div className=" w-[330px] h-[210px] p-4 flex flex-col justify-start items-start  gap-3 rounded-2xl bg-[#F7F5FF]  shadow ">
              <div className="bg-[#E7E6F4] rounded-full w-7 h-7 flex justify-center items-center"><MdMonitor className="text-[#6549FD]"/></div>
              <p className=" text-black text-sm font-medium">CONTRACT MONITOR</p>
              <p className="text-sm  text-black">{monitorcount}</p>
              <p className="text-[#6A6A6A] text-xs sm:text-sm font-medium">CHECK ALL MONITORS</p>
              <Link to="/monitor" className="bg-[#6549FD] text-white px-3 py-1 rounded-lg text-sm font-medium">View Monitors</Link>
            </div>

            <div className=" w-[330px] xl:hidden h-[210px] p-4 flex flex-col justify-start items-start  gap-3 rounded-2xl bg-[#F7F5FF]  shadow ">
              <div className="bg-[#E7E6F4] rounded-full w-7 h-7 flex justify-center items-center"><TbAlertTriangle className="text-[#6549FD]"/></div>
              <p className=" text-black text-sm font-medium">INCIDENT REPORTED</p>
              <p className="text-sm  text-black">{alert}</p>
              <p className="text-[#6A6A6A] text-xs sm:text-sm font-medium">CHECK TOTAL ALERTS</p>
              <Link to="#" className="bg-[#6549FD] text-white px-3 py-1 rounded-lg text-sm font-medium">View Incidents</Link>
            </div>

            <div className=" w-[330px] xl:hidden h-[210px] p-4 flex flex-col justify-start items-start  gap-3 rounded-2xl bg-[#F7F5FF]  shadow ">
              <div className="bg-[#E7E6F4] rounded-full w-7 h-7 flex justify-center items-center"><TbUserSquare className="text-[#6549FD]"/></div>
              <p className=" text-black text-sm font-medium">USER PLANS</p>
              <p className="text-sm  text-black">{credits}</p>
              <p className="text-[#6A6A6A] text-xs sm:text-sm font-medium">ACCOUNT CREDITS</p>
              <Link to="#" className="bg-[#6549FD] text-white px-3 py-1 rounded-lg text-sm font-medium">Manage Plan</Link>
            </div>

            <div className=" w-[505px] hidden h-[210px] p-4 xl:flex flex-col justify-start items-start  gap-3 rounded-2xl bg-[#F7F5FF]  shadow ">
              <div className="bg-[#E7E6F4] rounded-full w-7 h-7 flex justify-center items-center"><TbAlertTriangle className="text-[#6549FD]"/></div>
              <p className=" text-black text-sm font-medium">INCIDENT REPORTED</p>
              <p className="text-sm  text-black">{alert}</p>
              <p className="text-[#6A6A6A] text-xs sm:text-sm font-medium">CHECK TOTAL ALERTS</p>
              <Link to="#" className="bg-[#6549FD] text-white px-3 py-1 rounded-lg text-sm font-medium">View Incidents</Link>
            </div>

            <div className=" w-[505px] hidden h-[210px] p-4 xl:flex flex-col justify-start items-start  gap-3 rounded-2xl bg-[#F7F5FF]  shadow ">
              <div className="bg-[#E7E6F4] rounded-full w-7 h-7 flex justify-center items-center"><TbUserSquare className="text-[#6549FD]"/></div>
              <p className=" text-black text-sm font-medium">USER PLANS</p>
              <p className="text-sm  text-black">{credits}</p>
              <p className="text-[#6A6A6A] text-xs sm:text-sm font-medium">ACCOUNT CREDITS</p>
              <Link to="#" className="bg-[#6549FD] text-white px-3 py-1 rounded-lg text-sm font-medium">Manage Plan</Link>
            </div>



          </div>
        </div>


      </div>
    </div>
  );
}

export default Dashboard;
