# Text-to-Speech Web Application — Frontend

This project is the frontend for a Text-to-Speech Web Application, built with:

- **Next.js** – React framework for fast SSR/SSG and routing.
- **Tailwind CSS** – Utility-first styling framework.
- **Zustand** – Lightweight state management.
- **TanStack React Query** – Data fetching, caching, and synchronization.

---

## A. Setup & Running Locally

### 1. Clone repository

```bash
git clone https://github.com/rizkizidane917/tts-fe.git
cd tts-fe
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment variables

```bash
API_URL=http://localhost:4001/api
NEXT_PUBLIC_API_KEY=http://localhost:4001/api
JWT_SECRET="super_secret_key"
```

### 4. Run frontend

```bash
npm run dev
```

## 📦 Design Decision:

### Design

Reason:
A clean two-column layout — TTS controls on the left, conversion history on the right — keeps the main action area in focus while still making past results accessible.

Trade Off:
Limits space for displaying longer histories without scrolling; requires responsive adjustments for smaller screens.

### Framework

NextJs

- Fast setup
- Server-side rendering
- File-based routing

Trade off:

- Some familiarity required with Next.js conventions
- Some advanced optimizations require a deeper understanding of how SSR and SSG work

### Styling

TailwindCSS

- Rapid styling via utility classes
- Consistent design without creating separate CSS files

Trade Off:

- AdvancedUtility class-heavy HTML can look cluttered without proper organization
- Requires familiarity with Tailwind’s class naming conventions

### State management

Zustand

- Lightweight global state management
- Minimal boilerplate for state that crosses components

Trade Off:

- Not as established as Redux
- Fewer middlewares/plugins
