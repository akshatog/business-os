# Architecture — pos-platform

## Stack

**Frontend**
- React + TypeScript + Vite (a single-page app — not Next.js, since there's no server-rendering/routing need for an app wrapped by Electron/Capacitor)
- Tailwind CSS + shadcn/ui for styling and base components
- TanStack Query for server state
- Zustand for local/UI state
- Zod for schema validation and as the source of truth for TypeScript types
- React Hook Form for forms
- React Router for routing
- Vitest + React Testing Library for testing
- ESLint, Prettier, Husky for code quality

**Cross-platform**
- Electron wraps the frontend for desktop (primary usage)
- Capacitor wraps the same frontend for mobile (secondary — monitoring, reports, remote checks)

**Backend**
- Self-hosted Node.js + TypeScript + Express API server (own API, not a BaaS)
- Prisma as the ORM
- Postgres as the database
- JWT-based auth with bcrypt for password hashing
- Zod for input validation

This was chosen over a Supabase-native (Row Level Security + Edge Functions) architecture. Reasoning: prior experience building separated frontend/backend systems, and a preference for having every path that touches money/stock data live in one place that can be read and reasoned about directly, given data integrity is the top priority for this project.

## Layering: core, modules, features

- **Core** (`frontend/src/core/`, and the equivalent core routes/services in `backend/`): functionality every business needs — billing, inventory, customers, suppliers, payments, reports, users/roles. Core code never contains vertical-specific logic.
- **Modules** (`frontend/src/modules/<vertical>/`): vertical-specific entities and workflows (e.g. pharmacy: batch/expiry/prescriptions). Modules extend the core through defined extension points (extension tables, hooks like `onSaleComplete`) — they never modify core code or add vertical-specific columns to core tables.
- **First module**: pharmacy.

## Dashboard: widget registry pattern

The dashboard is a core screen, but its contents are composed from two sources: core widgets (always present — e.g. today's sales, low stock) and widgets registered by the business's active module (e.g. pharmacy's "expiring soon," "pending prescriptions"). The combined set is filtered by the logged-in user's permissions before rendering. Core dashboard code never branches on business type — modules register their own widgets into the same registry.

## Permissions

- Roles (Owner, Manager, Cashier, etc.) are bundles of granular permissions (e.g. `view_financials`, `edit_products`, `void_sale`, `manage_users`).
- Every screen, route, and widget declares the permission it requires, and checks are made against permissions, not roles directly.
- Enforcement happens on the backend (Express middleware/route-level checks), not just by hiding UI on the frontend — hiding is for UX, backend checks are what actually secure the data.

## Data integrity

- Inventory is never mutated directly. Every stock change is an append-only `StockMovement` row (purchase, sale, return, damage, adjustment); current stock is derived by summing them.
- Every important write (sale, void, stock adjustment, user change) creates an `AuditLog` entry (who, what, when, from where).

## Offline stance

v0 is online-first — the app assumes internet connectivity and talks to the backend directly. True offline-first operation (local SQLite on-device + background sync/reconciliation to Postgres) is deferred to a later phase, once the core product is validated with the first pharmacy pilot. This tradeoff was made deliberately to avoid building the hardest technical piece of the system before knowing the product/screens are right.

## Testing approach

- Test-required for business logic — anything touching Sale, Payment, StockMovement, or permissions/auth. Tests are written as part of the task spec before an agent implements the logic.
- Contract-and-review (not test-first) for UI — screens are built against a written screen contract and reviewed, rather than driven by tests, since UI work is more exploratory.

## Frontend/backend split (monorepo)

```
frontend/   — React+Vite+TS app, wrapped by Electron (desktop) and Capacitor (mobile)
backend/    — Node/Express/TypeScript API server, Prisma + Postgres
docs/       — all documentation, at the project root, not inside either app
```

The frontend never talks to the database directly — all data access goes through the backend API.