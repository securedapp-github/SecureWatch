import React, { useEffect, useState } from "react";
import c1 from "../images/backg.png";
import c2 from "../images/ellipse.png";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { showErrorAlert, showSuccessAlert } from "./toastifyalert";
import NewNavbar2 from "./NewNavabr2";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FaGithub } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import Google from "../images/google.png";
import Metamask from "../images/metamask-icon.png";
import SecureDapp from "../images/SecureDapp.png";

function Signup() {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  function isValidEmail(email) {
    // Regular expression for validating email addresses
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  function handleClick(e) {
    setLoading(true);
    e.preventDefault();
    if (!isValidEmail(email)) {
      //setErrorMessage("Please enter a valid email address.");
      showErrorAlert("Please enter a valid email address.");
      setLoading(false);
    } else {
      navigate("/login1", { state: { email } });
    }
  }

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
    <div className="font-poppin bg-[#FAFAFA] min-h-screen pb-10">
      <NewNavbar2 />
      <div className="w-full h-full  px-2 sm:px-5 md:px-10 lg:px-20 pt-20 sm:pt-32 md:pt-40">
        <div className="bg-white rounded-2xl flex flex-wrap justify-center w-full p-4 py-10 shadow">
          <div className="w-full md:w-1/2 flex flex-col justify-start items-start  h-full gap-4  md:px-16">
            <p className="text-black">Realtime Security</p>
            <p className="text-blue-700 text-2xl">Create Account</p>
            <div className="flex flex-col">
              <p className="text-black">Already have an account?</p>
              <Link
                to="/login"
                className="text-blue-700 flex gap-2 items-center underline"
              >
                Sign in now
              </Link>
            </div>
          </div>
          <div className="w-full md:w-1/2  flex justify-center items-center py-4">
            <form className="flex flex-col gap-6 w-full md:w-[80%] ">
              <p className="text-black">Use your email</p>
              <div>
                <input
                  value={email}
                  name="email"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition bg-white"
                />
              </div>

              <button
                onClick={handleClick}
                className="px-6 bg-blue-600 ms-auto text-white py-2  rounded-lg hover:bg-blue-700 transition duration-200 text-sm md:text-base ml-auto"
              >
                {loading ? "Please wait..." : "Sign up"}
              </button>

              {errorMessage && (
                <p className="text-red-500 mb-3">{errorMessage}</p>
              )}

              
            </form>
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

export default Signup;
