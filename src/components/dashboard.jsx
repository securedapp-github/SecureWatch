import React,{ useState } from "react";
import {Link, useLocation, useNavigate } from "react-router-dom";
import { baseUrl } from "../Constants/data";
import sha256 from 'js-sha256';
import NewNavbar from "./NewNavbar";
import { TbClockHour9 } from "react-icons/tb";
import { GrDocumentText } from "react-icons/gr";
import { FaRegCalendarAlt } from "react-icons/fa";
import { PiSquaresFourBold } from "react-icons/pi";
import { RiPieChartLine } from "react-icons/ri";
import { IoPersonSharp } from "react-icons/io5";
import { LuNetwork } from "react-icons/lu";
import SecureDapp from '../images/SecureDapp.png'
import { FaPlay } from "react-icons/fa";

function Dashboard() {
  const [expand, setExpand] = useState(false);
  const [hash, setHash] = useState('');
  const token = localStorage.getItem("token");
  const User_id = localStorage.getItem("userId");
  const [values, setValues] = useState([]);
  const [listeners, setListeners] = useState('');
  const [alert, setAlert]= useState('')
  const [monitorcount, setMonitorcount] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { email, monitor = {} } = location.state || {};
  // console.log(email);

  const Login = localStorage.getItem("login");
  console.log(Login);
  const Token = localStorage.getItem("token");
  console.log(Token);
  const Moniter = localStorage.getItem("moniter");
console.log(Moniter);
  const userEmail = localStorage.getItem("email")
console.log(userEmail);
  const userCredits = localStorage.getItem("credits");
  console.log("userCredits",userCredits);
  const userPlanexpiry = localStorage.getItem("planexpiry");
  console.log("userPlanexpiry",userPlanexpiry);    
 
   const [credits, setCredits] = useState(userCredits || 0);
    const [planexpiry, setPlanexpiry] = useState(userPlanexpiry || 0);
    const planexpiryDate = new Date(planexpiry);
const formattedPlanExpiry = new Intl.DateTimeFormat('en-IN', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric'
}).format(planexpiryDate);

  function handleClick() {
    navigate("/monitor", { state: { email, token, monitor } });
  }

// console.log(monitor);
  //   console.log(s);
  React.useEffect(() => {
    const emailHash = sha256(userEmail);
    setHash(emailHash.substring(0,8));
    const fetchMoniter = async () => {
      const res=await fetch( `${baseUrl}/get_monitor`,{
        method:'POST',
        headers:{
          'Content-Type':'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body:JSON.stringify({
          "user_id": User_id
        })
      });
      const data = await res.json();
      setValues(data);
      setListeners(data.listeners[0].active_listeners);
      setAlert(data.alerts[0].alerts)
      setMonitorcount(data.monitors.length)
    };
    fetchMoniter();
  }, []);

   console.log(values);
   console.log("Monitors",monitorcount)
  // console.log("Listeners",values.listeners[0].active_listeners);
  


  return (
      <div className="w-full h-full">
        {/* <Navbar email={userEmail} /> */}
        <NewNavbar email={userEmail} />
        <div className="bg-[#FAFAFA] w-full flex h-full">
    <div id="sidebar"  onMouseOver={()=>setExpand(true)} onMouseLeave={()=>setExpand(false)} className={`${expand?"bg-white shadow-2xl items-start":" items-center"} border-r-2 border-r-[#D3D3D3] h-full flex flex-col justify-start  absolute`}>
      <div className={` flex flex-col  gap-7  ${expand?"m-0 pr-12 mt-5":"m-0 mt-5"}`}>
        {expand?
        (
        <div className="flex flex-col justify-center">
          <button className="bg-[#2d5c8f] rounded-r-full p-3 text-white flex items-center gap-3 pr-14 py-4"><TbClockHour9 className="text-white text-2xl" /> Realtime Security</button>
        </div>)
        :
        (
          <div className="flex flex-col justify-center">
          <button className="bg-[#2d5c8f] rounded-full p-3"><TbClockHour9 className="text-white text-2xl" /></button>
        </div>
        )}
        
        <div className={`flex flex-col  ${expand?"items-start ml-5 ":"items-center "} justify-center gap-7 `}>
          <button className={`${expand?"flex items-center gap-3":""}`}><GrDocumentText className="text-2xl text-gray-600" /> <span className="text-[#6A6A6A]">{expand?"Security Audit":""}</span> </button>
          <button className={`${expand?"flex items-center gap-3":""}`}><FaRegCalendarAlt className="text-2xl text-gray-600" /> <span className="text-[#6A6A6A]">{expand?"Historic events":""}</span> </button>
          <button className={`${expand?"flex items-center gap-2":""}`}><PiSquaresFourBold className="text-3xl text-gray-600" /> <span className="text-[#6A6A6A]">{expand?"Blockchain Forensics":""}</span> </button>
          <button className={`${expand?"flex items-center gap-2":""}`}><RiPieChartLine className="text-3xl text-gray-600" /> <span className="text-[#6A6A6A]">{expand?"Analytics & Report":""}</span> </button>
          <button className={`${expand?"flex items-center gap-2":""}`}><IoPersonSharp className="text-3xl text-gray-600" /> <span className="text-[#6A6A6A]">{expand?"Admin":""}</span> </button>
          <button className={`${expand?"flex items-center gap-2":""}`}><LuNetwork className="text-3xl text-gray-600" /> <span className="text-[#6A6A6A]">{expand?"Integration Hub":""}</span> </button>
          
        </div>
        </div>
        <div className="mt-24 m-5 flex gap-1 items-center justify-start">
          <img src={SecureDapp} alt="SecureDapp logo" className="w-14" />
            <span className="text-black logo text-lg">{expand?"Securewatch":""}</span>
        </div>
    </div>

<div className=" h-full flex flex-col gap-5 ml-[100px]">
  <div className={`mt-5 ${expand? "":"bg-[#6A6A6A1A]"} py-3 pl-4 pr-12 rounded-r-full`}>
    <h1 className="text-[#6A6A6A] text-lg font-semibold ">Realtime Security</h1>
  </div>
  <div className="flex flex-col gap-5 ml-5">
    <Link to="/dashboard" className="text-[#2D5C8F] font-semibold">Overview</Link>
    <Link to="/monitor" className="text-[#6A6A6A]">Monitor</Link>
    <Link to="/log" className="text-[#6A6A6A]">Logs</Link>
  </div>

</div>


    <div className="w-auto ml-10 ">


          <div className="mt-10 flex justify-start items-center gap-6 flex-wrap ">

            <div className="flex mt-4 md:mt-0 font-poppin ">
              <div className="my-auto">
                <span className="text-[#6A6A6A] font-bold sm:text-xl md:text-2xl">
                  Tenant ID  
                </span>
                <span className="text-[#6A6A6A] text-xl">{"  "+"#"+hash+"...."}</span>
              </div>
             
            </div>

          </div>



          <div className="font-inter flex gap-4 justify-center flex-wrap mt-10 ">
            <div
              className=" w-[299px] h-[139px] p-4 rounded-md bg-white border-2 shadow-lg border-[#ECECEC]"
              
            >
              <div className="text-start  flex items-center gap-3 text-[#6A6A6A] ">  LISTENERS</div>
              <div className="flex mt-5">
                <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl mr-2 2xl:mr-4  text-[#6A6A6A]">{listeners}</span>
                <span>
                  <div className="text-[#6A6A6A] text-xs sm:text-sm font-medium">CHECK <br />ACTIVE LISTENERS</div>
                 
                </span>
                
              </div>
            </div>
            <div
              className=" w-[299px] h-[139px] p-4 rounded-md bg-white border-2 shadow-lg border-[#ECECEC]"
              
            >
              <div className="text-start  flex items-center gap-3 text-[#6A6A6A]"> Onchain Events</div>
              <div className="flex mt-5">
                <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl mr-2 2xl:mr-4 text-[#6A6A6A]">{alert}</span>
                <span>
                  <div className="text-[#6A6A6A] text-xs sm:text-sm font-medium">CHECK <br />ALL ALERTS</div>
                </span>
                
              </div>
            </div>
            <div className=" w-[299px] h-[139px]  rounded-md bg-white border-2 shadow-lg border-[#ECECEC] flex">
              <div className=" p-4 w-[90%]">
              <p className="text-start flex items-center gap-3 text-[#6A6A6A]"> Monitor</p>
              <div className="flex mt-5">
                <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl mr-2 2xl:mr-4  text-[#6A6A6A]">{monitorcount}</span>
                <span>
                  <div className="text-[#6A6A6A] text-xs sm:text-sm font-medium">CHECK <br />ALL MONITORS</div>
                </span>
                
              </div>
              </div>
              <Link to="/monitor" className="border-l-2 flex justify-center items-center w-[10%]">
                  <FaPlay className="text-[#6A6A6A] text-xs" />
                  </Link>
              
            </div>



          </div>

          <div className="font-inter flex gap-4 justify-start flex-wrap mt-10 ">

            <div
              className=" w-[299px] h-[139px] p-4 rounded-md bg-white border-2 shadow-lg border-[#ECECEC]"
              
            >
              <div className="text-start flex items-center gap-3 text-[#6A6A6A]">Incident Reported</div>
              <div className="flex justify-between mt-5">
                <div className="flex">
                  <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl mr-10 text-[#6A6A6A] ">02</span>
                  <span>
                    <div className="text-[#6A6A6A] text-xs sm:text-sm font-medium">CHECK <br />TOTAL ALERTS</div>
                  </span>
                </div>
                
              </div>
            </div>
            <div
              className="p-4 w-[299px] h-[139px] rounded-md bg-white border-2 shadow-lg border-[#ECECEC]"
              
            >
              <div className="text-start flex items-center gap-3 text-[#6A6A6A]">USER PLANS</div>
              <div className="flex gap-6 mt-5 items-center">

                <div className="flex items-center">
                  <span className=" text-2xl sm:text-3xl md:text-4xl lg:text-5xl mr-2 text-[#6A6A6A]">{credits}</span>
                  <span>
                    <div className="text-[#6A6A6A] text-xs sm:text-sm font-medium">ACCOUNT <br />CREDITS</div>
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className=" text-xs sm:text-sm font-medium mr-2 text-[#6A6A6A]">{formattedPlanExpiry || planexpiry}</span>
                  <span>
                    <div className="text-[#6A6A6A] text-xs sm:text-sm font-medium">PLAN EXPIRY</div>
                  </span>
                </div>
                
              </div>


            </div>
          </div>
          
        </div>

        </div>
      </div>
   
  );
}

export default Dashboard;
