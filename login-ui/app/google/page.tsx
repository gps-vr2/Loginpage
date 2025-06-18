"use client";

import React from "react";

const GoogleSignIn = () => {
  return (
    <div className="w-full min-h-screen bg-[#f2f3f5] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md px-8 py-10 text-center">
        {/* Google Logo */}
        <div className="flex justify-start mb-6">
          <img
            src="https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_92x30dp.png"
            alt="Google Logo"
            className="h-6"
          />
        </div>

        <h2 className="text-2xl font-medium text-gray-900 mb-2 text-left">Sign in</h2>
        <p className="text-sm text-gray-900 text-left mb-6">Use your Google Account</p>

        {/* Email Input */}
        <input
          type="email"
          placeholder="Email or phone"
          className="w-full text-black border border-gray-300 rounded-sm px-4 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="text-left text-sm text-blue-600 hover:underline cursor-pointer mb-6">
          Forgot email?
        </div>

        <p className="text-xs text-gray-500 text-left mb-6">
          Not your computer? Use Guest mode to sign in privately.{" "}
          <span className="text-blue-600 hover:underline cursor-pointer">Learn more</span>
        </p>

        {/* Buttons */}
        <div className="flex justify-between items-center">
        
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-sm text-sm">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default GoogleSignIn;
