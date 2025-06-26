import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  const user = await prisma.login.findUnique({
    where: { email },
  });

  if (!user) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  // ✅ Update login count
  await prisma.login.update({
    where: { email },
    data: {
      loginCount: { increment: 1 },
    },
  });

  // ✅ Prepare response with cookies
  const res = NextResponse.json({
    success: true,
    lastLoginDate: user.updatedAt,
    congregationNumber: user.congregationNumber || null,
  });

  // ✅ Set cookies
  res.cookies.set("loginEmail", email, {
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });

  if (user.congregationNumber) {
    res.cookies.set("congNumber", user.congregationNumber.toString(), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });
  }

  return res;
}
