import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
});

// Add error handling for the prisma instance
prisma.$connect()
  .then(() => console.log('Successfully connected to database'))
  .catch((err) => console.error('Failed to connect to database', err));

export default prisma;
