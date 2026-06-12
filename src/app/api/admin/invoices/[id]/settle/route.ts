import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const invoice = await db.invoice.findUnique({
    where: { id },
    include: { items: { include: { orderItem: true } } },
  });
  if (!invoice) return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
  if (invoice.status === "SETTLED") return NextResponse.json({ error: "Already settled" }, { status: 400 });

  const now = new Date();

  // Mark linked order items as invoiced
  const orderItemIds = invoice.items
    .map((i) => i.orderItemId)
    .filter((id): id is string => id !== null);

  await db.$transaction(async (tx) => {
    // Mark invoice as settled
    await tx.invoice.update({
      where: { id },
      data: { status: "SETTLED", settledAt: now, sessionEnd: now },
    });

    // Mark order items as invoiced
    if (orderItemIds.length > 0) {
      await tx.orderItem.updateMany({
        where: { id: { in: orderItemIds } },
        data: { invoicedAt: now },
      });
    }

    // Reset table session if linked to a table
    if (invoice.tableId) {
      // Check if there are any uninvoiced items remaining
      const remainingItems = await tx.orderItem.findFirst({
        where: {
          invoicedAt: null,
          order: {
            tableId: invoice.tableId,
            status: { notIn: ["CANCELLED"] },
          },
        },
      });

      await tx.table.update({
        where: { id: invoice.tableId },
        data: {
          sessionStartedAt: remainingItems ? new Date() : null,
          status: remainingItems ? "OCCUPIED" : "AVAILABLE",
        },
      });
    }
  });

  return NextResponse.json({ ok: true });
}
