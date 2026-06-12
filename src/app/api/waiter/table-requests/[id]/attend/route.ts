import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyWaiterToken, getWaiterTokenFromCookies, getWaiterFromCookies } from "@/lib/waiter-auth";

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const token = await getWaiterTokenFromCookies();
  if (!token || !verifyWaiterToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const waiterInfo = await getWaiterFromCookies();
  const { id } = await params;

  await db.tableRequest.update({
    where: { id },
    data: {
      status: "ATTENDED",
      attendedAt: new Date(),
      attendedBy: waiterInfo?.waiterName ?? "Waiter",
    },
  });

  return NextResponse.json({ ok: true });
}
