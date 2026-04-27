import { PrismaClient } from '@/lib/db/interest-list-client';

const globalForInterest = globalThis as unknown as { interestListPrisma: PrismaClient | undefined };

export const interestListPrisma =
  globalForInterest.interestListPrisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForInterest.interestListPrisma = interestListPrisma;
}
