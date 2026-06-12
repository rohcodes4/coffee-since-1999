"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { formatPrice } from "@/lib/format";
import { RefreshCw, Clock, CheckCircle2, ChefHat, Bell, XCircle, Smartphone, UtensilsCrossed, FileText, ExternalLink, PhoneCall, Receipt } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type OrderStatus = "PENDING" | "CONFIRMED" | "PREPARING" | "READY" | "DONE" | "CANCELLED";
type OrderItemStatus = "PENDING" | "CONFIRMED" | "PREPARING" | "READY" | "DELIVERED";
type OrderSource = "CUSTOMER" | "WAITER";

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  status: OrderItemStatus;
  createdAt: string;
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

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; next?: OrderStatus }> = {
  PENDING:    { label: "New",       color: "bg-amber-100 text-amber-800 border-amber-200",    next: "CONFIRMED"  },
  CONFIRMED:  { label: "Confirmed", color: "bg-blue-100 text-blue-800 border-blue-200",       next: "PREPARING"  },
  PREPARING:  { label: "Preparing", color: "bg-purple-100 text-purple-800 border-purple-200", next: "READY"      },
  READY:      { label: "Ready",     color: "bg-green-100 text-green-800 border-green-200",    next: "DONE"       },
  DONE:       { label: "Done",      color: "bg-gray-100 text-gray-600 border-gray-200"                           },
  CANCELLED:  { label: "Cancelled", color: "bg-red-100 text-red-700 border-red-200"                              },
};

const ITEM_STATUS_CONFIG: Record<OrderItemStatus, { label: string; color: string; next?: OrderItemStatus }> = {
  PENDING:   { label: "Pending",   color: "bg-amber-100 text-amber-800",  next: "CONFIRMED" },
  CONFIRMED: { label: "Confirmed", color: "bg-blue-100 text-blue-800",    next: "PREPARING" },
  PREPARING: { label: "Preparing", color: "bg-purple-100 text-purple-800", next: "READY"    },
  READY:     { label: "Ready",     color: "bg-green-100 text-green-800",  next: "DELIVERED" },
  DELIVERED: { label: "Delivered", color: "bg-gray-100 text-gray-500"                       },
};

const NEXT_LABEL: Record<OrderStatus, string> = {
  PENDING:   "Confirm",
  CONFIRMED: "Start Preparing",
  PREPARING: "Mark Ready",
  READY:     "Mark Done",
  DONE:      "",
  CANCELLED: "",
};

const ACTIVE_STATUSES = "PENDING,CONFIRMED,PREPARING,READY";

function playNotificationBeep(audioCtxRef: React.MutableRefObject<AudioContext | null>) {
  try {
    if (!audioCtxRef.current) audioCtxRef.current = new AudioContext();
    const ctx = audioCtxRef.current;
    [880, 1100].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      osc.type = "sine";
      const t = ctx.currentTime + i * 0.18;
      gain.gain.setValueAtTime(0.3, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
      osc.start(t);
      osc.stop(t + 0.35);
    });
  } catch { /* blocked by autoplay policy */ }
}

function playCallWaiterSound(audioCtxRef: React.MutableRefObject<AudioContext | null>) {
  try {
    if (!audioCtxRef.current) audioCtxRef.current = new AudioContext();
    const ctx = audioCtxRef.current;
    [1000, 1200, 1000, 1200].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      osc.type = "sine";
      const t = ctx.currentTime + i * 0.18;
      gain.gain.setValueAtTime(0.45, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
      osc.start(t);
      osc.stop(t + 0.2);
    });
  } catch { /* blocked by autoplay policy */ }
}

function playBillRequestSound(audioCtxRef: React.MutableRefObject<AudioContext | null>) {
  try {
    if (!audioCtxRef.current) audioCtxRef.current = new AudioContext();
    const ctx = audioCtxRef.current;
    [900, 1100, 1300].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      osc.type = "sine";
      const t = ctx.currentTime + i * 0.22;
      gain.gain.setValueAtTime(0.35, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
      osc.start(t);
      osc.stop(t + 0.4);
    });
  } catch { /* blocked by autoplay policy */ }
}

interface InvoiceRequest {
  id: string;
  invoiceNumber: string;
  tableName: string;
  waiterName: string | null;
  status: string;
  createdAt: string;
  items: { price: number; quantity: number }[];
}

interface TableRequest {
  id: string;
  tableId: string;
  tableName: string;
  type: "CALL_WAITER" | "BILL_REQUEST";
  status: "PENDING" | "ATTENDED";
  createdAt: string;
}

export default function DashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [invoiceRequests, setInvoiceRequests] = useState<InvoiceRequest[]>([]);
  const [tableRequests, setTableRequests] = useState<TableRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [newOrderToast, setNewOrderToast] = useState(false);
  const [newInvoiceToast, setNewInvoiceToast] = useState(false);
  const [dashboardMode, setDashboardMode] = useState<"KANBAN" | "ITEM">("KANBAN");
  const knownOrderIds = useRef<Set<string>>(new Set());
  const knownInvoiceIds = useRef<Set<string>>(new Set());
  const knownRequestIds = useRef<Set<string>>(new Set());
  const audioCtxRef = useRef<AudioContext | null>(null);
  const audioReady = useRef(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.ok ? r.json() : null)
      .then((d) => { if (d?.dashboardMode) setDashboardMode(d.dashboardMode); });
  }, []);

  useEffect(() => {
    const init = () => {
      if (!audioReady.current) {
        audioCtxRef.current = new AudioContext();
        audioReady.current = true;
      }
    };
    window.addEventListener("click", init, { once: true });
    return () => window.removeEventListener("click", init);
  }, []);

  const fetchOrders = useCallback(async () => {
    const [ordersRes, invoicesRes, requestsRes] = await Promise.all([
      fetch(`/api/admin/orders?status=${ACTIVE_STATUSES}`),
      fetch("/api/admin/invoices?status=DRAFT"),
      fetch("/api/admin/table-requests?status=PENDING"),
    ]);

    if (ordersRes.ok) {
      const data: Order[] = await ordersRes.json();
      const newPending = data.filter((o) => o.status === "PENDING" && !knownOrderIds.current.has(o.id));
      if (newPending.length > 0 && knownOrderIds.current.size > 0) {
        playNotificationBeep(audioCtxRef);
        setNewOrderToast(true);
        setTimeout(() => setNewOrderToast(false), 4000);
      }
      data.forEach((o) => knownOrderIds.current.add(o.id));
      setOrders(data);
      setLastUpdated(new Date());
    }

    if (invoicesRes.ok) {
      const data: InvoiceRequest[] = await invoicesRes.json();
      const newRequests = data.filter((inv) => !knownInvoiceIds.current.has(inv.id));
      if (newRequests.length > 0 && knownInvoiceIds.current.size > 0) {
        playNotificationBeep(audioCtxRef);
        setNewInvoiceToast(true);
        setTimeout(() => setNewInvoiceToast(false), 4000);
      }
      data.forEach((inv) => knownInvoiceIds.current.add(inv.id));
      setInvoiceRequests(data);
    }

    if (requestsRes.ok) {
      const data: TableRequest[] = await requestsRes.json();
      const newOnes = data.filter((r) => !knownRequestIds.current.has(r.id));
      if (newOnes.length > 0 && knownRequestIds.current.size > 0) {
        const hasCall = newOnes.some((r) => r.type === "CALL_WAITER");
        const hasBill = newOnes.some((r) => r.type === "BILL_REQUEST");
        if (hasCall) playCallWaiterSound(audioCtxRef);
        else if (hasBill) playBillRequestSound(audioCtxRef);
      }
      data.forEach((r) => knownRequestIds.current.add(r.id));
      setTableRequests(data);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  async function attendRequest(id: string) {
    await fetch(`/api/admin/table-requests/${id}/attend`, { method: "POST" });
    setTableRequests((prev) => prev.filter((r) => r.id !== id));
  }

  async function updateOrderStatus(orderId: string, status: OrderStatus) {
    await fetch(`/api/admin/orders/${orderId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchOrders();
  }

  async function updateItemStatus(itemId: string, status: OrderItemStatus) {
    await fetch(`/api/admin/order-items/${itemId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchOrders();
  }

  const grouped = orders.reduce<Record<OrderStatus, Order[]>>((acc, o) => {
    if (!acc[o.status]) acc[o.status] = [];
    acc[o.status].push(o);
    return acc;
  }, {} as Record<OrderStatus, Order[]>);

  const statusOrder: OrderStatus[] = ["PENDING", "CONFIRMED", "PREPARING", "READY"];

  return (
    <div className="p-6 lg:p-8" onClick={() => {
      if (!audioReady.current && typeof AudioContext !== "undefined") {
        audioCtxRef.current = new AudioContext();
        audioReady.current = true;
      }
    }}>
      {newOrderToast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 bg-[#1A0B04] text-white px-4 py-3 rounded-2xl shadow-lg font-sans text-sm">
          <Bell size={16} className="text-[#B86B1A]" /> New order received!
        </div>
      )}
      {newInvoiceToast && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 bg-[#B86B1A] text-white px-4 py-3 rounded-2xl shadow-lg font-sans text-sm">
          <FileText size={16} /> Invoice requested!
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-[#1A0B04] font-medium" style={{ fontSize: "2rem" }}>Live Orders</h1>
          <p className="font-sans text-sm text-[#9A7A56] mt-1">
            {lastUpdated.toLocaleTimeString()} · auto-refreshes every 30s
          </p>
        </div>
        <button
          onClick={fetchOrders}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#CFC0A0] font-sans text-sm text-[#5A3A1E] hover:bg-[#EDE1C8] transition-colors"
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Summary chips */}
      <div className="flex gap-3 mb-6 flex-wrap">
        {statusOrder.map((s) => (
          <div key={s} className={cn("flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-sans font-semibold", STATUS_CONFIG[s].color)}>
            {s === "PENDING" && <Bell size={12} />}
            {s === "CONFIRMED" && <CheckCircle2 size={12} />}
            {s === "PREPARING" && <ChefHat size={12} />}
            {s === "READY" && <Clock size={12} />}
            {STATUS_CONFIG[s].label}: {grouped[s]?.length ?? 0}
          </div>
        ))}
      </div>

      {/* Table Requests — persistent until attended */}
      {tableRequests.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <PhoneCall size={15} className="text-red-500 animate-pulse" />
            <h2 className="font-sans text-xs font-semibold uppercase tracking-widest text-red-500">
              Customer Requests ({tableRequests.length})
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {tableRequests.map((req) => (
              <div
                key={req.id}
                className={cn(
                  "rounded-2xl border-2 p-4 flex items-start justify-between gap-3",
                  req.type === "CALL_WAITER"
                    ? "bg-red-50 border-red-300"
                    : "bg-amber-50 border-amber-300"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "w-9 h-9 rounded-full flex items-center justify-center shrink-0",
                    req.type === "CALL_WAITER" ? "bg-red-100" : "bg-amber-100"
                  )}>
                    {req.type === "CALL_WAITER"
                      ? <Bell size={16} className="text-red-600" />
                      : <Receipt size={16} className="text-amber-600" />}
                  </div>
                  <div>
                    <p className="font-sans text-sm font-semibold text-[#1A0B04]">{req.tableName}</p>
                    <p className={cn(
                      "font-sans text-xs font-semibold",
                      req.type === "CALL_WAITER" ? "text-red-600" : "text-amber-600"
                    )}>
                      {req.type === "CALL_WAITER" ? "Calling waiter" : "Requesting bill"}
                    </p>
                    <p className="font-sans text-[10px] text-[#9A7A56] mt-0.5">
                      {new Date(req.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => attendRequest(req.id)}
                  className="shrink-0 px-3 py-1.5 bg-[#1A0B04] text-white rounded-xl font-sans text-xs font-semibold hover:bg-[#B86B1A] transition-colors"
                >
                  Attended
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Invoice Requests */}
      {invoiceRequests.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <FileText size={15} className="text-[#B86B1A]" />
            <h2 className="font-sans text-xs font-semibold uppercase tracking-widest text-[#B86B1A]">
              Invoice Requests ({invoiceRequests.length})
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {invoiceRequests.map((inv) => {
              const total = inv.items.reduce((s, i) => s + i.price * i.quantity, 0);
              return (
                <div key={inv.id} className="bg-white border-2 border-[#B86B1A]/30 rounded-2xl p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-mono text-xs font-semibold text-[#1A0B04]">{inv.invoiceNumber}</p>
                      <p className="font-sans text-sm font-semibold text-[#1A0B04] mt-0.5">{inv.tableName || "Manual"}</p>
                      {inv.waiterName && (
                        <p className="font-sans text-xs text-[#9A7A56]">Requested by {inv.waiterName}</p>
                      )}
                    </div>
                    <p className="font-display italic text-[#B86B1A]" style={{ fontSize: "1rem" }}>{formatPrice(total)}</p>
                  </div>
                  <p className="font-sans text-[10px] text-[#9A7A56] mb-3">
                    {new Date(inv.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                  <Link
                    href={`/admin/invoices/${inv.id}`}
                    className="flex items-center justify-center gap-1.5 w-full py-2 bg-[#B86B1A] text-white rounded-xl font-sans text-xs font-semibold hover:bg-[#9A5912] transition-colors"
                  >
                    <ExternalLink size={11} /> Open &amp; Print
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {loading ? (
        <p className="font-sans text-sm text-[#9A7A56]">Loading orders…</p>
      ) : orders.length === 0 ? (
        <div className="text-center py-24">
          <CheckCircle2 size={40} className="text-[#CFC0A0] mx-auto mb-3" />
          <p className="font-sans text-[#9A7A56]">No active orders right now.</p>
        </div>
      ) : dashboardMode === "KANBAN" ? (
        <KanbanView
          grouped={grouped}
          statusOrder={statusOrder}
          onAdvance={updateOrderStatus}
          onItemStatus={updateItemStatus}
          onCancel={(id) => updateOrderStatus(id, "CANCELLED")}
        />
      ) : (
        <ItemView orders={orders} onItemStatus={updateItemStatus} onOrderStatus={updateOrderStatus} />
      )}
    </div>
  );
}

// ── Kanban view ──────────────────────────────────────────────────

function KanbanView({
  grouped, statusOrder, onAdvance, onItemStatus, onCancel,
}: {
  grouped: Record<OrderStatus, Order[]>;
  statusOrder: OrderStatus[];
  onAdvance: (id: string, s: OrderStatus) => void;
  onItemStatus: (id: string, s: OrderItemStatus) => void;
  onCancel: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
      {statusOrder.map((status) => (
        <div key={status}>
          <h2 className="font-sans text-xs font-semibold uppercase tracking-widest text-[#9A7A56] mb-3">
            {STATUS_CONFIG[status].label} ({grouped[status]?.length ?? 0})
          </h2>
          <div className="space-y-3">
            {(grouped[status] ?? []).map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onAdvance={STATUS_CONFIG[order.status].next ? () => onAdvance(order.id, STATUS_CONFIG[order.status].next!) : undefined}
                onCancel={() => onCancel(order.id)}
                onItemStatus={onItemStatus}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Item view ────────────────────────────────────────────────────

function ItemView({
  orders, onItemStatus, onOrderStatus,
}: {
  orders: Order[];
  onItemStatus: (id: string, s: OrderItemStatus) => void;
  onOrderStatus: (id: string, s: OrderStatus) => void;
}) {
  // Flatten all items, group by item status
  type FlatItem = { item: OrderItem; order: Order };
  const allItems: FlatItem[] = orders.flatMap((o) => o.items.map((item) => ({ item, order: o })));

  const byStatus: Record<OrderItemStatus, FlatItem[]> = {
    PENDING: [], CONFIRMED: [], PREPARING: [], READY: [], DELIVERED: [],
  };
  allItems.forEach((fi) => byStatus[fi.item.status].push(fi));

  const activeStatuses: OrderItemStatus[] = ["PENDING", "CONFIRMED", "PREPARING", "READY"];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
      {activeStatuses.map((status) => (
        <div key={status}>
          <h2 className="font-sans text-xs font-semibold uppercase tracking-widest text-[#9A7A56] mb-3">
            {ITEM_STATUS_CONFIG[status].label} ({byStatus[status].length})
          </h2>
          <div className="space-y-2">
            {byStatus[status].map(({ item, order }) => (
              <div key={item.id} className="bg-white rounded-xl border border-[#CFC0A0] p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-display text-[#1A0B04] font-medium text-sm">{order.table.label}</span>
                  <span className="font-sans text-[10px] text-[#9A7A56]">
                    {new Date(item.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                <p className="font-sans text-sm text-[#1A0B04] font-semibold">
                  {item.quantity}× {item.name}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <span className={cn("text-[10px] font-sans font-semibold px-2 py-0.5 rounded-full", ITEM_STATUS_CONFIG[item.status].color)}>
                    {ITEM_STATUS_CONFIG[item.status].label}
                  </span>
                  {ITEM_STATUS_CONFIG[item.status].next && (
                    <button
                      onClick={() => onItemStatus(item.id, ITEM_STATUS_CONFIG[item.status].next!)}
                      className="font-sans text-[10px] font-semibold text-[#B86B1A] bg-[#B86B1A]/10 px-2 py-1 rounded-lg hover:bg-[#B86B1A]/20 transition-colors"
                    >
                      → {ITEM_STATUS_CONFIG[ITEM_STATUS_CONFIG[item.status].next!].label}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Order card (kanban) ──────────────────────────────────────────

function OrderCard({
  order, onAdvance, onCancel, onItemStatus,
}: {
  order: Order;
  onAdvance?: () => void;
  onCancel?: () => void;
  onItemStatus: (id: string, s: OrderItemStatus) => void;
}) {
  const time = new Date(order.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const date = new Date(order.createdAt).toLocaleDateString([], { day: "numeric", month: "short" });
  const cfg = STATUS_CONFIG[order.status];

  return (
    <div className="bg-white rounded-2xl border border-[#CFC0A0] overflow-hidden shadow-sm">
      <div className="px-4 py-3 border-b border-[#EDE1C8]">
        <div className="flex items-center justify-between mb-1">
          <span className="font-display text-[#1A0B04] font-medium" style={{ fontSize: "1.1rem" }}>{order.table.label}</span>
          <span className={cn("px-2 py-0.5 rounded-full border text-xs font-sans font-semibold", cfg.color)}>{cfg.label}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-sans text-xs text-[#9A7A56]">{date} · {time}</span>
          <span className={cn(
            "flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-sans font-semibold",
            order.source === "WAITER" ? "bg-[#1A0B04]/10 text-[#1A0B04]" : "bg-[#B86B1A]/10 text-[#B86B1A]"
          )}>
            {order.source === "WAITER" ? <><UtensilsCrossed size={10} /> {order.waiter?.name ?? "Waiter"}</> : <><Smartphone size={10} /> QR</>}
          </span>
        </div>
      </div>

      <div className="px-4 py-3 space-y-2">
        {order.items.map((item) => (
          <div key={item.id} className="flex items-center justify-between gap-2">
            <div className="flex-1 min-w-0">
              <span className="font-sans text-sm text-[#1A0B04]">{item.quantity}× {item.name}</span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <span className={cn("text-[10px] font-sans px-1.5 py-0.5 rounded-full font-semibold", ITEM_STATUS_CONFIG[item.status].color)}>
                {item.status === "PENDING" ? "—" : ITEM_STATUS_CONFIG[item.status].label}
              </span>
              {ITEM_STATUS_CONFIG[item.status].next && (
                <button
                  onClick={() => onItemStatus(item.id, ITEM_STATUS_CONFIG[item.status].next!)}
                  className="text-[10px] font-sans font-semibold text-[#B86B1A] hover:underline"
                >
                  ↑
                </button>
              )}
            </div>
          </div>
        ))}
        {order.notes && (
          <p className="font-sans text-xs text-[#B86B1A] bg-[#B86B1A]/10 px-2 py-1.5 rounded-lg">Note: {order.notes}</p>
        )}
      </div>

      <div className="px-4 py-3 border-t border-[#EDE1C8] flex items-center justify-between">
        <span className="font-sans text-xs text-[#9A7A56]">
          {order.source === "CUSTOMER" && order.phone ? order.phone : order.waiter?.name ?? ""}
        </span>
        <span className="font-display italic text-[#B86B1A] text-sm">{formatPrice(order.total)}</span>
      </div>

      {(onAdvance || onCancel) && (
        <div className="px-4 pb-3 flex gap-2">
          {onAdvance && (
            <button onClick={onAdvance} className="flex-1 bg-[#1A0B04] text-white font-sans text-xs font-semibold py-2 rounded-xl hover:bg-[#B86B1A] transition-colors">
              {NEXT_LABEL[order.status]}
            </button>
          )}
          {onCancel && order.status !== "DONE" && (
            <button onClick={onCancel} className="px-3 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 transition-colors">
              <XCircle size={14} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
