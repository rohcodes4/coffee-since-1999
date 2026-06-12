"use client";

import { usePathname, useRouter } from "next/navigation";
import { Coffee, LogOut, QrCode, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function WaiterLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [waiterName, setWaiterName] = useState<string>("");

  useEffect(() => {
    fetch("/api/waiter/me")
      .then((r) => r.ok ? r.json() : null)
      .then((d) => { if (d) setWaiterName(d.waiterName); });
  }, []);

  async function logout() {
    await fetch("/api/waiter/logout", { method: "POST" });
    router.push("/waiter/login");
  }

  if (pathname === "/waiter/login") return <>{children}</>;

  return (
    <div className="min-h-screen bg-[#F4ECD9] flex flex-col">
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
          {waiterName && <span className="font-sans text-xs text-white/50 hidden sm:block">{waiterName}</span>}
          <button
            onClick={logout}
            className="flex items-center gap-1.5 text-white/60 hover:text-white transition-colors font-sans text-xs"
          >
            <LogOut size={14} /> Sign out
          </button>
        </div>
      </header>
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
