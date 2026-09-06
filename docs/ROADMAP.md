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
- Define core entities in Prisma schema: Product, Customer, Sale, Invoice, Payment, StockMovement, User, AuditLog
- Set up Express project structure: routes, controllers, services, middleware (per ARCHITECTURE.md)
- Build auth (JWT + bcrypt), and the Role → Permission model
- Implement the StockMovement-based inventory rule and AuditLog writes as core backend behavior, not an afterthought

**Done when:** the core schema exists, auth works, and a StockMovement/AuditLog entry can be created and read back correctly.

---

## Phase 2 — Checkout/billing screen, end to end
- Write the checkout screen contract (data shape, actions, states) — the first real screen contract
- Frontend: build the checkout UI against mock data via the service-layer pattern
- Backend: implement `createSale` — writes Sale + StockMovement + AuditLog as one unit, with tests written first (per the test-required-for-business-logic rule)
- Merge: swap mock service calls for real API calls

**Done when:** a sale can be completed end-to-end, stock and audit records update correctly, and it's reviewed against SECURITY_CHECKLIST.md.

---

## Phase 3 — Core back-office screens
- Product list / add-edit product
- Customer list
- Inventory view
- Dashboard, using the core widget registry (Today's Sales, Low Stock, Recent Transactions)
- Each screen gets a contract before being built, same pattern as checkout

**Done when:** an owner can manage products, customers, and view business status without touching a database directly.

---

## Phase 4 — Pharmacy module
- Extension tables: batch, expiry, manufacturer, prescription
- Pharmacy-specific screens: batch entry, prescription handling
- Pharmacy-specific dashboard widgets: expiring soon, pending prescriptions
- Built strictly through the module extension points defined in RULES.md — core code is not modified

**Done when:** the app is usable, in real terms, for the validated medical store's actual workflow.

---

## Phase 5 — Pilot with the real medical store
- Get the medical store contact using the app for real billing
- Track bugs, workflow friction, and missing features from actual use — not hypothetical ones
- Use their referral offer to bring on 1-2 more pharmacy pilots once stable

**Done when:** the app survives real daily use at the pilot store without data issues.

---

## Phase 6 — Offline-first sync layer
- Local SQLite on-device, background sync/reconciliation to Postgres
- Deliberately deferred to here (per DECISIONS.md) so it's built against a validated core, not guessed at in advance
- Stress-test: app killed mid-transaction, sync interrupted, concurrent offline devices

**Done when:** billing can continue with no internet connection and reconciles correctly once it returns.

---

## Phase 7 — Mobile app (Capacitor)
- Wrap the existing frontend for Android/iOS
- Initial mobile scope: dashboard, reports, stock/customer viewing — not necessarily full billing parity at first

**Done when:** the owner can monitor the business from their phone.

---

## Phase 8 — Second vertical
- Choose the next module based on real opportunity (same validation-first approach as pharmacy)
- This phase is where the core/module boundary gets tested for real — expect some refactoring of "core" as genuinely vertical-agnostic assumptions get found wrong here, not before

**Done when:** two verticals run on the same core without either module leaking into core code.