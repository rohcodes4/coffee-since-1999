import { db } from "@/lib/db";
import Link from "next/link";
import { FileText } from "lucide-react";
import { cn } from "@/lib/utils";

export default async function WaiterTablesPage() {
  const tables = await db.table.findMany({
    orderBy: { number: "asc" },
    include: {
      _count: { select: { orders: { where: { status: { notIn: ["DONE", "CANCELLED"] } } } } },
    },
  });

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="font-display text-[#1A0B04] font-medium" style={{ fontSize: "1.8rem" }}>Select Table</h1>
        <p className="font-sans text-sm text-[#9A7A56] mt-1">Tap a table to take an order. Use the invoice button for billing.</p>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {tables.map((table) => {
          const occupied = table.status === "OCCUPIED";
          const activeOrders = table._count.orders;
          return (
            <div key={table.id} className="flex flex-col gap-1.5">
              <Link
                href={`/waiter/${table.id}`}
                className={cn(
                  "aspect-square flex flex-col items-center justify-center rounded-2xl border-2 transition-all active:scale-95",
                  occupied
                    ? "bg-[#B86B1A]/10 border-[#B86B1A] hover:bg-[#B86B1A]/20"
                    : "bg-white border-[#CFC0A0] hover:border-[#1A0B04] hover:bg-[#EDE1C8]"
                )}
              >
                <span className={cn(
                  "font-display font-medium",
                  occupied ? "text-[#B86B1A]" : "text-[#1A0B04]"
                )} style={{ fontSize: "1.8rem" }}>
                  {table.number}
                </span>
                <span className="font-sans text-xs text-[#9A7A56] text-center px-1 leading-tight mt-0.5">
                  {table.label}
                </span>
                {activeOrders > 0 && (
                  <span className="mt-1 font-sans text-[10px] bg-[#B86B1A] text-white px-2 py-0.5 rounded-full">
                    {activeOrders} order{activeOrders > 1 ? "s" : ""}
                  </span>
                )}
              </Link>

              {/* Invoice button — always visible */}
              <Link
                href={`/waiter/invoices/new?tableId=${table.id}`}
                className={cn(
                  "flex items-center justify-center gap-1 py-1.5 rounded-xl font-sans text-[10px] font-semibold transition-colors",
                  occupied
                    ? "bg-[#B86B1A] text-white hover:bg-[#9A5912]"
                    : "border border-[#CFC0A0] text-[#9A7A56] hover:bg-[#EDE1C8] hover:text-[#5A3A1E]"
                )}
              >
                <FileText size={10} /> Invoice
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
