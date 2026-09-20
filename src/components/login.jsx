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
  const [showMessage, setShowMessage] = useState(false);
  const navigate = useNavigate();

  const handleDemoLogin = (event) => {
    if (event) event.preventDefault();
    const demoUser = {
      id: "demo-user-1",
      email: "demo@securewatch.io",
      parent_id: "0",
      plan: "Enterprise Demo",
      is_admin: "true",
      credits: "500",
      planexpiry: "2026-12-31",
      notifications: [
        { id: 1, message: "Welcome to SecureWatch Demo!", time: "Just now" },
        { id: 2, message: "Threat monitoring active on test networks", time: "5 mins ago" },
      ],
    };
    const demoToken = "demo_jwt_securewatch_token_2026";
    const demoMonitor = "active";

    localStorage.setItem("login", "true");
    localStorage.setItem("is_demo", "true");
    localStorage.setItem("userId", demoUser.id);
    localStorage.setItem("email", demoUser.email);
    localStorage.setItem("parent_id", demoUser.parent_id);
    localStorage.setItem("planType", demoUser.plan);
    localStorage.setItem("is_admin", demoUser.is_admin);
    localStorage.setItem("credits", demoUser.credits);
    localStorage.setItem("planexpiry", demoUser.planexpiry);
    localStorage.setItem("token", demoToken);
    localStorage.setItem("moniter", demoMonitor);
    localStorage.setItem("notifications", JSON.stringify(demoUser.notifications));

    showSuccessAlert("Logged in as Demo User!");
    navigate("/dashboard", {
      state: {
        userId: demoUser.id,
        email: demoUser.email,
        monitor: demoMonitor,
        token: demoToken,
        parent_id: demoUser.parent_id,
        is_admin: demoUser.is_admin,
      },
    });
  };

  const fillDemoCredentials = () => {
    setEmail("demo@securewatch.io");
    setPassword("DemoSecure2026!");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const u_email = email.trim();
      const u_password = password.trim();
      if (u_email === "" || u_password === "") {
        showErrorAlert("Invalid email or password.");
        return;
      }

      if (u_email === "demo@securewatch.io") {
        handleDemoLogin(event);
        return;
      }

      const response = await axios.post(`${baseUrl}/login_securewatch`, {
        email: u_email,
        password: u_password,
      });

      console.log("Login Successful:", response.data);
      const userId = response.data.user.id;
      console.log("userId", userId);
      const parent_id = response.data.user.parent_id;
      localStorage.setItem("parent_id", parent_id);
      const planType = response.data.user.plan;
      localStorage.setItem("planType", planType);
      const is_admin = response.data.user.is_admin;
      localStorage.setItem("is_admin", is_admin);
      localStorage.setItem("userId", userId);
      const token = response.data.token;
      const monitor = response.data.monitors;
      const Email = response.data.user.email;
      const credits = response.data.user.credits;
      const planexpiry = response.data.user.planexpiry;
      const notifications = response.data.user.notifications;
      localStorage.setItem("notifications", JSON.stringify(notifications));
      localStorage.setItem("login", "true");
      localStorage.setItem("token", token);
      localStorage.setItem("moniter", monitor);
      localStorage.setItem("email", Email);
      localStorage.setItem("credits", credits);
      localStorage.setItem("planexpiry", planexpiry);
      localStorage.removeItem("is_demo");

      showSuccessAlert("Login Successful");
      navigate("/dashboard", { state: { userId, email: Email, monitor, token, parent_id, is_admin } });
    } catch (error) {
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

              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  id="fill-demo-btn"
                  onClick={fillDemoCredentials}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium underline flex items-center gap-1"
                >
                  ⚡ Fill Demo Credentials
                </button>
                <button
                  type="submit"
                  id="login-submit-btn"
                  className="px-6 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 text-sm md:text-base ml-auto"
                >
                  Sign in
                </button>
              </div>

              <div className="relative my-1">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-3 text-gray-500 font-medium">Or Quick Access</span>
                </div>
              </div>

              <button
                type="button"
                id="demo-login-btn"
                onClick={handleDemoLogin}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 transform active:scale-98 cursor-pointer"
              >
                <span className="text-lg">🚀</span>
                <span>One-Click Demo Login</span>
                <span className="ml-1 text-xs bg-white/20 px-2 py-0.5 rounded-full font-normal">Instant</span>
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
          <div className="text-gray-600 text-center mt-4">
            <div className="flex items-center">
      <button
        onClick={() => setShowMessage(true)}
        className=" px-2 py-1 rounded transition text-xl"
      >
        [Start Free Trial]
      </button>
      <p>- No Card Required During Free Trial</p>
      </div>
      {showMessage && (
        <p className="mt-2 text-sm text-red-400">
          Login to avail your free trial !!
        </p>
      )}
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
