"use client";

import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";

const Verify = () => {
  const [email, setEmail] = useState("");
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    const storedEmail = localStorage.getItem("loginEmail");
    if (storedEmail) {
      setEmail(storedEmail);
      fetch("/api/code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: storedEmail }),
      });
    }
  }, []);

  const handleInput = (e: React.FormEvent<HTMLInputElement>, index: number) => {
    const input = e.currentTarget;
    input.value = input.value.replace(/[^0-9]/g, "");

    if (input.value.length === 1 && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  return (
    <div className="fixed inset-0 w-screen h-screen bg-gray-100 overflow-hidden flex items-center justify-center">
      <div className="flex flex-col md:flex-row w-full h-full max-w-none bg-white shadow-lg overflow-hidden">

        {/* Left Section (Form) */}
        <div className="w-full h-full md:w-1/2 bg-[#c2d5d4] flex items-center justify-center">
          <form className="w-[95%] max-w-[340px] bg-[#fcfdff] rounded-lg shadow-md p-6">
            <h2 className="text-center font-bold text-lg text-black mb-3">
              Verification Code
            </h2>

            <p className="text-sm text-center text-gray-600 mb-5 leading-snug">
              We’ve sent a 5-digit code to <br />
              <span className="text-black">{email || "your email"}</span><br />
              Please enter it below.{" "}
              <Link href="#" className="text-[#7573d2] hover:underline">Resend code?</Link>
            </p>

            {/* 5 Digit Code Inputs */}
            <div className="flex justify-between mb-6">
              {[...Array(5)].map((_, i) => (
                <input
                  key={i}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  ref={(el) => (inputRefs.current[i] = el)}
                  onInput={(e) => handleInput(e, i)}
                  className="w-[40px] h-[45px] bg-[#f6f6f6] outline outline-1 outline-[#d1d1d1] rounded-md text-center text-base text-black"
                />
              ))}
            </div>

            {/* Submit Button */}
            <Link href="/App_page">
              <button
                type="submit"
                className="w-full bg-[#7370e4] text-white text-sm py-2 rounded-md mb-4 hover:bg-gray-900 hover:shadow-md hover:scale-[1.02] transition-all duration-200 ease-in-out"
              >
                Submit
              </button>
            </Link>

            {/* Edit Email Link */}
            <p className="text-center text-sm text-black">
              Wrong email?{" "}
              <Link href="/forgot" className="text-[#7573d2] hover:underline">
                Edit Email
              </Link>
            </p>
          </form>
        </div>

        {/* Right Section (Image) */}
        <div className="hidden md:block md:w-1/2 h-full">
          <img
            src="/logo1.png"
            alt="Verification Visual"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Verify;
