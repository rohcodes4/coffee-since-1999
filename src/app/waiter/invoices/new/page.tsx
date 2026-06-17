import { db } from "@/lib/db";
import { getWaiterFromCookies } from "@/lib/waiter-auth";
import { redirect } from "next/navigation";
import { InvoiceCreationPreview } from "@/components/invoice/InvoiceCreationPreview";
import type { PreviewItem, PreviewSettings } from "@/components/invoice/InvoiceCreationPreview";

// This page is a READ-ONLY data loader. It does NOT create an invoice or
// increment the counter. That happens only when the waiter clicks "Create Invoice"
// in the preview component, which POSTs to /api/admin/invoices (accepts waiter tokens).
export default async function WaiterNewInvoicePage({
  searchParams,
}: {
  searchParams: Promise<{ tableId?: string }>;
}) {
  const waiterInfo = await getWaiterFromCookies();
  if (!waiterInfo) redirect("/waiter/login");

  const { tableId } = await searchParams;

  const settings = await db.cafeSettings.upsert({
    where: { id: "singleton" },
    create: { id: "singleton" },
    update: {},
  });

  const previewSettings: PreviewSettings = {
    invoicePrefix: settings.invoicePrefix,
    invoiceCounter: settings.invoiceCounter, // preview shows counter + 1
    cgstRate: settings.cgstRate,
    sgstRate: settings.sgstRate,
  };

  let tableName = "";
  let sessionStart: string | null = null;
  let items: PreviewItem[] = [];

  if (tableId) {
    const table = await db.table.findUnique({ where: { id: tableId } });
    if (table) {
      tableName = table.label;
      sessionStart = table.sessionStartedAt?.toISOString() ?? null;

      // Load uninvoiced order items for preview. No writes.
      const orders = await db.order.findMany({
        where: { tableId, status: { notIn: ["CANCELLED"] } },
        include: {
          items: { where: { invoicedAt: null, invoiceItem: { is: null } } },
        },
        orderBy: { createdAt: "asc" },
      });

      items = orders.flatMap((o) =>
        o.items.map((item) => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          createdAt: item.createdAt.toISOString(),
        }))
      );
    }
  }

  const backUrl = tableId ? "/waiter/tables" : "/waiter/invoices";

  return (
    <InvoiceCreationPreview
      tableId={tableId}
      tableName={tableName}
      sessionStart={sessionStart}
      items={items}
      settings={previewSettings}
      backUrl={backUrl}
      successRedirectBase="/waiter/invoices/"
    />
  );
}
