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
| orders | Order[] | Relation |
| payments | TablePayment[] | Relation |

### Order
| Field | Type | Notes |
|---|---|---|
| id | String (cuid) | PK |
| tableId | String | FK → Table |
| status | OrderStatus | PENDING \| CONFIRMED \| PREPARING \| READY \| DONE \| CANCELLED |
| source | OrderSource | CUSTOMER \| WAITER |
| phone | String | Customer phone (empty for waiter orders) |
| notes | String? | Special instructions |
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

### TablePayment
| Field | Type | Notes |
|---|---|---|
| id | String (cuid) | PK |
| tableId | String | FK → Table |
| invoiceNumber | String | Links to CafeSettings counter |
| amount | Int | Paise |
| method | PaymentMethod | CASH \| CARD \| UPI |
| note | String? | Optional label |
| createdAt | DateTime | |

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
OrderStatus:   PENDING | CONFIRMED | PREPARING | READY | DONE | CANCELLED
OrderSource:   CUSTOMER | WAITER
PaymentMethod: CASH | CARD | UPI
TableStatus:   AVAILABLE | OCCUPIED
```
