import express from 'express'
import { adminLogin, getSuppliers, approveSupplier, rejectSupplier, blockSupplier, unblockSupplier, getBuyers } from '../controllers/adminController.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

// Admin login via username/password stored in .env
router.post('/login', adminLogin)

// Protected admin routes
// Protected admin routes - require valid token and admin role
router.get('/suppliers', authenticateToken, (req, res, next) => {
	if (req.user?.role !== 'admin') return res.status(403).json({ error: 'Admin access required' })
	next()
}, getSuppliers)

router.patch('/suppliers/:id/approve', authenticateToken, (req, res, next) => {
	if (req.user?.role !== 'admin') return res.status(403).json({ error: 'Admin access required' })
	next()
}, approveSupplier)

router.patch('/suppliers/:id/reject', authenticateToken, (req, res, next) => {
	if (req.user?.role !== 'admin') return res.status(403).json({ error: 'Admin access required' })
	next()
}, rejectSupplier)

router.patch('/suppliers/:id/block', authenticateToken, (req, res, next) => {
	if (req.user?.role !== 'admin') return res.status(403).json({ error: 'Admin access required' })
	next()
}, blockSupplier)

router.patch('/suppliers/:id/unblock', authenticateToken, (req, res, next) => {
	if (req.user?.role !== 'admin') return res.status(403).json({ error: 'Admin access required' })
	next()
}, unblockSupplier)

router.get('/buyers', authenticateToken, (req, res, next) => {
	if (req.user?.role !== 'admin') return res.status(403).json({ error: 'Admin access required' })
	next()
}, getBuyers)

export default router
