import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const body = await req.json();
  const { tableId, type } = body;

  if (!tableId || !["CALL_WAITER", "BILL_REQUEST"].includes(type)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const table = await db.table.findUnique({ where: { id: tableId } });
  if (!table) {
    return NextResponse.json({ error: "Table not found" }, { status: 404 });
  }

  // Prevent duplicate pending requests of same type for same table
  const existing = await db.tableRequest.findFirst({
    where: { tableId, type, status: "PENDING" },
  });
  if (existing) {
    return NextResponse.json({ id: existing.id, type: existing.type, alreadyPending: true });
  }

  const request = await db.tableRequest.create({
    data: { tableId, tableName: table.label, type },
  });

  return NextResponse.json({ id: request.id, type: request.type });
}
