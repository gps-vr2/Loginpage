import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

function toProperCase(text: string) {
  return text
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export async function POST(req: NextRequest) {
  try {
    const {
      congregationNumber,
      congregationName,
      language,
      email,
      password, // plain password passed again (assumed already hashed in UI but double hash protected)
      name,
      whatsapp,
    } = await req.json();

    // ✅ Validate congregation number
    if (!/^\d{6}$/.test(congregationNumber?.toString())) {
      return NextResponse.json(
        { error: "Congregation number must be exactly 6 digits." },
        { status: 400 }
      );
    }

    if (!congregationName || congregationName.trim().length < 3) {
      return NextResponse.json(
        { error: "Congregation name must be at least 3 characters." },
        { status: 400 }
      );
    }

    if (!language || language.trim().length < 3) {
      return NextResponse.json(
        { error: "Language must be at least 3 characters." },
        { status: 400 }
      );
    }

    if (!email || !password || !name || !whatsapp) {
      return NextResponse.json(
        { error: "Missing required user fields." },
        { status: 400 }
      );
    }

    const nameFormatted = toProperCase(congregationName);
    const languageFormatted = toProperCase(language);

    // ✅ Hash password again for safety (if not already hashed)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 🚫 Check if congregation already exists (to avoid duplicate key errors)
    const exists = await prisma.congregation.findUnique({
      where: { idCongregation: parseInt(congregationNumber) },
    });

    if (exists) {
      return NextResponse.json(
        { error: "Congregation already exists." },
        { status: 400 }
      );
    }

    // ✅ Step 1: Create congregation
    const congregation = await prisma.congregation.create({
      data: {
        idCongregation: parseInt(congregationNumber),
        name: nameFormatted,
        language: languageFormatted,
      },
    });

    // ✅ Step 2: Create user
    const user = await prisma.login.create({
      data: {
        email,
        name,
        whatsapp,
        password: hashedPassword,
        congregationNumber: congregation.idCongregation,
      },
    });

    // ✅ Optionally: clear cookies after successful registration (optional based on flow)
    const res = NextResponse.json({
      success: true,
      message: "Congregation and user created successfully.",
      userId: user.id,
      congregationId: congregation.idCongregation,
    });

    res.cookies.set("register_email",email, {
  httpOnly: true,
  path: "/",         
  maxAge: 60 * 60, 
});
    res.cookies.set("hashed_password", "", { maxAge: 0 });
    res.cookies.set("pending_name", "", { maxAge: 0 });
    res.cookies.set("pending_whatsapp", "", { maxAge: 0 });
    res.cookies.set("pending_cong_number", "", { maxAge: 0 });

    return res;
  } catch (err) {
    console.error("Error in /api/Congname:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
