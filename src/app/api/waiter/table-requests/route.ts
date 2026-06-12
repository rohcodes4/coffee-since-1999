import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyWaiterToken, getWaiterTokenFromCookies } from "@/lib/waiter-auth";

export async function GET(req: Request) {
  const token = await getWaiterTokenFromCookies();
  if (!token || !verifyWaiterToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") ?? "PENDING";

  const requests = await db.tableRequest.findMany({
    where: { status: status as "PENDING" | "ATTENDED" },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(requests);
}
