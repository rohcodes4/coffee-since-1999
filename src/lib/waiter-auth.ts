import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const SECRET = (process.env.JWT_SECRET ?? "dev-secret-change-me").trim();
export const WAITER_COOKIE = "waiter_token";

export function signWaiterToken(waiterId: string, waiterName: string): string {
  return jwt.sign({ waiterId, waiterName, role: "waiter" }, SECRET, { expiresIn: "10h" });
}

export function verifyWaiterToken(token: string): { waiterId: string; waiterName: string } | null {
  try {
    const payload = jwt.verify(token, SECRET) as { waiterId: string; waiterName: string; role: string };
    if (payload.role !== "waiter") return null;
    return { waiterId: payload.waiterId, waiterName: payload.waiterName };
  } catch {
    return null;
  }
}

export async function getWaiterTokenFromCookies(): Promise<string | undefined> {
  const jar = await cookies();
  return jar.get(WAITER_COOKIE)?.value;
}

export async function getWaiterFromCookies(): Promise<{ waiterId: string; waiterName: string } | null> {
  const token = await getWaiterTokenFromCookies();
  if (!token) return null;
  return verifyWaiterToken(token);
}
