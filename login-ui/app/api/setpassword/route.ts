import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const email = req.cookies.get("register_email")?.value;
  const { password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Missing email or password" }, { status: 400 });
  }

  if (password.length < 6) {
    return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
  }

  // ✅ Regex: at least 1 uppercase, 1 special character, 1 digit
  const strongPasswordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={}[\]|\\:;"'<>,.?/~`]).+$/;

  if (!strongPasswordRegex.test(password)) {
    return NextResponse.json(
      {
        error: "Password must include at least 1 uppercase letter, 1 number, and 1 special character.",
      },
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const res = NextResponse.json({ success: true });

  res.cookies.set("hashed_password", hashedPassword, {
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    httpOnly: false, // ⚠️ JavaScript can read this, only allow if safe
  });

  return res;
}
