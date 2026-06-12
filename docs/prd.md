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

### 5. Invoice Generation
- Navigate to `/admin/tables/[id]/invoice` from Tables page
- Shows all non-cancelled orders for the table (items selectable)
- Auto-generated sequential invoice number (`INV-0042`)
- Itemised list with per-item amounts
- GST breakdown: Subtotal → CGST → SGST → Total
- Waiter name and table label on header
- Partial payment panel: Cash / Card / UPI, multiple entries
- Live balance calculation
- Print via `window.print()` — only invoice visible in print
- "Mark Table Settled" when balance = 0 → resets table to AVAILABLE

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

---

## Data Model Summary

- **Table**: number, label, status (AVAILABLE | OCCUPIED)
- **Order**: tableId, status, source (CUSTOMER | WAITER), phone, notes, total, waiterId, timestamps
- **OrderItem**: snapshot of product name + price at order time
- **Waiter**: name, pin (bcrypt), active flag
- **CafeSettings**: singleton row for all invoice/tax config
- **TablePayment**: per-payment record (method, amount, invoiceNumber)
- **OtpSession**: phone, code, verified, expiresAt

---

## Non-Functional Requirements
- TypeScript strict mode throughout
- All prices stored in paise (integer), displayed in ₹
- JWT auth: Admin (24h), Waiter (10h), OTP (2h)
- Dev OTP bypass: code `000000` always succeeds in non-production
