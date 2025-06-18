"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

const Set = () => {
  const router = useRouter(); // Correct usage in App Router

  return (
    <div className="fixed inset-0 w-screen h-screen bg-gray-100 flex items-center justify-center">
      <div className="flex flex-col md:flex-row-reverse w-full h-full bg-white shadow-lg overflow-hidden">

        {/* Right Section (Image) */}
        <div className="hidden md:block md:w-1/2 h-full bg-[#c2d5d4]">
          <img
            src="/logo1.png"
            alt="Register Visual"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Left Section (Form) */}
        <div className="w-full h-full md:w-1/2 bg-[#c2d5d4] flex items-center justify-center p-6">
          <form className="w-[95%] max-w-[320px] bg-[#fcfdff] rounded-lg shadow-md p-6">
            <h2 className="text-center font-bold text-lg text-black mb-5">Set Password</h2>

            {/* Password */}
            <label htmlFor="password" className="text-sm text-[#0b0b0b] font-medium">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter a new password"
              className="w-full placeholder:text-[12px] placeholder:text-[#666666] bg-[#f6f6f6] outline outline-1 outline-[#d1d1d1] rounded-md px-3 py-2 text-[11px] mb-4 text-black"
              required
            />

            {/* Confirm Password */}
            <label htmlFor="confirm" className="text-sm text-[#0b0b0b] font-medium">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirm"
              placeholder="Re-enter password"
              className="w-full placeholder:text-[12px] placeholder:text-[#666666] bg-[#f6f6f6] outline outline-1 outline-[#d1d1d1] rounded-md px-3 py-2 text-[11px] mb-4 text-black"
              required
            />

            {/* Register Button */}
            <Link href="/Personal">
              <button
                type="button"
                className="w-full bg-[#7370e4] text-white text-[12px] py-2 rounded-md mb-4 hover:bg-gray-900 hover:shadow-md hover:scale-[1.02] transition-all duration-200 ease-in-out"
              >
                Register an account
              </button>
            </Link>

            {/* Back Link */}
            <p
              className="text-center text-sm text-black hover:text-[#7573d2] cursor-pointer hover:underline"
              onClick={() => router.back()}
            >
              Back
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Set;
