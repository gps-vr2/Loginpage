// app/api/session/set-email/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { env } from "process";

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  console.log(env.NEXTAUTH_SECRET, "NEXTAUTH_SECRET");
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set("register_email", email, {
    httpOnly: false,
    path: "/",
    maxAge: 60 * 10, // 10 minutes
  });

  return response;
}
