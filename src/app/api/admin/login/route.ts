import { NextResponse } from "next/server";
import { checkAdminPassword, getAdminEmail, signAdminToken, ADMIN_COOKIE } from "@/lib/auth";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (email !== getAdminEmail()) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const ok = await checkAdminPassword(password);
  if (!ok) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = signAdminToken();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24, // 24h
    path: "/",
  });

  console.log('Setting cookie:', ADMIN_COOKIE, 'with token:', token);
  console.log('Response cookies will be:', res.cookies.getAll());
  return res;
}
