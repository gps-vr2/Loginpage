"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

const App = () => {
  const router = useRouter();

  return (
    <div className="fixed inset-0 w-screen h-screen bg-gray-100 overflow-hidden flex items-center justify-center">
      <div className="flex flex-col md:flex-row w-full h-full max-w-none bg-white shadow-lg overflow-hidden">

        {/* Left Section */}
        <div className="w-full h-full md:w-1/2 bg-[#c2d5d4] flex items-center justify-center">
          <div className="relative w-[95%] max-w-[340px] bg-[#fcfdff] rounded-lg shadow-md p-6 h-[90%] flex flex-col justify-start">
            
            {/* Back Button */}
            <button
              onClick={() => router.back()}
              className="absolute top-8.5 left-4 text-xs text-black hover:text-[#5e5ccf]"
            >
             Back
            </button>

            {/* Header */}
            <div className="w-full h-[36px] bg-white mb-3 flex items-center justify-center">
              <h2 className="italic text-black font-bold text-base tracking-widest">WELCOME</h2>
            </div>

            {/* Subtext */}
            <p className="italic text-[#888] text-xs text-right pr-2 mb-3">
              Your congregation number
            </p>

            {/* App Entries */}
            <div className="flex flex-col gap-4">
              {[
                { img: "/logo_app1.png", title: "APP1 - DESC" },
                { img: "/logo_app2.png", title: "APP2 - DESC" },
                { img: "/logo1.png", title: "APP3 - DESC" },
                { img: "/logo1.png", title: "ADMIN LOGIN" }
              ].map((app, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-start gap-20 hover:scale-[1.01] transition-transform duration-200"
                >
                  <img
                    src={app.img}
                    alt={app.title}
                    className="w-[96px] h-[84px] rounded-md shadow-md"
                  />
                  <div className="text-right">
                    <p className="text-black text-sm font-medium mb-1">{app.title}</p>
                    <button className="w-[80px] h-[28px] bg-[#7370e4] hover:bg-[#5e5ccf] rounded text-white italic text-xs transition-colors duration-300">
                      Launch
                    </button>
                  </div>
                </div>
              ))}
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
