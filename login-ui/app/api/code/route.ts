import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  const { email } = await req.json();

  const code = Math.floor(10000 + Math.random() * 90000).toString(); // 5-digit code

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"GPS_V2R" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify your GPS_V2R account",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; background-color: #fcfdff; border-radius: 8px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <h2 style="color: #333; text-align: center; font-size: 20px; margin-bottom: 16px;">Email Verification</h2>
        <p style="color: #555; font-size: 15px; line-height: 1.6; text-align: center;">
          Hello,<br />
          Use the 5-digit code below to verify your email address for <strong>GPS_V2R</strong>:
        </p>
        <div style="font-size: 32px; font-weight: bold; text-align: center; margin: 20px 0; color: #7370e4; letter-spacing: 4px;">
          ${code}
        </div>
        <p style="color: #777; font-size: 13px; text-align: center;">
          If you didn’t request this, you can ignore this email. This code will expire soon for your security.
        </p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;" />
        <p style="color: #aaa; font-size: 12px; text-align: center;">
          GPS_V2R &copy; ${new Date().getFullYear()} • All rights reserved.
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true, code }); // Remove code from production response
  } catch (error) {
    console.error("Mail send error:", error);
    return NextResponse.json({ success: false, error });
  }
}
