import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

export async function adminLogin(req, res) {
  const { username, password } = req.body
  try {
    const prisma = (await import('../config/prisma.js')).default

    // Find user by email (username) and ensure role is admin
    const user = await prisma.user.findUnique({ where: { email: username } })

    if (!user || user.role !== 'admin') {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Verify password using bcrypt (passwords are hashed in DB)
    const isValid = await bcrypt.compare(password, user.passwordHash)
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const token = jwt.sign({ role: 'admin', id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' })
    res.json({ token })
  } catch (err) {
    console.error('Admin login error:', err)
    res.status(500).json({ error: 'Admin login failed' })
  }
}

export async function getSuppliers(req, res) {
  // simple pass-through to existing prisma usage inside routes
  const prisma = (await import('../config/prisma.js')).default
  try {
    const suppliers = await prisma.supplier.findMany({ include: { user: true } })
    res.json({ suppliers })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch suppliers' })
  }
}

export async function approveSupplier(req, res) {
  const prisma = (await import('../config/prisma.js')).default
  const { id } = req.params
  try {
    const supplier = await prisma.supplier.update({ where: { id: Number(id) }, data: { status: 'approved' } })
    res.json({ supplier })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to approve supplier' })
  }
}

export async function rejectSupplier(req, res) {
  const prisma = (await import('../config/prisma.js')).default
  const { id } = req.params
  const { reason } = req.body
  if (!reason) return res.status(400).json({ error: 'Rejection reason required' })
  try {
    const supplier = await prisma.supplier.update({ where: { id: Number(id) }, data: { status: 'rejected', rejectionReason: reason } })
    res.json({ supplier })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to reject supplier' })
  }
}

export async function blockSupplier(req, res) {
  const prisma = (await import('../config/prisma.js')).default
  const { id } = req.params
  try {
    const supplier = await prisma.supplier.update({ where: { id: Number(id) }, data: { status: 'blocked' } })
    res.json({ supplier })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to block supplier' })
  }
}

export async function unblockSupplier(req, res) {
  const prisma = (await import('../config/prisma.js')).default
  const { id } = req.params
  try {
    const supplier = await prisma.supplier.update({ where: { id: Number(id) }, data: { status: 'approved' } })
    res.json({ supplier })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to unblock supplier' })
  }
}

export async function getBuyers(req, res) {
  const prisma = (await import('../config/prisma.js')).default
  try {
    const buyers = await prisma.user.findMany({ where: { role: 'buyer' }, orderBy: { id: 'asc' } })
    res.json({ buyers })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch buyers' })
  }
}
