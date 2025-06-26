"use client";

import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";

const Verify = () => {
  const [email, setEmail] = useState("");
  const [resendText, setResendText] = useState("Send code");
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [codeSentOnce, setCodeSentOnce] = useState(false);

  // ✅ Read loginEmail from cookies (client-side only)
  useEffect(() => {
    const getCookie = (name: string): string | undefined => {
      const cookieString = document.cookie;
      const cookies = cookieString.split("; ").reduce((acc: Record<string, string>, current) => {
        const [key, value] = current.split("=");
        acc[key] = value;
        return acc;
      }, {} as Record<string, string>);
      return cookies[name];
    };

    const cookieEmail = getCookie("loginEmail");
    if (cookieEmail) setEmail(decodeURIComponent(cookieEmail));
  }, []);

  // ✅ Send verification code
  const sendCode = async (targetEmail: string) => {
    try {
      const res = await fetch("/api/code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: targetEmail }),
      });

      if (res.ok) {
        setResendText("Code sent!");
        setCodeSentOnce(true);
        setTimeout(() => setResendText("Resend code?"), 3000);
      } else {
        throw new Error("Code send failed");
      }
    } catch (err) {
      console.error("Failed to send code:", err);
      setResendText("Failed! Try again");
      setTimeout(() => setResendText("Resend code?"), 3000);
    }
  };

  // ✅ Handle input navigation
  const handleInput = (e: React.FormEvent<HTMLInputElement>, index: number) => {
    const input = e.currentTarget;
    input.value = input.value.replace(/[^0-9]/g, "");

    if (input.value.length === 1 && index < 4) {
      inputRefs.current[index + 1]?.focus();
    } else if (input.value.length === 0 && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = () => {
    if (email) sendCode(email);
  };

  const handleSubmit = async () => {
    const enteredCode = inputRefs.current.map((ref) => ref?.value || "").join("");

    if (enteredCode.length !== 5) {
      setErrorMsg("Please enter the full 5-digit code.");
      return;
    }

    try {
      const res = await fetch("/api/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: enteredCode }),
      });

      const data = await res.json();

      if (data.success) {
        window.location.href = "/App_page";
      } else {
        setErrorMsg("Invalid or expired code. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("An error occurred. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 w-screen h-screen bg-gray-100 overflow-hidden flex items-center justify-center">
      <div className="flex flex-col md:flex-row w-full h-full max-w-none bg-white shadow-lg overflow-hidden">
        {/* Left Section */}
        <div className="w-full h-full md:w-1/2 bg-[#c2d5d4] flex items-center justify-center">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            className="w-[95%] max-w-[340px] bg-[#fcfdff] rounded-lg shadow-md p-6"
          >
            <h2 className="text-center font-bold text-lg text-black mb-3">
              Verification Code
            </h2>

            <p className="text-sm text-center text-gray-600 mb-5 leading-snug">
              {!codeSentOnce ? (
                <>
                  Click below to send a verification code to <br />
                  <span className="text-black">{email || "your email"}</span>
                </>
              ) : (
                <>
                  A 5-digit code has been sent to <br />
                  <span className="text-black">{email || "your email"}</span>
                  <br />
                  Please enter it below.
                </>
              )}
              {" "}
              <span
                className="text-[#7573d2] hover:underline cursor-pointer"
                onClick={handleResend}
              >
                {resendText}
              </span>
            </p>

            <div className="flex justify-between mb-4">
              {[...Array(5)].map((_, i) => (
                <input
                  key={i}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  ref={(el) => { inputRefs.current[i] = el; }}
                  onInput={(e) => handleInput(e, i)}
                  className="w-[40px] h-[45px] bg-[#f6f6f6] outline outline-1 outline-[#d1d1d1] rounded-md text-center text-base text-black"
                />
              ))}
            </div>

            {errorMsg && (
              <p className="text-red-500 text-sm text-center mb-3">{errorMsg}</p>
            )}

            <button
              type="submit"
              className="w-full bg-[#7370e4] text-white text-sm py-2 rounded-md mb-4 hover:bg-gray-900 hover:shadow-md hover:scale-[1.02] transition-all duration-200 ease-in-out"
            >
              Submit
            </button>

            <p className="text-center text-sm text-black">
              Wrong email?{" "}
              <button
                onClick={() => {
                  sessionStorage.setItem("fromEditEmail", "true");
                  window.location.href = "/forgot";
                }}
                className="text-sm text-[#7370e4] hover:underline"
              >
                Edit Email
              </button>
            </p>
          </form>
        </div>

        {/* Right Section */}
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
