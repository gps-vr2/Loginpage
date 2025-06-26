import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ exists: false, message: "Email is required" }, { status: 400 });
  }

  try {
    const user = await prisma.login.findUnique({
      where: { email },
      select: { id: true },
    });

    const exists = !!user;

    const response = NextResponse.json({ exists });

    // ✅ Set the loginEmail cookie
    response.cookies.set("loginEmail", email, {
      httpOnly: false, // allow client-side access if needed
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
    });

    return response;
  } catch (error) {
    console.error("Error checking user:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
