"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { LayoutDashboard, UtensilsCrossed, QrCode, ClipboardList, LogOut, Coffee, Users, Settings, FileText, Menu, X } from "lucide-react";
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  const sidebarContent = (
    <>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {nav.map(({ href, label, icon: Icon, badge }) => (
          <Link
            key={href}
            href={href}
            onClick={() => setSidebarOpen(false)}
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
    </>
  );

  return (
    <div className="min-h-screen bg-[#F4ECD9]">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — drawer on mobile, fixed on desktop */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-56 bg-[#1A0B04] flex flex-col transition-transform duration-300",
        "md:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="px-5 py-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Coffee size={18} className="text-[#B86B1A]" />
            <span className="font-display text-white font-medium" style={{ fontSize: "1rem" }}>
              Coffee? Admin
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-1 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
        {sidebarContent}
      </aside>

      {/* Main content — offset on desktop, full-width on mobile */}
      <div className="md:ml-56 flex flex-col min-h-screen">
        {/* Mobile top bar */}
        <div className="md:hidden sticky top-0 z-30 bg-[#1A0B04] text-white px-4 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Coffee size={18} className="text-[#B86B1A]" />
            <span className="font-display text-white font-medium" style={{ fontSize: "1rem" }}>
              Coffee? Admin
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
        </div>

        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
