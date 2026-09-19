# Progress Log — pos-platform

Dated, short entries. Update every session.

---

## 2026-09-06
- Project initialized: monorepo structure (frontend/ + backend/ + docs/), dependencies scaffolded
- Architecture decided: React+Vite+TS frontend (Electron + Capacitor), self-hosted Node/Express + Prisma + Postgres backend
- First vertical confirmed: pharmacy
- Completed Phase 0: Foundation.

## 2026-09-08
- Implemented Phase 1.1: Modeled all core and pharmacy entities in `schema.prisma` per `DATA_MODEL.md`.
- Implemented Phase 1.2: Created `lib/permissions.ts` mapping roles to permissions and added the `hasPermission` helper function.

## 2026-09-09
- Updated `schema.prisma` Business model: `businessType` nullable, `address`/`phone` nullable, `onboardingCompleted` added. Migration applied.
- Implemented Phase 1.3: Auth service (`registerBusiness`, `login`), auth middleware (`authenticateToken` with per-request DB isActive check), permission middleware (`requirePermission`), business onboarding service (`updateOnboarding`). All routes wired with rate limiting on login. Vitest config added; 21 tests, all passing.
- **2026-09-09** (Phase 1.3a): Implemented `PATCH /api/business/me` onboarding flow; added rate limiting on login; added Zod schemas for user routes; built auth tests (21 tests, all pass). Updated DECISIONS.md and EXPLAINED.md.
- **2026-09-19** (Phase 1.4): Implemented `writeAuditLog` service with transaction (`tx`) support. TDD complete and all tests passing.
- **2026-09-19** (Phase 1.5): Implemented `StockMovement` service (`getCurrentStock` and `recordStockMovement`). Enforced `SELECT ... FOR UPDATE` locking and transaction scope. TDD complete (6 tests) covering edge cases like negative stock pushing and missing reasons. All tests passing.
- **2026-09-19** (Phase 1.6): Implemented `Product` and `Category` CRUD services. Used strict Red-Green-Refactor loop. Handled cross-tenant relation forging (categoryId belonging to another business) and business-scoped SKU/Name uniqueness. 12 tests total, all passing.
- Updated `docs/DECISIONS.md` with the isActive DB-check vs. revocation-list decision and the signup/onboarding split decision.
- Updated `docs/EXPLAINED.md` with plain-English explanation of Phase 1.3.