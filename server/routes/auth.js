import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../config/prisma.js'
import crypto from 'crypto'
import process from 'process'
import {
  RegisterBuyerSchema,
  RegisterSellerSchema,
  LoginSchema,
  ForgotPasswordSchema,
  ResetPasswordSchema,
} from '../utils/validationSchemas.js'
import { uploadToCloudinary } from '../utils/cloudinaryUpload.js'
import { sendPasswordResetEmail, sendWelcomeEmail } from '../utils/emailService.js'
import upload from '../middleware/upload.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

// Helper to generate JWT token
function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )
}

// Register Buyer
router.post('/register/buyer', upload.single('profilePhoto'), async (req, res) => {
  try {
    const validatedData = RegisterBuyerSchema.parse(req.body)

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    })

    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' })
    }

    // Check if phone exists
    const existingPhone = await prisma.user.findUnique({
      where: { phone: validatedData.phone },
    })

    if (existingPhone) {
      return res.status(400).json({ error: 'Phone number already registered' })
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(validatedData.password, salt)

    let profilePhotoUrl = null
    if (req.file) {
      try {
        const cloudinaryResult = await uploadToCloudinary(
          req.file.buffer,
          `buyer-${Date.now()}`,
          'procurenepal/buyers'
        )
        profilePhotoUrl = cloudinaryResult.secure_url
      } catch (uploadError) {
        console.error('Image upload failed:', uploadError)
        return res.status(400).json({ error: 'Failed to upload profile photo' })
      }
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        fullname: validatedData.fullname,
        email: validatedData.email,
        phone: validatedData.phone,
        passwordHash,
        profilePhoto: profilePhotoUrl,
        role: 'buyer',
      },
    })

    // Send welcome email
    try {
      await sendWelcomeEmail(user.email, user.fullname, 'buyer')
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError)
    }

    // Generate token
    const token = generateToken(user)

    res.status(201).json({
      token,
      user: {
        id: user.id,
        fullname: user.fullname,
        email: user.email,
        role: user.role,
        profilePhoto: user.profilePhoto,
      },
    })
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: error.errors[0].message })
    }
    console.error('Registration error:', error)
    res.status(500).json({ error: 'Failed to register' })
  }
})

// Register Seller
router.post('/register/seller', upload.single('profilePhoto'), async (req, res) => {
  try {
    // Parse and validate the seller data
    const validatedData = RegisterSellerSchema.parse(req.body)

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    })

    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' })
    }

    // Check if phone exists
    const existingPhone = await prisma.user.findUnique({
      where: { phone: validatedData.phone },
    })

    if (existingPhone) {
      return res.status(400).json({ error: 'Phone number already registered' })
    }

    // Check if PAN already exists
    const existingPAN = await prisma.supplier.findUnique({
      where: { pan: validatedData.panNumber },
    })

    if (existingPAN) {
      return res.status(400).json({ error: 'PAN already registered' })
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(validatedData.password, salt)

    let profilePhotoUrl = null
    if (req.file) {
      try {
        const cloudinaryResult = await uploadToCloudinary(
          req.file.buffer,
          `seller-${Date.now()}`,
          'procurenepal/sellers'
        )
        profilePhotoUrl = cloudinaryResult.secure_url
      } catch (uploadError) {
        console.error('Image upload failed:', uploadError)
        return res.status(400).json({ error: 'Failed to upload profile photo' })
      }
    }

    // Create user and supplier in a transaction
    const user = await prisma.user.create({
      data: {
        fullname: validatedData.fullname,
        email: validatedData.email,
        phone: validatedData.phone,
        passwordHash,
        profilePhoto: profilePhotoUrl,
        role: 'seller',
        supplier: {
            create: {
            companyName: validatedData.companyName,
            pan: validatedData.panNumber,
            vat: validatedData.vatNumber,
            turnover: validatedData.turnover,
            established: validatedData.establishedDate,
            citizenship: validatedData.citizenship,
            status: 'pending',
          },
        },
      },
      include: { supplier: true },
    })

    // Send welcome email
    try {
      await sendWelcomeEmail(user.email, user.fullname, 'seller')
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError)
    }

    // Generate token
    const token = generateToken(user)

    res.status(201).json({
      token,
      user: {
        id: user.id,
        fullname: user.fullname,
        email: user.email,
        role: user.role,
        profilePhoto: user.profilePhoto,
        supplier: user.supplier,
      },
    })
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: error.errors[0].message })
    }
    console.error('Registration error:', error)
    res.status(500).json({ error: 'Failed to register seller' })
  }
})

// Login (for both buyers and sellers)
router.post('/login', async (req, res) => {
  try {
    const validatedData = LoginSchema.parse(req.body)

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
      include: { supplier: true },
    })

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(validatedData.password, user.passwordHash)

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    // Check if seller is approved
    if (user.role === 'seller' && user.supplier && user.supplier.status !== 'approved') {
      const status = user.supplier.status
      const message =
        status === 'pending'
          ? 'Your seller account is pending approval'
          : status === 'blocked'
          ? 'Your seller account has been blocked'
          : 'Your seller account has been rejected'

      return res.status(403).json({ error: message })
    }

    // Generate token
    const token = generateToken(user)

    res.json({
      token,
      user: {
        id: user.id,
        fullname: user.fullname,
        email: user.email,
        role: user.role,
        profilePhoto: user.profilePhoto,
        supplier: user.supplier,
      },
    })
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: error.errors[0].message })
    }
    console.error('Login error:', error)
    res.status(500).json({ error: 'Failed to login' })
  }
})

// Get current user
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { supplier: true },
    })

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json({
      user: {
        id: user.id,
        fullname: user.fullname,
        email: user.email,
        role: user.role,
        profilePhoto: user.profilePhoto,
        supplier: user.supplier,
      },
    })
  } catch (error) {
    console.error('Get user error:', error)
    res.status(500).json({ error: 'Failed to fetch user' })
  }
})

// Forgot Password - Generate OTP
router.post('/forgot-password', async (req, res) => {
  try {
    const validatedData = ForgotPasswordSchema.parse(req.body)

    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
    })

    if (!user) {
      // Don't reveal if email exists for security
      return res.json({
        message: 'If an account with this email exists, an OTP has been sent',
      })
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Delete old OTP records
    await prisma.passwordReset.deleteMany({
      where: { userId: user.id },
    })

    // Store OTP (using passwordReset table, token field stores OTP)
    await prisma.passwordReset.create({
      data: {
        userId: user.id,
        token: otp, // Store OTP as plain text (it's temporary)
        expiresAt: otpExpiry,
      },
    })

    // Send OTP email
    try {
      await sendPasswordResetEmail(user.email, otp, user.fullname)
      res.json({
        message: 'An OTP has been sent to your email address',
      })
    } catch (emailError) {
      console.error('Failed to send OTP email:', emailError)
      res.status(500).json({ error: 'Failed to send OTP. Please try again.' })
    }
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: error.errors[0].message })
    }
    console.error('Forgot password error:', error)
    res.status(500).json({ error: 'Failed to process password reset' })
  }
})

// Verify OTP and Reset Password
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp, password, confirmPassword } = req.body

    // Validation
    if (!email || !otp || !password || !confirmPassword) {
      return res.status(400).json({ error: 'Email, OTP, and password are required' })
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' })
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' })
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return res.status(401).json({ error: 'Invalid email address' })
    }

    // Find OTP record
    const otpRecord = await prisma.passwordReset.findFirst({
      where: {
        userId: user.id,
        token: otp.toString(),
      },
    })

    if (!otpRecord) {
      return res.status(401).json({ error: 'Invalid OTP' })
    }

    if (otpRecord.expiresAt < new Date()) {
      return res.status(401).json({ error: 'OTP has expired. Please request a new one.' })
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, salt)

    // Update user password
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash },
    })

    // Delete OTP record
    await prisma.passwordReset.delete({
      where: { id: otpRecord.id },
    })

    res.json({
      message: 'Password reset successfully. Please login with your new password.',
    })
  } catch (error) {
    console.error('OTP verification error:', error)
    res.status(500).json({ error: 'Failed to reset password' })
  }
})

// Logout (client-side primarily, but we can invalidate token here if needed)
router.post('/logout', authenticateToken, async (req, res) => {
  // Token invalidation can be handled on client side by removing localStorage
  res.json({ message: 'Logged out successfully' })
})

export default router
