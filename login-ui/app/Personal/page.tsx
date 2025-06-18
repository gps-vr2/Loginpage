"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const Info = () => {
  const router = useRouter();

  const [congNum, setCongNum] = useState("");
  const [congStatus, setCongStatus] = useState<"exists" | "not_exists" | null>(null);

  const checkCongregation = async (value: string) => {
    setCongNum(value);

    if (!value.trim()) {
      setCongStatus(null);
      return;
    }

    // Simulated async validation
    setTimeout(() => {
      if (value === "123456") {
        setCongStatus("exists");
      } else {
        setCongStatus("not_exists");
      }
    }, 500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (congStatus === "exists") {
      router.push("exist"); // ✅ navigate to congregation exists page
    } else if (congStatus === "not_exists") {
      router.push("nocong"); // ❌ navigate to congregation does not exist page
    }
  };

  return (
    <div className="fixed inset-0 w-screen h-screen bg-gray-100 flex items-center justify-center">
      <div className="flex flex-col md:flex-row-reverse w-full h-full bg-white shadow-lg overflow-hidden">
        {/* Right Section (Image) */}
        <div className="hidden md:block md:w-1/2 h-full bg-[#c2d5d4]">
          <img
            src="/logo1.png"
            alt="Info Visual"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Left Section (Form) */}
        <div className="w-full md:w-1/2 h-full bg-[#c2d5d4] flex items-center justify-center p-6">
          <form
            className="w-[95%] max-w-[320px] bg-[#fcfdff] rounded-lg shadow-md p-6"
            onSubmit={handleSubmit}
          >
            <h2 className="text-center font-bold text-lg text-black mb-5">
              Personal Info
            </h2>

            {/* Name */}
            <label htmlFor="name" className="text-sm text-[#0b0b0b] font-medium">
              Name
            </label>
            <input
              type="text"
              id="name"
              placeholder="Ex: name@gmail.com"
              className="w-full placeholder:text-[12px] placeholder:text-[#666666] bg-[#f6f6f6] outline outline-1 outline-[#d1d1d1] rounded-md px-3 py-2 text-[11px] mb-4 text-black"
              required
            />

            {/* WhatsApp Number */}
            <label htmlFor="whatsapp" className="text-sm text-[#0b0b0b] font-medium">
              WhatsApp Number
            </label>
            <input
              type="tel"
              id="whatsapp"
              placeholder="Ex: XXXXXXXXXX"
              className="w-full placeholder:text-[12px] placeholder:text-[#666666] bg-[#f6f6f6] outline outline-1 outline-[#d1d1d1] rounded-md px-3 py-2 text-[11px] mb-4 text-black"
              required
            />

            {/* Congregation Number */}
            <label htmlFor="cong" className="text-sm text-[#0b0b0b] font-medium">
              Congregation Number
            </label>
            <input
              type="text"
              id="cong"
              value={congNum}
              onChange={(e) => checkCongregation(e.target.value)}
              placeholder="Ex: XXXXXXXXXX"
              className={`mb-4 w-full placeholder:text-[12px] placeholder:text-[#666666] bg-[#f6f6f6] rounded-md px-3 py-2 text-[11px] mb-1 text-black outline outline-1 
                ${
                  congStatus === "exists"
                    ? "outline-[#0a951d]"
                    : congStatus === "not_exists"
                    ? "outline-[#e74c3c]"
                    : "outline-[#d1d1d1]"
                }`}
              required
            />

            {/* Validation Message */}
            {congStatus === "exists" && (
              <p className="text-xs text-[#0a951d] mb-2">This congregation exists</p>
            )}
            {congStatus === "not_exists" && (
              <p className="text-xs text-[#e74c3c] mb-2">This congregation does not exist</p>
            )}

            {/* Continue Button */}
            <button
              type="submit"
              className="w-full bg-[#7370e4] text-white text-[12px] py-2 rounded-md mb-4 hover:bg-gray-900 hover:shadow-md hover:scale-[1.02] transition-all duration-200 ease-in-out"
            >
              Continue
            </button>

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

export default Info;
