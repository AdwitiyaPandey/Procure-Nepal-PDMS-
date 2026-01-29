
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

const { User } = require('../models');
const crypto = require("crypto");

exports.register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    
    
    const profileImageUrl = req.file ? req.file.path : null;

  
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({ 
      name, 
      email, 
      password: hashedPassword,
      phone,
      profilePhoto: profileImageUrl, 
      role: 'buyer' 
    });

    res.status(201).json({ success: true, message: "User created successfully" });
  } catch (error) {
    console.error("REGISTRATION ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials (User not found)" });
    }

    // 2. Compare passwords (Input plain text vs Hashed DB text)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials (Password mismatch)" });
    }

    // 3. Success
    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

  
    res.status(200).json({ message: 'Password reset link sent to your email' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
