"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Waiter {
  id: string;
  name: string;
  active: boolean;
  createdAt: string;
}

export default function WaitersPage() {
  const [waiters, setWaiters] = useState<Waiter[]>([]);
  const [loading, setLoading] = useState(true);
  const [drawer, setDrawer] = useState<"create" | { waiter: Waiter } | null>(null);
  const [name, setName] = useState("");
  const [pin, setPin] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchWaiters = useCallback(async () => {
    const res = await fetch("/api/admin/waiters");
    if (res.ok) setWaiters(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => { fetchWaiters(); }, [fetchWaiters]);

  function openCreate() {
    setName(""); setPin(""); setError("");
    setDrawer("create");
  }

  function openEdit(waiter: Waiter) {
    setName(waiter.name); setPin(""); setError("");
    setDrawer({ waiter });
  }

  async function save() {
    setSaving(true); setError("");
    try {
      if (drawer === "create") {
        const res = await fetch("/api/admin/waiters", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, pin }),
        });
        if (!res.ok) { setError((await res.json()).error); return; }
      } else if (drawer && typeof drawer === "object") {
        const body: Record<string, unknown> = { name };
        if (pin) body.pin = pin;
        const res = await fetch(`/api/admin/waiters/${drawer.waiter.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!res.ok) { setError((await res.json()).error); return; }
      }
      setDrawer(null);
      fetchWaiters();
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(waiter: Waiter) {
    await fetch(`/api/admin/waiters/${waiter.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !waiter.active }),
    });
    fetchWaiters();
  }

  async function deleteWaiter(id: string) {
    if (!confirm("Delete this waiter? This cannot be undone.")) return;
    await fetch(`/api/admin/waiters/${id}`, { method: "DELETE" });
    fetchWaiters();
  }

  return (
    <div className="p-8 max-w-2xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-[#1A0B04] font-medium" style={{ fontSize: "2rem" }}>Waiters</h1>
          <p className="font-sans text-sm text-[#9A7A56] mt-1">Manage staff who can take orders on devices.</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-[#1A0B04] text-white px-4 py-2.5 rounded-xl font-sans text-sm font-semibold hover:bg-[#B86B1A] transition-colors"
        >
          <Plus size={16} /> Add Waiter
        </button>
      </div>

      {loading ? (
        <p className="font-sans text-sm text-[#9A7A56]">Loading…</p>
      ) : waiters.length === 0 ? (
        <p className="font-sans text-sm text-[#9A7A56] text-center py-16">No waiters yet. Add one to get started.</p>
      ) : (
        <div className="space-y-3">
          {waiters.map((w) => (
            <div key={w.id} className={cn(
              "bg-white rounded-2xl border border-[#CFC0A0] px-5 py-4 flex items-center justify-between",
              !w.active && "opacity-60"
            )}>
              <div>
                <p className="font-display text-[#1A0B04] font-medium" style={{ fontSize: "1.1rem" }}>{w.name}</p>
                <p className="font-sans text-xs text-[#9A7A56] mt-0.5">
                  Added {new Date(w.createdAt).toLocaleDateString()} · {w.active ? "Active" : "Inactive"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleActive(w)}
                  className="p-2 rounded-lg hover:bg-[#EDE1C8] transition-colors text-[#9A7A56]"
                  title={w.active ? "Deactivate" : "Activate"}
                >
                  {w.active ? <ToggleRight size={20} className="text-[#B86B1A]" /> : <ToggleLeft size={20} />}
                </button>
                <button
                  onClick={() => openEdit(w)}
                  className="p-2 rounded-lg hover:bg-[#EDE1C8] transition-colors text-[#9A7A56]"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => deleteWaiter(w.id)}
                  className="p-2 rounded-lg hover:bg-red-50 transition-colors text-red-400"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Drawer */}
      {drawer && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/40" onClick={() => setDrawer(null)} />
          <div className="w-96 bg-white h-full shadow-2xl flex flex-col p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-display text-[#1A0B04] font-medium" style={{ fontSize: "1.5rem" }}>
                {drawer === "create" ? "New Waiter" : "Edit Waiter"}
              </h2>
              <button onClick={() => setDrawer(null)} className="p-2 rounded-lg hover:bg-[#EDE1C8] transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 flex-1">
              <div>
                <label className="font-sans text-xs font-semibold text-[#5A3A1E] uppercase tracking-wider">Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ravi"
                  className="mt-1.5 w-full border border-[#CFC0A0] rounded-xl px-3 py-2.5 font-sans text-sm focus:outline-none focus:border-[#B86B1A]"
                />
              </div>
              <div>
                <label className="font-sans text-xs font-semibold text-[#5A3A1E] uppercase tracking-wider">
                  PIN (4–6 digits){drawer !== "create" && " · leave blank to keep current"}
                </label>
                <input
                  type="password"
                  inputMode="numeric"
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="e.g. 1234"
                  maxLength={6}
                  className="mt-1.5 w-full border border-[#CFC0A0] rounded-xl px-3 py-2.5 font-sans text-sm focus:outline-none focus:border-[#B86B1A]"
                />
              </div>
              {error && <p className="font-sans text-xs text-red-600">{error}</p>}
            </div>

            <button
              onClick={save}
              disabled={saving || !name || (drawer === "create" && pin.length < 4)}
              className="w-full bg-[#1A0B04] text-white font-sans text-sm font-semibold py-3 rounded-xl hover:bg-[#B86B1A] transition-colors disabled:opacity-40"
            >
              {saving ? "Saving…" : drawer === "create" ? "Create Waiter" : "Save Changes"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
