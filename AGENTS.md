# pos-platform — Agent Instructions

A modular business management platform for offline Indian businesses, with POS at its center. Built as a core platform + vertical-specific modules (starting with pharmacy).

## Non-negotiable rules

1. Core code (`frontend/src/core/`) never contains vertical-specific fields or logic — no `if businessType === 'pharmacy'` anywhere in core.
2. Vertical-specific code only lives in `frontend/src/modules/<vertical>/`, and may import from `core`, never the reverse.
3. UI components never import from `mocks/` directly — always call the matching function in `services/`.
4. Every entity has a Zod schema as its single source of truth for both runtime validation and the TypeScript type.
5. Inventory is never mutated directly — every stock change is a new `StockMovement` row; current stock is derived by summing them.
6. Every important write (sale, void, stock adjustment, user change) creates an `AuditLog` entry.
7. Every screen and API route declares a required permission, checked on the backend — never enforced by hiding UI alone.
8. Before building any screen, a contract must exist in `docs/screens/` describing its data shape, actions, and states.
9. Backend business logic (sale creation, stock math, payments, auth) follows strict TDD — write the failing test first, including edge cases from `docs/EDGE_CASES.md`, then implement. Never write tests after the code.
10. Update `docs/PROGRESS.md` after every unit of work, not just at session end.
11. Update `docs/DECISIONS.md` every time a real decision is made, including why the chosen option beat the alternatives.
12. No duplicate functions or dead code — review and clean your own output before considering a task done.
13. Enumerate and test edge cases explicitly for anything touching money or stock — see `docs/EDGE_CASES.md`.

Full architecture and rationale live in `/docs`. Read `ARCHITECTURE.md` and `RULES.md` before implementing anything non-trivial.