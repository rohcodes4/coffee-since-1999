import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyWaiterToken, getWaiterTokenFromCookies } from "@/lib/waiter-auth";

export async function GET() {
  const token = await getWaiterTokenFromCookies();
  if (!token || !verifyWaiterToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const tables = await db.table.findMany({
    orderBy: { number: "asc" },
    include: {
      orders: {
        where: { status: { notIn: ["CANCELLED", "DONE"] } },
        include: {
          items: {
            where: { invoicedAt: null },
            select: {
              id: true,
              name: true,
              quantity: true,
              status: true,
              createdAt: true,
              invoiceItem: { select: { id: true } },
            },
          },
        },
      },
      invoices: {
        where: {
          OR: [
            { status: { in: ["DRAFT", "ISSUED"] } },
            { status: "SETTLED", settledAt: { gte: startOfToday } },
          ],
        },
        orderBy: { createdAt: "desc" },
        take: 10,
        select: { id: true, invoiceNumber: true, status: true, settledAt: true },
      },
    },
  });

  const result = tables.map((t) => {
    const allItems = t.orders.flatMap((o) => o.items);
    const pendingItems = allItems.filter((i) => i.status !== "DELIVERED");
    const uninvoicedFreeCount = allItems.filter((i) => !i.invoiceItem).length;

    const activeInvoice =
      t.invoices.find((inv) => inv.status === "DRAFT" || inv.status === "ISSUED") ?? null;
    const settledInvoices = t.invoices.filter((inv) => inv.status === "SETTLED");

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
      uninvoicedFreeCount,
      activeInvoice: activeInvoice
        ? {
            id: activeInvoice.id,
            invoiceNumber: activeInvoice.invoiceNumber,
            status: activeInvoice.status,
          }
        : null,
      settledInvoices: settledInvoices.map((inv) => ({
        id: inv.id,
        invoiceNumber: inv.invoiceNumber,
        settledAt: inv.settledAt?.toISOString() ?? null,
      })),
    };
  });

  return NextResponse.json(result);
}
