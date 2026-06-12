import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const schema = z.object({
  number: z.number().int().positive().optional(),
  label: z.string().min(1).optional(),
});

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const table = await db.table.update({ where: { id }, data: parsed.data });
  return NextResponse.json(table);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await db.table.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
