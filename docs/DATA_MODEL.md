# Data Model — pos-platform

This is a first full pass at field-level entity definitions, so implementation doesn't require ad-hoc field decisions. Treat this as the working draft — review and adjust before Phase 1 implementation starts, then it becomes the source of truth (mirrored into `backend/prisma/schema.prisma` and `frontend/src/types/*.ts` via Zod).

## Money and quantity convention (confirmed)

All money fields are **integers in the smallest currency unit** (paise, not rupees) — e.g. ₹149.50 is stored as `14950`. This avoids floating-point rounding errors compounding across tax, discounts, and totals. Convert to rupees only for display.

---

## Core entities

### Business
| Field | Type | Notes |
|---|---|---|
| id | uuid | |
| name | string | set at signup — minimal, just the business's name |
| businessType | enum, nullable | `pharmacy`, `clothing`, `grocery`, ... — determines active module. Null until onboarding is completed |
| address | string, nullable | captured during onboarding, not signup |
| gstNumber | string, nullable | captured during onboarding |
| phone | string, nullable | captured during onboarding |
| email | string, nullable | |
| onboardingCompleted | boolean | false at signup; true once the owner finishes the onboarding flow. The app gates access to Dashboard/Checkout/etc. on this — an incomplete business is routed to Onboarding instead |
| createdAt | datetime | |

### User
| Field | Type | Notes |
|---|---|---|
| id | uuid | |
| businessId | uuid (FK) | |
| name | string | |
| email | string | unique per business |
| passwordHash | string | bcrypt |
| role | enum | `owner`, `manager`, `cashier`, `inventory_staff` — permission mapping lives in code (`lib/permissions.ts`), not a DB table, for MVP simplicity |
| phone | string, nullable | |
| isActive | boolean | deactivating a user, not deleting — preserves audit history |
| createdAt | datetime | |

### Product
| Field | Type | Notes |
|---|---|---|
| id | uuid | |
| businessId | uuid (FK) | |
| name | string | |
| sku | string, nullable | |
| barcode | string, nullable | |
| categoryId | uuid (FK), nullable | |
| priceMinor | integer | selling price, in paise |
| costPriceMinor | integer | for margin reporting |
| taxRatePercent | decimal | e.g. 12.00 for 12% GST |
| unit | enum | `piece`, `kg`, `litre`, ... |
| lowStockThreshold | integer | |
| imageUrl | string, nullable | |
| isActive | boolean | |
| createdAt / updatedAt | datetime | |

Note: **no `currentStock` field.** Stock is always derived by summing `StockMovement` rows for the product (per RULES.md #5) — never stored/mutated directly on Product.

### ProductCategory
| Field | Type |
|---|---|
| id | uuid |
| businessId | uuid (FK) |
| name | string |

### Customer
| Field | Type | Notes |
|---|---|---|
| id | uuid | |
| businessId | uuid (FK) | |
| name | string | |
| phone | string, nullable | |
| email | string, nullable | |
| address | string, nullable | |
| createdAt | datetime | |

Note: outstanding balance is derived from Sale/Payment records, not stored directly — same principle as stock.

### Supplier
| Field | Type |
|---|---|
| id | uuid |
| businessId | uuid (FK) |
| name | string |
| phone | string, nullable |
| email | string, nullable |
| address | string, nullable |

### Sale (an invoice/transaction)
| Field | Type | Notes |
|---|---|---|
| id | uuid | |
| businessId | uuid (FK) | |
| invoiceNumber | string | unique per business, sequential |
| customerId | uuid (FK), nullable | nullable = walk-in customer |
| userId | uuid (FK) | cashier who made the sale |
| subtotalMinor | integer | |
| taxAmountMinor | integer | |
| discountAmountMinor | integer | |
| totalAmountMinor | integer | |
| status | enum | `completed`, `voided`, `partially_refunded`, `refunded` — this tracks the transaction/goods lifecycle only. Stock moves as soon as a sale is `completed`, regardless of whether it's been paid in full (see Payment status below). |
| createdAt | datetime | |

**Payment status is derived, not stored** — same principle as stock and customer balance. Computed as `sum(Payment.amountMinor where status=completed)` vs `totalAmountMinor`:
- `unpaid` — nothing paid yet
- `partially_paid` — some paid, balance still due (this is the credit/udhaar case)
- `paid` — fully covered

### SaleItem
| Field | Type |
|---|---|
| id | uuid |
| saleId | uuid (FK) |
| productId | uuid (FK) |
| quantity | integer |
| unitPriceMinor | integer |
| discountMinor | integer |
| taxAmountMinor | integer |
| lineTotalMinor | integer |

### Payment
| Field | Type | Notes |
|---|---|---|
| id | uuid | |
| saleId | uuid (FK) | |
| method | enum | `cash`, `upi`, `card` — real payment instruments only; there is no `credit` method, since a credit sale is simply one whose payments don't yet sum to the total |
| amountMinor | integer | |
| status | enum | `completed`, `failed`, `refunded` |
| createdAt | datetime | |

A Sale can have more than one Payment row two ways: **split payment at checkout** (e.g. part cash, part UPI, same transaction), and **repayment against an existing credit sale** (customer returns later and pays off some or all of what they owe — a new Payment row is added to the same Sale, via a separate `recordPayment` action, not `createSale`). Both cases are the same underlying mechanism: Payment rows accumulate against a Sale until its derived status reaches `paid`.

**Customer outstanding balance is also derived**, not stored: sum of `(totalAmountMinor − paid so far)` across all of that customer's non-voided sales.

**Multi-sale repayment (paying off general "udhaar," not one specific bill).** A customer's outstanding balance can span several past sales. `recordCustomerRepayment(customerId, amountMinor, method)` is the higher-level action for this: it fetches that customer's outstanding sales oldest-first, and applies the payment across them in order — creating one `Payment` row per sale it touches — until either the amount is exhausted or every due sale reaches `paid`. It's built on top of `recordPayment`, not a replacement for it. The amount is capped at the customer's total outstanding balance (per the overpayment decision — excess cash is change given at the counter, never stored).

**Receipts are rendered from Sale + Payment data, not stored as a separate entity.** A purchase receipt is generated from a Sale (its items, totals, and any prior outstanding balance shown alongside). A repayment-only receipt (customer visits just to pay off dues, no new purchase) is generated from the list of `Payment` rows a `recordCustomerRepayment` call just created, showing which sales were paid down and the new remaining balance. This is a deliberate choice to avoid a redundant "Receipt" table when everything a receipt needs already exists on Sale/Payment — flag if you'd rather have receipts as their own persisted, immutable record instead (e.g. for reprinting exactly what was shown at the time, independent of any later changes).

### StockMovement
| Field | Type | Notes |
|---|---|---|
| id | uuid | |
| businessId | uuid (FK) | |
| productId | uuid (FK) | |
| type | enum | `purchase`, `sale`, `return`, `damage`, `adjustment`, `transfer` |
| quantity | integer | positive or negative |
| referenceType | enum, nullable | `sale`, `purchase`, `manual` |
| referenceId | uuid, nullable | links back to the Sale/Purchase that caused it |
| reason | string, nullable | required for `adjustment` and `damage` |
| userId | uuid (FK) | who triggered it |
| createdAt | datetime | |

### Purchase
| Field | Type |
|---|---|
| id | uuid |
| businessId | uuid (FK) |
| supplierId | uuid (FK) |
| invoiceNumber | string, nullable |
| totalAmountMinor | integer |
| status | enum: `pending`, `received` |
| createdAt | datetime |

### PurchaseItem
| Field | Type |
|---|---|
| id | uuid |
| purchaseId | uuid (FK) |
| productId | uuid (FK) |
| quantity | integer |
| unitCostMinor | integer |
| batchId | uuid (FK), nullable — set when the module is pharmacy |

### AuditLog
| Field | Type | Notes |
|---|---|---|
| id | uuid | |
| businessId | uuid (FK) | |
| userId | uuid (FK) | |
| action | string | e.g. `sale.void`, `stock.adjust`, `user.deactivate` |
| entityType | string | |
| entityId | uuid | |
| oldValue | json, nullable | |
| newValue | json, nullable | |
| reason | string, nullable | |
| createdAt | datetime | |

---

## Pharmacy module entities

### ProductBatch
| Field | Type | Notes |
|---|---|---|
| id | uuid | |
| productId | uuid (FK to core Product) | extension table — no new columns added to Product itself |
| batchNumber | string | |
| expiryDate | date | |
| manufacturer | string, nullable | |
| quantityReceived | integer | |
| costPriceMinor | integer | |
| createdAt | datetime | |

A sale of a pharmacy product should reference which batch was sold from (added to SaleItem via a nullable `batchId` when the pharmacy module is active — module extends core's SaleItem usage, doesn't alter its schema).

### Prescription
| Field | Type | Notes |
|---|---|---|
| id | uuid | |
| saleId | uuid (FK), nullable | linked once the sale completes |
| patientName | string | |
| doctorName | string, nullable | |
| fileUrl | string, nullable | scanned/uploaded prescription |
| verifiedByUserId | uuid (FK) | pharmacist/staff who verified it |
| createdAt | datetime | |