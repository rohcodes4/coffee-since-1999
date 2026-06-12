import { db } from "@/lib/db";
import { getWaiterFromCookies } from "@/lib/waiter-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { FileText, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

function formatPrice(paise: number) {
  return `₹${(paise / 100).toFixed(2)}`;
}

export default async function WaiterInvoicesPage() {
  const waiterInfo = await getWaiterFromCookies();
  if (!waiterInfo) redirect("/waiter/login");

  // Show today's invoices for all waiters (same as admin — full visibility)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const invoices = await db.invoice.findMany({
    where: { createdAt: { gte: today } },
    include: { items: { select: { price: true, quantity: true } } },
    orderBy: { createdAt: "desc" },
  });

  const statusColors: Record<string, string> = {
    DRAFT: "bg-yellow-50 text-yellow-700",
    ISSUED: "bg-blue-50 text-blue-700",
    SETTLED: "bg-green-50 text-green-700",
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-[#1A0B04] font-medium" style={{ fontSize: "1.8rem" }}>Today&apos;s Invoices</h1>
          <p className="font-sans text-sm text-[#9A7A56] mt-1">All invoices created today.</p>
        </div>
        <Link
          href="/waiter/invoices/new"
          className="flex items-center gap-1.5 px-4 py-2 bg-[#1A0B04] text-white rounded-xl font-sans text-sm font-semibold hover:bg-[#B86B1A] transition-colors"
        >
          <Plus size={14} /> New
        </Link>
      </div>

      {invoices.length === 0 ? (
        <div className="text-center py-16">
          <FileText size={40} className="mx-auto text-[#CFC0A0] mb-3" />
          <p className="font-sans text-sm text-[#9A7A56]">No invoices today yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {invoices.map((inv) => {
            const total = inv.items.reduce((s, i) => s + i.price * i.quantity, 0);
            return (
              <Link
                key={inv.id}
                href={`/waiter/invoices/${inv.id}`}
                className="block bg-white rounded-2xl border border-[#CFC0A0] px-5 py-4 hover:border-[#B86B1A] transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-mono text-xs font-semibold text-[#1A0B04]">{inv.invoiceNumber}</p>
                    <p className="font-sans text-sm text-[#5A3A1E] mt-0.5">{inv.tableName || "Manual Invoice"}</p>
                    {inv.waiterName && (
                      <p className="font-sans text-xs text-[#9A7A56]">{inv.waiterName}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-display italic text-[#B86B1A]" style={{ fontSize: "1rem" }}>{formatPrice(total)}</p>
                    <span className={cn(
                      "inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide",
                      statusColors[inv.status] ?? "bg-gray-100 text-gray-600"
                    )}>
                      {inv.status.toLowerCase()}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
