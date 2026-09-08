# Roadmap — pos-platform

Phase-wise plan. No fixed dates/timelines are set here yet — this tracks order and dependency between phases, not a calendar. Update `PROGRESS.md` with dated entries as phases move.

---

## Phase 0 — Foundation (in progress)
- Repo, monorepo structure (frontend/ + backend/ + docs/), dependencies scaffolded
- Core docs written: PRD, ARCHITECTURE, RULES, DECISIONS, SECURITY_CHECKLIST
- First vertical validated: a real medical store expressed interest and offered referrals

**Done when:** repo is set up, both contributors can run the app locally, docs exist.

---

## Phase 1 — Core data model + backend foundation

1.1 **Prisma schema + migration** — model every entity from `DATA_MODEL.md` (Business, User, Product, ProductCategory, Customer, Supplier, Sale, SaleItem, Payment, StockMovement, Purchase, PurchaseItem, AuditLog, plus pharmacy's ProductBatch and Prescription), all enums included. Run the initial migration.

1.2 **`lib/permissions.ts`** — Role → Permission[] map and `hasPermission(role, permission)` helper. Everything downstream depends on this existing first.

1.3 **Auth service, routes, middleware** — register, login, JWT verification middleware, permission-checking middleware. TDD first, against: password hashed not stored plaintext; wrong password rejected; expired/invalid JWT rejected; a deactivated user's existing token rejected on next request; a role without the required permission gets 403.

1.4 **AuditLog service** — a single `writeAuditLog(userId, action, entityType, entityId, oldValue, newValue, reason)` function every other service calls. Build before anything that needs it.

1.5 **StockMovement service** — `recordStockMovement()` and `getCurrentStock()`. TDD against `EDGE_CASES.md`'s Stock Movements section: adjustment pushing stock negative, concurrent adjustments on the same product, missing required `reason` on adjustment/damage, stock reconstruction from movement history matches expectations.

1.6 **Product + ProductCategory CRUD** — permission-gated routes, basic create/read/update/validation tests.

1.7 **Customer CRUD** — permission-gated, basic tests.

1.8 **Supplier CRUD** — permission-gated, basic tests.

**Done when:** schema is migrated; a user can register/login and hit a protected route correctly per their role; `recordStockMovement`/`getCurrentStock` pass every edge case above; Product/Customer/Supplier CRUD exists behind permission checks.

---

## Phase 2 — Checkout/billing screen, end to end

2.1 **Write `docs/screens/checkout.md`** — data shape (product search, cart items, selected customer, discount, totals, payment methods, **selected customer's existing outstanding balance**), actions (add/remove item, adjust quantity, apply discount, select customer, split payment, complete sale, void, **print receipt**), states (empty cart, item out of stock, payment incomplete, success, error). On customer select, fetch and display their outstanding balance so the cashier can ask for it. The printed receipt shows the current purchase total, any prior outstanding balance, amount paid now, and the new remaining balance — both amounts visible on one bill. Out of scope: editing product details, managing customers beyond selecting one.

2.2 **`createSale` service (full TDD)** — creates Sale + SaleItems, calls `recordStockMovement` per item, calls `writeAuditLog`, as one DB transaction. TDD first against `EDGE_CASES.md`'s Sale Creation section: overselling rejected with no partial commit; concurrent sale for the last unit — one succeeds, one fails cleanly; zero-item sale rejected; zero/negative quantity rejected; discount exceeding item price handled per an explicit rule; tax rounded per line then summed to match the invoice total; duplicate invoice numbers can't occur under concurrency; payment below the sale total is allowed and results in a `partially_paid` (credit) sale, not a rejection; split payments across methods sum correctly; walk-in and registered-customer sales both work.

2.3 **`createSale` API route** — `POST /api/sales`, requires `create_sale` permission.

2.4 **`voidSale` service + route (TDD)** — marks voided, creates reversing StockMovement rows, writes AuditLog. TDD against Voids and Refunds edge cases: double-void rejected; reversal correct even if other movements happened on that product since.

2.5 **`recordPayment` service + route (TDD)** — adds a Payment row against one specific existing Sale, used for split payment during checkout of the current sale. TDD: repayment on an already-fully-paid sale rejected; repayment on a voided sale rejected; repayment amount capped at what's actually due — never stored beyond it, per the overpayment decision.

2.6 **`getOutstandingBalance(customerId)` query** — needed by checkout (2.1) to surface a returning customer's existing dues, and reused by the receipt.

2.7 **Frontend checkout UI against mock data** — built per the contract, calling `services/sales.ts` (mock-backed), never the mock file directly.

2.8 **Wire to the real API** — swap the mock implementation inside `services/sales.ts` for real `createSale`, `recordPayment`, and `getOutstandingBalance` calls. Screens shouldn't need to change.

2.9 **Security review + doc updates** — run the full flow against `SECURITY_CHECKLIST.md`; add a `PROGRESS.md` entry for what shipped.

**Resolved:** a sale can complete with a payment total below the sale total — the shortfall becomes derived customer credit (`partially_paid` status), not a blocked transaction. A repayment (here or in Phase 3) is capped at what's due; excess cash is change given at the counter, never stored. See `DECISIONS.md` for both. Collecting a customer's *general* outstanding balance across multiple past sales (not tied to today's purchase) belongs in Phase 3 — the per-sale mechanism built here (2.5, 2.6) is what that's built on top of.

**Done when:** a sale can be completed end-to-end through the real UI hitting the real backend — including as a credit sale, and correctly showing/printing a returning customer's prior balance alongside today's purchase — stock and audit records update correctly, void works, and it's passed the security checklist.

---

## Phase 3 — Core back-office screens

3.1 **Write screen contracts** — `product-list.md`, `customer-list.md`, `supplier-list.md`, `inventory.md`, `dashboard.md`, `customer-credit.md`, same format as checkout's. `customer-credit.md` covers: viewing a customer's outstanding sales, collecting a repayment against their general balance (not tied to a new purchase), and printing a repayment-only receipt.

3.2 **`adjustStock` service + route** — wraps `recordStockMovement` with `type: adjustment`. TDD reuses the Stock Movements edge cases already defined (negative stock, missing reason).

3.3 **`recordCustomerRepayment(customerId, amountMinor, method)` service + route (TDD)** — the higher-level action for "customer pays off general udhaar": fetches their outstanding sales oldest-first, applies the amount across them via `recordPayment`, stopping once exhausted or all cleared. TDD against `EDGE_CASES.md`'s multi-sale allocation cases: correct oldest-first allocation; a split that partially clears one sale and starts the next with no paisa lost or duplicated; amount capped at total outstanding, never exceeding it; rejected when the customer has zero outstanding balance.

3.4 **Dashboard aggregation queries** — `getTodaySales()`, `getLowStockProducts()`, `getRecentTransactions()`, `getTotalOutstandingCredit()`. Basic correctness tests, not full edge-case TDD (read-only reporting, not money-mutating).

3.5 **Frontend: Product list + add/edit** — against mock, then wired to the CRUD routes already built in Phase 1.

3.6 **Frontend: Customer list** — same pattern, wired to Phase 1's Customer CRUD, showing each customer's derived outstanding balance.

3.7 **Frontend: Supplier list** — same pattern, wired to Phase 1's Supplier CRUD.

3.8 **Frontend: Inventory screen** — view current stock (derived, not stored) plus a manual adjustment action, wired to `adjustStock`.

3.9 **Frontend: Customer credit screen** — per-customer view of outstanding sales and total balance, an action to collect a repayment (wired to `recordCustomerRepayment`), and a **print repayment receipt** action — the receipt is rendered from the Payment rows the repayment call just created (per `DATA_MODEL.md`'s no-separate-receipt-table design), showing which sales it applied to and the new remaining balance.

3.10 **Frontend: Dashboard** — implement the widget registry (core widgets only for now — pharmacy widgets arrive in Phase 4), filtered by the logged-in user's permissions, wired to the aggregation queries, including an outstanding-credit widget.

**Done when:** an owner/manager can manage products, customers, and suppliers, view and adjust inventory, collect a customer's general udhaar balance across multiple past sales and print them a receipt for it, and see a dashboard reflecting real data — all correctly permission-gated.

---

## Phase 4 — Pharmacy module

4.1 **Extend schema** — `ProductBatch`, `Prescription` tables per `DATA_MODEL.md`, migration. No changes to core tables.

4.2 **Batch-aware stock functions** — `getAvailableBatches(productId)`, `selectBatchForSale()` (earliest-expiry-first). TDD against the Pharmacy-specific edge cases: expired batch excluded, a zero-quantity batch skipped in favor of others, correct batch auto-selected.

4.3 **Extend `createSale` via the module hook** (not by modifying core `createSale`) to attach `batchId` per line item and to require a `Prescription` for prescription-only items. TDD: a sale requiring a prescription with none attached is rejected.

4.4 **Prescription service + routes** — create and verify.

4.5 **Pharmacy dashboard widget queries** — `getExpiringSoon()`, `getPendingPrescriptions()`.

4.6 **Write screen contracts** — `batch-entry.md`, `prescription-upload.md`.

4.7 **Frontend: batch entry screen** — against mock, wired to 4.1/4.2's routes.

4.8 **Frontend: prescription upload/verification screen** — against mock, wired to 4.4.

4.9 **Frontend: pharmacy dashboard widgets** — `ExpiringSoonWidget`, `PendingPrescriptionsWidget`, registered into the widget registry only when `businessType === pharmacy`.

4.10 **Extend the checkout screen** for batch selection and prescription attachment, through the module extension point — core checkout code isn't modified.

**Done when:** batch tracking, expiry-aware selling, and prescription handling work end-to-end, with zero pharmacy-specific logic inside `core/`.

---

## Phase 5 — Pilot with the real medical store

5.1 **Deploy backend + frontend for pilot use** — hosting choice not yet decided (open decision, needed by this phase, not before).

5.2 **Onboard the medical store** — create their Business + Owner user.

5.3 **Data import tool** — not yet designed in detail; needed here since the PRD requires importing existing business data. At minimum: a CSV → Product import endpoint, validated against the Product Zod schema, with a clear report of rows that failed validation. Design this properly when this phase starts, not now.

5.4 **Live usage monitoring** — track real bugs and workflow friction via `PROGRESS.md`, not hypothetical ones.

5.5 **Fast-follow fixes** — prioritized by what blocks daily billing at the pilot store.

5.6 **Follow up on the referral offer** for 1-2 more pharmacy pilots once stable.

**Done when:** the app survives real daily use at the pilot store without data issues.

---

## Phase 6 — Offline-first sync layer

6.1 **Decide the sync approach** (open decision) — now that the backend is self-hosted Node/Express rather than Supabase, re-evaluate managed sync tooling vs. a custom sync queue; not decided yet, deliberately.

6.2 **Local SQLite schema** mirroring the core entities on-device.

6.3 **Sync queue** — tracks pending local writes, pushes when online, pulls remote changes.

6.4 **Conflict resolution policy** (open decision, to be made when this phase starts) — e.g. last-write-wins vs. operation replay — then TDD against it once chosen.

6.5 **Offline-capable checkout** — `createSale` writes locally first, queues for sync, using the same service logic and edge cases already proven in Phase 2.

6.6 **Stress tests** — app killed mid-transaction, sync interrupted mid-flight, concurrent offline devices editing the same product.

6.7 **Automated local backup** — periodic on-device snapshot, independent of sync.

**Done when:** billing continues with no internet connection and reconciles correctly once connectivity returns, verified under the stress tests above.

---

## Phase 7 — Mobile app (Capacitor)

7.1 **Add Capacitor** to the existing frontend project, configure Android/iOS targets.

7.2 **Confirm initial mobile scope** — dashboard, reports, stock/customer viewing (per `DECISIONS.md`) — not full billing parity at first.

7.3 **Responsive review** of the existing core screens for mobile viewport/touch — same React components, not a rebuild.

7.4 **Mobile session handling** — secure token storage on-device.

7.5 **Test on real Android and iOS devices.**

7.6 **Distribution** (open decision, needed by this phase) — app store release vs. direct APK for pilot use.

**Done when:** the owner can monitor the business from their phone using the same core screens and widgets as desktop.

---

## Phase 8 — Second vertical
- Choose the next module based on real opportunity (same validation-first approach as pharmacy)
- This phase is where the core/module boundary gets tested for real — expect some refactoring of "core" as genuinely vertical-agnostic assumptions get found wrong here, not before

**Done when:** two verticals run on the same core without either module leaking into core code.

Deliberately left at this level of detail, not broken into numbered tasks like the phases above — which vertical comes second, and what it needs, isn't knowable yet. Detailing it now would mean inventing plausible-sounding tasks rather than planning real ones; it gets the same treatment the other phases just got once Phase 4-7 are actually done and there's real evidence to plan from.