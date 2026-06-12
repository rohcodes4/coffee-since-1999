"use client";

import { useEffect, useState } from "react";
import { Save } from "lucide-react";

interface CafeSettings {
  cafeName: string;
  tagline: string;
  address: string;
  phone: string;
  email: string;
  gstNumber: string;
  cgstRate: number;
  sgstRate: number;
  invoicePrefix: string;
  invoiceCounter: number;
  dashboardMode: "KANBAN" | "ITEM";
}

const defaults: CafeSettings = {
  cafeName: "Coffee? Since 1999",
  tagline: "",
  address: "",
  phone: "",
  email: "",
  gstNumber: "",
  cgstRate: 2.5,
  sgstRate: 2.5,
  invoicePrefix: "INV",
  invoiceCounter: 1,
  dashboardMode: "KANBAN",
};

export default function SettingsPage() {
  const [form, setForm] = useState<CafeSettings>(defaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data) => { setForm(data); setLoading(false); });
  }, []);

  function set(key: keyof CafeSettings, value: string | number) {
    setForm((f) => ({ ...f, [key]: value }));
    setSaved(false);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setError("");
    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 3000); }
    else setError((await res.json()).error ?? "Failed to save");
    setSaving(false);
  }

  if (loading) return <div className="p-8"><p className="font-sans text-sm text-[#9A7A56]">Loading…</p></div>;

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="font-display text-[#1A0B04] font-medium" style={{ fontSize: "2rem" }}>Cafe Settings</h1>
        <p className="font-sans text-sm text-[#9A7A56] mt-1">Details that appear on invoices and receipts.</p>
      </div>

      <form onSubmit={save} className="space-y-6">
        {/* Business details */}
        <section className="bg-white rounded-2xl border border-[#CFC0A0] p-6 space-y-4">
          <h2 className="font-sans text-xs font-semibold uppercase tracking-widest text-[#9A7A56]">Business Details</h2>

          <Field label="Cafe Name" value={form.cafeName} onChange={(v) => set("cafeName", v)} required />
          <Field label="Tagline" value={form.tagline} onChange={(v) => set("tagline", v)} placeholder="e.g. Brewing memories since 1999" />
          <Field label="Address" value={form.address} onChange={(v) => set("address", v)} multiline placeholder="Full address including area, city, pincode" />
          <div className="grid grid-cols-2 gap-4">
            <Field label="Phone" value={form.phone} onChange={(v) => set("phone", v)} placeholder="+91 98765 43210" />
            <Field label="Email" value={form.email} onChange={(v) => set("email", v)} placeholder="hello@cafe.in" />
          </div>
        </section>

        {/* GST */}
        <section className="bg-white rounded-2xl border border-[#CFC0A0] p-6 space-y-4">
          <h2 className="font-sans text-xs font-semibold uppercase tracking-widest text-[#9A7A56]">GST / Tax</h2>
          <Field label="GSTIN" value={form.gstNumber} onChange={(v) => set("gstNumber", v)} placeholder="22AAAAA0000A1Z5" />
          <div className="grid grid-cols-2 gap-4">
            <NumberField label="CGST %" value={form.cgstRate} onChange={(v) => set("cgstRate", v)} step={0.5} />
            <NumberField label="SGST %" value={form.sgstRate} onChange={(v) => set("sgstRate", v)} step={0.5} />
          </div>
        </section>

        {/* Dashboard */}
        <section className="bg-white rounded-2xl border border-[#CFC0A0] p-6 space-y-4">
          <h2 className="font-sans text-xs font-semibold uppercase tracking-widest text-[#9A7A56]">Dashboard Mode</h2>
          <div className="flex gap-3">
            {(["KANBAN", "ITEM"] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => set("dashboardMode", mode)}
                className={`flex-1 py-3 px-4 rounded-xl border font-sans text-sm font-semibold transition-colors ${
                  form.dashboardMode === mode
                    ? "bg-[#1A0B04] text-white border-[#1A0B04]"
                    : "border-[#CFC0A0] text-[#5A3A1E] hover:bg-[#EDE1C8]"
                }`}
              >
                {mode === "KANBAN" ? "🗂 Kanban (order-level)" : "📋 Item-level tracking"}
              </button>
            ))}
          </div>
          <p className="font-sans text-xs text-[#9A7A56]">
            Kanban groups orders in columns by status. Item-level shows each dish with its own status toggle — useful when kitchen tracks items individually.
          </p>
        </section>

        {/* Invoice */}
        <section className="bg-white rounded-2xl border border-[#CFC0A0] p-6 space-y-4">
          <h2 className="font-sans text-xs font-semibold uppercase tracking-widest text-[#9A7A56]">Invoice</h2>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Invoice Prefix" value={form.invoicePrefix} onChange={(v) => set("invoicePrefix", v)} placeholder="INV" />
            <div>
              <label className="font-sans text-xs font-semibold text-[#5A3A1E] uppercase tracking-wider">Next Invoice #</label>
              <p className="mt-1.5 font-sans text-sm text-[#1A0B04] border border-[#CFC0A0] rounded-xl px-3 py-2.5 bg-[#F4ECD9]/60">
                {form.invoicePrefix}-{String(form.invoiceCounter).padStart(4, "0")}
              </p>
            </div>
          </div>
        </section>

        {error && <p className="font-sans text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 bg-[#1A0B04] text-white px-6 py-3 rounded-xl font-sans text-sm font-semibold hover:bg-[#B86B1A] transition-colors disabled:opacity-40"
        >
          <Save size={16} />
          {saving ? "Saving…" : saved ? "Saved!" : "Save Settings"}
        </button>
      </form>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, required, multiline }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  multiline?: boolean;
}) {
  const cls = "mt-1.5 w-full border border-[#CFC0A0] rounded-xl px-3 py-2.5 font-sans text-sm focus:outline-none focus:border-[#B86B1A]";
  return (
    <div>
      <label className="font-sans text-xs font-semibold text-[#5A3A1E] uppercase tracking-wider">{label}</label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className={cls + " resize-none"}
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className={cls}
        />
      )}
    </div>
  );
}

function NumberField({ label, value, onChange, step }: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  step?: number;
}) {
  return (
    <div>
      <label className="font-sans text-xs font-semibold text-[#5A3A1E] uppercase tracking-wider">{label}</label>
      <input
        type="number"
        value={value}
        step={step ?? 1}
        min={0}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="mt-1.5 w-full border border-[#CFC0A0] rounded-xl px-3 py-2.5 font-sans text-sm focus:outline-none focus:border-[#B86B1A]"
      />
    </div>
  );
}
