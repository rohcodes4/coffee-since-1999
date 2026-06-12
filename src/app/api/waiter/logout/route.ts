import { NextResponse } from "next/server";
import { WAITER_COOKIE } from "@/lib/waiter-auth";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(WAITER_COOKIE, "", { maxAge: 0, path: "/" });
  return res;
}
