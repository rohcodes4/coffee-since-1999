import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const schema = z.object({ phone: z.string().regex(/^\+?[0-9]{10,15}$/) });

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid phone number" }, { status: 400 });

  const { phone } = parsed.data;
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  await db.otpSession.create({ data: { phone, code, expiresAt } });

  // Dev mode: log the OTP. Replace this block with your SMS provider call.
  if (process.env.NODE_ENV !== "production") {
    console.log(`\n🔐 OTP for ${phone}: ${code}\n`);
  } else {
    // TODO: integrate SMS provider (MSG91, Twilio, etc.)
    // await sendSms(phone, `Your Coffee? verification code is ${code}`);
    console.log(`OTP for ${phone}: ${code}`); // remove in production
  }

  return NextResponse.json({ ok: true, message: "OTP sent" });
}
