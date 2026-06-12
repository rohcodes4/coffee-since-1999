# Feature Tracker

Last updated: 2026-06-12

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
- [x] CafeSettings singleton model (cafeName, address, GSTIN, CGST/SGST, invoice prefix/counter)
- [x] Admin Settings page
- [x] TablePayment model (per-payment, supports multiple methods)
- [x] Invoice page: item checklist, GST breakdown, partial payments panel
- [x] Payment persistence via `/api/admin/tables/[id]/payment`
- [x] Table settle endpoint: marks orders DONE, resets table to AVAILABLE
- [x] Print-optimised invoice layout (sidebar hidden on print)
- [x] Sequential invoice numbering (increments on each invoice load)

### Dashboard Enhancements *(added 2026-06-12)*
- [x] Order timestamp shown on every card
- [x] Source badge: "QR" vs waiter name
- [x] Audio notification on new PENDING orders (Web Audio API chime)
- [x] "New order received" toast
- [x] Source filter in order history
- [x] Table status (AVAILABLE / OCCUPIED) in admin tables page
- [x] "Invoice" button on occupied tables

---

## 🔲 Backlog / Future

- [ ] SMS integration for OTP (MSG91 / Twilio)
- [ ] Daily revenue analytics page
- [ ] Product inventory / out-of-stock toggle
- [ ] Customer-facing order status tracker (polling page)
- [ ] Printer integration (thermal receipt printer via WebUSB / ESC-POS)
- [ ] Multi-location support
- [ ] Shift summary report for waiters
