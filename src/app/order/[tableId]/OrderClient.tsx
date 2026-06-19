"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { Plus, Minus, ShoppingBag, X, ChevronRight, Phone, Loader2, CheckCircle2, Leaf, Coffee, ArrowLeft, Search, Bell, Receipt } from "lucide-react";
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

type Step = "menu" | "checkout" | "otp" | "confirmed";

export function OrderClient({
  table, categories, products,
}: {
  table: Table; categories: Category[]; products: Product[];
}) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [step, setStep] = useState<Step>("menu");
  const [cartOpen, setCartOpen] = useState(false);

  // Table request state
  const [callStatus, setCallStatus] = useState<"idle" | "loading" | "sent">("idle");
  const [billStatus, setBillStatus] = useState<"idle" | "loading" | "sent">("idle");
  const callRequestIdRef = useRef<string | null>(null);
  const callPollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (callPollRef.current) clearInterval(callPollRef.current);
    };
  }, []);

  // OTP / checkout state
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [notes, setNotes] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [orderId, setOrderId] = useState("");

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

  async function callWaiter() {
    if (callStatus !== "idle") return;
    setCallStatus("loading");
    const res = await fetch("/api/table-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tableId: table.id, type: "CALL_WAITER" }),
    });
    const data = await res.json();
    callRequestIdRef.current = data.id;
    setCallStatus("sent");

    if (callPollRef.current) clearInterval(callPollRef.current);
    callPollRef.current = setInterval(async () => {
      if (!callRequestIdRef.current) return;
      const statusRes = await fetch(`/api/table-requests/${callRequestIdRef.current}`);
      if (!statusRes.ok) return;
      const statusData = await statusRes.json();
      if (statusData.status === "ATTENDED") {
        setCallStatus("idle");
        callRequestIdRef.current = null;
        if (callPollRef.current) clearInterval(callPollRef.current);
      }
    }, 10000);
  }

  async function requestBill() {
    if (billStatus !== "idle") return;
    setBillStatus("loading");
    await fetch("/api/table-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tableId: table.id, type: "BILL_REQUEST" }),
    });
    setBillStatus("sent");
  }

  async function sendOtp() {
    if (!phone.match(/^\+?[0-9]{10,15}$/)) {
      setError("Enter a valid 10-digit Indian mobile number");
      return;
    }
    setError("");
    setLoading(true);
    const res = await fetch("/api/otp/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    });
    setLoading(false);
    if (res.ok) {
      setOtpSent(true);
      setStep("otp");
    } else {
      setError("Failed to send OTP. Try again.");
    }
  }

  async function verifyAndOrder() {
    if (otp.length !== 6) { setError("Enter the 6-digit OTP"); return; }
    setError("");
    setLoading(true);

    // Verify OTP
    const verifyRes = await fetch("/api/otp/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, code: otp }),
    });
    if (!verifyRes.ok) {
      setLoading(false);
      setError("Invalid or expired OTP. Try again.");
      return;
    }

    // Place order
    const orderRes = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tableId: table.id,
        notes: notes || undefined,
        items: cart.map((i) => ({ productId: i.product.id, quantity: i.qty })),
      }),
    });
    setLoading(false);
    if (orderRes.ok) {
      const data = await orderRes.json();
      setOrderId(data.id);
      setStep("confirmed");
    } else {
      setError("Failed to place order. Please try again.");
    }
  }

  if (step === "confirmed") {
    return (
      <div className="min-h-screen bg-[#F4ECD9] flex items-center justify-center p-6">
        <div className="max-w-sm w-full text-center">
          <div className="w-20 h-20 bg-[#1A0B04] rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={36} className="text-[#B86B1A]" />
          </div>
          <h1 className="font-display text-[#1A0B04] font-medium mb-2" style={{ fontSize: "2.5rem" }}>
            Order Placed!
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

          <div className="bg-[#B86B1A]/10 rounded-2xl px-5 py-4 mb-6">
            <p className="font-sans text-sm text-[#B86B1A] font-semibold mb-1">💰 Cash Payment</p>
            <p className="font-sans text-xs text-[#9A7A56]">Please pay <strong className="text-[#1A0B04]">{formatPrice(cartTotal)}</strong> at the counter when your order is ready.</p>
          </div>

          <p className="font-sans text-xs text-[#9A7A56] mb-6">We'll prepare your order shortly. Sit back and relax.</p>

          <div className="flex gap-3 justify-center">
            <button
              onClick={callWaiter}
              disabled={callStatus === "loading"}
              className={cn(
                "flex items-center gap-2 px-5 py-3 rounded-2xl font-sans text-sm font-semibold transition-colors",
                callStatus === "sent"
                  ? "bg-amber-100 text-amber-700 cursor-default"
                  : "bg-[#1A0B04] text-white hover:bg-[#B86B1A]"
              )}
            >
              {callStatus === "loading" ? <Loader2 size={14} className="animate-spin" /> : <Bell size={14} />}
              {callStatus === "sent" ? "Waiter notified" : "Call Waiter"}
            </button>
            <button
              onClick={requestBill}
              disabled={billStatus === "loading"}
              className={cn(
                "flex items-center gap-2 px-5 py-3 rounded-2xl font-sans text-sm font-semibold transition-colors",
                billStatus === "sent"
                  ? "bg-green-100 text-green-700 cursor-default"
                  : "border-2 border-[#1A0B04] text-[#1A0B04] hover:bg-[#EDE1C8]"
              )}
            >
              {billStatus === "loading" ? <Loader2 size={14} className="animate-spin" /> : <Receipt size={14} />}
              {billStatus === "sent" ? "Bill requested" : "Request Bill"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4ECD9]">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-[#1A0B04] text-white px-5 py-4 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Coffee size={16} className="text-[#B86B1A]" />
            <span className="font-display font-medium" style={{ fontSize: "1.1rem" }}>Coffee? Since 1999</span>
          </div>
          <p className="font-sans text-xs text-white/50 mt-0.5">{table.label}</p>
        </div>
        <button
          onClick={() => setCartOpen(true)}
          className="relative flex items-center gap-2 bg-[#B86B1A] px-4 py-2 rounded-xl font-sans text-sm font-semibold"
        >
          <ShoppingBag size={15} />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 w-5 h-5 bg-white text-[#B86B1A] rounded-full text-[10px] font-bold flex items-center justify-center">
              {cartCount}
            </span>
          )}
          {cartCount === 0 ? "Cart" : formatPrice(cartTotal)}
        </button>
      </header>

      {/* Search bar */}
      <div className="sticky top-[64px] z-20 bg-[#F4ECD9] px-4 pt-3 pb-0 border-b border-[#CFC0A0]">
        <div className="relative mb-3">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9A7A56]" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setActiveCategory("all"); }}
            placeholder="Search menu…"
            className="w-full pl-8 pr-8 py-2 border border-[#CFC0A0] rounded-xl font-sans text-sm bg-white text-[#1A0B04] focus:outline-none focus:border-[#B86B1A]"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9A7A56]">
              <X size={13} />
            </button>
          )}
        </div>

        {/* Category tabs */}
        {!search && (
          <div className="overflow-x-auto">
            <div className="flex gap-1 pb-3 w-max">
              <button
                onClick={() => setActiveCategory("all")}
                className={cn(
                  "px-4 py-1.5 rounded-full font-sans text-sm whitespace-nowrap transition-colors",
                  activeCategory === "all" ? "bg-[#1A0B04] text-white" : "text-[#5A3A1E] hover:bg-[#EDE1C8]"
                )}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={cn(
                    "px-4 py-1.5 rounded-full font-sans text-sm whitespace-nowrap transition-colors",
                    activeCategory === cat.id ? "bg-[#1A0B04] text-white" : "text-[#5A3A1E] hover:bg-[#EDE1C8]"
                  )}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Products */}
      <div className="px-4 py-5 pb-40">
        {filtered.length === 0 ? (
          <p className="text-center font-sans text-sm text-[#9A7A56] py-12">No items found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.map((product) => {
              const qty = getQty(product.id);
              return (
                <div key={product.id} className="bg-white rounded-2xl border border-[#CFC0A0] flex flex-col overflow-hidden">
                  {product.imageUrl ? (
                    <div className="relative w-full h-40 bg-[#EDE1C8]">
                      <Image src={product.imageUrl} alt={product.name} fill className="object-cover" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                    </div>
                  ) : (
                    <div className="w-full h-28 bg-[#EDE1C8] flex items-center justify-center">
                      <Coffee size={26} className="text-[#CFC0A0]" />
                    </div>
                  )}
                  <div className="flex-1 flex flex-col p-4">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-sans font-semibold text-sm text-[#1A0B04] leading-snug">{product.name}</h3>
                          {product.vegan ? <Leaf size={12} className="text-emerald-600 shrink-0" /> : product.veg ? <Leaf size={12} className="text-green-500 shrink-0" /> : null}
                        </div>
                        {product.tag && (
                          <span className="font-sans text-[10px] text-[#B86B1A] bg-[#B86B1A]/10 px-2 py-0.5 rounded-full">
                            {product.tag}
                          </span>
                        )}
                      </div>
                      <span className="font-display italic text-[#B86B1A] shrink-0" style={{ fontSize: "1rem" }}>
                        {formatPrice(product.price)}
                      </span>
                    </div>
                    {product.description && (
                      <p className="font-sans text-xs text-[#9A7A56] leading-relaxed line-clamp-2 mb-3">
                        {product.description}
                      </p>
                    )}
                    <div className="mt-auto flex items-center justify-end">
                      {qty === 0 ? (
                        <button
                          onClick={() => addToCart(product)}
                          className="flex items-center gap-1.5 px-5 py-2.5 bg-[#1A0B04] text-white rounded-xl font-sans text-sm font-semibold hover:bg-[#B86B1A] transition-colors active:scale-95"
                        >
                          <Plus size={14} /> Add
                        </button>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button onClick={() => removeFromCart(product.id)} className="w-11 h-11 rounded-full border border-[#CFC0A0] flex items-center justify-center text-[#5A3A1E] hover:bg-[#EDE1C8] transition-colors active:scale-95">
                            <Minus size={15} />
                          </button>
                          <span className="font-sans font-semibold text-base text-[#1A0B04] w-6 text-center">{qty}</span>
                          <button onClick={() => addToCart(product)} className="w-11 h-11 rounded-full bg-[#1A0B04] flex items-center justify-center text-white hover:bg-[#B86B1A] transition-colors active:scale-95">
                            <Plus size={15} />
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

      {/* Bottom CTA — sits above the action bar */}
      {cartCount > 0 && (
        <div className="fixed bottom-[64px] left-0 right-0 p-3 bg-[#F4ECD9]/95 backdrop-blur-sm border-t border-[#CFC0A0]">
          <button
            onClick={() => setCartOpen(true)}
            className="w-full flex items-center justify-between bg-[#1A0B04] text-white px-6 py-4 rounded-2xl font-sans font-semibold hover:bg-[#B86B1A] transition-colors active:scale-[0.99]"
          >
            <span className="text-sm">{cartCount} item{cartCount > 1 ? "s" : ""}</span>
            <span className="flex items-center gap-2 text-sm">View Cart <ChevronRight size={16} /></span>
            <span className="text-sm">{formatPrice(cartTotal)}</span>
          </button>
        </div>
      )}

      {/* Persistent customer action bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-[#1A0B04] flex gap-2 px-3 py-2.5">
        <button
          onClick={callWaiter}
          disabled={callStatus === "loading"}
          className={cn(
            "flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl font-sans text-xs font-semibold transition-colors min-h-[44px]",
            callStatus === "sent"
              ? "bg-amber-400 text-[#1A0B04] cursor-default"
              : "bg-white/10 text-white hover:bg-white/20 active:bg-white/30"
          )}
        >
          {callStatus === "loading" ? <Loader2 size={14} className="animate-spin" /> : <Bell size={14} />}
          {callStatus === "sent" ? "Waiter on the way" : "Call Waiter"}
        </button>
        <button
          onClick={requestBill}
          disabled={billStatus === "loading"}
          className={cn(
            "flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl font-sans text-xs font-semibold transition-colors min-h-[44px]",
            billStatus === "sent"
              ? "bg-green-400 text-[#1A0B04] cursor-default"
              : "bg-white/10 text-white hover:bg-white/20 active:bg-white/30"
          )}
        >
          {billStatus === "loading" ? <Loader2 size={14} className="animate-spin" /> : <Receipt size={14} />}
          {billStatus === "sent" ? "Bill requested" : "Request Bill"}
        </button>
      </div>

      {/* Cart drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex flex-col">
          <div className="flex-1 bg-black/50" onClick={() => setCartOpen(false)} />
          <div className="bg-[#F4ECD9] rounded-t-3xl max-h-[85vh] overflow-y-auto">
            {step === "menu" && (
              <>
                <div className="px-6 py-5 flex items-center justify-between border-b border-[#CFC0A0]">
                  <h2 className="font-display text-[#1A0B04] font-medium" style={{ fontSize: "1.5rem" }}>Your Order</h2>
                  <button onClick={() => setCartOpen(false)} className="p-2 rounded-xl hover:bg-[#EDE1C8] text-[#9A7A56]"><X size={18} /></button>
                </div>

                <div className="px-6 py-4 space-y-3">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="font-sans text-sm font-medium text-[#1A0B04] truncate">{item.product.name}</p>
                        <p className="font-sans text-xs text-[#9A7A56]">{formatPrice(item.product.price)} each</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button onClick={() => removeFromCart(item.product.id)} className="w-10 h-10 rounded-full border border-[#CFC0A0] flex items-center justify-center text-[#5A3A1E] hover:bg-[#EDE1C8] active:scale-95 transition-all"><Minus size={13} /></button>
                        <span className="font-sans font-semibold text-sm text-[#1A0B04] w-5 text-center">{item.qty}</span>
                        <button onClick={() => addToCart(item.product)} className="w-10 h-10 rounded-full bg-[#1A0B04] flex items-center justify-center text-white hover:bg-[#B86B1A] active:scale-95 transition-all"><Plus size={13} /></button>
                      </div>
                      <span className="font-display italic text-[#B86B1A] shrink-0" style={{ fontSize: "0.95rem" }}>
                        {formatPrice(item.product.price * item.qty)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="px-6 py-4">
                  <div>
                    <label className="block font-sans text-xs text-[#9A7A56] mb-1.5 uppercase tracking-widest">Special Instructions (optional)</label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full border border-[#CFC0A0] rounded-xl px-3 py-2 font-sans text-sm text-[#1A0B04] bg-white focus:outline-none focus:border-[#B86B1A] resize-none h-16"
                      placeholder="Allergies, preferences…"
                    />
                  </div>
                </div>

                <div className="px-6 pb-4 border-t border-[#CFC0A0] pt-4">
                  <div className="flex justify-between mb-4">
                    <span className="font-sans font-semibold text-[#1A0B04]">Total</span>
                    <span className="font-display italic text-[#B86B1A]" style={{ fontSize: "1.3rem" }}>{formatPrice(cartTotal)}</span>
                  </div>
                  <div className="bg-[#B86B1A]/10 rounded-xl px-4 py-3 mb-4">
                    <p className="font-sans text-xs text-[#B86B1A] font-semibold">💰 Cash only · Pay at the counter</p>
                  </div>
                  <button
                    onClick={() => setStep("checkout")}
                    className="w-full flex items-center justify-center gap-2 bg-[#1A0B04] text-white py-4 rounded-2xl font-sans font-semibold hover:bg-[#B86B1A] transition-colors"
                  >
                    Proceed to Verify <ChevronRight size={16} />
                  </button>
                </div>
              </>
            )}

            {step === "checkout" && (
              <>
                <div className="px-6 py-5 flex items-center gap-3 border-b border-[#CFC0A0]">
                  <button onClick={() => setStep("menu")} className="p-2 rounded-xl hover:bg-[#EDE1C8] text-[#9A7A56]"><ArrowLeft size={16} /></button>
                  <h2 className="font-display text-[#1A0B04] font-medium" style={{ fontSize: "1.5rem" }}>Verify Phone</h2>
                </div>
                <div className="px-6 py-6 space-y-4">
                  <p className="font-sans text-sm text-[#9A7A56]">
                    We'll send a one-time code to verify your order.
                  </p>
                  <div>
                    <label className="block font-sans text-xs text-[#9A7A56] mb-1.5 uppercase tracking-widest">Mobile Number</label>
                    <div className="flex gap-2">
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="flex-1 border border-[#CFC0A0] rounded-xl px-4 py-3 font-sans text-sm text-[#1A0B04] bg-white focus:outline-none focus:border-[#B86B1A]"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>
                  {error && <p className="font-sans text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
                  <button
                    onClick={sendOtp}
                    disabled={loading || !phone}
                    className="w-full flex items-center justify-center gap-2 bg-[#1A0B04] text-white py-4 rounded-2xl font-sans font-semibold disabled:opacity-40 hover:bg-[#B86B1A] transition-colors"
                  >
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <Phone size={16} />}
                    Send OTP
                  </button>
                </div>
              </>
            )}

            {step === "otp" && (
              <>
                <div className="px-6 py-5 flex items-center gap-3 border-b border-[#CFC0A0]">
                  <button onClick={() => setStep("checkout")} className="p-2 rounded-xl hover:bg-[#EDE1C8] text-[#9A7A56]"><ArrowLeft size={16} /></button>
                  <h2 className="font-display text-[#1A0B04] font-medium" style={{ fontSize: "1.5rem" }}>Enter OTP</h2>
                </div>
                <div className="px-6 py-6 space-y-4">
                  <p className="font-sans text-sm text-[#9A7A56]">
                    Enter the 6-digit code sent to <strong className="text-[#1A0B04]">{phone}</strong>
                  </p>
                  <input
                    type="number"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.slice(0, 6))}
                    className="w-full border border-[#CFC0A0] rounded-xl px-4 py-4 font-sans text-xl text-center text-[#1A0B04] bg-white focus:outline-none focus:border-[#B86B1A] tracking-[0.5em]"
                    placeholder="000000"
                    maxLength={6}
                  />
                  {error && <p className="font-sans text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
                  <button
                    onClick={verifyAndOrder}
                    disabled={loading || otp.length !== 6}
                    className="w-full flex items-center justify-center gap-2 bg-[#B86B1A] text-white py-4 rounded-2xl font-sans font-semibold disabled:opacity-40 hover:bg-[#9A5912] transition-colors"
                  >
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                    Place Order · {formatPrice(cartTotal)}
                  </button>
                  <button
                    onClick={() => { setOtpSent(false); sendOtp(); }}
                    disabled={loading}
                    className="w-full font-sans text-sm text-[#9A7A56] underline"
                  >
                    Resend OTP
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
