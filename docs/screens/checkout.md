# Screen: Checkout

## Purpose
Record a sale — search/select products, optionally select a customer, take payment (including split payment or partial/credit payment), and produce a receipt.

## Data it needs

**Product search results**
```
{ id, name, sku, priceMinor, taxRatePercent, currentStock }
```

**Cart item**
```
{ productId, name, quantity, unitPriceMinor, discountMinor, taxAmountMinor, lineTotalMinor }
```

**Selected customer (optional — nullable for walk-in)**
```
{ id, name, phone, outstandingBalanceMinor }
```
`outstandingBalanceMinor` is fetched via `getOutstandingBalance(customerId)` the moment a customer is selected.

**Sale totals**
```
{ subtotalMinor, taxAmountMinor, discountAmountMinor, totalAmountMinor }
```

**Payment**
```
{ method: 'cash' | 'upi' | 'card', amountMinor }[]
```
Supports more than one row (split payment).

## Actions

- Search products, add to cart
- Adjust quantity or remove a cart item
- Apply a discount (per-item or whole-sale)
- Select a customer (or leave as walk-in)
- Add one or more payment rows (split payment across methods)
- Complete sale — calls `createSale`; if the payment total is less than the sale total, the sale still completes as `partially_paid` (credit) rather than being blocked
- Void a completed sale (separate action, not part of the main flow)
- Print receipt — shown after a successful sale: current purchase items/total, the customer's prior outstanding balance (if any), amount paid now, and the new remaining balance, all on one bill

## States

- Empty cart (nothing added yet)
- Item search returns no stock / item unavailable
- Payment incomplete (payment rows sum to less than total) — allowed to proceed as credit, not an error state, but shown clearly to the cashier before confirming
- Success (sale completed, receipt shown/printable)
- Error (e.g. concurrent stock conflict, network/API failure)

## Explicitly NOT this screen's job
- Editing product details (name, price) — that's the Product screen
- Managing customer records beyond selecting one — that's the Customer screen
- Collecting a customer's *general* outstanding balance unrelated to today's purchase — that's the Customer Credit screen (`recordCustomerRepayment`), Phase 3