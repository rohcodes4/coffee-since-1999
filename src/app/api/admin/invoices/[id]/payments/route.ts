import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const schema = z.object({
  amount: z.number().positive(),
  method: z.enum(["CASH", "CARD", "UPI"]),
  note: z.string().optional(),
});

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });

  const invoice = await db.invoice.findUnique({
    where: { id },
    select: { tableId: true },
  });
  if (!invoice) return NextResponse.json({ error: "Invoice not found" }, { status: 404 });

  const payment = await db.tablePayment.create({
    data: {
      tableId: invoice.tableId ?? "manual",
      invoiceId: id,
      amount: Math.round(parsed.data.amount * 100),
      method: parsed.data.method,
      note: parsed.data.note ?? null,
    },
  });
  return NextResponse.json(payment, { status: 201 });
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const payments = await db.tablePayment.findMany({
    where: { invoiceId: id },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json(payments);
}
