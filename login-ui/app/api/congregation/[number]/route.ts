import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  context: { params: { number: string } }
) {
  const number = context.params.number;

  try {
    const congregation = await prisma.login.findFirst({
      where: { congregationNumber: number },
      select: {
        congregationNumber: true,
        congregationName: true,
      },
    });

    if (!congregation) {
      return NextResponse.json(
        { error: "Congregation not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(congregation);
  } catch (error) {
    console.error("Error fetching congregation:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
