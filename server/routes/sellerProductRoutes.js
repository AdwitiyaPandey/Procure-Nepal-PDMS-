import express from 'express'
import { createProduct, listProducts, updateProduct, deleteProduct } from '../controllers/sellerProductController.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

router.post('/', authenticateToken, createProduct)
router.get('/', authenticateToken, listProducts)
router.patch('/:id', authenticateToken, updateProduct)
router.delete('/:id', authenticateToken, deleteProduct)


export default router
