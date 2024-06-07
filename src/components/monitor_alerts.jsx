import React, { useState,useEffect } from "react";
import { useLocation } from 'react-router-dom';
import Navbar from "./navbar2";



function Monitor_alerts() {
  const location = useLocation();
  const { mid } = location.state;
  console.log("transfered mid",mid);
  const  [alert,setAlert] = useState([]);
  const email = localStorage.getItem("email")
  useEffect(() => {
    const fetchAlert = async () => {
      const res=await fetch('https://139-59-5-56.nip.io:3443/get_alerts',{
        method:'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify({
          "mid": mid
        })
      });
      const data = await res.json();
      setAlert(data);
    };
    fetchAlert();
  }, []);
  if (!alert.alerts||alert.alerts.length===0  ||  alert===undefined){
    return (
      <div className="pt-10 bg-white">
        <Navbar email={email} />
        <div className="text-xl lg:text-3xl font-medium text-black text-center  mt-20"> You have no monitor alerts</div> 
      </div>
    );
  }
 
  return (
    <div className='pt-10 bg-white pb-10'>
      <Navbar email={email} />
      <div className="text-xl lg:text-3xl font-medium text-black text-center mt-10">Your Monitor Alerts </div>

      <div>
      {alert.alerts && alert.alerts.map((alert) => {
        const id = alert.id;
        const hash = alert.hash;
        const arguemant = alert.arguments;
        const created_on= alert.created_on;
        const from_address = alert.from_address;
        const to_address = alert.to_address;
        return (
          <div className="">
            <div className="w-[95%] lg:w-4/6 mx-auto ">
              <div
                className="mt-10 p-6 flex justify-between flex-col md:flex-row rounded-2xl"
                style={{
                  border: "1px solid #0CA851",
                  boxShadow: "4px 4px 0px 0px #0CA851",
                }}
              >
                <div>
                  <div className="flex gap-3 flex-col">
                    {/* <div className="text-xl font-semibold text-black">Monitor id: {id}</div> */}

<div className="flex gap-6 items-center flex-wrap">
                    <div className="text-xl font-semibold text-black">
                     Transaction Hash : <span className="text-lg  text-[#7D7D7D]">{`${hash.slice(0, 5)}...${hash.slice(hash.length - 4)}`}</span>
                    </div>

                    <div className="flex gap-4 items-center">
                      <div className=" text-xl font-semibold text-black">Created on:</div>
                      <div className="bg-[#E9E9E9] px-3 py-2 rounded-md  my-auto flex gap-2">
                        <div>
                          <svg
                            width="22"
                            height="22"
                            viewBox="0 0 22 22"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <rect
                              x="0.759766"
                              y="0.909415"
                              width="20.4938"
                              height="20.4938"
                              rx="4.55417"
                              fill="#0CA851"
                            />
                          </svg>
                        </div>
                        <div className="my-auto text-[14px] text-black">{created_on}</div>
                      </div>
                    </div>
                    </div>

                  </div>

                  <div className="flex gap-1 flex-col ">
                      <div className=" text-xl font-semibold text-black">Arguemant:</div>

                      <div className="ml-1 md:ml-4 flex flex-col gap-2">
                      <div className=" text-lg font-semibold text-black">From: <span className="text-lg  text-[#7D7D7D] line-clamp-5">{arguemant.slice(9,51)}</span></div>

                      <div className=" text-lg font-semibold text-black">To: <span className="text-lg  text-[#7D7D7D] line-clamp-5">{arguemant.slice(59,101)}</span></div>

                      <div className=" text-lg font-semibold text-black">Value: <span className="text-lg  text-[#7D7D7D] line-clamp-5">{arguemant.slice(112,133)}</span></div>

                
                      </div>


<div className="flex flex-col gap-3">
                    

<div className="flex gap-6">
<div className="text-xl font-semibold text-black">From: <span className="text-lg mt-auto text-[#7D7D7D]">{`${from_address.slice(0, 5)}...${from_address.slice(from_address.length - 4)}`}</span> </div>
<div className="text-xl font-semibold text-black">To: <span className="text-lg mt-auto text-[#7D7D7D]">{`${to_address.slice(0, 5)}...${to_address.slice(to_address.length - 4)}`}</span></div>
</div>



</div>


                    <div>
                    </div>
                    <div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
    </div>
  )
}

export default Monitor_alerts;