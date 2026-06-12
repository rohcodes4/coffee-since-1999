"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { FileText, RefreshCw, Clock, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

type TableStatus = "AVAILABLE" | "OCCUPIED";
type ItemStatus = "PENDING" | "CONFIRMED" | "PREPARING" | "READY" | "DELIVERED";

interface PendingItem {
  id: string;
  name: string;
  quantity: number;
  status: ItemStatus;
  createdAt: string;
}

interface ActiveInvoice {
  id: string;
  invoiceNumber: string;
  status: "DRAFT" | "ISSUED";
}

interface TableInfo {
  id: string;
  number: number;
  label: string;
  status: TableStatus;
  pendingItems: PendingItem[];
  activeInvoice: ActiveInvoice | null;
}

const itemStatusColors: Record<ItemStatus, string> = {
  PENDING:   "bg-yellow-100 text-yellow-700",
  CONFIRMED: "bg-blue-100 text-blue-700",
  PREPARING: "bg-orange-100 text-orange-700",
  READY:     "bg-purple-100 text-purple-700",
  DELIVERED: "bg-green-100 text-green-700",
};

export default function WaiterTablesPage() {
  const router = useRouter();
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchTables = useCallback(async () => {
    const res = await fetch("/api/waiter/tables-status");
    if (res.ok) {
      setTables(await res.json());
      setLastUpdated(new Date());
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchTables();
    const interval = setInterval(fetchTables, 20000);
    return () => clearInterval(interval);
  }, [fetchTables]);

  const occupied = tables.filter((t) => t.status === "OCCUPIED");
  const available = tables.filter((t) => t.status === "AVAILABLE");

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="font-display text-[#1A0B04] font-medium" style={{ fontSize: "1.5rem" }}>Tables</h1>
          <p className="font-sans text-xs text-[#9A7A56] mt-0.5">
            {lastUpdated
              ? `${lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} · auto-refreshes`
              : "Loading…"}
          </p>
        </div>
        <button
          onClick={fetchTables}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-[#CFC0A0] rounded-xl font-sans text-xs text-[#5A3A1E] hover:bg-[#EDE1C8] transition-colors"
        >
          <RefreshCw size={12} /> Refresh
        </button>
      </div>

      {loading ? (
        <p className="font-sans text-sm text-[#9A7A56]">Loading…</p>
      ) : (
        <>
          {/* Occupied tables */}
          {occupied.length > 0 && (
            <div className="mb-6">
              <h2 className="font-sans text-xs font-semibold uppercase tracking-widest text-[#9A7A56] mb-3">
                Occupied ({occupied.length})
              </h2>
              <div className="space-y-3">
                {occupied.map((table) => (
                  <TableCard key={table.id} table={table} onOrder={() => router.push(`/waiter/${table.id}`)} />
                ))}
              </div>
            </div>
          )}

          {/* Available tables */}
          {available.length > 0 && (
            <div>
              <h2 className="font-sans text-xs font-semibold uppercase tracking-widest text-[#9A7A56] mb-3">
                Available ({available.length})
              </h2>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {available.map((table) => (
                  <button
                    key={table.id}
                    onClick={() => router.push(`/waiter/${table.id}`)}
                    className="aspect-square flex flex-col items-center justify-center rounded-2xl border-2 border-[#CFC0A0] bg-white hover:border-[#1A0B04] hover:bg-[#EDE1C8] transition-all active:scale-95"
                  >
                    <span className="font-display font-medium text-[#1A0B04]" style={{ fontSize: "1.6rem" }}>
                      {table.number}
                    </span>
                    <span className="font-sans text-[10px] text-[#9A7A56] text-center px-1 leading-tight mt-0.5">
                      {table.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {tables.length === 0 && (
            <p className="font-sans text-sm text-[#9A7A56] text-center py-16">No tables found. Ask admin to add tables.</p>
          )}
        </>
      )}
    </div>
  );
}

function TableCard({ table, onOrder }: { table: TableInfo; onOrder: () => void }) {
  const router = useRouter();

  const grouped = table.pendingItems.reduce<Record<ItemStatus, PendingItem[]>>((acc, i) => {
    if (!acc[i.status]) acc[i.status] = [];
    acc[i.status].push(i);
    return acc;
  }, {} as Record<ItemStatus, PendingItem[]>);

  const statusOrder: ItemStatus[] = ["READY", "PREPARING", "CONFIRMED", "PENDING"];

  return (
    <div className="bg-white rounded-2xl border-2 border-[#B86B1A]/40 overflow-hidden">
      {/* Table header */}
      <div className="px-4 py-3 bg-[#B86B1A]/5 border-b border-[#B86B1A]/20 flex items-center justify-between">
        <div>
          <p className="font-display text-[#1A0B04] font-medium" style={{ fontSize: "1.1rem" }}>{table.label}</p>
          <p className="font-sans text-xs text-[#9A7A56]">#{table.number}</p>
        </div>
        <div className="flex items-center gap-2">
          {table.activeInvoice ? (
            <button
              onClick={() => router.push(`/waiter/invoices/${table.activeInvoice!.id}`)}
              className="flex items-center gap-1 px-3 py-1.5 bg-[#B86B1A] text-white rounded-xl font-sans text-xs font-semibold hover:bg-[#9A5912] transition-colors"
            >
              <FileText size={11} /> {table.activeInvoice.invoiceNumber}
            </button>
          ) : (
            <button
              onClick={() => router.push(`/waiter/invoices/new?tableId=${table.id}`)}
              className="flex items-center gap-1 px-3 py-1.5 border border-[#CFC0A0] text-[#5A3A1E] rounded-xl font-sans text-xs font-semibold hover:bg-[#EDE1C8] transition-colors"
            >
              <FileText size={11} /> Request Bill
            </button>
          )}
          <button
            onClick={onOrder}
            className="flex items-center gap-1 px-3 py-1.5 bg-[#1A0B04] text-white rounded-xl font-sans text-xs font-semibold hover:bg-[#B86B1A] transition-colors"
          >
            <Plus size={11} /> Order
          </button>
        </div>
      </div>

      {/* Pending items */}
      {table.pendingItems.length === 0 ? (
        <p className="px-4 py-3 font-sans text-xs text-[#9A7A56] italic">No pending items.</p>
      ) : (
        <div className="px-4 py-3 space-y-3">
          {statusOrder.map((status) => {
            const items = grouped[status];
            if (!items?.length) return null;
            return (
              <div key={status}>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide", itemStatusColors[status])}>
                    {status.toLowerCase()}
                  </span>
                  <span className="font-sans text-[10px] text-[#9A7A56]">{items.length} item{items.length > 1 ? "s" : ""}</span>
                </div>
                <div className="space-y-1 pl-1">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between">
                      <span className="font-sans text-sm text-[#1A0B04]">{item.quantity}× {item.name}</span>
                      <span className="font-sans text-[10px] text-[#9A7A56] flex items-center gap-0.5">
                        <Clock size={9} />
                        {new Date(item.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
