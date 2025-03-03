import React, { useEffect, useState } from "react";
import { HiDotsVertical } from "react-icons/hi";
import NewNavbar from "./NewNavbar";
import Sidebar from "./Sidebar";
import { Link } from "react-router-dom";
import { FaCirclePlus } from "react-icons/fa6";
import { baseUrl } from "../Constants/data";
import { FaTrash } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoIosRemoveCircle } from "react-icons/io";

const BillingForm = () => {
    const userEmail = localStorage.getItem("email");


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

                <div className=" h-full md:flex flex-col gap-5 ml-[100px] mt-20 hidden">
                    <div className={`mt-5 py-3 pl-4 pr-20 rounded-r-full bg-[#0A65C9]`}>
                        <h1 className="text-white font-semibold text-nowrap">Admin</h1>
                    </div>
                    <div className="flex flex-col gap-5 ml-5">
                        <Link to="/admin" className="text-[#6A6A6A]" >
                            Account access
                        </Link>
                        <Link to="/billing" className="text-[#2D5C8F] font-semibold">
                            Billing
                        </Link>

                    </div>
                </div>

                <div className="min-h-screen  sm:ml-24 md:ml-0 pb-10     mt-20 w-full flex flex-col items-start  ">
                    <div className="p-4 md:p-6 ">
                        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center ">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
                                <h1 className="text-xl  text-[#6A6A6A] font-semibold">
                                    Billing Information
                                </h1>
                            </div>

                        </div>


                    </div>
                    <div className="w-full p-3 md:p-0  md:pl-6    ">

                        <p className=" text-black">
                            <strong className=" text-lg font-semibold text-black">Enter the organisation's address</strong>
                            <br />
                            Enter either the address on the document you submitted or where the
                            organisation is registered.
                        </p>

                        <form className="mt-4 space-y-4 w-full">
                            <div className="flex flex-col items-start justify-start gap-2 w-full md:w-[45%]">
                                <label className="text-sm font-medium text-[#6A6A6A]">LEGAL NAME</label>
                                <input type="text" className="w-full p-2 border border-gray-300 bg-white rounded-md" />
                            </div>

                            <div className="flex flex-row gap-4 flex-wrap w-full ">
                                <div className="flex flex-col items-start justify-start gap-2 w-full md:w-[45%]">
                                    <label className="text-sm font-medium text-[#6A6A6A]">FIRST NAME</label>
                                    <input type="text" className="w-full p-2 border border-gray-300 bg-white rounded-md" />
                                </div>
                                <div className="flex flex-col items-start justify-start gap-2 w-full md:w-[45%]">
                                    <label className="text-sm font-medium text-[#6A6A6A]">LAST NAME</label>
                                    <input type="text" className="w-full p-2 border border-gray-300 bg-white rounded-md" />
                                </div>
                            </div>

                            <div className="flex flex-row gap-4 flex-wrap w-full">

                                <div className="flex flex-col items-start justify-start gap-2 w-full md:w-[45%]">
                                    <label className="text-sm font-medium text-[#6A6A6A]">BILLING EMAIL ID</label>
                                    <input type="email" className="w-full p-2 border border-gray-300 bg-white rounded-md" placeholder="email id" />
                                </div>
                                <div className="flex flex-col items-start justify-start gap-2 w-full md:w-[45%]">
                                    <label className="text-sm font-medium text-[#6A6A6A]">GST / TAX NUMBER</label>
                                    <input type="text" className="w-full p-2 border border-gray-300 bg-white rounded-md" placeholder="000 000 000" />
                                </div>
                            </div>

                            <div className="flex flex-row gap-4 flex-wrap w-full">
                                <div className="flex flex-col items-start justify-start gap-2 w-full md:w-[45%]">
                                    <label className="text-sm font-medium text-[#6A6A6A]">BILLING PHONE NUMBER</label>
                                    <input type="text" className="w-full p-2 border border-gray-300 bg-white rounded-md" />
                                </div>
                                <div className="flex flex-col items-start justify-start gap-2 w-full md:w-[45%]">
                                    <label className="text-sm font-medium text-[#6A6A6A]">Address</label>
                                    <input type="text" className="w-full p-2 border border-gray-300 bg-white rounded-md" />
                                </div>
                            </div>


                            <div className="flex flex-row gap-4 flex-wrap w-full">
                                <div className="flex flex-col items-start justify-start gap-2 w-full md:w-[45%]">
                                    <label className="text-sm font-medium text-[#6A6A6A]">CITY</label>
                                    <input type="text" className="w-full p-2 border border-gray-300 bg-white rounded-md" />
                                </div>
                                <div className="flex flex-col items-start justify-start gap-2 w-full md:w-[45%]">
                                    <label className="text-sm font-medium text-[#6A6A6A]">STATE</label>
                                    <input type="text" className="w-full p-2 border border-gray-300 bg-white rounded-md" />
                                </div>
                            </div>
                            <div className="flex flex-row gap-4 flex-wrap w-full">
                                <div className="flex flex-col items-start justify-start gap-2 w-full md:w-[45%]">
                                    <label className="text-sm font-medium text-[#6A6A6A]">Country</label>
                                    <select className="w-full p-2 py-3 border border-gray-300 bg-white rounded-md">
                                        <option value="">Select Country</option>
                                        <option value="USA">USA</option>
                                        <option value="Canada">Canada</option>
                                        <option value="UK">UK</option>
                                    </select>
                                </div>
                                <div className="flex flex-col items-start justify-start gap-2 w-full md:w-[45%]">
                                    <label className="text-sm font-medium text-[#6A6A6A]">Pin Code</label>
                                    <input type="text" className="w-full p-2 border border-gray-300 bg-white rounded-md" />
                                </div>
                            </div>



                            <p className="text-xs text-gray-600">
                                By continuing, I agree with the <span className="text-green-600 cursor-pointer">Payment Policy</span> and
                                understand that my subscription will renew automatically at the end of term unless I cancel it.
                            </p>
                            <button className="px-5 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700">Save</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );


};

export default BillingForm;
