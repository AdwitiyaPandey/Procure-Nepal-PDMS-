const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { User } = require('../models'); 


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
   
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
  
    const fileTypes = /jpeg|jpg|png|webp/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    if (extname) return cb(null, true);
    cb(new Error('Only images are allowed'));
  }
});


router.post('/suppliers', upload.fields([
  { name: 'citizenship', maxCount: 1 },
  { name: 'profilePhoto', maxCount: 1 }
]), async (req, res) => {
  try {
    const { fullname, email, companyName, pan, vat, turnover, established } = req.body;

    const citizenshipPath = req.files['citizenship'] ? req.files['citizenship'][0].path : null;
    const profilePhotoPath = req.files['profilePhoto'] ? req.files['profilePhoto'][0].path : null;

   
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ ok: false, error: 'User with this email already exists' });
    }

   
    const newSupplier = await User.create({
      name: fullname,
      email: email,
      role: 'supplier',
      companyName,
      pan,
      vat,
      turnover,
      established,
      citizenshipImage: citizenshipPath,
      profilePhoto: profilePhotoPath,
      isApproved: false
    });

   
    res.status(201).json({
      ok: true,
      message: 'Supplier registered successfully',
      user: {
        id: newSupplier.id,
        name: newSupplier.name,
        email: newSupplier.email,
        role: 'supplier'
      }
    });

  } catch (error) {
    console.error("Supplier Registration Error:", error);
    res.status(500).json({ ok: false, error: error.message });
  }
});

module.exports = router;