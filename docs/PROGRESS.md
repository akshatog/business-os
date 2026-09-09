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
- Implemented Phase 1.3a: `PATCH /api/business/me` owner-only endpoint for onboarding flow. Screen contract at `docs/screens/onboarding.md` confirmed (authored by user).
- Updated `docs/DECISIONS.md` with the isActive DB-check vs. revocation-list decision and the signup/onboarding split decision.
- Updated `docs/EXPLAINED.md` with plain-English explanation of Phase 1.3.