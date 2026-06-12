import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const schema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "PREPARING", "READY", "DELIVERED"]),
});

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });

  const item = await db.orderItem.update({
    where: { id },
    data: { status: parsed.data.status },
  });
  return NextResponse.json(item);
}
