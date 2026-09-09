# Core Dashboard Screen Contract

This document defines the contract for the core Dashboard screen. It is implementation-oriented and strictly business-type agnostic.

## 1. Screen Identity

- **Screen name:** Dashboard
- **Screen type:** Core
- **Route:** `/app`
- **Primary purpose:** Provide a high-level overview of business operations, health, and recent activities, while serving as the host for the widget registry.
- **Desktop-first behavior:** Multi-column grid layout for widgets, optimizing screen real-estate to show multiple metrics and tables simultaneously.
- **Mobile behavior:** Single-column stacked layout, prioritizing key metrics (sales, tasks) at the top.
- **Required permission:** The project's dashboard-view permission (once permission identifiers are defined).

## 2. Screen Responsibilities

**What it DOES:**
- Hosts the widget registry architecture.
- Displays a concise overview of today's core business activity (Sales, Inventory, Customers).
- Highlights important alerts or tasks.
- Provides quick action shortcuts to common core workflows.

**What it DOES NOT do:**
- It **MUST NOT** contain any vertical-specific logic (e.g., `if (businessType === 'pharmacy')`).
- It **MUST NOT** become a dumping ground for deep analytical reports. Deep reports belong in their respective modules/screens.
- Vertical-specific functionality (like expiring medicines or prescriptions) belongs entirely to **module-registered widgets**, not the core dashboard.

## 3. Dashboard Widget Architecture

The dashboard implements a registry-based widget architecture. Core widgets and module widgets are registered into a central registry and filtered by permissions before being rendered.

**Conceptual Widget Contract:**
```typescript
interface DashboardWidget {
  id: string;                      // Unique identifier for the widget
  title: string;                   // Display title
  description?: string;            // Optional context
  category: 'metrics' | 'tables' | 'actions' | 'alerts'; // Layout grouping
  priority: number;                // Sort order within category
  requiredPermission: string;      // Conceptual permission string to check
  visibilityRules?: () => boolean; // Optional dynamic visibility checks
  component: React.ComponentType;  // The React component to render
  owner: 'core' | 'pharmacy' | string; // Module ownership
}
```

**Data Flow:**
1. Core registers generic widgets.
2. Active module(s) register specific widgets.
3. Dashboard queries the active user's permissions.
4. Dashboard filters out unauthorized widgets.
5. Dashboard renders the authorized widgets in their respective layout sections.

## 4. Core Widget Set

The initial generic core widgets to be supported:

1. **Today's Sales Summary:** Total revenue, number of sales, average order value.
2. **Recent Transactions:** A mini-table of the latest sales.
3. **Low Stock Alerts:** Items reaching their reorder threshold.
4. **Recent Activity:** A feed of the latest `AuditLog` events.
5. **Quick Actions:** A unified panel of primary actions.

These map directly to existing core concepts (`sale.ts`, `product.ts`, `auditLog.ts`).

## 5. Data Contract

Widgets must rely on existing Zod schemas. Do NOT duplicate domain types.

- **Sales Summary:**
  Expects aggregated metrics from the backend. (Future API requirement: `GET /api/dashboard/sales-summary`).
  *Shape:* `{ totalRevenue: number; saleCount: number; period: string }`

- **Recent Transactions:**
  Must reuse the existing `Sale` schema from `frontend/src/types/sale.ts`.
  *Shape:* `Sale[]`

- **Low Stock Alerts:**
  Must reuse the existing `Product` schema from `frontend/src/types/product.ts`.
  *Shape:* `Product[]` (filtered where `currentStock <= reorderLevel`)

- **Recent Activity:**
  Must reuse the existing `AuditLog` schema from `frontend/src/types/auditLog.ts`.
  *Shape:* `AuditLog[]`

## 6. Loading States

- **Page-Level:** The dashboard shell renders immediately.
- **Widget-Level:** Widgets load their data **independently**.
- **Behavior:** We prefer a resilient dashboard. One slow widget must not block others. Each widget should display a polished, customized skeleton loader (using shadcn/ui generic skeletons) matching its intended shape (e.g., a table skeleton for recent transactions, a numeric block skeleton for revenue) while waiting for its query to resolve.

## 7. Empty States

Empty states should be informative, visually distinct, and actionable. **No fake numbers.**

- **Sales Summary:** "No sales recorded today yet."
- **Recent Transactions:** "No transactions found." + [New Sale] button.
- **Low Stock Alerts:** "All products are sufficiently stocked."
- **Recent Activity:** "No recent activity recorded."

## 8. Error States

- **Widget-Level:** If a widget's query fails, the widget catches the error locally (e.g., via React Error Boundary or TanStack Query error state). It displays a subtle error message ("Failed to load data") and a "Retry" button.
- **Page-Level:** The dashboard itself continues to function. Catastrophic failures (like total network loss) should trigger a global toast or offline indicator, but the UI should remain responsive.

## 9. Permission Behavior

- **Dashboard Access:** Requires the intended dashboard-view permission.
- **Widget Access:** Each widget enforces its own conceptual permission requirement. For example, "Recent Transactions" might require a sales-view permission. If a user lacks the required permission, the widget is simply omitted from the registry output and is not rendered.
- **Security Boundary:** The contract acknowledges that UI hiding is purely for UX. The backend API serving the widget data must independently verify the user's permissions and remains authoritative.

## 10. Responsive Behavior

- **Desktop (lg, xl):** Multi-column layout. Metrics row at the top (3-4 cards). Main content area split into a primary column (e.g., span 2 for Recent Transactions) and a secondary sidebar column (e.g., span 1 for Quick Actions & Low Stock).
- **Tablet (md):** Reduced to 2 columns. Metrics wrap gracefully into a 2x2 grid.
- **Mobile (sm):** Strict single-column layout. Every widget takes 100% width. Priority order: Metrics -> Quick Actions -> Alerts -> Tables.

## 11. Visual / UX Direction

- **Look & Feel:** Premium, trustworthy, modern, clean, and spacious.
- **Colors:** White cards with subtle borders (`hsl(var(--border))`) on the light `bg-slate-50` / dark `bg-background` canvas. Restrained shadow usage.
- **Typography:** Inter, with clear hierarchy (distinct section headers, legible metric numbers).
- **Guidelines:** Do not over-saturate with colors. Use primary blue strictly for primary actions. Status indicators (low stock) may use semantic colors (destructive/warning) sparingly.

## 12. Quick Actions

Initial core actions:
1. **New Sale** (Navigates to `/app/checkout`)
2. **Add Product** (Navigates to `/app/inventory/new` or opens a modal)
3. **Add Customer** (Opens modal)

Quick actions must dynamically hide if the user lacks the required conceptual permission (e.g., ability to create a sale or manage inventory).

## 13. Navigation / Shell Relationship

- The Dashboard is rendered within the `<Outlet />` of the `AppLayout.tsx`.
- It does not control the `Sidebar` or `Header`.
- It receives maximum width available from the shell constraints.

## 14. Future Module Extension

**Extension Flow:**
1. The Core Dashboard exports a registry context, hook, or extension point.
2. Modules (e.g., `pharmacy`) register/provide dashboard widgets through the dashboard widget registry/extension point.
3. The dashboard iterates over the combined registry, grouping widgets by category and sorting by priority.
4. No core files are touched when a new vertical module adds a widget.

## 15. Accessibility Requirements

- **Keyboard Navigation:** All quick actions and list items must be focusable (`tabIndex={0}` where appropriate, native `<button>` or `<a>`).
- **Semantic Headings:** Use `<h1>` for the page title, `<h2>` for widget titles.
- **Contrast:** Ensure all text passes WCAG AA contrast against card backgrounds.
- **Screen Readers:** Provide `aria-labels` for icon-only buttons. Use `aria-live="polite"` for widgets that update dynamically. Loading skeletons should use `aria-busy="true"`.

## 16. Acceptance Criteria

- [ ] Dashboard contract is completely business-type agnostic.
- [ ] No pharmacy-specific logic or fields are prescribed.
- [ ] Explicit data contracts rely on existing Zod schemas (`Sale`, `Product`, `AuditLog`).
- [ ] Widget loading (skeletons), empty, and error states are strictly defined.
- [ ] Permissions dictate widget visibility, acknowledging backend enforcement.
- [ ] Responsive grid behavior is specified.
- [ ] Module widget extension architecture is conceptually mapped out.
- [ ] Accessibility baseline is documented.
- [ ] **Implementation rule:** No mock data should be hardcoded in components; it must come from `services/`.
- [ ] **Implementation rule:** No backend changes are required to fulfill this frontend contract.
