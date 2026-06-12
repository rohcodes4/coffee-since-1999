"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Plus, Minus, ShoppingBag, X, ChevronRight, Loader2, CheckCircle2,
  Coffee, ArrowLeft, Leaf, Search, History, FileText, Clock,
} from "lucide-react";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

interface Category { id: string; name: string; slug: string; }
interface ProductCategory { category: Category; }
interface Product {
  id: string; name: string; description: string | null;
  price: number; imageUrl: string | null;
  signature: boolean; tag: string | null;
  veg: boolean; vegan: boolean;
  categories: ProductCategory[];
}
interface Table { id: string; number: number; label: string; }
interface CartItem { product: Product; qty: number; }

interface HistoryOrderItem {
  id: string; name: string; quantity: number; price: number;
  status: string; createdAt: string;
}
interface HistoryOrder {
  id: string; createdAt: string; status: string;
  waiter?: { name: string } | null;
  items: HistoryOrderItem[];
}

type Tab = "menu" | "history";
type Step = "menu" | "confirmed";

export function WaiterOrderClient({
  table, categories, products,
}: {
  table: Table; categories: Category[]; products: Product[];
}) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("menu");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [step, setStep] = useState<Step>("menu");
  const [cartOpen, setCartOpen] = useState(false);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [orderId, setOrderId] = useState("");

  const [history, setHistory] = useState<HistoryOrder[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cart.reduce((s, i) => s + i.product.price * i.qty, 0);

  const addToCart = useCallback((product: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) return prev.map((i) => i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { product, qty: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === productId);
      if (!existing) return prev;
      if (existing.qty === 1) return prev.filter((i) => i.product.id !== productId);
      return prev.map((i) => i.product.id === productId ? { ...i, qty: i.qty - 1 } : i);
    });
  }, []);

  const getQty = (productId: string) => cart.find((i) => i.product.id === productId)?.qty ?? 0;

  const filtered = products.filter((p) => {
    const matchesCategory = activeCategory === "all" || p.categories.some((c) => c.category.id === activeCategory);
    const q = search.toLowerCase();
    const matchesSearch = !q || p.name.toLowerCase().includes(q) || (p.description ?? "").toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  async function loadHistory() {
    setHistoryLoading(true);
    const today = new Date().toISOString().split("T")[0];
    const res = await fetch(`/api/admin/tables/${table.id}/history?date=${today}`);
    if (res.ok) setHistory(await res.json());
    setHistoryLoading(false);
  }

  useEffect(() => {
    if (tab === "history") loadHistory();
  }, [tab]); // eslint-disable-line react-hooks/exhaustive-deps

  async function placeOrder() {
    setLoading(true); setError("");
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tableId: table.id,
        notes: notes || undefined,
        items: cart.map((i) => ({ productId: i.product.id, quantity: i.qty })),
        source: "WAITER",
      }),
    });
    setLoading(false);
    if (res.ok) {
      const data = await res.json();
      setOrderId(data.id);
      setCartOpen(false);
      setStep("confirmed");
    } else {
      const err = await res.json();
      setError(err.error ?? "Failed to place order. Try again.");
    }
  }

  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-50 text-yellow-700",
    CONFIRMED: "bg-blue-50 text-blue-700",
    PREPARING: "bg-orange-50 text-orange-700",
    READY: "bg-purple-50 text-purple-700",
    DONE: "bg-green-50 text-green-700",
    CANCELLED: "bg-red-50 text-red-600",
    DELIVERED: "bg-green-50 text-green-700",
  };

  if (step === "confirmed") {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-sm w-full text-center">
          <div className="w-20 h-20 bg-[#1A0B04] rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={36} className="text-[#B86B1A]" />
          </div>
          <h1 className="font-display text-[#1A0B04] font-medium mb-2" style={{ fontSize: "2rem" }}>
            Order Sent!
          </h1>
          <p className="font-sans text-[#9A7A56] mb-1">Table: <strong className="text-[#1A0B04]">{table.label}</strong></p>
          <p className="font-sans text-[#9A7A56] mb-6">Order #{orderId.slice(0, 8).toUpperCase()}</p>

          <div className="bg-white rounded-2xl border border-[#CFC0A0] p-5 mb-6 text-left space-y-2">
            {cart.map((item) => (
              <div key={item.product.id} className="flex justify-between">
                <span className="font-sans text-sm text-[#1A0B04]">{item.qty}× {item.product.name}</span>
                <span className="font-sans text-sm text-[#9A7A56]">{formatPrice(item.product.price * item.qty)}</span>
              </div>
            ))}
            <div className="border-t border-[#EDE1C8] pt-2 flex justify-between">
              <span className="font-sans text-sm font-semibold text-[#1A0B04]">Total</span>
              <span className="font-display italic text-[#B86B1A]" style={{ fontSize: "1.1rem" }}>{formatPrice(cartTotal)}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => router.push("/waiter/tables")}
              className="flex-1 border border-[#CFC0A0] text-[#5A3A1E] py-3 rounded-2xl font-sans text-sm font-semibold hover:bg-[#EDE1C8] transition-colors"
            >
              All Tables
            </button>
            <button
              onClick={() => { setCart([]); setNotes(""); setStep("menu"); }}
              className="flex-1 bg-[#1A0B04] text-white py-3 rounded-2xl font-sans text-sm font-semibold hover:bg-[#B86B1A] transition-colors"
            >
              New Order
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-0 flex-1">
      {/* Table label bar */}
      <div className="bg-[#EDE1C8] border-b border-[#CFC0A0] px-5 py-2 flex items-center justify-between">
        <button onClick={() => router.push("/waiter/tables")} className="flex items-center gap-1.5 font-sans text-sm text-[#9A7A56] hover:text-[#1A0B04] transition-colors">
          <ArrowLeft size={14} /> Tables
        </button>
        <span className="font-display text-[#1A0B04] font-medium" style={{ fontSize: "1rem" }}>{table.label}</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push(`/waiter/invoices/new?tableId=${table.id}`)}
            className="flex items-center gap-1 px-2.5 py-1.5 border border-[#CFC0A0] rounded-xl font-sans text-xs text-[#5A3A1E] hover:bg-[#EDE1C8] transition-colors"
          >
            <FileText size={12} /> Invoice
          </button>
          <button
            onClick={() => setCartOpen(true)}
            className="relative flex items-center gap-1.5 bg-[#1A0B04] text-white px-3 py-1.5 rounded-xl font-sans text-sm font-semibold"
          >
            <ShoppingBag size={14} />
            {cartCount > 0 ? formatPrice(cartTotal) : "Cart"}
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#B86B1A] text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Tab bar */}
      <div className="bg-[#F4ECD9] border-b border-[#CFC0A0] px-4 flex gap-4">
        <button
          onClick={() => setTab("menu")}
          className={cn(
            "py-3 font-sans text-sm font-semibold border-b-2 transition-colors",
            tab === "menu"
              ? "border-[#1A0B04] text-[#1A0B04]"
              : "border-transparent text-[#9A7A56] hover:text-[#1A0B04]"
          )}
        >
          <span className="flex items-center gap-1.5"><Coffee size={13} /> Menu</span>
        </button>
        <button
          onClick={() => setTab("history")}
          className={cn(
            "py-3 font-sans text-sm font-semibold border-b-2 transition-colors",
            tab === "history"
              ? "border-[#1A0B04] text-[#1A0B04]"
              : "border-transparent text-[#9A7A56] hover:text-[#1A0B04]"
          )}
        >
          <span className="flex items-center gap-1.5"><History size={13} /> Today&apos;s History</span>
        </button>
      </div>

      {/* ── HISTORY TAB ── */}
      {tab === "history" && (
        <div className="flex-1 overflow-auto px-4 py-4 space-y-4">
          {historyLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 size={24} className="animate-spin text-[#9A7A56]" />
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-16 text-[#9A7A56] font-sans text-sm">No orders for {table.label} today.</div>
          ) : (
            history.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl border border-[#CFC0A0] overflow-hidden">
                <div className="px-4 py-3 flex items-center justify-between border-b border-[#EDE1C8] bg-[#FAF6EE]">
                  <div className="flex items-center gap-2">
                    <Clock size={13} className="text-[#9A7A56]" />
                    <span className="font-sans text-xs text-[#9A7A56]">
                      {new Date(order.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                    {order.waiter && (
                      <span className="font-sans text-xs text-[#5A3A1E]">· {order.waiter.name}</span>
                    )}
                  </div>
                  <span className={cn(
                    "px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide",
                    statusColors[order.status] ?? "bg-gray-100 text-gray-600"
                  )}>
                    {order.status.toLowerCase()}
                  </span>
                </div>
                <div className="px-4 py-3 space-y-2">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-sans text-[#1A0B04]">{item.quantity}× {item.name}</span>
                        <span className={cn(
                          "px-1.5 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-wide",
                          statusColors[item.status] ?? "bg-gray-100 text-gray-600"
                        )}>
                          {item.status.toLowerCase()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-sans text-[10px] text-[#9A7A56]">
                          {new Date(item.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                        <span className="font-sans text-[#9A7A56] text-xs">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ── MENU TAB ── */}
      {tab === "menu" && (
        <>
          {/* Search */}
          <div className="px-4 pt-3 pb-1 bg-[#F4ECD9]">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9A7A56]" />
              <input
                value={search}
                onChange={(e) => { setSearch(e.target.value); setActiveCategory("all"); }}
                placeholder="Search menu…"
                className="w-full pl-8 pr-3 py-2 border border-[#CFC0A0] rounded-xl font-sans text-sm bg-white text-[#1A0B04] focus:outline-none focus:border-[#B86B1A]"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9A7A56]">
                  <X size={13} />
                </button>
              )}
            </div>
          </div>

          {/* Category tabs */}
          {!search && (
            <div className="bg-[#F4ECD9] border-b border-[#CFC0A0] px-4 overflow-x-auto shrink-0">
              <div className="flex gap-1 py-2 w-max">
                <button
                  onClick={() => setActiveCategory("all")}
                  className={cn("px-4 py-1.5 rounded-full font-sans text-sm whitespace-nowrap transition-colors",
                    activeCategory === "all" ? "bg-[#1A0B04] text-white" : "text-[#5A3A1E] hover:bg-[#EDE1C8]")}
                >
                  All
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={cn("px-4 py-1.5 rounded-full font-sans text-sm whitespace-nowrap transition-colors",
                      activeCategory === cat.id ? "bg-[#1A0B04] text-white" : "text-[#5A3A1E] hover:bg-[#EDE1C8]")}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Products grid */}
          <div className="flex-1 overflow-auto px-4 py-4 pb-24">
            {filtered.length === 0 ? (
              <p className="text-center font-sans text-sm text-[#9A7A56] py-12">No items found.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {filtered.map((product) => {
                  const qty = getQty(product.id);
                  return (
                    <div key={product.id} className="bg-white rounded-2xl border border-[#CFC0A0] flex flex-col overflow-hidden">
                      {product.imageUrl ? (
                        <div className="relative w-full h-36 bg-[#EDE1C8]">
                          <Image src={product.imageUrl} alt={product.name} fill className="object-cover" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                        </div>
                      ) : (
                        <div className="w-full h-24 bg-[#EDE1C8] flex items-center justify-center">
                          <Coffee size={24} className="text-[#CFC0A0]" />
                        </div>
                      )}
                      <div className="flex-1 flex flex-col p-4">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <h3 className="font-sans font-semibold text-sm text-[#1A0B04]">{product.name}</h3>
                              {product.vegan
                                ? <Leaf size={11} className="text-emerald-600 shrink-0" />
                                : product.veg
                                ? <Leaf size={11} className="text-green-500 shrink-0" />
                                : null}
                            </div>
                            {product.tag && (
                              <span className="font-sans text-[10px] text-[#B86B1A] bg-[#B86B1A]/10 px-1.5 py-0.5 rounded-full">{product.tag}</span>
                            )}
                          </div>
                          <span className="font-display italic text-[#B86B1A] shrink-0" style={{ fontSize: "0.95rem" }}>
                            {formatPrice(product.price)}
                          </span>
                        </div>
                        {product.description && (
                          <p className="font-sans text-xs text-[#9A7A56] mb-3 leading-relaxed line-clamp-2">
                            {product.description}
                          </p>
                        )}
                        <div className="mt-auto flex justify-end">
                          {qty === 0 ? (
                            <button
                              onClick={() => addToCart(product)}
                              className="flex items-center gap-1 px-3 py-1.5 bg-[#1A0B04] text-white rounded-xl font-sans text-sm font-semibold hover:bg-[#B86B1A] transition-colors"
                            >
                              <Plus size={12} /> Add
                            </button>
                          ) : (
                            <div className="flex items-center gap-2">
                              <button onClick={() => removeFromCart(product.id)} className="w-7 h-7 rounded-full border border-[#CFC0A0] flex items-center justify-center text-[#5A3A1E] hover:bg-[#EDE1C8]">
                                <Minus size={11} />
                              </button>
                              <span className="font-sans font-semibold text-sm text-[#1A0B04] w-4 text-center">{qty}</span>
                              <button onClick={() => addToCart(product)} className="w-7 h-7 rounded-full bg-[#1A0B04] flex items-center justify-center text-white hover:bg-[#B86B1A]">
                                <Plus size={11} />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Bottom CTA */}
          {cartCount > 0 && (
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#F4ECD9] border-t border-[#CFC0A0]">
              <button
                onClick={() => setCartOpen(true)}
                className="w-full flex items-center justify-between bg-[#1A0B04] text-white px-5 py-3.5 rounded-2xl font-sans font-semibold"
              >
                <span>{cartCount} item{cartCount > 1 ? "s" : ""}</span>
                <span className="flex items-center gap-2">View Cart <ChevronRight size={15} /></span>
                <span>{formatPrice(cartTotal)}</span>
              </button>
            </div>
          )}
        </>
      )}

      {/* Cart drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex flex-col">
          <div className="flex-1 bg-black/50" onClick={() => setCartOpen(false)} />
          <div className="bg-[#F4ECD9] rounded-t-3xl max-h-[85vh] overflow-y-auto">
            <div className="px-6 py-5 flex items-center justify-between border-b border-[#CFC0A0]">
              <h2 className="font-display text-[#1A0B04] font-medium" style={{ fontSize: "1.5rem" }}>Order — {table.label}</h2>
              <button onClick={() => setCartOpen(false)} className="p-2 rounded-xl hover:bg-[#EDE1C8] text-[#9A7A56]"><X size={18} /></button>
            </div>

            <div className="px-6 py-4 space-y-3">
              {cart.map((item) => (
                <div key={item.product.id} className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <p className="font-sans text-sm font-medium text-[#1A0B04]">{item.product.name}</p>
                    <p className="font-sans text-xs text-[#9A7A56]">{formatPrice(item.product.price)} each</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => removeFromCart(item.product.id)} className="w-7 h-7 rounded-full border border-[#CFC0A0] flex items-center justify-center text-[#5A3A1E]"><Minus size={11} /></button>
                    <span className="font-sans font-semibold text-sm text-[#1A0B04] w-5 text-center">{item.qty}</span>
                    <button onClick={() => addToCart(item.product)} className="w-7 h-7 rounded-full bg-[#1A0B04] flex items-center justify-center text-white"><Plus size={11} /></button>
                  </div>
                  <span className="font-display italic text-[#B86B1A] shrink-0" style={{ fontSize: "0.95rem" }}>
                    {formatPrice(item.product.price * item.qty)}
                  </span>
                </div>
              ))}
            </div>

            <div className="px-6 py-4">
              <label className="block font-sans text-xs text-[#9A7A56] mb-1.5 uppercase tracking-widest">Special Instructions (optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full border border-[#CFC0A0] rounded-xl px-3 py-2 font-sans text-sm text-[#1A0B04] bg-white focus:outline-none focus:border-[#B86B1A] resize-none h-16"
                placeholder="Allergies, preferences…"
              />
            </div>

            <div className="px-6 pb-6 border-t border-[#CFC0A0] pt-4">
              <div className="flex justify-between mb-4">
                <span className="font-sans font-semibold text-[#1A0B04]">Total</span>
                <span className="font-display italic text-[#B86B1A]" style={{ fontSize: "1.3rem" }}>{formatPrice(cartTotal)}</span>
              </div>
              {error && <p className="font-sans text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg mb-3">{error}</p>}
              <button
                onClick={placeOrder}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-[#B86B1A] text-white py-4 rounded-2xl font-sans font-semibold disabled:opacity-40 hover:bg-[#9A5912] transition-colors"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                Place Order · {formatPrice(cartTotal)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
