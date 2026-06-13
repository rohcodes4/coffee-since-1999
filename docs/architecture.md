# Architecture — Coffee? Since 1999

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 (theme in `globals.css`) |
| Database | PostgreSQL (Supabase) via Prisma 6 |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| Animation | Framer Motion |
| Icons | Lucide React |
| Validation | Zod |
| QR | qrcode library |

---

## Directory Structure

```
src/
  app/
    page.tsx                      # Marketing homepage
    layout.tsx                    # Root layout (fonts, loading screen)
    order/[tableId]/              # Customer QR ordering flow
    waiter/                       # Waiter device app
      page.tsx                    # Redirects → /waiter/tables
      login/                      # PIN login
      tables/                     # Table selection grid (AVAILABLE/OCCUPIED, order counts)
      [tableId]/                  # Waiter ordering (no OTP)
      invoices/                   # Waiter invoice list
        new/                      # Create invoice (waiter)
        [id]/                     # View/edit invoice (waiter)
    admin/                        # Admin panel (protected)
      dashboard/                  # Live kanban orders
      menu/                       # Category + product CRUD
      tables/                     # Table + QR management
        [id]/invoice/             # Invoice generation + payment
      invoices/                   # Invoice list (all statuses)
        new/                      # Blank manual invoice
        [id]/                     # Invoice editor
      orders/                     # Order history
      waiters/                    # Waiter staff CRUD
      settings/                   # Cafe settings (GST, address)
      login/                      # Admin login
    api/
      menu/                       # Public menu API
      orders/                     # Create order (customer + waiter)
      otp/send|verify/            # OTP flow
      table-requests/             # Customer POST (call waiter / bill request)
      waiter/
        login|logout|list|me/     # Waiter auth APIs
        tables-status/            # Table grid with order counts
        table-requests/[id]/attend/ # Waiter attends a table request
      admin/
        login|logout/             # Admin auth
        orders/[id]/              # Order CRUD
        tables/[id]/qr|invoice|payment|settle/
        waiters/[id]/             # Waiter CRUD
        invoices/[id]/payments/[paymentId]/ # Edit/delete payment entries
        table-requests/[id]/attend/ # Admin attends a table request
        settings/                 # CafeSettings singleton
  components/
    ui/                           # MenuCard, Button, Badge, DietaryBadge
    invoice/
      InvoiceEditor.tsx           # Shared invoice editor (admin + waiter)
    sections/                     # Hero, OurStory, TheCraft, etc.
  content/
    cafe.ts                       # All marketing copy + static menu data
  lib/
    auth.ts                       # Admin + OTP JWT helpers
    waiter-auth.ts                # Waiter JWT helpers
    db.ts                         # Prisma singleton
    format.ts                     # formatPrice() utility
    qr.ts                         # QR code generator
    utils.ts                      # cn() class merger
  types/
    index.ts                      # Shared TS interfaces (marketing site)
prisma/
  schema.prisma                   # Single source of truth for DB
docs/
  prd.md                          # Product requirements
  architecture.md                 # This file
  schema.md                       # Database schema reference
  user-flows.md                   # Step-by-step user journeys
  tracker.md                      # Feature completion tracker
```

---

## Auth Architecture

Three independent JWT layers, all using the same `JWT_SECRET`:

| Token | Cookie | Expiry | Payload |
|---|---|---|---|
| Admin | `admin_token` | 24h | `{ role: "admin" }` |
| Waiter | `waiter_token` | 10h | `{ waiterId, waiterName, role: "waiter" }` |
| OTP | `otp_token` | 2h | `{ phone, verified: true }` |

Middleware (`src/middleware.ts`) protects `/admin/*` and `/waiter/*` at the edge.

---

## Order Flow Architecture

```
Customer QR              Waiter Device            Admin Panel
─────────────────        ─────────────────        ─────────────────
Scan QR → menu           Login (name+PIN)          Login (email+pw)
Add items → cart         Select table              Live dashboard
Enter phone              Browse menu               Advance statuses
OTP verify               Add items → cart          View history
POST /api/orders         POST /api/orders          Generate invoice
  source: CUSTOMER         source: WAITER          Record payments
                                                   Mark table settled
```

---

## Key Patterns

- **Prices**: Always stored as integers in paise. `formatPrice(paise)` converts to `₹X.XX`.
- **Server components** fetch DB data; **client components** handle interactivity.
- **Optimistic UI**: Order status changes call the API then re-fetch.
- **Notification sound**: Web Audio API oscillator, initialised on first user click to satisfy browser autoplay policy.
- **Invoice print**: `@media print` CSS hides sidebar and payment panel; only `#invoice` div is visible.
- **Table status**: Set to OCCUPIED on first order, AVAILABLE when settled via `/api/admin/tables/[id]/settle`.
- **Table requests**: Customers post `CALL_WAITER` or `BILL_REQUEST` from the order page. Both admin and waiter layouts poll for pending requests and display a persistent alert banner until attended.
- **Shared InvoiceEditor**: `src/components/invoice/InvoiceEditor.tsx` is used by both the admin and waiter portals — role differences (e.g. settle permissions) controlled by props.
