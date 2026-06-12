"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { LayoutDashboard, UtensilsCrossed, QrCode, ClipboardList, LogOut, Coffee, Users, Settings, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

function NavBadge({ count }: { count: number }) {
  if (count === 0) return null;
  return (
    <span className="ml-auto min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-[#B86B1A] text-white font-sans font-bold text-[10px] px-1">
      {count > 99 ? "99+" : count}
    </span>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [pendingOrders, setPendingOrders] = useState(0);
  const [draftInvoices, setDraftInvoices] = useState(0);
  const [pendingRequests, setPendingRequests] = useState(0);

  const fetchCounts = useCallback(async () => {
    try {
      const [ordersRes, invoicesRes, requestsRes] = await Promise.all([
        fetch("/api/admin/orders?status=PENDING"),
        fetch("/api/admin/invoices?status=DRAFT"),
        fetch("/api/admin/table-requests?status=PENDING"),
      ]);
      if (ordersRes.ok) {
        const data = await ordersRes.json();
        setPendingOrders(Array.isArray(data) ? data.length : 0);
      }
      if (invoicesRes.ok) {
        const data = await invoicesRes.json();
        setDraftInvoices(Array.isArray(data) ? data.length : 0);
      }
      if (requestsRes.ok) {
        const data = await requestsRes.json();
        setPendingRequests(Array.isArray(data) ? data.length : 0);
      }
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    if (pathname === "/admin/login") return;
    fetchCounts();
    const interval = setInterval(fetchCounts, 30000);
    return () => clearInterval(interval);
  }, [pathname, fetchCounts]);

  const nav = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard, badge: pendingOrders + draftInvoices + pendingRequests },
    { href: "/admin/menu",      label: "Menu",       icon: UtensilsCrossed, badge: 0 },
    { href: "/admin/tables",    label: "Tables",     icon: QrCode,          badge: 0 },
    { href: "/admin/orders",    label: "Orders",     icon: ClipboardList,   badge: pendingOrders },
    { href: "/admin/invoices",  label: "Invoices",   icon: FileText,        badge: draftInvoices },
    { href: "/admin/waiters",   label: "Waiters",    icon: Users,           badge: 0 },
    { href: "/admin/settings",  label: "Settings",   icon: Settings,        badge: 0 },
  ];

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  if (pathname === "/admin/login") return <>{children}</>;

  return (
    <div className="min-h-screen flex bg-[#F4ECD9]">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 bg-[#1A0B04] flex flex-col">
        <div className="px-5 py-6 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Coffee size={18} className="text-[#B86B1A]" />
            <span className="font-display text-white font-medium" style={{ fontSize: "1rem" }}>
              Coffee? Admin
            </span>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {nav.map(({ href, label, icon: Icon, badge }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg font-sans text-sm transition-colors",
                pathname.startsWith(href)
                  ? "bg-[#B86B1A] text-white"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              )}
            >
              <Icon size={16} />
              {label}
              <NavBadge count={badge} />
            </Link>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-white/10">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg font-sans text-sm text-white/60 hover:text-white hover:bg-white/10 transition-colors w-full"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
