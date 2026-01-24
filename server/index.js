require('dotenv').config()
const express = require('express')
const cors = require('cors')
const multer = require('multer')
const path = require('path')
const fs = require('fs-extra')
const { v4: uuidv4 } = require('uuid')
const nodemailer = require('nodemailer')

const DATA_DIR = path.join(__dirname, 'data')
const UPLOADS_DIR = path.join(__dirname, 'uploads')
const SUPPLIERS_FILE = path.join(DATA_DIR, 'suppliers.json')
const USERS_FILE = path.join(DATA_DIR, 'users.json')
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json')

fs.ensureDirSync(DATA_DIR)
fs.ensureDirSync(UPLOADS_DIR)
if (!fs.existsSync(SUPPLIERS_FILE)) fs.writeJsonSync(SUPPLIERS_FILE, [])
if (!fs.existsSync(USERS_FILE)) fs.writeJsonSync(USERS_FILE, [])
if (!fs.existsSync(PRODUCTS_FILE)) fs.writeJsonSync(PRODUCTS_FILE, [])

const app = express()
app.use(cors())
app.use(express.json())
app.use('/uploads', express.static(UPLOADS_DIR))

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const id = Date.now() + '-' + uuidv4()
    const ext = path.extname(file.originalname)
    cb(null, `${id}${ext}`)
  }
})
const upload = multer({ storage })

// Data access functions
function readSuppliers() {
  return fs.readJsonSync(SUPPLIERS_FILE)
}
function writeSuppliers(list) {
  fs.writeJsonSync(SUPPLIERS_FILE, list, { spaces: 2 })
}

function readUsers() {
  return fs.readJsonSync(USERS_FILE)
}
function writeUsers(list) {
  fs.writeJsonSync(USERS_FILE, list, { spaces: 2 })
}

function readProducts() {
  return fs.readJsonSync(PRODUCTS_FILE)
}
function writeProducts(list) {
  fs.writeJsonSync(PRODUCTS_FILE, list, { spaces: 2 })
}

// Simple transporter configured via env
function createTransporter() {
  const host = process.env.SMTP_HOST
  if (!host) return null
  return nodemailer.createTransport({
    host: host,
    port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  })
}

app.post('/api/suppliers', upload.fields([{ name: 'citizenship' }, { name: 'profilePhoto' }]), (req, res) => {
  try {
    const body = req.body
    const files = req.files || {}
    if (!body.email || !body.fullname || !body.companyName) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const supplier = {
      id: uuidv4(),
      fullname: body.fullname,
      email: body.email,
      companyName: body.companyName,
      pan: body.pan || '',
      vat: body.vat || '',
      turnover: body.turnover || '',
      established: body.established || '',
      status: 'pending',
      submittedAt: new Date().toISOString(),
      files: {
        citizenship: files.citizenship ? `/uploads/${path.basename(files.citizenship[0].path)}` : null,
        profilePhoto: files.profilePhoto ? `/uploads/${path.basename(files.profilePhoto[0].path)}` : null
      }
    }

    const list = readSuppliers()
    list.push(supplier)
    writeSuppliers(list)
    return res.json({ ok: true, id: supplier.id })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Server error' })
  }
})

app.get('/api/admin/suppliers', (req, res) => {
  try {
    const list = readSuppliers()
    res.json(list)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

app.post('/api/admin/suppliers/:id/approve', async (req, res) => {
  try {
    const id = req.params.id
    const list = readSuppliers()
    const idx = list.findIndex(s => s.id === id)
    if (idx === -1) return res.status(404).json({ error: 'Not found' })
    if (list[idx].status === 'approved') return res.json({ ok: true, message: 'Already approved' })

    const tempPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-4)
    list[idx].status = 'approved'
    list[idx].approvedAt = new Date().toISOString()
    list[idx].tempPassword = tempPassword

    writeSuppliers(list)

    const transporter = createTransporter()
    if (transporter) {
      const from = process.env.SMTP_FROM || process.env.SMTP_USER
      const mailOptions = {
        from: from,
        to: list[idx].email,
        subject: 'Your supplier account has been approved',
        text: `Hello ${list[idx].fullname},\n\nYour supplier account has been approved by the admin.\nYour temporary password: ${tempPassword}\nPlease sign in and change your password.\n\nRegards,\nAdmin` 
      }
      try {
        await transporter.sendMail(mailOptions)
      } catch (e) {
        console.error('Error sending mail', e)
      }
    }

    return res.json({ ok: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

app.post('/api/admin/suppliers/:id/reject', (req, res) => {
  try {
    const id = req.params.id
    const { reason } = req.body || {}
    const list = readSuppliers()
    const idx = list.findIndex(s => s.id === id)
    if (idx === -1) return res.status(404).json({ error: 'Not found' })
    list[idx].status = 'rejected'
    list[idx].rejectedAt = new Date().toISOString()
    list[idx].rejectionReason = reason || null
    writeSuppliers(list)
    return res.json({ ok: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

// USER ENDPOINTS
app.post('/api/users', upload.any(), (req, res) => {
  try {
    const { uid, role, fullname, email, companyName, phone, pan, vat, turnover, established } = req.body
    const files = req.files || []

    const user = {
      uid,
      role,
      fullname,
      email,
      companyName: companyName || null,
      phone,
      pan: pan || null,
      vat: vat || null,
      turnover: turnover || null,
      established: established || null,
      files: {
        citizenship: files.find(f => f.fieldname === 'citizenship') ? `/uploads/${path.basename(files.find(f => f.fieldname === 'citizenship').path)}` : null,
        panVatDoc: files.find(f => f.fieldname === 'panVatDoc') ? `/uploads/${path.basename(files.find(f => f.fieldname === 'panVatDoc').path)}` : null,
        profilePhoto: files.find(f => f.fieldname === 'profilePhoto') ? `/uploads/${path.basename(files.find(f => f.fieldname === 'profilePhoto').path)}` : null
      },
      createdAt: new Date().toISOString()
    }

    const users = readUsers()
    users.push(user)
    writeUsers(users)
    
    res.json({ ok: true, uid })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

app.get('/api/users/:uid', (req, res) => {
  try {
    const users = readUsers()
    const user = users.find(u => u.uid === req.params.uid)
    if (!user) return res.status(404).json({ error: 'User not found' })
    res.json(user)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

// PRODUCT ENDPOINTS
app.post('/api/products', upload.single('image'), (req, res) => {
  try {
    const { uid, name, description, category, price, quantity, marginPercentage } = req.body
    if (!uid || !name || !price) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const product = {
      id: uuidv4(),
      uid,
      name,
      description: description || '',
      category: category || 'General',
      price: parseFloat(price),
      quantity: parseInt(quantity) || 0,
      marginPercentage: parseFloat(marginPercentage) || 20, // Default 20% margin
      image: req.file ? `/uploads/${path.basename(req.file.path)}` : null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const products = readProducts()
    products.push(product)
    writeProducts(products)

    res.json({ ok: true, product })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

app.get('/api/products', (req, res) => {
  try {
    const products = readProducts()
    const { q, category, minPrice, maxPrice, sort, limit, offset } = req.query
    
    let filtered = products
    
    // Search filter
    if (q) {
      const query = q.toLowerCase()
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.description.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
      )
    }
    
    // Category filter
    if (category) {
      filtered = filtered.filter(p => p.category === category)
    }
    
    // Price filters
    if (minPrice) {
      filtered = filtered.filter(p => p.price >= parseFloat(minPrice))
    }
    if (maxPrice) {
      filtered = filtered.filter(p => p.price <= parseFloat(maxPrice))
    }
    
    // Sort
    if (sort) {
      if (sort === 'price_asc') {
        filtered.sort((a, b) => a.price - b.price)
      } else if (sort === 'price_desc') {
        filtered.sort((a, b) => b.price - a.price)
      } else if (sort === 'newest') {
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      }
    }
    
    // Pagination
    const total = filtered.length
    const limitNum = limit ? parseInt(limit) : 20
    const offsetNum = offset ? parseInt(offset) : 0
    filtered = filtered.slice(offsetNum, offsetNum + limitNum)
    
    res.json({ products: filtered, total, limit: limitNum, offset: offsetNum })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

app.get('/api/categories', (req, res) => {
  try {
    const products = readProducts()
    const categories = [...new Set(products.map(p => p.category))].sort()
    res.json(categories)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

app.get('/api/products/supplier/:uid', (req, res) => {
  try {
    const products = readProducts()
    const supplierProducts = products.filter(p => p.uid === req.params.uid)
    res.json(supplierProducts)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

app.put('/api/products/:id', upload.single('image'), (req, res) => {
  try {
    const { name, description, category, price, quantity, marginPercentage } = req.body
    const products = readProducts()
    const idx = products.findIndex(p => p.id === req.params.id)
    
    if (idx === -1) return res.status(404).json({ error: 'Product not found' })

    products[idx].name = name || products[idx].name
    products[idx].description = description || products[idx].description
    products[idx].category = category || products[idx].category
    if (price) products[idx].price = parseFloat(price)
    if (quantity) products[idx].quantity = parseInt(quantity)
    if (marginPercentage) products[idx].marginPercentage = parseFloat(marginPercentage)
    if (req.file) products[idx].image = `/uploads/${path.basename(req.file.path)}`
    products[idx].updatedAt = new Date().toISOString()

    writeProducts(products)
    res.json({ ok: true, product: products[idx] })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

app.delete('/api/products/:id', (req, res) => {
  try {
    const products = readProducts()
    const idx = products.findIndex(p => p.id === req.params.id)
    
    if (idx === -1) return res.status(404).json({ error: 'Product not found' })

    products.splice(idx, 1)
    writeProducts(products)

    res.json({ ok: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

const PORT = process.env.PORT || 4000
app.listen(PORT, () => console.log(`ProcureNP server listening on port ${PORT}`))
