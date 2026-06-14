"use client";

import { usePathname, useRouter } from "next/navigation";
import { Coffee, LogOut, QrCode, FileText, Bell, Receipt, X } from "lucide-react";
import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface TableRequest {
  id: string;
  tableName: string;
  type: "CALL_WAITER" | "BILL_REQUEST";
  createdAt: string;
}

function playRequestSound(audioCtxRef: React.MutableRefObject<AudioContext | null>, type: "CALL_WAITER" | "BILL_REQUEST") {
  try {
    if (!audioCtxRef.current) audioCtxRef.current = new AudioContext();
    const ctx = audioCtxRef.current;
    const freqs = type === "CALL_WAITER" ? [1000, 1200, 1000, 1200] : [900, 1100, 1300];
    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      osc.type = "sine";
      const t = ctx.currentTime + i * 0.2;
      gain.gain.setValueAtTime(0.4, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
      osc.start(t);
      osc.stop(t + 0.25);
    });
  } catch { /* autoplay policy */ }
}

export default function WaiterLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [waiterName, setWaiterName] = useState<string>("");
  const [pendingRequests, setPendingRequests] = useState<TableRequest[]>([]);
  const knownRequestIds = useRef<Set<string>>(new Set());
  const audioCtxRef = useRef<AudioContext | null>(null);
  const audioReady = useRef(false);

  useEffect(() => {
    fetch("/api/waiter/me")
      .then((r) => r.ok ? r.json() : null)
      .then((d) => { if (d) setWaiterName(d.waiterName); });
  }, []);

  // Unlock audio context on first interaction
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

  const fetchRequests = useCallback(async () => {
    const res = await fetch("/api/waiter/table-requests?status=PENDING");
    if (!res.ok) return;
    const data: TableRequest[] = await res.json();
    const newOnes = data.filter((r) => !knownRequestIds.current.has(r.id));
    if (newOnes.length > 0 && knownRequestIds.current.size > 0) {
      // Play most urgent sound first
      const callType = newOnes.find((r) => r.type === "CALL_WAITER")?.type ?? newOnes[0].type;
      playRequestSound(audioCtxRef, callType);
    }
    data.forEach((r) => knownRequestIds.current.add(r.id));
    setPendingRequests(data);
  }, []);

  useEffect(() => {
    if (pathname === "/waiter/login") return;
    fetchRequests();
    const interval = setInterval(fetchRequests, 15000);
    return () => clearInterval(interval);
  }, [pathname, fetchRequests]);

  async function attendRequest(id: string) {
    await fetch(`/api/waiter/table-requests/${id}/attend`, { method: "POST" });
    setPendingRequests((prev) => prev.filter((r) => r.id !== id));
  }

  async function logout() {
    await fetch("/api/waiter/logout", { method: "POST" });
    router.push("/waiter/login");
  }

  if (pathname === "/waiter/login") return <>{children}</>;

  return (
    <div
      className="min-h-screen bg-[#F4ECD9] flex flex-col"
      onClick={() => {
        if (!audioReady.current && typeof AudioContext !== "undefined") {
          audioCtxRef.current = new AudioContext();
          audioReady.current = true;
        }
      }}
    >
      <header className="bg-[#1A0B04] text-white px-5 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Coffee size={16} className="text-[#B86B1A]" />
          <span className="font-display font-medium" style={{ fontSize: "1rem" }}>Coffee? Since 1999</span>
        </div>
        <div className="flex items-center gap-4">
          <nav className="flex items-center gap-1">
            <Link
              href="/waiter/tables"
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-sans text-xs transition-colors",
                pathname.startsWith("/waiter/tables") || (pathname.startsWith("/waiter/") && !pathname.startsWith("/waiter/invoices"))
                  ? "bg-white/10 text-white"
                  : "text-white/60 hover:text-white"
              )}
            >
              <QrCode size={13} /> Tables
            </Link>
            <Link
              href="/waiter/invoices"
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-sans text-xs transition-colors",
                pathname.startsWith("/waiter/invoices")
                  ? "bg-white/10 text-white"
                  : "text-white/60 hover:text-white"
              )}
            >
              <FileText size={13} /> Invoices
            </Link>
          </nav>
          {pendingRequests.length > 0 && (
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-red-500 text-white font-sans font-bold text-[10px] animate-pulse">
              {pendingRequests.length}
            </span>
          )}
          {waiterName && <span className="font-sans text-xs text-white/50 hidden sm:block">{waiterName}</span>}
          <button
            onClick={logout}
            className="flex items-center gap-1.5 text-white/60 hover:text-white transition-colors font-sans text-xs"
            title="Sign out"
          >
            <LogOut size={14} />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </header>

      {/* Persistent request notifications */}
      {pendingRequests.length > 0 && (
        <div className="bg-red-600 text-white shrink-0">
          {pendingRequests.map((req) => (
            <div
              key={req.id}
              className={cn(
                "flex items-center justify-between px-4 py-2.5 border-b border-white/20 last:border-0",
                req.type === "CALL_WAITER" ? "bg-red-600" : "bg-amber-600"
              )}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {req.type === "CALL_WAITER"
                  ? <Bell size={15} className="shrink-0 animate-bounce" />
                  : <Receipt size={15} className="shrink-0" />}
                <div className="min-w-0">
                  <span className="font-sans text-sm font-semibold">{req.tableName}</span>
                  <span className="font-sans text-xs text-white/80 ml-2 hidden sm:inline">
                    {req.type === "CALL_WAITER" ? "— calling for waiter" : "— requesting bill"}
                  </span>
                  <span className="font-sans text-[10px] text-white/60 ml-2">
                    {new Date(req.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              </div>
              <button
                onClick={() => attendRequest(req.id)}
                className="flex items-center gap-1 px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg font-sans text-xs font-semibold transition-colors shrink-0 ml-3"
              >
                <X size={11} /> Attended
              </button>
            </div>
          ))}
        </div>
      )}

      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
