"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Coffee, Loader2 } from "lucide-react";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include"
    });
    setLoading(false);
    if (res.ok) {
      router.push("/admin/dashboard");
    } else {
      setError("Invalid credentials. Check your email and password.");
    }
  }

  return (
    <div className="min-h-screen bg-[#1A0B04] flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-3 mb-8">
          <Coffee size={28} className="text-[#B86B1A]" />
          <div>
            <p className="font-display text-white font-medium text-xl">Coffee? Since 1999</p>
            <p className="font-sans text-white/40 text-xs">Admin Panel</p>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block font-sans text-xs text-white/50 mb-1.5 uppercase tracking-widest">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 font-sans text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#B86B1A] transition-colors"
              placeholder="admin@coffee1999.in"
            />
          </div>

          <div>
            <label className="block font-sans text-xs text-white/50 mb-1.5 uppercase tracking-widest">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 font-sans text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#B86B1A] transition-colors"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="font-sans text-xs text-red-400 bg-red-400/10 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#B86B1A] text-white font-sans text-sm font-semibold py-3 rounded-xl hover:bg-[#9A5912] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 size={15} className="animate-spin" />}
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
