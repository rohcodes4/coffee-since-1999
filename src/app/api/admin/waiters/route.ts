import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { z } from "zod";

export async function GET() {
  const waiters = await db.waiter.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json(waiters);
}

const createSchema = z.object({
  name: z.string().min(1),
  pin: z.string().min(4).max(6).regex(/^\d+$/, "PIN must be digits only"),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });

  const { name, pin } = parsed.data;
  const pinHash = await bcrypt.hash(pin, 10);
  const waiter = await db.waiter.create({ data: { name, pin: pinHash } });
  return NextResponse.json(waiter, { status: 201 });
}
