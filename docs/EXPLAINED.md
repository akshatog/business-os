# Business OS — Plain English Guide

> This file explains everything we've built, in simple, plain language.  
> No jargon, no assumptions. Updated after every phase.

---

## How to Read This

Every section covers one "phase" of work. Each section answers:
- **What did we build?**
- **Why does it exist?**
- **How does it work?**
- **How does it connect to everything else?**

---

## Phase 0 — The Foundation (Project Scaffolding)

### What did we build?
We set up the skeleton of the entire project — the folder structure, the tools, and the basic wiring between different parts of the app.

### Why does it exist?
Before writing any real feature code, you need a "home" for everything. Think of it like building the walls and rooms of a house before you put furniture in it.

### How does it work?

The project is split into two main parts:

**`frontend/`** — This is what the user sees and clicks on. It's built using **React** (a popular way to build web UIs) and **Vite** (a tool that compiles and serves the React code super fast). Think of this as the "shop floor" — the cashier screen, the product list, etc.

**`backend/`** — This is the "brain" that runs on a server. It's built using **Node.js** and **Express** (a framework for handling web requests). It receives requests from the frontend (like "save this sale"), does the work, and sends back a response.

**`docs/`** — All the planning documents live here. `ROADMAP.md` is the to-do list. `ARCHITECTURE.md` explains the big picture. `DATA_MODEL.md` describes every piece of data the app stores.

### How does everything connect?
```
User clicks something on the frontend
    ↓
Frontend sends an HTTP request to the backend (e.g. "POST /sales")
    ↓
Backend validates the request, runs business logic, saves to database
    ↓
Backend sends a response back
    ↓
Frontend shows the result to the user
```

---

## Phase 1.1 — The Database Schema (Prisma)

### What did we build?
We created the "blueprint" for our database. Every table, every column, every relationship between tables — all defined in one file: `backend/prisma/schema.prisma`.

### Why does it exist?
A database needs to know what shape your data is. Before you can save a "Sale", the database needs to know: what fields does a Sale have? What's it linked to? Without a schema, the database has no idea what you want to store.

### What is Prisma?
Prisma is a tool that sits between your TypeScript code and the database. Instead of writing raw SQL (complex database language), you just describe your data in a simple `.prisma` file, and Prisma handles the rest — including generating TypeScript types so your editor can autocomplete everything.

### What tables did we create?

| Table | What it stores |
|-------|---------------|
| `Business` | The shop itself — its name, type (pharmacy, grocery, etc.) |
| `User` | Every employee who can log in — their name, role, password |
| `Product` | Items you sell — name, price, HSN code, tax rate |
| `Customer` | People who buy from you |
| `Sale` | Every transaction — who bought what, when, for how much |
| `SaleItem` | Each individual line in a sale (1x Paracetamol, 2x Bandage) |
| `Payment` | How a sale was paid — cash, UPI, credit |
| `StockMovement` | Every time stock goes up or down (purchase, sale, adjustment) |
| `AuditLog` | A permanent record of every important action (who did what and when) |
| `ProductBatch` | (Pharmacy only) Batch number, expiry date for each stock batch |
| `Prescription` | (Pharmacy only) Doctor, patient, licence number for prescriptions |

### Important rules baked into the schema:
- **All money is stored as integers (paise, not rupees).** So Rs. 10.50 is stored as `1050`. This avoids decimal rounding errors which would be a disaster in a billing system.
- **Stock is never stored as a single number.** We never say "currentStock = 50". Instead, every stock change (purchase, sale, return) is saved as a new row in `StockMovement`. The actual stock is calculated by adding all of them up. This gives you a complete audit trail of every movement.

### What is a "migration"?
After writing the schema, we ran `npx prisma migrate dev`. This command:
1. Looked at our `.prisma` file (the blueprint)
2. Compared it with what's currently in the database
3. Generated the SQL commands needed to make them match
4. Ran those commands on the database

This created all the actual tables in our PostgreSQL database.

---

## Phase 1.2 — Permissions (Who Can Do What)

### What did we build?
A file called `permissions.ts` that defines a clear rulebook: **which role can perform which action**.

### Why does it exist?
Not every employee should be able to do everything. A cashier should be able to create a sale but shouldn't be able to delete products or see financial reports. This file is the single source of truth for those rules.

### What are "Roles"?
A Role is the job title assigned to a user. We have four:

| Role | Who they are |
|------|-------------|
| `owner` | The shop owner — can do everything |
| `manager` | Senior staff — can do almost everything except manage other users |
| `cashier` | Counter staff — can only create sales and manage customers |
| `inventory_staff` | Warehouse/stock staff — can manage products and stock but not sales |

### What are "Permissions"?
A Permission is a specific action in the system. For example:
- `create_sale` — can ring up a sale at the POS
- `void_sale` — can cancel/refund a sale
- `manage_users` — can add/remove/edit staff accounts
- `adjust_stock` — can manually correct stock numbers
- `view_financials` — can see revenue and profit reports

### How does `hasPermission` work?
We also created a simple helper function:
```
hasPermission(role, permission) → true or false
```
So for example:
- `hasPermission('cashier', 'create_sale')` → true
- `hasPermission('cashier', 'void_sale')` → false
- `hasPermission('owner', 'manage_users')` → true

This function is used by the backend on **every API route** to check if the user making the request is allowed to do what they're asking. This is non-negotiable — the check always happens on the server, never just hidden in the UI.

### Why is it on both frontend and backend?
- **Backend**: The real security check. The server always verifies before doing anything.
- **Frontend**: Used to hide/show buttons and menu items so the UI feels right for each role. But this is just cosmetic — the backend is the actual gatekeeper.

---

*More phases will be added here as we build them.*

---

## Phase 1.3 — Authentication & Authorization (Who Are You, and What Can You Do?)

### What did we build?
The entire "who are you?" and "are you allowed to do this?" system for the backend. This includes:
- A way for a new business to sign up
- A way for users to log in and get a session token
- A system that checks that token on every request
- A business onboarding flow to fill in details after signup

### Why does it exist?
Without auth, anyone could call your backend API and create sales, delete products, or read your entire customer list — with no restriction. Auth is the front door of the system.

### The Two-Step Signup Flow

We deliberately split signup into **two** stages:

**Step 1 — Register (`POST /api/auth/register-business`)**  
This is public (no login needed). You just provide:
- Business name
- Your name, email, and password

That's it. We create the business and the owner account together in one step, and immediately log them in by returning a JWT token. The business has `onboardingCompleted: false` at this point.

**Step 2 — Onboard (`PATCH /api/business/me`)**  
After registering, the owner is routed to the Onboarding screen where they fill in:
- Business type (pharmacy, grocery, clothing, etc.)
- Address, GST number, phone

Once submitted, `onboardingCompleted` is set to `true` and the owner is taken to the Dashboard. Every other screen in the app checks this flag — if it's `false`, the owner is always redirected back to Onboarding.

**Why split it?** A 2-field signup is much easier than a 7-field one — fewer people give up halfway. The important details come right after in a focused onboarding flow.

### What is a JWT?
JWT stands for "JSON Web Token". Think of it like a tamper-proof ID card that the server hands you when you log in.

When you log in, the server creates a token that contains your user ID, your role (cashier, manager, etc.), and your business ID. It signs this token with a secret key only the server knows.

On every future request, you send this token in the request header. The server checks the signature to confirm it hasn't been tampered with, and extracts your identity from it — without needing to look you up in the database again.

```
User logs in → Server creates JWT → User sends JWT with every request → Server verifies it
```

### The "isActive" DB Check
There is one case where we *do* hit the database on every request — to check if the user's account is still active. 

Why? If an employee is fired and the owner deactivates their account, their JWT is still mathematically valid for 7 days. Without the DB check, they could keep using the app. With the check, they're blocked on their very next request.

### The Middleware Stack
Every protected route runs through two middleware functions before reaching the actual handler:

1. **`authenticateToken`** — Checks the JWT is valid and not expired. Looks up the user in the DB to confirm they're still active. Attaches the user to the request.
2. **`requirePermission("some_permission")`** — Checks that the user's role has the required permission using the `hasPermission` function from Phase 1.2. Returns 403 if not.

```
Request comes in
    ↓
authenticateToken: Is this a real, valid, non-expired token? Is the user still active?
    ↓ (if yes)
requirePermission: Does this role have the permission needed for this action?
    ↓ (if yes)
Route handler: Actually do the thing
```

### Rate Limiting on Login
The login endpoint has a rate limit of 10 attempts per 15 minutes per IP address. This prevents someone from trying thousands of passwords to break into an account (a "brute force attack").

