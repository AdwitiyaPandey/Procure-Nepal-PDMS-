# Quick Start Guide - Testing the B2B Marketplace

## ⚡ Prerequisites
- Node.js installed
- npm packages installed (`npm install` in both frontend and backend)
- Backend server running on port 4000
- Frontend dev server running on port 5173

---

## 🚀 Step 1: Start the Servers

### Terminal 1 - Start Backend
```bash
cd server
npm start
```

Expected output:
```
PDMS server listening on port 4000
```

### Terminal 2 - Start Frontend
```bash
npm run dev
```

Expected output:
```
Local:   http://localhost:5173/
```

---

## 🧪 Testing Flow

### TEST 1: Buyer Sign Up & Landing Page

**Step 1.1:** Navigate to http://localhost:5173/get-started

**Step 1.2:** Click the "Buyer" tab (should already be selected)

**Step 1.3:** Fill in the buyer form:
- Full Name: `John Buyer`
- Email: `buyer@example.com`
- Phone: `9841234567`
- Password: `password123`
- Confirm Password: `password123`
- Profile Photo: (optional - upload any jpg/png)

**Step 1.4:** Click "Sign Up as Buyer"

Expected:
- ✅ Account created successfully
- ✅ Auto-redirect to landing page
- ✅ You're logged in (see username in navbar)

**Step 1.5:** Check the landing page
- ✅ Should see "Featured Products" section
- ✅ Should see 3 product cards loaded from backend
- ✅ Products show: image, name, category, description, price, stock
- ✅ Each product has "Request Quote" and "Contact Seller" buttons

**Step 1.6:** Verify products are from backend
- Open browser DevTools (F12)
- Go to Network tab
- Refresh page
- Look for request to `http://localhost:4000/api/products`
- Should return array of 20 products

---

### TEST 2: Supplier Sign Up & Product Management

**Step 2.1:** Log out (click Logout in navbar)

**Step 2.2:** Navigate to http://localhost:5173/get-started

**Step 2.3:** Click the "Supplier" tab

**Step 2.4:** Fill in the supplier form:
- Full Name: `Ahmed Supplier`
- Email: `supplier@example.com`
- Company Name: `Ahmed Trading Co.`
- Phone: `9842345678`
- Password: `password123`
- Confirm Password: `password123`
- PAN Number: `123456789`
- VAT Number: `VAT987654`
- Annual Turnover: `5000000`
- Year Established: `2018`
- Citizenship Image: (upload any image file)
- PAN/VAT Document: (upload any image file)
- Profile Photo: (optional - upload any image)

**Step 2.5:** Click "Sign Up as Supplier"

Expected:
- ✅ Account created successfully
- ✅ Auto-redirect to landing page
- ✅ Navbar now shows "My Dashboard" link (between user profile and Logout)

**Step 2.6:** Click "My Dashboard" in navbar

Expected:
- ✅ Redirected to `/supplier-dashboard`
- ✅ Page shows "Product Management" heading
- ✅ Table shows existing products (initially might be empty or show demo products)
- ✅ "Add New Product" button visible

---

### TEST 3: Add Products as Supplier

**Step 3.1:** On Supplier Dashboard, click "Add New Product"

Expected:
- ✅ Form appears below the button

**Step 3.2:** Fill in product details:
- Product Name: `Premium Cotton Fabric`
- Description: `High quality 100% organic cotton fabric, perfect for clothing manufacturers`
- Category: `Textiles & Fabrics`
- Price: `8900`
- Quantity: `250`
- Product Image: (upload any image)

**Step 3.3:** Click "Add Product"

Expected:
- ✅ Form closes
- ✅ Product appears in the table below
- ✅ Table shows all columns: Product Name, Category, Price, Quantity, Actions

**Step 3.4:** Add 2-3 more products with different categories:

Product 2:
- Name: `Industrial Cement Bags - 50kg`
- Category: `Construction & Building`
- Price: `24500`
- Quantity: `100`

Product 3:
- Name: `Organic Chili Powder - 500g`
- Category: `Spices & Seasonings`
- Price: `8500`
- Quantity: `500`

---

### TEST 4: Edit Products

**Step 4.1:** In supplier dashboard table, find a product

**Step 4.2:** Click the pencil/edit icon in the Actions column

Expected:
- ✅ Form appears with current product data populated
- ✅ Form changes to "Edit Mode"

**Step 4.3:** Change one field:
- Quantity: Change to `300`

**Step 4.4:** Click "Update Product"

Expected:
- ✅ Form closes
- ✅ Product in table shows updated quantity `300`

---

### TEST 5: Delete Products

**Step 5.1:** In supplier dashboard table, click the trash/delete icon

**Step 5.2:** Confirm deletion when prompted

Expected:
- ✅ Product disappears from table
- ✅ Product count decreases

---

### TEST 6: View Products as Buyer

**Step 6.1:** Log out (click Logout)

**Step 6.2:** Go to landing page (http://localhost:5173/)

**Step 6.3:** Verify products

Expected:
- ✅ "Featured Products" section shows 3 products
- ✅ Products now include items you just added as supplier
- ✅ Product data is accurate (names, prices, stock)

**Step 6.4:** Search for a product
- Type a product name in search bar
- Click Search

Expected:
- ✅ Redirected to `/search?q=...`
- ✅ Search functionality works (if implemented)

---

### TEST 7: Data Persistence

**Step 7.1:** Refresh the browser (F5 or Ctrl+R)

**Step 7.2:** Navigate back to supplier dashboard (log in first if needed)

Expected:
- ✅ All products still exist
- ✅ Product data hasn't changed
- ✅ Files are in `server/data/products.json`

**Step 7.3:** Check the backend file
```bash
# In a new terminal
cat server/data/products.json
```

Expected:
- ✅ JSON file contains all products
- ✅ Products include items you added
- ✅ Timestamps are recorded

---

## ✅ Validation Checklist

### Frontend Features
- [ ] Unified signup with buyer/supplier tabs
- [ ] Buyer signup form submits successfully
- [ ] Supplier signup form submits with documents
- [ ] File uploads work (citizenship, PAN/VAT docs)
- [ ] Login redirects to correct page
- [ ] Supplier sees "My Dashboard" link in navbar
- [ ] Supplier dashboard displays products
- [ ] Add product form works
- [ ] Edit product form works
- [ ] Delete product removes from list
- [ ] Landing page shows products from API
- [ ] Products display correct data
- [ ] Search functionality works

### Backend Features
- [ ] `POST /api/users` - Creates user profile
- [ ] `POST /api/products` - Creates product
- [ ] `GET /api/products` - Returns all products
- [ ] `GET /api/products/supplier/:uid` - Returns supplier's products
- [ ] `PUT /api/products/:id` - Updates product
- [ ] `DELETE /api/products/:id` - Deletes product
- [ ] File uploads save to `/server/uploads/`
- [ ] Data persists in JSON files

### Data Files
- [ ] `server/data/products.json` - Has products
- [ ] `server/data/users.json` - Has user profiles
- [ ] `server/uploads/` - Has uploaded files

---

## 🐛 Debugging Tips

### Products Not Showing on Landing Page

**Check #1: Backend Running?**
```bash
# Test API directly
curl http://localhost:4000/api/products
```
Should return JSON array of products.

**Check #2: products.json exists?**
```bash
# Windows PowerShell
Test-Path server/data/products.json
```
Should return `True`.

**Check #3: products.json has data?**
```bash
# Windows PowerShell
Get-Content server/data/products.json | ConvertFrom-Json | Measure-Object
```
Should show count > 0.

---

### File Uploads Not Working

**Check #1: uploads directory exists?**
```bash
# Windows PowerShell
Test-Path server/uploads
```
Should return `True`.

**Check #2: Form has enctype?**
The form should use `multipart/form-data` encoding (handled by FormData() in React).

**Check #3: Multer configured?**
Check `server/index.js` line ~30 for multer setup.

---

### Supplier Dashboard Not Visible

**Check #1: Logged in as supplier?**
- Navbar should show username and "My Dashboard"
- If not, re-login with supplier account

**Check #2: User role saved?**
```bash
# Check server/data/users.json
Get-Content server/data/users.json | ConvertFrom-Json
```
Should have entry with `"role": "supplier"`.

---

### Refresh Clears Products

**Problem:** Products disappear after refresh

**Solution:**
1. Check `server/data/products.json` still has data
2. Verify backend is running
3. Check browser Network tab for failed API requests
4. Restart backend server

---

## 📊 Database Files Reference

### products.json
```json
[
  {
    "id": "uuid-string",
    "uid": "supplier-firebase-uid",
    "name": "Product Name",
    "description": "...",
    "category": "...",
    "price": 1000,
    "quantity": 100,
    "image": "/uploads/filename.jpg",
    "createdAt": "2025-01-10T...",
    "updatedAt": "2025-01-10T..."
  }
]
```

### users.json
```json
[
  {
    "uid": "firebase-uid",
    "role": "buyer|supplier",
    "fullname": "Name",
    "email": "email@example.com",
    "phone": "984xxx",
    "companyName": "For suppliers only",
    "pan": "For suppliers only",
    "vat": "For suppliers only",
    "turnover": "For suppliers only",
    "established": "For suppliers only",
    "files": {
      "citizenship": "/uploads/...",
      "panVatDoc": "/uploads/...",
      "profilePhoto": "/uploads/..."
    },
    "createdAt": "2025-01-10T..."
  }
]
```

---

## 🎉 Success Indicators

✅ **You know everything works when:**

1. Landing page loads and shows 3 featured products
2. Products have real data (names, prices, stock quantities)
3. You can sign up as buyer and supplier
4. Supplier can add 3+ products
5. Products appear on landing page after being added
6. Edit product changes are reflected
7. Delete product removes it from page
8. Refreshing page keeps data intact
9. All files are in right directories
10. No errors in browser console

---

## 📱 API Endpoints Quick Reference

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/users` | Create user profile |
| GET | `/api/users/:uid` | Get user profile |
| POST | `/api/products` | Create product |
| GET | `/api/products` | Get all products |
| GET | `/api/products/supplier/:uid` | Get supplier's products |
| PUT | `/api/products/:id` | Update product |
| DELETE | `/api/products/:id` | Delete product |

---

**Estimated Testing Time:** 15-20 minutes

**Need help?** Check the `FEATURE_COMPLETE.md` for detailed documentation.

Good luck! 🚀
