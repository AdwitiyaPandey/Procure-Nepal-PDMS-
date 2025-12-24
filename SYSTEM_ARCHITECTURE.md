# 🏗️ System Architecture & Flow Diagram

## Overall System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        PROCURE NEPAL B2B                        │
│                       MARKETPLACE SYSTEM                        │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                       FRONTEND (React)                          │
│                    http://localhost:5173                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Landing Page               Auth Pages          Dashboards      │
│  ├─ Navbar                 ├─ /get-started     ├─ Supplier      │
│  ├─ Search                 ├─ /login           │  Dashboard     │
│  ├─ Featured Products      ├─ /register        │  ├─ Products   │
│  │  └─ API: GET /api/      └─ /login           │  ├─ Add        │
│  │     products                                │  ├─ Edit       │
│  ├─ Categories            Signup Forms        │  └─ Delete     │
│  └─ Search Results        ├─ Buyer form       │                │
│                           │  (name, email,    │ Buyer Dashboard│
│ Components               │   phone, pwd)     ├─ Landing page  │
│ ├─ Landingbanner         │                   ├─ View products │
│ ├─ SupplierDashboard     ├─ Supplier form    │ ├─ Search      │
│ ├─ Categories            │  (company,        │ └─ Request     │
│ ├─ Login                 │   PAN/VAT, docs)  │    quotes      │
│ └─ Register              │                   │                │
│                          └─ File uploads:    │ Admin          │
│ State Management:           ├─ Citizenship   ├─ Dashboard    │
│ ├─ React State             ├─ PAN/VAT docs   │ ├─ Approve    │
│ ├─ Firebase Auth           ├─ Profile photo  │ │  suppliers  │
│ ├─ AuthContext             └─ Product images │ └─ View stats │
│ └─ Local Storage           (jpg/png/webp)    │                │
│                                              │                │
└─────────────────────────────────────────────────────────────────┘
                              ↓ API Calls
┌─────────────────────────────────────────────────────────────────┐
│                     BACKEND (Node.js/Express)                   │
│                     http://localhost:4000                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ API Routes:                                                    │
│                                                                 │
│ POST   /api/products          → Create product                 │
│ GET    /api/products          → Get all products               │
│ GET    /api/products/supplier/:uid  → Get supplier products    │
│ PUT    /api/products/:id      → Update product                 │
│ DELETE /api/products/:id      → Delete product                 │
│                                                                 │
│ POST   /api/users             → Save user profile              │
│ GET    /api/users/:uid        → Get user profile               │
│                                                                 │
│ Middleware:                                                    │
│ ├─ CORS enabled                                               │
│ ├─ JSON parser                                                │
│ ├─ Multer file upload                                         │
│ └─ Static file serving (/uploads)                             │
│                                                                 │
│ Data Functions:                                               │
│ ├─ readProducts() / writeProducts()                           │
│ ├─ readUsers() / writeUsers()                                 │
│ └─ readSuppliers() / writeSuppliers()                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              ↓ File I/O
┌─────────────────────────────────────────────────────────────────┐
│                    DATA STORAGE (Filesystem)                    │
│                    /server/data/ & /uploads/                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ products.json                                                  │
│ ├─ 20 sample products                                          │
│ ├─ Product: {id, uid, name, description, category,            │
│ │           price, quantity, image, timestamps}               │
│ └─ Updated when: add/edit/delete product                       │
│                                                                 │
│ users.json                                                     │
│ ├─ User profiles (buyers & suppliers)                          │
│ ├─ User: {uid, role, fullname, email, company, PAN/VAT,       │
│ │         turnover, established, files{}, timestamps}         │
│ └─ Updated when: user signup                                   │
│                                                                 │
│ suppliers.json                                                 │
│ ├─ Supplier verification data                                  │
│ ├─ Status: pending/approved/rejected                           │
│ └─ Admin review tracking                                       │
│                                                                 │
│ uploads/ (directory)                                           │
│ ├─ Citizenship images                                          │
│ ├─ PAN/VAT documents                                           │
│ ├─ Profile photos                                              │
│ └─ Product images                                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                  EXTERNAL SERVICES (Firebase)                   │
│                  Authentication & User Management               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ Firebase Authentication                                        │
│ ├─ createUserWithEmailAndPassword()                            │
│ ├─ signInWithEmailAndPassword()                                │
│ ├─ signOut()                                                   │
│ └─ onAuthStateChanged()                                        │
│                                                                 │
│ Firebase User UID                                              │
│ └─ Linked to backend user profile                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## User Flow Diagrams

### Supplier Signup & Product Management Flow

```
START
  ↓
┌─────────────────┐
│ Visit /get-     │
│ started         │
└────────┬────────┘
         ↓
┌─────────────────────────────────────────────┐
│ Click "Supplier" Tab                        │
└────────┬────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────┐
│ Fill Supplier Form                          │
│ ├─ Company name, email, phone              │
│ ├─ PAN number, VAT number                  │
│ ├─ Turnover, year established              │
│ ├─ Upload citizenship image                │
│ ├─ Upload PAN/VAT documents                │
│ └─ Upload profile photo                    │
└────────┬────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────┐
│ Click "Sign Up as Supplier"                 │
└────────┬────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────┐
│ Firebase                                    │
│ └─ Create auth user + generate UID         │
└────────┬────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────┐
│ Backend                                     │
│ └─ POST /api/users                          │
│    └─ Save profile + store files            │
└────────┬────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────┐
│ Redirect to Landing Page                    │
└────────┬────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────┐
│ Navbar shows "My Dashboard"                 │
└────────┬────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────┐
│ Click "My Dashboard"                        │
└────────┬────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────┐
│ Supplier Dashboard Loads                    │
│ └─ GET /api/products/supplier/:uid          │
└────────┬────────────────────────────────────┘
         ↓
    ┌────────────────────────────────┐
    │ Dashboard Menu                 │
    ├────────────────────────────────┤
    │                                │
    ├─ [Add New Product] ──────────┐ │
    │                              ↓ │
    │  Product Form                │ │
    │  ├─ Name                     │ │
    │  ├─ Description              │ │
    │  ├─ Category (9 options)     │ │
    │  ├─ Price                    │ │
    │  ├─ Quantity                 │ │
    │  ├─ Image upload             │ │
    │  └─ Submit ──────┐           │ │
    │                  ↓           │ │
    │            POST /api/        │ │
    │            products          │ │
    │                  ↓           │ │
    │            Back to ──────────┘ │
    │            Dashboard           │
    │                                │
    ├─ Product Table                │
    │  ├─ Product Name              │
    │  ├─ Category                  │
    │  ├─ Price                     │
    │  ├─ Quantity                  │
    │  ├─ [Edit] ──────┐            │
    │  │               ↓            │
    │  │         Edit Form          │
    │  │         PUT /api/          │
    │  │         products/:id       │
    │  │               ↓            │
    │  │         Back to Dashboard  │
    │  │                            │
    │  └─ [Delete] ──┐             │
    │                ↓             │
    │          DELETE request      │
    │                ↓             │
    │          Back to Dashboard   │
    │                              │
    └────────────────────────────────┘
         ↓
    Products displayed on landing page
    (visible to all buyers)
    ↓
END
```

### Buyer Landing Page & Product Discovery

```
START
  ↓
┌─────────────────┐
│ Visit / (home)  │
└────────┬────────┘
         ↓
┌────────────────────────────────────┐
│ Landing Page Loads                 │
└────────┬─────────────────────────┬─┘
         │                         │
         ↓                         ↓
    [NOT LOGGED IN]           [LOGGED IN]
         │                         │
         ↓                         ↓
    See Sign Up               See Profile
    & Login buttons           & Logout button
         │                         │
         └──────────┬──────────────┘
                    ↓
    ┌────────────────────────────────────┐
    │ Featured Products Section          │
    ├────────────────────────────────────┤
    │                                    │
    │ GET /api/products                  │
    │         ↓                          │
    │ Display First 3 Products           │
    │                                    │
    │ ┌──────────────────────────────┐  │
    │ │ Product Card #1              │  │
    │ ├──────────────────────────────┤  │
    │ │ [Image]                      │  │
    │ │ Name                         │  │
    │ │ Category                     │  │
    │ │ Description                  │  │
    │ │ Price | Stock                │  │
    │ │ [Request Quote] [Contact]    │  │
    │ └──────────────────────────────┘  │
    │                                    │
    │ ┌──────────────────────────────┐  │
    │ │ Product Card #2              │  │
    │ ├──────────────────────────────┤  │
    │ │ [Image]                      │  │
    │ │ ... (same as above)          │  │
    │ └──────────────────────────────┘  │
    │                                    │
    │ ┌──────────────────────────────┐  │
    │ │ Product Card #3              │  │
    │ ├──────────────────────────────┤  │
    │ │ [Image]                      │  │
    │ │ ... (same as above)          │  │
    │ └──────────────────────────────┘  │
    │                                    │
    └────────┬─────────────────────────┬─┘
             │                         │
             ↓                         ↓
         [Search]                [Browse by
          Products              Category]
             │                         │
             └──────────┬──────────────┘
                        ↓
         Products Update Automatically
         (when supplier adds/edits/deletes)
                        ↓
END
```

---

## Data Flow Diagrams

### Product Creation Flow

```
Frontend (SupplierDashboard)
  ↓
User fills form:
  - name, description, category
  - price, quantity, image
  ↓
FormData() with file
  ↓
POST /api/products
  ↓
Backend (server/index.js)
  ↓
Multer middleware
  ├─ Save image to /uploads/
  └─ Generate unique filename
  ↓
Extract fields from request:
  - uid (from Firebase user)
  - name, description, category
  - price, quantity
  - image path from Multer
  ↓
Create product object:
  {
    id: UUID,
    uid: supplierUID,
    name, description, category,
    price, quantity,
    image: /uploads/filename.jpg,
    createdAt, updatedAt
  }
  ↓
Read products.json
  ↓
Add new product to array
  ↓
Write back to products.json
  ↓
Return response to frontend
  ↓
Frontend updates UI
  ↓
Product visible in dashboard table
  ↓
Product appears on landing page
```

### Product Retrieval Flow (Landing Page)

```
Frontend (Landingbanner component)
  ↓
useEffect on mount
  ↓
fetch('http://localhost:4000/api/products')
  ↓
Backend routes request to GET /api/products
  ↓
Read products.json
  ↓
Return entire products array (20 items)
  ↓
Frontend receives response
  ↓
setProducts(data.slice(0, 3))  // First 3 only
  ↓
Map over products array
  ↓
Render 3 product cards with:
  - Image, name, category
  - Description, price, stock
  - "Request Quote" & "Contact Seller" buttons
  ↓
Page displays featured products
```

### File Upload Flow

```
Frontend (GetStarted.jsx - Supplier form)
  ↓
User selects files:
  - Citizenship image
  - PAN/VAT document
  - Profile photo
  ↓
onClick Submit
  ↓
Create FormData()
  ├─ Append uid
  ├─ Append company data (name, PAN, VAT, etc.)
  ├─ Append citizenship (file)
  ├─ Append panVatDoc (file)
  └─ Append profilePhoto (file)
  ↓
POST /api/users with multipart/form-data
  ↓
Backend receives request
  ↓
Multer middleware processes files
  ├─ Save citizenship to /uploads/
  ├─ Save panVatDoc to /uploads/
  └─ Save profilePhoto to /uploads/
  ↓
Multer returns file objects with:
  - fieldname (which field)
  - path (full path on disk)
  - filename (just the name)
  ↓
Express route handler
  ├─ Extract file paths from Multer
  ├─ Create user object with file paths
  └─ Store paths as strings in JSON
  ↓
Save user profile to users.json
  ├─ uid: Firebase UID
  ├─ role: "supplier"
  ├─ company data
  └─ files: {
      citizenship: "/uploads/uuid-123.jpg",
      panVatDoc: "/uploads/uuid-456.jpg",
      profilePhoto: "/uploads/uuid-789.jpg"
    }
  ↓
Files accessible via:
  - http://localhost:4000/uploads/uuid-123.jpg
  - http://localhost:4000/uploads/uuid-456.jpg
  - etc.
```

---

## Authentication Flow

```
User Account Lifecycle:

1. SIGNUP
   ├─ Frontend: User fills form
   ├─ Firebase: createUserWithEmailAndPassword()
   ├─ Firebase: Returns user with UID
   ├─ Backend: POST /api/users stores profile
   └─ Result: User created in both Firebase + backend

2. LOGIN
   ├─ Frontend: User enters email/password
   ├─ Firebase: signInWithEmailAndPassword()
   ├─ Firebase: onAuthStateChanged() triggers
   ├─ AuthContext: Sets user state
   └─ Result: User logged in, available in app

3. SESSION PERSISTENCE
   ├─ Page refresh
   ├─ Firebase: Checks local session
   ├─ onAuthStateChanged() restores user
   └─ Result: User stays logged in

4. LOGOUT
   ├─ User clicks Logout
   ├─ Firebase: signOut()
   ├─ AuthContext: Clears user state
   └─ Result: User redirected to login

5. PROTECTED ROUTES
   ├─ Component checks useAuth() hook
   ├─ If !user, redirect to /login
   └─ Result: Only authenticated users access
```

---

## Component Communication

```
App.jsx (Root)
├─ AuthProvider (Context wrapper)
│  ├─ Landing.jsx
│  │  ├─ Navbar (uses useAuth)
│  │  ├─ Landingbanner.jsx
│  │  │  └─ Fetches products from API
│  │  └─ Categories.jsx
│  │
│  ├─ GetStarted.jsx (Unified signup)
│  │  ├─ Buyer form
│  │  │  └─ POST /api/users (buyer)
│  │  └─ Supplier form
│  │     ├─ File uploads
│  │     └─ POST /api/users (supplier)
│  │
│  ├─ SupplierDashboard.jsx
│  │  ├─ GET /api/products/supplier/:uid
│  │  ├─ Add Product Form
│  │  │  └─ POST /api/products
│  │  ├─ Product Table
│  │  │  ├─ Edit: PUT /api/products/:id
│  │  │  └─ Delete: DELETE /api/products/:id
│  │  └─ Protected by useAuth
│  │
│  ├─ Login.jsx (uses useAuth + Firebase)
│  │
│  └─ AdminDashboard.jsx

API Connection Pattern:
  Component → fetch() → Backend
                ↓
         response.json()
                ↓
         setState(data)
                ↓
         Re-render
```

---

## Data Synchronization

```
Real-time Update Pattern:

Supplier adds product:
  1. Frontend: submitForm()
  2. API: POST /api/products
  3. Backend: Save to products.json
  4. Frontend: Update local state
  5. Frontend: Re-render table
  ↓
Buyer visits landing page:
  6. Frontend: GET /api/products
  7. Backend: Read products.json
  8. Backend: Return all 20 products
  9. Frontend: Display first 3
  10. Frontend: Show new product
  ↓
Result: New product visible in real-time

Key Points:
- No database needed (JSON files)
- File I/O is synchronous
- Changes immediate
- All users see same data
- Scales to ~1000 products
```

---

## Summary

This architecture provides:
- ✅ Separation of concerns (frontend/backend)
- ✅ Real-time data synchronization
- ✅ File upload capability
- ✅ Protected user flows
- ✅ Role-based access (buyer/supplier)
- ✅ Scalable to thousands of products

**Total System:**
- Frontend: React + Tailwind
- Backend: Express + Multer
- Storage: JSON files + File system
- Auth: Firebase
- Real-time: API calls + State updates
