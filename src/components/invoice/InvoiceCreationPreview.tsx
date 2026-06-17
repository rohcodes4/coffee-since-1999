"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, CheckCircle2, FileText } from "lucide-react";
import { formatPrice } from "@/lib/format";

export interface PreviewItem {
  id: string;        // orderItem ID — passed back to POST as orderItemIds
  name: string;
  quantity: number;
  price: number;     // paise
  createdAt: string;
}

export interface PreviewSettings {
  invoicePrefix: string;
  invoiceCounter: number; // current value; next invoice will be counter + 1
  cgstRate: number;
  sgstRate: number;
}

interface InvoiceCreationPreviewProps {
  tableId?: string;
  tableName: string;
  sessionStart: string | null;
  items: PreviewItem[];
  settings: PreviewSettings;
  backUrl: string;
  successRedirectBase: string; // e.g. "/admin/invoices/" or "/waiter/invoices/"
}

export function InvoiceCreationPreview({
  tableId,
  tableName,
  sessionStart,
  items,
  settings,
  backUrl,
  successRedirectBase,
}: InvoiceCreationPreviewProps) {
  const router = useRouter();
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  // Show the NEXT invoice number without touching the DB.
  // The server increments atomically only when the user confirms.
  const expectedNumber = `${settings.invoicePrefix}-${String(settings.invoiceCounter + 1).padStart(4, "0")}`;

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const cgstAmount = Math.round((subtotal * settings.cgstRate) / 100);
  const sgstAmount = Math.round((subtotal * settings.sgstRate) / 100);
  const grandTotal = subtotal + cgstAmount + sgstAmount;

  async function createInvoice() {
    setCreating(true);
    setError("");

    // /api/admin/invoices accepts both admin and waiter tokens (getStaffContext).
    const res = await fetch("/api/admin/invoices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tableId: tableId ?? undefined,
        orderItemIds: items.map((i) => i.id),
        sessionStart: sessionStart ?? undefined,
      }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Failed to create invoice. Please try again.");
      setCreating(false);
      return;
    }

    const invoice = await res.json();
    // Navigate to the invoice editor now that the record exists.
    router.push(`${successRedirectBase}${invoice.id}`);
  }

  return (
    <div className="p-4 sm:p-8 max-w-2xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => router.push(backUrl)}
          className="flex items-center gap-2 font-sans text-sm text-[#5A3A1E] hover:text-[#1A0B04] transition-colors mb-4"
        >
          <ArrowLeft size={14} /> Back
        </button>
        <h1 className="font-display text-[#1A0B04] font-medium" style={{ fontSize: "1.6rem" }}>
          Review Invoice
        </h1>
        <p className="font-sans text-sm text-[#9A7A56] mt-1">
          Confirm the items below before creating the invoice. No record is created until you confirm.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-[#CFC0A0] p-6 mb-4">
        {/* Table info + expected invoice number */}
        <div className="flex items-start justify-between mb-5 pb-4 border-b border-[#EDE1C8] gap-4">
          <div>
            {tableName && (
              <div className="mb-1">
                <p className="font-sans text-xs uppercase tracking-widest text-[#9A7A56]">Table</p>
                <p className="font-sans text-sm font-semibold text-[#1A0B04]">{tableName}</p>
              </div>
            )}
            {sessionStart && (
              <p className="font-sans text-xs text-[#9A7A56]">
                Seated at{" "}
                {new Date(sessionStart).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            )}
          </div>
          <div className="text-right shrink-0">
            <p className="font-sans text-xs uppercase tracking-widest text-[#9A7A56]">Invoice No.</p>
            <p
              className="font-display text-[#B86B1A] font-medium mt-0.5"
              style={{ fontSize: "1.1rem" }}
            >
              #{expectedNumber}
            </p>
            {/* Clarify this is a preview — users shouldn't expect this is final */}
            <p className="font-sans text-[10px] text-[#9A7A56] mt-1">Preview · assigned on confirm</p>
          </div>
        </div>

        {/* Items list */}
        {items.length === 0 ? (
          <div className="py-8 text-center">
            <FileText size={32} className="mx-auto text-[#CFC0A0] mb-2" />
            <p className="font-sans text-sm text-[#9A7A56]">No uninvoiced items for this table.</p>
            <p className="font-sans text-xs text-[#9A7A56] mt-1">
              You can still create a blank invoice and add items manually in the editor.
            </p>
          </div>
        ) : (
          <div className="mb-4">
            <div className="grid grid-cols-12 gap-2 mb-2">
              <span className="col-span-6 font-sans text-xs uppercase tracking-widest text-[#9A7A56]">
                Item
              </span>
              <span className="col-span-2 font-sans text-xs uppercase tracking-widest text-[#9A7A56] text-center">
                Qty
              </span>
              <span className="col-span-2 font-sans text-xs uppercase tracking-widest text-[#9A7A56] text-right">
                Rate
              </span>
              <span className="col-span-2 font-sans text-xs uppercase tracking-widest text-[#9A7A56] text-right">
                Amount
              </span>
            </div>
            <div className="border-t border-[#EDE1C8]">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-12 gap-2 py-2.5 border-b border-[#EDE1C8] items-center"
                >
                  <div className="col-span-6">
                    <p className="font-sans text-sm text-[#1A0B04]">{item.name}</p>
                    <p className="font-sans text-[10px] text-[#9A7A56]">
                      {new Date(item.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <span className="col-span-2 font-sans text-sm text-[#5A3A1E] text-center">
                    {item.quantity}
                  </span>
                  <span className="col-span-2 font-sans text-sm text-[#9A7A56] text-right">
                    {formatPrice(item.price)}
                  </span>
                  <span className="col-span-2 font-sans text-sm text-[#1A0B04] font-medium text-right">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* GST breakdown — only meaningful when there are items */}
        {items.length > 0 && (
          <div className="space-y-1.5 ml-auto max-w-xs mt-2">
            <div className="flex justify-between">
              <span className="font-sans text-sm text-[#9A7A56]">Subtotal</span>
              <span className="font-sans text-sm text-[#1A0B04]">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-sans text-sm text-[#9A7A56]">
                CGST ({settings.cgstRate}%)
              </span>
              <span className="font-sans text-sm text-[#1A0B04]">{formatPrice(cgstAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-sans text-sm text-[#9A7A56]">
                SGST ({settings.sgstRate}%)
              </span>
              <span className="font-sans text-sm text-[#1A0B04]">{formatPrice(sgstAmount)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-[#CFC0A0]">
              <span className="font-sans text-sm font-semibold text-[#1A0B04]">Grand Total</span>
              <span
                className="font-display italic text-[#B86B1A]"
                style={{ fontSize: "1.1rem" }}
              >
                {formatPrice(grandTotal)}
              </span>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl font-sans text-sm">
          {error}
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={() => router.push(backUrl)}
          disabled={creating}
          className="flex-1 border border-[#CFC0A0] text-[#5A3A1E] py-3 rounded-2xl font-sans text-sm font-semibold hover:bg-[#EDE1C8] transition-colors disabled:opacity-40"
        >
          Cancel
        </button>
        <button
          onClick={createInvoice}
          disabled={creating}
          className="flex-1 flex items-center justify-center gap-2 bg-[#1A0B04] text-white py-3 rounded-2xl font-sans text-sm font-semibold hover:bg-[#B86B1A] transition-colors disabled:opacity-50"
        >
          {creating ? (
            <>
              <Loader2 size={15} className="animate-spin" /> Creating…
            </>
          ) : (
            <>
              <CheckCircle2 size={15} /> Create Invoice
            </>
          )}
        </button>
      </div>
    </div>
  );
}
