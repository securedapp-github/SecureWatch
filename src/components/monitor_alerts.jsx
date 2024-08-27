// import React, { useState,useEffect } from "react";
// import { useLocation } from 'react-router-dom';
// import Navbar from "./navbar2";
// import { FaCaretDown } from 'react-icons/fa';

// function Monitor_alerts() {
//   const location = useLocation();
//   const { mid } = location.state;
//   console.log("transfered mid",mid);
//   const  [alert,setAlert] = useState([]);
//   const email = localStorage.getItem("email")
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [activeDiv, setActiveDiv] = useState(null);

//   useEffect(() => {
//     const fetchAlert = async () => {
//       const res=await fetch('https://139-59-5-56.nip.io:3443/get_alerts',{
//         method:'POST',
//         headers:{
//           'Content-Type':'application/json'
//         },
//         body:JSON.stringify({
//           "mid": mid
//         })
//       });
//       const data = await res.json();
//       setAlert(data);
//     };
//     fetchAlert();
//     console.log("alert",alert);
//   }, []);


//   if (!alert.alerts||alert.alerts.length===0  ||  alert===undefined){
//     return (
//       <div className="pt-10 bg-white">
//         <Navbar email={email} />
//         <div className="text-lg lg:text-3xl font-medium text-black text-center  mt-20">You don't have any monitor alerts.</div> 
//       </div>
//     );
//   }
 
//   return (
//     <div className='pt-10 bg-white pb-10'>
//       <Navbar email={email} />
//       <div className="text-lg lg:text-3xl font-medium text-black text-center mt-10">Your Monitor Alerts </div>

//       <div>
//       {alert.alerts && alert.alerts.map((alert,index) => {
//         const id = alert.id;
//         const hash = alert.hash;
//         const arguemant = alert.arguments;
//         const created_on= alert.created_on;
//         const from_address = alert.from_address;
//         const to_address = alert.to_address;
//         const eid = alert.eid;
//         const name = alert.event_name;
//         return (
//           <div className="">
//             <div key={index} className="w-[95%] lg:w-4/6 mx-auto  flex flex-col mb-14 mt-10 ">

//             <div className="w-full flex gap-4 flex-wrap">

//             <div className="text-lg font-semibold text-gray-500 bg-[#E9E9E9] px-3 py-2 rounded-xl border-2 border-gray-300">
//                      Hash : <span className="text-lg  text-black ">{`${hash.slice(0, 5)}...${hash.slice(hash.length - 4)}`}</span>
//                     </div>

//                     <div className="flex gap-2 items-center text-gray-500 bg-[#E9E9E9] px-3 py-2 rounded-xl border-2 border-gray-300">
//                       <div className=" text-lg font-semibold text-gray-500">Created on:</div>
//                         <div className="my-auto text-md font-medium text-black">{created_on.slice(0,10)} {created_on.slice(11,16)}
//                       </div>
//                     </div>

//                     <div className="text-lg font-semibold text-gray-500  bg-[#E9E9E9] px-3 py-2 rounded-xl border-2 border-gray-300">From: <span className="text-lg mt-auto text-black">{`${from_address.slice(0, 5)}...${from_address.slice(from_address.length - 4)}`}</span> </div>


// <div className="text-lg font-semibold  text-gray-500 bg-[#E9E9E9] px-3 py-2 rounded-xl border-2 border-gray-300">To: <span className="text-lg mt-auto text-black">{`${to_address.slice(0, 5)}...${to_address.slice(to_address.length - 4)}`}</span></div>

// <button onClick={() => setActiveDiv(activeDiv === index ? null : index)} className="flex relative gap-2 items-center text-lg font-semibold text-gray-500 bg-[#E9E9E9] px-3 py-2 rounded-xl border-2 border-gray-300">
//     More <FaCaretDown />
    
// </button>

//             </div>

//             {activeDiv === index && (
//       <div
//       className="mt-6 p-6 flex justify-between flex-col md:flex-row rounded-2xl border-2 border-gray-300 bg-neutral-100"
//     >
//       <div>
//         <div className="flex gap-3 flex-col">
//           {/* <div className="text-lg font-semibold text-black">Monitor id: {id}</div> */}

// <div className="flex gap-6 items-center flex-wrap">
          

          
//           </div>

//         </div>

//         <div className="flex gap-1 flex-col ">
//             <div className=" text-lg font-semibold text-gray-500">Event: {name}</div>

//             <div className=" flex flex-col gap-2">

//             <div className=" text-lg font-semibold text-gray-500 flex gap-1">From: <span className="text-lg  text-[#7D7D7D] line-clamp-5">{arguemant.slice(9,51)}</span></div>

//             <div className=" text-lg font-semibold text-gray-500 flex gap-1">To: <span className="text-lg  text-[#7D7D7D] line-clamp-5">{arguemant.slice(59,101)}</span></div>

//             <div className=" text-lg font-semibold text-gray-500 flex gap-1">Value: <span className="text-lg  text-[#7D7D7D] line-clamp-5">{arguemant.slice(112,133)}</span></div>

      
//             </div>

//           <div>
//           </div>
//           <div>
//           </div>
//         </div>
//       </div>
//     </div>
//     )}
              



//             </div>
//           </div>
//         );
//       })}
//     </div>

//     </div>
//   )
// }

// export default Monitor_alerts;
import React, { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import Navbar from "./navbar2";
import { FaCaretDown } from 'react-icons/fa';

function Monitor_alerts() {
  const location = useLocation();
  const { mid, selectedEventNames } = location.state;
  console.log("transfered mid", mid);
  console.log("selected events", selectedEventNames);
  const [alerts, setAlerts] = useState([]);
  const email = localStorage.getItem("email");
  const [activeDiv, setActiveDiv] = useState(null);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await fetch('https://139-59-5-56.nip.io:3443/get_alerts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            "mid": mid,
            "eventNames": selectedEventNames
          })
        });
        const data = await res.json();
        setAlerts(data.alerts || []);
      } catch (error) {
        console.error("Error fetching alerts:", error);
      }
    };
    fetchAlerts();
  }, [mid, selectedEventNames]);

  if (alerts.length === 0) {
    return (
      <div className="pt-10 bg-white">
        <Navbar email={email} />
        <div className="text-lg lg:text-3xl font-medium text-black text-center mt-20">You don't have any monitor alerts for the selected events.</div> 
      </div>
    );
  }
 
  return (
    <div className='pt-10 bg-white pb-10'>
      <Navbar email={email} />
      <div className="text-lg lg:text-3xl font-medium text-black text-center mt-10">Your Monitor Alerts</div>

      <div>
        {alerts.map((alert, index) => {
          const { id, hash, arguments: args, created_on, from_address, to_address, eid, event_name } = alert;
          return (
            <div key={id} className="">
              <div className="w-[95%] lg:w-4/6 mx-auto flex flex-col mb-14 mt-10">
                <div className="w-full flex gap-4 flex-wrap">
                  <div className="text-lg font-semibold text-gray-500 bg-[#E9E9E9] px-3 py-2 rounded-xl border-2 border-gray-300">
                    Hash: <span className="text-lg text-black">{`${hash.slice(0, 5)}...${hash.slice(-4)}`}</span>
                  </div>
                  <div className="flex gap-2 items-center text-gray-500 bg-[#E9E9E9] px-3 py-2 rounded-xl border-2 border-gray-300">
                    <div className="text-lg font-semibold text-gray-500">Created on:</div>
                    <div className="my-auto text-md font-medium text-black">{new Date(created_on).toLocaleString()}</div>
                  </div>
                  <div className="text-lg font-semibold text-gray-500 bg-[#E9E9E9] px-3 py-2 rounded-xl border-2 border-gray-300">
                    From: <span className="text-lg mt-auto text-black">{`${from_address.slice(0, 5)}...${from_address.slice(-4)}`}</span>
                  </div>
                  <div className="text-lg font-semibold text-gray-500 bg-[#E9E9E9] px-3 py-2 rounded-xl border-2 border-gray-300">
                    To: <span className="text-lg mt-auto text-black">{`${to_address.slice(0, 5)}...${to_address.slice(-4)}`}</span>
                  </div>
                  <button onClick={() => setActiveDiv(activeDiv === index ? null : index)} className="flex relative gap-2 items-center text-lg font-semibold text-gray-500 bg-[#E9E9E9] px-3 py-2 rounded-xl border-2 border-gray-300">
                    More <FaCaretDown />
                  </button>
                </div>

                {activeDiv === index && (
                  <div className="mt-6 p-6 flex justify-between flex-col md:flex-row rounded-2xl border-2 border-gray-300 bg-neutral-100">
                    <div>
                      <div className="flex gap-3 flex-col">
                        <div className="flex gap-6 items-center flex-wrap">
                          <div className="text-lg font-semibold text-gray-500">Event: {event_name}</div>
                        </div>
                      </div>
                      <div className="flex gap-1 flex-col">
                        <div className="text-lg font-semibold text-gray-500 flex gap-1">
                          Arguments: <span className="text-lg text-[#7D7D7D] line-clamp-5">{JSON.stringify(args)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Monitor_alerts;