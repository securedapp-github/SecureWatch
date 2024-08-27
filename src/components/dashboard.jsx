import * as React from "react";
import { Link } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "./navbar2";
import Deploy from '../images/Deploy.png';
import Sliders from '../images/Sliders.png';
import Eye from '../images/Eye.png';
import Grid from '../images/grid.png'
import Actions from '../images/Actions.png';
import Code from '../images/code.png';
import { useState } from "react";
import { baseUrl } from "../Constants/data";


function Dashboard() {
  const [values, setValues] = useState([]);
  const [listeners, setListeners] = useState('');
  const [alert, setAlert]= useState('')
  const [monitorcount, setMonitorcount] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { email, monitor = {}, token } = location.state || {};
  // console.log(email);

  const Login = localStorage.getItem("login");
  console.log(Login);
  const Token = localStorage.getItem("token");
  console.log(Token);
  const Moniter = localStorage.getItem("moniter");
console.log(Moniter);
  const userEmail = localStorage.getItem("email")
console.log(userEmail);

  function handleClick() {
    navigate("/monitor", { state: { email, token, monitor } });
  }

// console.log(monitor);
  //   console.log(s);
  React.useEffect(() => {
    const fetchMoniter = async () => {
      const res=await fetch( `${baseUrl}/get_monitor`,{         //added authorization header for token decode
        method:'POST',
        headers:{
          Authorization: `Bearer ${Token}`,
          'Content-Type':'application/json'
        },
        body:JSON.stringify({
          "user_id": 6
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
      <div className="bg-white pt-12 pb-10">
        <Navbar email={userEmail} />
        <div className="w-4/6 mx-auto ">
          <div className="mt-10 flex justify-center items-center gap-6 flex-wrap ">
            <div className="flex gap-2">
              {/* <div className="font-poppin font-medium text-lg sm:text-ml md:text-2xl lg:text-3xl text-[#0CA851]  bg-[#A7FFCE] p-2 rounded-2xl text-center">
                SecureWatch Org
              </div> */}
              {/* <div className="my-auto">
                <svg
                  width="21"
                  height="21"
                  viewBox="0 0 21 21"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clip-path="url(#clip0_180_3184)">
                    <path
                      d="M9.5809 3.53229H3.48412C3.02213 3.53229 2.57906 3.71581 2.25239 4.04249C1.92571 4.36916 1.74219 4.81223 1.74219 5.27422V17.4678C1.74219 17.9298 1.92571 18.3728 2.25239 18.6995C2.57906 19.0262 3.02213 19.2097 3.48412 19.2097H15.6777C16.1397 19.2097 16.5827 19.0262 16.9094 18.6995C17.2361 18.3728 17.4196 17.9298 17.4196 17.4678V11.371"
                      stroke="#0CA851"
                      stroke-width="1.39355"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M16.112 2.22584C16.4585 1.87935 16.9284 1.68469 17.4184 1.68469C17.9084 1.68469 18.3784 1.87935 18.7249 2.22584C19.0714 2.57233 19.266 3.04228 19.266 3.53229C19.266 4.02231 19.0714 4.49225 18.7249 4.83875L10.4507 13.1129L6.9668 13.9839L7.83776 10.5L16.112 2.22584Z"
                      stroke="#0CA851"
                      stroke-width="1.39355"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_180_3184">
                      <rect
                        width="20.9032"
                        height="20.9032"
                        fill="white"
                        transform="translate(0 0.0484009)"
                      />
                    </clipPath>
                  </defs>
                </svg>
              </div> */}
            </div>

            <div className="flex mt-4 md:mt-0 font-poppin">
              <div className="my-auto">
                <span className="text-[#0CA851] font-bold sm:text-xl md:text-2xl">
                  Tenant ID 
                </span>
                <span className="text-black">#833f1c5e...</span>
              </div>
              <div className="my-auto">
                <svg
                  width="25"
                  height="25"
                  viewBox="0 0 25 25"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20.1289 9.5H11.1289C10.0243 9.5 9.12891 10.3954 9.12891 11.5V20.5C9.12891 21.6046 10.0243 22.5 11.1289 22.5H20.1289C21.2335 22.5 22.1289 21.6046 22.1289 20.5V11.5C22.1289 10.3954 21.2335 9.5 20.1289 9.5Z"
                    stroke="#434343"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M5.12891 15.5H4.12891C3.59847 15.5 3.08977 15.2893 2.71469 14.9142C2.33962 14.5391 2.12891 14.0304 2.12891 13.5V4.5C2.12891 3.96957 2.33962 3.46086 2.71469 3.08579C3.08977 2.71071 3.59847 2.5 4.12891 2.5H13.1289C13.6593 2.5 14.168 2.71071 14.5431 3.08579C14.9182 3.46086 15.1289 3.96957 15.1289 4.5V5.5"
                    stroke="#434343"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
            </div>

          </div>
          <div className="font-inter flex gap-4 justify-center flex-wrap mt-10">
            <div
              className="min-w-64 p-3 rounded-md "
              style={{ border: "1px solid #C9C9C9" }}
            >
              <div className="text-start  flex items-center gap-3"> <img src={Deploy} alt="" /> Deploy</div>
              <div className="flex mt-5">
                <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl mr-2 2xl:mr-6  text-black">{listeners}</span>
                <span>
                  <div className="text-black text-xs sm:text-sm font-medium">CHECK <br />ACTIVE LISTENERS</div>
                 
                </span>
                <span className="cursor-pointer">
                  <svg
                    width="33"
                    height="33"
                    viewBox="0 0 33 33"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clip-path="url(#clip0_167_85)">
                      <path
                        d="M9.76833 16.654H23.0754"
                        stroke="black"
                        stroke-width="1.88191"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M16.4219 10.0004L23.0754 16.654L16.4219 23.3075"
                        stroke="black"
                        stroke-width="1.88191"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_167_85">
                        <rect
                          width="22.5829"
                          height="22.5829"
                          fill="white"
                          transform="translate(16.4219 0.685921) rotate(45)"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                </span>
              </div>
            </div>
            <div
              className="min-w-64 p-3 rounded-md"
              style={{ border: "1px solid #C9C9C9" }}
            >
              <div className="text-start  flex items-center gap-3"> <img src={Sliders} alt="" /> Onchain Events</div>
              <div className="flex mt-5">
                <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl mr-2 2xl:mr-6 text-black">{alert}</span>
                <span>
                  <div className="text-black text-xs sm:text-sm font-medium">CHECK <br />ACTIVE ALERTS</div>
                </span>
                <span className="cursor-pointer">
                  <svg
                    width="33"
                    height="33"
                    viewBox="0 0 33 33"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clip-path="url(#clip0_167_85)">
                      <path
                        d="M9.76833 16.654H23.0754"
                        stroke="black"
                        stroke-width="1.88191"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M16.4219 10.0004L23.0754 16.654L16.4219 23.3075"
                        stroke="black"
                        stroke-width="1.88191"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_167_85">
                        <rect
                          width="22.5829"
                          height="22.5829"
                          fill="white"
                          transform="translate(16.4219 0.685921) rotate(45)"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                </span>
              </div>
            </div>
            <div
              className="min-w-64 p-3 rounded-md"
              style={{ border: "1px solid #C9C9C9" }}
            >
              <div className="text-start flex items-center gap-3"><img src={Eye} alt="" /> Monitor</div>
              <div className="flex mt-5">
                <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl mr-2 2xl:mr-6  text-black">{monitorcount}</span>
                <span>
                  <div className="text-black text-xs sm:text-sm font-medium">CHECK <br />ACTIVE MONITOR</div>
                </span>
                <span onClick={handleClick} className="ms-auto">
                  <Link to="/monitor">
                    <svg
                      width="33"
                      height="33"
                      viewBox="0 0 33 33"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clip-path="url(#clip0_167_85)">
                        <path
                          d="M9.76833 16.654H23.0754"
                          stroke="black"
                          stroke-width="1.88191"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M16.4219 10.0004L23.0754 16.654L16.4219 23.3075"
                          stroke="black"
                          stroke-width="1.88191"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_167_85">
                          <rect
                            width="22.5829"
                            height="22.5829"
                            fill="white"
                            transform="translate(16.4219 0.685921) rotate(45)"
                          />
                        </clipPath>
                      </defs>
                    </svg>
                  </Link>
                </span>
              </div>
            </div>
          </div>
          <div className="font-inter flex justify-between gap-10 mt-10 flex-col items-center lg:flex-row">
            <div
              className="min-w-64 lg:w-1/2 p-3 rounded-md"
              style={{ border: "1px solid #C9C9C9" }}
            >
              <div className="text-start flex items-center gap-3 "><img src={Grid} alt="" />Incident Reported</div>
              <div className="flex justify-between mt-5">
                <div className="flex">
                  <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl mr-10 text-black ">02</span>
                  <span>
                    <div className="text-black text-xs sm:text-sm md:text-lg lg:text-xl font-medium">CHECK <br />TOTAL SCENARIOS</div>
                  </span>
                </div>
                <span className="cursor-pointer">
                  <svg
                    width="33"
                    height="33"
                    viewBox="0 0 33 33"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clip-path="url(#clip0_167_85)">
                      <path
                        d="M9.76833 16.654H23.0754"
                        stroke="black"
                        stroke-width="1.88191"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M16.4219 10.0004L23.0754 16.654L16.4219 23.3075"
                        stroke="black"
                        stroke-width="1.88191"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_167_85">
                        <rect
                          width="22.5829"
                          height="22.5829"
                          fill="white"
                          transform="translate(16.4219 0.685921) rotate(45)"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                </span>
              </div>
            </div>
            <div
              className="p-3 min-w-64 lg:w-1/2 rounded-md"
              style={{ border: "1px solid #C9C9C9" }}
            >
              <div className="text-start flex items-center gap-3"><img src={Actions} alt="" />Actions (Coming Soon)</div>
              <div className="flex gap-6 flex-wrap mt-5">

                <div className="flex">
                  <span className=" sm:text-3xl md:text-4xl lg:text-5xl mr-2 text-black">00</span>
                  <span>
                    <div className="text-black text-xs sm:text-sm font-medium">ACTIVE <br />ACTIONS</div>
                  </span>
                </div>
                <div className="flex">
                  <span className=" sm:text-3xl md:text-4xl lg:text-5xl mr-2 text-black">00</span>
                  <span>
                    <div className="text-black text-xs sm:text-sm font-medium">PENDING <br />TX PROPOSALS</div>
                  </span>
                </div>
                <span className="cursor-pointer">
                  <svg
                    width="33"
                    height="33"
                    viewBox="0 0 33 33"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clip-path="url(#clip0_167_85)">
                      <path
                        d="M9.76833 16.654H23.0754"
                        stroke="black"
                        stroke-width="1.88191"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M16.4219 10.0004L23.0754 16.654L16.4219 23.3075"
                        stroke="black"
                        stroke-width="1.88191"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_167_85">
                        <rect
                          width="22.5829"
                          height="22.5829"
                          fill="white"
                          transform="translate(16.4219 0.685921) rotate(45)"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                </span>
              </div>


            </div>
          </div>
          <div
            className="font-inter p-3 rounded-md  mt-10  mx-auto"
            style={{ border: "1px solid #C9C9C9" }}
          >
            <div className="text-start flex items-center gap-3"><img src={Code} alt="" />Code (Coming Soon)</div>
<div className="flex justify-between items-center mt-3">
            <div className=" flex gap-5 flex-col md:flex-row md:justify-center md:items-center md:flex-wrap">
              <div className="flex  mt-4 md:mt-0">
                <span className="text-lg sm:text-2xl md:text-3xl  mr-2 my-auto font-semibold text-black">00</span>
                <div className="my-auto text-xs  font-medium text-black">SUCCESSFULL REPORT</div>
              </div>
              <div className="flex items-center gap-1 mt-4 md:mt-0">
                <span className="text-lg sm:text-2xl md:text-3xl  font-medium mr-2 text-black">00</span>
                <span>
                  <div className=" text-black text-xs  font-medium">CRITICAL FINDINGS <br />TO RESOLVE</div>
                </span>
              </div>
              <div className="flex items-center mt-4 md:mt-0">
                <span className="text-lg sm:text-2xl md:text-3xl  font-medium mr-2 text-black ">00</span>
                <span>
                  <div className="text-xs  font-medium text-black">HIGH FINDINGS <br />TO RESOLVE</div>
                </span>
              </div>
              <div className="flex items-center  mt-4 md:mt-0">
                <span className="text-lg sm:text-2xl md:text-3xl  font-medium mr-2 text-black">00</span>
                <span>
                  <div className="text-xs  font-medium text-black">MEDIUM FINDINGS <br />TO RESOLVE</div>
                </span>
              </div>
              <div className="flex items-center  mt-4 md:mt-0">
                <span className="text-lg sm:text-2xl md:text-3xl  font-medium mr-2 text-black">00</span>
                <span>
                  <div className="text-xs  font-medium text-black">LOW FINDINGS <br />TO RESOLVE</div>
                </span>
              </div>
            </div>

            <span>
                <svg width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#clip0_167_85)">
                    <path d="M9.76833 16.654H23.0754" stroke="black" strokeWidth={1.88191} strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M16.4219 10.0004L23.0754 16.654L16.4219 23.3075" stroke="black" strokeWidth={1.88191} strokeLinecap="round" strokeLinejoin="round" />
                  </g>
                  <defs>
                    <clipPath id="clip0_167_85">
                      <rect width="22.5829" height="22.5829" fill="white" transform="translate(16.4219 0.685921) rotate(45)" />
                    </clipPath>
                  </defs>
                </svg>
              </span>
              </div>
          </div> 
        </div>
      </div>
   
  );
}

export default Dashboard;