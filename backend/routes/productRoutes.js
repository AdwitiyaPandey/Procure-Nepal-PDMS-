const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { Product } = require('../models');
require('dotenv').config()


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});


const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'procure_nepal_products', 
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    transformation: [{ width: 800, height: 800, crop: 'limit' }] 
  },
});

const upload = multer({ storage: storage });


router.post('/add', upload.single('image'), async (req, res) => {
  try {
    const { name, description, category, price, quantity, phoneNumber, sellerId } = req.body;
    
    const imagePath = req.file ? req.file.path : null;

    const newProduct = await Product.create({ 
        name, 
        description, 
        category, 
        price: parseFloat(price), 
        quantity: parseInt(quantity), 
        phoneNumber, 
        image: imagePath,
        sellerId 
    });

    res.status(200).json({ success: true, message: "Product listed on Cloudinary!", product: newProduct });
    
  } catch (error) {
    console.error("CLOUDINARY UPLOAD ERROR:", error);
    res.status(500).json({ error: "Upload failed", details: error.message });
  }
});

module.exports = router;