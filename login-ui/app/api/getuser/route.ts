// app/api/getuser/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const email =
                req.cookies.get("register_email")?.value || req.cookies.get("loginEmail")?.value ||
                req.cookies.get("reset_email")?.value;
console.log("Email from cookies:", email);
  if (!email) {
    return NextResponse.json({ error: "Email not found in cookies" }, { status: 400 });
  }

  try {
    const user = await prisma.login.findUnique({
      where: { email },
      select: { name: true, congregationNumber: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
