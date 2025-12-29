# Firebase Authentication - Quick Reference

## 🚀 Quick Start (5 min)

### 1. Get Firebase Config
- Go to https://console.firebase.google.com
- Create project → Enable Email/Password auth → Copy config

### 2. Update Config File
Open `src/firebase.js` and paste your config

### 3. Install & Run
```bash
npm install
npm run dev
```

---

## 📁 Files Overview

| File | Purpose |
|------|---------|
| `src/firebase.js` | Firebase SDK setup |
| `src/AuthContext.jsx` | Global auth state |
| `src/App.jsx` | AuthProvider wrapper |
| `src/component/Login.jsx` | Login with Firebase |
| `src/component/Register.jsx` | Signup form |
| `src/component/pages/Landing.jsx` | Homepage with categories |
| `src/component/Categories.jsx` | Category browsing |

---

## 🔐 Using Auth in Components

### Get Current User
```jsx
import { useAuth } from '../AuthContext'

function MyComponent() {
  const { user, loading, logout } = useAuth()
  
  if (loading) return <div>Loading...</div>
  if (!user) return <div>Not logged in</div>
  
  return <div>Hello {user.displayName}</div>
}
```

### Check Auth Status
```jsx
const { user } = useAuth()
if (user) {
  // User is logged in
} else {
  // Not logged in
}
```

### Logout
```jsx
const { logout } = useAuth()
await logout()
```

---

## 🎨 Features

✅ Email/Password Authentication
✅ User Profile Display
✅ Categories Section
✅ Dynamic Navbar
✅ Form Validation
✅ Error Handling
✅ Persistent Login
✅ Logout Functionality

---

## 🔗 Routes

| Route | Component | Auth Required |
|-------|-----------|--------------|
| `/` | Landing | No |
| `/login` | Login | No |
| `/register` | Register | No |
| `/get-started` | GetStarted | No |
| `/signup/buyer` | SignupBuyer | No |
| `/signup/supplier` | SignupSupplier | No |
| `/search` | SearchResults | No |
| `/request-quote/:id` | RequestQuote | No |
| `/admin` | AdminDashboard | No* |

*Admin should be protected by checking supplier approval status

---

## 🛠️ Common Tasks

### Check if User is Logged In
```jsx
const { user } = useAuth()
const isLoggedIn = user !== null
```

### Get User Email
```jsx
const { user } = useAuth()
console.log(user?.email)
```

### Get User Display Name
```jsx
const { user } = useAuth()
console.log(user?.displayName) // Set during registration
```

### Protect a Route
```jsx
function ProtectedRoute() {
  const { user, loading } = useAuth()
  
  if (loading) return <div>Loading...</div>
  if (!user) return <Navigate to="/login" />
  
  return <YourComponent />
}
```

---

## ⚠️ Troubleshooting

**"Firebase app initialization failed"**
→ Check your Firebase config in `src/firebase.js`

**"Email already in use"**
→ Use a different email or login instead

**"User not logged in"**
→ Check browser console for auth errors

**"Categories not showing"**
→ Verify Categories.jsx is imported in Landing.jsx

---

## 📚 Resources

- [Firebase Docs](https://firebase.google.com/docs/auth)
- [React Context Docs](https://react.dev/reference/react/useContext)
- [React Router Docs](https://reactrouter.com)

---

## 🎯 Next Steps

1. Configure your Firebase project
2. Test signup/login flow
3. Verify user persists on refresh
4. Add more categories
5. Implement role-based access
6. Add Firestore for data storage
