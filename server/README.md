# Express + TypeScript Backend

A production-ready TypeScript + Express backend configured with modern best practices, strict type-checking, modular architecture, and rapid hot-reloading.

---

## 📁 Project Structure

```text
server/
├── src/
│   ├── config/
│   │   └── env.ts                 # Validated environment configuration
│   ├── controllers/
│   │   └── health.controller.ts   # Route controller handlers
│   ├── middlewares/
│   │   ├── error.middleware.ts    # Centralized global error handling
│   │   └── notFound.middleware.ts # 404 Route fallback handler
│   ├── routes/
│   │   ├── health.routes.ts       # Health endpoint definitions
│   │   └── index.ts               # Root API router aggregator
│   ├── app.ts                     # Express app setup and middleware pipeline
│   └── index.ts                   # Server bootstrap & graceful shutdown
├── .env                           # Local environment variables
├── .env.example                   # Environment variable template
├── .gitignore                     # Git ignore rules
├── package.json                   # Dependencies and npm scripts
└── tsconfig.json                  # TypeScript compiler options
```

---

## ⚡ Features

- **TypeScript 7 & Node 24 Support**: Strict typing with modern `node16` module resolution.
- **Fast Hot Reloading**: Powered by [`tsx`](https://github.com/privatenumber/tsx) for instant live reloading during development.
- **Security & Utilities**:
  - `helmet`: Security HTTP headers
  - `cors`: Cross-Origin Resource Sharing configuration
  - `morgan`: Request logging
  - `dotenv`: Environment configuration
- **Graceful Shutdown**: Handles `SIGTERM` and `SIGINT` signals cleanly.
- **Centralized Error Handling**: Standardized JSON responses for 404s and 500s.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env` if not already created:
```bash
cp .env.example .env
```

### 3. Run in Development Mode
Starts the server with hot reloading on changes:
```bash
npm run dev
```

### 4. Build for Production
Compiles TypeScript to JavaScript into the `dist/` directory:
```bash
npm run build
```

### 5. Run Production Build
Runs the compiled application:
```bash
npm start
```

### 6. Type Check
Validates TypeScript types without emitting files:
```bash
npm run typecheck
```

---

## 📡 Available Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | API status and welcome message |
| `GET` | `/api/health` | Service health status, uptime, and environment |
