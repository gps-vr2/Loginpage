// app/api/verify-code/route.ts
import { NextRequest, NextResponse } from "next/server";
import { codeStore } from "../code/codeStore"; // ✅ Corrected import

export async function POST(req: NextRequest) {
  const { email, code } = await req.json();

  const storedCode = codeStore.get(email);

  if (!storedCode) {
    return NextResponse.json({ success: false, error: "No code found for this email" }, { status: 404 });
  }

  if (storedCode !== code) {
    return NextResponse.json({ success: false, error: "Invalid verification code" }, { status: 401 });
  }

  // Optionally, clear the code after successful verification
  codeStore.delete(email);

  return NextResponse.json({ success: true, message: "Email verified successfully" });
}
