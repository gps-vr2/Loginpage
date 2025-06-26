// app/api/congregation/[number]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Dynamic API route handler
export async function GET(
  req: NextRequest,
  { params }: { params: { number: string } } // ✅ destructure `params` here
) {
  const number = params.number; // ✅ use the parameter directly

  try {
    const congregation = await prisma.login.findFirst({
      where: {
        congregationNumber: number,
      },
      select: {
        congregationNumber: true,
        congregationName: true,
      },
    });

    if (!congregation) {
      return NextResponse.json({ error: "Congregation not found" }, { status: 404 });
    }

    return NextResponse.json(congregation);
  } catch (err) {
    console.error("Error fetching congregation:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
