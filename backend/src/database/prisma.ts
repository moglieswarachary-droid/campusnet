import { PrismaClient } from '@prisma/client';

// ========================================================
// CAMPUSNET PRISMA CLIENT SINGLETON INSTANCE
// ========================================================
// In development, Next.js / Vite hot-reloading can re-import
// this module, which would create multiple instances of PrismaClient.
// We bind the instance to globalThis to reuse a single connection pool.

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
