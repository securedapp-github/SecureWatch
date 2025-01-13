import React, { useEffect, useState } from "react";
import c1 from "../images/backg.png";
import c2 from "../images/ellipse.png";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate,useLocation } from "react-router-dom";
import OtpInput from 'react-otp-input';
import { showErrorAlert, showSuccessAlert } from "./toastifyalert";
import { baseUrl } from "../Constants/data";
import NewNavbar2 from "./NewNavabr2";
import SecureDapp from "../images/SecureDapp.png";

function Otpverify() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const email = location.state ? location.state.email : null;
  console.log ("Email Test",email);
  console.log(password);
  console.log(confirmPassword);
  console.log(otp);


  const handleClick = async (e) => {
    setLoading(true);
    e.preventDefault();
     
    try {
      if (!email) {
       // setErrorMessage("Enter your email address again.");
        showErrorAlert("Enter your email address again.");
        setLoading(false);
      } 
      else if (!otp || otp.length !== 4) {
        //setErrorMessage("Please enter a valid OTP.");
        showErrorAlert("Please enter a valid OTP.");
        setLoading(false);
      }
       else if (password.length < 8) {
        //setErrorMessage("Password should be at least 8 characters long.");
        showErrorAlert("Password should be at least 8 characters long.");
        setLoading(false);
      } 
      else if (password !== confirmPassword) {
        //setErrorMessage("Password and confirm password do not match.");
        showErrorAlert("Password and confirm password do not match.");
        setLoading(false);
      } 
       else {
        const validOtp= parseInt(otp);
        const response = await axios.post(
          `${baseUrl}/verify_forgot_password_securewatch`,
          {
            "email":email,
            "otp":validOtp,
            "new_password": password
          }
        );
      setLoading(false);
      showSuccessAlert("Password changed successfully, Please Login to continue.");
      navigate("/login");
      // console.log("Password changed successfully", response.data);
      }
    } catch (error) {
      console.error("Error while changing Password:", error);
      setLoading(false);
      //setErrorMessage("Something went wrong, Please try again later.");
      showErrorAlert("Something went wrong, Please try again later.");
    }

  }

  return (
    <div className="font-poppin bg-[#FAFAFA] min-h-screen pb-10">
    <NewNavbar2 />
    <div className="w-full h-full  px-2 sm:px-5 md:px-10 lg:px-20 pt-20 sm:pt-32 md:pt-36">
      <div className="bg-white rounded-2xl flex flex-wrap justify-center w-full p-4 py-10 shadow">
        <div className="w-full md:w-1/2 flex flex-col justify-start items-start  h-full gap-4  md:px-16">
          <p className="text-black">Realtime Security</p>
          <p className="text-blue-700 text-2xl">Change Password</p>
          
        </div>


        

        <div className=" w-full md:w-1/2  flex flex-col justify-center items-center py-4">
        
        <div className="font-medium text-lg mt-6 text-[#4A4A4A]  self-start md:ms-16">Enter your four digit OTP</div>
        <form className="flex flex-col gap-6 w-full md:w-[80%] mt-5 ">
          <OtpInput
        value={otp}
        onChange={setOtp}
        numInputs={4}
        inputStyle={{
        width: '4rem',
        height: '4rem',
        marginRight: '1rem',
        fontSize: '2rem',
        borderRadius: 4,
        border: '1px solid rgba(0,0,0,0.3)',
        color: '#2563eb',
        backgroundColor: 'white',
        
        }}
        renderSeparator={<span> </span>}
        renderInput={(props) => <input {...props} />}
        />
        
        
        <div className="">
          <input
            type="password"
            className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition bg-white"
            placeholder="New password"
            value={password}
            name="password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="">
          <input
            type="password"
            className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition bg-white"
            placeholder="Confirm password"
            value={confirmPassword}
            name="confirmPassword"
            required
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        
        <button
          className=" bg-blue-600 px-4 py-2 text-white self-end rounded-md hover:bg-blue-700 transition duration-200 text-sm md:text-base"
          onClick={handleClick}
        >
          {loading ? "Please wait..." : "Change Password"}
        </button>
        </form>
        {errorMessage && <p className="text-red-500 mb-3 text-center">{errorMessage}</p>}
        </div>

      </div>
      <div className=" mt-5 flex gap-1 items-center justify-center mx-auto">
        <img src={SecureDapp} alt="SecureDapp logo" className="w-14" />
        <span className="text-black logo text-lg">SecureDapp</span>
      </div>
    </div>
  </div>
  );
}

export default Otpverify;
