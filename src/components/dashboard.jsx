import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { baseUrl } from "../Constants/data";
import sha256 from "js-sha256";
import NewNavbar from "./NewNavbar";
import { FaPlay } from "react-icons/fa";
import Sidebar from "./Sidebar";

function Dashboard() {
  const [hash, setHash] = useState("");
  const token = localStorage.getItem("token");
  const User_id = localStorage.getItem("userId");
  const [values, setValues] = useState([]);
  const [listeners, setListeners] = useState("");
  const [alert, setAlert] = useState("");
  const [monitorcount, setMonitorcount] = useState([]);
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

  return (
    <div className="w-full min-h-full">
      <NewNavbar email={userEmail} />
      <div className="bg-[#FAFAFA] w-full flex h-full">
        <Sidebar />

        <div className=" h-full sm:flex flex-col gap-5 ml-[100px] mt-20 hidden">
          <div className={`mt-5 py-3 pl-4 pr-9 rounded-r-full bg-[#6A6A6A1A]`}>
            <h1 className="text-[#6A6A6A]  font-semibold text-nowrap">
              Realtime Security
            </h1>
          </div>
          <div className="flex flex-col gap-5 ml-5">
            <Link to="/dashboard" className="text-[#2D5C8F] font-semibold">
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

        <div className="sm:w-auto sm:ml-10 mt-20 w-full ">

          <div className="w-full text-center flex flex-col justify-center items-center gap-4 mt-5 sm:hidden">
            <div className="p-3 border border-[#6A6A6A] rounded-full px-6">
              <p className="text-[#6A6A6A] text-xl">Realtime Security</p>
            </div>
          <span className="text-[#6A6A6A] font-bold text-center  sm:text-xl md:text-2xl">
                  Tenant ID
                  <span className="text-[#6A6A6A] text-xl">
                  {"  " + "#" + hash + "...."}
                </span>
                </span>
                
          </div>

          <div className="sm:mt-10 flex justify-start items-center gap-6 flex-wrap ">
            <div className="flex mt-4 md:mt-0 font-poppin text-center">
              <div className="my-auto  text-center  hidden sm:block">
                <span className="text-[#6A6A6A] font-bold text-center  sm:text-xl md:text-2xl ">
                  Tenant ID
                </span>
                <span className="text-[#6A6A6A] text-xl">
                  {"  " + "#" + hash + "...."}
                </span>
              </div>
            </div>
          </div>

          <div className="font-inter flex flex-col sm:flex-row gap-4 justify-center items-center flex-wrap sm:mt-10 ">
            <div className=" w-[299px] h-[139px] p-4 rounded-md bg-white border-2 shadow-lg border-[#ECECEC]">
              <div className="text-start  flex items-center gap-3 text-[#6A6A6A] ">
                {" "}
                LISTENERS
              </div>
              <div className="flex mt-5">
                <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl mr-2 2xl:mr-4  text-[#6A6A6A]">
                  {listeners}
                </span>
                <span>
                  <div className="text-[#6A6A6A] text-xs sm:text-sm font-medium">
                    CHECK <br />
                    ACTIVE LISTENERS
                  </div>
                </span>
              </div>
            </div>
            <div className=" w-[299px] h-[139px] p-4 rounded-md bg-white border-2 shadow-lg border-[#ECECEC]">
              <div className="text-start  flex items-center gap-3 text-[#6A6A6A]">
                {" "}
                Onchain Events
              </div>
              <div className="flex mt-5">
                <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl mr-2 2xl:mr-4 text-[#6A6A6A]">
                  {alert}
                </span>
                <span>
                  <div className="text-[#6A6A6A] text-xs sm:text-sm font-medium">
                    CHECK <br />
                    ALL ALERTS
                  </div>
                </span>
              </div>
            </div>
            <div className=" w-[299px] h-[139px]  rounded-md bg-white border-2 shadow-lg border-[#ECECEC] flex">
              <div className=" p-4 w-[90%]">
                <p className="text-start flex items-center gap-3 text-[#6A6A6A]">
                  {" "}
                  Monitor
                </p>
                <div className="flex mt-5">
                  <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl mr-2 2xl:mr-4  text-[#6A6A6A]">
                    {monitorcount}
                  </span>
                  <span>
                    <div className="text-[#6A6A6A] text-xs sm:text-sm font-medium">
                      CHECK <br />
                      ALL MONITORS
                    </div>
                  </span>
                </div>
              </div>
              <Link
                to="/monitor"
                className="border-l-2 flex justify-center items-center w-[10%]"
              >
                <FaPlay className="text-[#6A6A6A] text-xs" />
              </Link>
            </div>
            <div className=" w-[299px] h-[139px] p-4 rounded-md xl:hidden bg-white border-2 shadow-lg border-[#ECECEC]">
              <div className="text-start flex items-center gap-3 text-[#6A6A6A]">
                Incident Reported
              </div>
              <div className="flex justify-between mt-5">
                <div className="flex">
                  <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl mr-10 text-[#6A6A6A] ">
                  {alert}
                  </span>
                  <span>
                    <div className="text-[#6A6A6A] text-xs sm:text-sm font-medium">
                      CHECK <br />
                      TOTAL ALERTS
                    </div>
                  </span>
                </div>
              </div>
            </div>
            <div className="p-4 w-[299px] h-[139px] rounded-md xl:hidden bg-white border-2 shadow-lg border-[#ECECEC] mb-10 xl:mb-0">
              <div className="text-start flex items-center gap-3 text-[#6A6A6A]">
                USER PLANS
              </div>
              <div className="flex gap-6 mt-5 items-center">
                <div className="flex items-center">
                  <span className=" text-2xl sm:text-3xl md:text-4xl lg:text-5xl mr-2 text-[#6A6A6A]">
                    {credits}
                  </span>
                  <span>
                    <div className="text-[#6A6A6A] text-xs sm:text-sm font-medium">
                      ACCOUNT <br />
                      CREDITS
                    </div>
                  </span>
                </div>
                {planexpiry && isValidDate(planexpiry) ? (
        <div className="flex flex-col">
          <span className="text-xs sm:text-sm font-medium mr-2 text-[#6A6A6A]">
            {formatDate(planexpiry)}
          </span>
          <span>
            <div className="text-[#6A6A6A] text-xs sm:text-sm font-medium">
              PLAN EXPIRY
            </div>
          </span>
        </div>
      ) : null}
              </div>
            </div>
          </div>

          <div className="font-inter xl:flex gap-4 justify-center md:justify-start flex-wrap mt-10 hidden mb-10">
            <div className=" w-[299px] h-[139px] p-4 rounded-md bg-white border-2 shadow-lg border-[#ECECEC]">
              <div className="text-start flex items-center gap-3 text-[#6A6A6A]">
                Incident Reported
              </div>
              <div className="flex justify-between mt-5">
                <div className="flex">
                  <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl mr-10 text-[#6A6A6A] ">
                  {alert}
                  </span>
                  <span>
                    <div className="text-[#6A6A6A] text-xs sm:text-sm font-medium">
                      CHECK <br />
                      TOTAL ALERTS
                    </div>
                  </span>
                </div>
              </div>
            </div>
            <div className="p-4 w-[299px] h-[139px] rounded-md bg-white border-2 shadow-lg border-[#ECECEC]">
              <div className="text-start flex items-center gap-3 text-[#6A6A6A]">
                USER PLANS
              </div>
              <div className="flex gap-6 mt-5 items-center">
                <div className="flex items-center">
                  <span className=" text-2xl sm:text-3xl md:text-4xl lg:text-5xl mr-2 text-[#6A6A6A]">
                    {credits}
                  </span>
                  <span>
                    <div className="text-[#6A6A6A] text-xs sm:text-sm font-medium">
                      ACCOUNT <br />
                      CREDITS
                    </div>
                  </span>
                </div>
                {planexpiry && isValidDate(planexpiry) ? (
        <div className="flex flex-col">
          <span className="text-xs sm:text-sm font-medium mr-2 text-[#6A6A6A] ">
            {formatDate(planexpiry)}
          </span>
          <span>
            <div className="text-[#6A6A6A] text-xs sm:text-sm font-medium">
              PLAN EXPIRY
            </div>
          </span>
        </div>
      ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
