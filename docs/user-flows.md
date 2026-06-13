# User Flows

## 1. Customer — QR Order Flow

```
1. Customer scans QR code on table
2. Opens /order/[tableId]
3. Browses menu (category tabs, product cards)
4. Adds items to cart (+ / - buttons)
5. Taps "View Cart" → cart drawer opens
6. Adds optional special instructions
7. Taps "Proceed to Verify"
8. Enters mobile number
9. Taps "Send OTP" → OTP logged to console (or SMS in prod)
10. Enters 6-digit OTP (dev: use 000000)
11. Taps "Place Order" → POST /api/orders (source: CUSTOMER)
12. Confirmation screen: order ID, items, total, "pay at counter" reminder
```

---

## 2. Waiter — Tableside Order Flow

```
1. Waiter opens /waiter/login on cafe device
2. Selects their name from dropdown
3. Enters 4–6 digit PIN
4. Lands on /waiter/tables — table grid with AVAILABLE/OCCUPIED status
5. Taps a table
6. Browses menu, adds items (same UX as customer, no OTP)
7. Taps "View Cart" → reviews items, adds notes
8. Taps "Place Order" → POST /api/orders (source: WAITER, waiterId from cookie)
9. Confirmation screen → "New Order" (same table) or "All Tables"
10. Table status changes to OCCUPIED
```

---

## 3. Admin — Order Lifecycle

```
1. Admin opens /admin/dashboard
2. Sees PENDING orders (with audio chime + toast if new)
3. Confirms order → CONFIRMED
4. Kitchen starts → PREPARING
5. Ready to serve → READY
6. Customer receives → DONE
   OR at any point: Cancel → CANCELLED
7. Can also manage statuses in /admin/orders history
```

---

## 4. Admin — Invoice & Payment Flow

```
1. Admin opens /admin/tables
2. Sees table marked "Occupied" with amber badge
3. Clicks "Invoice" button
4. /admin/tables/[id]/invoice loads:
   - All non-cancelled orders for the table
   - Invoice number generated (INV-XXXX), counter incremented
5. Admin reviews items (can uncheck to exclude from invoice)
6. Invoice shows: subtotal, CGST, SGST, grand total
7. Admin records payments in right panel:
   - Selects Cash / Card / UPI
   - Enters amount (can split across methods)
   - Clicks "Add Payment"
   - Balance updates live
8. When balance = 0: "Mark Table Settled" button appears
9. Admin clicks it → all active orders marked DONE, table → AVAILABLE
10. Admin clicks "Print Invoice" → browser print dialog, only invoice visible
```

---

## 5. Admin — Waiter Management

```
1. Admin opens /admin/waiters
2. Clicks "Add Waiter"
3. Enters name + 4–6 digit PIN → saved with bcrypt hash
4. Waiter can now log in at /waiter/login
5. Admin can edit name, reset PIN, deactivate, or delete waiter
```

---

## 6. Admin — Cafe Settings

```
1. Admin opens /admin/settings
2. Fills in: cafe name, tagline, address, phone, email, GSTIN
3. Sets CGST % and SGST % (default 2.5% each)
4. Sets invoice prefix (default "INV")
5. Sets dashboard mode: Kanban or Item view
6. Saves → all invoices will use these details
7. Next invoice number is shown as preview (e.g. INV-0005)
```

---

## 7. Customer — Call Waiter / Request Bill

```
1. Customer is on /order/[tableId] (after placing an order)
2. Sees "Call Waiter" and "Request Bill" buttons on the confirmation screen
3. Taps a button → POST /api/table-requests with type CALL_WAITER or BILL_REQUEST
4. A TableRequest is created (status: PENDING)
5. Waiter and admin portals display a persistent alert banner for this table
6. Waiter or admin taps "Mark Attended"
   → PATCH /api/waiter/table-requests/[id]/attend or /api/admin/table-requests/[id]/attend
7. Alert is dismissed; request recorded as ATTENDED with timestamp and attendee name
```

---

## 8. Waiter — Handling Table Requests

```
1. Waiter is logged in and working on any screen
2. A pending TableRequest banner appears at the top of the layout
3. Banner shows: table name, request type (Call Waiter / Bill Request), time
4. Waiter taps "Mark Attended" → request is resolved
5. Multiple pending requests shown as a list in the banner
```

---

## 9. Admin — Handling Table Requests

```
1. Admin sees pending table request banner in admin layout
2. Also visible in /admin/dashboard as a dedicated "Table Requests" panel
3. Admin reviews the request and taps "Mark Attended"
4. Request resolved; attendedBy set to admin
```

---

## 10. Waiter — Invoice Flow

```
1. Waiter taps "Invoice" button on the ordering screen or via /waiter/invoices
2. Redirected to invoice editor (same UI as admin)
3. Can review items, add products from menu, adjust quantities, add discount/notes
4. Records payments (Cash / Card / UPI)
5. Taps "Settle Invoice" to close the session
6. Table resets to AVAILABLE (if no remaining uninvoiced items)
```
