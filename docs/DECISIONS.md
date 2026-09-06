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