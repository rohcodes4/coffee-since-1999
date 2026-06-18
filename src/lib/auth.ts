import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

const SECRET = (process.env.JWT_SECRET ?? "dev-secret-change-me").trim();
const ADMIN_COOKIE = "admin_token";
const OTP_COOKIE = "otp_token";

// ── Admin auth ────────────────────────────────────────────────

export function signAdminToken(): string {
  return jwt.sign({ role: "admin" }, SECRET, { expiresIn: "24h" });
}

export function verifyAdminToken(token: string): boolean {
  try {
    const payload = jwt.verify(token, SECRET) as { role: string };
    console.log('JWT payload:', payload);
    return payload.role === "admin";
  } catch (err) {
    const e = err as { name?: string; message?: string } | null;
    console.log('JWT verify error type:', e?.name);
    console.log('JWT verify error message:', e?.message);
    return false;
  }
}

export async function checkAdminPassword(password: string): Promise<boolean> {
  const hash = process.env.ADMIN_PASSWORD_HASH;
  if (!hash) {
    // Dev fallback: accept literal "admin"
    return password === "admin";
  }
  return bcrypt.compare(password, hash);
}

export function getAdminEmail(): string {
  return process.env.ADMIN_EMAIL ?? "admin@coffee1999.in";
}

// ── OTP auth ──────────────────────────────────────────────────

export function signOtpToken(phone: string): string {
  return jwt.sign({ phone, verified: true }, SECRET, { expiresIn: "2h" });
}

export function verifyOtpToken(token: string): { phone: string } | null {
  try {
    const payload = jwt.verify(token, SECRET) as { phone: string; verified: boolean };
    if (!payload.verified) return null;
    return { phone: payload.phone };
  } catch {
    return null;
  }
}

// ── Cookie helpers (server-side) ──────────────────────────────

export async function getAdminTokenFromCookies(): Promise<string | undefined> {
  const jar = await cookies();
  return jar.get(ADMIN_COOKIE)?.value;
}

export async function getOtpTokenFromCookies(): Promise<string | undefined> {
  const jar = await cookies();
  return jar.get(OTP_COOKIE)?.value;
}

export { ADMIN_COOKIE, OTP_COOKIE };

// ── Password hash utility (run once in setup) ────────────────
export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 12);
}

// ── Shared staff context (used by invoice/payment API routes) ─
// Returns the authenticated caller's role, or null if unauthenticated.
// Accepts both admin JWT and waiter JWT so a single route can serve both.
import { verifyWaiterToken, getWaiterTokenFromCookies } from "@/lib/waiter-auth";

export async function getStaffContext(): Promise<
  | { role: "admin"; waiterName: null; waiterId: null }
  | { role: "waiter"; waiterName: string; waiterId: string }
  | null
> {
  const adminToken = await getAdminTokenFromCookies();
  if (adminToken && verifyAdminToken(adminToken)) {
    return { role: "admin", waiterName: null, waiterId: null };
  }
  const waiterToken = await getWaiterTokenFromCookies();
  if (waiterToken) {
    const w = verifyWaiterToken(waiterToken);
    if (w) return { role: "waiter", waiterName: w.waiterName, waiterId: w.waiterId };
  }
  return null;
}
