import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { email } = await req.json();

  // Validate format
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
  }

  try {
    // Check if email is already registered
    const existingUser = await prisma.login.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    // ✅ Valid + not in DB: proceed with next step (setpass)
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Register check error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
