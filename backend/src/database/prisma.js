import { PrismaClient } from '@prisma/client';

// ========================================================
// CAMPUSNET PRISMA CLIENT SINGLETON INSTANCE (ESM)
// ========================================================
// We bind the instance to globalThis to reuse a single connection pool
// across module re-imports in development and hot-reloads.

const globalForPrisma = globalThis;

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
