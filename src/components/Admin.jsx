import React, { useEffect, useState } from "react";
import { HiDotsVertical } from "react-icons/hi";
import NewNavbar from "./NewNavbar";
import Sidebar from "./Sidebar";
import { Link, useNavigate } from "react-router-dom";
import { FaCirclePlus } from "react-icons/fa6";
import { baseUrl } from "../Constants/data";
import { FaTrash } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoIosRemoveCircle } from "react-icons/io";

const AccountManagement = () => {
  const userEmail = localStorage.getItem("email");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const parent_id = localStorage.getItem("parent_id");
  const is_admin = localStorage.getItem("is_admin");

  const [loading, setLoading] = useState(true);
  const [value, setValue] = useState(10);
  const [users, setUsers] = useState([]);
  const [adminUsers, setAdminUsers] = useState([]);
  const [analystUsers, setAnalystUsers] = useState([]);
  const [email, setEmail] = useState("");
  

  useEffect(() => {
    setLoading(true);
    const fetchUsers = async () => {
      setLoading(true);
      const res = await fetch(`${baseUrl}/get_users_access`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          parent_id: userId,
        }),
      });
      const data = await res.json();
      if(res.status === 401){
        toast.error("Session Expired, Please login again",
          {
            autoClose: 500,
            onClose: () => {
              localStorage.clear();
              navigate("/login");
            },
          }

        )
      }
      if(res.status === 403){
        toast.error("Unauthorized Access, Please login again",
          {
            autoClose: 500,
            onClose: () => {
              localStorage.clear();
              navigate("/login");
            },
          }

        )
      }
      setUsers(data.users);
      const admin = data.users?.filter((user) => user.is_admin == 1);
      const analyst = data.users?.filter((user) => user.is_admin == 0);
      setAdminUsers(admin);
      setAnalystUsers(analyst);
      setLoading(false);
    };
    fetchUsers();
  }, [value]);

  useEffect(() => {
    console.log("users", users);
    console.log("adminUsers", adminUsers);
    console.log("analystUsers", analystUsers);
  }, [users, adminUsers, analystUsers]);


 

  if (is_admin == 0) {
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

          <div className=" h-full lg:flex flex-col gap-5 ml-[100px] mt-20 hidden">
            <div className={`mt-5 py-3 pl-4 pr-20 rounded-r-full bg-[#0A65C9]`}>
              <h1 className="text-white font-semibold text-nowrap">Admin Panel</h1>
            </div>
          </div>

          <div className="min-h-screen   mt-20 w-full ">
            <div className="p-4 md:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mb-6 md:mb-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
                  <h1 className="text-xl  text-[#6A6A6A] font-semibold">
                    Account access management
                  </h1>
                </div>
              </div>

              <div className="overflow-x-auto bg-white rounded-lg shadow">
                <div className="min-w-[768px]">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-4 px-3 md:px-6 text-[#6A6A6A]">
                          Name
                        </th>
                        <th className="text-left py-4 px-3 md:px-6 text-[#6A6A6A]">
                          Email
                        </th>
                        <th className="text-left py-4 px-3 md:px-6 text-[#6A6A6A]">
                          <span className="hidden sm:inline">
                            Roles and data restrictions
                          </span>
                          <span className="sm:hidden">Role</span>
                        </th>
                        <th className="w-12"></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td colSpan="5" className="text-black text-center py-3">
                          Only Admins can see and add users roles
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (parent_id == 0){
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
  
          <div className=" h-full lg:flex flex-col gap-5 ml-[100px] mt-20 hidden">
            <div className={`mt-5 py-3 pl-4 pr-20 rounded-r-full bg-[#0A65C9]`}>
              <h1 className="text-white font-semibold text-nowrap">Admin Panel</h1>
            </div>
             <div className="flex flex-col gap-5 ml-5">
                        <Link to="/admin"  className="text-[#2D5C8F] font-semibold">
                        Account access
                        </Link>
                        <Link to="/billing" className="text-[#6A6A6A]">
                        Billing
                        </Link>
                        <Link to="/pricing" className="text-[#6A6A6A]">
                        Plans
                        </Link>
                        
                      </div>
          </div>
  
          <div className="min-h-screen   mt-20 w-full ">
            <div className="p-4 md:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mb-6 md:mb-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
                  <h1 className="text-xl  text-[#6A6A6A] font-semibold">
                    Account access management
                  </h1>
                </div>
                <Link
                  to="/admin_add_user"
                  className="flex items-center gap-2 p-0 text-[#6A6A6A] font-medium "
                >
                  Add user{" "}
                  <FaCirclePlus className="text-5xl text-green-500 p-0" />
                </Link>
              </div>
  
              <div className="overflow-x-auto bg-white rounded-lg shadow">
                <div className="min-w-[768px]">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="w-12 py-4 px-3 md:px-6">
                          <input
                            type="checkbox"
                            className="checkbox border-2 border-black rounded-none"
                          />
                        </th>
                        <th className="text-left py-4 px-3 md:px-6 text-[#6A6A6A]">
                          Name
                        </th>
                        <th className="text-left py-4 px-3 md:px-6 text-[#6A6A6A]">
                          Email
                        </th>
                        <th className="text-left py-4 px-3 md:px-6 text-[#6A6A6A]">
                          <span className="hidden sm:inline">
                            Roles and data restrictions
                          </span>
                          <span className="sm:hidden">Role</span>
                        </th>
                        <th className="w-12"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td
                            colSpan="5"
                            className="text-center py-4 px-3 md:px-6"
                          >
                            <span className="loading loading-spinner loading-lg text-[#2D5C8F]"></span>
                          </td>
                        </tr>
                      ) : loading === false &&
                        users &&
                        Array.isArray(users) &&
                        users.length > 0 ? (
                        users.map((user, index) => (
                          <tr key={index} className="border-b hover:bg-gray-50">
                            <td className="py-4 px-3 md:px-6">
                              <input
                                type="checkbox"
                                className="checkbox border-2 border-black rounded-none"
                              />
                            </td>
                            <td className="py-4 px-3 md:px-6 text-[#6A6A6A]">
                              <div className="md:hidden font-medium">
                                {user.name}
                              </div>
                              <div className="hidden md:block">{user.name}</div>
                            </td>
                            <td className="py-4 px-3 md:px-6 text-[#6A6A6A]">
                              <div className="max-w-[200px] truncate">
                                {user.email}
                              </div>
                            </td>
                            <td className="py-4 px-3 md:px-6 text-[#6A6A6A]">
                              {user.is_admin == 1
                                ? "Editor"
                                : user.is_admin == 0
                                ? "Analyst"
                                : ""}
                            </td>
                            <td className="py-4 px-3 md:px-6">
                            <button className="text-[#6A6A6A]" 
  onClick={async () => {
    const confirmDelete = window.confirm(`Are you sure you want to delete ${user.email}?`);
    if (confirmDelete) {
      const requestBody = {
        email: user.email,
        parent_id: 0,
        is_admin: 0,
      };

      try {
        const response = await fetch(
          `${baseUrl}/set_users_access`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
          }
        );

        const result = await response.json();
        if(response.status === 401){
          toast.error("Session Expired, Please login again",
            {
              autoClose: 500,
              onClose: () => {
                localStorage.clear();
                navigate("/login");
              },
            }
  
          )
        }
        if(response.status === 403){
          toast.error("Unauthorized Access, Please login again",
            {
              autoClose: 500,
              onClose: () => {
                localStorage.clear();
                navigate("/login");
              },
            }
  
          )
        }
        if (response.ok) {
          toast.success("User access updated successfully!");
        } else {
          toast.error(result.message || "Failed to update user access.");
        }
        setValue(value + 1);
      } catch (error) {
        toast.error("Something went wrong. Please try again later.");
      }
    }
  }}>
  <FaTrash className="text-xl" />
</button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="text-black text-center py-3">
                            No users found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (parent_id != 0 && is_admin == 1){
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
  
          <div className=" h-full lg:flex flex-col gap-5 ml-[100px] mt-20 hidden">
            <div className={`mt-5 py-3 pl-4 pr-20 rounded-r-full bg-[#0A65C9]`}>
              <h1 className="text-white font-semibold text-nowrap">Admin Panel</h1>
            </div>
          </div>
  
          <div className="min-h-screen   mt-20 w-full ">
            <div className="p-4 md:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mb-6 md:mb-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
                  <h1 className="text-xl  text-[#6A6A6A] font-semibold">
                    Account access management
                  </h1>
                </div>
                <Link
                  to="/admin_add_user"
                  className="flex items-center gap-2 p-0 text-[#6A6A6A] font-medium "
                >
                  Add user{" "}
                  <FaCirclePlus className="text-5xl text-green-500 p-0" />
                </Link>
              </div>
  
              <div className="overflow-x-auto bg-white rounded-lg shadow">
                <div className="min-w-[768px]">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="w-12 py-4 px-3 md:px-6">
                          <input
                            type="checkbox"
                            className="checkbox border-2 border-black rounded-none"
                          />
                        </th>
                        <th className="text-left py-4 px-3 md:px-6 text-[#6A6A6A]">
                          Name
                        </th>
                        <th className="text-left py-4 px-3 md:px-6 text-[#6A6A6A]">
                          Email
                        </th>
                        <th className="text-left py-4 px-3 md:px-6 text-[#6A6A6A]">
                          <span className="hidden sm:inline">
                            Roles and data restrictions
                          </span>
                          <span className="sm:hidden">Role</span>
                        </th>
                        <th className="w-12"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td
                            colSpan="5"
                            className="text-center py-4 px-3 md:px-6"
                          >
                            <span className="loading loading-spinner loading-lg text-[#2D5C8F]"></span>
                          </td>
                        </tr>
                      ) : loading === false &&
                        analystUsers &&
                        Array.isArray(analystUsers) &&
                        analystUsers.length > 0 ? (
                        analystUsers.map((user, index) => (
                          <tr key={index} className="border-b hover:bg-gray-50">
                            <td className="py-4 px-3 md:px-6">
                              <input
                                type="checkbox"
                                className="checkbox border-2 border-black rounded-none"
                              />
                            </td>
                            <td className="py-4 px-3 md:px-6 text-[#6A6A6A]">
                              <div className="md:hidden font-medium">
                                {user.name}
                              </div>
                              <div className="hidden md:block">{user.name}</div>
                            </td>
                            <td className="py-4 px-3 md:px-6 text-[#6A6A6A]">
                              <div className="max-w-[200px] truncate">
                                {user.email}
                              </div>
                            </td>
                            <td className="py-4 px-3 md:px-6 text-[#6A6A6A]">
                            Analyst
                            </td>
                            {/* <td className="py-4 px-3 md:px-6 my-auto">
                              <button className="text-[#6A6A6A]">
                                <FaTrash  className="text-xl" />
                              </button>
                            </td> */}
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="text-black text-center py-3">
                            No analyst users found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default AccountManagement;
