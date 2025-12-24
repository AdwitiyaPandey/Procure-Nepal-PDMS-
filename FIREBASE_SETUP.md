# Firebase Setup Guide for Procure Nepal PDMS

## Overview
The application now uses Firebase Authentication (email/password) and includes:
- Firebase login/register functionality
- Auth state management via Context API
- Categories section on the landing page
- Protected routes and user profile display

## Prerequisites
- Firebase account (free tier available at https://firebase.google.com)
- Node.js installed

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Create a project"
3. Enter project name: `Procure-Nepal` (or your preferred name)
4. Complete setup (disable Google Analytics if you prefer)

## Step 2: Enable Authentication

1. In Firebase console, go to **Authentication** > **Sign-in method**
2. Enable **Email/Password** provider
3. Click **Save**

## Step 3: Get Your Firebase Credentials

1. In Firebase console, click the gear icon (⚙️) > **Project Settings**
2. Under "Your apps", find your web app registration
3. Copy the config object that looks like:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyA...",
  authDomain: "project-id.firebaseapp.com",
  projectId: "project-id",
  storageBucket: "project-id.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc..."
}
```

## Step 4: Update Firebase Config

1. Open `src/firebase.js`
2. Replace the `firebaseConfig` object with your credentials from Step 3
3. Save the file

## Step 5: Install Dependencies

```bash
cd d:\procureNepal\Procure-Nepal\pdms
npm install
```

This installs:
- `firebase` - Firebase SDK
- `react-router-dom` - Already in use, confirmed in dependencies

## Step 6: Run the Application

```bash
npm run dev
```

The app will start at `http://localhost:5173` (or similar port)

## Features Implemented

### 1. **User Authentication**
   - **Register Page** (`/register`) - Create new account with email/password
   - **Login Page** (`/login`) - Sign in with Firebase credentials
   - Password validation (min 6 chars, confirmation match)
   - Error messages for invalid inputs

### 2. **Auth Context**
   - Global auth state via `AuthContext` hook
   - `useAuth()` hook for accessing user data and logout
   - Automatic auth state persistence

### 3. **Landing Page Updates**
   - Navbar shows "Sign Up" and "Login" for unauthenticated users
   - Navbar shows user name and "Logout" button when authenticated
   - Categories section with 8 product categories
   - Click any category to search products by category

### 4. **Categories Section**
   - Agriculture & Food
   - Electronics & IT
   - Textiles & Apparel
   - Metal & Machinery
   - Construction Materials
   - Chemicals & Plastics
   - Handicrafts
   - Spices & Condiments

## File Structure

```
src/
├── firebase.js                 # Firebase configuration
├── AuthContext.jsx             # Auth state management
├── App.jsx                     # Updated with AuthProvider & Register route
├── component/
│   ├── Login.jsx               # Updated with Firebase auth
│   ├── Register.jsx            # New - Firebase signup
│   ├── Categories.jsx          # New - Category browsing
│   └── pages/
│       └── Landing.jsx         # Updated with Categories & auth UI
```

## Testing the Setup

1. Visit `http://localhost:5173`
2. Click **Sign Up** to create an account
3. Fill in name, email, password
4. After signup, you'll be redirected to Get Started page
5. Go back to home, you should see your name in the navbar
6. Click any category to search products
7. Click **Logout** to sign out

## Environment Variables (Optional)

If you want to use environment variables for Firebase config:

1. Create `.env` file in project root:
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_id
VITE_FIREBASE_APP_ID=your_app_id
```

2. Update `src/firebase.js`:
```javascript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  // ... etc
}
```

## Troubleshooting

**Issue: "Firebase app initialization failed"**
- Make sure Firebase credentials are correctly copied in `src/firebase.js`

**Issue: "Email already in use"**
- The email is already registered. Try logging in instead.

**Issue: "User logged in but navbar not updating"**
- Refresh the page (auth state should persist due to onAuthStateChanged)

**Issue: Categories section not showing**
- Make sure `Categories.jsx` is imported in `Landing.jsx`

## Next Steps

You can now:
1. Add role-based access control (buyer vs supplier)
2. Store user profile data in Firestore
3. Add email verification on signup
4. Implement password reset
5. Add OAuth providers (Google, GitHub, etc.)
6. Create protected routes for authenticated users only

## Security Notes

- Never commit `firebase.js` with real credentials to public repositories
- Use Environment Variables approach for production
- Enable CORS properly when making requests to your Node backend
- Add security rules to Firestore if you add it later

---

For more help: [Firebase Authentication Docs](https://firebase.google.com/docs/auth)
