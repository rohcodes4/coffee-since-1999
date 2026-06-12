import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { z } from "zod";

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  pin: z.string().min(4).max(6).regex(/^\d+$/).optional(),
  active: z.boolean().optional(),
});

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });

  const data: Record<string, unknown> = {};
  if (parsed.data.name !== undefined) data.name = parsed.data.name;
  if (parsed.data.active !== undefined) data.active = parsed.data.active;
  if (parsed.data.pin !== undefined) data.pin = await bcrypt.hash(parsed.data.pin, 10);

  const waiter = await db.waiter.update({ where: { id }, data });
  return NextResponse.json(waiter);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await db.waiter.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
