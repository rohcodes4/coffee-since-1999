"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Printer, ArrowLeft, Plus, CheckCircle2 } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

interface OrderItem { id: string; name: string; quantity: number; price: number; }
interface Order {
  id: string; createdAt: string; notes: string | null;
  items: OrderItem[];
  waiter: { name: string } | null;
}
interface Table { id: string; number: number; label: string; }
interface CafeSettings {
  cafeName: string; tagline: string; address: string;
  phone: string; email: string; gstNumber: string;
  cgstRate: number; sgstRate: number;
  invoicePrefix: string;
}

type PaymentMethod = "CASH" | "CARD" | "UPI";

interface Payment {
  id: string;
  method: PaymentMethod;
  amount: number; // rupees
  note: string;
}

export function InvoiceClient({
  table, orders, settings, invoiceNumber, waiterName,
}: {
  table: Table;
  orders: Order[];
  settings: CafeSettings;
  invoiceNumber: string;
  waiterName: string | null;
}) {
  const router = useRouter();

  // Flat list of all items across orders, with selection state
  type SelectedItem = { orderId: string; itemId: string; name: string; qty: number; price: number; selected: boolean; };
  const initialItems: SelectedItem[] = orders.flatMap((o) =>
    o.items.map((item) => ({
      orderId: o.id,
      itemId: item.id,
      name: item.name,
      qty: item.quantity,
      price: item.price,
      selected: true,
    }))
  );
  const [items, setItems] = useState<SelectedItem[]>(initialItems);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [payMethod, setPayMethod] = useState<PaymentMethod>("CASH");
  const [payAmount, setPayAmount] = useState("");
  const [payNote, setPayNote] = useState("");
  const [settling, setSettling] = useState(false);
  const [settled, setSettled] = useState(false);

  const selectedItems = items.filter((i) => i.selected);
  const subtotal = selectedItems.reduce((s, i) => s + i.price * i.qty, 0);
  const cgstAmount = Math.round(subtotal * settings.cgstRate / 100);
  const sgstAmount = Math.round(subtotal * settings.sgstRate / 100);
  const grandTotal = subtotal + cgstAmount + sgstAmount;
  const totalPaid = payments.reduce((s, p) => s + Math.round(p.amount * 100), 0);
  const balance = grandTotal - totalPaid;

  function toggleItem(itemId: string) {
    setItems((prev) => prev.map((i) => i.itemId === itemId ? { ...i, selected: !i.selected } : i));
  }

  async function addPayment() {
    const amt = parseFloat(payAmount);
    if (!amt || amt <= 0) return;

    const payment: Payment = {
      id: Math.random().toString(36).slice(2),
      method: payMethod,
      amount: amt,
      note: payNote,
    };

    // Persist to DB
    await fetch(`/api/admin/tables/${table.id}/payment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        invoiceNumber,
        amount: amt,
        method: payMethod,
        note: payNote || undefined,
      }),
    });

    setPayments((prev) => [...prev, payment]);
    setPayAmount("");
    setPayNote("");
  }

  async function markSettled() {
    setSettling(true);
    await fetch(`/api/admin/tables/${table.id}/settle`, { method: "POST" });
    setSettled(true);
    setSettling(false);
  }

  function print() {
    window.print();
  }

  const today = new Date().toLocaleDateString("en-IN", {
    day: "numeric", month: "long", year: "numeric",
  });
  const time = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

  const methodLabel: Record<PaymentMethod, string> = { CASH: "Cash", CARD: "Card", UPI: "UPI" };

  return (
    <div className="min-h-screen bg-[#F4ECD9]">
      {/* Screen-only controls */}
      <div className="print:hidden bg-white border-b border-[#CFC0A0] px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <button
          onClick={() => router.push("/admin/tables")}
          className="flex items-center gap-2 font-sans text-sm text-[#5A3A1E] hover:text-[#1A0B04] transition-colors"
        >
          <ArrowLeft size={16} /> Tables
        </button>
        <div className="flex items-center gap-3">
          {settled ? (
            <span className="flex items-center gap-1.5 font-sans text-sm text-green-600 font-semibold">
              <CheckCircle2 size={16} /> Table settled
            </span>
          ) : balance <= 0 && payments.length > 0 ? (
            <button
              onClick={markSettled}
              disabled={settling}
              className="bg-green-600 text-white px-4 py-2 rounded-xl font-sans text-sm font-semibold hover:bg-green-700 transition-colors disabled:opacity-40"
            >
              {settling ? "Settling…" : "Mark Table Settled"}
            </button>
          ) : null}
          <button
            onClick={print}
            className="flex items-center gap-2 bg-[#1A0B04] text-white px-4 py-2 rounded-xl font-sans text-sm font-semibold hover:bg-[#B86B1A] transition-colors"
          >
            <Printer size={16} /> Print Invoice
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Invoice document */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#CFC0A0] shadow-sm print:shadow-none print:rounded-none print:border-none" id="invoice">
          <div className="p-8">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="font-display text-[#1A0B04] font-medium" style={{ fontSize: "1.8rem" }}>
                  {settings.cafeName}
                </h1>
                {settings.tagline && <p className="font-sans text-xs text-[#9A7A56] italic mt-0.5">{settings.tagline}</p>}
                {settings.address && <p className="font-sans text-xs text-[#5A3A1E] mt-2 max-w-xs whitespace-pre-line">{settings.address}</p>}
                <div className="mt-1 space-y-0.5">
                  {settings.phone && <p className="font-sans text-xs text-[#9A7A56]">📞 {settings.phone}</p>}
                  {settings.email && <p className="font-sans text-xs text-[#9A7A56]">✉ {settings.email}</p>}
                  {settings.gstNumber && <p className="font-sans text-xs text-[#9A7A56]">GSTIN: {settings.gstNumber}</p>}
                </div>
              </div>
              <div className="text-right">
                <p className="font-sans text-xs font-semibold uppercase tracking-widest text-[#9A7A56]">Invoice</p>
                <p className="font-display text-[#B86B1A] font-medium mt-0.5" style={{ fontSize: "1.2rem" }}>#{invoiceNumber}</p>
                <p className="font-sans text-xs text-[#9A7A56] mt-2">{today}</p>
                <p className="font-sans text-xs text-[#9A7A56]">{time}</p>
              </div>
            </div>

            {/* Table & Waiter info */}
            <div className="flex gap-6 mb-6 pb-4 border-b border-[#EDE1C8]">
              <div>
                <p className="font-sans text-xs uppercase tracking-widest text-[#9A7A56]">Table</p>
                <p className="font-sans text-sm font-semibold text-[#1A0B04] mt-0.5">{table.label}</p>
              </div>
              {waiterName && (
                <div>
                  <p className="font-sans text-xs uppercase tracking-widest text-[#9A7A56]">Served by</p>
                  <p className="font-sans text-sm font-semibold text-[#1A0B04] mt-0.5">{waiterName}</p>
                </div>
              )}
            </div>

            {/* Items */}
            <div className="mb-6">
              <div className="grid grid-cols-12 gap-2 mb-2">
                <span className="col-span-5 font-sans text-xs uppercase tracking-widest text-[#9A7A56]">Item</span>
                <span className="col-span-2 font-sans text-xs uppercase tracking-widest text-[#9A7A56] text-center">Qty</span>
                <span className="col-span-2 font-sans text-xs uppercase tracking-widest text-[#9A7A56] text-right">Rate</span>
                <span className="col-span-3 font-sans text-xs uppercase tracking-widest text-[#9A7A56] text-right">Amount</span>
              </div>
              <div className="border-t border-[#EDE1C8]">
                {items.map((item) => (
                  <div
                    key={item.itemId}
                    className={cn(
                      "grid grid-cols-12 gap-2 py-2.5 border-b border-[#EDE1C8] items-center",
                      !item.selected && "opacity-40 print:hidden"
                    )}
                  >
                    <div className="col-span-5 flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={item.selected}
                        onChange={() => toggleItem(item.itemId)}
                        className="print:hidden rounded accent-[#B86B1A]"
                      />
                      <span className="font-sans text-sm text-[#1A0B04]">{item.name}</span>
                    </div>
                    <span className="col-span-2 font-sans text-sm text-[#5A3A1E] text-center">{item.qty}</span>
                    <span className="col-span-2 font-sans text-sm text-[#9A7A56] text-right">{formatPrice(item.price)}</span>
                    <span className="col-span-3 font-sans text-sm text-[#1A0B04] text-right font-medium">
                      {formatPrice(item.price * item.qty)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="space-y-2 ml-auto max-w-xs">
              <div className="flex justify-between">
                <span className="font-sans text-sm text-[#9A7A56]">Subtotal</span>
                <span className="font-sans text-sm text-[#1A0B04]">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-sans text-sm text-[#9A7A56]">CGST ({settings.cgstRate}%)</span>
                <span className="font-sans text-sm text-[#1A0B04]">{formatPrice(cgstAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-sans text-sm text-[#9A7A56]">SGST ({settings.sgstRate}%)</span>
                <span className="font-sans text-sm text-[#1A0B04]">{formatPrice(sgstAmount)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#CFC0A0]">
                <span className="font-sans text-sm font-semibold text-[#1A0B04]">Total</span>
                <span className="font-display italic text-[#B86B1A]" style={{ fontSize: "1.1rem" }}>{formatPrice(grandTotal)}</span>
              </div>

              {/* Payments summary */}
              {payments.length > 0 && (
                <>
                  <div className="pt-2 border-t border-[#EDE1C8] space-y-1">
                    {payments.map((p) => (
                      <div key={p.id} className="flex justify-between">
                        <span className="font-sans text-xs text-[#9A7A56]">Paid — {methodLabel[p.method]}{p.note ? ` (${p.note})` : ""}</span>
                        <span className="font-sans text-xs text-green-700">−{formatPrice(Math.round(p.amount * 100))}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between pt-2 border-t border-[#CFC0A0]">
                    <span className="font-sans text-sm font-semibold text-[#1A0B04]">Balance</span>
                    <span className={cn(
                      "font-display italic",
                      balance <= 0 ? "text-green-600" : "text-red-600"
                    )} style={{ fontSize: "1.1rem" }}>
                      {balance <= 0 ? "Settled ✓" : formatPrice(balance)}
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-[#EDE1C8] text-center">
              <p className="font-display italic text-[#B86B1A]" style={{ fontSize: "1.1rem" }}>Thank you for visiting!</p>
              {settings.tagline && <p className="font-sans text-xs text-[#9A7A56] mt-1">{settings.tagline}</p>}
            </div>
          </div>
        </div>

        {/* Payment panel (screen only) */}
        <div className="print:hidden space-y-4">
          <div className="bg-white rounded-2xl border border-[#CFC0A0] p-5">
            <h3 className="font-sans text-xs font-semibold uppercase tracking-widest text-[#9A7A56] mb-4">Record Payment</h3>
            <div className="space-y-3">
              <div>
                <label className="font-sans text-xs text-[#5A3A1E] uppercase tracking-wider">Method</label>
                <div className="flex gap-2 mt-1.5">
                  {(["CASH", "CARD", "UPI"] as PaymentMethod[]).map((m) => (
                    <button
                      key={m}
                      onClick={() => setPayMethod(m)}
                      className={cn(
                        "flex-1 py-2 rounded-xl font-sans text-xs font-semibold border transition-colors",
                        payMethod === m
                          ? "bg-[#1A0B04] text-white border-[#1A0B04]"
                          : "border-[#CFC0A0] text-[#5A3A1E] hover:bg-[#EDE1C8]"
                      )}
                    >
                      {methodLabel[m]}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="font-sans text-xs text-[#5A3A1E] uppercase tracking-wider">Amount (₹)</label>
                <input
                  type="number"
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  placeholder="0.00"
                  min={0}
                  step={0.5}
                  className="mt-1.5 w-full border border-[#CFC0A0] rounded-xl px-3 py-2 font-sans text-sm focus:outline-none focus:border-[#B86B1A]"
                />
              </div>
              <div>
                <label className="font-sans text-xs text-[#5A3A1E] uppercase tracking-wider">Note (optional)</label>
                <input
                  value={payNote}
                  onChange={(e) => setPayNote(e.target.value)}
                  placeholder="e.g. partial"
                  className="mt-1.5 w-full border border-[#CFC0A0] rounded-xl px-3 py-2 font-sans text-sm focus:outline-none focus:border-[#B86B1A]"
                />
              </div>
              <button
                onClick={addPayment}
                disabled={!payAmount || parseFloat(payAmount) <= 0}
                className="w-full flex items-center justify-center gap-2 bg-[#B86B1A] text-white py-2.5 rounded-xl font-sans text-sm font-semibold hover:bg-[#9A5912] transition-colors disabled:opacity-40"
              >
                <Plus size={14} /> Add Payment
              </button>
            </div>

            {payments.length > 0 && (
              <div className="mt-4 pt-4 border-t border-[#EDE1C8] space-y-2">
                {payments.map((p) => (
                  <div key={p.id} className="flex justify-between items-center">
                    <span className="font-sans text-xs text-[#9A7A56]">{methodLabel[p.method]}{p.note ? ` · ${p.note}` : ""}</span>
                    <span className="font-sans text-xs font-semibold text-[#1A0B04]">₹{p.amount.toFixed(2)}</span>
                  </div>
                ))}
                <div className="flex justify-between pt-2 border-t border-[#EDE1C8]">
                  <span className="font-sans text-xs font-semibold text-[#1A0B04]">Balance</span>
                  <span className={cn(
                    "font-sans text-xs font-semibold",
                    balance <= 0 ? "text-green-600" : "text-red-600"
                  )}>
                    {balance <= 0 ? "Settled" : `₹${(balance / 100).toFixed(2)}`}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Print CSS reminder */}
          <div className="bg-[#EDE1C8] rounded-2xl p-4">
            <p className="font-sans text-xs text-[#9A7A56]">
              <strong className="text-[#5A3A1E]">Tip:</strong> Uncheck items to exclude them from the invoice before printing.
            </p>
          </div>
        </div>
      </div>

      {/* Print styles */}
      <style jsx global>{`
        @media print {
          body * { visibility: hidden; }
          #invoice, #invoice * { visibility: visible; }
          #invoice { position: fixed; top: 0; left: 0; width: 100%; }
        }
      `}</style>
    </div>
  );
}
