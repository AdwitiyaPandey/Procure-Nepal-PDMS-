import jwt from 'jsonwebtoken'
import process from 'process'

export function adminLogin(req, res) {
  const { username, password } = req.body
  const adminUser = process.env.ADMIN_USER
  const adminPass = process.env.ADMIN_PASS

  if (!adminUser || !adminPass) {
    return res.status(500).json({ error: 'Admin credentials not configured' })
  }

  if (username !== adminUser || password !== adminPass) {
    return res.status(401).json({ error: 'Invalid credentials' })
  }

  const token = jwt.sign({ role: 'admin', username }, process.env.JWT_SECRET, { expiresIn: '7d' })
  res.json({ token })
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
