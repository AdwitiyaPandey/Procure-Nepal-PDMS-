# Backend Setup - PERN Stack with Prisma & Cloudinary

## Installation

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install express cors dotenv @prisma/client cloudinary multer bcryptjs jsonwebtoken

# Development dependencies
npm install -D prisma
```

## Environment Variables (.env)

```
# Database (from Supabase or Railway)
DATABASE_URL="postgresql://user:password@host:5432/procurenepal"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"

# JWT
JWT_SECRET="your_super_secret_jwt_key_here_change_this"

# Server
PORT=4000
NODE_ENV="development"
CORS_ORIGIN="http://localhost:5173"
```

## Prisma Schema

```prisma
// prisma/schema.prisma

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        Int     @id @default(autoincrement())
  email     String  @unique
  fullname  String
  phone     String?
  password  String  // hashed
  role      String  @default("buyer") // 'buyer', 'supplier', 'admin'
  profilePhoto String? // Cloudinary URL
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  products  Product[]
  supplier  Supplier?
  quotes    QuoteRequest[]
}

model Supplier {
  id        Int     @id @default(autoincrement())
  userId    Int     @unique
  user      User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  companyName String
  pan       String?
  vat       String?
  turnover  String?
  established DateTime?
  panVatDoc String? // Cloudinary URL
  status    String  @default("pending") // 'pending', 'approved', 'rejected'
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Product {
  id        Int     @id @default(autoincrement())
  name      String
  description String?
  category  String
  price     Float
  quantity  Int
  marginPercentage Float @default(20)
  image     String  // Cloudinary URL
  supplierId Int
  supplier  User    @relation(fields: [supplierId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  quotes    QuoteRequest[]
}

model Category {
  id        Int     @id @default(autoincrement())
  name      String  @unique
  createdAt DateTime @default(now())
}

model QuoteRequest {
  id        Int     @id @default(autoincrement())
  productId Int
  product   Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  buyerId   Int
  buyer     User    @relation(fields: [buyerId], references: [id], onDelete: Cascade)
  name      String
  email     String
  phone     String
  company   String?
  quantity  Int
  message   String?
  createdAt DateTime @default(now())
}
```

## Key Files to Create

### 1. server/config/cloudinary.js

```javascript
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = cloudinary;
```

### 2. server/middleware/auth.js

```javascript
const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
}

module.exports = { authenticateToken };
```

### 3. server/middleware/upload.js

```javascript
const multer = require('multer');

// Memory storage for direct upload to Cloudinary
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files allowed'));
    }
  }
});

module.exports = upload;
```

### 4. server/utils/cloudinaryUpload.js

```javascript
const cloudinary = require('../config/cloudinary');

async function uploadToCloudinary(file, folder = 'procurenepal') {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject(new Error('No file provided'));
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'auto',
        eager: [
          { width: 400, height: 400, crop: 'fill', quality: 'auto' }
        ]
      },
      (error, result) => {
        if (error) {
          reject(new Error(`Cloudinary upload failed: ${error.message}`));
        } else {
          resolve(result);
        }
      }
    );

    uploadStream.end(file.buffer);
  });
}

module.exports = { uploadToCloudinary };
```

### 5. server/routes/auth.js

```javascript
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const upload = require('../middleware/upload');
const { uploadToCloudinary } = require('../utils/cloudinaryUpload');

const router = express.Router();
const prisma = new PrismaClient();

// Register - Buyer or Supplier
router.post('/register', upload.single('profilePhoto'), async (req, res) => {
  try {
    const { fullname, email, phone, password, confirmPassword, role = 'buyer' } = req.body;

    // Validation
    if (!fullname || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Upload profile photo if provided
    let profilePhotoUrl = null;
    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file, 'procurenepal/profiles');
      profilePhotoUrl = uploadResult.secure_url;
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        fullname,
        email,
        phone,
        password: hashedPassword,
        role,
        profilePhoto: profilePhotoUrl
      }
    });

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        fullname: user.fullname,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        fullname: user.fullname,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
```

### 6. server/routes/products.js

```javascript
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const upload = require('../middleware/upload');
const { uploadToCloudinary } = require('../utils/cloudinaryUpload');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Get all products (with search, filter, pagination)
router.get('/', async (req, res) => {
  try {
    const { q, category, minPrice, maxPrice, sort = 'newest', page = 1, limit = 12 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (q) {
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } }
      ];
    }
    if (category) {
      where.category = category;
    }
    if (minPrice) {
      where.price = { gte: parseFloat(minPrice) };
    }
    if (maxPrice) {
      where.price = where.price ? { ...where.price, lte: parseFloat(maxPrice) } : { lte: parseFloat(maxPrice) };
    }

    const orderBy = {};
    if (sort === 'newest') {
      orderBy.createdAt = 'desc';
    } else if (sort === 'price_low') {
      orderBy.price = 'asc';
    } else if (sort === 'price_high') {
      orderBy.price = 'desc';
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: parseInt(limit),
        include: {
          supplier: {
            select: { id: true, fullname: true }
          }
        }
      }),
      prisma.product.count({ where })
    ]);

    res.json({
      products,
      total,
      pages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        supplier: {
          select: { id: true, fullname: true, companyName: true }
        }
      }
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create product (authenticated suppliers only)
router.post('/', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    if (req.user.role !== 'supplier') {
      return res.status(403).json({ error: 'Only suppliers can create products' });
    }

    const { name, description, category, price, quantity, marginPercentage } = req.body;

    if (!name || !category || !price) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Upload image to Cloudinary
    let imageUrl = null;
    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file, 'procurenepal/products');
      imageUrl = uploadResult.secure_url;
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        category,
        price: parseFloat(price),
        quantity: parseInt(quantity) || 0,
        marginPercentage: parseFloat(marginPercentage) || 20,
        image: imageUrl,
        supplierId: req.user.id
      }
    });

    res.status(201).json({ message: 'Product created', product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update product (owner only)
router.put('/:id', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(req.params.id) }
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (product.supplierId !== req.user.id) {
      return res.status(403).json({ error: 'You can only edit your own products' });
    }

    const { name, description, category, price, quantity, marginPercentage } = req.body;

    let imageUrl = product.image;
    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file, 'procurenepal/products');
      imageUrl = uploadResult.secure_url;
    }

    const updated = await prisma.product.update({
      where: { id: parseInt(req.params.id) },
      data: {
        name: name || product.name,
        description: description || product.description,
        category: category || product.category,
        price: price ? parseFloat(price) : product.price,
        quantity: quantity ? parseInt(quantity) : product.quantity,
        marginPercentage: marginPercentage ? parseFloat(marginPercentage) : product.marginPercentage,
        image: imageUrl
      }
    });

    res.json({ message: 'Product updated', product: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete product (owner only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(req.params.id) }
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (product.supplierId !== req.user.id) {
      return res.status(403).json({ error: 'You can only delete your own products' });
    }

    await prisma.product.delete({
      where: { id: parseInt(req.params.id) }
    });

    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
```

### 7. server/index.js (Updated)

```javascript
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

## Prisma Commands

```bash
# Create initial migration
npx prisma migrate dev --name init

# Apply migrations
npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate

# Open Prisma Studio (visual DB editor)
npx prisma studio

# Check migration status
npx prisma migrate status
```

## Frontend Updates Needed

Your React components need to update to:
1. Use JWT tokens from login/register
2. Store token in localStorage
3. Send token in Authorization header
4. Update API endpoints

See FRONTEND_UPDATES.md for details.

## Migration from Current System

```bash
# 1. Create Supabase PostgreSQL
# 2. Set DATABASE_URL in .env
# 3. Create prisma/schema.prisma (above)
# 4. Run initial migration
npx prisma migrate dev --name init

# 5. Seed database (optional)
npx prisma db seed

# 6. Test locally before deploying
npm start
```

---

**Next: Update frontend components to use JWT authentication and new API structure.**
