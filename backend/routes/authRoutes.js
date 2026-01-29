const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { register, login, forgotPassword } = require('../controllers/authController');


const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'procure_nepal_users', 
    allowed_formats: ['jpg', 'png', 'jpeg'],
    transformation: [{ width: 400, height: 400, crop: 'fill', gravity: 'face' }] // Auto-crop to face!
  },
});

const upload = multer({ storage: storage });


router.post('/register', upload.single('profilePhoto'), register);

router.post('/login', login);
router.post('/forgot-password', forgotPassword);

module.exports = router;