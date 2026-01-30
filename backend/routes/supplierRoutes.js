const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const User = require('../models/User'); 


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



router.post('/upgrade-to-seller', upload.fields([
  { name: 'citizenship', maxCount: 1 },
  { name: 'profilePhoto', maxCount: 1 }
]), async (req, res) => {
  try {
    const { email, companyName, pan, vat, turnover, established } = req.body;

    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      return res.status(404).json({ ok: false, error: 'User not found' });
    }

    const citizenshipPath = req.files['citizenship'] ? req.files['citizenship'][0].path : user.citizenshipImage;
    const profilePhotoPath = req.files['profilePhoto'] ? req.files['profilePhoto'][0].path : user.profilePhoto;

   
    await user.update({
      role: 'seller',
      companyName,
      pan,
      vat,
      turnover,
      established,
      citizenshipImage: citizenshipPath,
      profilePhoto: profilePhotoPath,
      isApproved: false
    });

    res.json({ 
      ok: true, 
      message: 'Application submitted successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: 'seller'
      }
    });

  } catch (error) {
    console.error("Upgrade error:", error);
    res.status(500).json({ ok: false, error: 'Internal server error' });
  }
});


module.exports = router;