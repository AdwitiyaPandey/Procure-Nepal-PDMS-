import prisma from '../config/prisma.js'
import fs from 'fs'
import path from 'path'

 

async function seed() {
  try {
    console.log('🌱 Starting database seed...')

    // Delete existing categories to avoid duplicates
    await prisma.category.deleteMany()

    // Create default categories
    const categories = [
      { name: 'Agriculture & Food', description: 'Farm products and food items', icon: '🌾' },
      { name: 'Metal & Machinery', description: 'Metal products and machinery', icon: '⚙️' },
      { name: 'Textiles & Apparel', description: 'Fabric, clothing, and textile products', icon: '👕' },
      { name: 'Construction Materials', description: 'Building and construction materials', icon: '🏗️' },
      { name: 'Chemicals & Plastics', description: 'Chemical products and plastics', icon: '🧪' },
      { name: 'Handicrafts', description: 'Handmade and artisan products', icon: '🎨' },
      { name: 'Spices & Condiments', description: 'Spices and food seasonings', icon: '🌶️' },
      { name: 'Electronics & IT', description: 'Electronic devices and IT products', icon: '💻' },
      { name: 'Pharmaceuticals', description: 'Pharmaceutical products', icon: '💊' },
      { name: 'Energy & Utilities', description: 'Energy and utility products', icon: '⚡' },
      { name: 'Automotive', description: 'Automotive products and parts', icon: '🚗' },
      { name: 'Furniture & Decor', description: 'Furniture and decorative items', icon: '🪑' },
      { name: 'Leather & Accessories', description: 'Leather goods and accessories', icon: '👜' },
      { name: 'Paper & Packaging', description: 'Paper and packaging materials', icon: '📦' },
      { name: 'Beauty & Personal Care', description: 'Beauty and personal care products', icon: '💄' },
      { name: 'Home Appliances', description: 'Home appliances and equipment', icon: '🏠' },
    ]

    for (const category of categories) {
      await prisma.category.create({ data: category })
      console.log(`✅ Created category: ${category.name}`)
    }

  
    const productsPath = path.join(process.cwd(), 'data', 'products.json')
    
    if (fs.existsSync(productsPath)) {
      const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf-8'))
      
      let productCount = 0
      
      // Get or find a supplier to attach products to
      let supplier = await prisma.supplier.findFirst()
      
     
      const supplierId = supplier?.id || 1
      
      for (const product of productsData) {
        try {
          // Check if product already exists
          const existingProduct = await prisma.product.findFirst({
            where: { name: product.name }
          })
          
          if (!existingProduct) {
            await prisma.product.create({
              data: {
                name: product.name,
                description: product.description,
                category: product.category,
                price: product.price,
                quantity: product.quantity,
                marginPercentage: product.marginPercentage,
                image: product.image,
                supplierId: supplierId
              }
            })
            productCount++
          }
        } catch (err) {
          console.warn(`⚠️ Product ${product.name} skipped:`, err.message)
        }
      }
      console.log(`✅ Seeded ${productCount} products`)
    } else {
      console.warn('⚠️ Products JSON file not found at', productsPath)
    }

    console.log('🎉 Seed completed successfully!')
  } catch (error) {
    console.error('❌ Seed error:', error.message)
    
  } finally {
    await prisma.$disconnect()
  }
}

seed()
