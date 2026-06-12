import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";
import type { OrderStatus } from "@prisma/client";

const VALID_STATUSES: OrderStatus[] = ["PENDING", "CONFIRMED", "PREPARING", "READY", "DONE", "CANCELLED"];

const schema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "PREPARING", "READY", "DONE", "CANCELLED"]),
});

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const order = await db.order.update({
    where: { id },
    data: { status: parsed.data.status },
    include: { table: true, items: true },
  });
  return NextResponse.json(order);
}

export { VALID_STATUSES };
