//if ever facing bad request error, try re logging in. Due to token expiration, bad request error may come.
import React, { useState, useCallback } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { baseUrl } from "../Constants/data";
import NewNavbar from "./NewNavbar";
import Sidebar from "./Sidebar";
import { Buffer } from "buffer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoMdCheckmarkCircle } from "react-icons/io";
import { IoCheckmarkCircleOutline } from "react-icons/io5";

function Monitor_create() {
  //  const { email, token } = location.state || "";
  const token = localStorage.getItem("token");
  const email = localStorage.getItem("email");
  const planType = parseInt(localStorage.getItem("planType")) || 0;
  const decoded = jwtDecode(token);
  const user_Id = decoded.userId;
  const userEmail = localStorage.getItem("email");
  console.log(userEmail);

  const navigate = useNavigate();
  const [monitorName, setMonitorName] = useState("");
  const [riskCategory, setRiskCategory] = useState("");
  const [address, setAddress] = useState("");
  const [inputType, setInputType] = useState("ABI");
  const parent_id = localStorage.getItem("parent_id");
  //const [appId, setAppId] = useState('');

  const [network, setNetwork] = useState("");
  const [networkName, setNetworkName] = useState("");
  const [abi, setAbi] = useState("");
  // const [smartContract, setSmartContract] = useState("");
  const [Algoevents, setAlgoEvents] = useState([]);
  const [code, setCode] = useState("");
  const [functions, setFunctions] = useState([]);
  const Token = localStorage.getItem("token");
  console.log(Token);
  const [category, setCategory] = useState(2);

  console.log("Monitor name:", monitorName);
  console.log("network:", network);

  const handleCategoryChange = (e) => {
    setCategory(parseInt(e.target.value));
    setAddress(""); // Clear input when switching between categories
  };

  // console.log("smart contract:", code);
  console.log("type", category);

  const handleAppIdChange = useCallback((e) => {
    const value = e.target.value;

    // Remove any non-digit characters
    const sanitizedValue = value.replace(/\D/g, "");

    // Ensure the value is within the valid range (0 to 2^64 - 1)
    // eslint-disable-next-line no-undef
    const numValue = BigInt(sanitizedValue || "0");
    // eslint-disable-next-line no-undef
    const maxValue = BigInt("18446744073709551615");

    if (numValue <= maxValue) {
      setAddress(sanitizedValue);
    }
  }, []);

  const approvalEventHandlers = (code) => {
    const eventHandlers = [];
    const eventRegex =
      /txna ApplicationArgs 0\s*([\s\S]*?)pushbytes 0x([\da-fA-F]+)/g;
    let match;

    while ((match = eventRegex.exec(code)) !== null) {
      const hexValue = match[2];
      const methodName = Buffer.from(hexValue, "hex").toString("utf8");
      eventHandlers.push(methodName);
    }

    return eventHandlers;
  };

  // const extractEventHandlers = (code) => {
  //     const eventHandlers = [];
  //     const eventRegex = /Txn\.application_args\[0\]\s*==\s*Bytes\("([^"]+)"\)/g;
  //     let match;
  //     while ((match = eventRegex.exec(code)) !== null) {
  //       eventHandlers.push(match[1]);
  //     }
  //     return eventHandlers;
  //   };
  const extractEventHandlers = (code) => {
    // himanshu

    const methodsInfo = {};
    // Regular expression to find hex-encoded method names in TEAL
    const eventRegex = /txna ApplicationArgs 0\s+pushbytes 0x([0-9a-fA-F]+)/g;
    let match;
  
    while ((match = eventRegex.exec(code)) !== null) {
      // Convert hex to string
      const hexString = match[1];
      const methodName = Buffer.from(hexString, "hex").toString();
      const base64Name = Buffer.from(methodName).toString("base64");
  
      // Add to the result object
      methodsInfo[base64Name] = {
        name: methodName
      };
    }
    console.log(methodsInfo);
    const methodArray = Object.entries(methodsInfo).map(([base64Name, method]) => {
      return {
        base64: base64Name,
        name: method.name,
        args: method.name
      };
    });
    return methodArray;

    // // Validate and parse if necessary
    // if (typeof code === "string") {
    //   try {
    //     code = JSON.parse(code);
    //   } catch (error) {
    //     console.error("Failed to parse code as JSON:", error);
    //     return [];
    //   }
    // }

    // if (!code || !Array.isArray(code.methods)) {
    //   console.error(
    //     "Invalid code format. Expected an object with a methods array."
    //   );
    //   return [];
    // }

    // const methodsInfo = [];
    // code.methods.forEach((method) => {
    //   const methodInfo = {
    //     name: method.name,
    //     args: method.args.map((arg) => `${arg.name}: ${arg.type}`),
    //     returns: method.returns.type,
    //   };
    //   methodsInfo.push(methodInfo);
    // });

    // return methodsInfo;
  };

  const sendSmartContract = () => {
    console.log("Code value before extraction:", code); // Debugging step
    const extractedEvents = extractEventHandlers(code);
    setAlgoEvents(extractedEvents);
    console.log("Extracted methods and arguments:", extractedEvents);
  };

  // const sendSmartContract = () => {
  //   let extractedEvents = [];

  //   if (inputType === "Approval Program") {
  //     extractedEvents = approvalEventHandlers(code);  // For Approval Program
  //   } else {
  //     extractedEvents = extractEventHandlers(code);   // For ABI
  //   }

  //   setAlgoEvents(extractedEvents);
  //   console.log("Extracted events:", extractedEvents);
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Monitor name:", monitorName);
    console.log("network:", network);
    console.log("network type:",typeof network);
    console.log("address:", address);
    console.log("abi:", abi);
    console.log("risk category:", riskCategory);

    // Common validation for all inputs
    if(network != 1300 && network != 1301 && network !== 1300 && network !== 1301){
      if (!monitorName || !network || !address || !abi  ) {
        console.error("Monitor inputs are incomplete.");
        toast.error("Please fill out all monitor fields.");
        return;
      }
    }
    
    

    try {
      const data = {
        name: monitorName,
        user_id: parent_id != 0 ? parseInt(parent_id) : parseInt(user_Id),
        network: parseInt(network),
        address: address,
        alert_type: 1,
        alert_data: "",
        abi: category === 1 ? "Asset_ABI" : code,
        //Riskcategory: riskCategory
        category: parseInt(category),
      };
      console.log("Sending data:", data);
      // Handle Algorand network specifically
      if (network === "1300" || network === "1301") {
        data.abi = category === 1 ? "Asset_ABI" : code;
        const response = await axios.post(
          "https://139-59-5-56.nip.io:3443/add_monitor",
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if(response.status === 401){
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
        if(response.status === 403){
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
        console.log("API response:", response.data);
        console.log("type:", category);

        toast.success("Monitor created successfully!", {
          autoClose: 500,
          onClose: () => {

            navigate("/algoevents", {
              state: {
                name: monitorName,
                network: networkName,
                address: address,
                rk: riskCategory,
                abi: category === 1 ? "Asset_ABI" : code,
                m_id: response.data.id,
                email: email,
                token: token,
                functions: functions,
                Algoevents: Algoevents,
                category: parseInt(category),
                inputType: inputType,
              },
            });
          },
        });
      } else {
        // Handle other networks
        data.abi = abi;

        const response = await axios.post(
          "https://139-59-5-56.nip.io:3443/add_monitor",
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if(response.status === 401){
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
        if(response.status === 403){
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
        console.log("monitor id is", response.data.id);

        toast.success("Details updated successfully!", {
          autoClose: 500,
          onClose: () => {
            navigate("/event", {
              state: {
                name: monitorName,
                network: networkName,
                address: address,
                rk: riskCategory,
                abi: abi,
                m_id: response.data.id,
                email: email,
                token: token,
              },
            });
          },
        });
      }
    } catch (error) {
      console.error("API request failed:", error);
      toast.error("Failed to create monitor. Please try again!", {
        autoClose: 500,
      });
    }
  };

  return (
    <div className="w-full h-full">
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
      <NewNavbar email={userEmail} />
      <div className="bg-[#FAFAFA] w-full flex min-h-full">
        <Sidebar />

        <div className=" h-full lg:flex flex-col gap-5 ml-[100px] hidden lg:mt-20 fixed ">
          <div className={`mt-5 py-3 pl-4 pr-9 rounded-r-full bg-[#6A6A6A1A]`}>
            <h1 className="text-[#6A6A6A]  font-semibold text-nowrap">
              Realtime Security
            </h1>
          </div>
          <div className="flex flex-col gap-5 ml-5">
            <Link to="/dashboard" className="text-[#6A6A6A]">
            Dashboard
            </Link>
            <Link to="/monitor" className="text-[#6A6A6A]">
            Contract Monitor
            </Link>
            {/* <Link to="/log" className="text-[#6A6A6A]">
              Logs
            </Link> */}
          </div>
        </div>

        {/* <div className="  mt-24 w-full  sm:w-[440px] flex flex-col gap-6 sm:ml-72">
       
      </div> */}

        <div className="mt-24 w-full sm:ml-28  lg:ml-72 flex justify-start flex-col md:flex-row md:gap-10 lg:gap-20 px-4">
          <div className="w-full lg:w-1/4 ">
            <Link to="/monitor">
              <div className="flex">
                <div>
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clip-path="url(#clip0_173_1147)">
                      <path
                        d="M22.6223 15.9674H9.3152"
                        stroke="#7D7D7D"
                        stroke-width="1.88191"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M15.9688 22.621L9.3152 15.9674L15.9688 9.31387"
                        stroke="#7D7D7D"
                        stroke-width="1.88191"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_173_1147">
                        <rect
                          width="22.5829"
                          height="22.5829"
                          fill="white"
                          transform="translate(15.9688 31.9368) rotate(-135)"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                </div>
                <div
                  className="text-base text-[#7D7D7D] my-auto"
                  style={{ color: "black" }}
                >
                  Back to Monitors
                </div>
              </div>
            </Link>
            <div
              className="text-3xl font-medium mt-3"
              style={{ color: "black" }}
            >
              Create Monitor
            </div>

            <div
              className="mt-5 hidden sm:flex gap-2 px-4 py-3 rounded-sm bg-white"
              style={{ border: "1px solid #2D5C8F" }}
            >
              <div className="my-auto" style={{ color: "black" }}>
                General Information
              </div>
              <div className="my-auto ml-auto">
                {/* <svg
                    width="27"
                    height="26"
                    viewBox="0 0 27 26"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      x="0.832031"
                      y="26"
                      width="26"
                      height="26"
                      rx="2.92308"
                      transform="rotate(-90 0.832031 26)"
                      fill="#2D5C8F"
                    />
                    <path
                      d="M11.5469 18.647L16.6175 13.5763L11.5469 8.50571"
                      stroke="white"
                      stroke-width="1.23515"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg> */}
                <IoMdCheckmarkCircle className="text-2xl text-[#2D5C8F]" />
              </div>
            </div>
            <div
              className="mt-5 hidden sm:flex gap-2 px-4 py-3 rounded-sm"
              style={{ border: "1px solid #CACACA" }}
            >
              <div className="my-auto"> Events</div>
              <div className="my-auto ml-auto">
                {/* <svg
                    width="27"
                    height="26"
                    viewBox="0 0 27 26"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11.5059 18.6469L16.5765 13.5763L11.5059 8.50562"
                      stroke="black"
                      stroke-width="1.69021"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg> */}
                <IoCheckmarkCircleOutline className="text-2xl " />
              </div>
            </div>
            <div
            data-tip="This feature is available only for Pro users. Upgrade your plan to access Auto Defend."
            className={`${planType===0?"tooltip  cursor-pointer":""} mt-5 hidden sm:flex gap-2 px-4 py-3 rounded-sm`}
                             
                              style={{ border: "1px solid #CACACA" }}
                            >
                
                              <div className="my-auto " >
                                {" "}
                               Autodefend
                              </div>
                              <div className="my-auto ml-auto">
                
                                <IoCheckmarkCircleOutline className="text-2xl " />
                              </div>
                            </div>

            <div
              className="mt-5 hidden sm:flex gap-2 px-4 py-3 rounded-sm"
              style={{ border: "1px solid #CACACA" }}
            >
              <div className="my-auto">Alerts</div>
              <div className="my-auto ml-auto">
                {/* <svg
                    width="27"
                    height="26"
                    viewBox="0 0 27 26"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11.5059 18.6469L16.5765 13.5763L11.5059 8.50562"
                      stroke="black"
                      stroke-width="1.69021"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg> */}
                <IoCheckmarkCircleOutline className="text-2xl " />
              </div>
            </div>
            <div className="sm:hidden flex gap-2 items-center justify-around mt-5  w-full">
              <div className=" flex gap-1 items-center ">
                <IoMdCheckmarkCircle className="text-3xl text-[#2D5C8F]" />
                <p className="text-black">
                  General <br /> Information
                </p>
              </div>
              <div className=" flex gap-1 items-center">
                <IoCheckmarkCircleOutline className="text-3xl " />
                <p className="">Events</p>
              </div>

              <div className=" flex gap-1 items-center">
                <IoCheckmarkCircleOutline className="text-3xl " />
                <p className="">Alerts</p>
              </div>
            </div>
          </div>

          <div className="mt-4 lg:mt-0 w-full lg:w-1/2 pb-20">
            <form
              onSubmit={handleSubmit}
              className="bg-white sm:bg-inherit sm:p-0 sm:px-0 sm:rounded-none sm:border-0 p-2 px-3 rounded-md border-2"
            >
              <div
                className="text-lg font-medium mt-5"
                style={{ color: "black" }}
              >
                Monitor Name
              </div>
              <input
                style={{ backgroundColor: "white" }}
                type="text"
                placeholder="Enter text"
                onChange={(e) => setMonitorName(e.target.value)}
                className="outline-none border-2 border-[] py-3 rounded-xl  w-full px-"
              />
              {/* #4C4C4C */}
              <div
                className="text-lg font-medium mt-5"
                style={{ color: "black" }}
              >
                Network
              </div>
              <select
                style={{ backgroundColor: "white" }}
                name="category"
                id="category"
                // value={formData.category}

                onChange={(e) => {
                  const selectedIndex = e.target.options.selectedIndex;
                  setNetwork(e.target.value);
                  setNetworkName(e.target.options[selectedIndex].text);
                }}
                className="outline-none border-2 border-[] py-3 rounded-xl  w-full px-3"
              >
                <option
                  value="none"
                  selected
                  disabled
                  hidden
                  className="text-xl font-medium"
                >
                  None
                </option>
                <option value="1" className="text-[13px] text-[#000000] ">Ethereum Mainnet</option>
                <option value="56" className="text-[13px] text-[#000000] ">Binance Smart Chain</option>
                <option value="8453" className="text-[13px] text-[#000000] ">Base</option>
                <option value="43114" className="text-[13px] text-[#000000] ">Avalanche</option>
                <option value="42161" className="text-[13px] text-[#000000] ">Arbitrum</option>
                <option value="100" className="text-[13px] text-[#000000] ">Gnosis</option>
                <option value="59144" className="text-[13px] text-[#000000] ">Linea</option>
                <option value="1313161554" className="text-[13px] text-[#000000] ">Aurora</option>
                <option value="10" className="text-[13px] text-[#000000] ">Optimism</option>
                <option value="11155111" className="text-[13px] text-[#000000]">Sepolia Testnet</option>
                <option value="137" className="text-[13px] text-[#000000]">Polygon Mainnet</option>
                <option value="80002" className="text-[13px] text-[#000000]">Amoy</option>
                <option value="1300" className="text-[13px] text-[#000000]">Algorand Mainnet</option>
                <option value="1301" className="text-[13px] text-[#000000]">Algorand Testnet</option>
                <option value="42161" className="text-[13px] text-[#000000]">Arbitrum One</option>
                <option value="43114" className="text-[13px] text-[#000000]">Avalanche C-Chain</option>
                <option value="204" className="text-[13px] text-[#000000]">opBNB</option>
                <option value="1101" className="text-[13px] text-[#000000]">Polygon zkEVM</option>
                <option value="250" className="text-[13px] text-[#000000]">Fantom</option>
                <option value="25" className="text-[13px] text-[#000000]">Cronos</option>
                <option value="592" className="text-[13px] text-[#000000]">Astar</option>
                <option value="100" className="text-[13px] text-[#000000]">Gnosis (xDai)</option>
                <option value="42220" className="text-[13px] text-[#000000]">Celo</option>
                <option value="324" className="text-[13px] text-[#000000]">ZkSync Era</option>
                <option value="137" className="text-[13px] text-[#000000]">Polygon (Matic)</option>
                <option value="288" className="text-[13px] text-[#000000]">Boba Network</option>
                <option value="534352" className="text-[13px] text-[#000000]">Scroll</option>
                <option value="2040" className="text-[13px] text-[#000000]">Vanar</option>
                <option value="143" className="text-[13px] text-[#000000]">Monad</option>
                <option value="50" className="text-[13px] text-[#000000]">Xdc Network</option>

              </select>
              {network === "1300" || network === "1301" ? (
                <>
                  <div
                    className="text-lg font-medium mt-5"
                    style={{ color: "black" }}
                  >
                    <label>Select ID Type:</label>
                    <select
                      value={category}
                      onChange={handleCategoryChange}
                      className="w-full mt-1 outline-none rounded-xl border-2 border-[#4C4C4C] bg-white"
                    >
                      <option value={2}>App ID</option>
                      <option value={1}>Asset ID</option>
                    </select>
                  </div>
                  <div className="mt-5">
                    <input
                      type="text"
                      style={{ backgroundColor: "white" }}
                      name="address"
                      value={address}
                      onChange={handleAppIdChange}
                      placeholder={
                        category === 2 ? "Enter App ID" : "Enter Asset ID"
                      }
                      className="w-full mt-1 outline-none rounded-xl border-2 border-[#4C4C4C]"
                    />
                  </div>

                  {category === 2 && (
                    <>
                      <div
                        className="text-lg font-medium mt-5"
                        style={{ color: "black" }}
                      >
                        Approval Program:
                      </div>
                      {/* <div className="text-lg text-[#989898] mt-1" style={{ color: "black" }}>
                      Paste your algorand smart contract here
                    </div> */}
                      <textarea
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="Paste your Approval program here"
                        style={{
                          width: "100%",
                          height: "300px",
                          backgroundColor: "white",
                          border: "1px solid #ccc",
                          borderRadius: "4px",
                          padding: "10px",
                          fontSize: "14px",
                          marginBottom: "10px",
                        }}
                      />
                    </>
                  )}
                  <div className="text-center w-full ">
                    <button
                      onClick={sendSmartContract}
                      type="submit"
                      className="mt-6 px-6 py-3 w-full bg-[#2D5C8F] text-white rounded-lg"
                    >
                      Create
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div
                    className="text-lg font-medium mt-5"
                    style={{ color: "black" }}
                  >
                    Contract Address
                  </div>
                  <input
                    type="text"
                    style={{ backgroundColor: "white" }}
                    name="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter contract address (0x.......)"
                    className="w-full mt-1 outline-none rounded-xl border-2 border-[#4C4C4C]"
                  />

                  <div
                    className="text-lg font-medium mt-5"
                    style={{ color: "black" }}
                  >
                    ABI
                  </div>
                  <div
                    className="text-lg text-[#989898] mt-1"
                    style={{ color: "black" }}
                  >
                    Paste your Contract's ABI code here
                  </div>
                  <textarea
                    style={{ backgroundColor: "white" }}
                    name="abi"
                    id=""
                    cols="30"
                    rows="10"
                    value={abi}
                    onChange={(e) => setAbi(e.target.value)}
                    className="w-full mt-1 outline-none rounded-xl border-2 border-[#4C4C4C]"
                  />
                  <div className="text-center w-full ">
                    <button
                      type="submit"
                      className="mt-6 px-6 py-3 w-full bg-[#2D5C8F] text-white rounded-lg"
                    >
                      Create Monitor
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Monitor_create;
