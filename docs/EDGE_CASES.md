# Edge Cases — pos-platform

This app handles real money and stock. This list drives TDD for anything in `backend/src/services/` — per RULES.md #9 and #13, the relevant edge cases below must have a failing test written before the implementation. Add newly discovered edge cases here as they come up.

## Sale creation
- Selling more units than current stock allows (including when stock is exactly 0)
- Two sales attempting to deduct the last unit of stock at the same time (concurrency)
- A sale with zero items
- A line item with zero or negative quantity
- A discount that exceeds the item's price (resulting total shouldn't go negative)
- Tax rounding across multiple line items summing incorrectly vs. the invoice total
- Duplicate invoice number generated under concurrent sale creation
- Payment amount not matching the sale total (both underpayment and overpayment)
- A sale split across multiple payment methods (e.g. part cash, part UPI)
- Selling to a walk-in customer (no customerId) vs. a registered customer

## Voids and refunds
- Voiding a sale that has already been paid — must reverse both the Payment and the StockMovement correctly
- Refunding only some items from a sale, not the whole thing
- Attempting to void a sale that's already voided
- Voiding a sale whose stock has already moved again since (e.g. sold, then that same stock got adjusted downward for damage before the void)

## Stock movements
- An adjustment that would push stock negative
- Two devices adjusting the same product's stock at the same time
- A `StockMovement` created without a required `reason` on `adjustment` or `damage` types
- Reconstructing current stock from a large movement history — verify it matches expected totals (a periodic consistency check, not just trust the sum)

## Pharmacy-specific
- Selling from a batch that has expired
- Selling from a batch with zero remaining quantity, when other batches of the same product still have stock
- A product with multiple batches — verify the correct (e.g. earliest-expiry-first) batch is selected automatically
- A sale requiring a prescription with no prescription attached

## Customers and payments
- A customer with no phone/email — must still be usable for a sale
- A repayment recorded against a sale that's already fully paid (rejected)
- A repayment recorded against a voided sale (rejected)
- Multiple partial repayments over time on the same credit sale summing correctly to reach `paid` status
- A repayment amount exceeding what's actually due is capped/rejected at the outstanding balance — never stored beyond it
- `recordCustomerRepayment` correctly allocates one payment across multiple outstanding sales, oldest-first, stopping exactly when the amount is exhausted
- `recordCustomerRepayment` when the amount exactly clears the oldest sale and partially covers the next — the split is correct and no rounding paisa is lost or duplicated across the two resulting Payment rows
- `recordCustomerRepayment` attempted for a customer with zero outstanding balance (rejected — nothing to collect)
- Computing a customer's total outstanding balance across many sales performs correctly and matches manual reconciliation

## Auth and permissions
- An expired or invalid JWT mid-transaction (e.g. token expires while a sale is being finalized)
- A cashier attempting a manager-only action by calling the API directly, bypassing the UI
- A deactivated user's existing session — should be rejected on the next request, not just blocked from future logins
- A non-owner attempting to access or submit the onboarding/business-update endpoint (rejected)
- A user from Business A attempting to read or modify Business B's data via a guessed/forged ID (rejected — every query must scope by the authenticated user's businessId)

## Money handling
- Any calculation that could produce a fractional paise value — define and test the rounding rule explicitly, don't leave it to whatever the language does by default