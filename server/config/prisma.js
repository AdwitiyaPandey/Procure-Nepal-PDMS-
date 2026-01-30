import { PrismaClient } from '@prisma/client'

let prisma

// Use a single PrismaClient instance in development to avoid too many connections
if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient()
} else {
  if (!globalThis.__prisma) {
    globalThis.__prisma = new PrismaClient()
  }
  prisma = globalThis.__prisma
}

export default prisma
