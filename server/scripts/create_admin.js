#!/usr/bin/env node
import dotenv from 'dotenv'
dotenv.config({ path: new URL('../.env', import.meta.url).pathname })
import bcrypt from 'bcryptjs'
import process from 'process'

const prisma = (await import('../config/prisma.js')).default

const [, , email, password, fullname = 'Admin User', phone = '+977000000000'] = process.argv

if (!email || !password) {
  console.error('Usage: node scripts/create_admin.js <email> <password> [fullname]')
  process.exit(1)
}

try {
  const salt = await bcrypt.genSalt(10)
  const passwordHash = await bcrypt.hash(password, salt)

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      passwordHash,
      role: 'admin',
      fullname,
      phone,
    },
    create: {
      email,
      passwordHash,
      fullname,
      role: 'admin',
      phone,
    },
  })

  console.log('Admin user created/updated:', user.email)
  process.exit(0)
} catch (err) {
  console.error('Failed to create admin user:', err)
  process.exit(2)
}
