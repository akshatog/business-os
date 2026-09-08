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