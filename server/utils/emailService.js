import nodemailer from 'nodemailer'
import process from 'process'

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

export async function sendPasswordResetEmail(email, otpOrLink, fullname = null) {
  // If second parameter looks like an OTP (6 digits), send OTP email
  // Otherwise, send reset link email
  const isOTP = /^\d{6}$/.test(otpOrLink)

  let mailOptions
  if (isOTP) {
    // OTP email
    mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset OTP - ProcureNP',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Password Reset Request</h2>
          <p>Hello ${fullname || 'User'},</p>
          <p>We received a request to reset your password. Use the OTP below to proceed:</p>
          <div style="background-color: #f0f0f0; padding: 20px; border-radius: 5px; text-align: center; margin: 20px 0;">
            <h1 style="letter-spacing: 5px; margin: 0; color: #333;">${otpOrLink}</h1>
          </div>
          <p><strong>This OTP will expire in 10 minutes.</strong></p>
          <p style="color: #666; font-size: 12px;">If you didn't request this, please ignore this email or contact our support team.</p>
        </div>
      `,
    }
  } else {
    // Reset link email (for backwards compatibility)
    mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset - ProcureNP',
      html: `
        <h2>Password Reset Request</h2>
        <p>You requested to reset your password. Click the link below to proceed:</p>
        <a href="${otpOrLink}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
        <p>Or copy this link: ${otpOrLink}</p>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    }
  }

  try {
    await transporter.sendMail(mailOptions)
    return true
  } catch (error) {
    console.error('Email sending error:', error)
    throw error
  }
}

export async function sendWelcomeEmail(email, fullname, role) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `Welcome to ProcureNP - ${role === 'seller' ? 'Seller' : 'Buyer'}`,
    html: `
      <h2>Welcome to ProcureNP, ${fullname}!</h2>
      <p>Thank you for signing up as a ${role === 'seller' ? 'seller' : 'buyer'}.</p>
      ${
        role === 'seller'
          ? '<p>Your account is currently pending approval by our admin team. You will receive a notification once your account is verified.</p>'
          : '<p>Your account has been created successfully. You can now browse and request quotes for products.</p>'
      }
      <p>Visit our platform: ${process.env.FRONTEND_URL}</p>
    `,
  }

  try {
    await transporter.sendMail(mailOptions)
    return true
  } catch (error) {
    console.error('Email sending error:', error)
    throw error
  }
}
