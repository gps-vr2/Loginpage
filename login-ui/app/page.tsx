"use client";

import { signIn } from "next-auth/react";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Login = () => {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const email = (document.getElementById("email") as HTMLInputElement).value;
    const password = (document.getElementById("password") as HTMLInputElement).value;

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setErrorMsg(data.error || "Login failed");
      return;
    }

    const lastLoginDate = new Date(data.lastLoginDate);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - lastLoginDate.getTime()) / (1000 * 60 * 60 * 24));

  
 

    if (diffInDays > 10) {
      setErrorMsg("Last connection was over 10 days ago. Redirecting...");
      setTimeout(() => router.push("/verification"), 3000);
    } else {
      router.push("/App_page");
    }
  };

  const handleGoogleSignIn = () => {
    localStorage.setItem("loginEmail", "");
    signIn("google", {callbackUrl: "http://localhost:3000/Personal"});
  };

  return (
    <div className="fixed inset-0 w-screen h-screen bg-gray-100 overflow-hidden flex items-center justify-center">
      <div className="flex flex-col md:flex-row w-full h-full bg-white shadow-lg overflow-hidden">

        {/* Left Section */}
        <div className="w-full h-full md:w-1/2 bg-[#c2d5d4] flex items-center justify-center">
          <form onSubmit={handleLogin} className="w-[95%] max-w-[340px] bg-[#fcfdff] rounded-lg shadow-md p-6">
            <h2 className="text-center font-bold text-lg text-black mb-5">Login</h2>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full bg-[#42596d] text-white text-sm py-2 rounded-md mb-4 flex items-center justify-center gap-2 hover:bg-gray-600 hover:shadow-md hover:scale-[1.02] transition-all duration-200"
            >
              <img src="/google.png" alt="Google" className="w-5 h-5" />
              Sign in with Google
            </button>

            <div className="flex items-center justify-between my-4">
              <div className="w-[40%] h-[1px] bg-[#b1b2b5]" />
              <span className="text-xs text-[#898989]">or</span>
              <div className="w-[40%] h-[1px] bg-[#b1b2b5]" />
            </div>

            <label htmlFor="email" className="text-sm text-[#0b0b0b] font-medium mb-1 block">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter a registered email"
              className="w-full placeholder:text-[12px] bg-[#f6f6f6] placeholder:text-[#666666] outline outline-1 outline-[#d1d1d1] rounded-md px-3 py-2 text-black mb-3 text-[12px]"
              required
            />

            <label htmlFor="password" className="text-sm text-[#0b0b0b] font-medium mb-1 block">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              className="w-full placeholder:text-[12px] bg-[#f6f6f6] placeholder:text-[#666666] outline outline-1 outline-[#d1d1d1] rounded-md px-3 py-2 text-black mb-3"
              required
            />

            <div className="flex justify-between items-center text-sm mb-4">
              <label className="flex items-center gap-2 text-[#0b0b0b]">
                <input type="checkbox" className="w-4 h-4" />
                Remember me
              </label>
              <Link href="/forgot" className="text-[#7573d2] hover:underline">Forgot password?</Link>
            </div>

            {errorMsg && <p className="text-xs text-red-600 text-center mb-3">{errorMsg}</p>}

            <button
              type="submit"
              className="w-full bg-[#7370e4] text-white text-sm py-2 rounded-md mb-3 hover:bg-gray-900 hover:shadow-md hover:scale-[1.02] transition-all duration-200"
            >
              Login
            </button>

            <p className="text-center text-sm text-black">
              No account? <Link href="/registerng" className="text-[#7573d2] hover:underline">Create one</Link>
            </p>
          </form>
        </div>

        {/* Right Section */}
        <div className="hidden md:block md:w-1/2 h-full">
          <img src="/logo1.png" alt="Visual" className="w-full h-full object-cover" />
        </div>
      </div>
    </div>
  );
};

export default Login;
