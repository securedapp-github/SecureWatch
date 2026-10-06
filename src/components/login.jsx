import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { showErrorAlert, showSuccessAlert } from "./toastifyalert";
import { baseUrl } from "../Constants/data";
import NewNavbar2 from "./NewNavabr2";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { IoIosArrowForward } from "react-icons/io";
import { LuShieldCheck, LuZap, LuActivity } from "react-icons/lu";
import SecureDapp from "../images/SecureDapp.png";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    const u_email = email.trim();
    const u_password = password.trim();

    if (u_email === "" || u_password === "") {
      showErrorAlert("Invalid email or password.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(`${baseUrl}/login_securewatch`, {
        email: u_email,
        password: u_password,
      });

      console.log("Login Successful:", response.data);
      const userId = response.data.user.id;
      const parent_id = response.data.user.parent_id;
      const planType = response.data.user.plan;
      const is_admin = response.data.user.is_admin;
      const token = response.data.token;
      const monitor = response.data.monitors;
      const Email = response.data.user.email;
      const credits = response.data.user.credits;
      const planexpiry = response.data.user.planexpiry;
      const notifications = response.data.user.notifications;

      localStorage.setItem("parent_id", parent_id);
      localStorage.setItem("planType", planType);
      localStorage.setItem("is_admin", is_admin);
      localStorage.setItem("userId", userId);
      localStorage.setItem("notifications", JSON.stringify(notifications));
      localStorage.setItem("login", "true");
      localStorage.setItem("token", token);
      localStorage.setItem("moniter", monitor);
      localStorage.setItem("email", Email);
      localStorage.setItem("credits", credits);
      localStorage.setItem("planexpiry", planexpiry);

      showSuccessAlert("Login Successful");
      navigate("/dashboard", {
        state: { userId, email: Email, monitor, token, parent_id, is_admin },
      });
    } catch (error) {
      setErrorMessage("Invalid email or password.");
      showErrorAlert("Invalid email or password.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const login = localStorage.getItem("login");
    if (login === "true" || login === true) {
      navigate("/dashboard");
    }
  }, [navigate]);

  return (
    <div className="font-poppin bg-[#FAFAFA] min-h-screen pb-12 select-none">
      <NewNavbar2 />

      <div className="w-full h-full px-4 sm:px-6 md:px-12 lg:px-24 pt-24 sm:pt-28 md:pt-36">
        <div className="bg-white rounded-3xl flex flex-wrap justify-between w-full p-6 sm:p-10 md:p-14 shadow-lg border border-slate-100 max-w-6xl mx-auto">
          {/* Left Column: Brand & Security Value */}
          <div className="w-full md:w-5/12 flex flex-col justify-between items-start gap-6 md:pr-8 mb-8 md:mb-0 md:border-r md:border-slate-100">
            <div className="flex flex-col gap-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EBF3FA] text-[#2D5C8F] text-xs font-semibold tracking-wide border border-[#2D5C8F]/20">
                <LuShieldCheck className="w-4 h-4 text-[#2D5C8F]" />
                <span>Realtime Security Intelligence</span>
              </div>

              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-[#2D5C8F] tracking-tight">
                  Sign in
                </h1>
                <p className="text-slate-500 text-sm mt-1">
                  Access your enterprise blockchain security dashboard & active telemetry.
                </p>
              </div>

              <Link
                to="/signup"
                className="text-[#2D5C8F] hover:text-[#1D4C7F] flex gap-2 items-center text-sm font-semibold transition group"
              >
                <IoIosArrowForward className="group-hover:translate-x-1 transition-transform" />
                <span>Create Account</span>
              </Link>
            </div>

            {/* Feature Highlights on Left Side */}
            <div className="hidden md:flex flex-col gap-3 pt-6 border-t border-slate-100 w-full">
              <div className="flex items-center gap-3 text-xs text-slate-600">
                <div className="w-6 h-6 rounded-md bg-[#EBF3FA] flex items-center justify-center text-[#2D5C8F] flex-shrink-0">
                  <LuActivity className="w-3.5 h-3.5" />
                </div>
                <span>24/7 Smart Contract Threat Surveillance</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-600">
                <div className="w-6 h-6 rounded-md bg-[#EBF3FA] flex items-center justify-center text-[#2D5C8F] flex-shrink-0">
                  <LuZap className="w-3.5 h-3.5" />
                </div>
                <span>Automated On-Chain Incident Mitigation</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-600">
                <div className="w-6 h-6 rounded-md bg-[#EBF3FA] flex items-center justify-center text-[#2D5C8F] flex-shrink-0">
                  <LuShieldCheck className="w-3.5 h-3.5" />
                </div>
                <span>SOC 2 & Web3 Forensics Reporting</span>
              </div>
            </div>
          </div>

          {/* Right Column: Sign In Form */}
          <div className="w-full md:w-6/12 flex flex-col justify-center items-center">
            <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  value={email}
                  type="email"
                  placeholder="name@company.com"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 text-slate-800 focus:border-[#2D5C8F] focus:ring-2 focus:ring-[#2D5C8F]/20 outline-none transition bg-white text-sm"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="password"
                    className="block text-xs font-semibold text-slate-700 uppercase tracking-wider"
                  >
                    Password
                  </label>
                  <Link
                    to="/forgotpassword"
                    className="text-xs text-[#2D5C8F] hover:underline transition font-medium"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    id="password"
                    name="password"
                    value={password}
                    required
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 text-slate-800 focus:border-[#2D5C8F] focus:ring-2 focus:ring-[#2D5C8F]/20 outline-none transition bg-white text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-slate-700 transition"
                  >
                    {showPassword ? (
                      <AiOutlineEyeInvisible className="w-5 h-5" />
                    ) : (
                      <AiOutlineEye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center space-x-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-[#2D5C8F] rounded border-gray-300 focus:ring-[#2D5C8F] accent-[#2D5C8F]"
                  />
                  <span className="text-xs sm:text-sm text-slate-600">Remember me</span>
                </label>
              </div>

              {errorMessage && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs font-medium">
                  {errorMessage}
                </div>
              )}

              <div className="flex items-center justify-end pt-2">
                <button
                  type="submit"
                  id="login-submit-btn"
                  disabled={isLoading}
                  className="w-full sm:w-auto px-8 py-3 bg-[#2D5C8F] hover:bg-[#1D4C7F] text-white rounded-xl font-semibold text-sm transition shadow-sm disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isLoading ? <span>Signing in...</span> : <span>Sign in</span>}
                </button>
              </div>
            </form>
          </div>

          {/* Trial Footer Banner (Original element preserved) */}
          <div className="text-gray-600 text-center mt-8 pt-6 border-t border-slate-100 w-full flex flex-col items-center justify-center">
            <div className="flex items-center flex-wrap justify-center gap-1">
              <button
                type="button"
                onClick={() => setShowMessage(true)}
                className="px-2 py-1 text-[#2D5C8F] hover:underline font-semibold text-base sm:text-lg transition"
              >
                [Start Free Trial]
              </button>
              <span className="text-xs sm:text-sm text-slate-500">
                - No Card Required During Free Trial
              </span>
            </div>
            {showMessage && (
              <p className="mt-2 text-xs sm:text-sm text-red-500 font-medium">
                Login to avail your free trial !!
              </p>
            )}
          </div>
        </div>

        {/* Bottom SecureDapp Logo & Brand */}
        <div className="mt-8 flex gap-2 items-center justify-center mx-auto">
          <img src={SecureDapp} alt="SecureDapp logo" className="w-10 h-10 object-contain" />
          <span className="text-slate-900 logo text-xl font-bold tracking-tight">
            SecureDapp
          </span>
        </div>
      </div>
    </div>
  );
}

export default Login;
