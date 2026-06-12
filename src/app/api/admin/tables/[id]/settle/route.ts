import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// Mark all active orders for the table as DONE and reset table to AVAILABLE
export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const table = await db.table.findUnique({ where: { id } });
  if (!table) return NextResponse.json({ error: "Table not found" }, { status: 404 });

  await db.$transaction([
    db.order.updateMany({
      where: { tableId: id, status: { notIn: ["DONE", "CANCELLED"] } },
      data: { status: "DONE" },
    }),
    db.table.update({ where: { id }, data: { status: "AVAILABLE" } }),
  ]);

  return NextResponse.json({ ok: true });
}
