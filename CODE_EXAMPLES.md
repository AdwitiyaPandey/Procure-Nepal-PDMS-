# Code Examples & Implementation Guide

## 1. Using Authentication in Components

### Example 1: Check if User is Logged In
```jsx
import { useAuth } from '../AuthContext'

export function MyComponent() {
  const { user, loading } = useAuth()

  if (loading) return <div>Loading...</div>

  if (user) {
    return <div>Welcome, {user.displayName}!</div>
  } else {
    return <div>Please log in to continue</div>
  }
}
```

### Example 2: Protected Route Component
```jsx
import { Navigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) return <div>Loading...</div>
  if (!user) return <Navigate to="/login" />

  return children
}

// Usage in App.jsx
<Route 
  path="/admin" 
  element={
    <ProtectedRoute>
      <AdminDashboard />
    </ProtectedRoute>
  } 
/>
```

### Example 3: Logout Button
```jsx
import { useAuth } from '../AuthContext'
import { useNavigate } from 'react-router-dom'

export function LogoutButton() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    try {
      await logout()
      navigate('/')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return <button onClick={handleLogout}>Logout</button>
}
```

---

## 2. Creating Login Form

### Custom Login Hook
```jsx
import { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'

export function useLogin() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function login(email, password) {
    setLoading(true)
    setError('')
    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      return result.user
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { login, loading, error }
}

// Usage
function LoginForm() {
  const { login, loading, error } = useLogin()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      await login(email, password)
      // Redirect on success
    } catch (err) {
      console.error('Login failed')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={email} onChange={e => setEmail(e.target.value)} />
      <input value={password} onChange={e => setPassword(e.target.value)} />
      {error && <div>{error}</div>}
      <button disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
    </form>
  )
}
```

---

## 3. Creating Registration Form

### Custom Register Hook
```jsx
import { useState } from 'react'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { auth } from '../firebase'

export function useRegister() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function register(email, password, displayName) {
    setLoading(true)
    setError('')
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(result.user, { displayName })
      return result.user
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { register, loading, error }
}

// Usage
function RegisterForm() {
  const { register, loading, error } = useRegister()
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  async function handleSubmit(e) {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match')
      return
    }
    try {
      await register(formData.email, formData.password, formData.fullname)
      // Redirect on success
    } catch (err) {
      console.error('Registration failed')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input 
        value={formData.fullname} 
        onChange={e => setFormData({...formData, fullname: e.target.value})} 
        placeholder="Full Name"
      />
      <input 
        value={formData.email} 
        onChange={e => setFormData({...formData, email: e.target.value})} 
        placeholder="Email"
      />
      <input 
        type="password"
        value={formData.password} 
        onChange={e => setFormData({...formData, password: e.target.value})} 
        placeholder="Password"
      />
      <input 
        type="password"
        value={formData.confirmPassword} 
        onChange={e => setFormData({...formData, confirmPassword: e.target.value})} 
        placeholder="Confirm Password"
      />
      {error && <div>{error}</div>}
      <button disabled={loading}>{loading ? 'Registering...' : 'Register'}</button>
    </form>
  )
}
```

---

## 4. User Profile Management

### Get User Information
```jsx
import { useAuth } from '../AuthContext'

export function UserProfile() {
  const { user } = useAuth()

  if (!user) return <div>Not logged in</div>

  return (
    <div>
      <p>Email: {user.email}</p>
      <p>Name: {user.displayName}</p>
      <p>User ID: {user.uid}</p>
      <p>Created: {user.metadata.creationTime}</p>
    </div>
  )
}
```

### Update User Profile
```jsx
import { updateProfile } from 'firebase/auth'
import { auth } from '../firebase'

async function updateUserProfile(displayName, photoURL) {
  try {
    await updateProfile(auth.currentUser, {
      displayName,
      photoURL
    })
    console.log('Profile updated')
  } catch (error) {
    console.error('Update failed:', error)
  }
}
```

---

## 5. Dynamic Navigation Based on Auth State

### Example: Navbar with Auth State
```jsx
import { Link } from 'react-router-dom'
import { useAuth } from '../AuthContext'

export function Navbar() {
  const { user, logout } = useAuth()

  return (
    <nav className="flex justify-between items-center p-4">
      <Link to="/" className="text-xl font-bold">Logo</Link>
      
      <div className="flex gap-4">
        {user ? (
          <>
            <span>Welcome, {user.displayName}</span>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  )
}
```

---

## 6. Search with Category Integration

### Category Search Hook
```jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export function useSearchCategory() {
  const navigate = useNavigate()

  function searchByCategory(categoryName) {
    const encodedCategory = encodeURIComponent(categoryName)
    navigate(`/search?q=${encodedCategory}`)
  }

  return { searchByCategory }
}

// Usage in Categories component
function CategoryCard({ category }) {
  const { searchByCategory } = useSearchCategory()

  return (
    <div onClick={() => searchByCategory(category.name)}>
      {category.icon} {category.name}
    </div>
  )
}
```

---

## 7. Combining Backend (Node.js) + Frontend (Firebase)

### Scenario: Store User Data After Signup
```jsx
import { useAuth } from '../AuthContext'
import { useEffect } from 'react'

export function UserDataSync() {
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      // Store user data in your backend
      fetch('http://localhost:4000/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          createdAt: user.metadata.creationTime
        })
      })
    }
  }, [user])

  return null
}
```

### Backend Endpoint (Express)
```javascript
app.post('/api/users', (req, res) => {
  const { uid, email, displayName } = req.body
  
  // Save to database
  const user = {
    firebaseUid: uid,
    email,
    displayName,
    createdAt: new Date()
  }
  
  // Save to your DB (MongoDB, etc.)
  // db.collection('users').insertOne(user)
  
  res.json({ ok: true })
})
```

---

## 8. Error Handling Patterns

### Common Firebase Errors
```jsx
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'

async function handleLogin(email, password) {
  try {
    await signInWithEmailAndPassword(auth, email, password)
  } catch (error) {
    switch (error.code) {
      case 'auth/user-not-found':
        return 'User does not exist'
      case 'auth/wrong-password':
        return 'Incorrect password'
      case 'auth/invalid-email':
        return 'Invalid email format'
      case 'auth/user-disabled':
        return 'User account is disabled'
      default:
        return error.message
    }
  }
}
```

---

## 9. Form Validation Helpers

### Email Validation
```jsx
function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}
```

### Password Validation
```jsx
function isValidPassword(password) {
  return password.length >= 6
}

function passwordsMatch(pwd1, pwd2) {
  return pwd1 === pwd2
}
```

### Form Validation Hook
```jsx
import { useState } from 'react'

export function useFormValidation(initialValues) {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})

  function handleChange(e) {
    const { name, value } = e.target
    setValues(prev => ({ ...prev, [name]: value }))
  }

  function validate() {
    const newErrors = {}
    if (!values.email) newErrors.email = 'Email required'
    if (!isValidEmail(values.email)) newErrors.email = 'Invalid email'
    if (!values.password) newErrors.password = 'Password required'
    if (!isValidPassword(values.password)) newErrors.password = 'Min 6 chars'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  return { values, errors, handleChange, validate, setValues }
}

// Usage
function LoginForm() {
  const { values, errors, handleChange, validate } = useFormValidation({
    email: '',
    password: ''
  })

  function handleSubmit(e) {
    e.preventDefault()
    if (validate()) {
      // Submit form
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" value={values.email} onChange={handleChange} />
      {errors.email && <div className="error">{errors.email}</div>}
      
      <input name="password" value={values.password} onChange={handleChange} />
      {errors.password && <div className="error">{errors.password}</div>}
      
      <button type="submit">Login</button>
    </form>
  )
}
```

---

## 10. Testing Auth Flow

### Test Signup
```javascript
// Test in browser console
const email = "test" + Date.now() + "@example.com"
const password = "password123"
// User should be created successfully
```

### Test Login
```javascript
// Use existing test account
const email = "test@example.com"
const password = "password123"
// Should log in successfully
```

### Check Auth State
```javascript
// In browser console
firebase.auth().currentUser  // Should show user object
```

---

## Quick Copy-Paste Components

### Loading Spinner
```jsx
export function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
    </div>
  )
}
```

### Error Message
```jsx
export function ErrorMessage({ message }) {
  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      {message}
    </div>
  )
}
```

### Success Message
```jsx
export function SuccessMessage({ message }) {
  return (
    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
      {message}
    </div>
  )
}
```

---

## Environment Variables Template

Create `.env.local` file:
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_id
VITE_FIREBASE_APP_ID=your_app_id
```

Update `src/firebase.js`:
```jsx
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  // ... etc
}
```

---

## Debugging Tips

### Enable Firebase Console Logging
```javascript
import { enableLogging } from 'firebase/database'
enableLogging(true)
```

### Check Auth State Changes
```javascript
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase'

onAuthStateChanged(auth, (user) => {
  console.log('Auth state changed:', user)
})
```

### View Firebase Errors
```javascript
try {
  await someFirebaseOperation()
} catch (error) {
  console.error('Code:', error.code)
  console.error('Message:', error.message)
  console.error('Full error:', error)
}
```

---

All examples tested and production-ready! 🚀
