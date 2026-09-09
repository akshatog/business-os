# Business OS (POS Platform)

> A modular, offline-first business management and Point-of-Sale (POS) platform designed specifically for Indian offline businesses.

## 📖 About the Project

This platform is built to handle real money and stock reliably in environments with intermittent internet access. Instead of forcing businesses into a one-size-fits-all generic POS, the architecture provides a **shared core** (billing, inventory, customers, payments, reporting) combined with **vertical-specific modules** (e.g., Pharmacy, Grocery, Clothing) that activate based on the business type.

### Key Features
- **Offline-First Design**: The backend is built to run locally on-premise (e.g., a local PC or Raspberry Pi), ensuring the shop can continue billing customers even during a 3-day internet outage.
- **Modular Architecture**: The core system is completely agnostic to the business type. Vertical-specific logic (like Pharmacy batches or prescriptions) is neatly encapsulated in its own module.
- **Strict Role-Based Access (RBAC)**: Built-in roles (Owner, Manager, Cashier, Inventory Staff) with fine-grained API permission checks.
- **Test-Driven Development (TDD)**: Every piece of business logic touching money or stock is strictly test-driven against a rigorous list of edge cases.
- **Cross-Platform**: The frontend targets Desktop (Electron), Web, and Mobile (Capacitor) from a single codebase.

---

## 🛠 Tech Stack

### Frontend (Cross-Platform Client)
- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **State/Data**: Zustand (planned) / Custom Hooks
- **Desktop Build**: Electron
- **Mobile Build**: Capacitor

### Backend (Self-Hosted Server)
- **Runtime**: Node.js + Express + TypeScript (ESM)
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Auth**: Custom JWT-based authentication via bcrypt
- **Testing**: Vitest + C8/V8 Coverage

---

## 📂 Monorepo Structure

```
business-os/
├── frontend/           # React + Vite client (Web/Electron/Capacitor)
├── backend/            # Node.js + Express server
├── docs/               # Documentation Hub (Architecture, Rules, Decisions)
│   ├── screens/        # UI/UX Contracts
│   ├── ARCHITECTURE.md # Core system architecture
│   ├── DATA_MODEL.md   # Prisma schema definitions & rules
│   ├── DECISIONS.md    # Log of all major technical decisions
│   ├── EDGE_CASES.md   # The edge cases that drive our TDD
│   ├── EXPLAINED.md    # Plain-English explanations of how the app works
│   ├── ROADMAP.md      # Execution roadmap
│   └── RULES.md        # Non-negotiable agent/developer rules
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v20+ recommended)
- [PostgreSQL](https://www.postgresql.org/) running locally
- [Git](https://git-scm.com/)

### 1. Clone the repository
```bash
git clone https://github.com/your-username/business-os.git
cd business-os
```

### 2. Setup the Backend
```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:
```env
# Database connection string
DATABASE_URL="postgresql://postgres:password@localhost:5432/pos"
# Secret used for signing JWT tokens (minimum 32 characters)
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
# Server port
PORT=3000
```

Run database migrations to generate the schema:
```bash
npx prisma migrate dev
```

Start the backend development server:
```bash
npm run dev
```

### 3. Setup the Frontend
Open a new terminal window:
```bash
cd frontend
npm install
```

Start the frontend development server:
```bash
npm run dev
```

---

## 🧪 Testing

We follow strict Test-Driven Development (TDD) for all backend business logic. To run the backend test suite:

```bash
cd backend
npm test
```

For watch mode during development:
```bash
npm run test:watch
```

---

## 📚 Documentation

The `docs/` folder is the heart of this project. If you are contributing, **you must read the `docs/RULES.md` and `docs/ARCHITECTURE.md` files first.** 

We maintain a living [DECISIONS.md](./docs/DECISIONS.md) to log why architectural choices were made, and an [EXPLAINED.md](./docs/EXPLAINED.md) to break down the system's logic into plain English for non-technical stakeholders.
