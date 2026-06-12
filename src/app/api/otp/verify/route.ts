import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { signOtpToken, OTP_COOKIE } from "@/lib/auth";
import { z } from "zod";

const schema = z.object({
  phone: z.string(),
  code: z.string().length(6),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const { phone, code } = parsed.data;

  // Dummy bypass for development when OTP service is not set up
  const isDummyBypass = process.env.NODE_ENV !== "production" && code === "000000";

  if (!isDummyBypass) {
    const session = await db.otpSession.findFirst({
      where: { phone, code, verified: false, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: "desc" },
    });

    if (!session) {
      return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 401 });
    }

    await db.otpSession.update({ where: { id: session.id }, data: { verified: true } });
  }

  const token = signOtpToken(phone);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(OTP_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 2, // 2h
    path: "/",
  });
  return res;
}
