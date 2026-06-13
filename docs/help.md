# Coffee Since 1999 — Staff Portal Help Guide

Last updated: 2026-06-13 (commits c798c85 → 34761ee)

---

## Overview

The system has two staff-facing portals:
- **Admin Portal** — `/admin` — full control over the cafe operation
- **Waiter Portal** — `/waiter` — streamlined tablet/phone UI for tableside ordering

Customers order via **QR codes** printed for each table — scanning opens `/order/[tableId]`.

---

## Admin Portal

### Login
- URL: `/admin/login`
- Enter the admin password configured in your environment (`ADMIN_PASSWORD`)

### Dashboard (`/admin/dashboard`)
Live view of all active orders, auto-refreshes every 30 seconds with an audio chime on new orders.

**Two display modes (set in Settings):**
- **Kanban mode** — orders grouped by status columns (Pending → Confirmed → Preparing → Ready → Done)
- **Item mode** — every individual item across all orders in status columns

**Per-item status:** Click the ↑ arrow button on any item to advance its status through: `Pending → Confirmed → Preparing → Ready → Delivered`

**Source badge:** Orders show a "QR" or "Waiter" tag. Waiter orders also show the waiter's name.

**Audio notification:** A two-tone chime plays when a new Pending order arrives. Click anywhere on the page first to enable browser audio.

**Table Requests panel:** Shows pending "Call Waiter" and "Request Bill" alerts from customers. Each entry shows the table name, request type, and time. Click "Mark Attended" to dismiss. Also visible as a persistent banner in the admin sidebar when requests are outstanding.

---

### Tables (`/admin/tables`)
Manage physical tables and their QR codes.

- **Add Table** — enter a table number and display label (e.g. "Patio A", "Window Seat")
- **Bulk Add** — quickly add multiple numbered tables at once
- **Status badge** — shows Occupied (amber) or Available (green)
- **QR Code** — click "Show QR" to preview; "Download" to save a printable PNG
- **Invoice button** — amber when occupied (uninvoiced items exist), outlined when empty — always clickable to create a new invoice for that table

### Sidebar Notification Badges
The admin sidebar shows badge counts on:
- **Invoices** — number of Draft/open invoices
- **Dashboard** — number of pending table requests (Call Waiter / Bill Request)

---

### Orders (`/admin/orders`)
Full history of all orders with filters:
- Filter by status: All, Pending, Confirmed, Preparing, Ready, Done, Cancelled
- Filter by source: All, QR (customer), Waiter
- Shows: table label, date/time, source, waiter name, items, total
- Click an order to update its status

---

### Invoices (`/admin/invoices`)

#### Invoice list
All invoices with status filter (Draft / Issued / Settled). Click "Open" to view/edit.

#### Creating an invoice
**From a table:** Click the Invoice button on any table card → a new Draft invoice is automatically created with all uninvoiced items for that table, then you land on the invoice editor.

**Blank manual invoice:** Click "New Invoice" on the invoices list page — creates a blank invoice you can fill manually.

#### Invoice editor
- **Items section** — all order items for the table are listed with checkboxes. Uncheck any item to exclude it from this invoice. Use "Add item" to add a manual line (name, qty, price in ₹). Use the product picker to add items directly from the menu.
- **Quantity editing** — edit the quantity of any line item directly in the editor
- **Waiter assignment** — select or reassign the waiter for this invoice via dropdown
- **Discount** — enter a discount amount in ₹ (applied to the total before GST)
- **Notes** — internal or printed note on the invoice
- **Payments** — record partial or full payments: select method (Cash / Card / UPI), enter amount, click Add. Multiple payment entries are supported. The running balance updates live.
  - Edit an existing payment entry (change amount or method)
  - Delete a payment entry
- **Save Draft** — saves changes without settling
- **Settle Invoice** — marks invoice as Settled, stamps all included items as invoiced, and resets the table session. If the table has remaining uninvoiced items, it stays Occupied; otherwise it resets to Available.
- **Print** — opens a print dialog showing only the formatted invoice (header, items, GST breakdown, payments)

#### After settling
- The table session resets. A new invoice for the same table will only include items ordered after the settlement.
- The settled invoice remains accessible in `/admin/invoices` for records.

---

### Waiters (`/admin/waiters`)
Manage waiter accounts.

- **Add waiter** — enter name and a 4–6 digit PIN
- **Edit** — update name or reset PIN
- **Toggle active** — deactivate a waiter without deleting their order history
- **Delete** — permanently removes the waiter record

---

### Settings (`/admin/settings`)
Configure cafe details used on printed invoices:

| Field | Description |
|---|---|
| Cafe Name | Printed at top of invoice |
| Tagline | Subtitle line |
| Address | Full address on invoice |
| Phone / Email | Contact details |
| GST Number | GSTIN printed on invoice |
| CGST Rate % | Central GST rate (default 2.5%) |
| SGST Rate % | State GST rate (default 2.5%) |
| Invoice Prefix | Prefix for invoice numbers (e.g. "INV" → INV-0001) |

**Dashboard Mode:** Switch between Kanban and Item view for the live dashboard.

---

## Waiter Portal

### Login
- URL: `/waiter/login`
- Select your name from the dropdown, then enter your PIN

### Tables (`/waiter/tables`)
Grid of all tables showing:
- Table number and label
- Status (Occupied = amber, Available = white)
- Active order count badge if orders are in progress

Tap a table to go to the ordering screen.

### Table Request Alerts
When a customer taps "Call Waiter" or "Request Bill" on their ordering screen, a persistent alert banner appears at the top of the waiter portal. The banner shows:
- Table name and request type
- Time the request was made
- "Mark Attended" button to dismiss

Multiple pending requests are shown as a list. The alert stays visible across all waiter portal pages until resolved.

### Ordering screen (`/waiter/[tableId]`)

**Menu tab:**
- Search bar at top — searches across all items by name or description
- Category filter tabs — tap to filter by category; hidden during search
- Items shown in responsive grid (1 col on phone, 2 on tablet, 3 on desktop)
- Each card shows: image, name, dietary icons (leaf = veg/vegan), tag, description, price, and Add/quantity controls
- Cart button (top right) shows current total

**Cart drawer:**
- Adjust quantities
- Add special instructions
- Tap "Place Order" to submit — no OTP required for waiters

**Today's History tab:**
- Shows all orders placed for this table today (including settled sessions)
- Each order shows: time, waiter name, status
- Each item shows: name, quantity, per-item status, time ordered

**Invoice button (top right):** Create an invoice for the table at any time. Tapping opens the shared invoice editor (same as admin).

### Waiter Invoices (`/waiter/invoices`)
Waiters have their own invoice list page showing all invoices (Draft / Issued / Settled). Waiters can:
- View and edit any Draft or Issued invoice
- Create a blank invoice manually
- Record payments, adjust items, and settle invoices
- Print invoices

Sidebar shows a badge count for open (non-settled) invoices.

### After placing an order
- Confirmation screen shows items and total
- "New Order" button to take another order for the same table
- "All Tables" to go back to the table grid

---

## Customer QR Ordering

Customers scan the QR code at their table. This opens `/order/[tableId]`:
1. Browse menu by category or use the search bar
2. Add items to cart
3. Enter mobile number → receive OTP → verify
4. Order is placed and appears in the admin dashboard

After placing an order, customers see a confirmation screen with two additional buttons:
- **Call Waiter** — sends an alert to the waiter and admin portals requesting waiter assistance
- **Request Bill** — sends an alert indicating the table wants to pay

> **Note:** During development, OTP code `000000` can be used to bypass verification.

---

## Invoice Format

Printed invoices include:
- Cafe name, address, phone, email, GSTIN
- Invoice number (e.g. INV-0042), date/time
- Table label and waiter name
- Itemised list with quantity, unit rate, and line total
- Subtotal, CGST, SGST, and grand total
- Payment entries (Cash / Card / UPI splits)
- Balance due
- Session duration (for settled invoices): total time the group sat

---

## Roles & Permissions

| Feature | Admin | Waiter |
|---|---|---|
| View dashboard | ✓ | — |
| Update order status | ✓ | — |
| Manage menu / tables | ✓ | — |
| Manage waiters | ✓ | — |
| Edit settings | ✓ | — |
| Place orders | ✓ | ✓ |
| View table history | ✓ | ✓ (today only) |
| Create / settle invoices | ✓ | ✓ |
| Print invoices | ✓ | ✓ |
| Attend table requests | ✓ | ✓ |
| Receive table request alerts | ✓ | ✓ |

---

## Common Workflows

### End-of-table billing
1. Waiter or admin taps Invoice on the table
2. Review items, uncheck any to exclude
3. Enter discount if applicable
4. Record payment(s) — Cash, Card, or UPI
5. Once balance is ₹0, tap "Settle Invoice"
6. Table resets to Available

### Waiter shift start
1. Admin creates waiter account in `/admin/waiters`
2. Waiter logs in at `/waiter/login` with name + PIN
3. Waiter selects table → takes order → confirms

### Adding a new menu item
1. Go to `/admin/menu`
2. Add product with name, price, category, description, image URL
3. Toggle active to make it visible on ordering screens

### Printing QR codes for tables
1. Go to `/admin/tables`
2. Click "Download" on each table → saves a PNG
3. Print and laminate for each table

---

*This document should be updated whenever a new feature is added or an existing flow changes.*
