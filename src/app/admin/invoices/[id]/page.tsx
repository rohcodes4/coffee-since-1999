import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { InvoiceEditor } from "@/components/invoice/InvoiceEditor";
import type { InvoiceItemData, PaymentData } from "@/components/invoice/InvoiceEditor";

export default async function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [invoice, settings] = await Promise.all([
    db.invoice.findUnique({
      where: { id },
      include: {
        items: {
          include: { orderItem: { select: { createdAt: true } } },
        },
        payments: { orderBy: { createdAt: "asc" } },
        table: { select: { label: true, sessionStartedAt: true } },
      },
    }),
    db.cafeSettings.upsert({
      where: { id: "singleton" },
      create: { id: "singleton" },
      update: {},
    }),
  ]);

  if (!invoice) notFound();

  const items: InvoiceItemData[] = invoice.items.map((i) => ({
    id: i.id,
    name: i.name,
    quantity: i.quantity,
    price: i.price,
    orderItemId: i.orderItemId,
    orderTime: i.orderItem?.createdAt.toISOString() ?? undefined,
  }));

  const payments: PaymentData[] = invoice.payments.map((p) => ({
    id: p.id,
    method: p.method as "CASH" | "CARD" | "UPI",
    amount: p.amount,
    note: p.note,
    createdAt: p.createdAt.toISOString(),
  }));

  return (
    <InvoiceEditor
      invoiceId={id}
      invoiceNumber={invoice.invoiceNumber}
      tableLabel={invoice.tableName || invoice.table?.label || "Manual Invoice"}
      waiterName={invoice.waiterName}
      sessionStart={invoice.sessionStart?.toISOString() ?? null}
      sessionEnd={invoice.sessionEnd?.toISOString() ?? null}
      status={invoice.status as "DRAFT" | "ISSUED" | "SETTLED"}
      notes={invoice.notes}
      discount={invoice.discount}
      initialItems={items}
      initialPayments={payments}
      settings={settings}
      backUrl="/admin/invoices"
    />
  );
}
