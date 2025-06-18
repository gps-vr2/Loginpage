"use client";

import Link from "next/link";
import React from "react";

const Forgot = () => {
  return (
    <div className="fixed inset-0 w-screen h-screen bg-gray-100 overflow-hidden flex items-center justify-center">
      <div className="flex flex-col md:flex-row w-full h-full max-w-none bg-white shadow-lg overflow-hidden">

        {/* Left Section (Form) */}
        <div className="w-full h-full md:w-1/2 bg-[#c2d5d4] flex items-center justify-center">
          <form className="w-[95%] max-w-[340px] bg-[#fcfdff] rounded-lg shadow-md p-6">
            <h2 className="text-center font-bold text-lg text-black mb-6">
              Forgot Password
            </h2>

            {/* Email Label and Input */}
            <label
              htmlFor="email"
              className="text-sm text-[#0b0b0b] font-medium block mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter a valid email"
              className="w-full bg-[#f6f6f6] outline outline-1 outline-[#d1d1d1] rounded-md px-3 py-2 text-sm mb-4 placeholder:text-[#666666] text-black"
              required
            />

            {/* Submit Button */}
            <Link href="verification">
              <button
                type="submit"
                className="w-full bg-[#7370e4] text-white text-sm py-2 rounded-md mb-4 hover:bg-gray-900 hover:shadow-md hover:scale-[1.02] transition-all duration-200 ease-in-out"
              >
                Send verification code
              </button>
            </Link>

            {/* Back to Login */}
            <p className="text-center text-sm text-black">
              Back to{" "}
              <Link href="withcong" className="text-[#7573d2] hover:underline">
                Login
              </Link>
            </p>
          </form>
        </div>

        {/* Right Section (Image) */}
        <div className="hidden md:block md:w-1/2 h-full">
          <img
            src="/logo1.png"
            alt="Forgot Visual"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Forgot;
