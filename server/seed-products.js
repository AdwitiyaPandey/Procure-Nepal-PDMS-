import prisma from './config/prisma.js'
import fs from 'fs'
import path from 'path'
import process from 'process'

 

async function seedProducts() {
  try {
    console.log('🌱 Starting product seed...')

    // Load products from JSON
    const productsPath = path.join(process.cwd(), 'data', 'products.json')
    
    if (!fs.existsSync(productsPath)) {
      console.error('❌ Products JSON file not found at', productsPath)
      process.exit(1)
    }

    const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf-8'))
    
    let seededCount = 0
    let skippedCount = 0

    // First, ensure at least one supplier exists for demo
    let supplier = await prisma.supplier.findFirst()
    
    if (!supplier) {
      console.log('📝 Creating demo user...')
      // Create a demo user first if needed
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
        console.log('✅ Demo user created')
      }

      console.log('📝 Creating demo supplier...')
      // Create supplier for the user
      supplier = await prisma.supplier.create({
        data: {
          userId: user.id,
          companyName: 'ProcureNP Demo Supplier',
          status: 'approved'
        }
      })
      console.log('✅ Demo supplier created')
    } else {
      console.log(`✅ Using existing supplier: ${supplier.companyName}`)
    }

    // Now seed products
    console.log(`📦 Seeding ${productsData.length} products...`)
    for (const product of productsData) {
      try {
        // Check if product already exists
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
        console.log(`  ✅ ${product.name}`)
      } catch (err) {
        skippedCount++
        console.warn(`  ⚠️ ${product.name}: ${err.message}`)
      }
    }

    console.log(`\n🎉 Seeding completed!`)
    console.log(`✅ Seeded: ${seededCount} products`)
    console.log(`⏭️  Skipped: ${skippedCount} products`)
    console.log(`📊 Total products in database: ${seededCount + (skippedCount > 0 ? skippedCount : 0)}`)

  } catch (error) {
    console.error('❌ Seed error:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

seedProducts()
