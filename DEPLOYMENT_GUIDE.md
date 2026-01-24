# ProcureNP - PERN Stack Deployment Guide

## Architecture Overview

### PERN Stack Components
- **PostgreSQL** - Database (Free: Supabase, Railway, Render)
- **Express.js** - Backend API (Free: Render, Railway, Fly.io, Heroku-free alternatives)
- **React** - Frontend (Free: Vercel, Netlify, GitHub Pages)
- **Node.js** - Runtime (Included with backend hosting)

### Supporting Services
- **Cloudinary** - Image Storage (Free tier: 25GB/month)
- **Prisma ORM** - Database ORM (Free & open-source)

---

## FREE DEPLOYMENT OPTIONS (No Credit Card Required for Most)

### Option 1: RECOMMENDED - Supabase + Railway + Vercel
**Best for: Free tier with good performance**

1. **Database: Supabase (PostgreSQL)**
   - Free tier: 500MB storage, 2GB bandwidth/month
   - URL: https://supabase.com
   - No credit card needed
   - Includes authentication, real-time DB

2. **Backend: Railway**
   - Free tier: $5/month credit (enough for small projects)
   - URL: https://railway.app
   - No credit card needed initially
   - Easy deployment from GitHub

3. **Frontend: Vercel**
   - Free tier: Unlimited deployments, auto-scaling
   - URL: https://vercel.com
   - No credit card needed
   - Direct GitHub integration

### Option 2: Render + Supabase + Vercel
**Alternative with similar capabilities**

1. **Database: Supabase** (same as above)
2. **Backend: Render**
   - Free tier: 750 hours/month
   - Auto-sleep after 15 min inactivity (trade-off)
   - URL: https://render.com
3. **Frontend: Vercel** (same as above)

### Option 3: AWS Free Tier (Requires Credit Card)
**Only if you need long-term free tier**

- RDS PostgreSQL: Free tier 12 months
- EC2: Free tier 12 months
- But more complex to set up

### Option 4: Fly.io + Supabase + Vercel
**Best performance option**

1. **Database: Supabase**
2. **Backend: Fly.io**
   - Free tier: 3 shared-cpu-1x 256MB VMs
   - Simple deployment
   - URL: https://fly.io
3. **Frontend: Vercel**

---

## RECOMMENDED SETUP FOR YOUR PROJECT

**Use: Supabase + Railway + Vercel**

### Benefits:
- ✅ Zero initial cost (no credit card)
- ✅ PostgreSQL fully managed
- ✅ Prisma works perfectly
- ✅ Easy GitHub integration
- ✅ Cloudinary free tier: 25GB/month images
- ✅ Total: ~$0/month if under free tiers

### Costs when scaling:
- Supabase: $25/month (1GB, 50GB bandwidth) → Reasonable
- Railway: ~$5-15/month depending on usage
- Vercel: Free unless using advanced features
- **Total: ~$30-40/month at scale (still cheap)**

---

## STEP-BY-STEP SETUP

### Phase 1: Local Development Setup

1. **Install Prisma**
   ```bash
   npm install @prisma/client
   npm install -D prisma
   ```

2. **Initialize Prisma**
   ```bash
   npx prisma init
   ```

3. **Create `.env.local`**
   ```
   DATABASE_URL="postgresql://user:password@host:5432/procurenepal"
   CLOUDINARY_CLOUD_NAME="your_cloud_name"
   CLOUDINARY_API_KEY="your_api_key"
   CLOUDINARY_API_SECRET="your_api_secret"
   JWT_SECRET="your_jwt_secret_key"
   NODE_ENV="development"
   ```

### Phase 2: Database Setup (Supabase)

1. Go to https://supabase.com
2. Sign up (free, no credit card)
3. Create new project
4. Get Connection String from Project Settings
5. Update `.env.local` with Supabase DATABASE_URL

### Phase 3: Cloudinary Setup

1. Go to https://cloudinary.com
2. Sign up (free, no credit card)
3. Get Cloud Name, API Key, API Secret
4. Add to `.env.local`

### Phase 4: Backend Modifications (Express + Prisma + Cloudinary)

See BACKEND_SETUP.md for detailed code changes

### Phase 5: Deployment

#### Deploy Backend (Railway)
1. Push code to GitHub
2. Connect GitHub repo to Railway
3. Add environment variables
4. Auto-deploy on push

#### Deploy Frontend (Vercel)
1. Connect GitHub repo to Vercel
2. Set environment variables (API URL)
3. Auto-deploy on push

---

## PRISMA SCHEMA EXAMPLE

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
  password  String
  role      String  // 'buyer', 'supplier', 'admin'
  createdAt DateTime @default(now())
  products  Product[]
}

model Product {
  id        Int     @id @default(autoincrement())
  name      String
  description String?
  category  String
  price     Float
  quantity  Int
  image     String  // Cloudinary URL
  supplierId Int
  supplier  User    @relation(fields: [supplierId], references: [id])
  createdAt DateTime @default(now())
}

model Supplier {
  id        Int     @id @default(autoincrement())
  userId    Int     @unique
  companyName String
  pan       String?
  vat       String?
  turnover  String?
  established DateTime?
  status    String  // 'pending', 'approved', 'rejected'
  createdAt DateTime @default(now())
}
```

---

## CLOUDINARY IMAGE UPLOAD (Backend)

```javascript
// server/utils/cloudinary.js
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadImage(file) {
  try {
    const result = await cloudinary.uploader.upload_stream(
      { folder: 'procurenepal' },
      (error, result) => {
        if (error) throw error;
        return result;
      }
    );
    return result;
  } catch (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }
}

module.exports = { uploadImage };
```

---

## COST BREAKDOWN (At Scale)

| Service | Free Tier | Paid Tier | Notes |
|---------|-----------|-----------|-------|
| Supabase | 500MB | $25/mo | PostgreSQL |
| Railway | $5/mo | Overage | Backend |
| Vercel | Free | Custom | Frontend |
| Cloudinary | 25GB images | $99/mo | Image storage |
| Domain | Free (.vercel.app) | $10-15/yr | Custom domain |
| **TOTAL** | **$5/mo** | **$150+/yr** | At scale |

---

## IMPORTANT NOTES

1. **Free tier limitations:**
   - Supabase: Free tier sleeps after inactivity (acceptable)
   - Railway: $5/month is their free allocation, then pay-per-use
   - Render: Free tier has 15-min auto-sleep trade-off

2. **When to upgrade:**
   - Supabase: >500MB database
   - Railway: >750 monthly computing hours
   - Vercel: Only if needing advanced features

3. **Alternative completely FREE option:**
   - Use **Render** (free tier) + **Supabase** (free) + **Vercel** (free)
   - Trade-off: Slower cold starts due to auto-sleep

---

## MIGRATION FROM CURRENT SETUP

Your current setup uses:
- ❌ File uploads to `/uploads` folder
- ❌ JSON files for data (`data/products.json`)
- ❌ No real database

To migrate:
1. Create PostgreSQL database (Supabase)
2. Define Prisma schema
3. Migrate JSON data to database
4. Replace all file uploads with Cloudinary
5. Update API endpoints to use Prisma

---

## NEXT STEPS

1. Start with local Prisma setup
2. Create Supabase account (free)
3. Update backend with Prisma + Cloudinary
4. Test locally
5. Deploy to Railway + Vercel
6. Monitor free tier usage

See BACKEND_SETUP.md for code implementation.
