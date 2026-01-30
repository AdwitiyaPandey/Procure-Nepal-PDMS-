const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const auth = require("../../middleware/auth.middleware");
const {
  addProduct,
  getMyProducts,
  getSupplierOrders
} = require("../controllers/supplier.controller");

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

router.post("/product", auth, upload.single('image'), addProduct);
router.get("/products", auth, getMyProducts);
router.get("/orders", auth, getSupplierOrders);

module.exports = router;
