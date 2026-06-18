import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getStaffContext } from "@/lib/auth";
import { z } from "zod";

const schema = z.object({
  amount: z.number().positive(),
  method: z.enum(["CASH", "CARD", "UPI"]),
  note: z.string().optional().nullable(),
});

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string; paymentId: string }> }
) {
  // Both admin and waiter can correct payment entries; unauthenticated callers cannot.
  const staff = await getStaffContext();
  if (!staff) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { paymentId } = await params;
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });

  const payment = await db.tablePayment.update({
    where: { id: paymentId },
    data: {
      amount: Math.round(parsed.data.amount * 100),
      method: parsed.data.method,
      note: parsed.data.note ?? null,
    },
  });
  return NextResponse.json(payment);
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string; paymentId: string }> }
) {
  // Both admin and waiter can remove a mistakenly entered payment.
  const staff = await getStaffContext();
  if (!staff) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { paymentId } = await params;
  await db.tablePayment.delete({ where: { id: paymentId } });
  return NextResponse.json({ ok: true });
}
