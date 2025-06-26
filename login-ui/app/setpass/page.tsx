"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";

const Set = () => {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (password !== confirm) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }

    try {
      const res = await fetch("/api/setpassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Something went wrong.");
      } else {
        router.push("/Personal");
      }
    } catch (err) {
      console.error("Error:", err);
      setErrorMsg("Server error. Please try again later.");
    }
  };

  return (
    <div className="fixed inset-0 w-screen h-screen bg-gray-100 flex items-center justify-center">
      <div className="flex flex-col md:flex-row-reverse w-full h-full bg-white shadow-lg overflow-hidden">
        {/* Right Section */}
        <div className="hidden md:block md:w-1/2 h-full bg-[#c2d5d4]">
          <img
            src="/logo1.png"
            alt="Register Visual"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Left Section */}
        <div className="w-full h-full md:w-1/2 bg-[#c2d5d4] flex items-center justify-center p-6">
          <form
            className="w-[95%] max-w-[320px] bg-[#fcfdff] rounded-lg shadow-md p-6"
            onSubmit={handleSubmit}
          >
            <h2 className="text-center font-bold text-lg text-black mb-5">
              Set Password
            </h2>

            <label className="text-sm text-[#0b0b0b] font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter a new password"
              className="w-full mb-3 p-2 text-[12px] rounded outline outline-1 outline-[#d1d1d1] bg-[#f6f6f6] text-black placeholder:text-[#666666]"
              required
            />

            <label className="text-sm text-[#0b0b0b] font-medium">Confirm Password</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Re-enter password"
              className="w-full mb-3 p-2 text-[12px] rounded outline outline-1 outline-[#d1d1d1] bg-[#f6f6f6] text-black placeholder:text-[#666666]"
              required
            />

            {errorMsg && <p className="text-xs text-red-600 mb-3">{errorMsg}</p>}

            <button
              type="submit"
              className="w-full bg-[#7370e4] text-white text-[12px] py-2 rounded-md mb-4 hover:bg-gray-900 hover:shadow-md hover:scale-[1.02] transition-all duration-200 ease-in-out"
            >
              Register an account
            </button>

            <p
              onClick={() => router.back()}
              className="text-center text-sm text-black hover:text-[#7573d2] cursor-pointer hover:underline"
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
