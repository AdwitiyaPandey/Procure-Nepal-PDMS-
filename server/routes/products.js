import express from 'express'
import prisma from '../config/prisma.js'
import { authenticateToken } from '../middleware/auth.js'
import upload from '../middleware/upload.js'
import { uploadToCloudinary } from '../utils/cloudinaryUpload.js'
import { CreateProductSchema, UpdateProductSchema } from '../utils/validationSchemas.js'

const router = express.Router()

// Create Product (Sellers only)
router.post('/', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    // Check if user is a seller
    if (req.user.role !== 'seller') {
      return res.status(403).json({ error: 'Only sellers can create products' })
    }

    // Get supplier ID
    const supplier = await prisma.supplier.findUnique({
      where: { userId: req.user.id },
    })

    if (!supplier || supplier.status !== 'approved') {
      return res.status(403).json({ error: 'You must be an approved seller to add products' })
    }

    // Validate data
    const validatedData = CreateProductSchema.parse({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      price: parseFloat(req.body.price),
      quantity: parseInt(req.body.quantity),
      marginPercentage: req.body.marginPercentage ? parseFloat(req.body.marginPercentage) : 20,
    })

    let imageUrl = null
    if (req.file) {
      try {
        const cloudinaryResult = await uploadToCloudinary(
          req.file.buffer,
          `product-${Date.now()}`,
          'procurenepal/products'
        )
        imageUrl = cloudinaryResult.secure_url
      } catch (uploadError) {
        console.error('Image upload failed:', uploadError)
        return res.status(400).json({ error: 'Failed to upload product image' })
      }
    }

    const product = await prisma.product.create({
      data: {
        supplierId: supplier.id,
        name: validatedData.name,
        description: validatedData.description,
        category: validatedData.category,
        price: validatedData.price,
        quantity: validatedData.quantity,
        marginPercentage: validatedData.marginPercentage,
        image: imageUrl,
      },
    })

    res.status(201).json(product)
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: error.errors[0].message })
    }
    console.error('Create product error:', error)
    res.status(500).json({ error: 'Failed to create product' })
  }
})

// Get all products (with filters and pagination)
router.get('/', async (req, res) => {
  try {
    const { category, minPrice, maxPrice, q, sort = 'newest', page = 1, limit = 12 } = req.query

    const where = {}

    if (category) {
      where.category = category
    }

    if (q) {
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
      ]
    }

    if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice) {
        where.price.gte = parseFloat(minPrice)
      }
      if (maxPrice) {
        where.price.lte = parseFloat(maxPrice)
      }
    }

    let orderBy = { createdAt: 'desc' }
    if (sort === 'price-low') {
      orderBy = { price: 'asc' }
    } else if (sort === 'price-high') {
      orderBy = { price: 'desc' }
    } else if (sort === 'oldest') {
      orderBy = { createdAt: 'asc' }
    }

    const skip = (parseInt(page) - 1) * parseInt(limit)

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: parseInt(limit),
        include: {
          supplier: {
            select: {
              id: true,
              companyName: true,
              user: {
                select: {
                  id: true,
                  fullname: true,
                },
              },
            },
          },
        },
      }),
      prisma.product.count({ where }),
    ])

    res.json({
      products,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / parseInt(limit)),
    })
  } catch (error) {
    console.error('Get products error:', error)
    res.status(500).json({ error: 'Failed to fetch products' })
  }
})

// Get product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        supplier: {
            select: {
              id: true,
              companyName: true,
              user: {
                select: {
                  id: true,
                  fullname: true,
                  email: true,
                  phone: true,
                },
              },
            },
        },
      },
    })

    if (!product) {
      return res.status(404).json({ error: 'Product not found' })
    }

    res.json(product)
  } catch (error) {
    console.error('Get product error:', error)
    res.status(500).json({ error: 'Failed to fetch product' })
  }
})

// Update Product (Sellers only)
router.put('/:id', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    if (req.user.role !== 'seller') {
      return res.status(403).json({ error: 'Only sellers can update products' })
    }

    const productId = parseInt(req.params.id)

    // Check if product belongs to this seller
    const product = await prisma.product.findUnique({
      where: { id: productId },
    })

    if (!product) {
      return res.status(404).json({ error: 'Product not found' })
    }

    const supplier = await prisma.supplier.findUnique({
      where: { userId: req.user.id },
    })

    if (product.supplierId !== supplier.id) {
      return res.status(403).json({ error: 'You can only update your own products' })
    }

    // Validate data (partial validation)
    const updateData = {}
    if (req.body.name) updateData.name = req.body.name
    if (req.body.description) updateData.description = req.body.description
    if (req.body.category) updateData.category = req.body.category
    if (req.body.price) updateData.price = parseFloat(req.body.price)
    if (req.body.quantity) updateData.quantity = parseInt(req.body.quantity)
    if (req.body.marginPercentage) updateData.marginPercentage = parseFloat(req.body.marginPercentage)

    if (req.file) {
      try {
        const cloudinaryResult = await uploadToCloudinary(
          req.file.buffer,
          `product-${Date.now()}`,
          'procurenepal/products'
        )
        updateData.image = cloudinaryResult.secure_url
      } catch (uploadError) {
        console.error('Image upload failed:', uploadError)
        return res.status(400).json({ error: 'Failed to upload product image' })
      }
    }

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: updateData,
    })

    res.json(updatedProduct)
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: error.errors[0].message })
    }
    console.error('Update product error:', error)
    res.status(500).json({ error: 'Failed to update product' })
  }
})

// Delete Product (Sellers only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'seller') {
      return res.status(403).json({ error: 'Only sellers can delete products' })
    }

    const productId = parseInt(req.params.id)

    const product = await prisma.product.findUnique({
      where: { id: productId },
    })

    if (!product) {
      return res.status(404).json({ error: 'Product not found' })
    }

    const supplier = await prisma.supplier.findUnique({
      where: { userId: req.user.id },
    })

    if (product.supplierId !== supplier.id) {
      return res.status(403).json({ error: 'You can only delete your own products' })
    }

    await prisma.product.delete({
      where: { id: productId },
    })

    res.json({ message: 'Product deleted successfully' })
  } catch (error) {
    console.error('Delete product error:', error)
    res.status(500).json({ error: 'Failed to delete product' })
  }
})

// Get seller's products
router.get('/seller/:supplierId', async (req, res) => {
  try {
    const supplierId = parseInt(req.params.supplierId)

    const products = await prisma.product.findMany({
      where: { supplierId },
      orderBy: { createdAt: 'desc' },
    })

    res.json(products)
  } catch (error) {
    console.error('Get seller products error:', error)
    res.status(500).json({ error: 'Failed to fetch products' })
  }
})

export default router
