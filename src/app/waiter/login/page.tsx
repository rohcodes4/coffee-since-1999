"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Coffee, Loader2 } from "lucide-react";

interface Waiter { id: string; name: string; }

export default function WaiterLoginPage() {
  const router = useRouter();
  const [waiters, setWaiters] = useState<Waiter[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/waiter/list").then((r) => r.json()).then(setWaiters);
  }, []);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setLoading(true);
    const res = await fetch("/api/waiter/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ waiterId: selectedId, pin }),
    });
    setLoading(false);
    if (res.ok) {
      router.push("/waiter/tables");
    } else {
      setError("Invalid PIN. Please try again.");
      setPin("");
    }
  }

  return (
    <div className="min-h-screen bg-[#1A0B04] flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-[#B86B1A] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Coffee size={28} className="text-white" />
          </div>
          <h1 className="font-display text-white font-medium" style={{ fontSize: "2rem" }}>Waiter Login</h1>
          <p className="font-sans text-white/50 text-sm mt-1">Coffee? Since 1999</p>
        </div>

        <form onSubmit={login} className="space-y-4">
          <div>
            <label className="block font-sans text-xs text-white/50 uppercase tracking-widest mb-2">Select Your Name</label>
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              required
              className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-4 py-3 font-sans text-sm focus:outline-none focus:border-[#B86B1A]"
            >
              <option value="" disabled>Choose waiter…</option>
              {waiters.map((w) => (
                <option key={w.id} value={w.id} className="text-[#1A0B04]">{w.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-sans text-xs text-white/50 uppercase tracking-widest mb-2">PIN</label>
            <input
              type="password"
              inputMode="numeric"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="••••"
              maxLength={6}
              required
              className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-4 py-4 font-sans text-2xl text-center tracking-[0.5em] focus:outline-none focus:border-[#B86B1A] placeholder:tracking-normal placeholder:text-white/30"
            />
          </div>

          {error && <p className="font-sans text-sm text-red-400 text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading || !selectedId || pin.length < 4}
            className="w-full bg-[#B86B1A] text-white py-4 rounded-2xl font-sans font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[#9A5912] transition-colors disabled:opacity-40 mt-2"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : null}
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
