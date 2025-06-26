"use client";

import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const Register = () => {
  const [email, setEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    // Step 1: Check registration
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (!res.ok) {
      setErrorMsg(data.error || "Registration failed");
    } else {
      // Step 2: Store email in cookie via API
      const cookieRes = await fetch("/api/session/set-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email }),
      });

      if (!cookieRes.ok) {
        setErrorMsg("Failed to store session email.");
        return;
      }

      // Step 3: Redirect
      router.push("/setpass");
    }
  };

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
          <form
            onSubmit={handleRegister}
            className="w-[95%] max-w-[320px] bg-[#fcfdff] rounded-lg shadow-md p-6"
          >
            <h2 className="text-center font-bold text-lg text-black mb-5">
              Register
            </h2>

            {/* Email */}
            <label htmlFor="email" className="text-sm text-[#0b0b0b] font-medium">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter a valid email"
              className="w-full placeholder:text-[12px] placeholder:text-[#666666] bg-[#f6f6f6] outline outline-1 outline-[#d1d1d1] rounded-md px-3 py-2 text-[11px] mb-4 text-black"
              required
            />

            {/* Error Msg */}
            {errorMsg && <p className="text-xs text-red-600 mb-3">{errorMsg}</p>}

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-[#7370e4] text-white text-[11px] py-2 rounded-md mb-4 hover:bg-gray-900 hover:shadow-md hover:scale-[1.02] transition-all duration-200 ease-in-out"
            >
              Register
            </button>

            {/* Already have account */}
            <p className="text-center text-sm text-black">
              Already have an account?{" "}
              <Link href="/" className="text-[#7573d2] hover:underline">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
