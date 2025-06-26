"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const GoogleRedirect = () => {
  const router = useRouter();

  useEffect(() => {
    // Set client-side cookie to track Google sign-in
    document.cookie = "fromGoogle=true; path=/";
    router.push("/Personal");
  }, [router]);

  return <p className="text-center mt-10">Redirecting...</p>;
};

export default GoogleRedirect;
