# Database Schema Reference

Single PostgreSQL database via Prisma. All prices in **paise** (integer). See `prisma/schema.prisma` for the canonical definition.

---

## Models

### Table
| Field | Type | Notes |
|---|---|---|
| id | String (cuid) | PK |
| number | Int | Unique table number |
| label | String | Display name (e.g. "Patio A") |
| status | TableStatus | AVAILABLE \| OCCUPIED |
| sessionStartedAt | DateTime? | Set when table first becomes OCCUPIED |
| orders | Order[] | Relation |
| payments | TablePayment[] | Relation |
| invoices | Invoice[] | Relation |
| tableRequests | TableRequest[] | Relation |

### Order
| Field | Type | Notes |
|---|---|---|
| id | String (cuid) | PK |
| tableId | String | FK → Table |
| status | OrderStatus | PENDING \| CONFIRMED \| PREPARING \| READY \| DONE \| CANCELLED |
| source | OrderSource | CUSTOMER \| WAITER |
| phone | String | Customer phone (empty for waiter orders) |
| notes | String? | Optional special instructions |
| total | Int | Paise |
| waiterId | String? | FK → Waiter (null for customer orders) |
| items | OrderItem[] | Relation |
| createdAt | DateTime | Order timestamp |
| updatedAt | DateTime | Last status change |

### OrderItem
| Field | Type | Notes |
|---|---|---|
| id | String (cuid) | PK |
| orderId | String | FK → Order (cascade delete) |
| productId | String | FK → Product |
| quantity | Int | |
| price | Int | Paise (snapshot at order time) |
| name | String | Product name snapshot |
| status | OrderItemStatus | PENDING \| CONFIRMED \| PREPARING \| READY \| DELIVERED |
| invoicedAt | DateTime? | Set when item is included in a settled invoice |
| invoiceItem | InvoiceItem? | Relation |
| createdAt | DateTime | |

### Invoice
| Field | Type | Notes |
|---|---|---|
| id | String (cuid) | PK |
| invoiceNumber | String | Unique (e.g. "INV-0042") |
| tableId | String? | FK → Table (nullable for manual invoices) |
| tableName | String | Snapshot of table label |
| status | InvoiceStatus | DRAFT \| ISSUED \| SETTLED |
| notes | String? | Printed note |
| discount | Int | Paise (applied before GST) |
| items | InvoiceItem[] | Relation |
| payments | TablePayment[] | Relation |
| waiterId | String? | Assigned waiter ID |
| waiterName | String? | Snapshot of waiter name |
| sessionStart | DateTime? | Start of table session |
| sessionEnd | DateTime? | Set on settle |
| createdAt | DateTime | |
| settledAt | DateTime? | Set on settle |

### InvoiceItem
| Field | Type | Notes |
|---|---|---|
| id | String (cuid) | PK |
| invoiceId | String | FK → Invoice (cascade delete) |
| name | String | Item name (manual or from order) |
| quantity | Int | |
| price | Int | Paise |
| orderItemId | String? | FK → OrderItem (null for manual items) |

### Waiter
| Field | Type | Notes |
|---|---|---|
| id | String (cuid) | PK |
| name | String | Display name |
| pin | String | bcrypt hash of 4–6 digit PIN |
| active | Boolean | Default true |
| orders | Order[] | Relation |
| createdAt/updatedAt | DateTime | |

### CafeSettings (singleton)
| Field | Type | Default | Notes |
|---|---|---|---|
| id | String | "singleton" | Always one row |
| cafeName | String | "Coffee? Since 1999" | |
| tagline | String | "" | |
| address | String | "" | |
| phone | String | "" | |
| email | String | "" | |
| gstNumber | String | "" | GSTIN |
| cgstRate | Float | 2.5 | % |
| sgstRate | Float | 2.5 | % |
| invoicePrefix | String | "INV" | |
| invoiceCounter | Int | 1 | Auto-increments on each invoice |
| dashboardMode | DashboardMode | KANBAN | KANBAN \| ITEM |

### TablePayment
| Field | Type | Notes |
|---|---|---|
| id | String (cuid) | PK |
| tableId | String | FK → Table |
| invoiceId | String? | FK → Invoice |
| amount | Int | Paise |
| method | PaymentMethod | CASH \| CARD \| UPI |
| note | String? | Optional label |
| createdAt | DateTime | |

### TableRequest
| Field | Type | Notes |
|---|---|---|
| id | String (cuid) | PK |
| tableId | String | FK → Table |
| tableName | String | Snapshot of table label |
| type | TableRequestType | CALL_WAITER \| BILL_REQUEST |
| status | TableRequestStatus | PENDING \| ATTENDED |
| createdAt | DateTime | |
| attendedAt | DateTime? | Set when attended |
| attendedBy | String? | Name of waiter/admin who attended |

### OtpSession
| Field | Type | Notes |
|---|---|---|
| id | String (cuid) | PK |
| phone | String | |
| code | String | 6-digit plain code |
| verified | Boolean | Default false |
| expiresAt | DateTime | 10 minutes from creation |
| createdAt | DateTime | |

---

## Enums

```
OrderStatus:        PENDING | CONFIRMED | PREPARING | READY | DONE | CANCELLED
OrderSource:        CUSTOMER | WAITER
OrderItemStatus:    PENDING | CONFIRMED | PREPARING | READY | DELIVERED
InvoiceStatus:      DRAFT | ISSUED | SETTLED
DashboardMode:      KANBAN | ITEM
PaymentMethod:      CASH | CARD | UPI
TableStatus:        AVAILABLE | OCCUPIED
TableRequestType:   CALL_WAITER | BILL_REQUEST
TableRequestStatus: PENDING | ATTENDED
```
