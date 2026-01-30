const express = require("express");
const router = express.Router();
const adminCtrl = require("../controllers/admin.controller");
const auth = require("../../middleware/auth.middleware");

router.post("/login", adminCtrl.login);

router.get("/reports/duplicates", auth, adminCtrl.getDuplicateItems);
router.get("/reports/sexual", auth, adminCtrl.getSexualItems);

router.post("/ban", auth, adminCtrl.banUser);
router.post("/flag", auth, adminCtrl.flagUser);

module.exports = router;
