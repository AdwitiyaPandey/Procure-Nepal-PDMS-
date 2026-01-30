const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const { register, login } = require("../controllers/auth.controller");

// multer storage for verification image uploads
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, path.join(__dirname, "../../uploads"));
	},
	filename: function (req, file, cb) {
		const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
		const ext = path.extname(file.originalname);
		cb(null, file.fieldname + "-" + unique + ext);
	}
});

const upload = multer({ storage });

// Accept multipart/form-data with optional 'verification_image' file
router.post("/register", upload.single('verification_image'), register);
router.post("/login", login);

module.exports = router;
