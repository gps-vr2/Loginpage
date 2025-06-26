import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, whatsapp, email, password, congregationNumber,googleSignIn } = body;

  console.log("Received data:", body);

  if (!name || !whatsapp || !email) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  try {
    const congregationExists = await prisma.congregation.findUnique({
      where: { idCongregation: congregationNumber },
      select: { idCongregation: true },
    });

      

    if (congregationExists) {


      await prisma.login.create({
        data: {
          name,
          whatsapp,
          email,
          password: password || "google_user_placeholder", 
          congregationNumber,
          googleSignIn,
        },
        
      }
    );

console.log(password);
      return NextResponse.json({ success: true, exists: true });
    } else {
      const res = NextResponse.json({
        success: false,
        exists: false,
        message: "Congregation not found. Data not saved.",
      });

      res.cookies.set("register_email", email, { httpOnly: true, path: "/", maxAge: 60 * 60 });
      res.cookies.set("pending_name", name, { httpOnly: true, path: "/", maxAge: 60 * 60 });
      res.cookies.set("pending_whatsapp", whatsapp, { httpOnly: true, path: "/", maxAge: 60 * 60 });
      res.cookies.set("pending_cong_number", congregationNumber.toString(), {
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60,
      });

      return res;
    }
  } catch (error) {
    console.error("Error saving user:", error);
    return NextResponse.json(
      { error: "Failed to save user. Possible duplicate or server issue." },
      { status: 500 }
    );
  }
}
