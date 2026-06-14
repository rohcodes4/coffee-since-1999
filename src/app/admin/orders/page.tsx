"use client";

import { useEffect, useState, useCallback } from "react";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp, Smartphone, UtensilsCrossed } from "lucide-react";

type OrderStatus = "PENDING" | "CONFIRMED" | "PREPARING" | "READY" | "DONE" | "CANCELLED";
type OrderSource = "CUSTOMER" | "WAITER";

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  status: OrderStatus;
  source: OrderSource;
  phone: string;
  notes: string | null;
  total: number;
  createdAt: string;
  table: { number: number; label: string };
  items: OrderItem[];
  waiter: { name: string } | null;
}

const STATUS_COLORS: Record<OrderStatus, string> = {
  PENDING:   "bg-amber-100 text-amber-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  PREPARING: "bg-purple-100 text-purple-800",
  READY:     "bg-green-100 text-green-800",
  DONE:      "bg-gray-100 text-gray-600",
  CANCELLED: "bg-red-100 text-red-700",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterDate, setFilterDate] = useState(new Date().toISOString().slice(0, 10));
  const [filterSource, setFilterSource] = useState<string>("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    const params = new URLSearchParams();
    if (filterStatus !== "all") params.set("status", filterStatus);
    if (filterDate) params.set("date", filterDate);
    const res = await fetch(`/api/admin/orders?${params}`);
    if (res.ok) setOrders(await res.json());
    setLoading(false);
  }, [filterStatus, filterDate]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  async function updateStatus(orderId: string, status: OrderStatus) {
    await fetch(`/api/admin/orders/${orderId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchOrders();
  }

  const filtered = filterSource === "all" ? orders : orders.filter((o) => o.source === filterSource);
  const total = filtered.reduce((s, o) => s + o.total, 0);

  return (
    <div className="p-4 sm:p-8 max-w-4xl">
      <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
        <h1 className="font-display text-[#1A0B04] font-medium" style={{ fontSize: "1.6rem" }}>
          Order History
        </h1>
        <div className="font-display italic text-[#B86B1A]" style={{ fontSize: "1.3rem" }}>
          {formatPrice(total)} today
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="border border-[#CFC0A0] rounded-xl px-3 py-2 font-sans text-sm text-[#1A0B04] bg-white focus:outline-none focus:border-[#B86B1A]"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border border-[#CFC0A0] rounded-xl px-3 py-2 font-sans text-sm text-[#1A0B04] bg-white focus:outline-none focus:border-[#B86B1A]"
        >
          <option value="all">All Statuses</option>
          {(["PENDING","CONFIRMED","PREPARING","READY","DONE","CANCELLED"] as OrderStatus[]).map((s) => (
            <option key={s} value={s}>{s[0] + s.slice(1).toLowerCase()}</option>
          ))}
        </select>
        <select
          value={filterSource}
          onChange={(e) => setFilterSource(e.target.value)}
          className="border border-[#CFC0A0] rounded-xl px-3 py-2 font-sans text-sm text-[#1A0B04] bg-white focus:outline-none focus:border-[#B86B1A]"
        >
          <option value="all">All Sources</option>
          <option value="CUSTOMER">QR / Customer</option>
          <option value="WAITER">Waiter</option>
        </select>
        <span className="font-sans text-sm text-[#9A7A56] self-center">{filtered.length} orders</span>
      </div>

      {loading ? (
        <p className="font-sans text-sm text-[#9A7A56]">Loading…</p>
      ) : filtered.length === 0 ? (
        <p className="font-sans text-sm text-[#9A7A56] text-center py-12">No orders found.</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl border border-[#CFC0A0] overflow-hidden">
              <button
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-[#F4ECD9]/50 transition-colors"
                onClick={() => setExpanded(expanded === order.id ? null : order.id)}
              >
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-display text-[#1A0B04] font-medium" style={{ fontSize: "1.1rem" }}>
                    {order.table.label}
                  </span>
                  <span className={cn("font-sans text-xs px-2 py-0.5 rounded-full font-semibold", STATUS_COLORS[order.status])}>
                    {order.status[0] + order.status.slice(1).toLowerCase()}
                  </span>
                  <span className={cn(
                    "flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-sans font-semibold",
                    order.source === "WAITER" ? "bg-[#1A0B04]/10 text-[#1A0B04]" : "bg-[#B86B1A]/10 text-[#B86B1A]"
                  )}>
                    {order.source === "WAITER"
                      ? <><UtensilsCrossed size={10} /> {order.waiter?.name ?? "Waiter"}</>
                      : <><Smartphone size={10} /> QR</>}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-sans text-xs text-[#9A7A56] hidden sm:block">
                    {new Date(order.createdAt).toLocaleString([], { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </span>
                  <span className="font-display italic text-[#B86B1A]" style={{ fontSize: "1rem" }}>
                    {formatPrice(order.total)}
                  </span>
                  {expanded === order.id ? <ChevronUp size={14} className="text-[#9A7A56]" /> : <ChevronDown size={14} className="text-[#9A7A56]" />}
                </div>
              </button>

              {expanded === order.id && (
                <div className="border-t border-[#EDE1C8] px-5 py-4 bg-[#F4ECD9]/40">
                  <div className="mb-3 space-y-1.5">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between">
                        <span className="font-sans text-sm text-[#1A0B04]">{item.quantity}× {item.name}</span>
                        <span className="font-sans text-sm text-[#9A7A56]">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                  {order.notes && (
                    <p className="font-sans text-xs text-[#B86B1A] bg-[#B86B1A]/10 px-3 py-2 rounded-lg mb-3">
                      Note: {order.notes}
                    </p>
                  )}
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <p className="font-sans text-xs text-[#9A7A56]">
                      {order.source === "CUSTOMER" ? `Phone: ${order.phone} · ` : ""}ID: {order.id.slice(0, 8)}…
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      {(["PENDING","CONFIRMED","PREPARING","READY","DONE","CANCELLED"] as OrderStatus[])
                        .filter((s) => s !== order.status)
                        .map((s) => (
                          <button
                            key={s}
                            onClick={() => updateStatus(order.id, s)}
                            className="font-sans text-xs px-3 py-1.5 rounded-xl border border-[#CFC0A0] text-[#5A3A1E] hover:bg-[#EDE1C8] transition-colors"
                          >
                            → {s[0] + s.slice(1).toLowerCase()}
                          </button>
                        ))}
                    </div>
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
