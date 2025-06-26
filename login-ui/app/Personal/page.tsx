"use client";

import { useEffect, useState } from "react";
import { SessionProvider } from "next-auth/react";
import Info from "../info/page";
export default function PersonalPage() {
  const [fromGoogle, setFromGoogle] = useState(false);

  useEffect(() => {
    const cookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("fromGoogle="))
      ?.split("=")[1];

    if (cookie === "true") {
      setFromGoogle(true);
      document.cookie = "fromGoogle=; Max-Age=0; path=/"; // delete
    }
  }, []);

  if (fromGoogle) {
    return (
      <SessionProvider>
        <Info />
      </SessionProvider>
    );
  }

  return <Info />;
}