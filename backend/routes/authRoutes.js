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
    transformation: [{ width: 400, height: 400, crop: 'fill', gravity: 'face' }] 
  },
});

const upload = multer({ storage: storage });


router.post('/register', upload.single('profilePhoto'), register);

router.post('/login', login);
router.post('/forgot-password', forgotPassword);



const { verifyToken } = require('../middleware/authMiddleware');
const User = require('../models/User');

router.get('/me', verifyToken, async (req, res) => {
  try {
    
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] } 
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

