import dotenv from 'dotenv'
dotenv.config()

import process from 'process'
import express from 'express'
import cors from 'cors'
import prisma from './config/prisma.js'

// Import routes
import authRoutes from './routes/auth.js'
import productRoutes from './routes/products.js'
import categoryRoutes from './routes/categories.js'
import quoteRoutes from './routes/quoteRequests.js'
import adminRoutes from './routes/adminRoutes.js'
import sellerProductRoutes from './routes/sellerProductRoutes.js'
import favouriteRoutes from './routes/favourites.js'

const app = express()

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'ProcureNP server is running' })
})

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/quote-requests', quoteRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/seller/products', sellerProductRoutes)
app.use('/api/favourites', favouriteRoutes)

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err)
  res.status(err.status || 500).json({ 
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message 
  })
})

// Start server
const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
  console.log(`🚀 ProcureNP server running on port ${PORT}`)
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`)
})

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down gracefully...')
  await prisma.$disconnect()
  process.exit(0)
})


