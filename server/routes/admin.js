import express from 'express'
import prisma from '../config/prisma.js'
import { authenticateToken } from '../middleware/auth.js'
import fs from 'fs'
import path from 'path'

const router = express.Router()


async function isAdmin(req, res, next) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    })

    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' })
    }

    next()
  } catch (error) {
    res.status(500).json({ error: 'Failed to verify admin status' })
  }
}


router.get('/suppliers', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { status = 'all', page = 1, limit = 10 } = req.query

    const where = {}
    if (status !== 'all') {
      where.status = status
    }

    const skip = (parseInt(page) - 1) * parseInt(limit)

    const [suppliers, total] = await Promise.all([
      prisma.supplier.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit),
        include: {
          user: {
            select: {
              id: true,
              fullname: true,
              email: true,
              phone: true,
            },
          },
          products: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
      prisma.supplier.count({ where }),
    ])

    res.json({
      suppliers,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / parseInt(limit)),
    })
  } catch (error) {
    console.error('Get suppliers error:', error)
    res.status(500).json({ error: 'Failed to fetch suppliers' })
  }
})


router.get('/suppliers/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const supplier = await prisma.supplier.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        user: {
          select: {
            id: true,
            fullname: true,
            email: true,
            phone: true,
          },
        },
        products: true,
      },
    })

    if (!supplier) {
      return res.status(404).json({ error: 'Supplier not found' })
    }

    res.json(supplier)
  } catch (error) {
    console.error('Get supplier error:', error)
    res.status(500).json({ error: 'Failed to fetch supplier' })
  }
})


router.patch('/suppliers/:id/approve', authenticateToken, isAdmin, async (req, res) => {
  try {
    const supplierId = parseInt(req.params.id)

    const supplier = await prisma.supplier.findUnique({
      where: { id: supplierId },
      include: { user: true },
    })

    if (!supplier) {
      return res.status(404).json({ error: 'Supplier not found' })
    }

    const updatedSupplier = await prisma.supplier.update({
      where: { id: supplierId },
      data: {
        status: 'approved',
        rejectionReason: null,
      },
      include: {
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

    
    console.log(`Supplier ${supplier.companyName} approved`)

    res.json({
      message: 'Supplier approved successfully',
      supplier: updatedSupplier,
    })
  } catch (error) {
    console.error('Approve supplier error:', error)
    res.status(500).json({ error: 'Failed to approve supplier' })
  }
})


router.patch('/suppliers/:id/reject', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { reason } = req.body
    const supplierId = parseInt(req.params.id)

    if (!reason || reason.trim() === '') {
      return res.status(400).json({ error: 'Rejection reason is required' })
    }

    const supplier = await prisma.supplier.findUnique({
      where: { id: supplierId },
      include: { user: true },
    })

    if (!supplier) {
      return res.status(404).json({ error: 'Supplier not found' })
    }

    const updatedSupplier = await prisma.supplier.update({
      where: { id: supplierId },
      data: {
        status: 'rejected',
        rejectionReason: reason,
      },
      include: {
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

    
    console.log(`Supplier ${supplier.companyName} rejected: ${reason}`)

    res.json({
      message: 'Supplier rejected successfully',
      supplier: updatedSupplier,
    })
  } catch (error) {
    console.error('Reject supplier error:', error)
    res.status(500).json({ error: 'Failed to reject supplier' })
  }
})


router.get('/stats/overview', authenticateToken, isAdmin, async (req, res) => {
  try {
    const [buyersCount, sellersCount, pendingSuppliersCount, approvedSuppliersCount, productsCount, quotesCount] =
      await Promise.all([
        prisma.user.count({ where: { role: 'buyer' } }),
        prisma.user.count({ where: { role: 'seller' } }),
        prisma.supplier.count({ where: { status: 'pending' } }),
        prisma.supplier.count({ where: { status: 'approved' } }),
        prisma.product.count(),
        prisma.quoteRequest.count(),
      ])

    res.json({
      buyersCount,
      sellersCount,
      pendingSuppliersCount,
      approvedSuppliersCount,
      productsCount,
      quotesCount,
    })
  } catch (error) {
    console.error('Get stats error:', error)
    res.status(500).json({ error: 'Failed to fetch stats' })
  }
})


router.get('/quote-requests', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { status = 'all', page = 1, limit = 10 } = req.query

    const where = {}
    if (status !== 'all') {
      where.status = status
    }

    const skip = (parseInt(page) - 1) * parseInt(limit)

    const [quoteRequests, total] = await Promise.all([
      prisma.quoteRequest.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit),
        include: {
          product: {
            select: {
              id: true,
              name: true,
            },
          },
          user: {
            select: {
              id: true,
              fullname: true,
              email: true,
            },
          },
        },
      }),
      prisma.quoteRequest.count({ where }),
    ])

    res.json({
      quoteRequests,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / parseInt(limit)),
    })
  } catch (error) {
    console.error('Get quote requests error:', error)
    res.status(500).json({ error: 'Failed to fetch quote requests' })
  }
})


router.post('/seed-products', async (req, res) => {
  try {
    console.log('🌱 Starting product seed...')

   
    const productsPath = path.join(process.cwd(), 'data', 'products.json')
    
    if (!fs.existsSync(productsPath)) {
      return res.status(404).json({ error: 'Products JSON file not found' })
    }

    const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf-8'))
    
    let seededCount = 0
    let skippedCount = 0
    const errors = []

    // First, ensure at least one supplier exists for demo
    let supplier = await prisma.supplier.findFirst()
    
    if (!supplier) {
      
      let user = await prisma.user.findFirst({ where: { email: 'admin@procurenp.com' } })
      
      if (!user) {
        user = await prisma.user.create({
          data: {
            fullname: 'Admin User',
            email: 'admin@procurenp.com',
            phone: '+97791234567',
            passwordHash: 'demo-hash',
            role: 'seller'
          }
        })
      }

    
      supplier = await prisma.supplier.create({
        data: {
          userId: user.id,
          companyName: 'ProcureNP Demo Supplier',
          status: 'approved'
        }
      })
    }

    
    for (const product of productsData) {
      try {
      
        const existingProduct = await prisma.product.findFirst({
          where: { name: product.name }
        })
        
        if (existingProduct) {
          skippedCount++
          continue
        }

        await prisma.product.create({
          data: {
            name: product.name,
            description: product.description,
            category: product.category,
            price: product.price,
            quantity: product.quantity,
            marginPercentage: product.marginPercentage,
            image: product.image,
            supplierId: supplier.id
          }
        })
        seededCount++
      } catch (err) {
        skippedCount++
        errors.push(`${product.name}: ${err.message}`)
      }
    }

    res.json({
      success: true,
      message: 'Product seeding completed',
      seeded: seededCount,
      skipped: skippedCount,
      errors: errors.length > 0 ? errors : undefined
    })

  } catch (error) {
    console.error('Admin seed error:', error)
    res.status(500).json({ error: 'Failed to seed products' })
  }
})

// Get database statistics
router.get('/stats', async (req, res) => {
  try {
    const [productCount, supplierCount, userCount, categoryCount] = await Promise.all([
      prisma.product.count(),
      prisma.supplier.count(),
      prisma.user.count(),
      prisma.category.count()
    ])

    res.json({
      products: productCount,
      suppliers: supplierCount,
      users: userCount,
      categories: categoryCount
    })
  } catch (error) {
    console.error('Get stats error:', error)
    res.status(500).json({ error: 'Failed to fetch stats' })
  }
})

export default router
