"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, UtensilsCrossed, QrCode, ClipboardList, LogOut, Coffee, Users, Settings, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/menu",      label: "Menu",       icon: UtensilsCrossed },
  { href: "/admin/tables",    label: "Tables",     icon: QrCode },
  { href: "/admin/orders",    label: "Orders",     icon: ClipboardList },
  { href: "/admin/invoices",  label: "Invoices",   icon: FileText },
  { href: "/admin/waiters",   label: "Waiters",    icon: Users },
  { href: "/admin/settings",  label: "Settings",   icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

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
          {nav.map(({ href, label, icon: Icon }) => (
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
