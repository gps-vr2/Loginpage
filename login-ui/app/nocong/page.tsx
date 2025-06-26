"use client";

import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

const Nocong = () => {
  const router = useRouter();

  const [congNumber, setCongNumber] = useState("");
  const [congName, setCongName] = useState("");
  const [language, setLanguage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  const toProperCase = (text: string) =>
    text
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  useEffect(() => {
    fetch("/api/pendinguser")
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          alert(data.error);
          router.push("/registerng");
        } else {
          setEmail(data.email);
          setPassword(data.password);
          setName(data.name);
          setWhatsapp(data.whatsapp);
          setCongNumber(data.congregationNumber);
        }
      })
      .catch((err) => {
        console.error("Failed to load user session:", err);
        alert("Failed to load user session.");
      });
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const congregationNumberInt = parseInt(congNumber);
    if (isNaN(congregationNumberInt)) {
      alert("Congregation number must be a valid number.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/Congname", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-register-email": email,
        },
        body: JSON.stringify({
          congregationNumber: congregationNumberInt,
          congregationName: toProperCase(congName),
          language: toProperCase(language),
          email,
          password,
          name,
          whatsapp,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        router.push("/App_page");
      } else {
        setError(data.error || "Failed to save congregation.");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Something went wrong. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 w-screen h-screen bg-gray-100 flex items-center justify-center">
      <div className="flex flex-col md:flex-row-reverse w-full h-full bg-white shadow-lg overflow-hidden">
        <div className="hidden md:block md:w-1/2 h-full bg-[#c2d5d4]">
          <img src="/logo1.png" alt="Visual" className="w-full h-full object-cover" />
        </div>

        <div className="w-full md:w-1/2 h-full bg-[#c2d5d4] flex items-center justify-center p-6">
          <form
            onSubmit={handleSubmit}
            className="w-[95%] max-w-[340px] bg-[#fcfdff] rounded-lg shadow-md p-6"
          >
            <h2 className="text-center font-bold text-lg text-black mb-5">
              Congregation Details
            </h2>

            <label className="text-sm font-medium text-[#0b0b0b]">
              Congregation Number <a className="text-red-900">*</a>
            </label>
            <input
              type="text"
              value={congNumber}
              onChange={(e) => setCongNumber(e.target.value)}
              placeholder="New congregation number"
              className="w-full mb-3 p-2 text-[12px] rounded outline outline-1 outline-[#d1d1d1] bg-[#f6f6f6] text-black placeholder:text-[#666666]"
              required
            />

            <label className="text-sm font-medium text-[#0b0b0b]">
              Name of Congregation <a className="text-red-900">*</a>
            </label>
            <input
              type="text"
              value={congName}
              onChange={(e) => setCongName(e.target.value)}
              placeholder="Name of Congregation"
              className="w-full mb-3 p-2 text-[12px] rounded outline outline-1 outline-[#d1d1d1] bg-[#f6f6f6] text-black placeholder:text-[#666666]"
              required
            />

            <label className="text-sm font-medium text-[#0b0b0b]">
              Language <a className="text-red-900">*</a>
            </label>
            <input
              type="text"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              placeholder="Language of Congregation"
              className="w-full mb-4 p-2 text-[12px] rounded outline outline-1 outline-[#d1d1d1] bg-[#f6f6f6] text-black placeholder:text-[#666666]"
              required
            />

            {error && <p className="text-xs text-red-600 text-center mb-3">{error}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#7370e4] text-white text-[12px] py-2 rounded-md mb-4 hover:bg-gray-900 hover:shadow-md hover:scale-[1.02] transition-all duration-200"
            >
              {isSubmitting ? "Saving..." : "Next"}
            </button>

            <p
              className="text-center text-sm text-black hover:text-[#7573d2] cursor-pointer hover:underline"
              onClick={() => router.back()}
            >
              Back
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Nocong;
