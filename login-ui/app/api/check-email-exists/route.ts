import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const url = new URL(req.url);
  const email = url.searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "Missing email" }, { status: 400 });
  }

  const user = await prisma.login.findUnique({ where: { email } });

  const res = NextResponse.json({ exists: !!user });

  // ✅ Set current email in cookie (for frontend access)
  res.cookies.set("register_email", email, {
    path: "/",
    maxAge: 60 * 5, // 5 minutes
    httpOnly: false, // frontend needs access
    sameSite: "lax",
  });

  // Optionally also store existence status
  res.cookies.set("existsInDb", user ? "true" : "false", {
    path: "/",
    maxAge: 60 * 5,
    sameSite: "lax",
  });

  return res;
}
