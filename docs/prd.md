# Product Requirements Document — Coffee? Since 1999

## Overview
A full-stack cafe management system built on Next.js 16. Customers order via QR code; waiters order via authenticated devices; admins manage the kitchen, tables, invoices, and staff.

---

## User Roles

| Role | Entry Point | Auth |
|---|---|---|
| Customer | `/order/[tableId]` (QR scan) | OTP via phone |
| Waiter | `/waiter` | Name selection + PIN |
| Admin | `/admin` | Email + password |

---

## Core Features

### 1. Customer Ordering (QR Flow)
- Scan QR code → browse full menu by category
- Add/remove items, add special instructions
- Verify phone via OTP → order placed automatically
- Confirmation screen with order summary

### 2. Waiter Ordering
- Login with name + 4–6 digit PIN at `/waiter/login`
- Select table from grid (AVAILABLE / OCCUPIED status shown)
- Same menu interface — no OTP required
- Order submitted with `source: WAITER` + waiter identity
- Success screen with "New Order" / "All Tables" options

### 3. Admin Dashboard (Live Orders)
- Kanban columns: PENDING → CONFIRMED → PREPARING → READY
- Shows timestamp, source (QR / Waiter name), order items, notes, total
- Advance order through statuses or cancel
- Audio notification (two-tone chime) on new PENDING orders
- "New order received" toast notification
- Auto-refreshes every 30 seconds

### 4. Admin Order History
- Filter by date, status, source (QR / Waiter)
- Expandable rows with full item list, notes, waiter/phone info
- Manual status overrides

### 5. Invoice Generation & Management
- Invoice list at `/admin/invoices` (and `/waiter/invoices`) with status filter: Draft / Issued / Settled
- Create from a table (auto-fills uninvoiced items) or blank manual invoice
- Auto-generated sequential invoice number (`INV-0042`, counter in CafeSettings)
- Invoice editor (shared between admin and waiter):
  - Items section: checkboxes to include/exclude, "Add item" for manual line items, product picker from menu
  - Quantity editing per line item
  - Discount field (₹ amount applied before GST)
  - Notes field (printed on invoice)
  - Waiter assignment dropdown
  - GST breakdown: Subtotal → CGST → SGST → Grand Total
- Payment panel: Cash / Card / UPI entries, multiple splits supported
  - Edit or delete existing payment entries
  - Live balance calculation
- "Settle Invoice" — stamps included items as invoiced, resets table session
- Invoice delete (from list page)
- Print via `window.print()` — only invoice visible in print
- Sidebar notification badge showing draft/open invoice count

### 6. Admin: Table Management
- CRUD for tables (number + label)
- Bulk table creation
- QR code preview and download
- AVAILABLE / OCCUPIED status badge
- "Invoice" button visible when table is OCCUPIED

### 7. Admin: Menu Management
- Category and product CRUD
- Toggle active/inactive, veg/vegan flags, signature items
- Image URL with preview

### 8. Admin: Waiter Management (`/admin/waiters`)
- Create waiters with name + PIN (bcrypt-hashed)
- Edit name, reset PIN
- Toggle active/inactive
- Delete (with confirmation)

### 9. Admin: Cafe Settings (`/admin/settings`)
- Cafe name, tagline, address, phone, email
- GSTIN, CGST rate, SGST rate
- Invoice prefix and current counter preview
- Dashboard mode: Kanban or Item view

### 10. Table Requests (Call Waiter / Request Bill)
- Customer order page shows "Call Waiter" and "Request Bill" buttons
- Tapping posts a `TableRequest` (type: CALL_WAITER or BILL_REQUEST)
- Admin layout polls for pending requests — shows a persistent banner with table name and request type
- Waiter layout polls for pending requests — same persistent banner
- "Mark Attended" dismisses the request (records who attended and timestamp)
- Requests are scoped by role: waiter API serves waiter portal; admin API serves admin portal

---

## Data Model Summary

- **Table**: number, label, status (AVAILABLE | OCCUPIED)
- **Order**: tableId, status, source (CUSTOMER | WAITER), phone, notes, total, waiterId, timestamps
- **OrderItem**: snapshot of product name + price at order time
- **Waiter**: name, pin (bcrypt), active flag
- **CafeSettings**: singleton row for all invoice/tax config
- **Invoice**: invoice number, status (DRAFT/ISSUED/SETTLED), items, discount, notes, session timestamps
- **InvoiceItem**: snapshot of name/qty/price; optionally linked to an OrderItem
- **TablePayment**: per-payment record (method, amount, linked to Invoice)
- **TableRequest**: customer request record (CALL_WAITER/BILL_REQUEST, PENDING/ATTENDED)
- **OtpSession**: phone, code, verified, expiresAt

---

## Non-Functional Requirements
- TypeScript strict mode throughout
- All prices stored in paise (integer), displayed in ₹
- JWT auth: Admin (24h), Waiter (10h), OTP (2h)
- Dev OTP bypass: code `000000` always succeeds in non-production
