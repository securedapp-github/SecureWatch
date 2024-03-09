import React, { useEffect, useState } from "react";
import c1 from "../images/backg.png";
import c2 from "../images/ellipse.png";
import { Switch } from "@headlessui/react";
import { Link } from "react-router-dom";
import google from "../images/google.png";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  function isValidEmail(email) {
    // Regular expression for validating email addresses
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  function handleClick() {
    if (!isValidEmail(email)) {
      console.log("Please enter a valid email address.");
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
    <div className="font-poppin flex flex-col h-full justify-center mx-5 md:mx-0 items-center md:gap-[50px] md:flex-row lg:gap-[150px]">
      <div className="w-[90vw] md:w-[50vw] lg:w-[30vw] my-auto mb-10 md:mb-0 mt-0">
        <img src={c1} alt="not found" className="my-auto" />
      </div>
      <div className="my-auto w-full md:w-1/3 lg:w-1/4">
        <div className="flex w-[160px] justify-between rounded-full border border-1 border-[#59E296] py-2 px-3">
          <div>
            <img src={c2} alt="not found" />
          </div>
          <div className="my-auto text-md font-medium">Securewatch</div>
        </div>
        <div className="font-bold text-lg mt-6">Create Account</div>
        <form className="mt-6">
          <label htmlFor="userid" className="text-base">
            Use your email or signup with google
          </label>
          <br />
          <input
            type="text"
            className="w-full rounded-md py-3 px-4 outline-none font-sans bg-[#f2f2f2]"
            placeholder="Email or phone number"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </form>
        <button
          className="mx-auto bg-[#28AA61] px-4 py-2 text-white my-9 w-full rounded-md"
          onClick={handleClick}
        >
          Sign in
        </button>
        <hr />
        <button className="mx-auto bg-[#000000] px-4 py-2 text-white my-9 w-full rounded-md flex gap-2 justify-center">
          <img src={google} alt="not found" />
          <div className="">Sign in with google</div>
        </button>
        <div className="text-center">
          <span>Already have an account?</span>
          <Link to="/login" className=" text-[#28AA61]">
            &nbsp; Sign in now
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;
