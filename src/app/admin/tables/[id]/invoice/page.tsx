import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { InvoiceClient } from "./InvoiceClient";

export default async function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [table, settings] = await Promise.all([
    db.table.findUnique({ where: { id } }),
    db.cafeSettings.upsert({
      where: { id: "singleton" },
      create: { id: "singleton" },
      update: {},
    }),
  ]);

  if (!table) notFound();

  const orders = await db.order.findMany({
    where: { tableId: id, status: { notIn: ["CANCELLED"] } },
    include: {
      items: true,
      waiter: { select: { name: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  // Generate invoice number and increment counter
  const updated = await db.cafeSettings.update({
    where: { id: "singleton" },
    data: { invoiceCounter: { increment: 1 } },
  });
  const invoiceNumber = `${settings.invoicePrefix}-${String(updated.invoiceCounter).padStart(4, "0")}`;

  const waiterOrder = [...orders].reverse().find((o) => o.waiter);
  const waiterName = waiterOrder?.waiter?.name ?? null;

  // Serialize Date fields before passing to client component
  const serializedOrders = orders.map((o) => ({
    ...o,
    createdAt: o.createdAt.toISOString(),
    updatedAt: o.updatedAt.toISOString(),
  }));

  return (
    <InvoiceClient
      table={table}
      orders={serializedOrders}
      settings={settings}
      invoiceNumber={invoiceNumber}
      waiterName={waiterName}
    />
  );
}
