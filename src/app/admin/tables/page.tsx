"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, QrCode, Download, Trash2, Loader2, X, Pencil, FileText } from "lucide-react";
import { PageLoader } from "@/components/ui/Spinner";
import { useRouter } from "next/navigation";
import { generateQrDataUrl } from "@/lib/qr";
import { cn } from "@/lib/utils";

type TableStatus = "AVAILABLE" | "OCCUPIED";

interface Table {
  id: string;
  number: number;
  label: string;
  status: TableStatus;
  _count?: { orders: number };
}

export default function TablesPage() {
  const router = useRouter();
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ number: "", label: "" });
  const [adding, setAdding] = useState(false);
  const [editTable, setEditTable] = useState<Table | null>(null);
  const [qrPreviews, setQrPreviews] = useState<Record<string, string>>({});
  const [loadingQr, setLoadingQr] = useState<string | null>(null);

  const fetchTables = useCallback(async () => {
    const res = await fetch("/api/admin/tables");
    setTables(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => { fetchTables(); }, [fetchTables]);

  async function addTable() {
    if (!form.number || !form.label) return;
    setAdding(true);
    await fetch("/api/admin/tables", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ number: parseInt(form.number), label: form.label }),
    });
    setForm({ number: "", label: "" });
    setAdding(false);
    fetchTables();
  }

  async function updateTable() {
    if (!editTable) return;
    setAdding(true);
    await fetch(`/api/admin/tables/${editTable.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ label: form.label }),
    });
    setEditTable(null);
    setForm({ number: "", label: "" });
    setAdding(false);
    fetchTables();
  }

  async function deleteTable(id: string) {
    if (!confirm("Delete this table? Existing orders will remain.")) return;
    await fetch(`/api/admin/tables/${id}`, { method: "DELETE" });
    fetchTables();
  }

  async function showQr(table: Table) {
    if (qrPreviews[table.id]) {
      setQrPreviews((p) => { const n = { ...p }; delete n[table.id]; return n; });
      return;
    }
    setLoadingQr(table.id);
    const dataUrl = await generateQrDataUrl(table.id);
    setQrPreviews((p) => ({ ...p, [table.id]: dataUrl }));
    setLoadingQr(null);
  }

  function downloadQr(table: Table) {
    window.open(`/api/admin/tables/${table.id}/qr`, "_blank");
  }

  function bulkAddTables() {
    const count = parseInt(prompt("How many tables to add? (will number them sequentially)") ?? "0");
    if (!count || count < 1) return;
    const start = (Math.max(0, ...tables.map((t) => t.number)) + 1);
    const promises = Array.from({ length: count }, (_, i) =>
      fetch("/api/admin/tables", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ number: start + i, label: `Table ${start + i}` }),
      })
    );
    Promise.all(promises).then(fetchTables);
  }

  return (
    <div className="p-4 sm:p-8 max-w-4xl">
      <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
        <h1 className="font-display text-[#1A0B04] font-medium" style={{ fontSize: "1.6rem" }}>
          Tables & QR Codes
        </h1>
        <button
          onClick={bulkAddTables}
          className="flex items-center gap-2 px-4 py-2 border border-[#CFC0A0] rounded-xl font-sans text-sm text-[#5A3A1E] hover:bg-[#EDE1C8] transition-colors"
        >
          <Plus size={14} /> Bulk Add
        </button>
      </div>

      {/* Add / Edit form */}
      <div className="bg-white rounded-2xl border border-[#CFC0A0] p-5 mb-6">
        <h2 className="font-sans text-xs font-semibold text-[#9A7A56] uppercase tracking-widest mb-4">
          {editTable ? `Edit ${editTable.label}` : "Add Table"}
        </h2>
        <div className="flex gap-3 items-end flex-wrap">
          {!editTable && (
            <div>
              <label className="block font-sans text-xs text-[#9A7A56] mb-1.5">Table Number</label>
              <input
                type="number"
                value={form.number}
                onChange={(e) => setForm((f) => ({ ...f, number: e.target.value }))}
                className="border border-[#CFC0A0] rounded-xl px-3 py-2 font-sans text-sm text-[#1A0B04] bg-[#F4ECD9] focus:outline-none focus:border-[#B86B1A] w-24"
                placeholder="1"
                min="1"
              />
            </div>
          )}
          <div>
            <label className="block font-sans text-xs text-[#9A7A56] mb-1.5">Display Label</label>
            <input
              value={form.label}
              onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
              className="border border-[#CFC0A0] rounded-xl px-3 py-2 font-sans text-sm text-[#1A0B04] bg-[#F4ECD9] focus:outline-none focus:border-[#B86B1A] w-full sm:w-44"
              placeholder="Table 1 / Patio A"
            />
          </div>
          <button
            onClick={editTable ? updateTable : addTable}
            disabled={adding || (!editTable && !form.number) || !form.label}
            className="flex items-center gap-2 px-5 py-2 bg-[#1A0B04] text-white rounded-xl font-sans text-sm font-semibold disabled:opacity-40 hover:bg-[#B86B1A] transition-colors"
          >
            {adding && <Loader2 size={14} className="animate-spin" />}
            {editTable ? "Update" : "Add Table"}
          </button>
          {editTable && (
            <button onClick={() => { setEditTable(null); setForm({ number: "", label: "" }); }} className="p-2 rounded-xl border border-[#CFC0A0] text-[#9A7A56]"><X size={14} /></button>
          )}
        </div>
      </div>

      {/* Tables list */}
      {loading ? (
        <PageLoader />
      ) : tables.length === 0 ? (
        <p className="font-sans text-sm text-[#9A7A56] text-center py-12">No tables yet. Add one above or use Bulk Add.</p>
      ) : (
        <div className="space-y-3">
          {tables.map((table) => (
            <div key={table.id} className="bg-white rounded-2xl border border-[#CFC0A0] overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4">
                <div className="flex items-center gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-display text-[#1A0B04] font-medium" style={{ fontSize: "1.2rem" }}>
                        {table.label}
                      </p>
                      <span className={cn(
                        "px-2 py-0.5 rounded-full font-sans text-[10px] font-semibold uppercase tracking-wide",
                        table.status === "OCCUPIED"
                          ? "bg-[#B86B1A]/15 text-[#B86B1A]"
                          : "bg-green-100 text-green-700"
                      )}>
                        {table.status === "OCCUPIED" ? "Occupied" : "Available"}
                      </span>
                    </div>
                    <p className="font-sans text-xs text-[#9A7A56]">
                      #{table.number} · {table._count?.orders ?? 0} orders
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap justify-end">
                  <button
                    onClick={() => router.push(`/admin/invoices/new?tableId=${table.id}`)}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-2 rounded-xl font-sans text-xs font-semibold transition-colors min-h-[36px]",
                      table.status === "OCCUPIED"
                        ? "bg-[#B86B1A] text-white hover:bg-[#9A5912]"
                        : "border border-[#CFC0A0] text-[#5A3A1E] hover:bg-[#EDE1C8]"
                    )}
                  >
                    <FileText size={12} /> <span className="hidden sm:inline">Invoice</span>
                  </button>
                  <button
                    onClick={() => showQr(table)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#CFC0A0] font-sans text-xs text-[#5A3A1E] hover:bg-[#EDE1C8] transition-colors min-h-[36px]"
                  >
                    {loadingQr === table.id ? <Loader2 size={12} className="animate-spin" /> : <QrCode size={12} />}
                    <span className="hidden sm:inline">{qrPreviews[table.id] ? "Hide QR" : "QR"}</span>
                  </button>
                  <button
                    onClick={() => downloadQr(table)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#CFC0A0] font-sans text-xs text-[#5A3A1E] hover:bg-[#EDE1C8] transition-colors min-h-[36px]"
                  >
                    <Download size={12} /> <span className="hidden md:inline">Download</span>
                  </button>
                  <button onClick={() => { setEditTable(table); setForm({ number: String(table.number), label: table.label }); }} className="p-2 rounded-xl text-[#9A7A56] hover:text-[#B86B1A] hover:bg-[#EDE1C8] transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"><Pencil size={14} /></button>
                  <button onClick={() => deleteTable(table.id)} className="p-2 rounded-xl text-[#9A7A56] hover:text-red-500 hover:bg-red-50 transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"><Trash2 size={14} /></button>
                </div>
              </div>
              {qrPreviews[table.id] && (
                <div className="border-t border-[#EDE1C8] px-5 py-4 flex items-center gap-6 bg-[#F4ECD9]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={qrPreviews[table.id]} alt={`QR for ${table.label}`} className="w-32 h-32 rounded-xl" />
                  <div>
                    <p className="font-sans text-sm font-semibold text-[#1A0B04] mb-1">{table.label}</p>
                    <p className="font-sans text-xs text-[#9A7A56] mb-3">
                      Scan to open the ordering page for this table.
                    </p>
                    <p className="font-sans text-[10px] text-[#9A7A56] font-mono break-all">
                      {process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"}/order/{table.id}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
