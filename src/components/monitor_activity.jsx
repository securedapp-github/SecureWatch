import React,{useEffect,useState} from 'react'
import Navbar from "./NewNavbar";
import { baseUrl } from '../Constants/data';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function Monitor_activity() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
    const [moniter, setMoniter] = useState([]);
    const [value, setValue] = useState(0);
    useEffect(() => {
        const fetchMoniter = async () => {
          const res = await fetch(`${baseUrl}/get_monitor`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
              user_id: 6,
            }),
          });
          const data = await res.json();
          if(res.status === 401){
            toast.error("Session Expired, Please login again",
              {
                autoClose: 500,
                onClose: () => {
                  localStorage.clear();
                  navigate("/login");
                },
              }
    
            )
          }
          if(res.status === 403){
            toast.error("Unauthorized Access, Please login again",
              {
                autoClose: 500,
                onClose: () => {
                  localStorage.clear();
                  navigate("/login");
                },
              }
    
            )
          }
          setMoniter(data);
          
        };
        fetchMoniter();
      }, [value]);
      if (
        !moniter ||
        !Array.isArray(moniter.monitors) ||
        moniter.monitors.length === 0
      ) {
        return (
          <div className=" pt-20 ">
            <Navbar/>
           <h1 className='text-center text-4xl font-medium text-black mt-20'>Please create a monitor.</h1> 
          </div>
        );
      }
  return (
    <div className='font-poppin pt-10 mx-2 min-h-screen w-full bg-white' style={{'backgroundColor':'#FCFFFD'}}>
      <Navbar/>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className=' mx-auto mt-10'>
        <div className='w-4/6 mx-auto flex justify-center items-center md:justify-between  flex-col md:flex-row'>
        <div className=' text-4xl font-medium text-center text-black'>Monitor Activity</div>
        <button onClick={()=>{
            setValue(value+1);
        }}>
        <div className='mt-2 md:mt-0'><svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="44" height="44" rx="8.27511" fill="#0CA851"/>
<path d="M33 14V20H27" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M30.4899 25C29.8399 26.8399 28.6094 28.4187 26.984 29.4985C25.3586 30.5783 23.4263 31.1006 21.4783 30.9866C19.5303 30.8726 17.672 30.1286 16.1836 28.8667C14.6952 27.6047 13.6573 25.8932 13.2262 23.9901C12.7952 22.0869 12.9944 20.0952 13.7937 18.3151C14.5931 16.535 15.9494 15.0629 17.6582 14.1207C19.367 13.1784 21.3358 12.8171 23.2678 13.0912C25.1999 13.3652 26.9905 14.2598 28.3699 15.64L32.9999 20" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg></div>
        </button>
        </div>
      <div  className="w-[95%] lg:w-4/6 mx-auto  flex flex-col mb-2 mt-7 ">
      <div className="overflow-x-auto rounded-lg border border-black custom-scrollbar">
          <table className="min-w-full rounded-lg overflow-hidden">
              <thead >
                  <tr className="bg-[#0CA8519C]">
                      <th className="px-4 py-2 border border-black text-black font-medium"> Name </th>
                      <th className="px-4 py-2 border border-black text-black font-medium">Network</th>
                      <th className="px-4 py-2 border border-black text-black font-medium">Created on</th>
                      <th className="px-4 py-2 border border-black text-black font-medium ">Adderss</th>
                  </tr>
              </thead>
              {/* {`${hash.slice(0, 5)}...${hash.slice(hash.length - 4)}`} */}
              <tbody>
              {moniter.monitors.map((moniter, index) => {
    return (
                  <tr key={index}>
                  <td className="px-4 py-2 border border-black"><span className="text-lg mt-auto text-black">{moniter.name}</span></td>
                      <td className="px-4 py-2 border border-black"><span className="text-lg  text-black  ">{moniter.network === 80002
                            ? "Amoy"
                            : moniter.network === 1
                            ? "Ethereum Mainnet"
                            : moniter.network === 11155111
                            ? "Sepolia Testnet"
                            : moniter.network === 137
                            ? "Polygon Mainnet"
                            : "Unknown"}</span></td>
                      <td className="px-4 py-2 border border-black text-black text-nowrap">{moniter.created_on.slice(0,10)} {moniter.created_on.slice(11,16)}</td>
                      <td className="px-4 py-2 border border-black"><span className="text-lg mt-auto text-black">{`${moniter.address.slice(0, 5)}...${moniter.address.slice(moniter.address.length - 4)}`}</span> </td>  
                  </tr>
                )})} 
              </tbody>
          </table>
      </div>
  </div>
</div>
</div>
  )
}

export default  Monitor_activity;
