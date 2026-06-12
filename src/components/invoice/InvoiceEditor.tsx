"use client";

import { useState, useCallback, useEffect } from "react";
import {
  Printer, Plus, Trash2, CheckCircle2, ArrowLeft, Edit2, Save,
  Search, X, ShoppingBag, User,
} from "lucide-react";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

type PaymentMethod = "CASH" | "CARD" | "UPI";
type InvoiceStatus = "DRAFT" | "ISSUED" | "SETTLED";

export interface InvoiceItemData {
  id?: string;
  name: string;
  quantity: number;
  price: number; // paise
  orderItemId?: string | null;
  orderTime?: string;
}

export interface PaymentData {
  id: string;
  method: PaymentMethod;
  amount: number; // paise
  note: string | null;
  createdAt: string;
}

export interface CafeSettingsData {
  cafeName: string;
  tagline: string;
  address: string;
  phone: string;
  email: string;
  gstNumber: string;
  cgstRate: number;
  sgstRate: number;
  invoicePrefix: string;
}

export interface InvoiceEditorProps {
  invoiceId: string;
  invoiceNumber: string;
  tableLabel: string;
  waiterName: string | null;
  waiterId: string | null;
  sessionStart: string | null;
  sessionEnd: string | null;
  status: InvoiceStatus;
  notes: string | null;
  discount: number; // paise
  initialItems: InvoiceItemData[];
  initialPayments: PaymentData[];
  settings: CafeSettingsData;
  backUrl: string;
  role: "admin" | "waiter";
  onSettle?: () => void;
}

interface MenuProduct {
  id: string;
  name: string;
  price: number; // paise
  description: string | null;
  categories: { category: { name: string } }[];
}

interface WaiterOption {
  id: string;
  name: string;
}

const methodLabel: Record<PaymentMethod, string> = { CASH: "Cash", CARD: "Card", UPI: "UPI" };

function formatDuration(start: string, end: string): string {
  const ms = new Date(end).getTime() - new Date(start).getTime();
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export function InvoiceEditor({
  invoiceId, invoiceNumber, tableLabel,
  waiterName: initialWaiterName, waiterId: initialWaiterId,
  sessionStart, sessionEnd, status: initialStatus,
  notes: initialNotes, discount: initialDiscount,
  initialItems, initialPayments, settings,
  backUrl, role, onSettle,
}: InvoiceEditorProps) {
  const [items, setItems] = useState<(InvoiceItemData & { selected: boolean; tempId: string })[]>(
    initialItems.map((i) => ({ ...i, selected: true, tempId: i.id ?? Math.random().toString(36) }))
  );
  const [payments, setPayments] = useState<PaymentData[]>(initialPayments);
  const [payMethod, setPayMethod] = useState<PaymentMethod>("CASH");
  const [payAmount, setPayAmount] = useState("");
  const [payNote, setPayNote] = useState("");
  const [notes, setNotes] = useState(initialNotes ?? "");
  const [discount, setDiscount] = useState(initialDiscount / 100);
  const [newItem, setNewItem] = useState({ name: "", qty: "1", price: "" });
  const [showAddItem, setShowAddItem] = useState(false);
  const [saving, setSaving] = useState(false);
  const [settling, setSettling] = useState(false);
  const [settled, setSettled] = useState(initialStatus === "SETTLED");
  const [saveError, setSaveError] = useState("");

  // Product picker
  const [showPicker, setShowPicker] = useState(false);
  const [menuProducts, setMenuProducts] = useState<MenuProduct[]>([]);
  const [menuLoading, setMenuLoading] = useState(false);
  const [pickerSearch, setPickerSearch] = useState("");

  // Waiter assignment (admin only)
  const [selectedWaiterId, setSelectedWaiterId] = useState<string>(initialWaiterId ?? "");
  const [selectedWaiterName, setSelectedWaiterName] = useState<string>(initialWaiterName ?? "");
  const [waiters, setWaiters] = useState<WaiterOption[]>([]);

  // Fetch menu products for picker
  async function openPicker() {
    setShowPicker(true);
    if (menuProducts.length > 0) return;
    setMenuLoading(true);
    const res = await fetch("/api/menu");
    if (res.ok) {
      const data = await res.json();
      setMenuProducts(data.products ?? []);
    }
    setMenuLoading(false);
  }

  // Fetch waiters for admin assignment
  useEffect(() => {
    if (role !== "admin") return;
    fetch("/api/waiter/list").then((r) => r.json()).then(setWaiters).catch(() => {});
  }, [role]);

  const selectedItems = items.filter((i) => i.selected);
  const subtotal = selectedItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const discountPaise = Math.round(discount * 100);
  const taxableAmount = Math.max(0, subtotal - discountPaise);
  const cgstAmount = Math.round(taxableAmount * settings.cgstRate / 100);
  const sgstAmount = Math.round(taxableAmount * settings.sgstRate / 100);
  const grandTotal = taxableAmount + cgstAmount + sgstAmount;
  const totalPaid = payments.reduce((s, p) => s + p.amount, 0);
  const balance = grandTotal - totalPaid;

  const toggleItem = (tempId: string) =>
    setItems((prev) => prev.map((i) => i.tempId === tempId ? { ...i, selected: !i.selected } : i));

  const removeItem = (tempId: string) =>
    setItems((prev) => prev.filter((i) => i.tempId !== tempId));

  const addManualItem = () => {
    const qty = parseInt(newItem.qty);
    const price = parseFloat(newItem.price);
    if (!newItem.name || !qty || !price) return;
    setItems((prev) => [...prev, {
      name: newItem.name,
      quantity: qty,
      price: Math.round(price * 100),
      selected: true,
      tempId: Math.random().toString(36),
    }]);
    setNewItem({ name: "", qty: "1", price: "" });
    setShowAddItem(false);
  };

  const addProductFromPicker = (product: MenuProduct) => {
    setItems((prev) => {
      // If already in list, increment qty
      const existing = prev.find((i) => i.name === product.name && !i.orderItemId);
      if (existing) {
        return prev.map((i) =>
          i.tempId === existing.tempId ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, {
        name: product.name,
        quantity: 1,
        price: product.price,
        selected: true,
        tempId: Math.random().toString(36),
      }];
    });
  };

  const handleWaiterChange = (id: string) => {
    setSelectedWaiterId(id);
    const w = waiters.find((w) => w.id === id);
    setSelectedWaiterName(w?.name ?? "");
  };

  const save = useCallback(async () => {
    setSaving(true); setSaveError("");
    const body: Record<string, unknown> = {
      notes: notes || null,
      discount,
      items: selectedItems.map((i) => ({
        id: i.id,
        name: i.name,
        quantity: i.quantity,
        price: i.price / 100,
        orderItemId: i.orderItemId ?? null,
      })),
    };
    if (role === "admin") {
      body.waiterId = selectedWaiterId || null;
      body.waiterName = selectedWaiterName || null;
    }
    const res = await fetch(`/api/admin/invoices/${invoiceId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) setSaveError("Failed to save. Please try again.");
    setSaving(false);
  }, [invoiceId, notes, discount, selectedItems, role, selectedWaiterId, selectedWaiterName]);

  const addPayment = async () => {
    const amt = parseFloat(payAmount);
    if (!amt || amt <= 0) return;
    const res = await fetch(`/api/admin/invoices/${invoiceId}/payments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: amt, method: payMethod, note: payNote || undefined }),
    });
    if (res.ok) {
      const p = await res.json();
      setPayments((prev) => [...prev, p]);
      setPayAmount("");
      setPayNote("");
    }
  };

  const settle = async () => {
    await save();
    setSettling(true);
    const res = await fetch(`/api/admin/invoices/${invoiceId}/settle`, { method: "POST" });
    if (res.ok) {
      setSettled(true);
      onSettle?.();
    }
    setSettling(false);
  };

  const today = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  const time = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

  const filteredProducts = menuProducts.filter((p) => {
    const q = pickerSearch.toLowerCase();
    return !q || p.name.toLowerCase().includes(q) || (p.description ?? "").toLowerCase().includes(q);
  });

  return (
    <div className="min-h-screen bg-[#F4ECD9]">
      {/* Controls bar */}
      <div className="print:hidden bg-white border-b border-[#CFC0A0] px-6 py-4 flex items-center justify-between sticky top-0 z-20">
        <a href={backUrl} className="flex items-center gap-2 font-sans text-sm text-[#5A3A1E] hover:text-[#1A0B04] transition-colors">
          <ArrowLeft size={16} /> Back
        </a>
        <div className="flex items-center gap-3">
          {settled ? (
            <span className="flex items-center gap-1.5 font-sans text-sm text-green-600 font-semibold">
              <CheckCircle2 size={16} /> Settled
            </span>
          ) : (
            <>
              <button
                onClick={save}
                disabled={saving}
                className="flex items-center gap-2 border border-[#CFC0A0] text-[#5A3A1E] px-4 py-2 rounded-xl font-sans text-sm font-semibold hover:bg-[#EDE1C8] transition-colors disabled:opacity-40"
              >
                <Save size={14} /> {saving ? "Saving…" : "Save Draft"}
              </button>
              {balance <= 0 && payments.length > 0 && (
                <button
                  onClick={settle}
                  disabled={settling}
                  className="bg-green-600 text-white px-4 py-2 rounded-xl font-sans text-sm font-semibold hover:bg-green-700 transition-colors disabled:opacity-40"
                >
                  {settling ? "Settling…" : "Settle Invoice"}
                </button>
              )}
            </>
          )}
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 bg-[#1A0B04] text-white px-4 py-2 rounded-xl font-sans text-sm font-semibold hover:bg-[#B86B1A] transition-colors"
          >
            <Printer size={16} /> Print
          </button>
        </div>
      </div>

      {saveError && (
        <div className="print:hidden mx-6 mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-xl font-sans text-sm">
          {saveError}
        </div>
      )}

      <div className="max-w-4xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Invoice document ── */}
        <div
          className="lg:col-span-2 bg-white rounded-2xl border border-[#CFC0A0] shadow-sm print:shadow-none print:border-none print:rounded-none"
          id="invoice-doc"
        >
          <div className="p-8">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="font-display text-[#1A0B04] font-medium" style={{ fontSize: "1.8rem" }}>{settings.cafeName}</h1>
                {settings.tagline && <p className="font-sans text-xs italic text-[#9A7A56] mt-0.5">{settings.tagline}</p>}
                {settings.address && <p className="font-sans text-xs text-[#5A3A1E] mt-2 whitespace-pre-line max-w-xs">{settings.address}</p>}
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

            {/* Table / waiter / session */}
            <div className="flex gap-6 mb-6 pb-4 border-b border-[#EDE1C8] flex-wrap">
              <div>
                <p className="font-sans text-xs uppercase tracking-widest text-[#9A7A56]">Table</p>
                <p className="font-sans text-sm font-semibold text-[#1A0B04] mt-0.5">{tableLabel}</p>
              </div>
              {(selectedWaiterName || initialWaiterName) && (
                <div>
                  <p className="font-sans text-xs uppercase tracking-widest text-[#9A7A56]">Served by</p>
                  <p className="font-sans text-sm font-semibold text-[#1A0B04] mt-0.5">{selectedWaiterName || initialWaiterName}</p>
                </div>
              )}
              {sessionStart && (
                <div>
                  <p className="font-sans text-xs uppercase tracking-widest text-[#9A7A56]">Seated at</p>
                  <p className="font-sans text-sm font-semibold text-[#1A0B04] mt-0.5">
                    {new Date(sessionStart).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              )}
              {sessionStart && sessionEnd && settled && (
                <div>
                  <p className="font-sans text-xs uppercase tracking-widest text-[#9A7A56]">Duration</p>
                  <p className="font-sans text-sm font-semibold text-[#1A0B04] mt-0.5">
                    {formatDuration(sessionStart, sessionEnd)}
                  </p>
                </div>
              )}
            </div>

            {/* Items table */}
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
                    key={item.tempId}
                    className={cn(
                      "grid grid-cols-12 gap-2 py-2.5 border-b border-[#EDE1C8] items-center",
                      !item.selected && "opacity-40 print:hidden"
                    )}
                  >
                    <div className="col-span-5 flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={item.selected}
                        onChange={() => toggleItem(item.tempId)}
                        className="print:hidden accent-[#B86B1A] shrink-0"
                        disabled={settled}
                      />
                      <div className="min-w-0">
                        <span className="font-sans text-sm text-[#1A0B04]">{item.name}</span>
                        {item.orderTime && (
                          <p className="font-sans text-[10px] text-[#9A7A56]">
                            {new Date(item.orderTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        )}
                      </div>
                    </div>
                    <span className="col-span-2 font-sans text-sm text-[#5A3A1E] text-center">{item.quantity}</span>
                    <span className="col-span-2 font-sans text-sm text-[#9A7A56] text-right">{formatPrice(item.price)}</span>
                    <div className="col-span-3 flex items-center justify-end gap-1">
                      <span className="font-sans text-sm text-[#1A0B04] font-medium">{formatPrice(item.price * item.quantity)}</span>
                      {!settled && !item.orderItemId && (
                        <button onClick={() => removeItem(item.tempId)} className="print:hidden text-red-400 hover:text-red-600 ml-1">
                          <Trash2 size={11} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Add item buttons */}
              {!settled && (
                <div className="print:hidden mt-3 space-y-2">
                  {showAddItem ? (
                    <div className="flex gap-2 items-end flex-wrap">
                      <div className="flex-1 min-w-32">
                        <label className="font-sans text-[10px] text-[#9A7A56] uppercase tracking-wide">Item name</label>
                        <input
                          value={newItem.name}
                          onChange={(e) => setNewItem((p) => ({ ...p, name: e.target.value }))}
                          placeholder="e.g. Service charge"
                          className="w-full mt-1 border border-[#CFC0A0] rounded-lg px-2 py-1.5 font-sans text-sm focus:outline-none focus:border-[#B86B1A]"
                        />
                      </div>
                      <div className="w-14">
                        <label className="font-sans text-[10px] text-[#9A7A56] uppercase tracking-wide">Qty</label>
                        <input
                          type="number" min={1} value={newItem.qty}
                          onChange={(e) => setNewItem((p) => ({ ...p, qty: e.target.value }))}
                          className="w-full mt-1 border border-[#CFC0A0] rounded-lg px-2 py-1.5 font-sans text-sm focus:outline-none focus:border-[#B86B1A]"
                        />
                      </div>
                      <div className="w-24">
                        <label className="font-sans text-[10px] text-[#9A7A56] uppercase tracking-wide">Price (₹)</label>
                        <input
                          type="number" min={0} step={0.5} value={newItem.price}
                          onChange={(e) => setNewItem((p) => ({ ...p, price: e.target.value }))}
                          placeholder="0.00"
                          className="w-full mt-1 border border-[#CFC0A0] rounded-lg px-2 py-1.5 font-sans text-sm focus:outline-none focus:border-[#B86B1A]"
                        />
                      </div>
                      <button onClick={addManualItem} className="bg-[#1A0B04] text-white px-3 py-1.5 rounded-lg font-sans text-xs font-semibold hover:bg-[#B86B1A]">Add</button>
                      <button onClick={() => setShowAddItem(false)} className="text-[#9A7A56] hover:text-[#1A0B04] font-sans text-xs">Cancel</button>
                    </div>
                  ) : (
                    <div className="flex gap-3">
                      <button
                        onClick={openPicker}
                        className="flex items-center gap-1 font-sans text-xs text-[#B86B1A] hover:text-[#9A5912] transition-colors font-semibold"
                      >
                        <ShoppingBag size={12} /> Add from menu
                      </button>
                      <span className="text-[#CFC0A0] font-sans text-xs self-center">or</span>
                      <button
                        onClick={() => setShowAddItem(true)}
                        className="flex items-center gap-1 font-sans text-xs text-[#9A7A56] hover:text-[#1A0B04] transition-colors"
                      >
                        <Plus size={12} /> Add custom item
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Totals */}
            <div className="space-y-1.5 ml-auto max-w-xs">
              <div className="flex justify-between">
                <span className="font-sans text-sm text-[#9A7A56]">Subtotal</span>
                <span className="font-sans text-sm text-[#1A0B04]">{formatPrice(subtotal)}</span>
              </div>
              {discountPaise > 0 && (
                <div className="flex justify-between">
                  <span className="font-sans text-sm text-[#9A7A56]">Discount</span>
                  <span className="font-sans text-sm text-green-700">−{formatPrice(discountPaise)}</span>
                </div>
              )}
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
              {payments.length > 0 && (
                <>
                  <div className="pt-2 border-t border-[#EDE1C8] space-y-1">
                    {payments.map((p) => (
                      <div key={p.id} className="flex justify-between">
                        <span className="font-sans text-xs text-[#9A7A56]">Paid — {methodLabel[p.method]}{p.note ? ` (${p.note})` : ""}</span>
                        <span className="font-sans text-xs text-green-700">−{formatPrice(p.amount)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between pt-2 border-t border-[#CFC0A0]">
                    <span className="font-sans text-sm font-semibold text-[#1A0B04]">Balance</span>
                    <span className={cn("font-display italic", balance <= 0 ? "text-green-600" : "text-red-600")} style={{ fontSize: "1.1rem" }}>
                      {balance <= 0 ? "Settled ✓" : formatPrice(balance)}
                    </span>
                  </div>
                </>
              )}
            </div>

            {notes && <p className="mt-4 font-sans text-xs text-[#9A7A56] italic">{notes}</p>}

            <div className="mt-8 pt-6 border-t border-[#EDE1C8] text-center">
              <p className="font-display italic text-[#B86B1A]" style={{ fontSize: "1.1rem" }}>Thank you for visiting!</p>
              {settings.tagline && <p className="font-sans text-xs text-[#9A7A56] mt-1">{settings.tagline}</p>}
            </div>
          </div>
        </div>

        {/* ── Side panel ── */}
        <div className="print:hidden space-y-4">

          {/* Waiter assignment (admin only) */}
          {role === "admin" && !settled && (
            <div className="bg-white rounded-2xl border border-[#CFC0A0] p-5">
              <h3 className="font-sans text-xs font-semibold uppercase tracking-widest text-[#9A7A56] mb-3 flex items-center gap-1.5">
                <User size={12} /> Assign Waiter
              </h3>
              <select
                value={selectedWaiterId}
                onChange={(e) => handleWaiterChange(e.target.value)}
                className="w-full border border-[#CFC0A0] rounded-xl px-3 py-2 font-sans text-sm text-[#1A0B04] bg-white focus:outline-none focus:border-[#B86B1A]"
              >
                <option value="">— None —</option>
                {waiters.map((w) => (
                  <option key={w.id} value={w.id}>{w.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* Adjustments */}
          {!settled && (
            <div className="bg-white rounded-2xl border border-[#CFC0A0] p-5 space-y-3">
              <h3 className="font-sans text-xs font-semibold uppercase tracking-widest text-[#9A7A56]">
                <Edit2 size={12} className="inline mr-1" /> Adjustments
              </h3>
              <div>
                <label className="font-sans text-xs text-[#5A3A1E] uppercase tracking-wider">Discount (₹)</label>
                <input
                  type="number" min={0} step={0.5} value={discount}
                  onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                  className="mt-1.5 w-full border border-[#CFC0A0] rounded-xl px-3 py-2 font-sans text-sm focus:outline-none focus:border-[#B86B1A]"
                />
              </div>
              <div>
                <label className="font-sans text-xs text-[#5A3A1E] uppercase tracking-wider">Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  className="mt-1.5 w-full border border-[#CFC0A0] rounded-xl px-3 py-2 font-sans text-sm focus:outline-none focus:border-[#B86B1A] resize-none"
                  placeholder="e.g. complimentary dessert"
                />
              </div>
            </div>
          )}

          {/* Payments */}
          {!settled && (
            <div className="bg-white rounded-2xl border border-[#CFC0A0] p-5">
              <h3 className="font-sans text-xs font-semibold uppercase tracking-widest text-[#9A7A56] mb-4">Record Payment</h3>
              <div className="space-y-3">
                <div className="flex gap-2">
                  {(["CASH", "CARD", "UPI"] as PaymentMethod[]).map((m) => (
                    <button
                      key={m}
                      onClick={() => setPayMethod(m)}
                      className={cn(
                        "flex-1 py-2 rounded-xl font-sans text-xs font-semibold border transition-colors",
                        payMethod === m ? "bg-[#1A0B04] text-white border-[#1A0B04]" : "border-[#CFC0A0] text-[#5A3A1E] hover:bg-[#EDE1C8]"
                      )}
                    >
                      {methodLabel[m]}
                    </button>
                  ))}
                </div>
                <input
                  type="number" value={payAmount} min={0} step={0.5}
                  onChange={(e) => setPayAmount(e.target.value)}
                  placeholder="Amount (₹)"
                  className="w-full border border-[#CFC0A0] rounded-xl px-3 py-2 font-sans text-sm focus:outline-none focus:border-[#B86B1A]"
                />
                <input
                  value={payNote} onChange={(e) => setPayNote(e.target.value)}
                  placeholder="Note (optional)"
                  className="w-full border border-[#CFC0A0] rounded-xl px-3 py-2 font-sans text-sm focus:outline-none focus:border-[#B86B1A]"
                />
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
                    <div key={p.id} className="flex justify-between">
                      <span className="font-sans text-xs text-[#9A7A56]">{methodLabel[p.method]}{p.note ? ` · ${p.note}` : ""}</span>
                      <span className="font-sans text-xs font-semibold text-[#1A0B04]">{formatPrice(p.amount)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between pt-2 border-t border-[#EDE1C8]">
                    <span className="font-sans text-xs font-semibold">Balance</span>
                    <span className={cn("font-sans text-xs font-semibold", balance <= 0 ? "text-green-600" : "text-red-600")}>
                      {balance <= 0 ? "Settled" : formatPrice(balance)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="bg-[#EDE1C8] rounded-2xl p-4">
            <p className="font-sans text-xs text-[#9A7A56]">
              <strong className="text-[#5A3A1E]">Tip:</strong> Use &ldquo;Add from menu&rdquo; to pick items directly from the cafe menu, or &ldquo;Add custom item&rdquo; for one-off charges.
            </p>
          </div>
        </div>
      </div>

      {/* ── Product picker modal ── */}
      {showPicker && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowPicker(false)} />
          <div className="relative bg-[#F4ECD9] rounded-3xl w-full max-w-lg max-h-[80vh] flex flex-col shadow-2xl">
            {/* Picker header */}
            <div className="px-5 py-4 border-b border-[#CFC0A0] flex items-center justify-between shrink-0">
              <h2 className="font-display text-[#1A0B04] font-medium" style={{ fontSize: "1.2rem" }}>Add from Menu</h2>
              <button onClick={() => setShowPicker(false)} className="p-1.5 rounded-xl text-[#9A7A56] hover:bg-[#EDE1C8]">
                <X size={18} />
              </button>
            </div>

            {/* Search */}
            <div className="px-5 py-3 shrink-0">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9A7A56]" />
                <input
                  value={pickerSearch}
                  onChange={(e) => setPickerSearch(e.target.value)}
                  placeholder="Search items…"
                  className="w-full pl-8 pr-8 py-2 border border-[#CFC0A0] rounded-xl font-sans text-sm bg-white text-[#1A0B04] focus:outline-none focus:border-[#B86B1A]"
                  autoFocus
                />
                {pickerSearch && (
                  <button onClick={() => setPickerSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9A7A56]">
                    <X size={13} />
                  </button>
                )}
              </div>
            </div>

            {/* Products list */}
            <div className="overflow-y-auto flex-1 px-5 pb-5">
              {menuLoading ? (
                <p className="font-sans text-sm text-[#9A7A56] text-center py-8">Loading menu…</p>
              ) : filteredProducts.length === 0 ? (
                <p className="font-sans text-sm text-[#9A7A56] text-center py-8">No items found.</p>
              ) : (
                <div className="space-y-2">
                  {filteredProducts.map((product) => {
                    const inInvoice = items.find((i) => i.name === product.name && !i.orderItemId);
                    return (
                      <div
                        key={product.id}
                        className="bg-white rounded-2xl border border-[#CFC0A0] px-4 py-3 flex items-center justify-between gap-3"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-sans text-sm font-semibold text-[#1A0B04]">{product.name}</p>
                          {product.description && (
                            <p className="font-sans text-xs text-[#9A7A56] line-clamp-1 mt-0.5">{product.description}</p>
                          )}
                          <p className="font-display italic text-[#B86B1A] text-sm mt-0.5">{formatPrice(product.price)}</p>
                        </div>
                        <button
                          onClick={() => addProductFromPicker(product)}
                          className={cn(
                            "shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-xl font-sans text-xs font-semibold transition-colors",
                            inInvoice
                              ? "bg-[#B86B1A] text-white hover:bg-[#9A5912]"
                              : "bg-[#1A0B04] text-white hover:bg-[#B86B1A]"
                          )}
                        >
                          <Plus size={11} /> {inInvoice ? `Add (${inInvoice.quantity})` : "Add"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Done button */}
            <div className="px-5 py-4 border-t border-[#CFC0A0] shrink-0">
              <button
                onClick={() => setShowPicker(false)}
                className="w-full bg-[#1A0B04] text-white py-3 rounded-2xl font-sans text-sm font-semibold hover:bg-[#B86B1A] transition-colors"
              >
                Done — {items.filter((i) => i.selected).length} item{items.filter((i) => i.selected).length !== 1 ? "s" : ""} on invoice
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @media print {
          body * { visibility: hidden; }
          #invoice-doc, #invoice-doc * { visibility: visible; }
          #invoice-doc { position: fixed; top: 0; left: 0; width: 100%; padding: 2rem; }
        }
      `}</style>
    </div>
  );
}
