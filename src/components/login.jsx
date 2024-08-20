import React, { useEffect, useState } from "react";
import axios from "axios";
import c1 from "../images/backg.png";
import c2 from "../images/ellipse.png";
import { Switch } from "@headlessui/react";
import { Link } from "react-router-dom";
import google from "../images/google.png";
import { useNavigate } from "react-router-dom";
import { showErrorAlert, showSuccessAlert } from "./toastifyalert";
import { baseUrl } from "../Constants/data";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
        const response = await axios.post(
          `${baseUrl}/login_securewatch`,
          {
            email,
            password,
          }
        );
  
        console.log("Login Successful:", response.data);
        const token = response.data.token;
        const monitor = response.data.monitors;
        // console.log(monitor);
        const Email = response.data.user.email;
        // console.log(Email);
        let login = localStorage.setItem("login", true);
        // console.log(login);
        let Token = localStorage.setItem("token", token);
        let Monitor = localStorage.setItem("moniter",monitor);
        let userEmail = localStorage.setItem("email",Email);
        // const s = monitor.length;
        // console.log("abc", s);
        // console.log(typeof monitor);
        showSuccessAlert("Login Successful");
        navigate("/dashboard", { state: { email, monitor, token } });
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
        <div className="font-bold text-lg mt-6 text-black">Nice to see you again</div>
        <form className="mt-5" onSubmit={handleSubmit}>
          <label htmlFor="userid" className="text-base text-black">
            Login
          </label>
          <br />
          <input
            type="text"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-3  w-full rounded-md py-3 px-4 outline-none font-sans bg-[#f2f2f2]"
            placeholder="Enter your email"
            required
          />
          <br />
          <label htmlFor="password" className="text-base text-black">
            Password
          </label>
          <br />
          <div className="rounded-md flex flex-row justify-between bg-[#f2f2f2]">
            <input
              type={vis}
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-md py-3 px-4 outline-none font-sans bg-[#f2f2f2]"
              placeholder="Enter password"
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

          <div className="flex justify-between mt-5">
            <div className="flex gap-2">
              <Switch
                checked={enabled}
                onChange={setEnabled}
                className={`${
                  enabled ? "bg-[#28AA61]" : "bg-gray-200"
                } relative inline-flex h-6 w-11 items-center rounded-full`}
              >
                <span className="sr-only">Enable notifications</span>
                <span
                  className={`${
                    enabled ? "translate-x-6" : "translate-x-1"
                  } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                />
              </Switch>
              <div className="text-black text-nowrap">Remember me</div>
            </div>
            <Link to="/forgotpassword" className="text-[#007AFF]">
            <div className="text-[#007AFF] text-nowrap">Forgot Password?</div>
            </Link>
          </div>
          <button type="submit" className="mx-auto bg-[#28AA61] px-4 py-2 text-white my-9 w-full rounded-md">
            Sign in
          </button>
          {errorMessage && <p className="text-red-500 mb-3">{errorMessage}</p>}
        </form>
        {/* <hr />
        <button className="mx-auto bg-[#000000] px-4 py-2 text-white my-9 w-full rounded-md flex gap-2 justify-center">
          <img src={google} alt="not found" />
          <div className="">Sign in with google</div>
        </button> */}
        <div className="text-center text-black">
          <span>Don't have an account?</span>
          <Link to="/signup" className=" text-[#007AFF]">
            &nbsp; Sign up now
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
