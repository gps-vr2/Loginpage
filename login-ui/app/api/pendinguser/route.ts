// app/api/pendinguser/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const cookies = req.cookies;

  const email = cookies.get("register_email")?.value;
  const password = cookies.get("hashed_password")?.value;
  const name = cookies.get("pending_name")?.value;
  const whatsapp = cookies.get("pending_whatsapp")?.value;
  const congregationNumber = cookies.get("pending_cong_number")?.value;

  if (!email || !password || !name || !whatsapp || !congregationNumber) {
    return NextResponse.json({ error: "Missing user info in cookies" }, { status: 400 });
  }

  return NextResponse.json({
    email,
    password,
    name,
    whatsapp,
    congregationNumber,
  });
}
