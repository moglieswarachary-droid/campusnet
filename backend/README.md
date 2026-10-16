# 🛡️ CampusNet+ Backend Service

CampusNet backend is a native Node.js HTTP microservice (`http.createServer`) delivering session authentication, resource-level RBAC, SSE real-time notifications, and relational persistence via Prisma ORM and JSON store.

## Architecture

- **Runtime**: Node.js (native HTTP server, zero heavy framework overhead)
- **Database / ORM**: PostgreSQL via Prisma ORM (`prisma/schema.prisma`)
- **Data Isolation**: Multi-tenant institutional boundaries with strict organization and event ownership guarantees
- **Testing**: Native regression & RBAC test suite (`tests/test-api-rbac.mjs`)

## Directory Structure

```text
backend/
├── src/
│   ├── server.js              # Native Node.js HTTP server entry point
│   └── database/
│       └── prisma.ts          # PrismaClient connection pool singleton
├── prisma/
│   └── schema.prisma          # Canonical PostgreSQL relational schema (Task 1.1)
├── data/
│   ├── .gitkeep
│   └── campusnet_store.json   # Local persistent file store
├── tests/
│   └── test-api-rbac.mjs      # 41-case security & RBAC integration suite
├── .env.example               # Backend environment variable template
├── railway.json               # Standalone Railway deployment config
├── tsconfig.json              # TypeScript configuration
└── package.json               # Backend workspace package definition
```

## Setup & Running

```bash
# From repository root:
npm run dev:backend

# Or from backend directory:
cd backend
npm run dev
```

Server runs by default on `http://localhost:3199`.

## Running Tests

```bash
# From repository root:
npm run test:backend

# Or from backend directory:
cd backend
npm run test
```

## Prisma Schema Commands

```bash
npm run prisma:validate
npm run prisma:generate
```
