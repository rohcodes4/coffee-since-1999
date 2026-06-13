# Feature Tracker

Last updated: 2026-06-13

## ✅ Completed

### Foundation
- [x] Next.js 16 app with Tailwind v4, Prisma, TypeScript strict mode
- [x] Marketing site (Hero, OurStory, TheCraft, TheFounders, Gallery, VisitUs, Footer)
- [x] SEO metadata, sitemap, robots.txt
- [x] Prisma schema with Table, Category, Product, Order, OrderItem, OtpSession

### Customer Ordering
- [x] QR-based ordering flow at `/order/[tableId]`
- [x] Category tabs + product grid with dietary badges
- [x] Cart with +/- controls and special instructions
- [x] OTP phone verification (send + verify)
- [x] Dev OTP bypass: code `000000` always passes in non-production
- [x] Order confirmation screen

### Admin Panel
- [x] Login with email + password (JWT, 24h)
- [x] Middleware protecting `/admin/*`
- [x] Live order dashboard (kanban, PENDING → DONE)
- [x] Menu management: category + product CRUD
- [x] Tables management: CRUD + QR code preview/download
- [x] Order history with date/status filters

### Waiter System *(added 2026-06-12)*
- [x] Waiter model in DB (name, bcrypt PIN, active flag)
- [x] Waiter auth: `signWaiterToken`, `verifyWaiterToken`, 10h JWT
- [x] Middleware protecting `/waiter/*`
- [x] Waiter login page: dropdown + PIN pad
- [x] Waiter table selection grid (AVAILABLE / OCCUPIED status)
- [x] WaiterOrderClient: full menu + cart, no OTP
- [x] Orders API: accepts `source: WAITER`, skips OTP, sets table OCCUPIED
- [x] Admin: Waiters CRUD page

### Invoice & Payments *(added 2026-06-12)*
- [x] CafeSettings singleton model (cafeName, address, GSTIN, CGST/SGST, invoice prefix/counter, dashboardMode)
- [x] Admin Settings page
- [x] Invoice model with InvoiceItem, InvoiceStatus (DRAFT / ISSUED / SETTLED)
- [x] TablePayment model (per-payment, supports multiple methods, linked to Invoice)
- [x] Invoice editor: item checklist, GST breakdown, partial payments panel, discount field, notes
- [x] Invoice list page (`/admin/invoices`) with status filter (Draft / Issued / Settled)
- [x] Create invoice from table or blank manual invoice
- [x] Invoice delete from list page
- [x] Edit payment entries (update amount/method) and delete payments
- [x] Waiter invoice access: list (`/waiter/invoices`), create, view/edit invoice editor
- [x] Product picker in invoice editor (add items from menu)
- [x] Waiter assignment on invoice (dropdown in editor)
- [x] Settle Invoice: stamps items as invoiced, resets table session
- [x] Print-optimised invoice layout (sidebar hidden on print)
- [x] Sequential invoice numbering (auto-incrementing counter)
- [x] Sidebar notification badges for unread invoices (admin + waiter)

### Dashboard Enhancements *(added 2026-06-12)*
- [x] Order timestamp shown on every card
- [x] Source badge: "QR" vs waiter name
- [x] Audio notification on new PENDING orders (Web Audio API chime)
- [x] "New order received" toast
- [x] Source filter in order history
- [x] Table status (AVAILABLE / OCCUPIED) in admin tables page
- [x] "Invoice" button on occupied tables
- [x] Admin dashboard: pending table requests panel (Call Waiter / Bill Request alerts)

### Table Requests *(added 2026-06-13)*
- [x] TableRequest model (CALL_WAITER / BILL_REQUEST types, PENDING / ATTENDED statuses)
- [x] Customer order page: "Call Waiter" and "Request Bill" buttons post a TableRequest
- [x] Waiter portal: persistent alert banner for pending table requests with "Mark Attended" action
- [x] Admin portal: persistent alert banner for pending table requests with "Mark Attended" action
- [x] APIs: `/api/table-requests` (customer POST), `/api/waiter/table-requests`, `/api/admin/table-requests`, attend endpoints for both roles
- [x] Waiter root (`/waiter`) redirects to `/waiter/tables`

---

## 🔲 Backlog / Future

- [ ] **Mobile responsiveness** — make all portals and pages (admin, waiter, order flow) 100% mobile responsive
- [ ] **Store open/close** — only admin can open and close the store; orders and invoices can only be created when store is open
- [ ] SMS integration for OTP (MSG91 / Twilio)
- [ ] Daily revenue analytics page
- [ ] Product inventory / out-of-stock toggle
- [ ] Customer-facing order status tracker (polling page)
- [ ] Printer integration (thermal receipt printer via WebUSB / ESC-POS)
- [ ] Multi-location support
- [ ] Shift summary report for waiters
