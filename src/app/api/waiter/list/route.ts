import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// Public endpoint — returns only id and name for the waiter login screen
export async function GET() {
  const waiters = await db.waiter.findMany({
    where: { active: true },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });
  return NextResponse.json(waiters);
}
