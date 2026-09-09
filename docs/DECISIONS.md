# Decisions Log — pos-platform

Entries are appended, never removed, in Context / Decision / Consequences format.

---

## 2026-09-06 — Core product direction
**Context:** Wanted to build a POS app for offline businesses that isn't locked to one business type.
**Decision:** Build one platform with a shared core (billing, inventory, customers, payments, reports) plus vertical-specific modules (pharmacy, clothing, grocery, etc.), selected per business at onboarding.
**Consequences:** Requires a disciplined core/module boundary from the start to avoid the core becoming vertical-specific by accident.

---

## 2026-09-06 — Cross-platform approach
**Context:** Need both desktop (primary) and mobile (secondary) apps, built by a two-person team with shared JS/TS/React experience.
**Decision:** React + TypeScript + Vite as the single frontend codebase, wrapped by Electron for desktop and Capacitor for mobile. Not Next.js — no server-rendering need for an app that isn't served to web visitors.
**Consequences:** One codebase to maintain across platforms; routing handled by React Router instead of file-based routing.

---

## 2026-09-06 — Backend architecture: self-hosted vs. Supabase-native
**Context:** Considered a Supabase-native architecture (Row Level Security + Edge Functions) for speed, vs. a self-hosted Node/Express backend.
**Decision:** Self-hosted Node.js + Express + Prisma + Postgres, with our own JWT-based auth.
**Consequences:** Slower to first working version than a BaaS approach, but every path touching money/stock data lives in one place that can be read and reasoned about directly — matches prior experience and the priority placed on data integrity over setup speed.

---

## 2026-09-06 — First vertical
**Context:** Considered starting with general retail/grocery (simpler entities) vs. pharmacy (more complex, but validated interest).
**Decision:** Pharmacy — a real medical store expressed interest in the product and offered to refer more clients.
**Consequences:** Higher initial complexity (batch/expiry/prescription tracking) in exchange for a real first user and referral path.

---

## 2026-09-06 — Offline support timing
**Context:** Offline-first operation is important for the target businesses, but is also the hardest technical piece of the system.
**Decision:** v0 is online-first; offline-first sync (local SQLite + reconciliation) is deferred to a later phase, after the core product is validated.
**Consequences:** v0 requires internet connectivity to operate; the sync/reconciliation layer must be designed before the core data model is considered final, since it will influence schema decisions.

---

## 2026-09-06 — Testing approach
**Context:** Considering full test-driven development vs. no formal testing discipline.
**Decision:** Test-required (tests written before/alongside implementation) for business logic — sale creation, stock math, permissions/auth. Contract-and-review, not test-first, for UI screens.
**Consequences:** Business-logic bugs are caught early and give AI coding agents a concrete target to implement against; UI work stays fast and exploratory.

---

## 2026-09-06 — Money representation
**Context:** Financial calculations (tax, discounts, totals) are prone to floating-point rounding errors if stored as decimals.
**Decision:** All money fields are stored as integers in the smallest currency unit (paise), not decimal rupees.
**Consequences:** Every money field needs explicit conversion to rupees for display; in exchange, arithmetic across tax/discount/totals can't silently drift due to floating-point rounding — directly relevant given this is a finance-handling application.

---

## 2026-09-06 — Payment mismatch policy (credit sales)
**Context:** Two options considered when a sale's payment total is less than its total amount: (A) require full payment to mark a sale complete, or (B) allow the sale to complete with the shortfall recorded as customer credit (udhaar).
**Decision:** Option B — credit sales are supported from Phase 2, not deferred as a later feature. A sale's payment status (`unpaid`/`partially_paid`/`paid`) is derived from its Payment rows rather than stored directly, and additional Payment rows can be recorded against a sale later as repayments.
**Consequences:** Credit sales are core to how small Indian shops actually operate, so treating this as a later add-on would have meant retrofitting it into `createSale` and the schema after the fact. This adds real scope to Phase 2 (a `recordPayment` service usable for both split payments and later repayments) and to Phase 3 (a customer credit view), in exchange for not needing to redesign the Sale/Payment relationship later.

---

## 2026-09-06 — Repayment overpayment
**Context:** Whether a repayment larger than the amount actually owed should be rejected, capped, or stored as forward credit.
**Decision:** A repayment is capped at exactly what's due — the system never records or stores an amount beyond the outstanding balance. Any extra cash handed over is change given at the counter, exactly like a normal cash sale, and isn't tracked in the ledger at all.
**Consequences:** Keeps the credit ledger simple (a customer's balance only ever decreases toward zero, never goes negative or holds forward credit); change-giving stays a counter-level concern, not a system concept.

---

## 2026-09-06 — Signup vs. onboarding, and how the first owner is created
**Context:** `register-business` was initially scoped as one step creating a fully-detailed Business + Owner. It became clear a business's real details (type, address, GST, phone) and the module-activating businessType selection need their own step, not to be crammed into signup — and staff users need a different, permission-gated creation path from the owner's own signup.
**Decision:** Split into three distinct things — `POST /api/auth/register-business` (public, minimal: business name + owner credentials, creates Business with `onboardingCompleted: false`), a separate Onboarding flow (`PATCH /api/business/me`, owner-only) that captures full business details and businessType, and `POST /api/users` (permission-gated, creates staff under an existing business). The app gates all core screens behind `business.onboardingCompleted`.
**Consequences:** Signup stays frictionless (fewer fields = fewer people abandoning it), and there's no separate bootstrap script needed for the first owner — they onboard through the same flow any new pilot store would. This does mean `businessType` is nullable until onboarding completes, and any code reading it must handle that null state during the gap between signup and onboarding.
---

## 2026-09-09 � isActive check: DB lookup vs token revocation list
**Context:** When a user is deactivated, their existing JWT is still cryptographically valid. We need to decide whether to reject it on the next request via a DB lookup, a Redis revocation cache, or a short token expiry.
**Decision:** DB lookup on every authenticated request (prisma.user.findUnique inside uthenticateToken). No Redis, no revocation list for the MVP.
**Consequences:** Every API call hits the DB once for the user lookup (acceptable at this scale). Deactivated users are rejected on their very next request, not just blocked from re-logging in. Revisit in Phase 6 (offline sync) if the DB check becomes a bottleneck.
