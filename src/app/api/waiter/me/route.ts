import { NextResponse } from "next/server";
import { getWaiterFromCookies } from "@/lib/waiter-auth";

export async function GET() {
  const waiter = await getWaiterFromCookies();
  if (!waiter) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(waiter);
}
