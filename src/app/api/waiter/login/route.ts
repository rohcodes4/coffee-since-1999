import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { signWaiterToken, WAITER_COOKIE } from "@/lib/waiter-auth";
import bcrypt from "bcryptjs";
import { z } from "zod";

const schema = z.object({
  waiterId: z.string(),
  pin: z.string().min(4).max(6),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const { waiterId, pin } = parsed.data;

  const waiter = await db.waiter.findUnique({ where: { id: waiterId, active: true } });
  if (!waiter) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  const valid = await bcrypt.compare(pin, waiter.pin);
  if (!valid) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  const token = signWaiterToken(waiter.id, waiter.name);
  const res = NextResponse.json({ ok: true, waiterName: waiter.name });
  res.cookies.set(WAITER_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 10,
    path: "/",
  });
  return res;
}
