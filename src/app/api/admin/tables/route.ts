import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const schema = z.object({
  number: z.number().int().positive(),
  label: z.string().min(1),
});

export async function GET() {
  const tables = await db.table.findMany({
    orderBy: { number: "asc" },
    include: { _count: { select: { orders: true } } },
  });
  return NextResponse.json(tables);
}

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const existing = await db.table.findUnique({ where: { number: parsed.data.number } });
  if (existing) return NextResponse.json({ error: "Table number already exists" }, { status: 409 });

  const table = await db.table.create({ data: parsed.data });
  return NextResponse.json(table, { status: 201 });
}
