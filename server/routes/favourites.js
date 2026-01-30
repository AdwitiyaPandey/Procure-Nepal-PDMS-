import express from 'express'
import prisma from '../config/prisma.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

// Add product to favorites
router.post('/add', authenticateToken, async (req, res) => {
  try {
    const { productId } = req.body
    const userId = req.user?.id

    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required' })
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: parseInt(productId) }
    })

    if (!product) {
      return res.status(404).json({ error: 'Product not found' })
    }

    // Check if already in favorites
    const existing = await prisma.favourite.findUnique({
      where: {
        userId_productId: {
          userId: userId,
          productId: parseInt(productId)
        }
      }
    })

    if (existing) {
      return res.status(400).json({ error: 'Already in favorites' })
    }

    // Add to favorites
    const favourite = await prisma.favourite.create({
      data: {
        userId: userId,
        productId: parseInt(productId)
      }
    })

    res.status(201).json({
      success: true,
      message: 'Added to favorites',
      favourite
    })
  } catch (err) {
    console.error('Error adding to favorites:', err)
    res.status(500).json({ error: 'Failed to add to favorites' })
  }
})

// Remove from favorites
router.delete('/:productId', authenticateToken, async (req, res) => {
  try {
    const { productId } = req.params
    const userId = req.user?.id

    const favourite = await prisma.favourite.delete({
      where: {
        userId_productId: {
          userId: userId,
          productId: parseInt(productId)
        }
      }
    })

    res.json({
      success: true,
      message: 'Removed from favorites',
      favourite
    })
  } catch (err) {
    console.error('Error removing from favorites:', err)
    res.status(500).json({ error: 'Failed to remove from favorites' })
  }
})

// Get user's favorites
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.id

    const favourites = await prisma.favourite.findMany({
      where: { userId: userId },
      include: {
        product: {
          include: {
            supplier: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    res.json({
      success: true,
      count: favourites.length,
      data: favourites
    })
  } catch (err) {
    console.error('Error fetching favorites:', err)
    res.status(500).json({ error: 'Failed to fetch favorites' })
  }
})


router.get('/check/:productId', authenticateToken, async (req, res) => {
  try {
    const { productId } = req.params
    const userId = req.user?.id

    const favourite = await prisma.favourite.findUnique({
      where: {
        userId_productId: {
          userId: userId,
          productId: parseInt(productId)
        }
      }
    })

    res.json({
      success: true,
      isFavourite: !!favourite
    })
  } catch (err) {
    console.error('Error checking favorite:', err)
    res.status(500).json({ error: 'Failed to check favorite status' })
  }
})

export default router
