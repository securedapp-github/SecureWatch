import React, { useEffect, useState } from "react";
import c1 from "../images/backg.png";
import c2 from "../images/ellipse.png";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { showErrorAlert, showSuccessAlert } from "./toastifyalert";
import { baseUrl } from "../Constants/data";

function Forgotpassword() {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [email, setEmail] = useState("");
  console.log(email);
  const navigate = useNavigate();

  function isValidEmail(email) {
    // Regular expression for validating email addresses
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  const handleClick = async (e) => {
    setLoading(true);
    e.preventDefault();
     
    try {
      if (!isValidEmail(email) || email === "" || email === null || email === undefined) {
        //setErrorMessage("Please enter a valid email address.");
        showErrorAlert("Please enter a valid email address.");
        setLoading(false);
      }
       else {
        const response = await axios.post(
          `${baseUrl}/forgot_password_securewatch`,
          {
            "email":email
          }
        );
      setLoading(false);
      navigate("/otp", { state: { email } });
      console.log("Otp Sent Successfully", response.data);
      }
    } catch (error) {
      console.error("Error while sending OTP:", error);
      setLoading(false);
      //setErrorMessage("Error while sending OTP, Please try again later.");
      showErrorAlert("Error while sending OTP, Please try again later.");
    }

  }

  return (
    <div className="font-poppin bg-white flex justify-center items-center flex-wrap min-h-full gap-6 md:gap-20  p-3">
      <div className="">
        <img src={c1} alt="not found" className=" w-96" />
      </div>
      <div className=" w-[97%] md:w-96">
        <div className="flex w-[160px] justify-between rounded-full border border-1 border-[#59E296] py-2 px-3">
          <div>
            <img src={c2} alt="not found" />
          </div>
          <div className="my-auto text-md font-medium text-black">Securewatch</div>
        </div>
        <div className="font-bold text-lg mt-6 text-black">Forgot Password?</div>
        <form className="mt-6">
          <label htmlFor="userid" className="text-black text-base">
            Enter your email address to reset your password
          </label>
          <br />
          <input
            type="text"
            className="w-full rounded-md py-3 px-4 outline-none font-sans bg-[#f2f2f2] mt-4"
            placeholder="Enter your email"
            value={email}
            name="email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        
        <button
          className="mx-auto bg-[#28AA61] px-4 py-2 text-white my-9 w-full rounded-md"
          onClick={handleClick}
        >
          {loading ? "Please wait..." : "Send OTP"}
        </button>
        </form>
        {errorMessage && <p className="text-red-500 mb-3 text-center">{errorMessage}</p>}
        {/* <hr />
        <button className="mx-auto bg-[#000000] px-4 py-2 text-white my-9 w-full rounded-md flex gap-2 justify-center">
          <img src={google} alt="not found" />
          <div className="">Sign in with google</div>
        </button> */}
        <div className="text-center text-black">
          <span >Remember your password?</span>
          <Link to="/login" className=" text-[#28AA61]">
            &nbsp; Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Forgotpassword;
