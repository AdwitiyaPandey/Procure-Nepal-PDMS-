import express from 'express'
import { PrismaClient } from '@prisma/client'
import { CreateCategorySchema } from '../utils/validationSchemas.js'

const router = express.Router()
const prisma = new PrismaClient()

// Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
    })

    res.json(categories)
  } catch (error) {
    console.error('Get categories error:', error)
    res.status(500).json({ error: 'Failed to fetch categories' })
  }
})

// Get category by ID
router.get('/:id', async (req, res) => {
  try {
    const category = await prisma.category.findUnique({
      where: { id: parseInt(req.params.id) },
    })

    if (!category) {
      return res.status(404).json({ error: 'Category not found' })
    }

    res.json(category)
  } catch (error) {
    console.error('Get category error:', error)
    res.status(500).json({ error: 'Failed to fetch category' })
  }
})

// Create category (admin only - seeded via migration)
router.post('/', async (req, res) => {
  try {
    const validatedData = CreateCategorySchema.parse(req.body)

    // Check if category already exists
    const existing = await prisma.category.findUnique({
      where: { name: validatedData.name },
    })

    if (existing) {
      return res.status(400).json({ error: 'Category already exists' })
    }

    const category = await prisma.category.create({
      data: validatedData,
    })

    res.status(201).json(category)
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: error.errors[0].message })
    }
    console.error('Create category error:', error)
    res.status(500).json({ error: 'Failed to create category' })
  }
})

export default router
