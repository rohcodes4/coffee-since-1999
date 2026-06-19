"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, FileText, ExternalLink, Trash2 } from "lucide-react";
import { PageLoader } from "@/components/ui/Spinner";
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
  const router = useRouter();
  const [invoices, setInvoices] = useState<InvoiceListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | "ALL">("ALL");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState(false);

  const fetchInvoices = useCallback(async () => {
    setLoading(true);
    const params = statusFilter !== "ALL" ? `?status=${statusFilter}` : "";
    const res = await fetch(`/api/admin/invoices${params}`);
    const data = await res.json();
    setInvoices(data);
    // Clear any selections that no longer exist
    setSelected((prev) => {
      const ids = new Set(data.map((i: InvoiceListItem) => i.id));
      return new Set([...prev].filter((id) => ids.has(id)));
    });
    setLoading(false);
  }, [statusFilter]);

  useEffect(() => { fetchInvoices(); }, [fetchInvoices]);

  const allSelected = invoices.length > 0 && invoices.every((i) => selected.has(i.id));
  const someSelected = selected.size > 0;

  function toggleAll() {
    if (allSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(invoices.map((i) => i.id)));
    }
  }

  function toggleOne(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  async function deleteSelected() {
    if (!confirm(`Delete ${selected.size} invoice${selected.size > 1 ? "s" : ""}? This cannot be undone.`)) return;
    setDeleting(true);
    await Promise.all(
      [...selected].map((id) =>
        fetch(`/api/admin/invoices/${id}`, { method: "DELETE" })
      )
    );
    setSelected(new Set());
    setDeleting(false);
    fetchInvoices();
  }

  async function deleteSingle(id: string, invoiceNumber: string) {
    if (!confirm(`Delete invoice ${invoiceNumber}? This cannot be undone.`)) return;
    await fetch(`/api/admin/invoices/${id}`, { method: "DELETE" });
    fetchInvoices();
  }

  return (
    <div className="p-4 sm:p-8 max-w-5xl">
      <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
        <h1 className="font-display text-[#1A0B04] font-medium" style={{ fontSize: "1.6rem" }}>
          Invoices
        </h1>
        <Link
          href="/admin/invoices/new"
          className="flex items-center gap-2 px-4 py-2 bg-[#1A0B04] text-white rounded-xl font-sans text-sm font-semibold hover:bg-[#B86B1A] transition-colors"
        >
          <Plus size={14} /> New Invoice
        </Link>
      </div>

      {/* Filters + bulk action bar */}
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <div className="flex gap-2">
          {(["ALL", "DRAFT", "ISSUED", "SETTLED"] as const).map((s) => (
            <button
              key={s}
              onClick={() => { setStatusFilter(s); setSelected(new Set()); }}
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

        {someSelected && (
          <button
            onClick={deleteSelected}
            disabled={deleting}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl font-sans text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-40"
          >
            <Trash2 size={14} />
            {deleting ? "Deleting…" : `Delete ${selected.size} selected`}
          </button>
        )}
      </div>

      {loading ? (
        <PageLoader />
      ) : invoices.length === 0 ? (
        <div className="text-center py-16">
          <FileText size={40} className="mx-auto text-[#CFC0A0] mb-3" />
          <p className="font-sans text-sm text-[#9A7A56]">No invoices yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#CFC0A0] overflow-hidden">
          <div className="overflow-x-auto">
          <table className="w-full font-sans text-sm min-w-[600px]">
            <thead>
              <tr className="border-b border-[#EDE1C8] text-[#9A7A56] text-xs uppercase tracking-widest">
                <th className="px-4 py-3 w-10">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAll}
                    className="accent-[#B86B1A] w-4 h-4 cursor-pointer"
                  />
                </th>
                <th className="text-left px-4 py-3 font-semibold">Invoice</th>
                <th className="text-left px-4 py-3 font-semibold">Table</th>
                <th className="text-left px-4 py-3 font-semibold">Waiter</th>
                <th className="text-left px-4 py-3 font-semibold">Date</th>
                <th className="text-right px-4 py-3 font-semibold">Total</th>
                <th className="text-center px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 w-20"></th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr
                  key={inv.id}
                  className={cn(
                    "border-b border-[#F4ECD9] transition-colors",
                    selected.has(inv.id) ? "bg-red-50" : "hover:bg-[#FAF6EE]"
                  )}
                >
                  <td className="px-4 py-3.5 text-center">
                    <input
                      type="checkbox"
                      checked={selected.has(inv.id)}
                      onChange={() => toggleOne(inv.id)}
                      className="accent-[#B86B1A] w-4 h-4 cursor-pointer"
                    />
                  </td>
                  <td className="px-4 py-3.5 font-mono text-xs text-[#1A0B04] font-semibold">
                    {inv.invoiceNumber}
                  </td>
                  <td className="px-4 py-3.5 text-[#1A0B04]">
                    {inv.tableName || "Manual"}
                  </td>
                  <td className="px-4 py-3.5 text-[#5A3A1E]">
                    {inv.waiterName ?? "—"}
                  </td>
                  <td className="px-4 py-3.5 text-[#9A7A56] text-xs">
                    {new Date(inv.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric", month: "short", year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3.5 text-right font-semibold text-[#1A0B04]">
                    {formatPrice(calcTotal(inv.items, inv.discount))}
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide",
                      statusColors[inv.status]
                    )}>
                      {inv.status.charAt(0) + inv.status.slice(1).toLowerCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/invoices/${inv.id}`}
                        className="inline-flex items-center gap-1 text-[#B86B1A] hover:underline text-xs font-semibold"
                      >
                        <ExternalLink size={11} /> Open
                      </Link>
                      <button
                        onClick={() => deleteSingle(inv.id, inv.invoiceNumber)}
                        className="p-1 rounded-lg text-[#9A7A56] hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete invoice"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>

          {someSelected && (
            <div className="px-5 py-3 border-t border-[#EDE1C8] bg-red-50 flex items-center justify-between">
              <p className="font-sans text-xs text-red-700 font-semibold">
                {selected.size} invoice{selected.size > 1 ? "s" : ""} selected
              </p>
              <button
                onClick={deleteSelected}
                disabled={deleting}
                className="flex items-center gap-1.5 px-4 py-2 bg-red-600 text-white rounded-xl font-sans text-xs font-semibold hover:bg-red-700 transition-colors disabled:opacity-40"
              >
                <Trash2 size={12} />
                {deleting ? "Deleting…" : "Delete selected"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
