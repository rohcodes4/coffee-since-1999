import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getStaffContext } from "@/lib/auth";
import { z } from "zod";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const invoice = await db.invoice.findUnique({
    where: { id },
    include: {
      items: { include: { orderItem: { select: { createdAt: true, status: true } } } },
      payments: true,
      table: { select: { label: true, number: true, sessionStartedAt: true } },
    },
  });
  if (!invoice) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(invoice);
}

const itemSchema = z.object({
  id: z.string().optional(), // existing item id
  name: z.string().min(1),
  quantity: z.number().int().positive(),
  price: z.number().positive(), // rupees
  orderItemId: z.string().optional().nullable(),
});

const updateSchema = z.object({
  notes: z.string().optional().nullable(),
  discount: z.number().min(0).optional(),
  items: z.array(itemSchema).optional(),
  waiterName: z.string().optional().nullable(),
  waiterId: z.string().optional().nullable(),
});

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  // Both admin and waiter can save invoice edits (items, notes, discount, waiter assignment).
  const staff = await getStaffContext();
  if (!staff) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });

  const { notes, discount, items, waiterName, waiterId } = parsed.data;

  const updateData: Record<string, unknown> = {};
  if (notes !== undefined) updateData.notes = notes;
  if (discount !== undefined) updateData.discount = Math.round(discount * 100);
  if (waiterName !== undefined) updateData.waiterName = waiterName;
  if (waiterId !== undefined) updateData.waiterId = waiterId;

  // Replace all items if provided
  if (items !== undefined) {
    await db.invoiceItem.deleteMany({ where: { invoiceId: id } });
    await db.invoiceItem.createMany({
      data: items.map((i) => ({
        invoiceId: id,
        name: i.name,
        quantity: i.quantity,
        price: Math.round(i.price * 100),
        orderItemId: i.orderItemId ?? null,
      })),
    });
  }

  const invoice = await db.invoice.update({
    where: { id },
    data: updateData,
    include: { items: true, payments: true },
  });
  return NextResponse.json(invoice);
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  // Deleting an invoice is an admin-only action — waiters must not be able to destroy records.
  const staff = await getStaffContext();
  if (!staff) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (staff.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  await db.invoice.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
