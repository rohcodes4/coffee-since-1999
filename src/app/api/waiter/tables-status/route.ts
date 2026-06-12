import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyWaiterToken, getWaiterTokenFromCookies } from "@/lib/waiter-auth";

export async function GET() {
  const token = await getWaiterTokenFromCookies();
  if (!token || !verifyWaiterToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tables = await db.table.findMany({
    orderBy: { number: "asc" },
    include: {
      orders: {
        where: { status: { notIn: ["CANCELLED", "DONE"] } },
        include: {
          items: {
            where: { invoicedAt: null },
            select: { id: true, name: true, quantity: true, status: true, createdAt: true },
          },
        },
      },
      invoices: {
        where: { status: { in: ["DRAFT", "ISSUED"] } },
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { id: true, invoiceNumber: true, status: true, createdAt: true },
      },
    },
  });

  const result = tables.map((t) => {
    const pendingItems = t.orders.flatMap((o) =>
      o.items.filter((i) => i.status !== "DELIVERED")
    );
    const activeInvoice = t.invoices[0] ?? null;

    return {
      id: t.id,
      number: t.number,
      label: t.label,
      status: t.status,
      pendingItems: pendingItems.map((i) => ({
        id: i.id,
        name: i.name,
        quantity: i.quantity,
        status: i.status,
        createdAt: i.createdAt.toISOString(),
      })),
      activeInvoice: activeInvoice
        ? {
            id: activeInvoice.id,
            invoiceNumber: activeInvoice.invoiceNumber,
            status: activeInvoice.status,
          }
        : null,
    };
  });

  return NextResponse.json(result);
}
