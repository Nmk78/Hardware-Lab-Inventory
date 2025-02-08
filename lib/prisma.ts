// import { PrismaClient } from '@prisma/client'

// const globalForPrisma = global as unknown as { prisma: PrismaClient }

// export const prisma =
//   globalForPrisma.prisma ||
//   new PrismaClient({
//     log: ['error'],
//     // log: ['query', 'info', 'warn', 'error'],
//   })

// if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// // prisma.$on('query', (e: { query: string; params: string; duration: string }) => {
// //   console.log('Query: ' + e.query)
// //   console.log('Params: ' + e.params)
// //   console.log('Duration: ' + e.duration + 'ms')
// // })

// // export { prisma }
// @ts-nocheck
import { PrismaClient } from '../../prisma/generated/client';

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export default prisma;