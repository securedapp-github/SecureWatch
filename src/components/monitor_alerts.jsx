import React, { useState,useEffect } from "react";
import { useLocation } from 'react-router-dom';
import Navbar from "./navbar2";
import { FaCaretDown } from 'react-icons/fa';



function Monitor_alerts() {
  const location = useLocation();
  const { mid } = location.state;
  console.log("transfered mid",mid);
  const  [alert,setAlert] = useState([]);
  const email = localStorage.getItem("email")
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDiv, setActiveDiv] = useState(null);

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
    console.log("alert",alert);
  }, []);


  if (!alert.alerts||alert.alerts.length===0  ||  alert===undefined){
    return (
      <div className="pt-10 bg-white">
        <Navbar email={email} />
        <div className="text-xl lg:text-3xl font-medium text-black text-center  mt-20">You don't have any monitor alerts.</div> 
      </div>
    );
  }
 
  return (
    <div className='pt-10 bg-white pb-10'>
      <Navbar email={email} />
      <div className="text-xl lg:text-3xl font-medium text-black text-center mt-10">Your Monitor Alerts </div>

      <div>
      {alert.alerts && alert.alerts.map((alert,index) => {
        const id = alert.id;
        const hash = alert.hash;
        const arguemant = alert.arguments;
        const created_on= alert.created_on;
        const from_address = alert.from_address;
        const to_address = alert.to_address;
        const eid = alert.eid;
        return (
          <div className="">
            <div key={index} className="w-[95%] lg:w-4/6 mx-auto  flex flex-col mb-14 mt-10 ">

            <div className="w-full flex gap-4 flex-wrap">

            <div className="text-xl font-semibold text-gray-500 bg-[#E9E9E9] px-3 py-2 rounded-xl border-2 border-gray-300">
                     Hash : <span className="text-lg  text-black ">{`${hash.slice(0, 5)}...${hash.slice(hash.length - 4)}`}</span>
                    </div>

{/* <button onClick={()=>{
  setIsMenuOpen(!isMenuOpen);
}} className="flex relative gap-2 items-center text-xl font-semibold text-gray-500 bg-[#E9E9E9] px-3 py-2 rounded-xl border-2 border-gray-300">Created on <FaCaretDown />
{isMenuOpen && (
  <div className="absolute z-10 mt-24 mr-11">
    <div className="flex gap-2 items-center text-xl font-semibold text-gray-500 bg-[#E9E9E9] px-3 py-2 rounded-xl border-2 border-gray-300 text-nowrap">{created_on.slice(0,10)} {created_on.slice(11,16)}</div>
  </div>
)}
</button>  */}

<button onClick={() => setActiveDiv(activeDiv === index ? null : index)} className="flex relative gap-2 items-center text-xl font-semibold text-gray-500 bg-[#E9E9E9] px-3 py-2 rounded-xl border-2 border-gray-300">
    Created on <FaCaretDown />
    {activeDiv === index && (
      <div className="absolute z-10 mt-24 -left-1">
        <div className="flex gap-2 items-center text-xl font-semibold text-gray-500 bg-[#E9E9E9] px-3 py-2 rounded-xl border-2 border-gray-300 text-nowrap">{created_on.slice(0,10)} {created_on.slice(11,16)}</div>
      </div>
    )}
</button>



{/* <select name="Created on" className=" text-xl font-semibold text-gray-500 bg-[#E9E9E9] px-3 py-2 rounded-xl border-2 border-gray-300 focus:border-gray-300 active:border-gray-300 checked:border-gray-300 visited:border-gray-300">
  <option hidden>Created On</option>
  <option >{created_on.slice(0,10)} {created_on.slice(11,16)}</option>
</select> */}
                    {/* <div className="flex gap-2 items-center text-gray-500 bg-[#E9E9E9] px-3 py-2 rounded-xl border-2 border-gray-300">

                      <div className=" text-xl font-semibold text-gray-500">Created on:</div>
                        <div className="my-auto text-md font-medium text-black">{created_on.slice(0,10)} {created_on.slice(11,16)}
                      </div>
                      
                    </div> */}

                    <div className="text-xl font-semibold text-gray-500  bg-[#E9E9E9] px-3 py-2 rounded-xl border-2 border-gray-300">From: <span className="text-lg mt-auto text-black">{`${from_address.slice(0, 5)}...${from_address.slice(from_address.length - 4)}`}</span> </div>


<div className="text-xl font-semibold  text-gray-500 bg-[#E9E9E9] px-3 py-2 rounded-xl border-2 border-gray-300">To: <span className="text-lg mt-auto text-black">{`${to_address.slice(0, 5)}...${to_address.slice(to_address.length - 4)}`}</span></div>


            </div>

              <div
                className="mt-6 p-6 flex justify-between flex-col md:flex-row rounded-2xl border-2 border-gray-300 bg-neutral-100"
                // style={{
                //   border: "1px solid #0CA851",
                //   boxShadow: "4px 4px 0px 0px #0CA851",
                // }}
              >
                <div>
                  <div className="flex gap-3 flex-col">
                    {/* <div className="text-xl font-semibold text-black">Monitor id: {id}</div> */}

<div className="flex gap-6 items-center flex-wrap">
                    

                    
                    </div>

                  </div>

                  <div className="flex gap-1 flex-col ">
                      <div className=" text-xl font-semibold text-gray-500">Event: {eid}</div>

                      <div className=" flex flex-col gap-2">

                      <div className=" text-lg font-semibold text-gray-500 flex gap-1">From: <span className="text-lg  text-[#7D7D7D] line-clamp-5">{arguemant.slice(9,51)}</span></div>

                      <div className=" text-lg font-semibold text-gray-500 flex gap-1">To: <span className="text-lg  text-[#7D7D7D] line-clamp-5">{arguemant.slice(59,101)}</span></div>

                      <div className=" text-lg font-semibold text-gray-500 flex gap-1">Value: <span className="text-lg  text-[#7D7D7D] line-clamp-5">{arguemant.slice(112,133)}</span></div>

                
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