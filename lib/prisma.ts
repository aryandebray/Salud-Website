import { PrismaClient } from '@prisma/client';

declare global {
  var prismaDb: PrismaClient | undefined;
}

const prisma = global.prismaDb || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prismaDb = prisma;
}

export default prisma; 