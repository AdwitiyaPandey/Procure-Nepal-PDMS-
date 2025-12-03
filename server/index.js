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

fs.ensureDirSync(DATA_DIR)
fs.ensureDirSync(UPLOADS_DIR)
if (!fs.existsSync(SUPPLIERS_FILE)) fs.writeJsonSync(SUPPLIERS_FILE, [])

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

function readSuppliers() {
  return fs.readJsonSync(SUPPLIERS_FILE)
}
function writeSuppliers(list) {
  fs.writeJsonSync(SUPPLIERS_FILE, list, { spaces: 2 })
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

const PORT = process.env.PORT || 4000
app.listen(PORT, () => console.log(`PDMS server listening on port ${PORT}`))
