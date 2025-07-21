"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const App = () => {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [congNumber, setCongNumber] = useState("");

  useEffect(() => {
    // Fetch user details
    fetch("/api/getuser", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.name) setUserName(data.name);
        if (data?.congregationNumber) setCongNumber(data.congregationNumber);
      })
      .catch((err) => {
        console.error("Failed to fetch user", err);
      });
  }, []);

  return (
    <div className="fixed inset-0 w-screen h-screen bg-gray-100 overflow-hidden flex items-center justify-center">
      <div className="flex flex-col md:flex-row w-full h-full bg-white shadow-lg overflow-hidden">

        {/* Left Section */}
        <div className="w-full h-full md:w-1/2 bg-[#c2d5d4] flex items-center justify-center">
          <div className="relative w-[95%] max-w-[340px] bg-[#fcfdff] rounded-lg shadow-md p-6 vh-[95%] flex flex-col justify-start">

            <button
              onClick={() => router.back()}
              className="absolute top-8 left-6 text-xs text-[#7370e4] hover:underline"
            >
              Back
            </button>

            {/* Welcome */}
            <div className="mb-6 text-center">
              <h2
                className={`font-bold text-gray-900 mb-1 transition-all duration-200 ${
                  userName.length > 20
                    ? "text-l"
                    : userName.length > 10
                    ? "text-l"
                    : "text-2xl"
                }`}
              >
                Welcome, {userName || "Guest"}
              </h2>
              <p className="text-sm text-gray-600 italic">
                Your Congregation Number:{" "}
                <span className="text-[#5e5ccf] font-semibold">
                  {congNumber || "N/A"}
                </span>
              </p>
            </div>

            {/* App Entries */}
            <div className="flex flex-col gap-4">
              {[
                { img: "/logo_app1.png", title: "APP1 - DESC", link: "https://gpsapp1.vercel.app/" },
                { img: "/logo_app2.png", title: "APP2 - DESC", link: "https://gp-sapp2.vercel.app" },
                { img: "/logo1.png", title: "APP3 - DESC" },
                { img: "/admin.png", title: "ADMIN LOGIN" },
              ].map((app, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between hover:scale-[1.01] transition-transform duration-200"
                >
                  <img
                    src={app.img}
                    alt={app.title}
                    className="w-[96px] h-[84px] rounded-md shadow-md"
                  />
                  <div className="text-right">
                    <p className="text-black text-sm font-medium mb-1">{app.title}</p>
                    <button
                      className="w-[80px] h-[28px] bg-[#7370e4] hover:bg-[#5e5ccf] rounded text-white italic text-xs transition-colors duration-300"
                      onClick={() => {
                        if (app.link) {
                          router.push(app.link);
                        }
                      }}
                    >
                      Launch
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-auto pt-2 text-center">
              <button
                onClick={() => {
                  router.push("/");
                }}
                className="text-sm text-[#7370e4] hover:underline transition-all duration-200"
              >
                Use another account
              </button>
            </div>

          </div>
        </div>

        {/* Right Section */}
        <div className="hidden md:block md:w-1/2 h-full">
          <img
            src="/logo1.png"
            alt="Side Visual"
            className="w-full h-full object-cover"
          />
        </div>

      </div>
    </div>
  );
};

export default App;
