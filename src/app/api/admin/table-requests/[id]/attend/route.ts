import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyAdminToken, getAdminTokenFromCookies } from "@/lib/auth";

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const token = await getAdminTokenFromCookies();
  if (!token || !verifyAdminToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  await db.tableRequest.update({
    where: { id },
    data: { status: "ATTENDED", attendedAt: new Date(), attendedBy: "Admin" },
  });

  return NextResponse.json({ ok: true });
}
