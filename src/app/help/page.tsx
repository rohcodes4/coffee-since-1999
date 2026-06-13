import Link from "next/link";
import {
  LayoutDashboard, QrCode, ClipboardList, FileText, Users, Settings,
  ShoppingBag, History, Printer, CheckCircle2, AlertCircle,
  Coffee, Smartphone, ArrowRight, Bell,
} from "lucide-react";

function Section({ id, title, children }: { id?: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mb-12">
      <h2 className="font-display text-[#1A0B04] font-medium mb-4 border-b border-[#CFC0A0] pb-3" style={{ fontSize: "1.5rem" }}>
        {title}
      </h2>
      {children}
    </section>
  );
}

function FeatureCard({ icon: Icon, title, desc }: { icon: React.ElementType; title: string; desc: string }) {
  return (
    <div className="bg-white rounded-2xl border border-[#CFC0A0] p-5 flex gap-4">
      <div className="w-10 h-10 rounded-xl bg-[#B86B1A]/10 flex items-center justify-center shrink-0">
        <Icon size={18} className="text-[#B86B1A]" />
      </div>
      <div>
        <p className="font-sans font-semibold text-sm text-[#1A0B04] mb-0.5">{title}</p>
        <p className="font-sans text-xs text-[#9A7A56] leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4 mb-4">
      <div className="w-7 h-7 rounded-full bg-[#1A0B04] text-white flex items-center justify-center font-sans font-bold text-xs shrink-0 mt-0.5">
        {n}
      </div>
      <div>
        <p className="font-sans font-semibold text-sm text-[#1A0B04] mb-1">{title}</p>
        <div className="font-sans text-xs text-[#9A7A56] leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

function Badge({ color, label }: { color: string; label: string }) {
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide mr-1 ${color}`}>
      {label}
    </span>
  );
}

export const metadata = {
  title: "Staff Help Guide — Coffee Since 1999",
};

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-[#F4ECD9]">
      {/* Header */}
      <header className="bg-[#1A0B04] text-white px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-2">
            <Coffee size={20} className="text-[#B86B1A]" />
            <span className="font-display font-medium" style={{ fontSize: "1.1rem" }}>Coffee? Since 1999</span>
          </div>
          <h1 className="font-display font-medium mb-2" style={{ fontSize: "2.5rem" }}>Staff Help Guide</h1>
          <p className="font-sans text-white/60 text-sm">Complete documentation for the admin and waiter portals.</p>
        </div>
      </header>

      {/* Quick nav */}
      <div className="bg-white border-b border-[#CFC0A0] sticky top-0 z-20 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-3 flex gap-4 overflow-x-auto">
          {[
            { href: "#overview", label: "Overview" },
            { href: "#admin", label: "Admin Portal" },
            { href: "#waiter", label: "Waiter Portal" },
            { href: "#customer", label: "Customer QR" },
            { href: "#table-requests", label: "Table Requests" },
            { href: "#invoices", label: "Invoices" },
            { href: "#workflows", label: "Workflows" },
          ].map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="font-sans text-sm text-[#5A3A1E] hover:text-[#B86B1A] whitespace-nowrap transition-colors"
            >
              {label}
            </a>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10">

        {/* Overview */}
        <Section id="overview" title="System Overview">
          <p className="font-sans text-sm text-[#5A3A1E] mb-6 leading-relaxed">
            The system has three user-facing portals: an <strong>Admin Portal</strong> for full cafe management,
            a <strong>Waiter Portal</strong> optimised for tablets and phones at tableside, and a
            <strong> Customer QR ordering</strong> flow accessed by scanning the table QR code.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
            <div className="bg-[#1A0B04] text-white rounded-2xl p-5">
              <Settings size={22} className="text-[#B86B1A] mb-3" />
              <p className="font-display font-medium mb-1" style={{ fontSize: "1.1rem" }}>Admin Portal</p>
              <p className="font-sans text-xs text-white/60 mb-3">Full management control</p>
              <code className="font-mono text-xs bg-white/10 px-2 py-1 rounded-lg">/admin</code>
            </div>
            <div className="bg-[#B86B1A] text-white rounded-2xl p-5">
              <Smartphone size={22} className="mb-3 opacity-80" />
              <p className="font-display font-medium mb-1" style={{ fontSize: "1.1rem" }}>Waiter Portal</p>
              <p className="font-sans text-xs text-white/70 mb-3">Tableside ordering</p>
              <code className="font-mono text-xs bg-white/20 px-2 py-1 rounded-lg">/waiter</code>
            </div>
            <div className="bg-white border border-[#CFC0A0] rounded-2xl p-5">
              <QrCode size={22} className="text-[#9A7A56] mb-3" />
              <p className="font-display text-[#1A0B04] font-medium mb-1" style={{ fontSize: "1.1rem" }}>Customer QR</p>
              <p className="font-sans text-xs text-[#9A7A56] mb-3">Self-ordering via QR scan</p>
              <code className="font-mono text-xs bg-[#EDE1C8] px-2 py-1 rounded-lg text-[#5A3A1E]">/order/[tableId]</code>
            </div>
          </div>
        </Section>

        {/* Admin Portal */}
        <Section id="admin" title="Admin Portal">

          <div className="bg-[#EDE1C8] rounded-2xl px-5 py-4 mb-6 flex items-start gap-3">
            <AlertCircle size={16} className="text-[#B86B1A] shrink-0 mt-0.5" />
            <p className="font-sans text-sm text-[#5A3A1E]">
              Login at <code className="font-mono bg-[#CFC0A0]/40 px-1.5 py-0.5 rounded">/admin/login</code> using the admin password set in your environment.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
            <FeatureCard icon={LayoutDashboard} title="Dashboard" desc="Live order view with Kanban or Item mode. Audio chime on new orders. Per-item status controls." />
            <FeatureCard icon={QrCode} title="Tables" desc="Add tables, generate QR codes, monitor occupied/available status, and create invoices." />
            <FeatureCard icon={ClipboardList} title="Orders" desc="Full order history with filters by status and source (QR or Waiter)." />
            <FeatureCard icon={FileText} title="Invoices" desc="Create, edit, and settle invoices. Partial payments, GST breakdown, and print support." />
            <FeatureCard icon={Users} title="Waiters" desc="Create waiter accounts with PIN login. Activate, deactivate, or delete." />
            <FeatureCard icon={Settings} title="Settings" desc="Cafe details for invoices (GST, address), invoice numbering, and dashboard mode." />
          </div>

          <h3 className="font-sans font-semibold text-[#1A0B04] mb-3">Dashboard Modes</h3>
          <div className="grid sm:grid-cols-2 gap-3 mb-6">
            <div className="bg-white rounded-2xl border border-[#CFC0A0] p-5">
              <p className="font-sans font-semibold text-sm text-[#1A0B04] mb-2">Kanban Mode</p>
              <p className="font-sans text-xs text-[#9A7A56] leading-relaxed">Orders are grouped by status into columns — Pending, Confirmed, Preparing, Ready, Done. Each order card shows individual item statuses inside.</p>
            </div>
            <div className="bg-white rounded-2xl border border-[#CFC0A0] p-5">
              <p className="font-sans font-semibold text-sm text-[#1A0B04] mb-2">Item Mode</p>
              <p className="font-sans text-xs text-[#9A7A56] leading-relaxed">Every individual item across all orders is shown in status columns. Best for kitchen staff who want to see what needs to be made next.</p>
            </div>
          </div>

          <h3 className="font-sans font-semibold text-[#1A0B04] mb-3">Order Item Statuses</h3>
          <div className="flex flex-wrap gap-2 mb-6">
            <Badge color="bg-yellow-50 text-yellow-700" label="Pending" />
            <span className="text-[#CFC0A0] font-sans text-xs self-center">→</span>
            <Badge color="bg-blue-50 text-blue-700" label="Confirmed" />
            <span className="text-[#CFC0A0] font-sans text-xs self-center">→</span>
            <Badge color="bg-orange-50 text-orange-700" label="Preparing" />
            <span className="text-[#CFC0A0] font-sans text-xs self-center">→</span>
            <Badge color="bg-purple-50 text-purple-700" label="Ready" />
            <span className="text-[#CFC0A0] font-sans text-xs self-center">→</span>
            <Badge color="bg-green-50 text-green-700" label="Delivered" />
          </div>
          <p className="font-sans text-xs text-[#9A7A56] mb-6">Click the ↑ arrow on any item in the dashboard to advance its status.</p>

          <h3 className="font-sans font-semibold text-[#1A0B04] mb-3">Settings Reference</h3>
          <div className="bg-white rounded-2xl border border-[#CFC0A0] overflow-hidden mb-4">
            <table className="w-full font-sans text-sm">
              <thead>
                <tr className="bg-[#FAF6EE] border-b border-[#EDE1C8] text-[#9A7A56] text-xs uppercase tracking-widest">
                  <th className="text-left px-4 py-3 font-semibold">Field</th>
                  <th className="text-left px-4 py-3 font-semibold">Purpose</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F4ECD9]">
                {[
                  ["Cafe Name", "Printed at the top of every invoice"],
                  ["Tagline", "Subtitle shown below cafe name on invoice"],
                  ["Address", "Full address printed on invoice"],
                  ["Phone / Email", "Contact details on invoice"],
                  ["GST Number", "GSTIN printed on invoice"],
                  ["CGST Rate %", "Central GST applied to subtotal (default 2.5%)"],
                  ["SGST Rate %", "State GST applied to subtotal (default 2.5%)"],
                  ["Invoice Prefix", "Prefix before invoice number — e.g. INV → INV-0001"],
                  ["Dashboard Mode", "Kanban (by order) or Item (by item) view"],
                ].map(([field, purpose]) => (
                  <tr key={field}>
                    <td className="px-4 py-2.5 font-semibold text-[#1A0B04] text-xs">{field}</td>
                    <td className="px-4 py-2.5 text-[#5A3A1E] text-xs">{purpose}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        {/* Waiter Portal */}
        <Section id="waiter" title="Waiter Portal">
          <div className="bg-[#EDE1C8] rounded-2xl px-5 py-4 mb-6 flex items-start gap-3">
            <AlertCircle size={16} className="text-[#B86B1A] shrink-0 mt-0.5" />
            <p className="font-sans text-sm text-[#5A3A1E]">
              Waiters log in at <code className="font-mono bg-[#CFC0A0]/40 px-1.5 py-0.5 rounded">/waiter/login</code> — select name from dropdown, enter 4–6 digit PIN. Accounts are created by admin in Waiters section.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-3 mb-6">
            <FeatureCard icon={QrCode} title="Table Grid" desc="Shows all tables with Occupied/Available status and active order count. Tap any table to start ordering." />
            <FeatureCard icon={ShoppingBag} title="Menu & Cart" desc="Responsive grid layout. Search across all items. Category tabs for filtering. Add items and submit without OTP." />
            <FeatureCard icon={History} title="Today's History" desc="Tab on the ordering screen shows all orders placed for that table today, including settled sessions." />
            <FeatureCard icon={FileText} title="Invoice Access" desc="Invoice button on every table. Full invoice list at /waiter/invoices. Waiters have full invoice power — same as admin." />
            <FeatureCard icon={Bell} title="Table Request Alerts" desc="Persistent banner appears when a customer taps Call Waiter or Request Bill. Tap Mark Attended to resolve." />
          </div>

          <h3 className="font-sans font-semibold text-[#1A0B04] mb-3">Ordering Screen Tabs</h3>
          <div className="grid sm:grid-cols-2 gap-3 mb-4">
            <div className="bg-white border border-[#CFC0A0] rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <Coffee size={14} className="text-[#B86B1A]" />
                <p className="font-sans font-semibold text-sm text-[#1A0B04]">Menu tab</p>
              </div>
              <ul className="font-sans text-xs text-[#9A7A56] space-y-1">
                <li>• Search bar (name + description)</li>
                <li>• Category filter tabs (hidden during search)</li>
                <li>• 1-col (phone) / 2-col (tablet) / 3-col (desktop) grid</li>
                <li>• Each card: image, name, dietary icons, description, price</li>
                <li>• Add / quantity controls per item</li>
              </ul>
            </div>
            <div className="bg-white border border-[#CFC0A0] rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <History size={14} className="text-[#B86B1A]" />
                <p className="font-sans font-semibold text-sm text-[#1A0B04]">Today&apos;s History tab</p>
              </div>
              <ul className="font-sans text-xs text-[#9A7A56] space-y-1">
                <li>• All orders for this table today</li>
                <li>• Includes settled/invoiced sessions</li>
                <li>• Per-item status and timestamp</li>
                <li>• Waiter name shown per order</li>
              </ul>
            </div>
          </div>
        </Section>

        {/* Customer QR */}
        <Section id="customer" title="Customer QR Ordering">
          <p className="font-sans text-sm text-[#5A3A1E] mb-4 leading-relaxed">
            Each table has a unique QR code. When a customer scans it, they land on the ordering page for that table.
          </p>

          <div className="space-y-0 mb-6">
            <Step n={1} title="Browse the menu">Browse by category using the tab bar, or use the search bar to find items by name or description.</Step>
            <Step n={2} title="Add to cart">Tap "Add" on any item. Adjust quantities in the cart.</Step>
            <Step n={3} title="Checkout">Open the cart, review items, add special instructions, then tap "Proceed to Verify".</Step>
            <Step n={4} title="OTP verification">Enter mobile number → receive SMS OTP → enter 6-digit code to confirm identity.</Step>
            <Step n={5} title="Order confirmed">Order appears in the admin dashboard immediately. Customer sees a confirmation with order total.</Step>
            <Step n={6} title="Call Waiter / Request Bill">After ordering, customers see two additional buttons on the confirmation screen to alert staff.</Step>
          </div>

          <div className="bg-[#EDE1C8] rounded-2xl px-5 py-4 flex items-start gap-3">
            <AlertCircle size={16} className="text-[#B86B1A] shrink-0 mt-0.5" />
            <p className="font-sans text-xs text-[#5A3A1E]">
              During development, OTP code <code className="font-mono bg-[#CFC0A0]/40 px-1.5 py-0.5 rounded">000000</code> bypasses SMS verification. Remove this bypass in production.
            </p>
          </div>
        </Section>

        {/* Table Requests */}
        <Section id="table-requests" title="Table Requests — Call Waiter & Request Bill">
          <p className="font-sans text-sm text-[#5A3A1E] mb-6 leading-relaxed">
            Customers can alert staff directly from the order confirmation screen. Two request types are supported:
          </p>

          <div className="grid sm:grid-cols-2 gap-3 mb-6">
            <div className="bg-white border border-[#CFC0A0] rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <Bell size={14} className="text-[#B86B1A]" />
                <p className="font-sans font-semibold text-sm text-[#1A0B04]">Call Waiter</p>
              </div>
              <p className="font-sans text-xs text-[#9A7A56] leading-relaxed">
                Customer needs assistance at the table. An alert appears immediately in both the waiter and admin portals.
              </p>
            </div>
            <div className="bg-white border border-[#CFC0A0] rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <FileText size={14} className="text-[#B86B1A]" />
                <p className="font-sans font-semibold text-sm text-[#1A0B04]">Request Bill</p>
              </div>
              <p className="font-sans text-xs text-[#9A7A56] leading-relaxed">
                Customer is ready to pay. Alerts staff to bring the bill. Same alert system as Call Waiter.
              </p>
            </div>
          </div>

          <h3 className="font-sans font-semibold text-[#1A0B04] mb-3">How alerts appear</h3>
          <div className="bg-white border border-[#CFC0A0] rounded-2xl p-5 mb-4">
            <ul className="font-sans text-xs text-[#9A7A56] space-y-2">
              <li className="flex items-start gap-2"><ArrowRight size={12} className="text-[#B86B1A] shrink-0 mt-0.5" /><span>A persistent alert banner appears at the top of the <strong>waiter portal</strong> and <strong>admin portal</strong>.</span></li>
              <li className="flex items-start gap-2"><ArrowRight size={12} className="text-[#B86B1A] shrink-0 mt-0.5" /><span>The banner shows the table name, request type, and how long ago it was sent.</span></li>
              <li className="flex items-start gap-2"><ArrowRight size={12} className="text-[#B86B1A] shrink-0 mt-0.5" /><span>Multiple pending requests are stacked in the banner.</span></li>
              <li className="flex items-start gap-2"><ArrowRight size={12} className="text-[#B86B1A] shrink-0 mt-0.5" /><span>Click <strong>"Mark Attended"</strong> to dismiss the alert and record who attended.</span></li>
              <li className="flex items-start gap-2"><ArrowRight size={12} className="text-[#B86B1A] shrink-0 mt-0.5" /><span>The admin dashboard also has a dedicated <strong>Table Requests panel</strong> for an overview of all pending requests.</span></li>
            </ul>
          </div>
        </Section>

        {/* Invoices */}
        <Section id="invoices" title="Invoices">
          <div className="grid sm:grid-cols-3 gap-3 mb-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 text-center">
              <p className="font-sans text-xs font-semibold text-yellow-700 uppercase tracking-widest mb-1">Draft</p>
              <p className="font-sans text-xs text-yellow-600">Created, not yet presented to guest</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-center">
              <p className="font-sans text-xs font-semibold text-blue-700 uppercase tracking-widest mb-1">Issued</p>
              <p className="font-sans text-xs text-blue-600">Shown to guest, awaiting payment</p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-center">
              <p className="font-sans text-xs font-semibold text-green-700 uppercase tracking-widest mb-1">Settled</p>
              <p className="font-sans text-xs text-green-600">Paid. Table session reset.</p>
            </div>
          </div>

          <h3 className="font-sans font-semibold text-[#1A0B04] mb-3">Invoice Editor Features</h3>
          <div className="grid sm:grid-cols-2 gap-3 mb-6">
            <FeatureCard icon={CheckCircle2} title="Item Selection" desc="Checkboxes to include/exclude specific items. Uncheck to leave items for the next invoice." />
            <FeatureCard icon={FileText} title="Manual Line Items" desc="Add any custom item (name, qty, price) or pick from the product menu." />
            <FeatureCard icon={ShoppingBag} title="Partial Payments" desc="Record multiple payment entries — Cash, Card, UPI. Edit or delete existing entries. Live balance shown." />
            <FeatureCard icon={Printer} title="Print Invoice" desc="Prints a clean invoice layout. Sidebar and controls are hidden. Shows GST breakdown and session duration." />
            <FeatureCard icon={Users} title="Waiter Assignment" desc="Select or reassign the waiter responsible for this invoice via dropdown." />
            <FeatureCard icon={Bell} title="Notification Badges" desc="Sidebar shows badge counts for open invoices and pending table requests." />
          </div>

          <h3 className="font-sans font-semibold text-[#1A0B04] mb-3">What happens when you settle</h3>
          <ul className="font-sans text-sm text-[#5A3A1E] space-y-2 list-none ml-0">
            {[
              "Invoice status → Settled, timestamp recorded",
              "Included order items stamped as invoiced (won't appear on future invoices)",
              "If remaining uninvoiced items exist → table stays Occupied, session timer resets",
              "If no remaining items → table resets to Available",
            ].map((point) => (
              <li key={point} className="flex items-start gap-2">
                <ArrowRight size={13} className="text-[#B86B1A] shrink-0 mt-0.5" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </Section>

        {/* Workflows */}
        <Section id="workflows" title="Common Workflows">

          <h3 className="font-sans font-semibold text-[#1A0B04] mb-3">End-of-table billing</h3>
          <div className="mb-6 space-y-0">
            <Step n={1} title="Open invoice">Tap the Invoice button on the table (Tables page or waiter screen).</Step>
            <Step n={2} title="Review items">Uncheck any items to exclude (e.g. items to be charged separately).</Step>
            <Step n={3} title="Apply discount">Enter discount amount in ₹ if applicable.</Step>
            <Step n={4} title="Record payments">Add Cash / Card / UPI entries. Multiple methods allowed.</Step>
            <Step n={5} title="Settle">Once balance is ₹0, tap "Settle Invoice". Table resets automatically.</Step>
          </div>

          <h3 className="font-sans font-semibold text-[#1A0B04] mb-3">Adding a waiter</h3>
          <div className="mb-6 space-y-0">
            <Step n={1} title="Go to Waiters">Admin → Waiters → click "Add Waiter".</Step>
            <Step n={2} title="Enter details">Name and a 4–6 digit PIN.</Step>
            <Step n={3} title="Share PIN">Tell the waiter their PIN — they log in at /waiter/login.</Step>
          </div>

          <h3 className="font-sans font-semibold text-[#1A0B04] mb-3">Printing table QR codes</h3>
          <div className="mb-6 space-y-0">
            <Step n={1} title="Go to Tables">Admin → Tables.</Step>
            <Step n={2} title="Download QR">Click "Download" on each table row — saves a PNG file.</Step>
            <Step n={3} title="Print & display">Print and laminate for each table. The URL encoded is unique per table.</Step>
          </div>

          <h3 className="font-sans font-semibold text-[#1A0B04] mb-3">Creating a manual invoice (no table)</h3>
          <div className="mb-6 space-y-0">
            <Step n={1} title="Go to Invoices">Admin → Invoices → click "New Invoice".</Step>
            <Step n={2} title="Add items">Use the "Add item" button to add custom line items manually.</Step>
            <Step n={3} title="Record payment and settle">Same as table billing flow above.</Step>
          </div>

          <h3 className="font-sans font-semibold text-[#1A0B04] mb-3">Roles & Permissions</h3>
          <div className="bg-white rounded-2xl border border-[#CFC0A0] overflow-hidden">
            <table className="w-full font-sans text-sm">
              <thead>
                <tr className="bg-[#FAF6EE] border-b border-[#EDE1C8] text-[#9A7A56] text-xs uppercase tracking-widest">
                  <th className="text-left px-4 py-3 font-semibold">Feature</th>
                  <th className="text-center px-4 py-3 font-semibold">Admin</th>
                  <th className="text-center px-4 py-3 font-semibold">Waiter</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F4ECD9]">
                {[
                  ["Live dashboard", "✓", "—"],
                  ["Update order/item status", "✓", "—"],
                  ["Manage menu & tables", "✓", "—"],
                  ["Manage waiters & settings", "✓", "—"],
                  ["Place orders (tableside)", "✓", "✓"],
                  ["View table order history", "✓", "✓ (today)"],
                  ["Create & settle invoices", "✓", "✓"],
                  ["Print invoices", "✓", "✓"],
                  ["Attend table requests", "✓", "✓"],
                  ["Receive table request alerts", "✓", "✓"],
                ].map(([feature, admin, waiter]) => (
                  <tr key={feature}>
                    <td className="px-4 py-2.5 text-[#1A0B04] text-xs">{feature}</td>
                    <td className="px-4 py-2.5 text-center text-xs font-semibold text-green-700">{admin}</td>
                    <td className="px-4 py-2.5 text-center text-xs font-semibold text-[#9A7A56]">{waiter}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <div className="border-t border-[#CFC0A0] pt-6 mt-8">
          <p className="font-sans text-xs text-[#9A7A56]">
            For technical issues, contact your developer. This page lives at <code className="font-mono bg-[#EDE1C8] px-1.5 py-0.5 rounded">/help</code> — bookmark it for quick access.
          </p>
        </div>
      </div>
    </div>
  );
}
