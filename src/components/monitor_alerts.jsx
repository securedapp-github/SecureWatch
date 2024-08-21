import React, { useState,useEffect } from "react";
import { useLocation } from 'react-router-dom';
import Navbar from "./navbar2";
import { FaCaretDown,FaCopy } from 'react-icons/fa';
import { showErrorAlert, showSuccessAlert } from "./toastifyalert";
import { baseUrl } from "../Constants/data";

function Monitor_alerts() {
  const token = localStorage.getItem("token");
  const location = useLocation();
  const { mid } = location.state;
  const {network} = location.state;
  console.log("transfered mid",mid);
  console.log("Network",network);
  const  [alert,setAlert] = useState([]);
  const email = localStorage.getItem("email")
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDiv, setActiveDiv] = useState(null);

  useEffect(() => {
    const fetchAlert = async () => {
      const res=await fetch(`${baseUrl}/get_alerts`,{
        method:'POST',
        headers:{
          'Content-Type':'application/json',
          'Authorization': `Bearer ${token}`,
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
        <div className="text-lg lg:text-3xl font-medium text-black text-center  mt-20">You don't have any monitor alerts.</div> 
      </div>
    );
  }
  // console.log(alert)
  const CopyIcon = ({ onClick }) => (
    <FaCopy onClick={onClick} className="bi bi-clipboard cursor-pointer" />
    // <svg  xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-clipboard cursor-pointer" viewBox="0 0 16 16" style={{ marginLeft: '5px' }}>
    //   <path d="M10.5 0a.5.5 0 0 1 .5.5H11v1h2V.5a.5.5 0 0 1 1 0v1h.5a.5.5 0 0 1 .5.5v13a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5v-13a.5.5 0 0 1 .5-.5H4v-1a.5.5 0 0 1 1 0v1h2v-1a.5.5 0 0 1 .5-.5h3ZM10 1H6v1h4V1ZM4.5 4a.5.5 0 0 0-.5.5v12a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5v-12a.5.5 0 0 0-.5-.5h-7Z"/>
    // </svg>
  );
  
  // Function to copy text to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      showSuccessAlert("Address copied Successful");
      // alert('Text copied to clipboard');
    }).catch(err => {
      showErrorAlert("Failed to copy");
      // console.error('Failed to copy: ', err);
    });
  };
 
  return (
    <div className='pt-10 bg-white pb-10'>
      <Navbar email={email} />
      <div className="text-lg lg:text-3xl font-medium text-black text-center mt-10">Your Monitor Alerts </div>

      <div>
      {alert.alerts && alert.alerts.map((alert,index) => {
        const id = alert.id;
        const hash = alert.hash;
        const arguemant = alert.arguments;
        const created_on= alert.created_on;
        const from_address = alert.from_address;
        const to_address = alert.to_address;
        const eid = alert.eid;
        const name = alert.event_name;
        return (
          <div className="">


  <div key={index} className="w-[95%] lg:w-4/6 mx-auto  flex flex-col mb-14 mt-10 ">
        <div className="overflow-x-auto rounded-lg border-2 border-gray-400 custom-scrollbar">
            <table className="min-w-full rounded-lg overflow-hidden">
                <thead >
                    <tr className="bg-gray-200">
                        <th className="px-4 py-2 border-2 border-gray-300 text-black"> Link :</th>
                        <th className="px-4 py-2 border-2 border-gray-300 text-black">Created on:</th>
                        <th className="px-4 py-2 border-2 border-gray-300 text-black">From:</th>
                        <th className="px-4 py-2 border-2 border-gray-300 text-black ">To:</th>
                        <th className="px-4 py-2 border-2 border-gray-300 text-black ">More details:</th>
                    </tr>
                </thead>
                {/* {`${hash.slice(0, 5)}...${hash.slice(hash.length - 4)}`} */}
                <tbody>
                    <tr>
                        <td className="px-4 py-2 border-2 border-gray-300"><span className="text-lg  text-green-600 font-medium "><a href={network===80002?`https://amoy.polygonscan.com/tx/${hash}`:network===11155111?`https://sepolia.etherscan.io/tx/${hash}`:"#"} target="_blank" >{network===80002?`https://amoy.poly...${hash.slice(hash.length - 4)}`:network===11155111?`https://sepo...${hash.slice(hash.length - 4)}`:"Unknown"}  </a></span></td>
                        <td className="px-4 py-2 border-2 border-gray-300 text-black text-nowrap">{created_on.slice(0,10)} {created_on.slice(11,16)}</td>

                        <td className="px-4 py-2 border-2 border-gray-300"><span className="text-lg mt-auto text-black">{`${from_address.slice(0, 5)}...${from_address.slice(from_address.length - 4)}`}</span> </td>

                        <td className="px-4 py-2 border-2 border-gray-300"><span className="text-lg mt-auto text-black">{`${to_address.slice(0, 5)}...${to_address.slice(to_address.length - 4)}`}</span></td>

                        <td className="border-b-2 border-gray-300 flex justify-center items-center"><button onClick={() => setActiveDiv(activeDiv === index ? null : index)} className="flex relative gap-2 items-center justify-center text-lg font-semibold text-black  w-full h-12 border-0 rounded-lg ">
    View <FaCaretDown />
</button></td>
                    </tr>
                    <tr >
                    {activeDiv === index && (
                      <td colSpan="5" >
<div className="flex gap-1 flex-col mt-3 ml-3">
            <div className=" text-lg font-semibold text-gray-500">Event: {name}</div>

            <div className=" flex flex-col gap-2">

            <div className=" text-lg font-semibold text-gray-500 flex gap-1">From: <span className="flex justify-center items-center gap-3"> <span className="text-lg  text-[#7D7D7D] line-clamp-5">{arguemant.slice(9,51)}</span>
            <CopyIcon onClick={() => copyToClipboard(arguemant.slice(9,51))} />
            </span>
            </div>

            <div className=" text-lg font-semibold text-gray-500 flex gap-1">To: <span className="flex justify-center items-center gap-3">
              <span className="text-lg  text-[#7D7D7D] line-clamp-5">{arguemant.slice(59,101)}</span>
            <CopyIcon onClick={() => copyToClipboard(arguemant.slice(59,101))} />
            </span> 
            </div>

            <div className=" text-lg font-semibold text-gray-500 flex gap-1">Value: <span className="text-lg  text-[#7D7D7D] line-clamp-5">{arguemant.slice(112,131)}</span></div>

      
            </div>

          <div>
          </div>
          <div>
          </div>
        </div>

        </td>
)}
                    </tr>
                </tbody>


            </table>
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