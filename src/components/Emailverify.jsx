import React, { useState, useEffect } from "react";
import axios from "axios";
import c1 from "../images/backg.png";
import c2 from "../images/ellipse.png";
import { useNavigate, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

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
  console.log("Email:", email);
  console.log("Name",formData.name);
  console.log("Password",formData.password)
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    
    try {
      const u_name = formData.name;
      const u_password = formData.password;
      if (!email || email==="" ||  u_name === "" || u_password === "" || !u_name || !u_password) {
        setErrorMessage("Enter the Email, userame and password");
      } else {
        const response = await axios.post(
          "https://139-59-5-56.nip.io:3443/signup_securewatch",
          {
            name: u_name,
            email,
            password: u_password,
          }
        );
        
        console.log("User signed up successfully:", response.data);
        const token = response.data.token;
        const monitor = response.data.monitors;
        let login = localStorage.setItem("login", true);
        navigate("/dashboard", { state: { email, monitor, token } });
      }
    } catch (error) {
      console.error("Error signing up:", error);
      setLoading(false);
      setErrorMessage("Error signing up. Please try again.");
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
        <div className="font-bold text-lg mt-6 text-black">Verify your email</div>
        <div className="mt-6 mb-3 text-black">
        Veification email was sent to example@gmail.com <br />
        <br />
        Complete the verification steps provided in the email unlock all SecureWatch features.
        <br />
        <br />
        Still no email? <span className="cursor-pointer text-green-500">Send again</span> in 30 sec
        <br />
        <br />
        <Link to="/login" className=" text-[#28AA61]">
            &nbsp; Sign in now
          </Link> with a different email.
        </div>
        
      </div>
    </div>
  );
}

export default Login1;
