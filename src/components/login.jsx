import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { showErrorAlert, showSuccessAlert } from "./toastifyalert";
import { baseUrl } from "../Constants/data";
import NewNavbar2 from "./NewNavabr2";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import {  FaGithub } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import Google from "../images/google.png";
import Metamask from "../images/metamask-icon.png";
import SecureDapp from "../images/SecureDapp.png";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const u_name = event.target.name.value;
      const u_password = event.target.password.value;
      if (u_name === "" || u_password === "") {
        //setErrorMessage("Enter the userame and password");
        showErrorAlert("Invalid email or password.");
      } else {
        const response = await axios.post(`${baseUrl}/login_securewatch`, {
          email,
          password,
        });

        console.log("Login Successful:", response.data);
        const userId = response.data.user.id;
        console.log("userId", userId);
        const parent_id = response.data.user.parent_id;
        localStorage.setItem("parent_id", parent_id);
        const planType = response.data.user.plan;
        localStorage.setItem("planType", planType);
        // console.log("parent_id", parent_id);
        const is_admin = response.data.user.is_admin;
        localStorage.setItem("is_admin", is_admin);
        
        // console.log("is_admin", is_admin);
        localStorage.setItem("userId", userId);
        const token = response.data.token;
        const monitor = response.data.monitors;
        console.log("token", token);
        const Email = response.data.user.email;
        const credits = response.data.user.credits;
        const planexpiry = response.data.user.planexpiry;
        console.log("credits", credits);
        console.log("planexpiry", planexpiry);
        let login = localStorage.setItem("login", true);
        // console.log(login);
        let Token = localStorage.setItem("token", token);
        let Monitor = localStorage.setItem("moniter", monitor);
        let userEmail = localStorage.setItem("email", Email);
        let userCredits = localStorage.setItem("credits", credits);
        let userPlanexpiry = localStorage.setItem("planexpiry", planexpiry);

        showSuccessAlert("Login Successful");
        navigate("/dashboard", { state: { userId, email, monitor, token, parent_id, is_admin } });
      }
    } catch (error) {
      // setErrorMessage("Invalid email or password.");
      showErrorAlert("Invalid email or password.");
    }
  };

  useEffect(() => {
    const login = localStorage.getItem("login");
    if (login) {
      navigate("/dashboard");
    }
  }, []);

  return (
    <div className="font-poppin bg-[#FAFAFA] min-h-screen pb-10">
      <NewNavbar2 />
      <div className="w-full h-full  px-2 sm:px-5 md:px-10 lg:px-20 pt-20 sm:pt-32 md:pt-40">
        <div className="bg-white rounded-2xl flex flex-wrap justify-center w-full p-4 py-10 shadow">
          <div className="w-full md:w-1/2 flex flex-col justify-start items-start  h-full gap-4  md:px-16">
            <p className="text-black">Realtime Security</p>
            <p className="text-blue-700 text-2xl">Sign in</p>
            <Link
              to="/signup"
              className="text-blue-700 flex gap-2 items-center"
            >
              <IoIosArrowForward /> Create Account
            </Link>
          </div>
          <div className="w-full md:w-1/2  flex justify-center items-center py-4">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-6 w-full md:w-[80%] "
            >
              <div>
                <input
                  id="email"
                  name="email"
                  value={email}
                  type="email"
                  placeholder="Email"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition bg-white"
                />
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  id="password"
                  name="password"
                  value={password}
                  required
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? (
                    <AiOutlineEyeInvisible className="w-5 h-5" />
                  ) : (
                    <AiOutlineEye className="w-5 h-5" />
                  )}
                </button>
              </div>

              <div className="flex flex-col flex-wrap md:flex-row md:items-center justify-between gap-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="checkbox border-2  w-5 h-5 text-blue-600 rounded focus:ring-blue-500 bg-white"
                  />
                  <span className="text-sm md:text-base text-gray-700 text-nowrap">
                    Remember me
                  </span>
                </label>
                <Link
                  to="/forgotpassword"
                  className="text-sm md:text-base text-blue-600 hover:text-blue-700 text-nowrap"
                >
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                className="px-6 bg-blue-600 ms-auto text-white py-2  rounded-lg hover:bg-blue-700 transition duration-200 text-sm md:text-base ml-auto"
              >
                Sign in
              </button>

              {errorMessage && (
                <p className="text-red-500 mb-3">{errorMessage}</p>
              )}

              {/* <div className="grid grid-cols-3 gap-3 md:gap-4 ">
                <button className="flex items-center justify-center p-2.5 md:p-3 border-2 rounded-lg hover:bg-gray-50 transition">
                  <img src={Google} alt="Google Logo" />
                </button>
                <button className="flex items-center justify-center p-2.5 md:p-3 border-2 rounded-lg hover:bg-gray-50 transition">
                  <img src={Metamask} alt="Metamask Logo" className="w-6 h-6" />
                </button>
                <button className="flex items-center justify-center p-2.5 md:p-3 border-2 rounded-lg hover:bg-gray-50 transition">
                  <FaGithub className="w-5 h-5 md:w-6 md:h-6 text-black" />
                </button>
              </div> */}
            </form>
          </div>
        </div>
        <div className=" mt-5 flex gap-1 items-center justify-center mx-auto">
        <img src={SecureDapp} alt="SecureDapp logo" className="w-14" />
        <span className="text-black logo text-lg">
        SecureDapp
        </span>
      </div>
      </div>
    </div>
  );
}

export default Login;
