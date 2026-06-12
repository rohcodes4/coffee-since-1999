import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { getAdminTokenFromCookies } from "@/lib/auth";
import { getWaiterFromCookies } from "@/lib/waiter-auth";

export default async function NewInvoicePage({
  searchParams,
}: {
  searchParams: Promise<{ tableId?: string }>;
}) {
  const { tableId } = await searchParams;

  const settings = await db.cafeSettings.upsert({
    where: { id: "singleton" },
    create: { id: "singleton" },
    update: {},
  });

  const updated = await db.cafeSettings.update({
    where: { id: "singleton" },
    data: { invoiceCounter: { increment: 1 } },
  });
  const invoiceNumber = `${settings.invoicePrefix}-${String(updated.invoiceCounter).padStart(4, "0")}`;

  let tableName = "";
  let sessionStart: Date | null = null;
  let uninvoicedOrderItems: {
    id: string; name: string; quantity: number; price: number; createdAt: Date;
  }[] = [];

  if (tableId) {
    const table = await db.table.findUnique({ where: { id: tableId } });
    if (table) {
      tableName = table.label;
      sessionStart = table.sessionStartedAt;

      // Fetch uninvoiced order items for this table
      const orders = await db.order.findMany({
        where: { tableId, status: { notIn: ["CANCELLED"] } },
        include: { items: { where: { invoicedAt: null } } },
        orderBy: { createdAt: "asc" },
      });
      uninvoicedOrderItems = orders.flatMap((o) =>
        o.items.map((item) => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          createdAt: item.createdAt,
        }))
      );
    }
  }

  // Get waiter identity if applicable
  const waiterInfo = await getWaiterFromCookies();

  // Create the invoice in DB
  const invoice = await db.invoice.create({
    data: {
      invoiceNumber,
      tableId: tableId ?? null,
      tableName,
      status: "DRAFT",
      waiterId: waiterInfo?.waiterId ?? null,
      waiterName: waiterInfo?.waiterName ?? null,
      sessionStart,
      sessionEnd: new Date(),
      items: {
        create: uninvoicedOrderItems.map((oi) => ({
          name: oi.name,
          quantity: oi.quantity,
          price: oi.price,
          orderItemId: oi.id,
        })),
      },
    },
  });

  redirect(`/admin/invoices/${invoice.id}`);
}
