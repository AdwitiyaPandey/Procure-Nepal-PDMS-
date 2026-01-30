import prisma from '../config/prisma.js'

export async function createProduct(req, res) {
  try {
    const sellerUserId = req.user.id
    const { name, description, category, price, quantity, marginPercentage } = req.body

    // Ensure user is a seller
    if (req.user.role !== 'seller') return res.status(403).json({ error: 'Only sellers can create products' })

    const supplier = await prisma.supplier.findUnique({ where: { userId: sellerUserId } })
    if (!supplier) return res.status(403).json({ error: 'Supplier profile not found' })

    const product = await prisma.product.create({
      data: {
        name,
        description,
        category,
        price: Number(price),
        quantity: Number(quantity),
        marginPercentage: marginPercentage ? Number(marginPercentage) : 20,
        supplierId: supplier.id,
      },
    })

    res.status(201).json({ product })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to create product' })
  }
}

export async function listProducts(req, res) {
  try {
    const sellerUserId = req.user.id
    if (req.user.role !== 'seller') return res.status(403).json({ error: 'Only sellers can view products' })

    const supplier = await prisma.supplier.findUnique({ where: { userId: sellerUserId } })
    if (!supplier) return res.status(403).json({ error: 'Supplier profile not found' })

    const products = await prisma.product.findMany({ where: { supplierId: supplier.id } })
    res.json({ products })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to list products' })
  }
}

export async function updateProduct(req, res) {
  try {
    const sellerUserId = req.user.id
    const { id } = req.params
    const updates = req.body

    if (req.user.role !== 'seller') return res.status(403).json({ error: 'Only sellers can update products' })

    const supplier = await prisma.supplier.findUnique({ where: { userId: sellerUserId } })
    if (!supplier) return res.status(403).json({ error: 'Supplier profile not found' })

    const existing = await prisma.product.findUnique({ where: { id: Number(id) } })
    if (!existing || existing.supplierId !== supplier.id) return res.status(404).json({ error: 'Product not found' })

    const product = await prisma.product.update({ where: { id: Number(id) }, data: {
      name: updates.name ?? existing.name,
      description: updates.description ?? existing.description,
      category: updates.category ?? existing.category,
      price: updates.price !== undefined ? Number(updates.price) : existing.price,
      quantity: updates.quantity !== undefined ? Number(updates.quantity) : existing.quantity,
      marginPercentage: updates.marginPercentage !== undefined ? Number(updates.marginPercentage) : existing.marginPercentage,
    }})

    res.json({ product })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to update product' })
  }
}

export async function deleteProduct(req, res) {
  try {
    const sellerUserId = req.user.id
    const { id } = req.params

    if (req.user.role !== 'seller') return res.status(403).json({ error: 'Only sellers can delete products' })

    const supplier = await prisma.supplier.findUnique({ where: { userId: sellerUserId } })
    if (!supplier) return res.status(403).json({ error: 'Supplier profile not found' })

    const existing = await prisma.product.findUnique({ where: { id: Number(id) } })
    if (!existing || existing.supplierId !== supplier.id) return res.status(404).json({ error: 'Product not found' })

    await prisma.product.delete({ where: { id: Number(id) } })
    res.json({ message: 'Deleted' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to delete product' })
  }
}
