# Frontend Project Build Guide

This file is a living record of the frontend work that has actually been built for Business OS. Its purpose is to explain to any new developer what exists now, how it was built, and why it is structured this way.

This document only describes **completed work** in the current implementation.

## What Has Been Built So Far

Business OS is a modular business management platform for offline Indian businesses, with point-of-sale (billing) at its center. The frontend is responsible for the user interface that business owners will interact with (desktop-first, but responsive).

So far, the foundational frontend work has been completed. This includes:
- The base React application setup.
- The shared design system and reusable UI components.
- The main Application Shell (the layout structure wrapping all screens).
- Basic application routing.
- The documented contract for the dashboard screen (the plan for the dashboard before it is built).
- Initial folder structure for future data models, services, and mocks.

## Technologies and Tools Used

### A. Technologies and tools actually used in the current implementation

- **React & TypeScript:** The core library and language for building the interface safely.
- **Vite:** The build tool that serves and bundles the application quickly.
- **Tailwind CSS:** Used for writing styles directly in our code through utility classes.
- **shadcn/ui & Radix UI:** The foundation for our accessible, reusable UI components (like buttons, dialogs, and inputs) that we own and can customize.
- **Lucide React:** Our chosen icon library.
- **React Router:** Used to handle navigation between different parts of the application (routing).
- **clsx & tailwind-merge:** Utilities to safely combine Tailwind CSS classes in our components.

### B. Technologies installed as project foundations but not actively used yet

- **Zustand:** Installed for local state management, but no stores currently exist.
- **React Hook Form:** Installed for form handling, but no forms are implemented yet.
- **Zod:** Installed for schema validation, but no schemas are written yet.
- **TanStack Query:** Installed for server state management, but no API calls are made yet.

## How the Technologies Work Together

The current architecture flows like this:

```text
Vite (Build Tool & Server)
  ↓
React + TypeScript (Core Logic)
  ↓
React Router (Navigation/URLs)
  ↓
AppLayout Shell (Sidebar + Header)
  ↓
React Components (Pages/Screens)
  ↓
Tailwind + shadcn/ui (Styling Foundation)
```

## Frontend Folder Structure

The frontend is structured to separate core generic features from business-specific modules. Here is what currently exists inside `frontend/src/`:

- **`core/`**: Contains everything that applies to any business (not specific to pharmacy or retail).
  - **`components/ui/`**: Reusable generic components (Button, Card, Input, etc.).
  - **`components/layout/`**: The application shell (Header, Sidebar, AppLayout).
- **`styles/`**: Global CSS files, including Tailwind directives and CSS variables for our design system.
- **`lib/`**: General utilities (e.g., `utils.ts` for Tailwind class merging).
- **`assets/`**: Static files like images and SVGs.
- **`mocks/`**: Folders ready for fake data (currently files are empty place-holders).
- **`services/`**: Folders ready for API communication logic (currently files are empty place-holders).
- **`types/`**: Folders ready for Zod schemas and TypeScript interfaces (currently files are empty place-holders).
- **`hooks/` & `store/`**: Folders prepared for state management and custom React hooks (currently files are empty place-holders).

## The Design System

We have established a shared design system to keep the app looking premium, modern, clean, and professional. 

- **Visual Direction:** A clean "SaaS" style designed for business users, avoiding flashy or overly saturated elements.
- **Color System:** Defined using CSS variables in `index.css` (e.g., `bg-slate-50` for the app background, `--primary`, `--border`, etc.).
- **Reusable UI:** Instead of styling every screen from scratch, we use the `core/components/ui/` components to maintain perfect consistency.

## The shadcn/ui Foundation

We have added several reusable components into `frontend/src/core/components/ui/`. These currently include:

- **Button**
- **Card**
- **Input** & **Label**
- **Checkbox** & **Switch**
- **Dialog** & **Sheet**
- **Dropdown Menu** & **Select**
- **Table** & **Tabs**
- **Badge**, **Separator**, **Popover**, **Tooltip**

These components form the building blocks of every screen. We built this foundation first so that future business screens can be assembled rapidly without worrying about basic styling and accessibility.

## The Application Shell

The Application Shell is the surrounding layout that hosts the different screens of the app. It is currently implemented in `AppLayout.tsx`.

It consists of:
- **Sidebar:** The navigation menu on the left side (hidden on mobile, fixed on desktop).
- **Header:** The top bar.
- **Main Content Area:** Where the actual screen content (like the dashboard or checkout) is injected.

```text
AppLayout
  ├── Sidebar (Left, Desktop only)
  ├── Header (Top)
  └── Main content (Scrollable area)
```

The shell is responsive. On smaller screens, the sidebar is hidden, leaving only the header and main content.

## Current Routing

Routing is implemented in `App.tsx` using React Router.

- **`/`**: Displays a default Vite welcome/preview screen.
- **`/app`**: Mounts the `AppLayout` shell. Currently, it renders a placeholder screen ("Application Shell Ready") inside the shell to prove that the layout and design system are successfully connected. 

No actual business screens (like Checkout or Inventory) are routed yet.

## Data, Mocks, Services, and Types Structure

The folders for `mocks/`, `services/`, and `types/` have been created, and files for specific entities (like `sale.ts`, `product.ts`) have been added.

**Important Note:** We have verified against the repository that every single file inside `mocks/`, `services/`, and `types/` currently contains exactly 0 lines of code. They are literally empty files. They exist only as placeholders to establish the structure.

The intended architectural rule is:
```text
Mock data  →  Service  →  UI Component
```
However, since the files are completely empty, this flow has not yet been actively implemented in code. Similarly, the schema files (like `types/sale.ts`) do not yet contain any Zod definitions.

## Architecture Rules Relevant to Work Done

While many rules exist in `RULES.md`, these have driven the frontend work so far:

- **Core should stay business-type agnostic:** The `core/` folder only contains layout and UI components that any business could use. No module-specific code has been added here.
- **Shared UI belongs in reusable components:** We invested in the `core/components/ui/` folder first, so we don't duplicate styling logic later.
- **Screen contracts must exist before implementation:** We wrote the Dashboard screen contract before attempting to build the dashboard UI.

## The Dashboard Contract

Before building the Dashboard, we created a screen contract in `docs/screens/dashboard.md`. 

**This is a contract only. The final Dashboard UI is not yet implemented.**

The contract defined:
- **Widget Concept:** The dashboard will be a host for "widgets" (metrics, tables).
- **Core Widgets:** Things like "Today's Sales" or "Recent Transactions."
- **Module Extension:** How future vertical modules (like pharmacy) will inject their own widgets into the core dashboard without changing core code.
- **Expected States:** How the dashboard handles loading (skeletons), empty data, errors, and permissions.

This contract was created first to ensure we know exactly what data shape and behavior is needed before writing React code.

## How We Built the Frontend So Far

This is the actual sequence of how the frontend arrived at its current state:

1. **Initial Frontend Foundation:** The base React + Vite setup, Tailwind CSS configuration, and shadcn/ui design system components were initially developed.
2. **Repository Integration:** This frontend foundation work was then integrated into the actual Business OS repository structure (inside the `frontend/` folder) as part of a monorepo setup alongside the backend.
3. **Application Shell Integration:** The application shell (`AppLayout.tsx`, `Sidebar.tsx`, `Header.tsx`) and the design system were connected and basic routing was added (`/app`) to prove the layout works.
4. **Dashboard Contract:** The architectural rules and data expectations for the Dashboard were documented in a screen contract before building the actual screen.
5. **Permissions Build Fix:** The frontend representation of the backend role contract (`permissions.ts`) was updated to a TypeScript type union. This was necessary to fix a build error caused by the `erasableSyntaxOnly` compiler rule which rejects runtime `enum` declarations. The backend permission definitions were not modified, ensuring the contract remains intact.
6. **Core Dashboard Page Foundation (Step 1):** A structural page component was created for the Core Dashboard (`Dashboard.tsx`). The application shell's `/app` route was updated to mount this page instead of the original placeholder. The page contains only the layout heading and an empty container prepared for future dashboard widgets. No data, mocks, or API fetching were implemented at this stage. Both `npm run lint` and `npm run build` completed successfully.

## Current Frontend Status

- [x] Base frontend project setup (Vite/React)
- [x] Design system foundation (Tailwind)
- [x] Reusable UI component foundation (shadcn/ui)
- [x] Application shell structure
- [x] Basic routing to shell
- [x] Dashboard screen contract
- [/] Dashboard final UI (Structural foundation complete)
- [ ] Data models, types, and schemas implementation
- [ ] Service and mock data implementation

**Current frontend stage:** Core Dashboard page structure implemented; awaiting widget and metric implementations.

## Important Git Checkpoints

- **`46b0dad`** `Initial project setup: folder structure and core dependencies` (The initial frontend foundation and design work happened here before being moved).
- **`cdea2f2`** `Restructure into monorepo and scaffold Node backend` (The frontend work was integrated into the actual Business OS repository under the `frontend/` folder).
- **`8e1146e`** `feat(frontend): integrate design system and application shell` (The point where the UI components and Layout were successfully connected in the application).
- **`5f5a616`** `docs: define core dashboard screen contract` (The point where the plan for the first major screen was finalized).

These checkpoints represent safe restore points before moving to the next meaningful stage of development.

## Why We Built It This Way

- **Why create a design system and UI components first?** To ensure all future screens look consistent and premium without developers having to rewrite Tailwind classes for every button or card.
- **Why use a shell?** To provide a consistent navigation experience (sidebar/header) across all future business screens without duplicating layout code.
- **Why create the screen contract before the dashboard UI?** To strictly follow the project rules. Writing a contract forces us to think about data shapes, loading states, and permissions *before* getting distracted by React implementation details.
- **Why keep the frontend structure modular?** By isolating generic UI into `core/`, we ensure that future vertical-specific features (like pharmacy batches) won't accidentally break or pollute the core billing platform.

## How This File Is Maintained

This file is a living record of the frontend. 

Whenever meaningful frontend work is **actually completed**, this file should be updated to:
- Document what was built.
- Explain how it was built.
- Explain which technologies/components were used.
- Explain why important decisions were made.
- Update the current status and project history.
- Update Git checkpoint information when relevant.

Do NOT add planned work, and do NOT document something before it actually exists in the repository.
