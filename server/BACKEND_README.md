# ProcureNP Backend - Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Database Setup

#### Option A: Using Supabase (Recommended for Production)
1. Go to https://supabase.com and sign up
2. Create a new project
3. Get your PostgreSQL connection string from Settings → Database
4. Update `.env`:
   ```
   DATABASE_URL="postgresql://postgres:password@host:5432/procurenepal"
   ```

#### Option B: Local PostgreSQL
1. Install PostgreSQL locally
2. Create a database:
   ```sql
   CREATE DATABASE procurenepal;
   ```
3. Update `.env`:
   ```
   DATABASE_URL="postgresql://postgres:password@localhost:5432/procurenepal"
   ```

### 3. Prisma Setup
```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed categories (optional)
npm run seed

# View database in Prisma Studio
npx prisma studio
```

### 4. Environment Configuration
Copy variables from `.env.example` to `.env` and update:
- `DATABASE_URL` - Your PostgreSQL connection string
- `JWT_SECRET` - A strong random secret key
- `CLOUDINARY_*` - Get from https://cloudinary.com
- `EMAIL_USER` & `EMAIL_PASS` - Gmail credentials for password reset
- `CORS_ORIGIN` - Frontend URL (http://localhost:5173)

### 5. Start Server
```bash
npm run dev    # Development with nodemon
npm start      # Production
```

Server runs on `http://localhost:4000`

## API Endpoints

### Authentication
- `POST /api/auth/register/buyer` - Register as buyer
- `POST /api/auth/register/seller` - Register as seller
- `POST /api/auth/login` - Login (both buyer/seller)
- `GET /api/auth/me` - Get current user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `POST /api/auth/logout` - Logout

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product (sellers only)
- `PUT /api/products/:id` - Update product (sellers only)
- `DELETE /api/products/:id` - Delete product (sellers only)

### Categories
- `GET /api/categories` - Get all categories

### Quote Requests
- `POST /api/quote-requests` - Create quote request
- `GET /api/quote-requests/user/my-requests` - Get user's quote requests
- `GET /api/quote-requests/supplier/received` - Get supplier's received requests
- `PATCH /api/quote-requests/:id/status` - Update quote status

### Admin
- `GET /api/admin/suppliers` - Get all suppliers
- `GET /api/admin/suppliers/:id` - Get supplier details
- `PATCH /api/admin/suppliers/:id/approve` - Approve supplier
- `PATCH /api/admin/suppliers/:id/reject` - Reject supplier
- `GET /api/admin/stats/overview` - Get dashboard stats
- `GET /api/admin/quote-requests` - Get all quote requests

## Database Schema

### Users
- Buyers and sellers both stored in User table
- `role` field determines type ('buyer' or 'seller')

### Suppliers
- One-to-one relationship with User (for sellers)
- Status: pending, approved, rejected

### Products
- Created by approved sellers
- Includes margin percentage for pricing

### Categories
- Pre-seeded with default categories

### QuoteRequests
- Buyers can request quotes for products
- Sellers can view and respond to requests

## Development

### Create New Migration
```bash
npx prisma migrate dev --name description_of_change
```

### Reset Database (Development Only)
```bash
npx prisma migrate reset
```

### View Database
```bash
npx prisma studio
```

## Troubleshooting

### Port Already in Use
```bash
# Windows - Find and kill process on port 4000
netstat -ano | findstr :4000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :4000
kill -9 <PID>
```

### Database Connection Issues
- Check DATABASE_URL is correct
- Ensure database server is running
- Verify network/firewall settings

### Email Not Sending
- Enable 2FA on Gmail
- Create App Password: https://myaccount.google.com/apppasswords
- Use App Password in `.env` EMAIL_PASS

## Production Deployment

### Requirements
- Node.js 16+
- PostgreSQL database (Supabase, AWS RDS, etc.)
- Cloudinary account
- Email service credentials

### Steps
1. Set all environment variables
2. Run migrations: `npx prisma migrate deploy`
3. Build and start: `npm start`
4. Use PM2 or similar for process management

## File Structure
```
server/
├── config/
│   └── cloudinary.js           # Cloudinary configuration
├── middleware/
│   ├── auth.js                 # JWT authentication
│   └── upload.js               # Multer upload setup
├── routes/
│   ├── auth.js                 # Authentication endpoints
│   ├── products.js             # Product CRUD
│   ├── categories.js           # Category endpoints
│   ├── quoteRequests.js        # Quote management
│   └── admin.js                # Admin endpoints
├── utils/
│   ├── cloudinaryUpload.js     # Upload utility
│   ├── emailService.js         # Email utilities
│   └── validationSchemas.js    # Zod validation schemas
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── seed.js                 # Database seed
├── .env                        # Environment variables
├── index.js                    # Express app entry
└── package.json
```
