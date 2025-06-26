"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

// Lazy-load Google session check
const GoogleSessionCheck = dynamic(() => import("../components/GoogleSessionCheck"), {
  ssr: false,
});

const Info = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [congNum, setCongNum] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [congStatus, setCongStatus] = useState<"exists" | "not_exists" | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fromGoogle, setFromGoogle] = useState(false);
  const [googleSignIn, setgoogleSignIn] = useState(false);
 console.log("From Google:", fromGoogle);
  // Cookie helper
  const getCookie = (name: string): string | null => {
    const match = document.cookie
      .split("; ")
      .find((row) => row.startsWith(name + "="));
    return match ? decodeURIComponent(match.split("=")[1]) : null;
  };

  // Detect if redirected from Google
  useEffect(() => {
    const cookie = getCookie("fromGoogle");
    if (cookie === "true") {
      setFromGoogle(true);
      document.cookie = "fromGoogle=; Max-Age=0; path=/"; // clear it after read
    }
  }, []);

  // Handle Google or Cookie-based user
  useEffect(() => {
    const init = async () => {
      if (fromGoogle) {
        try {
          // Get session info from backend
          const res = await fetch("/api/auth/session");
          const session = await res.json();

         console.log("Session from Google:", session);

const userEmail = session?.user?.email;
if (!userEmail || typeof userEmail !== "string") {
  alert("Google login failed to provide email. Please try again.");
  router.push("/registerng");
  return;
}


          // Check if email already exists in DB
          const checkRes = await fetch(`/api/check-email-exists?email=${userEmail}`);
          const checkData = await checkRes.json();

          if (checkData.exists) {
            router.push("/App_page");
            return;
          }

          // No DB record, proceed to registration
          setEmail(userEmail);
          setPassword("google-oauth");
          setgoogleSignIn(true);
        } catch (err) {
          console.error("Google session failed:", err);
          alert("Session error. Please try again.");
          router.push("/registerng");
        }
      } else {
        // Normal flow via cookie
        const emailFromCookie = getCookie("register_email");
        const passwordFromCookie = getCookie("hashed_password");

        if (!emailFromCookie || !passwordFromCookie) {
          alert("Missing info. Please register again.");
          router.push("/registerng");
          return;
        }

        setEmail(emailFromCookie);
        setPassword(passwordFromCookie);
      }
    };

    init();
  }, [fromGoogle, router]);

  // Handle registration submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const congregationNumberInt = parseInt(congNum);
    if (isNaN(congregationNumberInt)) {
      alert("Congregation number must be a valid number.");
      return;
    }

    setIsSubmitting(true);
    setCongStatus(null);

    try {
      const res = await fetch("/api/saveuser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name,
          whatsapp,
          email,
          password,
          congregationNumber: congregationNumberInt,
            googleSignIn,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        if (data.exists) {
          setCongStatus("exists");
          setTimeout(() => router.push("/exist"), 2000);
        } else {
          setCongStatus("not_exists");
          setTimeout(() => router.push("/nocong"), 2000);
        }
      } else {
        alert(data.error || "Failed to save user info.");
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 w-screen h-screen bg-gray-100 flex items-center justify-center">
      <div className="flex flex-col md:flex-row-reverse w-full h-full bg-white shadow-lg overflow-hidden">
        {/* Right Section */}
        <div className="hidden md:block md:w-1/2 h-full bg-[#c2d5d4]">
          <img src="/logo1.png" alt="Visual" className="w-full h-full object-cover" />
        </div>

        {/* Left Section */}
        <div className="w-full md:w-1/2 h-full bg-[#c2d5d4] flex items-center justify-center p-6">
          <form
            onSubmit={handleSubmit}
            className="w-[95%] max-w-[320px] bg-[#fcfdff] rounded-lg shadow-md p-6"
          >
            <h2 className="text-center font-bold text-lg text-black mb-5">Personal Info</h2>

            <label className="text-sm font-medium text-[#0b0b0b]">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              className="w-full mb-3 p-2 text-[12px] rounded outline outline-1 outline-[#d1d1d1] bg-[#f6f6f6] text-black placeholder:text-[#666666]"
              required
            />

            <label className="text-sm font-medium text-[#0b0b0b]">WhatsApp Number</label>
            <input
              type="tel"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="Enter your number"
              className="w-full mb-3 p-2 text-[12px] rounded outline outline-1 outline-[#d1d1d1] bg-[#f6f6f6] text-black placeholder:text-[#666666]"
              required
            />

            <label className="text-sm font-medium text-[#0b0b0b]">Congregation Number</label>
            <input
              type="text"
              value={congNum}
              onChange={(e) => setCongNum(e.target.value)}
              placeholder="Existing congregation number or new"
              className={`w-full mb-2 p-2 text-[12px] rounded outline outline-1 ${
                congStatus === "exists"
                  ? "outline-[#0a951d]"
                  : congStatus === "not_exists"
                  ? "outline-[#e74c3c]"
                  : "outline-[#d1d1d1]"
              } bg-[#f6f6f6] text-black placeholder:text-[#666666]`}
              required
            />

            {congStatus === "exists" && (
              <p className="text-xs text-[#0a951d] mb-2">Congregation exists. Finalizing registration...</p>
            )}
            {congStatus === "not_exists" && (
              <p className="text-xs text-[#e74c3c] mb-2">Congregation doesn’t exist. Proceeding as new.</p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#7370e4] text-white text-[12px] py-2 rounded-md mb-4 hover:bg-gray-900 hover:shadow-md hover:scale-[1.02] transition-all duration-200"
            >
              {isSubmitting ? "Processing..." : "Continue"}
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

      {fromGoogle && <GoogleSessionCheck />}
    </div>
  );
};

export default Info;
