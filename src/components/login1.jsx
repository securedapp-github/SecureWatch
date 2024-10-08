import React, { useState, useEffect } from "react";
import axios from "axios";
import c1 from "../images/backg.png";
import c2 from "../images/ellipse.png";
import { useNavigate, useLocation } from "react-router-dom";
import { showErrorAlert,showSuccessAlert } from "./toastifyalert";
import { baseUrl } from "../Constants/data";

function Login1() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const location = useLocation();
  const navigate = useNavigate();
  // const searchParams = new URLSearchParams(location.search);
  const [errorMessage, setErrorMessage] = useState("");
  const email = location.state ? location.state.email : null;
 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });    
  };
  // console.log("Email:", email);
  // console.log("Name",formData.name);
  // console.log("Password",formData.password)
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    
    try {
      const u_name = formData.name;
      const u_password = formData.password;
      if (!email || email==="" ||  u_name === "" || u_password === "" || !u_name || !u_password) {
       // setErrorMessage("Enter the Email, userame and password");
        showErrorAlert("Enter the Email, userame and password");
      } else {
      
        const response = await axios.post(
          `${baseUrl}/signup_securewatch`,
          {
            name: u_name,
            email,
            password: u_password,
          }
        );
        console.log("response",response)
        if (response.status === 400) {
          //setErrorMessage("User already exists. Please login.");
          showErrorAlert("User already exists. Please login.");
          setLoading(false);
        }
        // console.log("User signed up successfully:", response.data);
        // const token = response.data.token;
        // const monitor = response.data.monitors;
        // let login = localStorage.setItem("login", true);
        // let Token = localStorage.setItem("token", token); 
        showSuccessAlert("You are signed up successfully.");
        navigate("/login");
      }
    } catch (error) {
      if (error.response.status === 400) {
        //setErrorMessage("User already exists. Please login.");
        showErrorAlert("User already exists. Please login.");
        setLoading(false);
        return;
      }
      console.log("Error signing up:", error);
      setLoading(false);
      //setErrorMessage("Error signing up. Please try again.");
      showErrorAlert("Error signing up. Please try again.");
    }
  };

  useEffect(() => {
    const login = localStorage.getItem("login");
    if (login) {
      navigate("/dashboard");
    }
  }, []);

  const [vis, setVis] = useState("password");
  const handleToggle = () => {
    if (vis === "password") setVis("text");
    else setVis("password");
  };
  const [enabled, setEnabled] = useState(false);
  return (
    <div className="font-poppin bg-white flex justify-center items-center flex-wrap min-h-full gap-6 md:gap-20  p-3">
      <div className=" ">
        <img src={c1} alt="not found" className=" w-96" />
      </div>
      <div className=" w-[97%] md:w-96">
        <div className="flex w-[160px] justify-between rounded-full border border-1 border-[#59E296] py-2 px-3">
          <div>
            <img src={c2} alt="not found" />
          </div>
          <div className="my-auto text-md font-medium text-black">Securewatch</div>
        </div>
        <div className="font-bold text-lg mt-6 text-black">Welcome to SecureWatch</div>
        <div className="mt-6 mb-3 text-black">
          Yay, You have taken first step towards secure. to get started, enter
          your name and set a passward
        </div>
        <form onSubmit={handleSubmit}>
          <label htmlFor="userid" className="text-base text-black">
            Name
          </label>
          <br />
          <input
            type="text"
            className="w-full mt-1 mb-3 rounded-md py-3 px-4 outline-none font-sans bg-[#f2f2f2]"
            placeholder="Enter your name"
            id="name"
            name="name"
            onChange={handleChange}
            autoComplete="off"
            required
          />
          <br />
          <label htmlFor="password" className="text-base text-black">
            Password
          </label>
          <br />
          <div className="rounded-md flex flex-row justify-between bg-[#f2f2f2] mt-1">
            <input
              type={vis}
              id="password"
              name="password"
              className="rounded-md py-3 px-4 outline-none font-sans bg-[#f2f2f2]"
              placeholder="Enter password"
              onChange={handleChange}
              autoComplete="off"
              required
            />
            <div
              className="my-auto px-4 cursor-pointer"
              onClick={() => {
                handleToggle();
              }}
            >
              <svg
                className="cursor-pointer"
                width="16"
                height="12"
                viewBox="0 0 16 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8 0.666687C4.36364 0.666687 1.25818 2.92851 0 6.12123C1.25818 9.31396 4.36364 11.5758 8 11.5758C11.6364 11.5758 14.7418 9.31396 16 6.12123C14.7418 2.92851 11.6364 0.666687 8 0.666687ZM8 9.7576C5.99273 9.7576 4.36364 8.1285 4.36364 6.12123C4.36364 4.11396 5.99273 2.48487 8 2.48487C10.0073 2.48487 11.6364 4.11396 11.6364 6.12123C11.6364 8.1285 10.0073 9.7576 8 9.7576ZM8 3.93941C6.79273 3.93941 5.81818 4.91396 5.81818 6.12123C5.81818 7.32851 6.79273 8.30305 8 8.30305C9.20727 8.30305 10.1818 7.32851 10.1818 6.12123C10.1818 4.91396 9.20727 3.93941 8 3.93941Z"
                  fill="#4D4D4D"
                />
              </svg>
            </div>
          </div>

          <button
            type="submit"
            className="mx-auto bg-[#28AA61] px-4 py-2 text-white mt-10 w-full rounded-md"
          >
            {loading ? "Please wait..." : "Continue"}
          </button>
          {errorMessage && <p className="text-red-500 text-center mb-3">{errorMessage}</p>}
        </form>
      </div>
    </div>
  );
}

export default Login1;
