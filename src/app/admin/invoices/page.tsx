"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Plus, FileText, ExternalLink } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

type InvoiceStatus = "DRAFT" | "ISSUED" | "SETTLED";

interface InvoiceListItem {
  id: string;
  invoiceNumber: string;
  tableName: string;
  status: InvoiceStatus;
  discount: number;
  waiterName: string | null;
  createdAt: string;
  settledAt: string | null;
  items: { price: number; quantity: number }[];
}

const statusColors: Record<InvoiceStatus, string> = {
  DRAFT: "bg-yellow-50 text-yellow-700",
  ISSUED: "bg-blue-50 text-blue-700",
  SETTLED: "bg-green-50 text-green-700",
};

function calcTotal(items: { price: number; quantity: number }[], discount: number): number {
  return items.reduce((s, i) => s + i.price * i.quantity, 0) - discount;
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<InvoiceListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | "ALL">("ALL");

  const fetchInvoices = useCallback(async () => {
    setLoading(true);
    const params = statusFilter !== "ALL" ? `?status=${statusFilter}` : "";
    const res = await fetch(`/api/admin/invoices${params}`);
    setInvoices(await res.json());
    setLoading(false);
  }, [statusFilter]);

  useEffect(() => { fetchInvoices(); }, [fetchInvoices]);

  return (
    <div className="p-8 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-[#1A0B04] font-medium" style={{ fontSize: "2rem" }}>
          Invoices
        </h1>
        <Link
          href="/admin/invoices/new"
          className="flex items-center gap-2 px-4 py-2 bg-[#1A0B04] text-white rounded-xl font-sans text-sm font-semibold hover:bg-[#B86B1A] transition-colors"
        >
          <Plus size={14} /> New Invoice
        </Link>
      </div>

      {/* Status filter */}
      <div className="flex gap-2 mb-6">
        {(["ALL", "DRAFT", "ISSUED", "SETTLED"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={cn(
              "px-3 py-1.5 rounded-lg font-sans text-xs font-semibold transition-colors",
              statusFilter === s
                ? "bg-[#1A0B04] text-white"
                : "border border-[#CFC0A0] text-[#5A3A1E] hover:bg-[#EDE1C8]"
            )}
          >
            {s === "ALL" ? "All" : s.charAt(0) + s.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="font-sans text-sm text-[#9A7A56]">Loading…</p>
      ) : invoices.length === 0 ? (
        <div className="text-center py-16">
          <FileText size={40} className="mx-auto text-[#CFC0A0] mb-3" />
          <p className="font-sans text-sm text-[#9A7A56]">No invoices yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#CFC0A0] overflow-hidden">
          <table className="w-full font-sans text-sm">
            <thead>
              <tr className="border-b border-[#EDE1C8] text-[#9A7A56] text-xs uppercase tracking-widest">
                <th className="text-left px-5 py-3 font-semibold">Invoice</th>
                <th className="text-left px-5 py-3 font-semibold">Table</th>
                <th className="text-left px-5 py-3 font-semibold">Waiter</th>
                <th className="text-left px-5 py-3 font-semibold">Date</th>
                <th className="text-right px-5 py-3 font-semibold">Total</th>
                <th className="text-center px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id} className="border-b border-[#F4ECD9] hover:bg-[#FAF6EE] transition-colors">
                  <td className="px-5 py-3.5 font-mono text-xs text-[#1A0B04] font-semibold">
                    {inv.invoiceNumber}
                  </td>
                  <td className="px-5 py-3.5 text-[#1A0B04]">
                    {inv.tableName || "Manual"}
                  </td>
                  <td className="px-5 py-3.5 text-[#5A3A1E]">
                    {inv.waiterName ?? "—"}
                  </td>
                  <td className="px-5 py-3.5 text-[#9A7A56] text-xs">
                    {new Date(inv.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric", month: "short", year: "numeric",
                    })}
                  </td>
                  <td className="px-5 py-3.5 text-right font-semibold text-[#1A0B04]">
                    {formatPrice(calcTotal(inv.items, inv.discount))}
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide",
                      statusColors[inv.status]
                    )}>
                      {inv.status.charAt(0) + inv.status.slice(1).toLowerCase()}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Link
                      href={`/admin/invoices/${inv.id}`}
                      className="inline-flex items-center gap-1 text-[#B86B1A] hover:underline text-xs font-semibold"
                    >
                      <ExternalLink size={11} /> Open
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
