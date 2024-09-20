import React, { useEffect, useState } from "react";
import c1 from "../images/backg.png";
import c2 from "../images/ellipse.png";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate,useLocation } from "react-router-dom";
import OtpInput from 'react-otp-input';
import { showErrorAlert, showSuccessAlert } from "./toastifyalert";

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
          "https://139-59-5-56.nip.io:3443/verify_forgot_password_securewatch",
          {
            "email":email,
            "otp":validOtp,
            "new_password": password
          }
        );
      setLoading(false);
      showSuccessAlert("Password changed successfully, Please Login to continue.");
      navigate("/login");
      console.log("Password changed successfully", response.data);
      }
    } catch (error) {
      console.error("Error while changing Password:", error);
      setLoading(false);
      //setErrorMessage("Something went wrong, Please try again later.");
      showErrorAlert("Something went wrong, Please try again later.");
    }

  }

  return (
    <div className="font-poppin bg-white flex flex-col h-full justify-center mx-5 md:mx-0 items-center md:gap-[50px] md:flex-row lg:gap-[150px]">
      <div className="w-[90vw] md:w-[50vw] lg:w-[30vw] my-auto mb-10 md:mb-0 mt-0">
        <img src={c1} alt="not found" className="my-auto" />
      </div>
      <div className="my-auto w-full md:w-1/3 lg:w-1/4">
        <div className="flex w-[160px] justify-between rounded-full border border-1 border-[#59E296] py-2 px-3">
          <div>
            <img src={c2} alt="not found" />
          </div>
          <div className="my-auto text-md font-medium text-black">Securewatch</div>
        </div>
        <div className="font-medium text-lg mt-6 text-black">Enter your four digit OTP</div>
        <form className="mt-6">
          <OtpInput
      value={otp}
      onChange={setOtp}
      numInputs={4}
      inputStyle={{
        width: '3rem',
        height: '3rem',
        marginRight: '1rem',
        fontSize: '2rem',
        borderRadius: 4,
        border: '3px solid rgba(0,0,0,0.3)',
        color: '#28AA61',
        backgroundColor: 'white',

      }}
      renderSeparator={<span> </span>}
      renderInput={(props) => <input {...props} />}
    />


    <div className="mt-4">
      <label htmlFor="password" className="text-black font-medium  mt-6 text-base">
            New Password
          </label>
          <br />
          <input
            type="password"
            className="w-full rounded-md py-3 px-4 outline-none font-sans bg-[#f2f2f2] mt-2"
            placeholder="Enter your new password"
            value={password}
            name="password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
    </div>
    <div className="mt-4">
      <label htmlFor="confirmPassword" className="text-black font-medium  mt-6 text-base">
            Confirm Password
          </label>
          <br />
          <input
            type="password"
            className="w-full rounded-md py-3 px-4 outline-none font-sans bg-[#f2f2f2] mt-2"
            placeholder="Enter your confirm password"
            value={confirmPassword}
            name="confirmPassword"
            required
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
    </div>
        
        <button
          className="mx-auto bg-[#28AA61] px-4 py-2 text-white my-9 w-full rounded-md"
          onClick={handleClick}
        >
          {loading ? "Please wait..." : "Change Password"}
        </button>
        </form>
        {errorMessage && <p className="text-red-500 mb-3 text-center">{errorMessage}</p>}
      </div>
    </div>
  );
}

export default Otpverify;
