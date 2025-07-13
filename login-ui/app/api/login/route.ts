import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";  // ✅ make sure bcryptjs is installed

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    // ✅ Debug logs to see exactly what comes in
    console.log("Received email:", email);
    console.log("Received password:", password);

    // ✅ Normalize email to lowercase (recommended)
    const normalizedEmail = email.toLowerCase();

    // ✅ Find user by email
    const user = await prisma.login.findUnique({
      where: { email: normalizedEmail },
    });

    console.log("User from DB:", user);

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    console.log("Stored password hash:", user.password);

    // ✅ Compare password
    let isPasswordValid = false;

    if (user.password) {
      try {
        isPasswordValid = await bcrypt.compare(password, user.password);
      } catch (error) {
        console.error("Error comparing passwords:", error);
      }
    } else {
      console.log("No password set for this user.");
    }

    console.log("Password valid:", isPasswordValid);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // ✅ Update login count
    await prisma.login.update({
      where: { email: normalizedEmail },
      data: {
        loginCount: { increment: 1 },
      },
    });

    // ✅ Prepare success response
    const res = NextResponse.json({
      success: true,
      lastLoginDate: user.updatedAt,
      congregationNumber: user.congregationNumber || null,
    });

    // ✅ Set cookies
    res.cookies.set("loginEmail", normalizedEmail, {
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

  } catch (error) {
    console.error("Unexpected error in login route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
