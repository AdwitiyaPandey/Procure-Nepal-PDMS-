import express from 'express'
import prisma from '../config/prisma.js'
import { authenticateToken } from '../middleware/auth.js'
import { QuoteRequestSchema } from '../utils/validationSchemas.js'

const router = express.Router()

// Create quote request
router.post('/', authenticateToken, async (req, res) => {
  try {
    const validatedData = QuoteRequestSchema.parse(req.body)
    const productId = parseInt(req.body.productId)

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    })

    if (!product) {
      return res.status(404).json({ error: 'Product not found' })
    }

    // Create quote request
    const quoteRequest = await prisma.quoteRequest.create({
      data: {
        productId,
        userId: req.user.id,
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone,
        company: validatedData.company,
        quantity: validatedData.quantity,
        message: validatedData.message,
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            supplier: {
              select: {
                id: true,
                companyName: true,
                user: {
                  select: {
                    email: true,
                    phone: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    res.status(201).json(quoteRequest)
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: error.errors[0].message })
    }
    console.error('Create quote request error:', error)
    res.status(500).json({ error: 'Failed to create quote request' })
  }
})

// Get user's quote requests
router.get('/user/my-requests', authenticateToken, async (req, res) => {
  try {
    const quoteRequests = await prisma.quoteRequest.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            image: true,
            supplier: {
              select: {
                id: true,
                companyName: true,
              },
            },
          },
        },
      },
    })

    res.json(quoteRequests)
  } catch (error) {
    console.error('Get user quote requests error:', error)
    res.status(500).json({ error: 'Failed to fetch quote requests' })
  }
})

// Get supplier's quote requests (for their products)
router.get('/supplier/received', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'seller') {
      return res.status(403).json({ error: 'Only sellers can view their quote requests' })
    }

    const supplier = await prisma.supplier.findUnique({
      where: { userId: req.user.id },
    })

    if (!supplier) {
      return res.status(404).json({ error: 'Supplier profile not found' })
    }

    const quoteRequests = await prisma.quoteRequest.findMany({
      where: {
        product: {
          supplierId: supplier.id,
        },
      },
      orderBy: { createdAt: 'desc' },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
          },
        },
        user: {
          select: {
            id: true,
            fullname: true,
            email: true,
            phone: true,
          },
        },
      },
    })

    res.json(quoteRequests)
  } catch (error) {
    console.error('Get supplier quote requests error:', error)
    res.status(500).json({ error: 'Failed to fetch quote requests' })
  }
})

// Get quote request by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const quoteRequest = await prisma.quoteRequest.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        product: true,
        user: {
          select: {
            id: true,
            fullname: true,
            email: true,
            phone: true,
          },
        },
      },
    })

    if (!quoteRequest) {
      return res.status(404).json({ error: 'Quote request not found' })
    }

    // Check authorization
    if (quoteRequest.userId !== req.user.id) {
      // Check if user is the seller
      const supplier = await prisma.supplier.findUnique({
        where: { userId: req.user.id },
      })

      if (!supplier || quoteRequest.product.supplierId !== supplier.id) {
        return res.status(403).json({ error: 'Not authorized to view this quote request' })
      }
    }

    res.json(quoteRequest)
  } catch (error) {
    console.error('Get quote request error:', error)
    res.status(500).json({ error: 'Failed to fetch quote request' })
  }
})

// Update quote request status (sellers only)
router.patch('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body

    if (!['pending', 'responded', 'completed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' })
    }

    const quoteRequest = await prisma.quoteRequest.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        product: {
          select: {
            supplierId: true,
          },
        },
      },
    })

    if (!quoteRequest) {
      return res.status(404).json({ error: 'Quote request not found' })
    }

    // Check if user is the seller
    const supplier = await prisma.supplier.findUnique({
      where: { userId: req.user.id },
    })

    if (!supplier || quoteRequest.product.supplierId !== supplier.id) {
      return res.status(403).json({ error: 'Only the seller can update this quote request' })
    }

    const updatedQuote = await prisma.quoteRequest.update({
      where: { id: parseInt(req.params.id) },
      data: { status },
    })

    res.json(updatedQuote)
  } catch (error) {
    console.error('Update quote request error:', error)
    res.status(500).json({ error: 'Failed to update quote request' })
  }
})

// Delete quote request
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const quoteRequest = await prisma.quoteRequest.findUnique({
      where: { id: parseInt(req.params.id) },
    })

    if (!quoteRequest) {
      return res.status(404).json({ error: 'Quote request not found' })
    }

    // Check authorization
    if (quoteRequest.userId !== req.user.id) {
      return res.status(403).json({ error: 'Only the requester can delete this quote request' })
    }

    await prisma.quoteRequest.delete({
      where: { id: parseInt(req.params.id) },
    })

    res.json({ message: 'Quote request deleted successfully' })
  } catch (error) {
    console.error('Delete quote request error:', error)
    res.status(500).json({ error: 'Failed to delete quote request' })
  }
})

export default router
