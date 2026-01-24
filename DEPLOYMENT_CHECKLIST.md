# Free Deployment Checklist & Instructions

## PRE-DEPLOYMENT CHECKLIST

### Backend Setup
- [ ] Initialize Prisma: `npx prisma init`
- [ ] Create Prisma schema
- [ ] Create Supabase account and PostgreSQL database
- [ ] Set DATABASE_URL in .env
- [ ] Install dependencies: `npm install @prisma/client cloudinary multer bcryptjs jsonwebtoken`
- [ ] Run migrations: `npx prisma migrate dev --name init`
- [ ] Test backend locally: `npm start` → http://localhost:4000/api/health
- [ ] Create Cloudinary account and get API keys
- [ ] Set Cloudinary env variables
- [ ] Test image uploads locally

### Frontend Setup
- [ ] Install axios: `npm install axios`
- [ ] Update AuthContext.jsx with JWT logic
- [ ] Update Login.jsx and Register.jsx
- [ ] Update API endpoints to use new backend
- [ ] Test locally: `npm run dev` → http://localhost:5173
- [ ] Test login/registration flow
- [ ] Test product creation (if supplier account)

### Repository Setup
- [ ] Initialize Git (if not already)
- [ ] Create .gitignore with .env files
- [ ] Commit all changes
- [ ] Push to GitHub (create repo if needed)

---

## STEP-BY-STEP DEPLOYMENT

### Step 1: Database (Supabase - 5 minutes)

1. Go to https://supabase.com
2. Click "Sign up"
3. Use GitHub account to sign up (easiest)
4. Create new project:
   - Name: `procurenepal`
   - Password: Create strong password
   - Region: Closest to Nepal (Singapore: ap-southeast-1)
5. Click "Settings" → "Database"
6. Copy connection string (labeled as "URI" or "Connection string")
7. It looks like: `postgresql://postgres:PASSWORD@db.xxxxx.supabase.co:5432/postgres`
8. Add to your `.env.local`: `DATABASE_URL="<paste_here>"`
9. Run: `npx prisma migrate dev --name init`
10. Check Supabase dashboard to verify tables are created

### Step 2: Cloudinary (Image Upload - 5 minutes)

1. Go to https://cloudinary.com
2. Click "Sign Up Free"
3. Complete email verification
4. Go to Dashboard
5. Note your "Cloud Name" (top of page)
6. Click "Settings" → "API Keys"
7. Copy: Cloud Name, API Key, API Secret
8. Add to `.env.local`:
   ```
   CLOUDINARY_CLOUD_NAME="your_cloud_name"
   CLOUDINARY_API_KEY="your_api_key"
   CLOUDINARY_API_SECRET="your_api_secret"
   ```
9. Test image upload in backend

### Step 3: Backend Deployment (Railway - 10 minutes)

#### Create Railway Account
1. Go to https://railway.app
2. Click "Start Project"
3. Sign up with GitHub (or email)
4. Authorize Railway to access your repositories

#### Deploy from GitHub
1. Click "Create New" → "Empty Project"
2. Click "Add Service" → "GitHub Repo"
3. Select your procurenepal repository
4. Wait for automatic detection
5. Click "Deploy"

#### Configure Environment Variables
1. In Railway dashboard, click on your app
2. Click "Variables" tab
3. Add:
   ```
   DATABASE_URL=postgresql://...
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   JWT_SECRET=your_super_secret_key
   PORT=4000
   CORS_ORIGIN=https://your-frontend-url
   NODE_ENV=production
   ```
4. Click "Deploy"

#### Get Backend URL
1. In Railway dashboard, click "Settings"
2. Copy the generated domain (e.g., `procurenepal.railway.app`)
3. This is your `BACKEND_URL`

#### Update package.json
Make sure your server's package.json has:
```json
{
  "name": "procure-server",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  },
  "engines": {
    "node": "18.x"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.0.3",
    "@prisma/client": "latest",
    "cloudinary": "latest",
    "multer": "^1.4.5-lts.1",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.0"
  }
}
```

### Step 4: Frontend Deployment (Vercel - 10 minutes)

#### Create Vercel Account
1. Go to https://vercel.com
2. Sign up with GitHub
3. Authorize Vercel

#### Deploy Frontend
1. Click "Add New Project"
2. Select your GitHub repository
3. Click "Import"
4. Configure:
   - Framework Preset: Vite
   - Root Directory: (leave as is, or set to `pdms` if monorepo)
5. Click "Environment Variables"
6. Add:
   ```
   VITE_API_BASE=https://procurenepal.railway.app
   ```
7. Click "Deploy"
8. Wait 2-3 minutes for build
9. You'll get a URL like `https://procurenepal.vercel.app`

#### Test Deployment
1. Visit your Vercel URL
2. Test login/registration
3. Check browser console for errors
4. Check Network tab to verify API calls work

### Step 5: Connect Frontend to Backend

In your frontend `.env`:
```
VITE_API_BASE=https://procurenepal.railway.app
```

Update all API calls to use this:
```javascript
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000'
```

### Step 6: Test Production

1. **Test Login:**
   - Sign up new account
   - Login with that account
   - Verify token is stored in localStorage

2. **Test Image Upload (Supplier):**
   - As supplier, create product
   - Upload image
   - Verify image appears on product card
   - Check Cloudinary dashboard to see uploaded file

3. **Test Search:**
   - Search for products
   - Filter by category
   - Verify API call works

4. **Test Quote Request:**
   - Click request quote on product
   - Fill form and submit
   - Verify backend received it

---

## COST ESTIMATION (After Free Tiers)

| Service | Free Tier | When You Pay | Cost/month |
|---------|-----------|--------------|-----------|
| Supabase | 500MB DB | >500MB | $25 |
| Railway | $5 credit | >$5 usage | ~$10-20 |
| Vercel | Unlimited | Pro features | $20 |
| Cloudinary | 25GB | >25GB images | $99 |
| Domain | .vercel.app | Custom domain | $0-15 |
| **TOTAL** | **$5-10** | **At scale** | **$150+/year** |

---

## TROUBLESHOOTING

### Backend Won't Deploy (Railway)
1. Check build logs: Railway Dashboard → Deployment → Logs
2. Ensure `npm start` command works locally
3. Verify all environment variables are set
4. Check DATABASE_URL is correct

### Frontend Can't Connect to Backend
1. Check CORS is enabled in backend: `cors({ origin: process.env.CORS_ORIGIN })`
2. Update CORS_ORIGIN environment variable to your Vercel URL
3. Check browser Network tab for API call status
4. Verify API_BASE URL in frontend is correct

### Cloudinary Upload Fails
1. Verify API keys are correct (copy/paste carefully)
2. Check image file size <10MB
3. Check image format (JPG, PNG, GIF, WebP)
4. Verify file is being sent as multipart/form-data

### Database Connection Error
1. Verify DATABASE_URL is correct
2. Check Supabase server is running
3. Run locally first to verify schema
4. Check firewall/IP whitelist (Supabase allows all by default)

### Login Returns 401
1. Verify JWT_SECRET is set consistently
2. Check password is being hashed with bcrypt
3. Verify user exists in database
4. Check token format: `Bearer <token>`

---

## MONITORING & LOGS

### View Backend Logs (Railway)
- Dashboard → Your Project → Deployments → Click deployment → Logs

### View Frontend Logs (Vercel)
- Dashboard → Your Project → Functions or Analytics

### Check Database (Supabase)
- Go to Supabase Dashboard
- Click "SQL Editor"
- Run queries to check data: `SELECT * FROM "User";`

---

## CUSTOM DOMAIN (Optional, Free)

### Using Vercel (Recommended - Free with DNS)
1. Vercel Dashboard → Settings → Domains
2. Add custom domain (if you have one)
3. Update DNS records at your domain registrar
4. Takes 24-48 hours to propagate

### Using Railway (Paid add-on)
- Railway charges ~$5/month for custom domain
- Not recommended unless necessary

---

## BACKUP & DATABASE MANAGEMENT

### Backup Supabase Database
1. Supabase Dashboard → Database → Backups
2. Automatic backups stored for 7 days (free tier)
3. Download backup for safety
4. Upgrade plan for longer retention

### Download Database Dump
```bash
# From local machine
pg_dump "postgresql://user:pass@host:5432/db" > backup.sql

# Or use Supabase CLI
supabase db pull
```

---

## NEXT STEPS AFTER DEPLOYMENT

1. **Monitor Usage:**
   - Check free tier limits weekly
   - Upgrade plans if approaching limits

2. **Add Features:**
   - Admin dashboard for approving suppliers
   - Email notifications
   - Quote/request management

3. **Optimize:**
   - Add caching (Redis)
   - Optimize database queries
   - Image optimization in Cloudinary

4. **Security:**
   - Change JWT_SECRET to strong value
   - Set up rate limiting
   - Add HTTPS (included with all services)
   - Regular backups

5. **Marketing:**
   - SEO optimization
   - Social media integration
   - Email marketing setup

---

## SUPPORT DOCUMENTATION LINKS

- **Supabase Docs:** https://supabase.com/docs
- **Railway Docs:** https://docs.railway.app
- **Vercel Docs:** https://vercel.com/docs
- **Prisma Docs:** https://www.prisma.io/docs/
- **Cloudinary Docs:** https://cloudinary.com/documentation

---

**Ready to deploy? Start with Step 1 (Supabase)!**
