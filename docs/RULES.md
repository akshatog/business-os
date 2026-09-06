# Rules — pos-platform

These are non-negotiable, followed by both contributors and any AI coding agent working in this repo.

1. **Core never knows about verticals.** `frontend/src/core/` and the equivalent core backend code never contain vertical-specific fields, columns, or logic (no `if businessType === 'pharmacy'` anywhere in core).
2. **Modules extend, never modify, core.** Vertical-specific code lives only in `frontend/src/modules/<vertical>/` (and its backend equivalent), and may import from core — never the reverse. Vertical-specific data lives in its own extension tables, not as new columns on core tables.
3. **Components never touch mock data directly.** UI components call functions in `services/`, never `mocks/` directly — this keeps the swap from mock data to real API calls a one-line change.
4. **Zod schemas are the single source of truth.** Every entity (Product, Customer, Sale, Payment, StockMovement, User, AuditLog) has a Zod schema that generates both its runtime validation and its TypeScript type — mock data and real API responses must both conform to it.
5. **Stock is never mutated directly.** Every inventory change is a new `StockMovement` row (purchase, sale, return, damage, adjustment); current stock is derived by summing them, never set directly.
6. **Every important write is audited.** Sales, voids, stock adjustments, and user/permission changes each create an `AuditLog` entry.
7. **Permissions are checked on the backend.** Every screen and API route declares a required permission and checks it server-side — hiding UI on the frontend is a UX nicety, not a security boundary.
8. **No screen gets built without a contract first.** Before implementation, a short doc in `docs/screens/` defines the screen's data shape, actions, and states.