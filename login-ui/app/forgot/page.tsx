"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const Forgot = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Prefill email on load
  useEffect(() => {
    const fromEdit = sessionStorage.getItem("fromEditEmail");
    if (fromEdit === "true") {
      const storedEmail =
        localStorage.getItem("reset_email") ||
        localStorage.getItem("loginEmail") ||
        "";
      setEmail(storedEmail);
      sessionStorage.removeItem("fromEditEmail"); // clear after using
    } else {
      setEmail(""); // ensure empty for all other cases
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/checkmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (data.exists) {
        // Save email to localStorage
        localStorage.setItem("reset_email", email);
        localStorage.setItem("loginEmail", email);
        router.push("/verification");
      } else {
        setError("No account found with this email.");
      }
    } catch (err) {
      setError("Something went wrong. Try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 w-screen h-screen bg-gray-100 overflow-hidden flex items-center justify-center">
      <div className="flex flex-col md:flex-row w-full h-full max-w-none bg-white shadow-lg overflow-hidden">
        {/* Left Section (Form) */}
        <div className="w-full h-full md:w-1/2 bg-[#c2d5d4] flex items-center justify-center">
          <form
            onSubmit={handleSubmit}
            className="w-[95%] max-w-[340px] bg-[#fcfdff] rounded-lg shadow-md p-6"
          >
            <h2 className="text-center font-bold text-lg text-black mb-6">
              Forgot Password
            </h2>

            <label
              htmlFor="email"
              className="text-sm text-[#0b0b0b] font-medium block mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter a valid email"
              className="w-full bg-[#f6f6f6] outline outline-1 outline-[#d1d1d1] rounded-md px-3 py-2 text-sm mb-2 placeholder:text-[#666666] text-black"
              required
            />

            {error && <p className="text-xs text-red-600 mb-2">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#7370e4] text-white text-sm py-2 rounded-md mb-4 hover:bg-gray-900 hover:shadow-md hover:scale-[1.02] transition-all duration-200 ease-in-out"
            >
              {loading ? "Checking..." : "Send verification code"}
            </button>

            <p className="text-center text-sm text-black">
              Back to{" "}
              <Link href="/" className="text-[#7573d2] hover:underline">
                Login
              </Link>
            </p>
          </form>
        </div>

        {/* Right Section (Image) */}
        <div className="hidden md:block md:w-1/2 h-full relative">
          <Image
            src="/logo1.png"
            alt="Forgot Visual"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
    </div>
  );
};

export default Forgot;
