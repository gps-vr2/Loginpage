// components/GoogleSessionChecker.tsx
"use client";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function GoogleSessionChecker() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && session?.user?.existsInDb) {
      router.replace("/App_page");
    }
  }, [session, status, router]);

  return null;
}
