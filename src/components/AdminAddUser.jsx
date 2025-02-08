import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NewNavbar from "./NewNavbar";
import Sidebar from "./Sidebar";
import { Link } from "react-router-dom";

const RolesForm = () => {
  const userEmail = localStorage.getItem("email");
  const parentId = localStorage.getItem("userId");
  const [email, setEmail] = useState("");
  const [notifyNewUsers, setNotifyNewUsers] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");

  const roles = [
    {
      name: "Editor",
      description:
        "Edit all data and settings for account. Cannot manage users.",
      learnMoreLink: "#",
    },
    {
      name: "Analyst",
      description:
        "Create and edit shared assets like dashboards and annotations for account. Includes Viewer role.",
      learnMoreLink: "#",
    },
  ];

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async () => {
    if (!email || !selectedRole) {
      toast.error("Please enter email and select a role.");
      return;
    }

    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    const isAdmin = selectedRole === "Editor" ? 1 : 0;

    const requestBody = {
      email: email.toLowerCase(),
      parent_id: parentId,
      is_admin: isAdmin,
    };

    try {
      const response = await fetch(
        "https://139-59-5-56.nip.io:3443/set_users_access",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      const result = await response.json();
      if (response.ok) {
        toast.success("User access updated successfully!");
      } else {
        toast.error(result.message || "Failed to update user access.");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="w-full min-h-full">
      <NewNavbar email={userEmail} />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="bg-[#FAFAFA] w-full flex h-full">
        <Sidebar />

        <div className="min-h-screen md:h-auto mt-16 sm:mt-20 w-full bg-[#FAFAFA] sm:ml-[100px]">
          <div className="flex items-center gap-10">
            <Link
              to="/admin"
              className="text-white bg-[#2D5C8F] h-14 w-14 p-1 transition-colors flex justify-center items-center"
            >
              <IoMdClose className="w-5 h-5 md:w-6 md:h-6" />
            </Link>
            <h1 className="text-lg md:text-xl text-black font-medium">
              Add roles and data restrictions
            </h1>
          </div>

          <div className="p-4 md:p-6 flex flex-col space-y-6 md:space-y-8">
            <div className="space-y-3 md:space-y-4 bg-white px-3 py-2 border-2 rounded">
              <h2 className="text-lg md:text-xl text-[#6A6A6A] font-medium">
                Enter email
              </h2>
              <input
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm md:text-base bg-white"
              />
              <label className="flex items-center space-x-2 text-sm md:text-base">
                <input
                  type="checkbox"
                  checked={notifyNewUsers}
                  onChange={(e) => setNotifyNewUsers(e.target.checked)}
                  className="checkbox w-4 h-4 text-blue-600 rounded-none focus:ring-blue-500 border-2 border-black"
                />
                <span className="text-[#6A6A6A]">
                  Notify new users by email
                </span>
              </label>
            </div>

            <div className="space-y-3 md:space-y-4 bg-white px-3 py-2 border-2 rounded">
              <h2 className="text-lg md:text-xl text-[#6A6A6A] font-medium">
                Direct roles and data restrictions
              </h2>
              <div className="space-y-2">
                <h3 className="text-xs md:text-sm text-[#6A6A6A] font-medium">
                  Standard roles
                </h3>
                <div className="space-y-2 md:space-y-4">
                  {roles.map((role) => (
                    <label
                      key={role.name}
                      className="flex items-start space-x-3 p-2 cursor-pointer transition-colors"
                    >
                      <input
                        type="radio"
                        name="role"
                        value={role.name}
                        checked={selectedRole === role.name}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        className="radio mt-1 w-6 h-6 border-2 border-black text-blue-600 focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-[#6A6A6A] text-sm md:text-base">
                          {role.name}
                        </div>
                        <div className="text-[#6A6A6A] text-xs md:text-sm">
                          {role.description}
                          <a
                            href={role.learnMoreLink}
                            className="ml-1 text-blue-600 hover:underline hover:text-blue-700 transition-colors underline underline-offset-1"
                          >
                            Learn more
                          </a>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              className="bg-[#0A65C9] px-5 text-white rounded-md py-2 self-end"
            >
              Create
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RolesForm;
