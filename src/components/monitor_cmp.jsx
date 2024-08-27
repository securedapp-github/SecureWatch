// import Modal from "react-modal";
// import React, { useState, useEffect } from "react";
// import { Switch } from "@headlessui/react";
// import { useNavigate, useLocation } from "react-router-dom";
// import Edit from "../images/edit.png";

// const customStyles = {
//   content: {
//     top: "50%",
//     left: "50%",
//     right: "auto",
//     bottom: "auto",
//     marginRight: "-50%",
//     transform: "translate(-50%, -50%)",
//   },
// };
// const Monitor_cmp = (props) => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [value, setValue] = useState(10);
//   const [moniter, setMoniter] = useState([]);

//   const handleEditMonitor = (monitor_id) => {
//     navigate("/monitor_Edit?id="+monitor_id); 
//   };

//   useEffect(() => {
//     const fetchMoniter = async () => {
//       const res = await fetch("https://139-59-5-56.nip.io:3443/get_monitor", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           user_id: 6,
//         }),
//       });
//       const data = await res.json();
//       setMoniter(data);
//     };
//     fetchMoniter();
//   }, [value]);

//   console.log(moniter);
//   // const [enabled, setEnabled] = useState(false);
//   // const [disp, setDisp] = useState("block");
//   // const [disp1, setDisp1] = useState("block");
//   const [open, setOpen] = useState(false);

//   // const handleToggle = () => {
//   //   if (disp == "none") setDisp("block");
//   //   else setDisp("none");
//   // };
//   // const handleToggle1 = () => {
//   //   if (disp1 == "none") setDisp1("block");
//   //   else setDisp1("none");
//   // };

//   function openModal() {
//     setOpen(true);
//   }
//   function closeModal() {
//     setOpen(false);
//   }
//   // console.log(moniter.monitors);
//   if (
//     !moniter ||
//     !Array.isArray(moniter.monitors) ||
//     moniter.monitors.length === 0
//   ) {
//     return (
//       <div className="text-center mt-20 text-4xl font-medium text-black">
//         Please create a monitor.
//       </div>
//     );
//   }

//   return (
//     <div className="w-full flex justify-center items-center flex-col ">
//       {moniter.monitors.map((i) => {
//   const name = i.name;
//   const risk = i.category;
//   const network = i.network;
//   const status = i.status;
//   const mid = i.mid;
//   const created_on = i.created_on || ""; // Fallback to an empty string if null/undefined
//   const address = i.address || ""; // Fallback to an empty string if null/undefined
  
//   return (
//     <div className="w-full flex justify-center items-center flex-col mx-auto ">
//       <div className="w-full mx-auto flex justify-center items-center flex-col ">
//         <div
//           className="mt-10 w-[95%] lg:w-4/5  flex flex-wrap   rounded-2xl "
//           style={{
//             border: "1px solid #0CA851",
//             boxShadow: "4px 4px 0px 0px #0CA851",
//           }}
//         >
//           <button
//             className="w-[70%] sm:w-[80%] md:w-[90%]  p-6  "
//             onClick={() => {
//               navigate("/monitor_alerts", { state: { mid } });
//             }}
//           >
//             <div className="">
//               <div className="flex gap-3">
//                 <div className="text-xl font-semibold text-black">
//                   {name}
//                 </div>
//                 <div className="text-[12px] mt-auto text-[#7D7D7D]">
//                   {risk}
//                 </div>
//               </div>
//               <div className="flex gap-4 mt-5 flex-wrap items-center ">
//                 <div>
//                   <div className="text-center font-medium text-black">
//                     Networks
//                   </div>
//                   <div className="bg-[#0CA851] px-3 py-2 rounded-md text-[13px] my-auto text-white">
//                     {network === 80002
//                       ? "Amoy"
//                       : network === 1
//                       ? "Ethereum Mainnet"
//                       : network === 11155111
//                       ? "Sepolia Testnet"
//                       : network === 137
//                       ? "Polygon Mainnet"
//                       : "Unknown"}
//                   </div>
//                 </div>
//                 <div>
//                   <div className="text-center font-medium text-black">
//                     Created on
//                   </div>
//                   <div className="bg-[#E9E9E9] px-3 py-2 rounded-md  my-auto flex gap-2">
//                     <div className="my-auto text-[14px] text-black">
//                       <span className="text-md font-medium text-black">
//                         Date:{" "}
//                       </span>
//                       {created_on.slice(0, 10)}{" "}
//                       <span>
//                         <span className="text-md font-medium text-black">
//                           Time:{" "}
//                         </span>
//                         {created_on.slice(11, 16)}
//                       </span>{" "}
//                     </div>
//                   </div>
//                 </div>
//                 <div>
//                   <div className="text-center font-medium text-black">
//                     Contract address
//                   </div>
//                   <div className=" px-3 py-2 rounded-md text-[14px] my-auto text-black bg-[#E9E9E9] ">
//                     {`${address.slice(0, 5)}...${address.slice(
//                       address.length - 4
//                     )}`}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </button>
//           <div className="flex items-center p-6 w-[30%] sm:w-[20%] md:w-[10%] ">
//             <div className="flex flex-col justify-end gap-7 items-center">
//               <button onClick={() => handleEditMonitor(mid)}>
//                 <img src={Edit} alt="" className="h-8 w-8" />
//               </button>
//               <Switch
//                 checked={status === 1 ? true : false}
//                 onChange={() => {
//                   const newStatus = status === 0 ? 1 : 0;
//                   fetch(
//                     "https://139-59-5-56.nip.io:3443/update_monitor",
//                     {
//                       method: "POST",
//                       headers: {
//                         "Content-Type": "application/json",
//                       },
//                       body: JSON.stringify({
//                         monitor_id: mid,
//                         status: newStatus,
//                       }),
//                     }
//                   )
//                     .then((response) => response.json())
//                     .then((data) => {
//                       console.log("Success:", data);
//                       setValue(value + 1);
//                     })
//                     .catch((error) => {
//                       console.error("Error:", error);
//                     });
//                 }}
//                 className={`${
//                   status === 1 ? "bg-[#0CA851]" : "bg-[#B8B8B8]"
//                 } relative inline-flex h-6 w-11 items-center rounded-full`}
//               >
//                 <span className="sr-only">Enable notifications</span>
//                 <span
//                   className={`${
//                     status === 1 ? "translate-x-6" : "translate-x-1"
//                   } inline-block h-4 w-4 transform rounded-full bg-white transition`}
//                 />
//               </Switch>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// })}

//     </div>
//   );
// };
// export default Monitor_cmp;

import Modal from "react-modal";
import React, { useState, useEffect } from "react";
import { Switch } from "@headlessui/react";
import { useNavigate, useLocation } from "react-router-dom";
import Edit from "../images/edit.png";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

const Monitor_cmp = (props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [value, setValue] = useState(10);
  const [moniter, setMoniter] = useState([]);
  const Token = localStorage.getItem("token");
  console.log(Token);
  const handleEditMonitor = (monitor_id) => {
    navigate(`/monitor_Edit?id=${monitor_id}`);
  };

  useEffect(() => {
    const fetchMoniter = async () => {
      const res = await fetch("https://139-59-5-56.nip.io:3443/get_monitor", {
        method: "POST",
        headers: {                                                                     //added headers for token authorization
          Authorization: `Bearer ${Token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: 6,
        }),
      });
      const data = await res.json();
      console.log("fetched monitors:", data);
      setMoniter(data);
    };
    console.log("current value:", value);
    fetchMoniter();
  }, [value]);
  console.log("Current monitors state:", moniter);

  const handleStatusChange = async (mid, status) => {
    try {
      const newStatus = status === 0 ? 1 : 0;
      const response = await fetch(
        "https://139-59-5-56.nip.io:3443/update_monitor",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${Token}`,
            "Content-Type": "application/json",                 //added headers
          },
          body: JSON.stringify({
            monitor_id: mid,
            status: newStatus,
          }),
        }
      );
      const data = await response.json();
      console.log("Status updated:", data);
      setValue((prevValue) => prevValue + 1); // Increment value to trigger useEffect and refetch monitors
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  if (
    !moniter ||
    !Array.isArray(moniter.monitors) ||
    moniter.monitors.length === 0
  ) {
    return (
      <div className="text-center mt-20 text-4xl font-medium text-black">
        Please create a monitor.
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center items-center flex-col">
      {moniter.monitors.map((i) => {
        const { name, category: risk, network, status, mid, created_on, address } = i;

        const formattedCreatedOn = created_on ? created_on.slice(0, 10) : "N/A";
        const formattedTime = created_on ? created_on.slice(11, 16) : "N/A";
        const shortAddress = address
          ? `${address.slice(0, 5)}...${address.slice(address.length - 4)}`
          : "N/A";

        return (
          <div key={mid} className="w-full flex justify-center items-center flex-col mx-auto">
            <div className="w-full mx-auto flex justify-center items-center flex-col">
              <div
                className="mt-10 w-[95%] lg:w-4/5 flex flex-wrap rounded-2xl"
                style={{
                  border: "1px solid #0CA851",
                  boxShadow: "4px 4px 0px 0px #0CA851",
                }}
              >
                <button
                  className="w-[70%] sm:w-[80%] md:w-[90%] p-6"
                  onClick={() => {
                    navigate("/monitor_alerts", { state: { mid } });
                  }}
                >
                  <div className="">
                    <div className="flex gap-3">
                      <div className="text-xl font-semibold text-black">{name}</div>
                      <div className="text-[12px] mt-auto text-[#7D7D7D]">{risk}</div>
                    </div>
                    <div className="flex gap-4 mt-5 flex-wrap items-center">
                      <div>
                        <div className="text-center font-medium text-black">Networks</div>
                        <div className="bg-[#0CA851] px-3 py-2 rounded-md text-[13px] my-auto text-white">
                          {network === 80002
                            ? "Amoy"
                            : network === 1
                            ? "Ethereum Mainnet"
                            : network === 11155111
                            ? "Sepolia Testnet"
                            : network === 137
                            ? "Polygon Mainnet"
                            : network === 4160
                            ? "Algorand Mainnet"
                            : "Unknown"}
                        </div>
                      </div>
                      <div>
                        <div className="text-center font-medium text-black">Created on</div>
                        <div className="bg-[#E9E9E9] px-3 py-2 rounded-md my-auto flex gap-2">
                          <div className="my-auto text-[14px] text-black">
                            <span className="text-md font-medium text-black">Date: </span>
                            {formattedCreatedOn}{" "}
                            <span>
                              <span className="text-md font-medium text-black">Time: </span>
                              {formattedTime}
                            </span>{" "}
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="text-center font-medium text-black">Contract address</div>
                        <div className="px-3 py-2 rounded-md text-[14px] my-auto text-black bg-[#E9E9E9]">
                          {shortAddress}
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
                <div className="flex items-center p-6 w-[30%] sm:w-[20%] md:w-[10%]">
                  <div className="flex flex-col justify-end gap-7 items-center">
                    <button onClick={() => handleEditMonitor(mid)}>
                      <img src={Edit} alt="Edit" className="h-8 w-8" />
                    </button>
                    <Switch
                      checked={status === 1}
                      onChange={() => handleStatusChange(mid, status)}
                      className={`${
                        status === 1 ? "bg-[#0CA851]" : "bg-[#B8B8B8]"
                      } relative inline-flex h-6 w-11 items-center rounded-full`}
                    >
                      <span className="sr-only">Enable notifications</span>
                      <span
                        className={`${
                          status === 1 ? "translate-x-6" : "translate-x-1"
                        } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                      />
                    </Switch>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Monitor_cmp;

