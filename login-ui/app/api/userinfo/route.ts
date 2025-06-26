import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const email = session.user.email;

  const res = NextResponse.json({
    email,
    password: "google_user_placeholder",
  });

  res.cookies.set("loginEmail", email, {
    httpOnly: false,
    path: "/",
    maxAge: 60 * 60 * 24, // 1 day
  });
  
console.log("User info retrieved:", { email });
  return res;
}
