"use client";

import Link from "next/link";

const LoginPage = () => {
  return (
    <div className="fixed inset-0 w-screen h-screen bg-gray-100 overflow-hidden flex items-center justify-center">
      <div className="flex flex-col md:flex-row w-full h-full bg-white shadow-lg overflow-hidden">

        {/* Left Section (Form Options) */}
        <div className="w-full h-full md:w-1/2 bg-[#c2d5d4] flex items-center justify-center">
          <div className="w-[95%] max-w-[340px] bg-[#fcfdff] rounded-lg shadow-md p-6">
            <h2 className="text-center font-bold text-lg text-black mb-5">Hi There!</h2>

          

            {/* Registration Links */}
            <div className="flex flex-col gap-3">
              <Link href="/withcong">
                <div className="w-full h-[36px] bg-[#f6f6f6] rounded-md outline outline-1 outline-[#d1d1d1] flex items-center px-3 text-[12px] text-black hover:bg-white hover:shadow-md hover:scale-[1.02] transition-all duration-200 cursor-pointer">
                  First registration with congregation
                </div>
              </Link>

              <Link href="/withoutcong">
                <div className="w-full h-[36px] bg-[#f6f6f6] rounded-md outline outline-1 outline-[#d1d1d1] flex items-center px-3 text-[12px] text-black hover:bg-white hover:shadow-md hover:scale-[1.02] transition-all duration-200 cursor-pointer">
                  First registration without congregation
                </div>
              </Link>

              <Link href="/returning">
                <div className="w-full h-[36px] bg-[#f6f6f6] rounded-md outline outline-1 outline-[#d1d1d1] flex items-center px-3 text-[12px] text-black hover:bg-white hover:shadow-md hover:scale-[1.02] transition-all duration-200 cursor-pointer">
                  Coming after 10 days?
                </div>
              </Link>

              <Link href="/loginform">
                <div className="w-full h-[36px] bg-[#f6f6f6] rounded-md outline outline-1 outline-[#d1d1d1] flex items-center px-3 text-[12px] text-black hover:bg-white hover:shadow-md hover:scale-[1.02] transition-all duration-200 cursor-pointer">
                  Login
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Right Section (Image) */}
        <div className="hidden md:block md:w-1/2 h-full">
          <img
            src="/logo1.png"
            alt="Login Visual"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
