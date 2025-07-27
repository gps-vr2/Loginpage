// app/api/verify-code/route.ts
import { NextResponse } from "next/server";
import { codeStore } from "../code/codeStore"; // ✅ Correct import path

export async function POST(req: Request) {
  const { email, code } = await req.json();
  const storedCode = codeStore.get(email);

  if (storedCode && storedCode === code) {
    codeStore.delete(email); // Optional: clear after use
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ success: false, error: "Invalid or expired code." });
}
