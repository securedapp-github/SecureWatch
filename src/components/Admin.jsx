import React from 'react';
import { HiDotsVertical } from 'react-icons/hi';
import { IoAddOutline } from 'react-icons/io5';
import NewNavbar from './NewNavbar';
import Sidebar from './Sidebar';
import { Link } from 'react-router-dom';
import { FaCirclePlus } from 'react-icons/fa6';

const AccountManagement = () => {
  const userEmail = localStorage.getItem("email");
  console.log(userEmail);
  const users = [
    {
      name: 'andrews arena (Andy)',
      email: 'andrewsarena@gmail.com',
      role: 'Administrator'
    },
    {
      name: 'abhishek',
      email: 'abhishek@gmail.com',
      role: 'Administrator'
    }
  ];

  return (
     <div className="w-full min-h-full">
          <NewNavbar email={userEmail} />
          <div className="bg-[#FAFAFA] w-full flex h-full">
            <Sidebar  />
    
            <div className=" h-full lg:flex flex-col gap-5 ml-[100px] mt-20 hidden">
              <div className={`mt-5 py-3 pl-4 pr-20 rounded-r-full bg-[#0A65C9]`}>
                <h1 className="text-white font-semibold text-nowrap">
                  Admin
                </h1>
              </div>
              
            </div>
    

            <div className="min-h-screen   mt-20 w-full ">
      <div className="p-4 md:p-6">
        
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mb-6 md:mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
            
            <h1 className="text-xl  text-[#6A6A6A] font-semibold">Account access management</h1>
          </div>
          <Link to="/admin_add_user" className="flex items-center gap-2 p-0 text-[#6A6A6A] font-medium " >Add user{" "}
            <FaCirclePlus className="text-5xl text-green-500 p-0" />
            </Link>
        </div>

        
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <div className="min-w-[768px]">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="w-12 py-4 px-3 md:px-6">
                  <input type="checkbox"  className="checkbox border-2 border-black rounded-none" />
                  </th>
                  <th className="text-left py-4 px-3 md:px-6 text-[#6A6A6A]">Name</th>
                  <th className="text-left py-4 px-3 md:px-6 text-[#6A6A6A]">Email</th>
                  <th className="text-left py-4 px-3 md:px-6 text-[#6A6A6A]">
                    <span className="hidden sm:inline">Roles and data restrictions</span>
                    <span className="sm:hidden">Role</span>
                  </th>
                  <th className="w-12"></th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-3 md:px-6">
                    <input type="checkbox"  className="checkbox border-2 border-black rounded-none" />
                    </td>
                    <td className="py-4 px-3 md:px-6 text-[#6A6A6A]">
                      <div className="md:hidden font-medium">{user.name}</div>
                      <div className="hidden md:block">{user.name}</div>
                    </td>
                    <td className="py-4 px-3 md:px-6 text-[#6A6A6A]">
                      <div className="max-w-[200px] truncate">{user.email}</div>
                    </td>
                    <td className="py-4 px-3 md:px-6 text-[#6A6A6A]">{user.role}</td>
                    <td className="py-4 px-3 md:px-6">
                      <button className="text-[#6A6A6A]">
                        <HiDotsVertical className="text-xl" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        
      </div>
    </div>


          </div>
        </div>
  );
};

export default AccountManagement;